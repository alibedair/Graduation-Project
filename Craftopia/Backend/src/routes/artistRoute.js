const router = require('express').Router();
const artistController = require('../controllers/artistController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getprofile', authMiddleware,artistController.getArtist);

router.post('/update', authMiddleware, 
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'profileVideo', maxCount: 1 }
    ]), 
    artistController.updateArtist);

module.exports = router;