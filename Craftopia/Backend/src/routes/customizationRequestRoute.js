const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customizationRequestController = require('../controllers/customizationRequestController');
const upload = require('../middlewares/upload');
const { body } = require('express-validator');

router.post('/request', 
    authMiddleware,
    upload.single('image'),
    [
        body('description').notEmpty().withMessage('Description is required'),
        body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
        body('deadline').isISO8601().withMessage('Deadline must be a valid date')
    ],
    customizationRequestController.createCustomizationRequest
);

router.get('/requests', authMiddleware, customizationRequestController.getOpenCustomizationRequests);

module.exports = router;