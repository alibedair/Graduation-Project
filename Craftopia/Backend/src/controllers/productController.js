const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    }
  });

const upload = multer({ storage});

exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, description, quantity } = req.body;
    const image = req.file ? req.file.path : null;
    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const newProduct = await Product.create({
        name,
        price,
        categoryId,
        description,
        image,
        quantity
    });

    return res.status(201).json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}