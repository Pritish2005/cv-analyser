const { createClient } = require('redis');

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

const runRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.log('Redis connection error', err);
  }
};

runRedis();

module.exports = redisClient;
