const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculateLineItem } = require('./pricingController');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_mock',
});

function generateOrderNumber(prefix = 'ORD') {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}

const createRazorpayOrder = async (req, res) => {
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

    // Create razorpay order
    const options = {
      amount: Math.round(total * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save pending order in DB
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
      razorpayOrderId: rzpOrder.id,
      statusHistory: [{ status: 'pending', note: 'Razorpay order created' }],
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    });
  } catch (error) {
    console.error("Error creating razorpay order:", error);
    res.status(400).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_mock';

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Transaction not legit!' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.statusHistory.push({ status: 'confirmed', note: 'Payment successful' });

    await order.save();

    res.json({ message: 'Payment successful', order });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
