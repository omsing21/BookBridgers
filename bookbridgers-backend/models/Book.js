const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  borrower: { type: String, default: '' },
  adminVerified: { type: Boolean, default: true },
});

module.exports = mongoose.model('Book', bookSchema);
