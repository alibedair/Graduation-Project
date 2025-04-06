const firebase_db = require("../config/firebase");
const product = require("../models/product");

exports.createAuction = async (req, res) => {
    try {
        const { productId, startingPrice, endDate, incrementPercentage = 10, reservePrice = null } = req.body;
        
        if (!productId || !startingPrice || !endDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const endDateTime = new Date(endDate);
        if (isNaN(endDateTime.getTime()) || endDateTime <= new Date()) {
            return res.status(400).json({ message: 'Invalid end date. Must be a future date.' });
        }

        const auctionsRef = firebase_db.ref().child('auctions');
        
        const newAuctionRef = auctionsRef.push();
        
        await newAuctionRef.set({
            productId,
            startingPrice: parseFloat(startingPrice),
            currentPrice: parseFloat(startingPrice),
            endDate,
            status: 'active',
            createdAt: new Date().toISOString(),
            incrementPercentage, 
            bidCount: 0,
            lastBidTime: null
        });
        
        return res.status(201).json({
            message: 'Auction created successfully',
            auctionId: newAuctionRef.key
        });
    } catch (error) {
        console.error('Error creating auction:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAuctions = async (req, res) => {
    try {
        const { status, limit = 20 } = req.query;
        let query = firebase_db.ref("auctions");
        
        
        query = query.orderByChild("createdAt");
        
        const auctionsSnapshot = await query.once("value");
        const auctionsData = auctionsSnapshot.val();
        
        if (!auctionsData) {
            return res.status(200).json({ auctions: [] });
        }
        
        let auctions = Object.entries(auctionsData).map(([id, data]) => ({
            id,
            ...data
        }));
        
        if (status) {
            auctions = auctions.filter(auction => auction.status === status);
        }
        
        auctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (limit) {
            auctions = auctions.slice(0, parseInt(limit));
        }
        
        return res.status(200).json({ auctions });
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.placeBid = async (req, res) => {
    try {
        const { auctionId, userId, bidAmount } = req.body;
        
        if (!auctionId || !userId || !bidAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
        
        return firebase_db.runTransaction(auctionRef, (currentData) => {
            if (!currentData) {
                throw new Error("Auction not found");
            }
            
            if (currentData.status !== 'active') {
                throw new Error("This auction is no longer active");
            }
            
            const endTime = new Date(currentData.endDate);
            const now = new Date();
            if (now > endTime) {
                throw new Error("This auction has ended");
            }
            
            const minBidIncrement = (currentData.currentPrice * currentData.incrementPercentage) / 100;
            const minimumBid = currentData.currentPrice + minBidIncrement;
            
            if (parseFloat(bidAmount) < minimumBid) {
                throw new Error(`Bid must be at least ${minimumBid.toFixed(2)}`);
            }
            
            if (!currentData.bids) {
                currentData.bids = {};
            }
            
            const bidId = Date.now().toString();
            currentData.bids[bidId] = {
                userId,
                bidAmount: parseFloat(bidAmount),
                timestamp: now.toISOString()
            };
            
            currentData.currentPrice = parseFloat(bidAmount);
            currentData.lastBidTime = now.toISOString();
            currentData.bidCount = (currentData.bidCount || 0) + 1;
            
            const timeLeftMinutes = (endTime - now) / (1000 * 60);
            if (timeLeftMinutes < 5) {
                const newEndTime = new Date(now.getTime() + 5 * 60 * 1000);
                currentData.endDate = newEndTime.toISOString();
                currentData.autoExtended = true;
            }
            
            return currentData;
        })
        .then(() => {
            return res.status(200).json({ 
                message: "Bid placed successfully!",
                success: true
            });
        })
        .catch(error => {
            return res.status(400).json({ 
                message: error.message,
                success: false
            });
        });
        
    } catch (error) {
        console.error("Error placing bid:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAuctionDetails = async (req, res) => {
    try {
        const { auctionId } = req.params;
        
        if (!auctionId) {
            return res.status(400).json({ message: "Auction ID is required" });
        }
        
        const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
        const auctionSnapshot = await auctionRef.once("value");
        const auctionData = auctionSnapshot.val();
        
        if (!auctionData) {
            return res.status(404).json({ message: "Auction not found" });
        }
        
        const now = new Date();
        const endTime = new Date(auctionData.endDate);
        
        if (auctionData.status === 'active' && now > endTime) {
            await auctionRef.update({ status: 'ended' });
            auctionData.status = 'ended';
        }
        
        let bids = [];
        if (auctionData.bids) {
            bids = Object.entries(auctionData.bids).map(([id, bid]) => ({
                id,
                ...bid
            }));
            bids.sort((a, b) => b.bidAmount - a.bidAmount);
        }
        
        const productData = await product.findByPk(auctionData.productId);
        
        return res.status(200).json({
            auction: {
                id: auctionId,
                ...auctionData,
                bids,
                product: productData || null,
                timeRemaining: Math.max(0, endTime - now)
            }
        });
    } catch (error) {
        console.error("Error fetching auction details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
  
