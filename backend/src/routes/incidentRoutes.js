const express = require("express");
const { getIncidents } = require("../controllers/incidentController");

const router = express.Router();

router.get("/incidents", getIncidents);

module.exports = router;