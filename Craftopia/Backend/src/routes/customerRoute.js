const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

router.get('/getprofile', authMiddleware, customerController.getProfile);

router.post('/createprofile', 
    authMiddleware,
    roleMiddleware('customer'),
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL')
    ],
    customerController.updateProfile
);

module.exports = router;