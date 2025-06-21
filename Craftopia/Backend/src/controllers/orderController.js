const Customer = require('../models/customer');
const Order = require('../models/order');
const product = require('../models/product');

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { productIds,quantity } = req.body;

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: 'Please provide a valid array of product IDs' });
        }

        const products = await product.findAll({
            where: { productId: productIds }
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: 'provide us with list of valid product' });
        }        
        var totalAmount = 0;
        for (let i = 0; i < products.length; i++) {
            const prod = products[i];
            const productQuantity = quantity[i];
            
            if (productQuantity > prod.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${prod.name}` });
            }
            totalAmount += prod.price * productQuantity;
        }

        const order = await Order.create({
            orderDate: new Date(),
            totalAmount,
            status: 'Pending',
            customerId: customer.customerId,
            trackingInfo: 'unavailable'
        });

        return res.status(201).json({
            message: 'Order placed successfully',
            order
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getmyOrders = async (req, res) => {
    try {
        const userId = req.user.id; 

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const orders = await Order.findAll({
            where: { customerId: customer.customerId },
            include: [{ model: product, as: 'products' }]
        });

        return res.status(200).json({
            message: 'Orders retrieved successfully',
            orders
        });

    } catch (error) {
        console.error('Error retrieving orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
