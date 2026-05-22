const fetchIncidentsByLocation = require("../services/gdeltService");
const calculateRiskAssessment = require("../services/riskScoringService");
const logger = require("../utils/logger");

const predictRisk = async (req, res) => {
    try {
        const { city, state, country } = req.query;

        logger.info(
            `Risk prediction request received for location: ${city}, ${state}, ${country}`
        );

        if (!city || !city.trim()) {
            logger.warn("Prediction request missing city");

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

        const normalizedLocation =
            `${locationData.city} ${locationData.state} ${locationData.country}`.trim();

        const riskAssessment = calculateRiskAssessment(
            normalizedLocation,
            incidents
        );

        logger.info(
            `Risk prediction completed for ${normalizedLocation}`
        );

        return res.status(200).json({
            success: true,
            data: {
                ...riskAssessment,
                incidents
            }
        });

    } catch (error) {
        logger.error(`Prediction controller failed: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Risk prediction failed"
        });
    }
};

module.exports = {
    predictRisk
};