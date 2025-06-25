const { firebase_db } = require("../config/firebase");
const Product = require("../models/product");
const Artist = require("../models/artist"); 

exports.getAuctions = async (req, res) => {
    try {
        const { status, category, artist, limit = 20, page = 1 } = req.query;
        
        const auctionsSnapshot = await firebase_db.ref("auctions").once("value");
        const auctionsData = auctionsSnapshot.val() || {};
        
        let auctions = Object.entries(auctionsData).map(([id, data]) => ({
            id,
            ...data
        }));
        const now = new Date();
        auctions = auctions.map(auction => {
            if (auction.status === 'scheduled' && new Date(auction.startDate) <= now) {
                firebase_db.ref(`auctions/${auction.id}`).update({ status: 'active' });
                return { ...auction, status: 'active' };
            }
            if (auction.status === 'active' && new Date(auction.endDate) <= now) {
                firebase_db.ref(`auctions/${auction.id}`).update({ status: 'ended' });
                return { ...auction, status: 'ended' };
            }
            return auction;
        });
        
        if (status) {
            auctions = auctions.filter(auction => auction.status === status);
        }
        
        if (category) {
            const products = await Product.findAll({ where: { categoryId: category } });
            const productIds = products.map(p => p.productId.toString());
            auctions = auctions.filter(auction => productIds.includes(auction.productId.toString()));
        }
        
        if (artist) {
            auctions = auctions.filter(auction => auction.artistId.toString() === artist);
        }
        
        const artistIds = [...new Set(auctions.map(auction => auction.artistId))]; 
        const productIds = [...new Set(auctions.map(auction => auction.productId))];
        const artists = await Artist.findAll({
            where: { artistId: artistIds },
            attributes: ['artistId', 'name', 'username']
        });
        
        const products = await Product.findAll({
            where: { productId: productIds }
        });
        
        const artistMap = {};
        artists.forEach(artist => {
            artistMap[artist.artistId] = {
                artistId: artist.artistId,
                name: artist.name,
                username: artist.username
            };
        });
        
        const productMap = {};
        products.forEach(product => {
            productMap[product.productId] = product;
        });
        
        auctions = auctions.map(auction => ({
            ...auction,
            artist: artistMap[auction.artistId] || null,
            product: productMap[auction.productId] || null
        }));
        
        auctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedAuctions = auctions.slice(startIndex, endIndex);
        
        return res.status(200).json({ 
            auctions: paginatedAuctions,
            totalCount: auctions.length,
            page: parseInt(page),
            totalPages: Math.ceil(auctions.length / limit)
        });
    } catch (error) {
        console.error("Error fetching auctions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAuctionDetails = async (req, res) => {
    try {
        const { auctionId } = req.params;
        
        if (!auctionId) {
            return res.status(400).json({ message: "Auction ID is required" });
        }
        
        const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
        const auctionSnapshot = await auctionRef.once("value");
        const auctionData = auctionSnapshot.val();
        
        if (!auctionData) {
            return res.status(404).json({ message: "Auction not found" });
        }
          const now = new Date();
        const startTime = new Date(auctionData.startDate);
        const endTime = new Date(auctionData.endDate);
        if (auctionData.status === 'scheduled' && now >= startTime) {
            await auctionRef.update({ status: 'active' });
            auctionData.status = 'active';
        }
        if (auctionData.status === 'active' && now > endTime) {
            await auctionRef.update({ status: 'ended' });
            auctionData.status = 'ended';
        }
        
        let bids = [];
        if (auctionData.bids) {
            bids = Object.entries(auctionData.bids).map(([id, bid]) => ({
                id,
                ...bid
            }));
            bids.sort((a, b) => b.bidAmount - a.bidAmount);
        }
          let productData = auctionData.productDetails;
        if (!productData) {
            const product = await Product.findByPk(auctionData.productId);
            productData = product || null;
        }
        
        let artistData = null;
        if (auctionData.artistId) {
            const artist = await Artist.findByPk(auctionData.artistId, {
                attributes: ['artistId', 'name', 'username']
            });
            artistData = artist;
        }
        
        return res.status(200).json({
            auction: {
                id: auctionId,
                ...auctionData,
                bids,
                product: productData,
                artist: artistData,
                timeRemaining: Math.max(0, endTime - now),
                isEnded: now > endTime
            }
        });
    } catch (error) {
        console.error("Error fetching auction details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getAuctionProduct = async (req, res) => {
    try {
        const { auctionId } = req.params;
        
        if (!auctionId) {
            return res.status(400).json({ message: "Auction ID is required" });
        }
        
        const auctionRef = firebase_db.ref(`auctions/${auctionId}`);
        const auctionSnapshot = await auctionRef.once("value");
        const auctionData = auctionSnapshot.val();
        
        if (!auctionData) {
            return res.status(404).json({ message: "Auction not found" });
        }
          const product = await Product.findByPk(auctionData.productId, {
            include: [
                {
                    model: Artist,
                    as: 'artist',
                    attributes: ['artistId', 'name', 'username']
                }
            ]
        });
        
        if (!product) {
            return res.status(404).json({ message: "Product not found for this auction" });
        }
        
        let highestBid = null;
        if (auctionData.bids) {
            const bids = Object.entries(auctionData.bids).map(([id, bid]) => ({
                id,
                ...bid
            }));
                        
            if (bids.length > 0) {
                highestBid = bids.sort((a, b) => b.bidAmount - a.bidAmount)[0];
            }
        }
        
        return res.status(200).json({
            product,
            highestBid: highestBid
        });
    } catch (error) {
        console.error("Error fetching auction product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}