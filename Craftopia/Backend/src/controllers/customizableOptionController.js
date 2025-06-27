const { CustomizableOption, Product, Artist} = require('../models');
const { validationResult } = require('express-validator');

exports.addCustomizableOption = async (req, res) => {
    try {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { optionName, optionPrice, productId } = req.body;

        if (!req.user || req.user.role !== 'artist') {
            return res.status(403).json({ error: 'Only artists can add customizable options' });
        }

        const artist = await Artist.findOne({ where: { userId: req.user.id } });
        if (!artist) {
            return res.status(404).json({ error: 'Artist profile not found' });
        }

        let product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.artistId !== artist.artistId) {
            return res.status(403).json({ error: 'You can only add options to your own products' });
        }

        const newOption = await CustomizableOption.create({
            optionName,
            optionPrice,
            productId
        });
        
        const currentPrice = parseFloat(product.price);
        const additionalPrice = parseFloat(optionPrice);
        product.price = parseFloat((currentPrice + additionalPrice).toFixed(2));
        product.isCustomizable = true; 
        await product.save(); 
         
        res.status(201).json({
            newOption,
            message: 'Customizable option added successfully'
        });
    } catch (error) {
        console.error('Error adding customizable option:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCustomizableOptions = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const options = await CustomizableOption.findAll({
            where: { productId }
        });

        if (options.length === 0) {
            return res.status(404).json({ message: 'No customizable options found for this product' });
        }

        res.status(200).json(options);
    } catch (error) {
        console.error('Error fetching customizable options:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.removeCustomizableOption = async (req, res) => {
    try {
        const { optionId } = req.params;

 
        if (!req.user || req.user.role !== 'artist') {
            return res.status(403).json({ error: 'Only artists can remove customizable options' });
        }

        const artist = await Artist.findOne({ where: { userId: req.user.id } });
        if (!artist) {
            return res.status(404).json({ error: 'Artist profile not found' });
        }
        
        const option = await CustomizableOption.findByPk(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Customizable option not found' });
        }

        const product = await Product.findByPk(option.productId);
        if (!product) {
            return res.status(404).json({ message: 'Associated product not found' });
        }
     
        if (product.artistId !== artist.artistId) {
            return res.status(403).json({ error: 'You can only remove options from your own products' });
        }

        const currentPrice = parseFloat(product.price);
        const optionPriceValue = parseFloat(option.optionPrice);
        product.price = parseFloat((currentPrice - optionPriceValue).toFixed(2));
        
        const remainingOptions = await CustomizableOption.count({
            where: { 
                productId: option.productId,
                optionId: { [require('sequelize').Op.ne]: optionId }
            }
        });
        
        if (remainingOptions === 0) {
            product.isCustomizable = false;
        }
        
        await product.save();

        await option.destroy();
        res.status(200).json({ message: 'Customizable option removed successfully' });
    } catch (error) {
        console.error('Error removing customizable option:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


