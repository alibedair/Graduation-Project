const customer = require('../models/customer');

exports.updateProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const {name,username, phone, address} = req.body;
        if(!name || !phone || !address || !username){
            return res.status(400).json({message: "Please fill all fields"});
        }
        const existingCustomer = await customer.findOne({where: {username}});
        if(existingCustomer){
            existingCustomer.name = name;
            existingCustomer.phone = phone;
            existingCustomer.address = address;
            existingCustomer.username = username;
            await existingCustomer.save();
            return res.status(200).json({existingCustomer});
        }
        
        const customerProfile = await customer.create({name, phone, address, username, userId});
        return res.status(201).json({customerProfile});

    }catch(error){
        console.error("Error creating customer profile:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

exports.getProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const customerProfile = await customer.findOne({where: {userId}});
        if(!customerProfile){
            return res.status(404).json({message: "Customer profile not found"});
        }
        return res.status(200).json({customerProfile});
    }catch(error){
        console.error("Error getting customer profile:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};