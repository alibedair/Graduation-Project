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

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({categories});
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({message: error.message});
    }
}