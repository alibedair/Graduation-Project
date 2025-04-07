const router = require('express').Router();
const auctionRequestController = require('../controllers/auctionRequestController');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/create', 
    authMiddleware,
    roleMiddleware('artist'),
    [
        body('productId').isInt().withMessage('Product ID must be an integer'),
        body('startingPrice').isFloat({ min: 0 }).withMessage('Starting price must be a positive number'),
        body('suggestedEndDate').isISO8601().withMessage('Suggested end date must be a valid date'),
        body('notes').optional().isString().withMessage('Notes must be a string')
    ],
    auctionRequestController.createAuctionRequest
);

router.get('/my-requests', 
    authMiddleware,
    roleMiddleware('artist'),
    auctionRequestController.getMyAuctionRequests
);

router.get('/all', 
    authMiddleware,
    roleMiddleware('admin'),
    [
        query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
    ],
    auctionRequestController.getAllAuctionRequests
);

router.post('/approve/:requestId', 
    authMiddleware,
    roleMiddleware('admin'),
    [
        param('requestId').isInt().withMessage('Request ID must be an integer'),
        body('adminNotes').optional().isString().withMessage('Admin notes must be a string'),
        body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
        body('incrementPercentage').optional().isFloat({ min: 1, max: 50 }).withMessage('Increment percentage must be between 1 and 50'),
        body('reservePrice').optional().isFloat({ min: 0 }).withMessage('Reserve price must be a positive number')
    ],
    auctionRequestController.approveAuctionRequest
);

router.post('/reject/:requestId', 
    authMiddleware,
    roleMiddleware('admin'),
    [
        param('requestId').isInt().withMessage('Request ID must be an integer'),
        body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
    ],
    auctionRequestController.rejectAuctionRequest
);

module.exports = router;