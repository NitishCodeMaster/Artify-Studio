const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/all', productController.getAllProducts);
router.post('/new', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);
router.get('/seller/:sellerId', productController.getProductsBySeller);

module.exports = router;