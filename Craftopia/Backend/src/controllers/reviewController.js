const Review = require('../models/Review');
const Product = require('../models/product');
const Customer = require('../models/customer');
const Order = require('../models/order');
const Product_Order = require('../models/Product_Order');
const { validationResult } = require('express-validator');

exports.createReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const userId = req.user.id;
        const { productId, rating, review } = req.body;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ 
                message: 'Only customers can create reviews' 
            });
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }
        const existingReview = await Review.findOne({
            where: {
                customerId: customer.customerId,
                productId: productId
            }
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'You have already reviewed this product'
            });
        }

        const hasPurchased = await Order.findOne({
            where: { 
                customerId: customer.customerId,
                status: 'Shipped'
            },
            include: [{
                model: Product,
                where: { productId: productId },
                through: Product_Order,
                required: true
            }]
        });

        if (!hasPurchased) {
            return res.status(403).json({
                message: 'You can only review products you have purchased and received'
            });
        }
        const newReview = await Review.create({
            customerId: customer.customerId,
            productId: productId,
            rating: rating,
            review: review
        });

        res.status(201).json({
            message: 'Review created successfully',
            review: newReview
        });

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        const reviews = await Review.findAll({
            where: { productId },
            include: [
                {
                    model: Customer,
                    attributes: ['name', 'username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.status(200).json({
            message: 'Reviews retrieved successfully',
            reviews: reviews,
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.updateReview = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const userId = req.user.id;
        const { productId } = req.params;
        const { rating, review } = req.body;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ 
                message: 'Only customers can update reviews' 
            });
        }
        const existingReview = await Review.findOne({
            where: {
                customerId: customer.customerId,
                productId: productId
            }
        });

        if (!existingReview) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }
        await existingReview.update({
            rating: rating,
            review: review
        });

        res.status(200).json({
            message: 'Review updated successfully',
            review: existingReview
        });

    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ 
                message: 'Only customers can delete reviews' 
            });
        }
        const existingReview = await Review.findOne({
            where: {
                customerId: customer.customerId,
                productId: productId
            }
        });

        if (!existingReview) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }
        await existingReview.destroy();

        res.status(200).json({
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.getCustomerReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ 
                message: 'Only customers can view their reviews' 
            });
        }

        const reviews = await Review.findAll({
            where: { customerId: customer.customerId },
            include: [
                {
                    model: Product,
                    attributes: ['name', 'image']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: 'Customer reviews retrieved successfully',
            reviews: reviews
        });

    } catch (error) {
        console.error('Error fetching customer reviews:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
