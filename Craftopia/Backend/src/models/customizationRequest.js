const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const customer = require('./customer');

const CustomizationRequest = sequelize.define('customizationrequest', {
    requestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: customer,
            key: 'customerId'
        }
    },
    requestDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    budget: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = CustomizationRequest;