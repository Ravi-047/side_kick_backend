const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB.config');
const userRouter = require('./routes/user.router');

// PORT
const PORT = process.env.PORT || 8080;

// express app 
const app = express();

// necessary middleware
app.use(express.json());

// cors origin for all browsers
app.use(cors({
    origin: "*",
    credentials: true
}))

//home route
app.get("/", (req, res) => {
    res.send("Welcme to MERN User backend")
})


// All Routes
app.use("/users", userRouter)

//listening the backend server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`server is running on http://localhost:${PORT}`);
})

//done