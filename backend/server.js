const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// =============================================
// MIDDLEWARE
// =============================================

// Enable CORS (Cross-Origin Resource Sharing) so frontend can communicate with backend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// =============================================
// ROUTES
// =============================================

// Authentication routes (login, profile)
app.use('/api/auth', require('./routes/authRoutes'));

// Company routes
app.use('/api/companies', require('./routes/companyRoutes'));

// Drive routes (includes apply endpoint)
app.use('/api/drives', require('./routes/driveRoutes'));

// Application routes
app.use('/api/applications', require('./routes/applicationRoutes'));

// Management routes (students, batches, officer account, management account)
app.use('/api/management', require('./routes/managementRoutes'));

// =============================================
// HEALTH CHECK
// =============================================

app.get('/', (req, res) => {
  res.json({ 
    message: 'College Placement Drive Management System API',
    status: 'Running',
    version: '1.0.0'
  });
});

// =============================================
// ERROR HANDLING
// =============================================

// Handle 404 — Route not found
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle Multer errors (file upload)
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }

  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =============================================
// START SERVER
// =============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
