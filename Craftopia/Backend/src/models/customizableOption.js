const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product');
const { mountpath } = require('../app');

const CustomizableOption = sequelize.define('customizableoption', {
    optionId : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    optionName : {
        type: DataTypes.STRING,
        allowNull: false
    },
    proudctId : {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'productId'
        }
    }
});

module.exports = CustomizableOption;