const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const User = require('../models/User');
const Book = require('../models/Book');
const { protect, admin } = require('../middleware/auth');

// Admin borrow requests
router.get('/borrow-requests', protect, admin, async (req, res) => {
  const requests = await BorrowRequest.find({}).sort({ requestedAt: -1 });
  res.json(requests);
});

// Update borrow request
router.post('/borrow-requests/:id', protect, admin, async (req, res) => {
  const request = await BorrowRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = req.body.status;
  await request.save();

  if (req.body.status === 'Approved') {
    const book = await Book.findById(request.bookId);
    book.borrower = request.studentName;
    await book.save();
  }

  res.json(request);
});

// Get users
router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = router;
