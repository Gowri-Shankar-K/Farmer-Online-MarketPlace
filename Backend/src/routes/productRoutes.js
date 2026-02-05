const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes
router.use(protect);

router.post('/', authorize('farmer', 'admin'), productController.createProduct);
router.patch('/:id', authorize('farmer', 'admin'), productController.updateProduct);
router.delete('/:id', authorize('farmer', 'admin'), productController.deleteProduct);

// Admin only routes
router.patch('/:id/approve', authorize('admin'), productController.approveProduct);

module.exports = router;
