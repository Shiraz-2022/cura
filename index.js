const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4001;

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

//const setupSocket = require("./src/config/setupSocket");

//const io = setupSocket(server);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/communities", communityRoutes);

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
