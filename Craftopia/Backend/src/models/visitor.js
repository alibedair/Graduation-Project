const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const customer = require('./customer');
const artist = require('./artist');

const Visitor = sequelize.define('visitor', {
    artistId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: artist,
            key: 'artistId'
        }
    },
    customerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: customer,
            key: 'customerId'
        }
    }
});

module.exports = Visitor;
