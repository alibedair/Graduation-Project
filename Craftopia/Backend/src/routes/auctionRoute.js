const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
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
    authMiddleware,
    param('auctionId').notEmpty().withMessage('Auction ID is required'),
    auctionController.getAuctionDetails
);

router.get('/product/:auctionId', 
    param('auctionId').notEmpty().withMessage('Auction ID is required'),
    auctionController.getAuctionProduct
);

module.exports = router;
