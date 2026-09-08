const express = require('express');
const router = express.Router();
const customOrderController = require('../controllers/customOrderController');

router.route('/')
  .get(customOrderController.getAll)
  .post(customOrderController.create);

router.get('/number/:orderNumber', customOrderController.getByOrderNumber);

router.route('/:id')
  .get(customOrderController.getById);

router.patch('/:id/price', customOrderController.setPrice);
router.post('/:id/messages', customOrderController.addMessage);
router.patch('/:id/status', customOrderController.updateStatus);

module.exports = router;
