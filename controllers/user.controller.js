const User = require("../models/user.model");
const generateToken = require("../utils/generateToken.utils");

// create a new user  

const createUser = async (req, res) => {
    try {
        const userDetail = req.body;
        const newUser = new User(userDetail);
        const savedUser = await newUser.save();

        res.status(201).json({ message: "User created successfully", user: savedUser })
    } catch (error) {
        res.status(400).json({ message: "Bad Request", error: error.message });
    }
}


// get all users 
const getUser = async (req, res) => {
    const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc', search } = req.query;
    try {
        //convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber

        // create the search query based n the search parameters
        const searchQuery = search ? {
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } }
            ]
        } : {}

        // Creating the sorting criteria
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        const sortOption = { [sortField]: sortOrderValue };

        // Retrive users based on pagination, sorting, and search criteria
        const users = await User.find(searchQuery).sort(sortOption).skip(skip).limit(limitNumber);

        //count the tota number of users 
        const totalUser = await User.countDocuments(searchQuery);

        res.status(200).json({
            totalUser,
            totalPages: Math.ceil(totalUser / limitNumber),
            currentPage: pageNumber,
            users
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Login the user 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "email and password required" })
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User does not exits" });
    }

    if (password !== user.password) {
        return res.status(400).json({ message: `Wrong password` })
    }


    try {
        const token = generateToken({
            userId: user._id,
            username: user.username,
            email: user.email
        })

        res.status(200).json({
            message: "Login successful",
            isAdmin: user.isAdmin,
            token,
            user
        })
    } catch (error) {
        res.status(500).send({ message: "Internel server error", error })
    }
}


// update a user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User id is required." });
        }
        const userData = req.body;
        const userID = req.user._id;

        //find logged in user
        const logedInUser = await User.findById(userID)
        if (!logedInUser) {
            return res.status(404).json({ error: "Logged-in user not found." });
        }

        // Check if the logged in user is an admin
        if (logedInUser.isAdmin) {
            //admin can update any user
            // Find the user to update
            const updateUser = await User.findByIdAndUpdate(id, userData, { new: true });

            if (!updateUser) {
                return res.status(404).json({ message: "User not found" })
            }

            return res.status(200).json({ message: "user updated successfully", user: updateUser })
        }

        // For regular users who are not admins, ensure that the logged-in user can only update their own data
        if (id === userID.toString()) {
            // Find the user to update
            const updateUser = await User.findByIdAndUpdate(id, userData, { new: true });

            if (!updateUser) {
                return res.status(404).json({ message: "User not found" })
            }

            return res.status(200).json({ message: "user updated successfully", user: updateUser })
        }
        else {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

// Delete a User by ID,
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User id is required." });
        }

        const userID = req.user._id;

        //find logged in user
        const logedInUser = await User.findById(userID)
        if (!logedInUser) {
            return res.status(404).json({ error: "Logged-in user not found." });
        }

        // Check if the logged in user is an admin
        if (logedInUser.isAdmin) {
            //admin can delete any user
            // Find the user to delete
            const deletedUser = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" })
            }

            return res.status(200).json({ message: "user Deleted successfully", user: updateUser })
        }

        // If not an admin, ensure that the logged-in user can only delete their own data
        if (id === userID.toString()) {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" })
            }

            return res.status(200).json({ message: "user Deleted successfully", user: updateUser })
        }
        else {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

module.exports = { createUser, getUser, loginUser, updateUser, deleteUser };