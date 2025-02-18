const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const product = require('./product');
const customer = require('./customer');

const Review = sequelize.define('review', {
    customerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: customer,
            key: 'customerId'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: product,
            key: 'productId'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    review: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Review;