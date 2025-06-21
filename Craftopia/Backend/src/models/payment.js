const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const customer = require('./customer');
const order = require('./order');

const Payment = sequelize.define('payment', {
    paymentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: order,
            key: 'orderId'
        }
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: customer,
            key: 'customerId'
        }
    },
    paymentDate: {
        type: DataTypes.DATE
    },
    paymentAmount: {
        type: DataTypes.DECIMAL
    }
});

module.exports = Payment;