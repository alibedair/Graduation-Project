const Order = require('../models/order');
const Customer = require('../models/customer');
const Artist = require('../models/artist');
const Payment = require('../models/payment');
const User = require('../models/user');
const CreditCard = require('../models/creditCard');
const Product = require('../models/product');
const Product_Order = require('../models/Product_Order');
exports.createEscrowPayment = async (req, res) => {
    try {
        const { orderId} = req.params;
        const customerId = req.user.id;
        const { creditCardNumber, expiryDate } = req.query;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }
        if (!creditCardNumber) {
            return res.status(400).json({
                success: false,
                message: 'Credit Card number is required'
            });
        }

        const creditCard = await CreditCard.findOne({ where: { number: creditCardNumber } });
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const customer = await Customer.findOne({ where: { userId: customerId } });
        if (order.customerId !== customer.customerId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to pay for this order'
            });
        }

        if (order.status === 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Order is already paid'
            });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is cancelled and cannot be paid'
            });
        }
        if (!creditCard || creditCard.expiryDate !== expiryDate) {
            await Payment.create({
                orderId: order.orderId,
                customerId: customer.customerId,
                amount: 0,
                paymentReference: creditCardNumber,
                status: 'failed',
                transactionType: 'payment'
            });
            return res.status(404).json({
                success: false,
                message: 'Credit card is invalid, payment failed',
            });
        }
        const currentDate = new Date();
        const [month, year] = creditCard.expiryDate.split('/');
        const expiryMonth = parseInt(month, 10);
        const expiryYear = parseInt('20' + year, 10);
        const cardExpiryDate = new Date(expiryYear, expiryMonth - 1); 

        if (cardExpiryDate < currentDate) {
            await Payment.create({
                orderId: order.orderId,
                customerId: customer.customerId,
                amount: 0,
                paymentReference: creditCardNumber,
                status: 'failed',
                transactionType: 'payment'
            });
            return res.status(400).json({
                success: false,
                message: 'Credit card has expired, payment failed',
            });
        }

        if (creditCard.amount < order.totalAmount) {
            await Payment.create({
                orderId: order.orderId,
                customerId: customer.customerId,
                amount: 0,
                paymentReference: creditCardNumber,
                status: 'failed',
                transactionType: 'payment'
            });
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds in credit card, payment failed',
            });
        }

        const payment = await Payment.create({
            orderId: order.orderId,
            customerId: customer.customerId,
            amount: order.totalAmount,
            paymentReference: creditCardNumber,
            status: 'held_in_escrow',
            transactionType: 'payment'
           
        });

        await creditCard.update({
            amount: creditCard.amount - order.totalAmount
        });

        await order.update({
            status: 'Completed',
            paymentId: payment.paymentId,
            updatedAt: new Date()
        });

        return res.status(201).json({
            success: true,
            message: 'Payment successful! Funds are held in escrow until order completion.',
            data: {
                paymentId: payment.paymentId,
                orderId: order.orderId,
                amount: payment.amount,
                currency: payment.currency,
                paymentReference: creditCardNumber,
                status: 'held_in_escrow',
                escrowDetails: {
                    holdPeriod: 'admin will approve the order within 7 days',
                    releaseCondition: 'Order completion or cancelled',
                    estimatedRelease: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                order: {
                    orderId: order.orderId,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Error processing escrow payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during payment processing'
        });
    }
};
exports.releaseEscrowPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.id;
        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required'
            });
        }
        const user = await User.findByPk(userId);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({
                success: false,
                message: 'User not found or unauthorized'
            });
        }

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        if (payment.status !== 'held_in_escrow') {
            return res.status(400).json({
                success: false,
                message: 'Payment is not held in escrow'
            });
        }
        const order = await Order.findByPk(payment.orderId, {
            include: [{
                model: Product,
                as: 'products',
                include: [{
                    model: Artist,
                    as: 'artist',
                    attributes: ['artistId', 'name']
                }],
            }]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        const artistSalesMap = new Map();
        for (const product of order.products) {
            const artistId = product.artist.artistId;
            
            let quantity = 0;
            
             if (product.productorder && product.productorder.quantity) {
                quantity = product.productorder.quantity;
            }

            const productTotal = parseFloat(product.price) * quantity;
            if (artistSalesMap.has(artistId)) {
                artistSalesMap.set(artistId, artistSalesMap.get(artistId) + productTotal);
            } else {
                artistSalesMap.set(artistId, productTotal);
            }
        }
        for (const [artistId, salesData] of artistSalesMap) {
            const artist = await Artist.findByPk(artistId);
            const currentSales = parseFloat(artist.sales);
            const newSales = currentSales + salesData;
            
            await Artist.update(
                { sales: newSales },
                { where: { artistId: artistId } }
            );
            
        }
        
        await payment.update({ 
            status: 'released',
            releasedAt: new Date()
        });

        return res.status(200).json({
            success: true,
            message: 'Payment released successfully and artists sales updated',
        });

    } catch (error) {
        console.error('Error releasing escrow payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during payment processing'
        });
    }
};
exports.getallpaymentsHeld = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            where: { status: 'held_in_escrow' },
        });
        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Error fetching held payments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching held payments'
        });
    }
};