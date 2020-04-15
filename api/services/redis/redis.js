const { RedisPubSub } = require("graphql-redis-subscriptions");
const { RedisCache } = require("apollo-server-cache-redis");
const Redis = require("ioredis");

const redisCache = new RedisCache(process.env.REDIS_URL);
const redisPubSub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL),
  subscriber: new Redis(process.env.REDIS_URL),
});
const redisClient = new Redis(process.env.REDIS_URL);

module.exports = {
  redisCache,
  redisPubSub,
  redisClient,
};
