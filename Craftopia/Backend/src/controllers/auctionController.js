const firebase_db = require("../config/firebase");
const product = require("../models/product");

exports.createAuction = async (req, res) => {
  try {
    const { productId, startingPrice, startTime, endTime } = req.body;

    // Check if the product exists
    const productItem = await product.findByPk(productId);
    if (!productItem) {
      return res.status(404).json({ message: "Product not found." });
    }
    
    //create a new auction
    const newAuctionRef = firebase_db.ref("auctions").push();
    const auctionId = newAuctionRef.key; // Firebase auto-generates an ID

    await newAuctionRef.set({
      productId,
      startingPrice,
      startTime,
      endTime,
      status: "pending", 
      bids: [], // Empty array for storing bids
    });

    return res.status(201).json({ message: "Auction created successfully!", auctionId });
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
  
      // Retrieve the auction data from Firebase
      const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
      const auctionSnapshot = await auctionRef.once("value");
      const auctionData = auctionSnapshot.val();
  
      // If auction doesn't exist, return 404
      if (!auctionData) {
        return res.status(404).json({ message: "Auction not found." });
      }
  
      const { startingPrice, bids } = auctionData;
  
      // Determine the current highest bid (if any)
      let highestBid = 0;
      if (bids) {
        Object.values(bids).forEach(bid => {
          if (bid.bidAmount > highestBid) highestBid = bid.bidAmount;
        });
      }
  
      // Condition 1: New bid must be greater than the current highest bid
      if (bidAmount <= highestBid) {
        return res.status(400).json({
          message: `Bid must be greater than the current highest bid of ${highestBid}.`
        });
      }
  
      // Condition 2: New bid must be at least 30% higher than the starting price
      const minRequiredBid = startingPrice * 1.3;
      if (bidAmount < minRequiredBid) {
        return res.status(400).json({
          message: `Bid must be at least 20% higher than the starting price. The minimum bid is ${minRequiredBid}.`
        });
      }
  
      // If both conditions are met, place the bid by pushing it under the 'bids' node
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
  
