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
        const sellerId = req.user?._id || req.user?.id || req.body.seller;
        const productPayload = { ...req.body, seller: sellerId };

        let imageUrl = productPayload.images?.[0]?.url;

        if (imageUrl && !imageUrl.startsWith('http')) {
            const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
                folder: "artify_studio_products",
            });

            productPayload.images[0].url = uploadedResponse.secure_url;
            productPayload.images[0].public_id = uploadedResponse.public_id;
        }

        const videoUrl = productPayload.videos?.[0]?.url;

        if (videoUrl && !videoUrl.startsWith('http')) {
            const uploadedVideo = await cloudinary.uploader.upload(videoUrl, {
                folder: "artify_studio_products/videos",
                resource_type: "video"
            });

            productPayload.videos[0].url = uploadedVideo.secure_url;
            productPayload.videos[0].public_id = uploadedVideo.public_id;
            productPayload.videos[0].duration = uploadedVideo.duration;
        }

        const product = await Product.create(productPayload);

        if (sellerId && (productPayload.sellerStoreName || productPayload.location || productPayload.sellerProfession)) {
            await User.findByIdAndUpdate(sellerId, {
                $set: {
                    'sellerProfile.storeName': productPayload.sellerStoreName || '',
                    'sellerProfile.sellerCategory': productPayload.sellerProfession || 'Creator & Artisan',
                    'sellerProfile.location': productPayload.location || '',
                    'sellerProfile.latitude': productPayload.latitude || null,
                    'sellerProfile.longitude': productPayload.longitude || null
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

        const userId = (req.user?._id || req.user?.id)?.toString();
        if (product.seller && product.seller.toString() !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this product" });
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
