const mongoose = require('mongoose');

// const mongooseUniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema({
    username: {type: String, required:true, index: true, unique: true},
    email: { type: String, required: true, index: true, unique: true }
}, {timestamps: true});

// UserSchema.plugin(mongooseUniqueValidator, {message: 'User already taken.'})
const User = mongoose.model('User', UserSchema);
module.exports = User;