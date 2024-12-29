const axios = require("axios");

const getTimeRange = () => {
  const startTimeMillis = new Date().setHours(0, 0, 0, 0);
  const endTimeMillis = new Date().setHours(23, 59, 59, 999);
  return { startTimeMillis, endTimeMillis };
};

const getFitnessDataHelper = async (dataTypeName, startTimeMillis, endTimeMillis) => {
  try {
    const dataSourceId = `derived:${dataTypeName}:com.google.android.gms:aggregated`;
    const requestData = {
      aggregateBy: [{
        dataTypeName,
        dataSourceId
      }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis,
      endTimeMillis,
      access_token: "ya29.a0ARW5m755qQcro2fGJ8VK48FAcgdOYM24UdzKmB6GCoBorVHLYIQFbQZAcXuX7PJgfMJbcBCSLCZA5SETtW35HgEpuhe1VnF3Vfb7x5xz1CaZ-DrTP4wcTMCDi_dNKncPoENYgiXb2Kjog4G6YBeaMB-tfphx5zhyUxoaCgYKAXESARMSFQHGX2MiAqAeq5D-PyDNKPlk1-YzRA0170"
    };

    return await axios({
      method: "POST",
      url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      headers: {
        "Content-Type": "application/json"
      },
      data: requestData,
      timeout: 10000
    });
  } catch (error) {
    throw { ...error, details: errorDetails };
  }
};

exports.getGoogleAuthUrl = (oauth2Client) => {
  if (!oauth2Client) {
    return (req, res) => res.status(500).json({ error: "OAuth client not configured" });
  }
  return (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.blood_glucose.read",
        "https://www.googleapis.com/auth/fitness.blood_pressure.read",
        "https://www.googleapis.com/auth/fitness.body.read",
        "https://www.googleapis.com/auth/fitness.body_temperature.read",
        "https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.location.read",
        "https://www.googleapis.com/auth/fitness.nutrition.read",
        "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
        "https://www.googleapis.com/auth/fitness.reproductive_health.read",
        "https://www.googleapis.com/auth/fitness.sleep.read"
      ]
    });
    res.redirect(url);
  };
};

exports.handleGoogleCallback = (oauth2Client) => {
  if (!oauth2Client) {
    return (req, res) => res.status(500).json({ 
      error: "OAuth client not configured",
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
  return async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ 
        error: "Authorization code is required",
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      res.json({ 
        access_token: tokens.access_token,
        expires_in: tokens.expiry_date,
        token_type: tokens.token_type
      });
    } catch (error) {
      res.status(500).json({
        error: "OAuth flow failed",
        errorDetails: {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }
  };
};

const createDataEndpoint = (dataType, errorMessage) => {
  return async (req, res) => {
    try {
      const { startTimeMillis, endTimeMillis } = getTimeRange();
      const response = await getFitnessDataHelper(dataType, startTimeMillis, endTimeMillis);
      
      if (!response.data || !response.data.bucket || response.data.bucket.length === 0) {
        return res.status(404).json({
          error: "No data found",
          dataType,
          timeRange: { startTimeMillis, endTimeMillis },
          timestamp: new Date().toISOString(),
          requestId: req.id
        });
      }

      res.json(response.data);
    } catch (error) {
      const errorResponse = {
        error: errorMessage,
        errorType: error.name,
        errorDetails: error.details || {
          message: error.message,
          code: error.code
        },
        timestamp: new Date().toISOString(),
        requestId: req.id,
        dataType,
        timeRange: getTimeRange()
      };

      if (error.code === "ECONNABORTED") {
        return res.status(504).json({
          ...errorResponse,
          error: "Request timeout"
        });
      }

      res.status(error.response?.status || 500).json(errorResponse);
    }
  };
};

exports.getStepsData = createDataEndpoint(
  "com.google.step_count.delta",
  "Failed to fetch steps data"
);

exports.getHeartRateData = createDataEndpoint(
  "com.google.heart_rate.bpm",
  "Failed to fetch heart rate data"
);

exports.getSleepData = createDataEndpoint(
  "com.google.sleep.segment",
  "Failed to fetch sleep data"
);

exports.getBloodGlucoseData = createDataEndpoint(
  "com.google.blood_glucose",
  "Failed to fetch blood glucose data"
);

exports.getBloodPressureData = createDataEndpoint(
  "com.google.blood_pressure",
  "Failed to fetch blood pressure data"
);

exports.getBodyTemperatureData = createDataEndpoint(
  "com.google.body.temperature",
  "Failed to fetch body temperature data"
);

exports.getOxygenSaturationData = createDataEndpoint(
  "com.google.oxygen_saturation",
  "Failed to fetch oxygen saturation data"
);

exports.getActivityData = createDataEndpoint(
  "com.google.activity.segment",
  "Failed to fetch activity data"
);

exports.getLocationData = createDataEndpoint(
  "com.google.location.sample",
  "Failed to fetch location data"
);

exports.getNutritionData = createDataEndpoint(
  "com.google.nutrition",
  "Failed to fetch nutrition data"
);

exports.getReproductiveHealthData = createDataEndpoint(
  "com.google.reproductive_health",
  "Failed to fetch reproductive health data"
);

exports.getBodyMetricsData = createDataEndpoint(
  "com.google.body.fat.percentage",
  "Failed to fetch body metrics data"
);
