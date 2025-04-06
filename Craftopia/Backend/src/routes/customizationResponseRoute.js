const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customizationResponseController = require('../controllers/customizationResponseController');
const upload = require('../middlewares/upload');
const { body, param } = require('express-validator');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/responses', authMiddleware, customizationResponseController.getCustomizationResponses);

router.post('/respond/:requestId', 
    authMiddleware,
    roleMiddleware('artist'),
    upload.single('image'),
    [
        param('requestId').isInt().withMessage('Request ID must be an integer'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('note').notEmpty().withMessage('Note is required'), 
        body('estimationCompletionDate').isISO8601().withMessage('Estimated completion date must be a valid date') 
    ],
    customizationResponseController.respondToCustomizationRequest
);

module.exports = router;