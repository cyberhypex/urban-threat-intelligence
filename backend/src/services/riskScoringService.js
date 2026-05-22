const SEVERITY_WEIGHTS = require("../constants/severityWeights");
const CATEGORY_WEIGHTS = require("../constants/categoyWeight");
const logger = require("../utils/logger");

const calculateRiskAssessment = (location, incidents) => {
  logger.info(`Calculating risk assessment for ${location}`);

  if (!incidents || incidents.length === 0) {
    return {
      location,
      incidentCount: 0,
      riskScore: 0,
      verdict: "SAFE",
      confidence: "HIGH",
    };
  }

  let totalRiskScore = 0;

  let safeCount = 0;
  let cautionCount = 0;
  let highRiskCount = 0;

  incidents.forEach((incident) => {
    const severityScore = SEVERITY_WEIGHTS[incident.severity] || 0;
    const categoryScore = CATEGORY_WEIGHTS[incident.category] || 0;

    const incidentScore = severityScore + categoryScore;

    totalRiskScore += incidentScore;

    if (incidentScore >= 15) {
      highRiskCount++;
    } else if (incidentScore >= 10) {
      cautionCount++;
    } else {
      safeCount++;
    }

    logger.info(
      `Incident scored | Category=${incident.category} Severity=${incident.severity} Score=${incidentScore}`
    );
  });

  const riskScore = Math.round(totalRiskScore / incidents.length);

  const highRiskPercentage = (highRiskCount / incidents.length) * 100;
  const safePercentage = (safeCount / incidents.length) * 100;

  let verdict = "CAUTION";

  if (highRiskPercentage >= 30) {
    verdict = "HIGH RISK";
  } else if (safePercentage >= 60) {
    verdict = "SAFE";
  }

  let confidence = incidents.length < 5 ? "MEDIUM" : "HIGH";

  logger.info(
    `Distribution | SAFE=${safeCount} CAUTION=${cautionCount} HIGH=${highRiskCount}`
  );

  logger.info(
    `Percentages | SAFE=${safePercentage.toFixed(2)}% HIGH=${highRiskPercentage.toFixed(2)}%`
  );

  logger.info(
    `Risk assessment completed for ${location} | Score=${riskScore} Verdict=${verdict}`
  );

  return {
    location,
    incidentCount: incidents.length,
    riskScore,
    verdict,
    confidence,
  };
};

module.exports = calculateRiskAssessment;