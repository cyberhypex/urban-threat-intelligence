const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const IncidentDTO = require("../dtos/IncidentDTO");
const classifyIncident = require("./classificationService");
const logger = require("../utils/logger");
const { redisClient } = require("../config/redisConfig");

const GDELT_BASE_URL = process.env.GDELT_BASE_URL;
const TIME_WINDOW = "4d";
const QUERY_CONTEXT = "threat";

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return (
            error.code === "ECONNRESET" ||
            error.code === "ETIMEDOUT" ||
            error.response?.status === 429
        );
    }
});

const fetchIncidentsByLocation = async (location) => {
    try {
        logger.info(`Incident fetch request received for location: ${location}`);

        if (!location || !location.trim()) {
            logger.warn("Location validation failed");
            throw new Error("Location is required");
        }

        if (!GDELT_BASE_URL) {
            logger.error("GDELT base URL missing in environment variables");
            throw new Error("GDELT configuration missing");
        }

        const normalizedLocation = location.trim();

        const cacheKey = `incidents:${normalizedLocation}:${TIME_WINDOW}:${QUERY_CONTEXT}`;

        logger.info(`Checking Redis cache for key: ${cacheKey}`);

        const cachedIncidents = await redisClient.get(cacheKey);

        if (cachedIncidents) {
            logger.info(`Cache hit for ${normalizedLocation}`);
            return cachedIncidents;
        }

        logger.info(`Cache miss for ${normalizedLocation}`);

        const query = `${normalizedLocation} AND (riot OR protest OR accident OR crime OR violence OR murder OR robbery OR fire OR flood)`;

        logger.info(`Generated GDELT query: ${query}`);

        const response = await axios.get(GDELT_BASE_URL, {
           // timeout: 10000,
            headers: {
                "User-Agent": "UrbanThreatIntelligence/1.0"
            },
            params: {
                query,
                mode: "ArtList",
                format: "json",
                maxrecords: 10,
                timespan: TIME_WINDOW
            }
        });

        logger.info("GDELT API call successful");

        const articles = response?.data?.articles || [];

        logger.info(
            `Received ${articles.length} raw articles from GDELT for ${normalizedLocation}`
        );

        const incidents = articles.map((article) => {
            const { category, severity } = classifyIncident(article.title);

            return new IncidentDTO(
                article,
                category,
                severity,
                normalizedLocation
            );
        });

        logger.info(
            `Successfully normalized ${incidents.length} incidents for ${normalizedLocation}`
        );

        await redisClient.set(cacheKey, incidents, {
            ex: 300
        });

        logger.info(
            `Cached ${incidents.length} incidents for ${normalizedLocation} for 5 minutes`
        );

        return incidents;

    } catch (error) {
        if (error.response?.status === 429) {
            logger.warn("GDELT rate limit exceeded");
            throw new Error("External provider rate limit exceeded");
        }

        logger.error(`GDELT service failed: ${error.message}`);
        throw error;
    }
};

module.exports = fetchIncidentsByLocation;