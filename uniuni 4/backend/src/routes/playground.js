const express = require('express');
const router = express.Router();

// API Documentation and Playground - Beautiful UI
router.get('/', (req, res) => {
  res.render('api-playground');
});

// API Documentation JSON
router.get('/docs', (req, res) => {
  const apiDocs = {
    title: 'UniVerse Academic System API',
    version: '1.0.0',
    description: 'Comprehensive Academic Management System API',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      authentication: {
        login: { method: 'POST', path: '/auth/login', description: 'User authentication', body: { email: 'student1@university.edu', password: 'student123' } },
        register: { method: 'POST', path: '/auth/register', description: 'User registration' },
        logout: { method: 'POST', path: '/auth/logout', description: 'User logout' }
      },
      academic: {
        courses: { method: 'GET', path: '/courses', description: 'Get all courses' },
        exams: { method: 'GET', path: '/exams', description: 'Get all exams' },
        createExam: { method: 'POST', path: '/exams', description: 'Create new exam' }
      },
      seating: {
        allocations: { method: 'GET', path: '/seating', description: 'Get seating allocations' },
        generate: { method: 'POST', path: '/seating/generate', description: 'Generate seating allocation' },
        export: { method: 'GET', path: '/seating/:id/export', description: 'Export seating chart' }
      },
      hallTickets: {
        generate: { method: 'POST', path: '/hall-tickets/generate', description: 'Generate hall ticket' },
        download: { method: 'GET', path: '/hall-tickets/:id/download', description: 'Download hall ticket PDF' },
        verify: { method: 'POST', path: '/hall-tickets/verify', description: 'Verify QR code' }
      },
      mindMaps: {
        list: { method: 'GET', path: '/mindmaps', description: 'Get all mind maps' },
        create: { method: 'POST', path: '/mindmaps', description: 'Create mind map' },
        generate: { method: 'POST', path: '/mindmaps/generate', description: 'Generate from syllabus' }
      },
      clubs: {
        list: { method: 'GET', path: '/clubs', description: 'Get all clubs' },
        events: { method: 'GET', path: '/events', description: 'Get all events' },
        register: { method: 'POST', path: '/events/:id/register', description: 'Register for event' }
      },
      analytics: {
        attendance: { method: 'GET', path: '/analytics/attendance', description: 'Attendance analytics' },
        performance: { method: 'GET', path: '/analytics/performance', description: 'Performance analytics' },
        seatingUtilization: { method: 'GET', path: '/analytics/seating', description: 'Seating utilization' }
      },
      emergency: {
        sosAlert: { method: 'POST', path: '/sos/alert', description: 'Send SOS alert' },
        busTracking: { method: 'GET', path: '/bus-tracking', description: 'Get bus locations' }
      },
      system: {
        health: { method: 'GET', path: '/status/health', description: 'System health check' },
        status: { method: 'GET', path: '/status/status', description: 'Detailed system status' },
        dashboard: { method: 'GET', path: '/admin-dashboard', description: 'Admin dashboard data' }
      }
    },
    sampleRequests: {
      login: {
        url: '/api/auth/login',
        method: 'POST',
        body: {
          email: 'student1@university.edu',
          password: 'student123'
        }
      },
      generateSeating: {
        url: '/api/seating/generate',
        method: 'POST',
        body: {
          examId: 1,
          hallIds: [1, 2],
          constraints: {
            minDistance: 2,
            randomize: true
          }
        }
      },
      createMindMap: {
        url: '/api/mindmaps',
        method: 'POST',
        body: {
          title: 'Database Concepts',
          courseId: 1,
          content: {
            nodes: [
              { id: '1', label: 'RDBMS', x: 100, y: 100 },
              { id: '2', label: 'SQL', x: 200, y: 150 }
            ],
            edges: [{ from: '1', to: '2' }]
          }
        }
      }
    },
    testEndpoints: [
      `${req.protocol}://${req.get('host')}/api/status/health`,
      `${req.protocol}://${req.get('host')}/api/admin-dashboard`,
      `${req.protocol}://${req.get('host')}/api/demo/credentials`,
      `${req.protocol}://${req.get('host')}/api/courses`,
      `${req.protocol}://${req.get('host')}/api/exams`
    ]
  };

  res.json(apiDocs);
});

// Interactive API tester
router.get('/test/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const baseUrl = `${req.protocol}://${req.get('host')}/api`;
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`${baseUrl}/${endpoint}`);
    const data = await response.json();
    
    res.json({
      endpoint: `/${endpoint}`,
      status: response.status,
      statusText: response.statusText,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      endpoint: `/${endpoint}`,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;