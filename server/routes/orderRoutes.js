const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.route('/')
  .get(orderController.getAll)
  .post(orderController.create);

router.get('/number/:orderNumber', orderController.getByOrderNumber);

router.route('/:id')
  .get(orderController.getById);

router.patch('/:id/status', orderController.updateStatus);

module.exports = router;
