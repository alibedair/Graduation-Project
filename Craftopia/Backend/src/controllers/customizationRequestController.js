const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const CustomizationResponse = require('../models/customizationResponse');
const uploadBuffer = require('../utils/cloudinaryUpload');
const { autoDeclinePendingResponses } = require('../utils/customizationUtils');


exports.createCustomizationRequest = async (req, res) => {
    try{
        const userId = req.user.id;
        const customer = await Customer.findOne({where:{userId}});
        if(!customer){
            return res.status(403).json({message: 'You are not authorized to create a customization request'});
        }

        const {description, budget, title} = req.body;
        if(!description || !budget || !title){
            return res.status(400).json({
                message: 'Please provide all required fields',
                required: ['description', 'budget', 'title']
            });
        }

        let image = null;

        const file = req.file;
        if(file){
            try {
                const result = await uploadBuffer(file.buffer, {
                    folder: `customers/${customer.customerId}/customizationRequests`,
                    resource_type: 'image'
                });
                image = result.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                console.warn('Continuing without image due to upload error');
            }
        }

        const newRequest = await CustomizationRequest.create({
            requestDescription: description,
            budget,
            title,
            image,
            customerId: customer.customerId,
            status: 'OPEN',
        });

        return res.status(201).json({
            message: 'Customization request created successfully',
            request: newRequest
        });

    } catch(error){
        console.error('Error creating customization request:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.getOpenCustomizationRequests = async (req, res) => {
    try{
        const userId = req.user.id;
        const artist = await Artist.findOne({where:{userId}});
        if(!artist){
            return res.status(403).send({message: 'You are not authorized to view customization requests'});
        }
        const requests = await CustomizationRequest.findAll({where:{status: 'OPEN'}});
        return res.status(200).json(requests);
    }catch(error){
        res.status(500).send({message: error.message});
    }
};

exports.closeCustomizationRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).send({ message: 'You are not authorized to close customization requests' });
        }

        const requestId = req.params.requestId;
        const request = await CustomizationRequest.findOne({
            where: { 
                requestId: requestId,
                customerId: customer.customerId 
            }
        });

        if (!request) {
            return res.status(404).send({ message: 'Request not found or you are not authorized to close this request' });
        }

        if (request.status === 'CLOSED') {
            return res.status(400).send({ message: 'Request is already closed' });
        }
        await request.update({ status: 'CLOSED' });
        const declinedCount = await autoDeclinePendingResponses(requestId);

        return res.status(200).json({
            message: 'Customization request closed successfully',
            requestId: request.requestId,
            status: 'CLOSED',
            autoDeclinedResponses: declinedCount
        });

    } catch (error) {
        console.error('Error closing customization request:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.getCustomerCustomizationRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.status(403).send({ message: 'You are not authorized to view customization requests' });
        }

        const requests = await CustomizationRequest.findAll({
            where: { customerId: customer.customerId },            
            include: [
                {
                    model: CustomizationResponse,
                    attributes: ['responseId', 'status', 'price', 'createdAt'],
                    include: [
                        {
                            model: Artist,
                            attributes: ['username', 'profilePicture']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(requests);
    } catch (error) {
        console.error('Error getting customer customization requests:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};