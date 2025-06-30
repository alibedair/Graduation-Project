const Customer = require('../models/customer');
const Order = require('../models/order');
const product = require('../models/product');
const Product_Order = require('../models/Product_Order');
const User = require('../models/user');
const CustomizationResponse = require('../models/customizationResponse');
const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const { sendOrderConfirmationEmail, sendShipAuctionEmail, sendCustomizationShipEmail } = require('../utils/emailService');
const { firebase_db } = require('../config/firebase');
const Review = require('../models/Review'); 
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
            await prod.update({ quantity: prod.quantity - productQuantity });
        }

        const order = await Order.create({
            createdAt: new Date(),
            totalAmount,
            customerId: customer.customerId
        });

        const productOrderData = [];
        
        for (let i = 0; i < products.length; i++) {
            productOrderData.push({
                orderId: order.orderId,
                productId: products[i].productId,
                quantity: quantity[i]
            });
            
        }
        
        await Product_Order.bulkCreate(productOrderData);
        

        try {
            const user = await User.findByPk(userId);
            if (user && user.email) {
                const orderDetails = {
                    orderId: order.orderId,
                    totalAmount: parseFloat(totalAmount || 0).toFixed(2),
                    orderDate: order.orderDate,
                    products: products.map((product, index) => ({
                        name: product.name,
                        price: parseFloat(product.price || 0).toFixed(2),
                        quantity: quantity[index]
                    }))
                };
                
                await sendOrderConfirmationEmail(user.email, 'Valued Customer', orderDetails);
            }
        } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
        }

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
            include: [{ 
                model: product,
                attributes: ['productId', 'name', 'price', 'description', 'image'],
                through: { 
                    attributes: ['quantity']
                }
            }]
        });
        for (const order of orders) {
            for (const prod of order.products) {
                const existingReview = await Review.findOne({
                    where: {
                        productId: prod.productId,
                        customerId: customer.customerId
                    }
                });
                prod.dataValues.reviewed = !!existingReview;
            }
        }

        return res.status(200).json({
            message: 'Orders retrieved successfully',
            orders
        });

    } catch (error) {
        console.error('Error retrieving orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ message: 'Customer not found' });
        }

        const order = await Order.findOne({
            where: { 
                orderId: orderId,
                customerId: customer.customerId 
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }        
        if (order.status === 'Pending') {
            await order.update({ status: 'Cancelled' });
            const productOrders = await Product_Order.findAll({
                where: { orderId: order.orderId }
            });
            for (const productOrder of productOrders) {
                const prod = await product.findByPk(productOrder.productId);
                if (prod) {
                    await prod.update({ quantity: prod.quantity + productOrder.quantity });
                }
            }
            return res.status(200).json({
                message: 'Order cancelled successfully',
                order
            });
        } else {
            return res.status(400).json({ message: 'Order cannot be cancelled as it is cancelled or completed before' });
        }

    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const customer = await Customer.findOne({ where: { userId } });
    if (!customer) {
      return res.status(403).json({ message: 'Customer not found' });
    }

    const order = await Order.findOne({
      where: {
        orderId,
        customerId: customer.customerId,
      },
      include: [
        {
          model: product,
          attributes: ['productId', 'name', 'price', 'description', 'image'],
          through: {
            attributes: ['quantity']
          }
        },
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      message: 'Order retrieved successfully',
      order
    });

  } catch (error) {
    console.error('Error retrieving order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.shipOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {respondId} = req.params;
        const respond = await CustomizationResponse.findByPk(respondId);
        const request = await CustomizationRequest.findByPk(respond.requestId);
        if (!respond) {
            return res.status(404).json({ message: 'Customization response not found' });
        }
        if (respond.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Customization response is not accepted' });
        }
        const artist = await Artist.findOne({ where: { userId } });
        const realArtist = await Artist.findByPk(respond.artistId);
        if (artist.artistId !== realArtist.artistId) {
            return res.status(403).json({ message: 'this Artist is not authorized for shipping this order' });
        }
        let order = await Order.findOne({ where: { orderId: request.orderId } });
        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(order.status === 'Shipped' || order.status === 'Completed') {
            return res.status(400).json({ message: 'Order has already been shipped or completed' });
        }
        order.status = 'Shipped';
        order.shippedAt = new Date();
        await order.save();
        try{
            const customer = await Customer.findByPk(request.customerId);
            const customerUser = await User.findByPk(customer.userId);

            if (customerUser && customerUser.email) {
                const orderDetails = {
                    orderId: order.orderId,
                    totalAmount: parseFloat(respond.price || 0).toFixed(2),
                    orderDate: order.createdAt,
                    trackingNumber: `TR${order.orderId}${Date.now()}`,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    customizationResponse: {
                        customizationId: respond.customizationId,
                        responseId: respond.respondId,
                        status: respond.status,
                        price: parseFloat(respond.price || 0).toFixed(2)
                    }
                };
                
                await sendCustomizationShipEmail(customerUser.email, customerUser.name || 'Valued Customer', orderDetails);
            }
        } catch (emailError) {
            console.error('Error sending order ship email:', emailError);
        }
        return res.status(200).json({
            message: 'Order shipped successfully',
            order: {
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Error shipping order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.shipAuctionOrder = async(req, res) => {
    try{
        const userId = req.user.id;
        const { auctionId } = req.params;
        const auctionSnapshot = await firebase_db.ref(`auctions/${auctionId}`).once('value');
        if (!auctionSnapshot.exists()) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        const auctionData = auctionSnapshot.val();
        const artist = await Artist.findOne({ where: { userId } });
        if(!artist || auctionData.artistId !== artist.artistId) {
            return res.status(403).json({ message: 'This Artist is not authorized for shipping this auction order' });
        }
        const currentTime = new Date().toISOString();
        if(!auctionData.endDate || auctionData.endDate > currentTime) {
            return res.status(400).json({ message: 'Auction has not ended yet' });
        }

        const bidsSnapshot = await firebase_db.ref(`auctions/${auctionId}/bids`).once('value');
        if (!bidsSnapshot.exists()) {
            return res.status(400).json({ message: 'No bids found for this auction' });
        }
        const bidsData = bidsSnapshot.val();
        const bidsArray = Object.values(bidsData);
        
        if (bidsArray.length === 0) {
            return res.status(400).json({ message: 'No bids found for this auction' });
        }
        const highestBid = bidsArray[bidsArray.length - 1];
        const customer = await Customer.findByPk(highestBid.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Winner customer not found' });
        }

        const order = await Order.create({
            createdAt: new Date(),
            totalAmount: highestBid.bidAmount,
            status: 'Shipped',
            customerId: customer.customerId  
        });
        try {
            const customerUser = await User.findByPk(customer.userId);
            if (customerUser && customerUser.email) {
                const orderDetails = {
                    orderId: order.orderId,
                    totalAmount: parseFloat(highestBid.bidAmount || 0).toFixed(2),
                    orderDate: order.createdAt,
                    trackingNumber: `TR${order.orderId}${Date.now()}`,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    isAuction: true,
                    auctionDetails: {
                        auctionId: auctionId,
                        productName: auctionData.productDetails?.name || auctionData.productName || 'Auction Item',
                        finalPrice: parseFloat(highestBid.bidAmount || 0).toFixed(2),
                        winningBid: {
                            bidId: highestBid.bidId || 'N/A',
                            timestamp: highestBid.timestamp
                        }
                    }
                };
                
                await sendShipAuctionEmail(customerUser.email, customerUser.name || 'Valued Customer', orderDetails);
            }
        } catch (emailError) {
            console.error('Error sending auction ship email:', emailError);
        }
        
        await firebase_db.ref(`auctions/${auctionId}`).update({
            status: 'shipped',
            shippedAt: new Date().toISOString(),
            orderId: order.orderId,
            winnerId: highestBid.customerId,
            winningAmount: highestBid.bidAmount
        });
        
        return res.status(200).json({
            message: 'Auction order shipped successfully',
            order: {
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt,
                auctionId: auctionId
            }
        });

    }catch (error) {
        console.error('Error shipping auction order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
