const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const { body, param } = require('express-validator');

router.post('/createReportUser/:username', 
    authMiddleware,
    roleMiddleware(['artist', 'customer']),
    upload.fields([
        { name: 'attachment', maxCount: 2 }
    ]),
    [
        body('content').notEmpty().trim().withMessage('Report content is required'),
        param('username').isString().withMessage('Reported username must be a valid string'),
        body('attachment').optional().isString().withMessage('Attachment must be a string')
    ],
    reportController.createReportUser
);

module.exports = router;

