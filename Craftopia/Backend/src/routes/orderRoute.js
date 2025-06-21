const router = require('express').Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');


router.post('/placeOrder',
    authMiddleware,
    roleMiddleware('customer'),
    [
        body('productIds').isArray().withMessage('Product IDs must be an array'),
        body('productIds.*').isInt().withMessage('Each product ID must be an integer'),
        body('quantity').isArray().withMessage('Quantities must be an array'),
        body('quantity.*').isInt({ min: 1 }).withMessage('Each quantity must be a positive integer')
    ],
    orderController.placeOrder
);

router.get('/myOrders',
    authMiddleware,
    roleMiddleware('customer'),
    orderController.getmyOrders
);

module.exports = router;
