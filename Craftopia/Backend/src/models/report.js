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
        allowNull: false
    },
    ReporterType: {
        type: DataTypes.ENUM('customer', 'artist'),
        allowNull: false
    },
    ReportedID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ReportedType: {
        type: DataTypes.ENUM('customer', 'artist'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("submitted", "reviewed"),
        defaultValue: "submitted",
        allowNull: false
    },
    attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['ReporterID', 'ReporterType']
        },
        {
            fields: ['ReportedID', 'ReportedType']
        },
        {
            fields: ['status']
        },
        {
            fields: ['createdAt']
        }
    ]
});

module.exports = Report;