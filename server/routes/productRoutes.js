const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/all', productController.getAllProducts);
router.post('/new', authUser, productController.createProduct);
router.delete('/:id', authUser, productController.deleteProduct);
router.get('/seller/:sellerId', productController.getProductsBySeller);
router.get('/:id', productController.getProductById);

module.exports = router;
