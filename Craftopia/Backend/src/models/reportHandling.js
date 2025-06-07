const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const admin = require('./admin');
const report = require('./report');

const ReportHandling = sequelize.define('reporthandling', {
    adminId: {
        type: DataTypes.INTEGER,
        references: {
            model: admin,
            key: 'adminId'
        }
    },
    reportId: {
        type: DataTypes.INTEGER,
        references: {
            model: report,
            key: 'reportId'
        }
    }
});

module.exports = ReportHandling;