const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('buyer'), orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderDetails);
router.patch('/:id/status', authorize('farmer', 'admin'), orderController.updateOrderStatus);

module.exports = router;
