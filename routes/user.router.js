const express = require('express');
const { createUser, getUser, loginUser, updateUser, deleteUser } = require('../controllers/user.controller');
const validateUser = require('../middlewares/userInput.validator.middleware');
const authenticateUser = require('../middlewares/authentication.middeware');


const userRouter = express.Router();

userRouter.get("/", getUser)
userRouter.post("/login", loginUser)
userRouter.post("/", validateUser, createUser)
userRouter.patch("/:id", authenticateUser, validateUser, updateUser)
userRouter.delete("/:id", authenticateUser, deleteUser);



module.exports = userRouter;