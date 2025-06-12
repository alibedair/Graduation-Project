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

        const { productId, startingPrice, Duration, notes } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if (product.artistId !== artist.artistId) {
            return res.status(403).json({ message: 'You can only request auctions for your own products' });
        }        const auctionRequest = await AuctionRequest.create({
            artistId: artist.artistId,
            productId,
            startingPrice,
            suggestedDuration: Duration,
            notes,
            status: 'pending'
        });
        return res.status(201).json({
            message: 'Auction request created successfully',
            requestId: auctionRequest.requestId,
            productId: productId,
            artistId: artist.artistId
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

exports.approveAndScheduleAuction = async (req, res) => {
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

        const requestId = req.params.requestId;
        if (!requestId) {
            return res.status(400).json({ message: 'Request ID is required' });
        }
        
        const { startDate, Duration, adminNotes } = req.body;        
        const auctionRequest = await AuctionRequest.findByPk(requestId, {
            include: [{ 
                model: Product,
                required: false
            }]
        });
        
        if (!auctionRequest) {
            return res.status(404).json({ message: 'Auction request not found' });
        }
        
        if (auctionRequest.status !== 'pending') {
            return res.status(400).json({ message: `Request is already ${auctionRequest.status}` });
        }
        let product = auctionRequest.Product;
        if (!product && auctionRequest.productId) {
            product = await Product.findByPk(auctionRequest.productId);
        }
        
        if (!product) {
            return res.status(404).json({ 
                message: `Product with ID ${auctionRequest.productId} not found. The product may have been deleted.` 
            });
        }        const durationHours = Duration || auctionRequest.suggestedDuration;
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000);
        const now = new Date();
        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({ message: 'Invalid start date format.' });
        }
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        if (startDateTime < oneHourAgo) {
            return res.status(400).json({ 
                message: 'Please choose a current or future date.' 
            });
        }
        if (isNaN(endDateTime.getTime()) || endDateTime <= startDateTime) {
            return res.status(400).json({ message: 'Invalid duration. Must result in a future end date.' });
        }const auctionRef = firebase_db.ref('auctions');
        const newAuctionRef = auctionRef.push();
        const initialStatus = startDateTime <= now ? 'active' : 'scheduled';
        await newAuctionRef.set({
            productId: auctionRequest.productId,
            artistId: auctionRequest.artistId,
            requestId: auctionRequest.requestId,
            startingPrice: parseFloat(auctionRequest.startingPrice),
            currentPrice: parseFloat(auctionRequest.startingPrice),
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            status: initialStatus,
            createdAt: new Date().toISOString(),
            bidCount: 0,
            lastBidTime: null,
            productDetails: {
                name: product.name,
                description: product.description,
                image: product.image
            }
        });
        
        await auctionRequest.update({
            status: 'scheduled',
            scheduledStartDate: startDateTime,
            scheduledEndDate: endDateTime,
            auctionId: newAuctionRef.key,
            adminNotes: adminNotes || null
        });        
        return res.status(201).json({
            message: 'Auction request approved and auction scheduled successfully',
            auctionId: newAuctionRef.key,
            status: initialStatus,
            scheduledStartDate: startDateTime.toISOString(),
            scheduledEndDate: endDateTime.toISOString(),
            durationUsed: Duration ? 'admin-specified' : 'artist-suggested',
            durationHours: durationHours
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
            return res.status(400).json({ errors: errors.array() });        }
        
        const requestId = req.params.requestId;
        const { adminNotes } = req.body;
        
        if (!requestId) {
            return res.status(400).json({ message: 'Request ID is required' });
        }
        
        const auctionRequest = await AuctionRequest.findByPk(requestId);
        
        if (!auctionRequest) {
            return res.status(404).json({ message: 'Auction request not found' });
        }
        
        if (auctionRequest.status !== 'pending') {
            return res.status(400).json({ message: `Request is already ${auctionRequest.status}` });
        }
        
        await auctionRequest.update({
            status: 'rejected',
            adminNotes: adminNotes || null
        });
        
        return res.status(200).json({
            message: 'Auction request rejected successfully',
            requestId: auctionRequest.requestId
        });
    } catch (error) {
        console.error('Error rejecting auction request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};