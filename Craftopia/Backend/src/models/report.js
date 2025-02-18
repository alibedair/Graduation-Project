const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const customer = require('./customer');
const artist = require('./artist');

const Report = sequelize.define('report', {
    ReportId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ReporterID: {
        type: DataTypes.INTEGER,
        references: {
            model: customer,
            key: 'customerId'
        }
    },
    ReportedID: {
        type: DataTypes.INTEGER,
        references: {
            model: artist,
            key: 'artistId'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Report;