const router = require('express').Router();
const auctionController = require('../controllers/auctionController');
const { body, param } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', 
    authMiddleware,
    [
        body('productId').isInt().withMessage('Product ID must be an integer'),
        body('startingPrice').isFloat({ min: 0 }).withMessage('Starting price must be a positive number'),
        body('endDate').isISO8601().withMessage('End date must be a valid date')
    ],
    auctionController.createAuction
);

router.get('/', auctionController.getAuctions);

router.post('/bid', 
    authMiddleware,
    [
        body('auctionId').notEmpty().withMessage('Auction ID is required'),
        body('bidAmount').isFloat({ min: 0 }).withMessage('Bid amount must be a positive number')
    ],
    auctionController.placeBid
);

router.get('/:auctionId', 
    param('auctionId').notEmpty().withMessage('Auction ID is required'),
    auctionController.getAuctionDetails
);

module.exports = router;
