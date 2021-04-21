const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    id: Number, 
    name: String,
    authors: String, 
    published_on: String,
    volume: Number,
    categoryId: Number,
    quantity: Number
}, { timestamps: true,collection: 'Books' });

module.exports = mongoose.model('Books', BookSchema);;