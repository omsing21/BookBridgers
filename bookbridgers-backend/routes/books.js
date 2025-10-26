const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BorrowRequest = require('../models/BorrowRequest');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get all books
router.get('/', async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// Borrow a book
router.post('/borrow/:id', protect, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const existingRequest = await BorrowRequest.findOne({ studentId: req.user._id, bookId: book._id, status: 'Pending' });
  if (existingRequest) return res.status(400).json({ message: 'Request already pending' });

  const request = await BorrowRequest.create({
    studentId: req.user._id,
    studentName: req.user.name,
    bookId: book._id,
    bookTitle: book.title,
  });

  res.json(request);
});

module.exports = router;
