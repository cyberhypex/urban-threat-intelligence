const fetchIncidentsByLocation = require("../services/gdeltService");
const calculateRiskAssessment = require("../services/riskScoringService");
const logger = require("../utils/logger");

const predictRisk = async (req, res) => {
    try {
        const { location } = req.query;

        logger.info(
            `Risk prediction request received for location: ${location}`
        );

        if (!location || !location.trim()) {
            logger.warn("Prediction request missing location");

            return res.status(400).json({
                success: false,
                message: "Location query parameter is required"
            });
        }

        const normalizedLocation = location.trim();

        const incidents = await fetchIncidentsByLocation(normalizedLocation);

        const riskAssessment = calculateRiskAssessment(
            normalizedLocation,
            incidents
        );

        logger.info(
            `Risk prediction completed for ${normalizedLocation}`
        );

        return res.status(200).json({
            success: true,
            data: riskAssessment
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