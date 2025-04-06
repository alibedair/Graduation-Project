const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const uploadBuffer = require('../utils/cloudinaryUpload');
const CustomizationResponse = require('../models/customizationResponse');
const { validationResult } = require('express-validator');

exports.respondToCustomizationRequest = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const artist = await Artist.findOne({where:{userId}});
        if(!artist){
            return res.status(403).json({message: 'You are not authorized to respond to customization requests'});
        }

        const requestId = req.params.requestId;
        
        const request = await CustomizationRequest.findOne({where:{requestId}});
        if(!request){
            return res.status(404).json({message: 'Request not found'});
        }
        
        if(request.status !== 'OPEN'){
            return res.status(400).json({message: 'Request is already closed'});
        }
        
        const {price, note, estimationCompletionDate} = req.body;

        let image = null;
        const file = req.file;
        if(file){
            try {
                const result = await uploadBuffer(file.buffer, {
                    folder: `artists/${artist.artistId}/customizationResponses`,
                    resource_type: 'image'
                });
                image = result.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({message: 'Error uploading image'});
            }
        }
        
        const newResponse = await CustomizationResponse.create({
            price,
            notes: note,
            estimationCompletionTime: estimationCompletionDate,
            artistId: artist.artistId,
            requestId: request.requestId,
            image: image
        });

        return res.status(201).json({
            message: 'Response created successfully',
            response: {
                responseId: newResponse.responseId,
                price: newResponse.price,
                notes: newResponse.notes,
                estimationCompletionTime: newResponse.estimationCompletionTime,
                artistId: newResponse.artistId,
                requestId: newResponse.requestId,
                image: newResponse.image
            }
        });

    } catch(error){
        console.error('Error in respondToCustomizationRequest:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.getCustomizationResponses = async (req, res) => {
    try{
        const userId = req.user.id;
        const customer = await Customer.findOne({where:{userId}});
        if(!customer){
            return res.status(403).send({message: 'You are not authorized to view customization responses'});
        }
        const requests = await CustomizationRequest.findAll({where:{customerId: customer.customerId}});
        const requestIds = requests.map(request => request.requestId);
        const responses = await CustomizationResponse.findAll({where:{requestId: requestIds}});
        return res.status(200).json(responses);
    }catch(error){
        res.status(500).send({message: error.message});
    }
};
