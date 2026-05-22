const express = require("express");
const { getIncidents } = require("../controllers/incidentController");
const {predictRisk}=require("../controllers/predictRiskController")

const router = express.Router();

router.get("/incidents", getIncidents);
router.get("/predict-risk",predictRisk)

module.exports = router;