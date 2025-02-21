const router = require('express').Router();
const auctionController = require('../controllers/auctionController');

// Route to create a new auction
router.post('/create', auctionController.createAuction);

// Route to get all auctions
router.get('/', auctionController.getAuctions);

// Route to place a bid on an auction
router.post('/bid', auctionController.placeBid);

module.exports = router;
