const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  shoulder: Number,
  bust: Number,
  underBust: Number,
  armHole: Number,
  sleeveLength: Number,
  bicep: Number,
  elbow: Number,
  wrist: Number,
  waist: Number,
  lowerWaist: Number,
  hip: Number,
  topLength: Number,
  bottomLength: Number,
  kurtaLength: Number,
  frontNeckDepth: Number,
  backNeckDepth: Number,
  crotchLength: Number,
  thighCircumference: Number,
  kneeCircumference: Number,
  calfCircumference: Number,
  ankleCircumference: Number,
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['customer', 'admin'], required: true },
  text: { type: String, required: true },
  at: { type: Date, default: Date.now },
}, { _id: true });

const customOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productTitle: { type: String, required: true },
  designerName: { type: String },
  imageUrl: { type: String },
  color: { type: String },
  unit: { type: String, enum: ['inches', 'cms'], default: 'inches' },
  measurements: measurementSchema,
  customerEmail: { type: String, required: true },
  customerMobile: { type: String, required: true },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'price_set', 'payment_pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled'],
    default: 'submitted',
  },
  quotedPrice: { type: Number },
  finalPrice: { type: Number },
  paymentStatus: {
    type: String,
    enum: ['not_required', 'pending', 'paid', 'failed'],
    default: 'not_required',
  },
  messages: [messageSchema],
  statusHistory: [{
    status: String,
    note: String,
    at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
