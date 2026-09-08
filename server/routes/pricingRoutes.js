const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.post('/:productId/calculate-price', pricingController.calculatePrice);
router.post('/cart/calculate', pricingController.calculateCart);

module.exports = router;
