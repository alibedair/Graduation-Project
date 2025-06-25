const Artist = require('../models/artist');
const User = require('../models/user');
const Payment = require('../models/payment');
const Order = require('../models/order');
const Product = require('../models/product');
const Product_Order = require('../models/Product_Order');

exports.getArtistSalesByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Find artist by username
        const artist = await Artist.findOne({
            where: { username: username },
            attributes: [ 'username','sales']
        });

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Artist sales retrieved successfully',
            username: artist.username,
            sales: artist.sales
        });
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    };