const CustomOrder = require('../models/CustomOrder');
const Product = require('../models/Product');

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CTO-${ts}${rand}`;
}

const getAll = async (req, res) => {
  try {
    const { email, mobile } = req.query;
    const filter = {};
    if (email) filter.customerEmail = email;
    if (mobile) filter.customerMobile = mobile;

    const orders = await CustomOrder.find(filter)
      .populate('product', 'title designerName imageUrl productCode')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id)
      .populate('product', 'title designerName imageUrl productCode variants');
    if (!order) return res.status(404).json({ message: 'Custom order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByOrderNumber = async (req, res) => {
  try {
    const order = await CustomOrder.findOne({ orderNumber: req.params.orderNumber })
      .populate('product', 'title designerName imageUrl productCode variants');
    if (!order) return res.status(404).json({ message: 'Custom order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const {
      productId,
      color,
      colorIndex = 0,
      unit = 'inches',
      measurements,
      customerEmail,
      customerMobile,
    } = req.body;

    if (!productId || !customerEmail || !customerMobile || !measurements) {
      return res.status(400).json({ message: 'Product, email, mobile, and measurements are required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.customTailoringEnabled) {
      return res.status(400).json({ message: 'Custom tailoring is not available for this product' });
    }

    const variant = product.variants?.[colorIndex];

    const order = await CustomOrder.create({
      orderNumber: generateOrderNumber(),
      product: product._id,
      productTitle: product.title,
      designerName: product.designerName,
      imageUrl: product.imageUrl || variant?.images?.[0],
      color: color || variant?.color,
      unit,
      measurements,
      customerEmail,
      customerMobile,
      status: 'submitted',
      paymentStatus: 'not_required',
      statusHistory: [{ status: 'submitted', note: 'Custom order submitted' }],
      messages: [{
        sender: 'customer',
        text: 'Custom tailoring request submitted with measurements.',
      }],
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const setPrice = async (req, res) => {
  try {
    const { quotedPrice, note } = req.body;
    if (!quotedPrice || quotedPrice <= 0) {
      return res.status(400).json({ message: 'Valid quoted price is required' });
    }

    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Custom order not found' });

    order.quotedPrice = quotedPrice;
    order.finalPrice = quotedPrice;
    order.status = 'price_set';
    order.paymentStatus = 'pending';
    order.statusHistory.push({ status: 'price_set', note: note || `Price set to ₹${quotedPrice}` });
    order.messages.push({
      sender: 'admin',
      text: note || `Your custom order price has been set to ₹${quotedPrice.toLocaleString('en-IN')}. Please proceed with payment.`,
    });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;
    if (!sender || !text) {
      return res.status(400).json({ message: 'Sender and text are required' });
    }

    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Custom order not found' });

    order.messages.push({ sender, text });
    if (sender === 'admin' && order.status === 'submitted') {
      order.status = 'under_review';
      order.statusHistory.push({ status: 'under_review', note: 'Admin responded' });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, note, paymentStatus } = req.body;
    const order = await CustomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Custom order not found' });

    if (status) {
      order.status = status;
      order.statusHistory.push({ status, note });
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  getByOrderNumber,
  create,
  setPrice,
  addMessage,
  updateStatus,
};
