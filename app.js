// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');

const sequelize = require('./config/database');
const initDB = require('./config/initializeDB');
const { initGameModel } = require('./config/initializeGameModel');
const { notFound, globalErrorHandler } = require('./middlewares/globalErrorHandler');
const router = require('./routes');

const ENV = process.env.NODE_ENV || 'development';
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
    'http://127.0.0.1:3001',
    'https://urban-gaming.com',
    'https://advance-genre-425305-g1.web.app',
    'https://urban-umber-alpha.vercel.app'
  ], // Replace with your desired origin & add FE URL
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: ['Content-Type', 'X-Access-Token']
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use(bodyParser.json());

router(app)

// global error handlers
app.use(notFound);
app.use(globalErrorHandler);

// Initialize the database and start the server.
const startServer = async () => {
  try {
    // Initialize the game table
    initGameModel();
    // console.log(process.env,'???')
    if (process.env.NODE_ENV !== 'production') {
      // Sync database with force true in non-production environments
      await initDB();
      console.log('Database initialized with default values');
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
    console.error('Unable to start the server:', error);
  }
};

// Call the startServer function to sync database and start server
startServer();
