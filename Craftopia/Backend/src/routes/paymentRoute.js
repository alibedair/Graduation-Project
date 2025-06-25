const express = require('express');
const router = express.Router();
const paymentGateway = require('../controllers/paymentGateway');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body, param, query } = require('express-validator');

router.post('/escrow/pay/:orderId',
    authMiddleware,
    roleMiddleware(['customer']),
    [
        param('orderId').isInt().withMessage('Order ID must be an integer'),
        query('creditCardNumber').isString().notEmpty().withMessage('Credit Card Number is required and must be a string'),
        query('expiryDate').isString().notEmpty().withMessage('Expiry Date is required and must be a string'),
    ],
    paymentGateway.createEscrowPayment
);

module.exports = router;
