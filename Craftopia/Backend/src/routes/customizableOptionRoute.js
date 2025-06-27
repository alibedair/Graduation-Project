const express = require('express');
const router = express.Router();
const customizableOptionController = require('../controllers/customizableOptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

router.post('/add', 
    authMiddleware,
    roleMiddleware('artist'),
    body('optionName').notEmpty().isLength({ min: 3, max: 100 }).withMessage('Option name is required and must be between 2 and 100 characters'),
    body('optionPrice').isNumeric().withMessage('Option price must be a number'),
    body('productId').isInt().withMessage('Product ID must be a number'),
    customizableOptionController.addCustomizableOption
);


router.get('/:productId',
    customizableOptionController.getCustomizableOptions
);

router.delete('/remove/:optionId',
    authMiddleware,
    roleMiddleware('artist'),
    customizableOptionController.removeCustomizableOption
);

module.exports = router;