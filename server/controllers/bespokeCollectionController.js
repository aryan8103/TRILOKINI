const BespokeCollection = require('../models/BespokeCollection');
const Product = require('../models/Product');
const createCrudController = require('../utils/crudFactory');
const { getRedisClient } = require('../config/redis');

const crud = createCrudController(BespokeCollection, 'bespokeCollections');

const clearCache = async () => {
  const redisClient = getRedisClient();
  if (!redisClient) return;

  const keys = [
    ...(await redisClient.keys('bespokeCollections:*')),
    ...(await redisClient.keys('products:*')),
  ];
  for (const key of keys) await redisClient.del(key);
};

const getActive = async (_req, res) => {
  try {
    const collections = await BespokeCollection.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const collection = await BespokeCollection.findOne({ _id: req.params.id, isActive: true });
    if (!collection) return res.status(404).json({ message: 'Bespoke collection not found' });

    const products = await Product.find({ bespokeCollection: collection._id, isActive: true })
      .populate('category', 'title')
      .sort({ homePageOrder: 1, createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOne = async (req, res) => {
  try {
    const deleted = await BespokeCollection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bespoke collection not found' });

    await Product.updateMany({ bespokeCollection: deleted._id }, { $unset: { bespokeCollection: 1 } });
    await clearCache();
    res.status(200).json({ message: 'Bespoke collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { ...crud, getActive, getProducts, deleteOne };