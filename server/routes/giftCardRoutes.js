const express = require('express');
const router = express.Router();
const giftCardController = require('../controllers/giftCardController');

router.get('/active', giftCardController.getActive);
router.get('/active/:id', giftCardController.getActiveById);

router.route('/')
  .get(giftCardController.getAll)
  .post(giftCardController.create);

router.route('/:id')
  .get(giftCardController.getById)
  .put(giftCardController.update)
  .delete(giftCardController.deleteOne);

module.exports = router;