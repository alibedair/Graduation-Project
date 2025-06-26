const Artist = require('../models/artist');
const Sales = require('../models/sales');


exports.getArtistSalesByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

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
    exports.getallSales = async (req, res) => {
        try {
            const sales = await Artist.findAll({
                attributes: ['username', 'sales']
            });

            return res.status(200).json({
                success: true,
                message: 'All artist sales retrieved successfully',
                data: sales
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    };
exports.getSalesHistory = async (req, res) => {
    try {
        const salesHistory = await Sales.findAll({
            include: [{
                model: Artist,
                as: 'artist',
                attributes: ['username','name']
            }]
        });

        return res.status(200).json({
            success: true,
            message: 'Sales history retrieved successfully',
            data: salesHistory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}