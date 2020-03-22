// TODO - Investigate if I can write one big redis middleware
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

module.exports = redis;
