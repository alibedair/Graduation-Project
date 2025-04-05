const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customizationResponseController = require('../controllers/customizationResponseController');
const upload = require('../middlewares/upload');

router.get('/responses', authMiddleware, customizationResponseController.getCustomizationResponses);

router.post('/respond/:requestId', 
    authMiddleware, 
    upload.single('image'), 
    customizationResponseController.respondToCustomizationRequest
);

module.exports = router;