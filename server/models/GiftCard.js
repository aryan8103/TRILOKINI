const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  amounts: {
    type: [{ type: Number, min: 1 }],
    required: true,
    validate: {
      validator: (amounts) => Array.isArray(amounts) && amounts.length > 0,
      message: 'Add at least one gift card value.',
    },
  },
  minAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: function (value) {
        const minAmount = typeof this.get === 'function' ? this.get('minAmount') : this.minAmount;
        return minAmount == null || value >= minAmount;
      },
      message: 'Maximum amount must be greater than or equal to the minimum amount.',
    },
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

giftCardSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('GiftCard', giftCardSchema);