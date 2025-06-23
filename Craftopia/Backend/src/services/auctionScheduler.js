const cron = require('node-cron');
const { firebase_db } = require('../config/firebase');

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
        
        Object.keys(auctions).forEach(auctionId => {
            const auction = auctions[auctionId];
            const startDate = new Date(auction.startDate);
            const endDate = new Date(auction.endDate);
            if (auction.status === 'scheduled' && now >= startDate) {
                updates[`${auctionId}/status`] = 'active';
                updatedCount++;
            }
            if (auction.status === 'active' && now >= endDate) {
                updates[`${auctionId}/status`] = 'ended';
                updatedCount++;
            }
        });
        
        if (Object.keys(updates).length > 0) {
            await auctionsRef.update(updates);
        }
    } catch (error) {
        console.error('Error updating auction statuses:', error);
    }
};

const startAuctionScheduler = () => {
    updateAuctionStatuses();
    cron.schedule('* * * * *', () => {
        updateAuctionStatuses();
    });
};

module.exports = { startAuctionScheduler, updateAuctionStatuses };
