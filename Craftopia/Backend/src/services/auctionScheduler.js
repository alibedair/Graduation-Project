const cron = require('node-cron');
const { firebase_db } = require('../config/firebase');
const ArtistFollow = require('../models/artistFollow');
const Artist = require('../models/artist');
const Product = require('../models/product');
const Customer = require('../models/customer');
const User = require('../models/user');
const Order = require('../models/order');
const Product_Order = require('../models/Product_Order');
const { sendAuctionStartedToFollowersEmail } = require('../utils/emailService');

const updateAuctionStatuses = async () => {
    try {
        const now = new Date();
        const auctionsRef = firebase_db.ref('auctions');
        
        const snapshot = await auctionsRef.once('value');
        const auctions = snapshot.val();
        
        if (!auctions) {
            return;
        }
        
        const updates = {};
        let updatedCount = 0;
        const startedAuctions = [];
        const endedAuctions = [];
        
        Object.keys(auctions).forEach(auctionId => {
            const auction = auctions[auctionId];
            const startDate = new Date(auction.startDate);
            const endDate = new Date(auction.endDate);
            
            if (auction.status === 'scheduled' && now >= startDate) {
                updates[`${auctionId}/status`] = 'active';
                updatedCount++;
                startedAuctions.push({
                    auctionId,
                    ...auction
                });
            }
            if (auction.status === 'active' && now >= endDate) {
                updates[`${auctionId}/status`] = 'ended';
                updatedCount++;
                endedAuctions.push({
                    auctionId,
                    ...auction
                });
            }
        });
        
        if (Object.keys(updates).length > 0) {
            await auctionsRef.update(updates);
        }
        if (startedAuctions.length > 0) {
            await notifyFollowersForStartedAuctions(startedAuctions);
        }
        if (endedAuctions.length > 0) {
            await createOrdersForEndedAuctions(endedAuctions);
        }
    } catch (error) {
        console.error('Error updating auction statuses:', error);
    }
};

const notifyFollowersForStartedAuctions = async (startedAuctions) => {
    try {
        for (const auction of startedAuctions) {
            const { auctionId, artistId, productId, startingPrice, endDate } = auction;
            
            const artist = await Artist.findByPk(artistId, {
                attributes: ['artistId', 'name', 'username']
            });
            
            if (!artist) {
                console.error(`Artist not found for auction ${auctionId}`);
                continue;
            }
            
            const product = await Product.findByPk(productId, {
                attributes: ['productId', 'name', 'image']
            });
            
            if (!product) {
                console.error(`Product not found for auction ${auctionId}`);
                continue;
            }
            
            const followers = await ArtistFollow.findAll({
                where: { artistId: artistId },
                include: [{
                    model: Customer,
                    as: 'customer',
                    attributes: ['customerId', 'name', 'userId'],
                    include: [{
                        model: User,
                        attributes: ['email']
                    }]
                }]
            });

            const auctionDetails = {
                productName: product.name,
                artistName: artist.name,
                startingPrice: startingPrice,
                endDate: endDate,
                auctionId: auctionId,
                productImage: product.image && product.image.length > 0 ? product.image[0] : null
            };
            
            const emailPromises = followers.map(follow => {
                if (follow.customer && follow.customer.user && follow.customer.user.email) {
                    return sendAuctionStartedToFollowersEmail(
                        follow.customer.user.email,
                        follow.customer.name,
                        auctionDetails
                    ).catch(error => {
                        console.error(`Failed to send auction notification to ${follow.customer.user.email}:`, error);
                        return false;
                    });
                }
                return Promise.resolve(false);
            });
            const results = await Promise.all(emailPromises);
            const successCount = results.filter(result => result === true).length;
        }
    } catch (error) {
        console.error('Error notifying followers for started auctions:', error);
    }
};

const createOrdersForEndedAuctions = async (endedAuctions) => {
    try {
        for (const auction of endedAuctions) {
            const { auctionId, productId } = auction;
            
            const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
            const auctionSnapshot = await auctionRef.once('value');
            const auctionData = auctionSnapshot.val();
            
            if (!auctionData || !auctionData.bids) {
                console.log(`No bids found for auction ${auctionId}`);
                continue;
            }
            
            const bids = auctionData.bids;
            
            const bidsArray = Object.values(bids);
            const highestBid = bidsArray[bidsArray.length - 1];
            
            if (!highestBid) {
                console.log(`No valid highest bid found for auction ${auctionId}`);
                continue;
            }
            
            const existingOrder = await Order.findOne({
                where: { customerId: highestBid.customerId },
                include: [{
                    model: Product,
                    where: { productId: productId },
                    through: { attributes: [] }
                }],
                order: [['createdAt', 'DESC']]
            });
            
            if (existingOrder) {
                console.log(`Order already exists for auction ${auctionId}, customer ${highestBid.customerId}`);
                continue;
            }
            
            // Get customer information
            const customer = await Customer.findByPk(highestBid.customerId);
            if (!customer) {
                console.error(`Customer not found for auction ${auctionId}, customerId: ${highestBid.customerId}`);
                continue;
            }
            
            // Get product information
            const product = await Product.findByPk(productId);
            if (!product) {
                console.error(`Product not found for auction ${auctionId}, productId: ${productId}`);
                continue;
            }
            
            // Create order
            const order = await Order.create({
                totalAmount: highestBid.bidAmount,
                status: 'Pending',
                customerId: customer.customerId,
                createdAt: new Date()
            });
            
            await Product_Order.create({
                orderId: order.orderId,
                productId: productId,
                quantity: 1 
            });
            
            await product.update({ quantity: 0 });
            
            await auctionRef.update({
                orderId: order.orderId,
                winnerId: highestBid.customerId,
                winningAmount: highestBid.bidAmount,
                orderCreated: true,
                orderCreatedAt: new Date().toISOString()
            });
            
            console.log(`Successfully created order ${order.orderId} for auction ${auctionId}`);
            
           
            try {
                const customerUser = await User.findByPk(customer.userId);
                if (customerUser && customerUser.email) {
                    const { sendOrderConfirmationEmail } = require('../utils/emailService');
                    const orderDetails = {
                        orderId: order.orderId,
                        totalAmount: parseFloat(highestBid.bidAmount || 0).toFixed(2),
                        orderDate: order.createdAt,
                        isAuction: true,
                        products: [{
                            name: product.name,
                            price: parseFloat(highestBid.bidAmount || 0).toFixed(2),
                            quantity: 1,
                            isAuctionWin: true
                        }],
                        auctionDetails: {
                            auctionId: auctionId,
                            finalPrice: parseFloat(highestBid.bidAmount || 0).toFixed(2)
                        }
                    };

                    await sendOrderConfirmationEmail(customerUser.email, customerUser.name || 'Valued Customer', orderDetails);
                    console.log(`Order confirmation email sent to auction winner: ${customerUser.email}`);
                }
            } catch (emailError) {
                console.error('Error sending order confirmation email for auction:', emailError);
            }
        }
    } catch (error) {
        console.error('Error creating orders for ended auctions:', error);
    }
};

const startAuctionScheduler = () => {
    updateAuctionStatuses();
    cron.schedule('* * * * *', () => {
        updateAuctionStatuses();
    });
};

module.exports = { startAuctionScheduler, updateAuctionStatuses, createOrdersForEndedAuctions };
