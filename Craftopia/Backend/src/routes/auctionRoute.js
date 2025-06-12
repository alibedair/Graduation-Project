const router = require('express').Router();
const auctionController = require('../controllers/auctionController');
const { param, query } = require('express-validator');

router.get('/', 
    [
        query('status').optional().isIn(['active', 'ended', 'scheduled']).withMessage('Status must be active, ended, or scheduled'),
        query('category').optional().isInt().withMessage('Category ID must be an integer'),
        query('artist').optional().isInt().withMessage('Artist ID must be an integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
    ],
    auctionController.getAuctions
);

router.get('/:auctionId', 
    param('auctionId').notEmpty().withMessage('Auction ID is required'),
    auctionController.getAuctionDetails
);

module.exports = router;
