/**
 * Secure EHR System Backend Server
 * Main entry point for the Express.js application
 * Handles MongoDB connection, API routes, and Swagger documentation
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import ehrRoutes from './routes/ehrRoutes.js';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure EHR API',
      version: '1.0.0',
      description: 'API for Blockchain-backed EHR with Gemini AI Heart Disease Prediction',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}` },
    ],
  },
  apis: ['./routes/*.{ts,js}', './routes/ehrRoutes.js', './dist/routes/*.js'], // Path to the API docs
};

/**
 * Root endpoint - Health check
 */
app.get('/', function (_req, res) {
  res.json({msg: 'Secure EHR System API - Running!', version: '2.0.0'})
})

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', ehrRoutes);

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`EHR System Backend running on port ${process.env.PORT}`);
            console.log(`Swagger Docs available at http://localhost:${process.env.PORT}/api-docs`);
        });
    })
    .catch(err => console.log(err));