const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');


    if (!token) {
        return res.status(400).json({ message: "Authorization token not found" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) {
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Setting the user object in the request for future use in route handlers
            req.user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            };
            next();
        }
        else {
            return res.status(401).json({ message: "Invaid token or token NOT FOUND" });
        }
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        else {
            return res.status(500).json({ message: "server Error" });
        }
    }
}


module.exports = authenticateUser;