const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer');
const Order = sequelize.define('order', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },    
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
    },
    customerId: {
        type: DataTypes.INTEGER,
        references:{
            model: Customer,
            key: 'customerId'
        }
    },    
    trackingInfo: {
        type: DataTypes.ENUM("shipped", "delivered", "in transit"),
        allowNull: true
    },
    PaymentStatus: {
        type: DataTypes.ENUM('Payment_Held', 'Paid', 'Failed', 'Refunded'),
        allowNull: true
    },
    paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Order;