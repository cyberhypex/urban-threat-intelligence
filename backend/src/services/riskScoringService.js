const SEVERITY_WEIGHTS = require("../constants/severityWeights");
const CATEGORY_WEIGHTS = require("../constants/categoyWeight");
const logger = require("../utils/logger");

const calculateRiskAssessment = (location, incidents) => {
    logger.info(`Calculating risk assessment for ${location}`);

    if (!incidents || incidents.length === 0) {
        logger.warn(`No incidents found for ${location}`);

        return {
            location,
            incidentCount: 0,
            riskScore: 0,
            verdict: "SAFE",
            confidence: "LOW"
        };
    }

    let totalRiskScore = 0;

    incidents.forEach((incident) => {
        const severityScore =
            SEVERITY_WEIGHTS[incident.severity] || 0;

        const categoryScore =
            CATEGORY_WEIGHTS[incident.category] || 0;

        const incidentScore = severityScore + categoryScore;

        totalRiskScore += incidentScore;

        logger.info(
            `Incident scored | Category=${incident.category} Severity=${incident.severity} Score=${incidentScore}`
        );
    });

    const riskScore = Math.round(
        totalRiskScore / incidents.length
    );

    let verdict = "SAFE";

    if (riskScore >= 60) {
        verdict = "HIGH RISK";
    } else if (riskScore >= 40) {
        verdict = "UNSAFE";
    } else if (riskScore >= 20) {
        verdict = "CAUTION";
    }

    let confidence = "HIGH";

    if (incidents.length < 3) {
        confidence = "LOW";
    } else if (incidents.length < 7) {
        confidence = "MEDIUM";
    }

    logger.info(
        `Risk assessment completed for ${location} | Score=${riskScore} Verdict=${verdict} Confidence=${confidence}`
    );

    return {
        location,
        incidentCount: incidents.length,
        riskScore,
        verdict,
        confidence
    };
};

module.exports = calculateRiskAssessment;