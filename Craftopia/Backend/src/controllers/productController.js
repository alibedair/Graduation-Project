const Product = require('../models/product');
const Category = require('../models/category');
const Artist = require('../models/artist');
const uploadBuffer = require('../utils/cloudinaryUpload');

exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const artist = await Artist.findOne({where:{userId}});
        if(!artist) {
            return res.status(400).json({message: 'You are not authorized to create a product'});
        }
        const {name, description, price, categoryName ,quantity} = req.body;
        if(!name || !description || !price || !categoryName || !quantity) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        let image=null;

        if(req.files) {
            if(req.files.image){
                const imageFile = req.files.image[0];
                const result = await uploadBuffer(imageFile.buffer, {
                    folder: 'products/images',
                    resource_type: 'image'
                });
                image = result.secure_url;
            }
        }

        const category = await Category.findOne({where:{name:categoryName}});
        if(!category) {
            return res.status(400).json({message: 'Category does not exist'});
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            categoryId : category.categoryId,
            artistId: artist.artistId,
            quantity
        });

        res.status(201).json({product});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}