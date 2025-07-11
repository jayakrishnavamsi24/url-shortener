const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  clicks: { type: Number, default: 0 }
});

module.exports = mongoose.model('Url', UrlSchema);
