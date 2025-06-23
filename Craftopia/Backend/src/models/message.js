const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const CustomizationRequest = require('./customizationRequest');
const Customer = require('./customer');
const Artist = require('./artist');

const Message = sequelize.define('message', {
    messageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CustomizationRequest,
            key: 'requestId'
        }
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    senderType: {
        type: DataTypes.ENUM('customer', 'artist'),
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiverType: {
        type: DataTypes.ENUM('customer', 'artist'),
        allowNull: false,
    },
    messageContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true, 
    indexes: [
        {
            fields: ['requestId']
        },
        {
            fields: ['senderId', 'senderType']
        },
        {
            fields: ['receiverId', 'receiverType']
        },
        {
            fields: ['isRead']
        },
        {
            fields: ['createdAt']
        }
    ]
});

module.exports = Message;
