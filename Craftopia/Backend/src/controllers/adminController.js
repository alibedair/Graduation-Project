const Admin = require('../models/admin');
const User = require('../models/user');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const Product = require('../models/product');
const AuctionRequest = require('../models/auctionRequest');
const { firebase_db } = require('../config/firebase');
const { validationResult } = require('express-validator');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const admin = await Admin.findOne({ where: { userId } });
        
        if (!admin) {
            return res.status(404).json({ message: "Admin profile not found" });
        }
        
        return res.status(200).json({ admin });
    } catch (error) {
        console.error("Error getting admin profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const user = await User.findOne({ where: { userId } });
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        
        const { name, username, phone } = req.body;
        
        if (!name || !username || !phone) {
            return res.status(400).json({
                message: "Please fill all required fields",
                required: ['name', 'username', 'phone']
            });
        }
        
        const existingAdmin = await Admin.findOne({ where: { userId } });
        
        if (existingAdmin) {
            if (existingAdmin.username !== username) {
                const usernameExists = await Admin.findOne({ where: { username } });
                if (usernameExists) {
                    return res.status(400).json({ message: "Username already exists" });
                }
            }
            
            await existingAdmin.update({ name, username, phone });
            return res.status(200).json({ admin: existingAdmin });
        } else {
            const usernameExists = await Admin.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already exists" });
            }
            
            const newAdmin = await Admin.create({ name, username, phone, userId });
            return res.status(201).json({ admin: newAdmin });
        }
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ where: { userId } });
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }
        
        const [
            artistCount,
            customerCount,
            productCount,
            pendingAuctionRequests
        ] = await Promise.all([
            Artist.count(),
            Customer.count(),
            Product.count(),
            AuctionRequest.count({ where: { status: 'pending' } })
        ]);
        
        let auctionCount = 0;
        try {
            const auctionsRef = firebase_db.ref('auctions');
            const snapshot = await auctionsRef.once('value');
            const auctionsData = snapshot.val();
            auctionCount = auctionsData ? Object.keys(auctionsData).length : 0;
        } catch (firebaseError) {
            console.error('Firebase error:', firebaseError);
        }
        
        return res.status(200).json({
            message: "Dashboard statistics retrieved successfully",
            stats: {
                totalUsers: artistCount + customerCount,
                totalArtists: artistCount,
                totalCustomers: customerCount,
                totalProducts: productCount,
                totalAuctions: auctionCount,
                pendingAuctionRequests: pendingAuctionRequests
            }
        });
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};