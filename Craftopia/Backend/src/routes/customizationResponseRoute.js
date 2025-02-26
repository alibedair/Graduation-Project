const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customizationResponseController = require('../controllers/customizationResponseController');



router.get('/responses', authMiddleware, customizationResponseController.getCustomizationResponses);

router.post('/respond/:requestId', authMiddleware, customizationResponseController.respondToCustomizationRequest);

module.exports = router;