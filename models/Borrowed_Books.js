const mongoose = require('mongoose');
const BorrowedBookSchema = new mongoose.Schema({
    bookId: Number,
    userId: Number,
    borrowed_on: Date,
    due_on: Date,
    returned_on: Date,
    is_active:Boolean
}, { timestamps: true, collection: 'BorrowedBooks' });
module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);