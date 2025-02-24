const Artist = require('../models/artist');
const uploadBuffer = require('../utils/cloudinaryUpload');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.updateArtist = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findOne({where: {userId}});
        if(!user ||user.role !== 'artist'){
            return res.status(403).json({message: "Forbidden"});
        }
        const {name, username, phone, biography} = req.body;
        if(!name || !username || !phone || !biography) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }
        const existingArtist = await Artist.findOne({
            where: {
                username,
                userId: {[Op.ne]: userId}
            }
        });

        if(existingArtist){
            return res.status(400).json({message: 'Username already exists'});
        }

        let profilePicture='';
        let profileVideo='';
        
        if(req.files){
            if(req.files.profilePicture && req.files.profilePicture[0]){
                const pictureFile = req.files.profilePicture[0];
                const result = await uploadBuffer(pictureFile.buffer, {
                    folder: `artists/${userId}/profilePicture`,
                    resource_type: 'image'
                });
                profilePicture = result.secure_url;
            }
            if(req.files.profileVideo && req.files.profileVideo[0]){
                const videoFile = req.files.profileVideo[0];
                const result = await uploadBuffer(videoFile.buffer, {
                    folder: `artists/${userId}/profileVideo`,
                    resource_type: 'video'
                });
                profileVideo = result.secure_url;
            }
        }

        let artist = await Artist.findOne({where: {userId}});
        if(artist){
            artist.name = name;
            artist.username = username;
            artist.phone = phone;
            artist.biography = biography;
            if(profilePicture){
                artist.profilePicture = profilePicture;
            }
            if(profileVideo){
                artist.profileVideo = profileVideo;
            }
            artist = await artist.save();
            return res.status(200).json({artist});
        }else{
            artist = await Artist.create({
                name,
                username,
                phone,
                biography,
                profilePicture,
                profileVideo,
                userId
            });
            return res.status(201).json({artist});
        }


    }catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.getArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const artist = await Artist.findOne({where: {userId}});
        if(!artist){
            return res.status(404).json({message: 'Artist profile not found'});
        }
        return res.status(200).json({artist});
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}