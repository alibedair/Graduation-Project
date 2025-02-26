const CustomizationRequest = require('../models/customizationRequest');
const Artist = require('../models/artist');
const Customer = require('../models/customer');
const uploadBuffer = require('../utils/cloudinaryUpload');


exports.createCustomizationRequest = async (req, res) => {
    try{
        const userId = req.user.id;
        const customer = await Customer.findOne({where:{userId}});
        if(!customer){
            return res.status(403).send({message: 'You are not authorized to create a customization request'});
        }

        const {description, budget, title} = req.body;
        if(!description || !budget || !title){
            return res.status(400).send({message: 'Please provide all required fields'});
        }

        let image = null;

        const file = req.file;
        if(file){
            const result = await uploadBuffer(file.buffer, {
                folder: `customers/${customer.customerId}/customizationRequests`,
                resource_type: 'image'
            });
            image= result.secure_url;
        }

        
        const newRequest = new CustomizationRequest({
            requestDescription : description,
            budget,
            title,
            image,
            customerId: customer.customerId,
            status: 'OPEN',
        });

        await newRequest.save();

        return res.status(201).json({
            message: 'Customization request created successfully',
            request: newRequest
        })

    }catch(error){
        res.status(500).send({message: error.message});
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