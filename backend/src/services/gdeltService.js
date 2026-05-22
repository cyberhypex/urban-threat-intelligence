const axios = require("axios");
const IncidentDTO = require("../dtos/IncidentDTO");
const classifyIncident = require("./classificationService");
const logger = require("../utils/logger");

const GDELT_BASE_URL = process.env.GDELT_BASE_URL;

const fetchIncidentsByLocation = async (location) => {
    try {
        logger.info(`Incident fetch request received for location: ${location}`);

        if (!location || !location.trim()) {
            logger.warn("Location validation failed");
            throw new Error("Location is required");
        }
        logger.info(`GDELT BASE URL: ${GDELT_BASE_URL}`);

        if (!GDELT_BASE_URL) {
            logger.error("GDELT base URL missing in environment variables");
            throw new Error("GDELT configuration missing");
        }

        const normalizedLocation = location.trim();

        const query = `${normalizedLocation} crime `;

        logger.info(`Generated GDELT query: ${query}`);

        const response = await axios.get(GDELT_BASE_URL, {
          //  timeout:10000,
            params: {
                
                query,
                mode: "ArtList",
                format: "json",
                maxrecords: 20,
                timespan: "7d"
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

        return incidents;

    } catch (error) {
        logger.error(`GDELT service failed: ${error.message}`);
        throw error;
    }
};

module.exports = fetchIncidentsByLocation;