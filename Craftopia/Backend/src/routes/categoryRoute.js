const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/create', 
    authMiddleware,
    roleMiddleware('admin'),
    [
        body('name').notEmpty().withMessage('Category name is required'),
        body('description').optional().isString().withMessage('Description must be a string')
    ],
    categoryController.createCategory
);

router.get('/all', categoryController.getAllCategories);

module.exports = router;