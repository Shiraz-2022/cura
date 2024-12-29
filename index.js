const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4001;

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./src/Modules/Auth/routes");
const chatRoutes = require("./src/Modules/Chat/routes");
const communityRoutes = require("./src/Modules/communities/routes");
const wearablesRoutes = require("./src/Modules/wearables/routes");

//const setupSocket = require("./src/config/setupSocket");

//const io = setupSocket(server);

app.get("/api/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/fitness.activity.read"], // Example scope for Google Fit
  });
  res.redirect(url);
});

// Step 2: Handle the redirect from Google
app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for an access token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Send the access token back to the frontend
    res.json({ access_token: tokens.access_token });
    //res.redirect("myapp://healthTracking/tracking");
  } catch (error) {
    res.status(500).json({ error: "OAuth flow failed", details: error });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/communities", communityRoutes);
//app.use("/api/wearables", wearablesRoutes);

const GOOGLE_FIT_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";


app.get("/api/wearables/data-sources", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  try {
    const url = "https://www.googleapis.com/fitness/v1/users/me/dataSources";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data sources:", error);
    res.status(500).json({ error: "Failed to fetch data sources" });
  }
});

app.post("/api/wearables/steps", async (req, res) => {
  let { accessToken, startTimeMillis, endTimeMillis } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  endTimeMillis = endTimeMillis || Date.now();
  startTimeMillis = startTimeMillis || (endTimeMillis - 3600000);

  try {
    const requestBody = {
      aggregateBy: [{
        dataTypeName: "from_heart_rate<-merge_heart_rate_bpm",
        dataSourceId: "derived:com.google.heart_minutes:com.google.android.gms:from_heart_rate<-merge_heart_rate_bpm"
      }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis,
      endTimeMillis
    };

    const response = await axios.post(GOOGLE_FIT_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    const buckets = response.data.bucket;
    let totalSteps = 0;

    buckets.forEach(bucket => {
      bucket.dataset.forEach(dataset => {
        dataset.point.forEach(point => {
          totalSteps += point.value[0].intVal;
        });
      });
    });

    res.status(200).json({ totalSteps });
  } catch (error) {
    console.error("Error fetching step data:", error);
    res.status(500).json({ error: "Failed to fetch step data" });
  }
});

app.post("/api/wearables/blood-pressure", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token." });
  }

  try {
    const endTimeMillis = Date.now();
    const startTimeMillis = endTimeMillis - 50000000; // Adjust this for a wider time range

    const requestBody = {
      aggregateBy: [
        {
          dataTypeName: "com.google.blood_pressure", // Blood pressure data type
          dataSourceId: "derived:com.google.blood_pressure:com.google.android.gms:blood_pressure_merged", // Example source, adjust if needed
        },
      ],
      bucketByTime: { durationMillis: 3600000 }, // 1 hour bucket duration
      startTimeMillis: startTimeMillis,
      endTimeMillis: endTimeMillis,
    };

    const response = await axios.post(GOOGLE_FIT_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response.data); // Log the full response to debug

    const buckets = response.data.bucket;
    if (!buckets || buckets.length === 0) {
      return res.status(404).json({ error: "No blood pressure data available for the specified time range." });
    }

    let totalSystolic = 0;
    let totalDiastolic = 0;
    let totalEntries = 0;

    buckets.forEach((bucket) => {
      bucket.dataset.forEach((dataset) => {
        dataset.point.forEach((point) => {
          const systolic = point.value.find(v => v.key === "systolic");
          const diastolic = point.value.find(v => v.key === "diastolic");

          if (systolic && diastolic) {
            totalSystolic += systolic.fpVal;
            totalDiastolic += diastolic.fpVal;
            totalEntries += 1;
          }
        });
      });
    });

    if (totalEntries === 0) {
      return res.status(404).json({ error: "No blood pressure data points found." });
    }

    const averageSystolic = totalSystolic / totalEntries;
    const averageDiastolic = totalDiastolic / totalEntries;

    res.status(200).json({ averageSystolic, averageDiastolic });
  } catch (error) {
    console.error("Error fetching blood pressure data:", error);
    res.status(500).json({ error: "Failed to fetch blood pressure data.", details: error.response?.data || error.message });
  }
})

app.post("/api/wearables/heart-rate", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing access token." });
  }

  try {
    const endTimeMillis = Date.now();
    const startTimeMillis = endTimeMillis - 50000000;

    const requestBody = {
      aggregateBy: [
        {
          dataTypeName: "com.google.heart_minutes",
          dataSourceId: "derived:com.google.heart_minutes:com.google.android.gms:bout_filtered_5min<-merge_heart_minutes",
        },
      ],
      bucketByTime: { durationMillis: 3600000 },
      startTimeMillis: startTimeMillis,
      endTimeMillis: endTimeMillis,
    };

    const response = await axios.post(GOOGLE_FIT_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response.data.bucket[0].dataset);

    const buckets = response.data.bucket;
    if (!buckets || buckets.length === 0) {
    
      return res.status(404).json({ error: "No heart rate data available for the specified time range." });
    }

    let totalHeartRate = 0;
    let totalEntries = 0;

    buckets.forEach((bucket) => {
      bucket.dataset.forEach((dataset) => {
        dataset.point.forEach((point) => {
          if (point.value[0].fpVal) {
            totalHeartRate += point.value[0].fpVal;
            totalEntries += 1;
          }
        });
      });
    });

    if (totalEntries === 0) {
      return res.status(404).json({ error: "No heart rate data points found." });
    }

    const averageHeartRate = totalHeartRate / totalEntries;

    res.status(200).json({ averageHeartRate });
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Failed to fetch heart rate data.", details: error.response?.data || error.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Hi this is cura backend");
});

// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message.toString());
//       }
//     });
//   });
// });

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
