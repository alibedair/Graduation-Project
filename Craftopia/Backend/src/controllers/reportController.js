const { Report, Artist, Customer, Admin, ReportHandling } = require('../models');
const { Op, sequelize } = require('sequelize');
const db = require('../config/db');
const { validationResult } = require('express-validator');
exports.createReportUser = async (req, res) => {
    try {
         const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                }
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const { content,  attachment } = req.body;
        const role = req.user.role;
        const username = req.params.username;
        const userId = req.user.id;
        if (!content || !username) {
            return res.status(400).json({
                success: false,
                message: 'Content and reported username are required'
            });
        }

        let reporterId;
        let reporterType;

        if (role === 'artist') {
            const artist = await Artist.findOne({ where: { userId } });
            if (!artist) {
                return res.status(404).json({
                    success: false,
                    message: 'Artist profile not found'
                });
            }
            reporterId = artist.artistId;
            reporterType = 'artist';
        } else if (role === 'customer') {
            const customer = await Customer.findOne({ where: { userId } });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer profile not found'
                });
            }
            reporterId = customer.customerId;
            reporterType = 'customer';
        } else {
            return res.status(403).json({
                success: false,
                message: 'Only artists and customers can create reports'
            });
        }

       const reportedCustomer = await Customer.findOne({ where: { username } });
       if (!reportedCustomer) {
            return res.status(404).json({
                success: false,
                message: 'Reported customer not found'
            });

        }


        if (reporterType === 'customer' && reporterId === reportedCustomer.customerId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot report yourself'
            });
        }

        const report = await Report.create({
            content,
            ReporterID: reporterId,
            ReporterType: reporterType,
            ReportedID: reportedId,
            ReportedType: 'customer',
        });
        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: report
        });

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};