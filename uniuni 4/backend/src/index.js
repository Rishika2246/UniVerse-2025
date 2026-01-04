require('dotenv').config();
const env = process.env;
env.NODE_ENV = env.NODE_ENV || 'development';
env.JWT_SECRET = env.JWT_SECRET || 'dev-secret';
env.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '7d';
env.JWT_COOKIE_EXPIRES_IN = env.JWT_COOKIE_EXPIRES_IN || '7';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import services
const systemStatus = require('./services/systemStatus');
const demoSeeder = require('./services/demoSeeder');
const intelligentLogger = require('./services/intelligentLogger');

// Import middleware
const requestTracker = require('./middleware/requestTracker');
const { errorHandler } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const syllabusRoutes = require('./routes/syllabus');
const examRoutes = require('./routes/exams');
const mindmapRoutes = require('./routes/mindmaps');
const clubRoutes = require('./routes/clubs');
const eventRoutes = require('./routes/events');
const hallTicketRoutes = require('./routes/hallTickets');
const hallTicketRoutesV2 = require('./routes/hallTicketsV2');
const hallTicketRoutesMock = require('./routes/hallTicketsMock');
const seatingRoutes = require('./routes/seating');
const facultyRoutes = require('./routes/faculty');
const studentPortalRoutes = require('./routes/studentPortal');
const detentionAwareRoutes = require('./routes/detentionAware.routes');

// Import new system routes
const statusRoutes = require('./routes/status');
const playgroundRoutes = require('./routes/playground');
const demoRoutes = require('./routes/demo');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create Express app
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan('dev')); // Commented out for quiet mode
// app.use(requestTracker); // Commented out for quiet mode
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Static
app.use('/static', express.static(path.join(__dirname, 'public')));

// Backend Dashboard (Admin View)
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Comprehensive Admin Dashboard
app.get('/admin', (req, res) => {
  res.render('admin-dashboard');
});

// Advanced Admin Dashboard
app.use('/admin/advanced', require('./routes/advancedAdmin'));

// Advanced Admin API Routes
app.use('/api/admin-dashboard', require('./routes/advancedAdmin'));

// AI Notes and Summaries API
app.use('/api/ai-notes', require('./routes/aiNotes'));

// Certificate Vault API
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/certificate-folders', require('./routes/certificateFolders'));
app.use('/api/certificate-tags', require('./routes/certificateTags'));

// Smart Campus API
app.use('/api/smart-campus', require('./routes/smartCampus'));

// Classroom Chat API
app.use('/api/classroom-chat', require('./routes/classroomChat'));

// Data Browser (Prisma Studio-like)
app.get('/data', (req, res) => {
  res.render('data-browser');
});

// Redirect root to data browser
app.get('/', (req, res) => res.redirect('/data'));

// System & Admin Routes (High Priority)
app.use('/api/status', statusRoutes);
app.use('/api/playground', playgroundRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/admin-dashboard', require('./routes/adminDashboard'));
app.use('/api/data-browser', require('./routes/dataBrowser'));
app.use('/api/data-management', require('./routes/dataManagement'));

// API Views (Table-based UI for APIs)
app.use('/api', require('./routes/apiViews'));

// Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/mindmaps', mindmapRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/hall-tickets', hallTicketRoutes);
app.use('/api/hall-tickets-v2', hallTicketRoutesV2);
app.use('/api/hall-tickets-mock', hallTicketRoutesMock);
app.use('/api/seating', seatingRoutes);
app.use('/api/detention-aware', detentionAwareRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', facultyRoutes);
app.use('/api/student-portal', studentPortalRoutes);
app.use('/api/study-suite', require('./routes/studySuite'));
app.use('/api/attendance-suite', require('./routes/attendanceSuite'));
app.use('/api/club-coordinator', require('./routes/clubCoordinator'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/bus-tracking', require('./routes/busTracking'));

// Intelligent Logs & Security Audit
app.use('/intelligent-logs', require('./routes/intelligentLogs'));

// Admin pages (legacy)
app.use('/admin-legacy', require('./routes/adminApi'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Not Found',
    path: req.path 
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server with minimal logging
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  // Minimal startup message
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Auto-seed demo data in development (silent)
  if (process.env.NODE_ENV !== 'production') {
    try {
      await demoSeeder.seedDemoData();
    } catch (error) {
      // Silent error handling
    }
  }

  // Start intelligent logging system (disabled for quiet mode)
  // intelligentLogger.startIntelligentLogging();

  // Start Prisma Studio in development (silent)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { spawn } = require('child_process');
      const prismaStudio = spawn('npx', ['prisma', 'studio', '--port', '5556'], {
        cwd: __dirname + '/..',
        detached: true,
        stdio: 'ignore'
      });
      prismaStudio.unref();
    } catch (error) {
      // Silent error handling
    }
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = { app, server };
