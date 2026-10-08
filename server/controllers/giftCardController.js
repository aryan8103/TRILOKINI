const GiftCard = require('../models/GiftCard');
const createCrudController = require('../utils/crudFactory');

const crud = createCrudController(GiftCard, 'giftcards');

const getActive = async (_req, res) => {
  try {
    const cards = await GiftCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveById = async (req, res) => {
  try {
    const card = await GiftCard.findOne({ _id: req.params.id, isActive: true });
    if (!card) return res.status(404).json({ message: 'Gift card not found' });
    res.status(200).json(card);
  } catch (error) {
    res.status(404).json({ message: 'Gift card not found' });
  }
};

module.exports = { ...crud, getActive, getActiveById };