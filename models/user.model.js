const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                // Validate email format using a regular expression
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Invalid email address.',
        },
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (phone) {
                // validate if the phone number has exactly 10 ditigs
                return /^[0-9]{10}$/.test(phone);
            },
            message: "Phone number must be at least 10 ditigs number",
        }
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 12 }, // Minimum age is set to 12
    state: { type: String },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

