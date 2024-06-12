// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const coinRoutes = require("./routes/coinRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentMethodsRoutes = require("./routes/paymentMethodRoutes");
const sequelize = require("./config/database");
const initDB = require("./config/initializeDB");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const errorHandler = require("./middlewares/errorHandler");
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");

const ENV = process.env.NODE_ENV || "development";
const ENV_FILE = `.env.${ENV}`;

if (fs.existsSync(ENV_FILE)) {
  dotenv.config({ path: ENV_FILE });
} else {
  console.error(`Environment file ${ENV_FILE} not found!`);
  process.exit(1);
}

const app = express();

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3006",
    "http://127.0.0.1:3006",
  ], // Replace with your desired origin
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type", "X-Access-Token"],
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", userRoutes);
app.use("/api", coinRoutes);
app.use("/api", paymentRoutes);
app.use("/api", paymentMethodsRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize the database and start the server.
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      // Sync database with force true in non-production environments
      await initDB();
      console.log("Database initialized with default values");
    } else {
      // Sync database without force in production
      await sequelize.sync();
    }

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
};

// Call the startServer function to sync database and start server
startServer();
