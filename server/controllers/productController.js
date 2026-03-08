const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Products error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, message: "Product Added Successfully!", product });
    } catch (error) {
        console.error("Product add karne me error:", error);
        res.status(500).json({ success: false, message: "Error adding product", error: error.message });
    }
};