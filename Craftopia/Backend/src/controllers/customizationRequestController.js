const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const uploadBuffer = require('../utils/cloudinaryUpload');


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