const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const uploadBuffer = require('../utils/cloudinaryUpload');
const CustomizationResponse = require('../models/customizationResponse');

exports.respondToCustomizationRequest = async (req, res) => {
    try{

        const userId = req.user.id;
        const artist = await Artist.findOne({where:{userId}});
        if(!artist){
            return res.status(403).send({message: 'You are not authorized to respond to customization requests'});
        }

        const requestId = req.params.requestId;
        if (!requestId || isNaN(parseInt(requestId))) {
            return res.status(400).send({message: 'Invalid request ID'});
        }

        const {price, note, estimationCompletionDate} = req.body;
        if(!price || !note || !estimationCompletionDate){
            return res.status(400).send({message: 'Please provide all required fields'});
        }

        // Validate price is a number
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return res.status(400).send({message: 'Price must be a positive number'});
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(estimationCompletionDate)) {
            return res.status(400).send({message: 'Invalid date format. Use YYYY-MM-DD'});
        }

        const file = req.file;
        let image = null;
        if(file){
            try {
                const result = await uploadBuffer(file.buffer, {
                    folder: `artists/${artist.artistId}/customizationResponses`,
                    resource_type: 'image'
                });
                image = result.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).send({message: 'Error uploading image'});
            }
        }

        const request = await CustomizationRequest.findOne({where:{requestId}});
        if(!request){
            return res.status(404).send({message: 'Request not found'});
        }
        if(request.status !== 'OPEN'){
            return res.status(400).send({message: 'Request is already closed'});
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

    }catch(error){
        console.error('Error in respondToCustomizationRequest:', error);
        res.status(500).send({message: 'Internal server error'});
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
