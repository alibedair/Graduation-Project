const AuctionRequest = require('../models/auctionRequest');
const Artist = require('../models/artist');
const Product = require('../models/product');
const Admin = require('../models/admin');
const { validationResult } = require('express-validator');
const { firebase_db } = require('../config/firebase');

exports.createAuctionRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const artist = await Artist.findOne({where: {userId}});
        if (!artist) {
            return res.status(403).json({message: 'Only artists can request auctions'});
        }

        const { productId, startingPrice, suggestedEndDate, notes } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if (product.artistId !== artist.artistId) {
            return res.status(403).json({ message: 'You can only request auctions for your own products' });
        }

        const auctionRequest = await AuctionRequest.create({
            artistId: artist.artistId,
            productId,
            startingPrice,
            suggestedEndDate,
            notes,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Auction request created successfully',
            requestId: auctionRequest.requestId
        });
    } catch (error) {
        console.error('Error creating auction request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMyAuctionRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const artist = await Artist.findOne({where: {userId}});
        if (!artist) {
            return res.status(403).json({message: 'Only artists can view their auction requests'});
        }

        const requests = await AuctionRequest.findAll({
            where: {artistId: artist.artistId},
            include: [{
                model: Product,
                attributes: ['productId', 'name', 'image']
            }],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(requests);
    } catch (error) {
        console.error('Error getting auction requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllAuctionRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const admin = await Admin.findOne({where: {userId}});
        if (!admin) {
            return res.status(403).json({message: 'Only admins can view all auction requests'});
        }

        const { status } = req.query;
        const whereClause = status ? { status } : {};

        const requests = await AuctionRequest.findAll({
            where: whereClause,
            include: [
                {
                    model: Product,
                    attributes: ['productId', 'name', 'image']
                },
                {
                    model: Artist,
                    attributes: ['artistId', 'name', 'username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(requests);
    } catch (error) {
        console.error('Error getting all auction requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.approveAuctionRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const admin = await Admin.findOne({where: {userId}});
        if (!admin) {
            return res.status(403).json({message: 'Only admins can approve auction requests'});
        }

        const { requestId } = req.params;
        const { adminNotes, endDate, incrementPercentage = 10, reservePrice = null } = req.body;

        const request = await AuctionRequest.findByPk(requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Auction request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: `Request is already ${request.status}` });
        }

        const product = await Product.findByPk(request.productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found for this auction request' });
        }

        const auctionsRef = firebase_db.ref('auctions');
        const newAuctionRef = auctionsRef.push();
        
        await newAuctionRef.set({
            productId: request.productId,
            artistId: request.artistId,
            startingPrice: parseFloat(request.startingPrice),
            currentPrice: parseFloat(request.startingPrice),
            endDate: endDate || request.suggestedEndDate,
            status: 'active',
            createdAt: new Date().toISOString(),
            incrementPercentage: parseFloat(incrementPercentage), 
            reservePrice: reservePrice ? parseFloat(reservePrice) : null,
            bidCount: 0,
            lastBidTime: null,
            productDetails: {
                name: product.name,
                description: product.description,
                images: product.image
            }
        });

        await request.update({
            status: 'approved',
            adminNotes
        });

        return res.status(200).json({
            message: 'Auction request approved and auction created',
            auctionId: newAuctionRef.key
        });
    } catch (error) {
        console.error('Error approving auction request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.rejectAuctionRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const admin = await Admin.findOne({where: {userId}});
        if (!admin) {
            return res.status(403).json({message: 'Only admins can reject auction requests'});
        }

        const { requestId } = req.params;
        const { adminNotes } = req.body;

        const request = await AuctionRequest.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Auction request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: `Request is already ${request.status}` });
        }

        await request.update({
            status: 'rejected',
            adminNotes
        });

        return res.status(200).json({
            message: 'Auction request rejected'
        });
    } catch (error) {
        console.error('Error rejecting auction request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};