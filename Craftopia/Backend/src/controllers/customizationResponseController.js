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
        const {price, note, estimationCompletionDate} = req.body;
        if(!price || !note || !estimationCompletionDate){
            return res.status(400).send({message: 'Please provide all required fields'});
        }

        const file = req.file;
        let image = null;
        if(file){
            const result = await uploadBuffer(file.buffer, {
                folder: `artists/${artist.artistId}/customizationResponses`,
                resource_type: 'image'
            });
            image = result.secure_url;
        }

        const request = await CustomizationRequest.findOne({where:{requestId}});
        if(!request){
            return res.status(404).send({message: 'Request not found'});
        }
        if(request.status !== 'OPEN'){
            return res.status(400).send({message: 'Request is already closed'});
        }
        const newResponse = new CustomizationResponse({
            price,
            notes:note,
            estimationCompletionTime :estimationCompletionDate,
            artistId: artist.artistId,
            requestId: request.requestId
        });

        await newResponse.save();
        return res.status(201).json({
            message: 'Response created successfully',
            response: newResponse
        });

    }catch(error){
        res.status(500).send({message: error.message});
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
