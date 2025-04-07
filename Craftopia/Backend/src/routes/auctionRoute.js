const router = require('express').Router();
const auctionController = require('../controllers/auctionController');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/create', 
    authMiddleware,
    roleMiddleware('admin'),
    [
        body('requestId').isInt().withMessage('Request ID must be an integer'),
        body('incrementPercentage').optional().isFloat({ min: 1, max: 50 }).withMessage('Increment percentage must be between 1 and 50'),
        body('reservePrice').optional().isFloat({ min: 0 }).withMessage('Reserve price must be a positive number')
    ],
    auctionController.createAuction
);

router.get('/', 
    [
        query('status').optional().isIn(['active', 'ended']).withMessage('Status must be either active or ended'),
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
