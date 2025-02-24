const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const productController = require('../controllers/productController');

router.post('/create', authMiddleware,
    upload.array('image', 5),  
    productController.createProduct);

router.get('/get', authMiddleware, productController.getProducts);

router.post('/update/:productId', authMiddleware, productController.updateProduct);

module.exports = router;