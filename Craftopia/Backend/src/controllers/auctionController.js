const { firebase_db } = require("../config/firebase");
const Product = require("../models/product");
const Artist = require("../models/artist");
const Admin = require("../models/admin");
const AuctionRequest = require("../models/auctionRequest");
const { validationResult } = require('express-validator');

exports.createAuction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const userId = req.user.id;
        const admin = await Admin.findOne({where: {userId}});
        
        if (!admin) {
            return res.status(403).json({ message: 'Only admins can create auctions' });
        }
        
        const { requestId, startDate, endDate } = req.body;
        
        const auctionRequest = await AuctionRequest.findByPk(requestId, {
            include: [{ model: Product }]
        });
        
        if (!auctionRequest) {
            return res.status(404).json({ message: 'Auction request not found' });
        }
        
        if (auctionRequest.status !== 'approved') {
            return res.status(403).json({ message: 'Only approved auction requests can be used to create auctions' });
        }
        
        let product = auctionRequest.Product;
        if (!product) {
            const productData = await Product.findByPk(auctionRequest.productId);
            if (!productData) {
                return res.status(404).json({ message: 'Product not found for this auction request' });
            }
            product = productData;
        }
        
        // Validate dates
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        const now = new Date();
        
        if (isNaN(startDateTime.getTime()) || startDateTime < now) {
            return res.status(400).json({ message: 'Invalid start date. Must be a future date.' });
        }
        
        if (isNaN(endDateTime.getTime()) || endDateTime <= startDateTime) {
            return res.status(400).json({ message: 'Invalid end date. Must be after the start date.' });
        }

        const auctionsRef = firebase_db.ref('auctions');
        const newAuctionRef = auctionsRef.push();
        
        await newAuctionRef.set({
            productId: auctionRequest.productId,
            artistId: auctionRequest.artistId,
            requestId: auctionRequest.requestId,
            startingPrice: parseFloat(auctionRequest.startingPrice),
            currentPrice: parseFloat(auctionRequest.startingPrice),
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            incrementPercentage: auctionRequest.incrementPercentage || 10, 
            reservePrice: auctionRequest.reservePrice || null,
            bidCount: 0,
            lastBidTime: null,
            productDetails: {
                name: product.name,
                description: product.description,
                images: product.image
            }
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
        const { status, category, artist, limit = 20, page = 1 } = req.query;
        
        const auctionsSnapshot = await firebase_db.ref("auctions").once("value");
        const auctionsData = auctionsSnapshot.val() || {};
        
        let auctions = Object.entries(auctionsData).map(([id, data]) => ({
            id,
            ...data
        }));
        
        const now = new Date();
        auctions = auctions.map(auction => {
            if (auction.status === 'active' && new Date(auction.endDate) <= now) {
                firebase_db.ref(`auctions/${auction.id}`).update({ status: 'ended' });
                return { ...auction, status: 'ended' };
            }
            return auction;
        });
        
        if (status) {
            auctions = auctions.filter(auction => auction.status === status);
        }
        
        if (category) {
            const products = await Product.findAll({ where: { categoryId: category } });
            const productIds = products.map(p => p.productId.toString());
            auctions = auctions.filter(auction => productIds.includes(auction.productId.toString()));
        }
        
        if (artist) {
            auctions = auctions.filter(auction => auction.artistId.toString() === artist);
        }
        
        auctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedAuctions = auctions.slice(startIndex, endIndex);
        
        return res.status(200).json({ 
            auctions: paginatedAuctions,
            totalCount: auctions.length,
            page: parseInt(page),
            totalPages: Math.ceil(auctions.length / limit)
        });
    } catch (error) {
        console.error("Error fetching auctions:", error);
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
        
        let productData = auctionData.productDetails;
        if (!productData) {
            const product = await Product.findByPk(auctionData.productId);
            productData = product || null;
        }
        
        return res.status(200).json({
            auction: {
                id: auctionId,
                ...auctionData,
                bids,
                product: productData,
                timeRemaining: Math.max(0, endTime - now),
                isEnded: now > endTime
            }
        });
    } catch (error) {
        console.error("Error fetching auction details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};