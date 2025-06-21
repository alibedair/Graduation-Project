const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['customer']));

router.post('/add', ratingController.addRating);
router.get('/artist/:artistId', ratingController.getArtistRatings);

router.get('/my-rating/:artistId', ratingController.getCustomerRating);

module.exports = router;
