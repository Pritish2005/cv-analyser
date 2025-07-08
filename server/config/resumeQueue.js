// import { Queue } from 'bullmq';
const {Queue} = require('bullmq');
// import { createClient } from 'redis';
const redisClient= require( './redisClient');  


// const connection = createClient({ url: 'redis://localhost:6379' });
// await connection.connect();


const resumeQueue = new Queue('resume-processing',{
    connection:{
        host: 'localhost',
        port: 6379,
    }
    }
    );

module.exports = resumeQueue;