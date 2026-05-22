const SEVERITY_SCORE_MAP = Object.freeze({
    RIOT: "HIGH",
    PROTEST: "MEDIUM",
    ACCIDENT: "MEDIUM",
    CRIME: "HIGH",
    VIOLENCE: "HIGH",
    FIRE: "HIGH",
    DISASTER: "CRITICAL",
    OTHER: "LOW"
});

module.exports = SEVERITY_SCORE_MAP;