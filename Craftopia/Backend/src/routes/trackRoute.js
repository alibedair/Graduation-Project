const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { param } = require('express-validator');

router.get('/getArtist/:username',
    authMiddleware,
    [
        param('username').isString().notEmpty().withMessage('Username is required and must be a string'),
    ],
    trackController.getArtistSalesByUsername
);

router.get('/all',
    authMiddleware,
    roleMiddleware(['admin']),
    trackController.getallSales
);

module.exports = router;
