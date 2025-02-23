const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        const category = await Category.create({name});

        res.status(201).json({category});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}