const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: { type: String },
  geo: { type: String }
}, { _id: false });

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortString: { type: String, required: true, unique: true },
  expireAt: { type: Date, required: true },
  clickCount: { type: Number, default: 0 },
  clicks: [clickSchema]
});

urlSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema); 