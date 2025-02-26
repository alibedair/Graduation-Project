const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customizationRequestController = require('../controllers/customizationRequestController');
const upload = require('../middlewares/upload');

router.post('/request', authMiddleware,
    upload.single('image')
    ,customizationRequestController.createCustomizationRequest);

router.get('/requests', authMiddleware, customizationRequestController.getOpenCustomizationRequests);

module.exports = router;