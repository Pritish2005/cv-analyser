const {Worker}= require('bullmq');
const mongoose = require('mongoose');
const resumeModel = require('../model/resume.model.js');
const { getModelReponse } = require('../config/gemini.config.js');
const redisClient = require('../config/redisClient.js');

// console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI);

const resumeWorker = new Worker(
    'resume-processing',
  async (job) => {
    const { userId, hash, resumeData } = job.data;

    try {
        console.log('from the worker',resumeData)
      const feedback = await getModelReponse(resumeData);
        
       await resumeModel.updateOne(
        { userId, hash },
        { 
          $set: {
            feedback: feedback.feedback,
            status: 'done',
            // updatedAt: new Date()
          }
        }
      );

      const redisKey = `feedback:${userId}:${hash}`;
      await redisClient.setEx(redisKey, 120, JSON.stringify(feedback)); // TTL

      console.log(`Resume analyzed: ${userId} / ${hash}`);
      } catch (err) {
      console.error(`Job failed for ${userId}/${hash}:`, err.message);

      await resumeModel.updateOne(
        { userId, hash },
        { $set: { status: 'failed' } }
      );
      
    }
},{
    connection: {
      host: 'localhost',
      port: 6379
    }
  }
);

  resumeWorker.on('completed', (job) => {
    console.log(`Job completed for ${job.data.userId}/${job.data.hash}`);
  });

  resumeWorker.on('failed', (job, err) => {
    console.error(`Job failed for ${job.data.userId}/${job.data.hash}:`, err.message);
  });
