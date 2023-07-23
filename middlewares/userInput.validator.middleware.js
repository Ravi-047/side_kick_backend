const User = require("../models/user.model");


const validateUser = async (req, res, next) => {
    const { username, email, phone, password, name, age } = req.body;

    if (req.method === "POST") {
        if (!username || !email || !phone || !password || !name || !age) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Validate phone number is 10 digits
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'Phone number must be 10 digits long' });
        }

        // Validate age minimum of 12
        if (age < 12) {
            return res.status(400).json({ error: 'Age must be at least 12 years' });
        }

    }

    if (req.method === "PATCH") {
        if (email) {
            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ error: 'Invalid email address' });
            }
        }

        if (phone) {
            // Validate phone number is 10 digits
            if (!/^\d{10}$/.test(phone)) {
                return res.status(400).json({ error: 'Phone number must be 10 digits long' });
            }
        }

        if (age) {
            // Validate age minimum of 12
            if (age < 12) {
                return res.status(400).json({ error: 'Age must be at least 12 years' });
            }
        }
    }


    // custom validation checks
    try {
        // check if username alreay exits in the database
        const existUsername = await User.findOne({ username });
        if (existUsername) {
            return res.status(400).json({ error: 'username already exits' });
        }

        // Check if email already exists in the database
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: 'Email already exits' });
        }

        // Check if phone number already exists in the database
        const existPhone = await User.findOne({ phone });
        if (existPhone) {
            return res.status(400).json({ error: 'Phone Number already exits' });
        }
    } catch (error) {
        return res.status(500).json({ error: "Someting went wrong 'Server Error'" })
    }

    next();
};

module.exports = validateUser;