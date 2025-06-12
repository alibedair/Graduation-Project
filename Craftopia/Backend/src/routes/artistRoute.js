const router = require('express').Router();
const artistController = require('../controllers/artistController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');

router.get('/getprofile', authMiddleware, artistController.getArtist);
router.get('/all', artistController.getAllArtists);

router.post('/update',
    authMiddleware, 
    roleMiddleware('artist'),
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'profileVideo', maxCount: 1 }
    ]), 
    [
        body('name').optional().isString().trim().isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        body('bio').optional().isString().trim()
            .withMessage('Bio must be a string'),
        body('phone').optional().matches(/^\+?[0-9]{10,15}$/)
            .withMessage('Please provide a valid phone number')
    ],
    artistController.updateArtist
);

module.exports = router;