const Product = require('../models/productModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name profilePic role bio originLocation sellerProfile email phone')
            .sort({ createdAt: -1 });

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
        let imageUrl = req.body.images?.[0]?.url;

        if (imageUrl && !imageUrl.startsWith('http')) {
            const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
                folder: "artify_studio_products",
            });

            req.body.images[0].url = uploadedResponse.secure_url;
            req.body.images[0].public_id = uploadedResponse.public_id;
        }

        const videoUrl = req.body.videos?.[0]?.url;

        if (videoUrl && !videoUrl.startsWith('http')) {
            const uploadedVideo = await cloudinary.uploader.upload(videoUrl, {
                folder: "artify_studio_products/videos",
                resource_type: "video"
            });

            req.body.videos[0].url = uploadedVideo.secure_url;
            req.body.videos[0].public_id = uploadedVideo.public_id;
            req.body.videos[0].duration = uploadedVideo.duration;
        }

        const product = await Product.create(req.body);

        if (req.body.seller && (req.body.sellerStoreName || req.body.location || req.body.sellerProfession)) {
            await User.findByIdAndUpdate(req.body.seller, {
                $set: {
                    'sellerProfile.storeName': req.body.sellerStoreName || '',
                    'sellerProfile.sellerCategory': req.body.sellerProfession || 'Creator & Artisan',
                    'sellerProfile.location': req.body.location || '',
                    'sellerProfile.latitude': req.body.latitude || null,
                    'sellerProfile.longitude': req.body.longitude || null
                }
            }).catch(err => console.log('Seller profile sync error:', err.message));
        }

        res.status(201).json({ success: true, message: "Product Created like a Pro!", product });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                if (image.public_id) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }
        }

        if (product.videos && product.videos.length > 0) {
            for (const video of product.videos) {
                if (video.public_id) {
                    await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product Deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete error", error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name profilePic role bio originLocation sellerProfile email phone');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Single Product Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.getProductsBySeller = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.params.sellerId })
            .populate('seller', 'name profilePic role bio originLocation sellerProfile')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user products" });
    }
};
