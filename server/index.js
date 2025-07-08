require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const authRoute= require('./routes/user.route.js');
const resumeRoute= require('./routes/resume.route.js');
// import rateLimit from 'express-rate-limit';
const rateLimit = require('express-rate-limit');

const app = express();
app.use(dotenv.config());
app.use(cors());
app.use(express.json());

const limiter=rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 1, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again after later",
})

app.use('/api/auth',authRoute)
app.use('/api/resume', resumeRoute)

mongoose.connect(process.env.MONGODB_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

