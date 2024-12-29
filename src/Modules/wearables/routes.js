const express = require("express");
const router = express.Router();
const { 
  getGoogleAuthUrl, 
  handleGoogleCallback, 
  getStepsData,
  getHeartRateData,
  getSleepData,
  getBloodGlucoseData,
  getBloodPressureData,
  getBodyTemperatureData,
  getOxygenSaturationData
} = require("./controller");
const { OAuth2Client } = require("google-auth-library");

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get("/google", getGoogleAuthUrl(oauth2Client));
router.get("/google/callback", handleGoogleCallback(oauth2Client));
router.get("/fitness/steps", getStepsData);
router.get("/fitness/heart-rate", getHeartRateData);
router.get("/fitness/sleep", getSleepData);
router.get("/fitness/blood-glucose", getBloodGlucoseData);
router.get("/fitness/blood-pressure", getBloodPressureData);
router.get("/fitness/body-temperature", getBodyTemperatureData);
router.get("/fitness/oxygen-saturation", getOxygenSaturationData);

module.exports = router;
