const express = require('express');
const router = express.Router();
const demoSeeder = require('../services/demoSeeder');
const systemStatus = require('../services/systemStatus');

// Seed demo data
router.post('/seed', async (req, res) => {
  try {
    systemStatus.logIntelligentOperation('Demo Mode', 'Seeding demo data requested');
    await demoSeeder.seedDemoData();
    const stats = await demoSeeder.getDemoStats();
    
    systemStatus.logSuccess('Demo Mode', 'Demo data seeded successfully');
    res.json({
      status: 'success',
      message: 'Demo data seeded successfully',
      ...stats
    });
  } catch (error) {
    systemStatus.logError('Demo Mode', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get demo statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await demoSeeder.getDemoStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Demo login credentials - Beautiful UI
router.get('/credentials', (req, res) => {
  res.render('demo-credentials');
});

// Demo login credentials - JSON API
router.get('/credentials/json', (req, res) => {
  res.json({
    message: 'Demo login credentials',
    credentials: {
      admin: {
        email: 'admin@university.edu',
        password: 'admin123',
        role: 'ADMIN'
      },
      faculty: {
        email: 'faculty1@university.edu',
        password: 'faculty123',
        role: 'FACULTY'
      },
      student: {
        email: 'student1@university.edu',
        password: 'student123',
        role: 'STUDENT'
      },
      seatingManager: {
        email: 'seating1@university.edu',
        password: 'seat123',
        role: 'SEATING_MANAGER'
      },
      clubCoordinator: {
        email: 'clubcoord1@university.edu',
        password: 'coord123',
        role: 'CLUB_COORDINATOR'
      }
    },
    note: 'Use these credentials to test the system functionality'
  });
});

module.exports = router;