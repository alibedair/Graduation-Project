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
    },    status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled', 'paid', 'completed'),
        defaultValue: 'Pending'
    },
    customerId: {
        type: DataTypes.INTEGER,
        references:{
            model: Customer,
            key: 'customerId'
        }
    },
    paymentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'payments',
            key: 'paymentId'
        }
    },
    artistId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    trackingInfo: {
        type: DataTypes.ENUM("shipped", "delivered", "in transit","no tracking info"),
        defaultValue: "no tracking info"
    }
});

// Define associations
Order.associate = function(models) {
    Order.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
    });
    Order.belongsTo(models.Artist, {
        foreignKey: 'artistId',
        as: 'artist'
    });
    Order.hasMany(models.Payment, {
        foreignKey: 'orderId',
        as: 'payments'
    });
};

module.exports = Order;