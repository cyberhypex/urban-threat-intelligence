const fetchIncidentsByLocation = require("../services/gdeltService");
const logger = require("../utils/logger");

const getIncidents = async (req, res) => {
    try {
        const { location } = req.query;

        logger.info(
            `Incoming incident API request for location: ${location}`
        );

        if (!location || !location.trim()) {
            logger.warn("Location query parameter missing");

            return res.status(400).json({
                success: false,
                message: "Location query parameter is required"
            });
        }

        const incidents = await fetchIncidentsByLocation(location);

        logger.info(
            `Returning ${incidents.length} incidents for ${location}`
        );

        return res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents
        });

    } catch (error) {
        logger.error(`Incident controller failed: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch incidents"
        });
    }
};

module.exports = {
    getIncidents
};