const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const CustomizableOption = require('./customizableOption');
const Order = require('./order');

const OptionValue = sequelize.define('optionvalue', {
    valueId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valueofOption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    optionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CustomizableOption,
            key: 'optionId'
        }
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'orderId'
        }
    }
}, {
    tableName: 'optionvalues'
});

module.exports = OptionValue;
