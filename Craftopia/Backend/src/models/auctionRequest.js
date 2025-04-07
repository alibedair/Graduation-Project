const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Artist = require('./artist');
const Product = require('./product');

const AuctionRequest = sequelize.define('auctionrequest', {
    requestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    artistId: {
        type: DataTypes.INTEGER,
        references: {
            model: Artist,
            key: 'artistId'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'productId'
        }
    },
    startingPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    suggestedEndDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = AuctionRequest;