const Artist = require('../models/artist');
const uploadBuffer = require('../utils/cloudinaryUpload');

exports.updateArtist = async (req, res) => {
    try {

        const userId = req.user.id;

        const {name, username, phone, biography} = req.body;
        if(!name || !username || !phone || !biography) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        let profilePicture=null;
        let profileVideo=null;

        if(req.files) {
            if(req.files.profilePicture){
                const pictureFile = req.files.profilePicture[0];
                const result = await uploadBuffer(pictureFile.buffer, {
                    folder: 'artist_profile/pictures',
                    resource_type: 'image'
                });
                profilePicture = result.secure_url;
            }

            if(req.files.profileVideo){
                const videoFile = req.files.profileVideo[0];
                const result = await uploadBuffer(videoFile.buffer, {
                    folder: 'artist_profile/videos',
                    resource_type: 'video'
                });
                profileVideo = result.secure_url;
            }
        }

        let artist = await Artist.findOne({where:{userId}});

        const profileData = {
            userId,
            name,
            username,
            phone,
            biography,
            profilePicture,
            profileVideo
        }
        if(profilePicture) profileData.profilePicture = profilePicture;
        if(profileVideo) profileData.profileVideo = profileVideo;


        if(artist){
            if(artist.username !== username){
                const usernameExists = await Artist.findOne({where:{username}});
                if(usernameExists){
                    return res.status(400).json({message: 'Username already exists'});
                }
            }
            artist.name = name;
            artist.username = username;
            artist.phone = phone;
            artist.biography = biography;
            artist.profilePicture = profilePicture;
            artist.profileVideo = profileVideo;
            await artist.save();
            return res.status(200).json({artist});
        }else{
            artist = await Artist.create(profileData);
            return res.status(201).json({artist});
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const artist = await Artist.findOne({userId});
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