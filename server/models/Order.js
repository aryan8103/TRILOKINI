const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productTitle: { type: String, required: true },
  designerName: { type: String },
  imageUrl: { type: String },
  size: { type: String, required: true },
  bottomSize: { type: String },
  color: { type: String },
  addons: [{
    name: String,
    price: Number,
    size: String,
  }],
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  lineTotal: { type: Number, required: true },
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String },
  customerEmail: { type: String, required: true },
  customerMobile: { type: String, required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 200 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  trackingNumber: { type: String },
  statusHistory: [{
    status: String,
    note: String,
    at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
