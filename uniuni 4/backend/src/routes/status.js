const express = require('express');
const router = express.Router();
const systemStatus = require('../services/systemStatus');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Enhanced health check
router.get('/health', async (req, res) => {
  try {
    const health = systemStatus.getHealthStatus();
    const dbConnected = await systemStatus.checkDatabaseConnection();
    
    res.status(health.status === 'healthy' ? 200 : 503).json({
      ...health,
      database: dbConnected ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed system status
router.get('/status', async (req, res) => {
  try {
    const health = systemStatus.getHealthStatus();
    const stats = await systemStatus.getSystemStats();
    
    res.json({
      system: {
        name: 'UniVerse Academic System',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: systemStatus.getUptime(),
        startTime: systemStatus.startTime
      },
      health,
      statistics: stats,
      endpoints: {
        health: '/api/status/health',
        status: '/api/status/status',
        services: '/api/status/services',
        dashboard: '/api/status/dashboard'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Services status
router.get('/services', async (req, res) => {
  try {
    const health = systemStatus.getHealthStatus();
    
    res.json({
      services: health.services,
      summary: {
        total: Object.keys(health.services).length,
        active: Object.values(health.services).filter(s => 
          s.status === 'active' || s.status === 'ready' || s.status === 'connected'
        ).length,
        inactive: Object.values(health.services).filter(s => 
          s.status === 'inactive' || s.status === 'disconnected'
        ).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Backend dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await systemStatus.getSystemStats();
    const health = systemStatus.getHealthStatus();
    
    // Get recent activities
    const recentExams = await prisma.exam.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        examType: true, 
        examDate: true,
        course: { select: { name: true, code: true } }
      }
    });
    
    const recentSeatingAllocations = await prisma.seatingAllocation.findMany({
      take: 5,
      orderBy: { allocatedAt: 'desc' },
      include: { 
        exam: { 
          select: { 
            examType: true,
            course: { select: { name: true } }
          } 
        },
        student: { select: { fullName: true } }
      }
    });
    
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, startDateTime: true, status: true }
    });

    // Get alerts/notifications
    const alerts = [];
    if (health.status !== 'healthy') {
      alerts.push({
        type: 'warning',
        message: 'System health is degraded',
        timestamp: new Date().toISOString()
      });
    }
    
    if (stats && stats.exams === 0) {
      alerts.push({
        type: 'info',
        message: 'No exams scheduled',
        timestamp: new Date().toISOString()
      });
    }

    // Add more intelligent alerts
    if (stats && stats.seatingAllocations === 0 && stats.exams > 0) {
      alerts.push({
        type: 'warning',
        message: `${stats.exams} exams scheduled but no seating allocations created`,
        timestamp: new Date().toISOString()
      });
    }

    if (stats && stats.hallTickets === 0 && stats.exams > 0) {
      alerts.push({
        type: 'warning',
        message: `${stats.exams} exams scheduled but no hall tickets generated`,
        timestamp: new Date().toISOString()
      });
    }

    if (stats && stats.users.students === 0) {
      alerts.push({
        type: 'info',
        message: 'No students registered in the system',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      overview: {
        systemHealth: health.status,
        uptime: systemStatus.getUptime(),
        totalRequests: health.stats.totalRequests,
        errors: health.stats.errors
      },
      statistics: stats,
      recentActivity: {
        exams: recentExams,
        seatingAllocations: recentSeatingAllocations,
        events: recentEvents
      },
      alerts,
      services: health.services,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    systemStatus.logError('Dashboard data fetch', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Live system logs endpoint
router.get('/logs', (req, res) => {
  res.json({
    message: 'Live logs endpoint - implement WebSocket for real-time logs',
    recentLogs: [
      { timestamp: new Date().toISOString(), level: 'info', message: 'System status endpoint accessed' },
      { timestamp: new Date().toISOString(), level: 'info', message: 'Database connection healthy' }
    ]
  });
});

module.exports = router;