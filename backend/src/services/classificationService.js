const INCIDENT_CATEGORIES = require("../constants/incidentCategory");
const SEVERITY_SCORE_MAP = require("../constants/severityScoreMap");

const classifyIncident = (title = "") => {
    const normalizedTitle = title.toLowerCase();

    let category = INCIDENT_CATEGORIES[7];

    if (
        normalizedTitle.includes("riot") ||
        normalizedTitle.includes("clash") ||
        normalizedTitle.includes("mob")
    ) {
        category = INCIDENT_CATEGORIES[0];
    }

    else if (
        normalizedTitle.includes("protest") ||
        normalizedTitle.includes("demonstration") ||
        normalizedTitle.includes("strike")
    ) {
        category = INCIDENT_CATEGORIES[1];
    }

    else if (
        normalizedTitle.includes("accident") ||
        normalizedTitle.includes("collision") ||
        normalizedTitle.includes("crash")
    ) {
        category = INCIDENT_CATEGORIES[2];
    }

    else if (
        normalizedTitle.includes("crime") ||
        normalizedTitle.includes("murder") ||
        normalizedTitle.includes("robbery") ||
        normalizedTitle.includes("theft")
    ) {
        category = INCIDENT_CATEGORIES[3];
    }

    else if (
        normalizedTitle.includes("violence") ||
        normalizedTitle.includes("attack") ||
        normalizedTitle.includes("assault")
    ) {
        category = INCIDENT_CATEGORIES[4];
    }

    else if (
        normalizedTitle.includes("fire") ||
        normalizedTitle.includes("blaze")
    ) {
        category = INCIDENT_CATEGORIES[5];
    }

    else if (
        normalizedTitle.includes("flood") ||
        normalizedTitle.includes("earthquake") ||
        normalizedTitle.includes("cyclone")
    ) {
        category = INCIDENT_CATEGORIES[6];
    }

    const severity = SEVERITY_SCORE_MAP[category];

    return {
        category,
        severity
    };
};

module.exports = classifyIncident;