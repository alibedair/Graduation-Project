const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const reviewController = require('../controllers/reviewController');
const { body, param } = require('express-validator');

router.post('/create', 
    authMiddleware,
    roleMiddleware(['customer']),
    [
        body('productId').isInt().withMessage('Product ID must be an integer'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('review').notEmpty().withMessage('Review text is required')
            .isLength({ min: 10, max: 500 }).withMessage('Review must be between 10 and 500 characters')
    ],
    reviewController.createReview
);
router.get('/getreview/:productId', 
    [
        param('productId').isInt().withMessage('Product ID must be an integer')
    ],
    reviewController.getProductReviews
);
router.put('/updatereview/:productId', 
    authMiddleware,
    roleMiddleware(['customer']),
    [
        param('productId').isInt().withMessage('Product ID must be an integer'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('review').notEmpty().withMessage('Review text is required')
            .isLength({ min: 10, max: 500 }).withMessage('Review must be between 10 and 500 characters')
    ],
    reviewController.updateReview
);
router.delete('/deletereview/:productId', 
    authMiddleware,
    roleMiddleware(['customer']),
    [
        param('productId').isInt().withMessage('Product ID must be an integer')
    ],
    reviewController.deleteReview
);
router.get('/my-reviews', 
    authMiddleware,
    roleMiddleware(['customer']),
    reviewController.getCustomerReviews
);

module.exports = router;
