const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

const runRedis=async () => {
  await redisClient.connect();
  console.log('Redis connected');
}

runRedis();

module.exports = redisClient;
