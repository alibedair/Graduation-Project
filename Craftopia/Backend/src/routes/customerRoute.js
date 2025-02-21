const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');

router.get('/getprofile', authMiddleware, customerController.getProfile);
router.post('/createprofile', authMiddleware, customerController.updateProfile);
module.exports = router;