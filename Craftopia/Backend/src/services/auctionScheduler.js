const cron = require('node-cron');
const { firebase_db } = require('../config/firebase');
const ArtistFollow = require('../models/artistFollow');
const Artist = require('../models/artist');
const Product = require('../models/product');
const Customer = require('../models/customer');
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
            }
        });
        
        if (Object.keys(updates).length > 0) {
            await auctionsRef.update(updates);
        }
        if (startedAuctions.length > 0) {
            await notifyFollowersForStartedAuctions(startedAuctions);
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
                attributes: ['productId', 'name', 'images']
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
                    attributes: ['customerId', 'name', 'email']
                }]
            });
            
            if (followers.length === 0) {
                console.log(`No followers found for artist ${artist.name} (auction ${auctionId})`);
                continue;
            }

            const auctionDetails = {
                productName: product.name,
                artistName: artist.name,
                startingPrice: startingPrice,
                endDate: endDate,
                auctionId: auctionId,
                productImage: product.images && product.images.length > 0 ? product.images[0] : null
            };
            
            const emailPromises = followers.map(follow => {
                if (follow.customer && follow.customer.email) {
                    return sendAuctionStartedToFollowersEmail(
                        follow.customer.email,
                        follow.customer.name,
                        auctionDetails
                    ).catch(error => {
                        console.error(`Failed to send auction notification to ${follow.customer.email}:`, error);
                        return false;
                    });
                }
                return Promise.resolve(false);
            });
            const results = await Promise.all(emailPromises);
            const successCount = results.filter(result => result === true).length;
            
            console.log(`Auction ${auctionId} started: Notified ${successCount}/${followers.length} followers of artist ${artist.name}`);
        }
    } catch (error) {
        console.error('Error notifying followers for started auctions:', error);
    }
};

const startAuctionScheduler = () => {
    updateAuctionStatuses();
    cron.schedule('* * * * *', () => {
        updateAuctionStatuses();
    });
};

module.exports = { startAuctionScheduler, updateAuctionStatuses };
