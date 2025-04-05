const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const productController = require('../controllers/productController');

router.post('/create', 
    authMiddleware,
    roleMiddleware(['artist', 'admin']),
    upload.array('image', 5),  
    productController.createProduct
);

router.get('/get', authMiddleware, productController.getProducts);

router.post('/update/:productId', 
    authMiddleware, 
    roleMiddleware(['artist', 'admin']),
    productController.updateProduct
);

module.exports = router;