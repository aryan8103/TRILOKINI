const express = require('express');
const router = express.Router();
const bespokeCollectionController = require('../controllers/bespokeCollectionController');

router.get('/active', bespokeCollectionController.getActive);
router.get('/:id/products', bespokeCollectionController.getProducts);

router.route('/')
  .get(bespokeCollectionController.getAll)
  .post(bespokeCollectionController.create);

router.route('/:id')
  .get(bespokeCollectionController.getById)
  .put(bespokeCollectionController.update)
  .delete(bespokeCollectionController.deleteOne);

module.exports = router;