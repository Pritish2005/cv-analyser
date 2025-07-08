const { getModelReponse } = require('../config/gemini.config.js');
const { v4: uuidv4 } = require('uuid');
const PdfParse = require('pdf-parse');
const resumeModel = require('../model/resume.model.js');
const crypto = require('crypto');
const redisClient = require('../config/redisClient.js');
const resumeQueue=require( '../config/resumeQueue.js'); 

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const generateResumeHash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

const handleResumeUpload = async (req, res) => {
  try {
    // Parse PDF text
    const data = await PdfParse(req.file.buffer);
    if (!data.text || data.text.trim() === '') {
      throw new Error('Could not extract text from PDF');
    }

    // Generate hash
    const resumeHash = generateResumeHash(data.text);
    const redisKey = `feedback:${req.userId}:${resumeHash}`;

    // Redis Cache
    const cachedFeedback = await redisClient.get(redisKey);
    if (cachedFeedback) {
      return res.status(200).json({
        status: 'cached',
        // feedback: JSON.parse(cachedFeedback),
        source: 'redis',
        hash: resumeHash
      });
    }

    // MongoDB
    const existing = await resumeModel.findOne({ hash: resumeHash, userId: req.userId });
    if (existing) {
      // Storing in Redis for next time
      await redisClient.setEx(redisKey, 60, 'checking redis client' ); // TTL
      return res.status(200).json({
        status: 'cached',
        feedback: existing.feedback,
        source: 'mongo',
        hash: resumeHash
      });
    }

    if(!existing){
      // const analysis=await getModelReponse(data)
      // console.log('analysis',analysis)
      const dummyFeedback={
        score:0,
        strengths:["test"],
        improvements:["test"]
      }
      const newAnalysis= new resumeModel({
        id:uuidv4(),
        userId: req.userId,
        feedback:dummyFeedback,
        resumeHash: resumeHash,
        status: 'processing',
      });

      
      await resumeModel.create(newAnalysis);

      console.log('data before queue',data)

      await resumeQueue.add('analyze-resume', {
        userId: req.userId,
        hash: resumeHash,
        resumeData: data
      });

      
      
      // await redisClient.setEx(redisKey, 60, 'checking redis client' ); // TTL
      
      return res.status(202).json({
        status: 'queued',
        message: 'Resume uploaded and queued for analysis.',
        hash: resumeHash
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports={handleResumeUpload}