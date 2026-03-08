const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/all', productController.getAllProducts);
router.post('/new', productController.createProduct);

module.exports = router;