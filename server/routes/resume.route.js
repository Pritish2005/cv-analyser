const express= require("express");
const { handleResumeUpload } = require("../controller/resume.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router=express.Router()

router.post('/resume',upload.single('resume'),authMiddleware,handleResumeUpload)
router.get('/resume')                
router.get('/resume/:hashId')        
router.delete('/resume/:hashId')     
router.post('/match-job')           
module.exports=router

