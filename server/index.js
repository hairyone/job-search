require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const db = require('./db');
const jobsRouter = require('./routes/jobs');
const attachmentsRouter = require('./routes/attachments');
const basicAuth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply authentication to all routes (except health check)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.path === '/api/health') {
      return next();
    }
    basicAuth(req, res, next);
  });
}

// API Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/attachments', attachmentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Initialize database
let dbInitialized = false;
let dbInitPromise = null;

async function initializeDatabase() {
  // Return existing promise if initialization is in progress
  if (dbInitPromise) {
    return dbInitPromise;
  }
  
  if (!dbInitialized) {
    dbInitPromise = db.initialize()
      .then(() => {
        dbInitialized = true;
        return true;
      })
      .catch((error) => {
        console.error('Database initialization error:', error);
        dbInitPromise = null; // Reset promise so we can retry
        throw error;
      });
    
    return dbInitPromise;
  }
  
  return true;
}

// For Vercel serverless
if (process.env.VERCEL) {
  // Export the app for Vercel
  module.exports = async (req, res) => {
    try {
      // Skip DB init for health check
      if (req.path !== '/api/health') {
        await initializeDatabase();
      }
      return app(req, res);
    } catch (error) {
      console.error('Serverless function error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message 
      });
    }
  };
} else {
  // For local development and Railway
  async function startServer() {
    try {
      await db.initialize();
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
  
  startServer();
}
