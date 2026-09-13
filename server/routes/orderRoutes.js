const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');

const { requireAuth } = require('../middleware/auth');

// Make requireAuth optional for GET / (so admin works without auth, but user account can send it)
router.post('/create-razorpay-order', requireAuth, paymentController.createRazorpayOrder);
router.post('/verify-payment', requireAuth, paymentController.verifyPayment);

router.route('/')
  .get(orderController.getAll)
  .post(orderController.create);

router.get('/number/:orderNumber', orderController.getByOrderNumber);

router.route('/:id')
  .get(orderController.getById);

router.patch('/:id/status', orderController.updateStatus);

module.exports = router;
