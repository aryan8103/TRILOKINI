const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculateLineItem } = require('./pricingController');

function generateOrderNumber(prefix = 'ORD') {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}

const getAll = async (req, res) => {
  try {
    const { email, mobile } = req.query;
    const filter = {};
    if (email) filter.customerEmail = email;
    if (mobile) filter.customerMobile = mobile;

    const orders = await Order.find(filter)
      .populate('items.product', 'title designerName imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title designerName imageUrl productCode');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByOrderNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'title designerName imageUrl productCode');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { customerName, customerEmail, customerMobile, items, discount = 0 } = req.body;

    if (!customerEmail || !customerMobile || !items?.length) {
      return res.status(400).json({ message: 'Email, mobile, and items are required' });
    }

    const resolvedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      const lineItem = calculateLineItem(product, {
        size: item.size,
        bottomSize: item.bottomSize,
        colorIndex: item.colorIndex ?? 0,
        addons: item.addons ?? [],
        quantity: item.quantity ?? 1,
      });

      if (item.unitPrice !== undefined && Math.abs(item.unitPrice - lineItem.unitPrice) > 0.01) {
        return res.status(400).json({
          message: `Price mismatch for ${product.title}. Server price: ${lineItem.unitPrice}`,
        });
      }

      resolvedItems.push({
        product: product._id,
        productTitle: lineItem.productTitle,
        designerName: lineItem.designerName,
        imageUrl: lineItem.imageUrl,
        size: lineItem.size,
        bottomSize: lineItem.bottomSize,
        color: lineItem.color,
        addons: lineItem.addons,
        unitPrice: lineItem.unitPrice,
        quantity: lineItem.quantity,
        lineTotal: lineItem.lineTotal,
      });
      subtotal += lineItem.lineTotal;
    }

    const shipping = subtotal > 0 ? 200 : 0;
    const total = subtotal - discount + shipping;

    const order = await Order.create({
      orderNumber: generateOrderNumber('ORD'),
      customerName,
      customerEmail,
      customerMobile,
      items: resolvedItems,
      subtotal,
      shipping,
      discount,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) {
      order.status = status;
      order.statusHistory.push({ status, note });
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, getById, getByOrderNumber, create, updateStatus };
