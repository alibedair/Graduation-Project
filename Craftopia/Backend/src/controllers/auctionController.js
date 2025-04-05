const firebase_db = require("../config/firebase");
const product = require("../models/product");

exports.createAuction = async (req, res) => {
    try {
        const { productId, startingPrice, endDate } = req.body;
        
        if (!productId || !startingPrice || !endDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        

        const auctionsRef = firebase_db.ref().child('auctions');
        

        const newAuctionRef = auctionsRef.push();
        
        
        await newAuctionRef.set({
            productId,
            startingPrice,
            currentPrice: startingPrice,
            endDate,
            status: 'active',
            createdAt: new Date().toISOString()
        });
        
        return res.status(201).json({
            message: 'Auction created successfully',
            auctionId: newAuctionRef.key
        });
    } catch (error) {
        console.error('Error creating auction:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAuctions = async (req, res) => {
    try {
      const auctionsSnapshot = await firebase_db.ref("auctions").once("value");
      const auctions = auctionsSnapshot.val();
  
      if (!auctions) {
        return res.status(404).json({ message: "No auctions found." });
      }
  
      return res.status(200).json(auctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.placeBid = async (req, res) => {
    try {
      const { auctionId, userId, bidAmount } = req.body;
  
      
      const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
      const auctionSnapshot = await auctionRef.once("value");
      const auctionData = auctionSnapshot.val();
  
      
      if (!auctionData) {
        return res.status(404).json({ message: "Auction not found." });
      }
  
      const { startingPrice, bids } = auctionData;
  
      
      let highestBid = 0;
      if (bids) {
        Object.values(bids).forEach(bid => {
          if (bid.bidAmount > highestBid) highestBid = bid.bidAmount;
        });
      }
  
      
      if (bidAmount <= highestBid) {
        return res.status(400).json({
          message: `Bid must be greater than the current highest bid of ${highestBid}.`
        });
      }
  
      
      const minRequiredBid = startingPrice * 1.3;
      if (bidAmount < minRequiredBid) {
        return res.status(400).json({
          message: `Bid must be at least 20% higher than the starting price. The minimum bid is ${minRequiredBid}.`
        });
      }
  
      
      const bidsRef = auctionRef.child("bids");
      const newBidRef = bidsRef.push();
      await newBidRef.set({
        userId,
        bidAmount,
        timestamp: Date.now()
      });
  
      return res.status(200).json({ message: "Bid placed successfully!" });
    } catch (error) {
      console.error("Error placing bid:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
