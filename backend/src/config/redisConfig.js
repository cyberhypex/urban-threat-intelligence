const { Redis } = require("@upstash/redis");
const logger = require("../utils/logger");

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const connectRedis = async () => {
    try {
        await redisClient.ping();
        logger.info("Upstash Redis connected successfully");
    } catch (error) {
        logger.error(`Upstash Redis connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    redisClient,
    connectRedis
};