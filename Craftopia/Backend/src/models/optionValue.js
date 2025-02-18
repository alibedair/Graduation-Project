const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const CustomizableOption = require('./customizableOption');

const OptionValue = sequelize.define('optionvalue', {
    valueId : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value : {
        type: DataTypes.STRING,
        allowNull: false
    },
    price : {
        type: DataTypes.DECIMAL,
        allowNull:false
    },
    optionId : {
        type: DataTypes.INTEGER,
        references: {
            model: CustomizableOption,
            key: 'optionId'
        }
    }
});

module.exports = OptionValue;