const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const productController = require('../controllers/productController');

router.post('/create', authMiddleware,
    upload.fields([
        { name: 'image', maxCount: 1 }
    ]),  
    productController.createProduct);

module.exports = router;