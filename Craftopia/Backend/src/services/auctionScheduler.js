const cron = require('node-cron');
const { firebase_db } = require('../config/firebase');
const sequelize = require('../config/db');
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
        console.log(`🔄 Auction scheduler running at: ${now.toISOString()}`);
        
        const auctionsRef = firebase_db.ref('auctions');
        
        const snapshot = await auctionsRef.once('value');
        const auctions = snapshot.val();
        
        if (!auctions) {
            console.log('📭 No auctions found in Firebase');
            return;
        }
        
        console.log(`🔍 Found ${Object.keys(auctions).length} auctions to check`);
        
        const updates = {};
        let updatedCount = 0;
        const startedAuctions = [];
        const endedAuctions = [];
        
        Object.keys(auctions).forEach(auctionId => {
            const auction = auctions[auctionId];
            const startDate = new Date(auction.startDate);
            const endDate = new Date(auction.endDate);
            
            console.log(`⏰ Auction ${auctionId}: Status=${auction.status}, Start=${startDate.toISOString()}, End=${endDate.toISOString()}, Now=${now.toISOString()}`);
            
            if (auction.status === 'scheduled' && now >= startDate) {
                updates[`${auctionId}/status`] = 'active';
                updatedCount++;
                startedAuctions.push({
                    auctionId,
                    ...auction
                });
                console.log(`🚀 Auction ${auctionId} started!`);
            }
            
            if (auction.status === 'active' && now >= endDate) {
                updates[`${auctionId}/status`] = 'ended';
                updatedCount++;
                endedAuctions.push({
                    auctionId,
                    ...auction
                });
                console.log(`🏁 Auction ${auctionId} ended!`);
            }
            
            // Also check already ended auctions that need order creation
            if (auction.status === 'ended' && auction.bids && !auction.orderCreated) {
                endedAuctions.push({
                    auctionId,
                    ...auction
                });
                console.log(`� Found ended auction ${auctionId} that needs order creation`);
            }
        });
        
        if (Object.keys(updates).length > 0) {
            await auctionsRef.update(updates);
            console.log(`✅ Updated ${Object.keys(updates).length} auction statuses`);
        }
        
        if (startedAuctions.length > 0) {
            console.log(`📧 Notifying followers for ${startedAuctions.length} started auctions`);
            await notifyFollowersForStartedAuctions(startedAuctions);
        }
        
        if (endedAuctions.length > 0) {
            console.log(`📦 Creating orders for ${endedAuctions.length} ended auctions`);
            await createOrdersForEndedAuctions(endedAuctions); // ✅ Correct function name
        }
        
        if (updatedCount === 0) {
            console.log('✨ No auction status updates needed');
        }
        
    } catch (error) {
        console.error('❌ Error updating auction statuses:', error);
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
      
            
            try {
                // Get bids for this auction from Firebase
                const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
                const auctionSnapshot = await auctionRef.once('value');
                const auctionData = auctionSnapshot.val();
                
                if (!auctionData) {
                    console.log(`❌ Auction data not found for ${auctionId}`);
                    continue;
                }
                
                if (!auctionData.bids) {
                    console.log(`📭 No bids found for auction ${auctionId}`);
                    continue;
                }
                
                const bids = auctionData.bids;
                
                
                // Find the highest bid (get the latest bid which should be the highest)
                const bidsArray = Object.values(bids);
                const highestBid = bidsArray[bidsArray.length - 1];
                
                if (!highestBid) {
                    console.log(`❌ No valid highest bid found for auction ${auctionId}`);
                    continue;
                }
                
                console.log(`🏆 Highest bid for auction ${auctionId}: $${highestBid.bidAmount} by customer ${highestBid.customerId}`);
                
                // Check if order already exists for this auction by checking Firebase first
                if (auctionData.orderCreated) {
                    console.log(`⚠️ Order already exists for auction ${auctionId} (orderCreated: true)`);
                    continue;
                }
                
                // Get customer information
                const customer = await Customer.findByPk(highestBid.customerId);
                if (!customer) {
                    console.error(`❌ Customer not found for auction ${auctionId}, customerId: ${highestBid.customerId}`);
                    continue;
                }
                
                // Get product information
                const product = await Product.findByPk(productId);
                if (!product) {
                    console.error(`❌ Product not found for auction ${auctionId}, productId: ${productId}`);
                    continue;
                }
                
           
                
                // Create order
                const order = await Order.create({
                    totalAmount: highestBid.bidAmount,
                    status: 'Pending',
                    customerId: customer.customerId,
                    createdAt: new Date()
                });
                
               
                
                // Create product-order relationship using raw SQL with correct column names
                await sequelize.query(`
                    INSERT INTO productorders ("orderId", "productId", quantity, "createdAt", "updatedAt")
                    VALUES (?, ?, ?, NOW(), NOW())
                `, {
                    replacements: [order.orderId, productId, 1],
                    type: sequelize.QueryTypes.INSERT
                });
                

                
                // Update product quantity to 0 since it's been sold
                await product.update({ quantity: 0 });
               
                
                // Update Firebase auction with order information
                await auctionRef.update({
                    orderId: order.orderId,
                    winnerId: highestBid.customerId,
                    winningAmount: highestBid.bidAmount,
                    orderCreated: true,
                    orderCreatedAt: new Date().toISOString()
                });
                
           
                
                // Send order confirmation email to winner
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
                        console.log(`📧 Order confirmation email sent to auction winner: ${customerUser.email}`);
                    } else {
                        console.log(`⚠️ No email found for customer ${customer.customerId}`);
                    }
                } catch (emailError) {
                    console.error(`❌ Error sending order confirmation email for auction ${auctionId}:`, emailError);
                }
                
               
                
            } catch (auctionError) {
                continue; // Continue with next auction
            }
        }
        
       
        
    } catch (error) {
        console.error('❌ Error creating orders for ended auctions:', error);
    }
};

const startAuctionScheduler = () => {
    console.log('🚀 Starting Auction Scheduler...');
    

    updateAuctionStatuses();
    

    cron.schedule('* * * * *', () => {
        updateAuctionStatuses();
    });
    
    
};

module.exports = { startAuctionScheduler, updateAuctionStatuses, createOrdersForEndedAuctions };