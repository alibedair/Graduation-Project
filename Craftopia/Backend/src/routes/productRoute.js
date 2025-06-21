const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const productController = require('../controllers/productController');
const { body, param } = require('express-validator');

router.post('/create', 
    authMiddleware,
    roleMiddleware(['artist', 'admin']),
    upload.array('image', 5),
    [
        body('name').notEmpty().withMessage('Product name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('categoryId').isInt().withMessage('Category ID must be an integer'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('dimensions').optional().isString().withMessage('Dimensions must be a string'),
        body('material').optional().isString().withMessage('Material must be a string'),
    ],  
    productController.createProduct
);

router.get('/get', authMiddleware, productController.getProducts);

router.post('/update/:productId', 
    authMiddleware, 
    roleMiddleware(['artist', 'admin']),
    [
        param('productId').isInt().withMessage('Product ID must be an integer'),
        body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
        body('description').optional().notEmpty().withMessage('Description cannot be empty'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('dimensions').optional().isString().withMessage('Dimensions must be a string'),
        body('material').optional().isString().withMessage('Material must be a string')
    ],
    productController.updateProduct
);

router.get('/get/:artistId',
    authMiddleware,
    [
        param('productId').isInt().withMessage('Product ID must be an integer')
    ],
    productController.getArtistProducts
);

module.exports = router;