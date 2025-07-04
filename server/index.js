require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const authRoute= require('./routes/user.route.js');
const resumeRoute= require('./routes/resume.route.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoute)
app.use('/api/resume',resumeRoute)

mongoose.connect(process.env.MONGODB_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));