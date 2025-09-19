const { Queue } = require('bullmq');

const resumeQueue = new Queue('resume-processing', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    // automatically try to reconnect
    maxRetriesPerRequest: null,
  }
});

module.exports = resumeQueue;
