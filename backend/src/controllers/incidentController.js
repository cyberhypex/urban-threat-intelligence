const fetchIncidentsByLocation = require("../services/gdeltService");
const logger = require("../utils/logger");

const getIncidents = async (req, res) => {
    try {
        const { city, state, country } = req.query;

        logger.info(
            `Incoming incident API request for location: ${city}, ${state}, ${country}`
        );

        if (!city || !city.trim()) {
            logger.warn("City query parameter missing");

            return res.status(400).json({
                success: false,
                message: "City query parameter is required"
            });
        }

        const locationData = {
            city: city.trim(),
            state: state?.trim() || "",
            country: country?.trim() || ""
        };

        const incidents = await fetchIncidentsByLocation(locationData);

        logger.info(
            `Returning ${incidents.length} incidents for ${locationData.city}`
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