const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const resumeModel = require('../model/resume.model.js');
require('dotenv').config();
const { getModelReponse } = require('../config/gemini.config.js');
const redisClient = require('../config/redisClient.js');


async function main() {
  console.log('Worker starting...');
  
  try {
    // Await the mongoose connection here, inside an async function.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for worker.');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }

  const workerOptions = {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    }
  };

  const resumeWorker = new Worker(
    'resume-processing',
    async (job) => {
      const { userId, hash, resumeData } = job.data;
      console.log(`Processing job for ${userId}/${hash}`);

      try {
        const feedback = await getModelReponse(resumeData);
        
        // Update feedback in MongoDB
        await resumeModel.updateOne(
          { userId, hash },
          { 
            $set: {
              feedback: feedback.feedback,
              status: 'done',
            }
          }
        );

        // Store feedback in Redis cache
        const redisKey = `feedback:${userId}:${hash}`;
        await redisClient.setEx(redisKey, 120, JSON.stringify(feedback));

        console.log(`Resume analysis complete for: ${userId} / ${hash}`);
      } catch (err) {
        console.error(`Job processing failed for ${userId}/${hash}:`, err.message);

        await resumeModel.updateOne(
          { userId, hash },
          { $set: { status: 'failed' } }
        );
        throw err;
      }
    },
    workerOptions
  );

  resumeWorker.on('completed', (job) => {
    console.log(`Job completed in worker: ${job.data.userId}/${job.data.hash}`);
  });

  resumeWorker.on('failed', (job, err) => {
    console.error(`Job failed in worker: ${job.data.userId}/${job.data.hash}`, err.message);
  });

  console.log('Resume worker is listening for jobs...');
}
main().catch(err => {
  console.error("Error starting worker:", err);
  process.exit(1);
});
