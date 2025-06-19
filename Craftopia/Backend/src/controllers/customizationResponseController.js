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
            image: image,
            status: 'PENDING'
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
                image: newResponse.image,
                status: newResponse.status
            }
        });

    } catch(error){
        console.error('Error in respondToCustomizationRequest:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.getCustomizationResponses = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });

        if (!customer) {
            return res.status(403).send({ message: 'You are not authorized to view customization responses' });
        }

        const requests = await CustomizationRequest.findAll({ where: { customerId: customer.customerId } });
        const requestIds = requests.map(request => request.requestId);

        const responses = await CustomizationResponse.findAll({
            where: { requestId: requestIds },
            include: [
                {
                    model: Artist,
                    attributes: ['username','profilePicture']
                },
                {
                    model: CustomizationRequest,
                    attributes: ['title', 'image']
                }
            ]
        });

        return res.status(200).json(responses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.acceptCustomizationResponse = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).send({ message: 'You are not authorized to accept customization responses' });
        }
        
        const responseId = req.params.responseId;
        const response = await CustomizationResponse.findOne({ 
            where: { responseId },
            include: [{
                model: CustomizationRequest,
                attributes: ['customerId', 'requestId']
            }]
        });
        
        if (!response) {
            return res.status(404).send({ message: 'Response not found' });
        }
        if (response.customizationrequest.customerId !== customer.customerId) {
            return res.status(403).send({ message: 'You are not authorized to accept this response' });
        }
        if (response.status !== 'PENDING') {
            return res.status(400).send({ message: 'Response has already been processed' });
        }
        await response.update({ status: 'ACCEPTED' });
        await CustomizationRequest.update(
            { status: 'ACCEPTED' },
            { where: { requestId: response.requestId } }
        );
        
        return res.status(200).json({
            message: 'Customization response accepted successfully',
            responseId: response.responseId,
            status: 'ACCEPTED'
        });
        
    } catch (error) {
        console.error('Error accepting customization response:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.declineCustomizationResponse = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).send({ message: 'You are not authorized to decline customization responses' });
        }
        
        const responseId = req.params.responseId;
        const response = await CustomizationResponse.findOne({ 
            where: { responseId },
            include: [{
                model: CustomizationRequest,
                attributes: ['customerId', 'requestId']
            }]
        });
        
        if (!response) {
            return res.status(404).send({ message: 'Response not found' });
        }
        if (response.customizationrequest.customerId !== customer.customerId) {
            return res.status(403).send({ message: 'You are not authorized to decline this response' });
        }
        if (response.status !== 'PENDING') {
            return res.status(400).send({ message: 'Response has already been processed' });
        }
        await response.update({ status: 'DECLINED' });
        
        return res.status(200).json({
            message: 'Customization response declined successfully',
            responseId: response.responseId,
            status: 'DECLINED'
        });
        
    } catch (error) {
        console.error('Error declining customization response:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
