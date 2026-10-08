const mongoose = require('mongoose');

const bespokeCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
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

bespokeCollectionSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('BespokeCollection', bespokeCollectionSchema);