const customer = require('../models/customer');
const User = require('../models/user');
const Artist = require('../models/artist');
const ArtistFollow = require('../models/artistFollow');

exports.updateProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findOne({where: {userId}});
        if(!user || user.role !== 'customer'){
            return res.status(403).json({message: "Forbidden"});
        }
        
        const {name, username, phone, address} = req.body;
        if(!name || !phone || !address || !username){
            return res.status(400).json({
                message: "Please fill all fields",
                required: ['name', 'username', 'phone', 'address']
            });
        }
        
        const existingCustomer = await customer.findOne({ where: { userId } });
        if (existingCustomer) {
            if (existingCustomer.username !== username) {
                const usernameExists = await customer.findOne({ where: { username } });
                if (usernameExists) {
                    return res.status(400).json({ message: "Username already exists" });
                }
            }
            existingCustomer.name = name;
            existingCustomer.phone = phone;
            existingCustomer.address = address;
            existingCustomer.username = username;
            await existingCustomer.save();
            return res.status(200).json({existingCustomer});
        }else {
            const usernameExists = await customer.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already exists" });
            }
            const customerProfile = await customer.create({ name, phone, address, username, userId });
            return res.status(201).json({ customerProfile });
        }

    }catch(error){
        console.error("Error updating customer profile:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

exports.getProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const customerProfile = await customer.findOne({where: {userId}});
        if(!customerProfile){
            return res.status(404).json({message: "Customer profile not found"});
        }
        return res.status(200).json({customerProfile});
    }catch(error){
        console.error("Error getting customer profile:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

exports.followArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { artistId } = req.params;
        
        const customerProfile = await customer.findOne({ where: { userId } });
        if (!customerProfile) {
            return res.status(403).json({ message: 'You must have a customer profile to follow artists' });
        }
        
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const existingFollow = await ArtistFollow.findOne({
            where: {
                customerId: customerProfile.customerId,
                artistId: artist.artistId
            }
        });
        
        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this artist' });
        }
        
        await ArtistFollow.create({
            customerId: customerProfile.customerId,
            artistId: artist.artistId
        });
        
        return res.status(201).json({ message: 'Successfully followed artist' });
    } catch (error) {
        console.error('Error following artist:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.unfollowArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { artistId } = req.params;
        
        const customerProfile = await customer.findOne({ where: { userId } });
        if (!customerProfile) {
            return res.status(403).json({ message: 'You must have a customer profile to unfollow artists' });
        }
        
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        
        const existingFollow = await ArtistFollow.findOne({
            where: {
                customerId: customerProfile.customerId,
                artistId: artist.artistId
            }
        });
        
        if (!existingFollow) {
            return res.status(400).json({ message: 'You are not following this artist' });
        }
        
        await existingFollow.destroy();
        
        return res.status(200).json({ message: 'Successfully unfollowed artist' });
    } catch (error) {
        console.error('Error unfollowing artist:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const customerProfile = await customer.findOne({ where: { userId } });
        if (!customerProfile) {
            return res.status(403).json({ message: 'You must have a customer profile to view followed artists' });
        }
        
        const follows = await ArtistFollow.findAll({
            where: { customerId: customerProfile.customerId },
            include: [{
                model: Artist,
                attributes: ['artistId', 'name', 'username', 'profilePicture', 'biography']
            }]
        });
        const followedArtists = follows.map(follow => follow.artist);
        
        return res.status(200).json({ followedArtists });
    } catch (error) {
        console.error('Error getting followed artists:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};