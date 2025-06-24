const Customer = require('../models/customer');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Artist = require('../models/artist');
const Category = require('../models/category');

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { productId } = req.params;
        const { quantity } = req.body;

        const cartQuantity = quantity ? parseInt(quantity) : 1;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const productExists = await Product.findByPk(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

    
        const existingCartItem = await Cart.findOne({
            where: {
                customerId: customer.customerId,
                productId: productId
            }
        });

        if (existingCartItem) {
            existingCartItem.quantity += cartQuantity;
            await existingCartItem.save();
            
            return res.status(200).json({
                message: 'Product quantity updated in cart successfully',
                cartItem: existingCartItem
            });
        }

        const cartItem = await Cart.create({
            customerId: customer.customerId,
            productId: productId,
            quantity: cartQuantity
        });

        return res.status(201).json({
            message: 'Product added to cart successfully',
            cartItem
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const cartItems = await Cart.findAll({
            where: { customerId: customer.customerId },
            include: [{
                model: Product,
                include: [
                    {
                        model: Category,
                        attributes: ['name']
                    },
                    {
                        model: Artist,
                        attributes: ['name', 'username']
                    }
                ]
            }]
        });

        return res.status(200).json({
            message: 'Cart retrieved successfully',
            cartItems
        });

    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const cartItem = await Cart.findOne({
            where: {
                customerId: customer.customerId,
                productId: productId
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();

        return res.status(200).json({ message: 'Product removed from cart successfully' });

    } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const deletedCount = await Cart.destroy({
            where: { customerId: customer.customerId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Cart is already empty' });
        }

        return res.status(200).json({ 
            message: 'Cart cleared successfully',
            deletedItems: deletedCount
        });

    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};