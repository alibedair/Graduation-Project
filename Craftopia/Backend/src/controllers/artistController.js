const Artist = require('../models/artist');
const uploadBuffer = require('../utils/cloudinaryUpload');
const User = require('../models/user');
const { Op, Sequelize } = require('sequelize');
const { validationResult } = require('express-validator');
const Product = require('../models/product');
const ArtistFollow = require('../models/artistFollow');
const Customer = require('../models/customer');
const Category = require('../models/category');
const Visitor = require('../models/visitor');
const Review = require('../models/Review');

exports.updateArtist = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        
        const {name, username, phone, biography} = req.body;
        
        if (username) {
            const existingArtist = await Artist.findOne({
                where: {
                    username,
                    userId: {[Op.ne]: userId}
                }
            });

            if(existingArtist){
                return res.status(400).json({message: 'Username already exists'});
            }
        }

        let profilePicture = '';
        let profileVideo = '';
        
        const uploadPromises = [];
        
        if(req.files){
            if(req.files.profilePicture && req.files.profilePicture[0]){
                const pictureFile = req.files.profilePicture[0];
                uploadPromises.push(
                    uploadBuffer(pictureFile.buffer, {
                        folder: `artists/${userId}/profilePicture`,
                        resource_type: 'image'
                    }).then(result => {
                        profilePicture = result.secure_url;
                    })
                );
            }
            
            if(req.files.profileVideo && req.files.profileVideo[0]){
                const videoFile = req.files.profileVideo[0];
                uploadPromises.push(
                    uploadBuffer(videoFile.buffer, {
                        folder: `artists/${userId}/profileVideo`,
                        resource_type: 'video'
                    }).then(result => {
                        profileVideo = result.secure_url;
                    })
                );
            }
            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises);
            }
        }

        const [artist, created] = await Artist.findOrCreate({
            where: {userId},
            defaults: {
                name: name || '',
                username: username || '',
                phone: phone || '',
                biography: biography || '',
                profilePicture: profilePicture || '',
                profileVideo: profileVideo || '',
                userId
            }
        });
        
        if (!created) {
            const updates = {};
            if (name) updates.name = name;
            if (username) updates.username = username;
            if (phone) updates.phone = phone;
            if (biography) updates.biography = biography;
            if (profilePicture) updates.profilePicture = profilePicture;
            if (profileVideo) updates.profileVideo = profileVideo;
            
            await artist.update(updates);
        }
        
        return res.status(created ? 201 : 200).json({artist});

    } catch (error) {
        console.error('Error updating artist:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getArtist = async (req, res) => {
    try {
        const { artistId } = req.params; 
        const userId = req.user.id;
        const artist = await Artist.findOne({ where: { artistId } });
        if(!artist){
            return res.status(404).json({message: 'Artist profile not found'});
        }
        const user = await User.findOne({where: {userId}});        if(user.role == 'customer'){
            const customer = await Customer.findOne({where: {userId}});
            if(customer) {
                const visitorRecord = await Visitor.findOne({
                    where: {
                        artistId: artist.artistId,
                        customerId: customer.customerId
                    }
                });
                if(visitorRecord==null){
                    await Visitor.create({
                        artistId: artist.artistId,
                        customerId: customer.customerId
                    });
                    await artist.increment('visitors');
                }
            }
        }
        return res.status(200).json({artist});
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getAllArtists = async (req, res) => {
    try {
        const errors = validationResult(req);        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }        
        const userId = req.user?.id;
        const customer = userId ? await Customer.findOne({ where: { userId } }) : null;
        let artists = await Artist.findAll({            
            attributes: [
                'artistId', 
                'name', 
                'username',
                'profilePicture',
                'biography',
                [Sequelize.fn('COUNT', Sequelize.col('products.productId')), 'numberOfProducts'],
                [Sequelize.fn('COUNT', Sequelize.col('artistfollows.customerId')), 'numberOfFollowers'],
                'averageRating',
                [
                    Sequelize.literal(`(
                        SELECT COALESCE(MIN("products"."price"), 0)
                        FROM "products" AS "products"
                        WHERE "products"."artistId" = "artist"."artistId"
                    )`),
                    'lowestPrice'
                ]
            ],
            include: [{
                model: User,
                attributes: ['email']
            },
            {
                model: Product,
                attributes: [],
                required: false
            },
            {
                model: ArtistFollow,
                attributes: [],
                required: false
            }
            ],
            group: ['artist.artistId', 'user.userId'],
            order: [['artistId', 'DESC']]
        });
        const artistsWithFollowingStatus = await Promise.all(
            artists.map(async (artist) => {
                const isFollowing = customer ? await ArtistFollow.findOne({
                    where: {
                        artistId: artist.artistId,
                        customerId: customer.customerId
                    }
                }) !== null : false;
                const artistCategories = await Product.findAll({
                    where: { artistId: artist.artistId },
                    include: [{
                        model: Category,
                        attributes: ['categoryId', 'name'],
                        required: true
                    }],
                    attributes: ['categoryId'],
                    group: ['product.categoryId', 'category.categoryId', 'category.name']
                });

                const categoryNames = artistCategories.map(product => 
                    product.category ? product.category.name : null
                ).filter(name => name !== null);
                const totalReviews = await Review.count({
                    include: [{
                        model: Product,
                        where: { artistId: artist.artistId },
                        attributes: []
                    }]
                });

                return {
                    ...artist.toJSON(),
                    isFollowing,
                    categories: categoryNames,
                    totalReviews: totalReviews || 0
                };
            })
        );

        return res.status(200).json({artists: artistsWithFollowingStatus});
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getArtistFollowers = async (req, res) => {
    try {
        const { artistId } = req.params;
        
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const followersCount = await ArtistFollow.count({
            where: { artistId }
        });

        const followers = await ArtistFollow.findAll({
            where: { artistId },
            include: [{
                model: Customer,
                attributes: ['customerId', 'name', 'username']
            }]
        });

        return res.status(200).json({ 
            followersCount,
            followers: followers.map(follow => follow.customer)
        });
    } catch (error) {
        console.error('Error getting artist followers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const ArtistProfile = await Artist.findOne({where: {userId}});
        if(!ArtistProfile){
            return res.status(404).json({message: "Artist profile not found"});
        }
        return res.status(200).json({ArtistProfile});
    }catch(error){
        console.error("Error getting Artist profile:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};