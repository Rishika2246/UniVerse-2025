const express = require('express');
const router = express.Router();
const intelligentLogger = require('../services/intelligentLogger');

// Get intelligent logs dashboard
router.get('/', (req, res) => {
  res.render('intelligent-logs');
});

// Get all intelligent logs
router.get('/api/logs', (req, res) => {
  const { limit = 50, category, level } = req.query;
  let logs = intelligentLogger.getAllLogs(parseInt(limit));
  
  if (category) {
    logs = logs.filter(log => log.category === category);
  }
  
  if (level) {
    logs = logs.filter(log => log.level === level);
  }
  
  res.json({
    logs,
    total: logs.length,
    categories: ['SEATING_ENGINE', 'HALL_TICKET_ENGINE', 'MINDMAP_ENGINE', 'EVENT_ENGINE', 'SYSTEM_FAILURE'],
    levels: ['INFO', 'WARNING', 'ERROR']
  });
});

// Get intelligent decision logs only
router.get('/api/intelligent', (req, res) => {
  const { limit = 50 } = req.query;
  const logs = intelligentLogger.getIntelligentLogs(parseInt(limit));
  
  res.json({
    logs,
    total: logs.length,
    message: 'Intelligent decision-making logs'
  });
});

// Get security events
router.get('/api/security', (req, res) => {
  const { limit = 50, severity } = req.query;
  let events = intelligentLogger.getSecurityEvents(parseInt(limit));
  
  if (severity) {
    events = events.filter(event => event.severity === severity);
  }
  
  res.json({
    events,
    total: events.length,
    severities: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  });
});

// Get audit logs
router.get('/api/audit', (req, res) => {
  const { limit = 50, action } = req.query;
  let logs = intelligentLogger.getAuditLogs(parseInt(limit));
  
  if (action) {
    logs = logs.filter(log => log.action === action);
  }
  
  res.json({
    logs,
    total: logs.length,
    actions: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS']
  });
});

// Get system statistics
router.get('/api/stats', (req, res) => {
  const allLogs = intelligentLogger.getAllLogs(1000);
  const securityEvents = intelligentLogger.getSecurityEvents(500);
  const auditLogs = intelligentLogger.getAuditLogs(500);
  
  const stats = {
    totalLogs: allLogs.length,
    intelligentLogs: allLogs.filter(log => log.intelligence).length,
    securityEvents: securityEvents.length,
    auditLogs: auditLogs.length,
    logsByCategory: {},
    logsByLevel: {},
    securityBySeverity: {},
    recentActivity: allLogs.slice(0, 10)
  };
  
  // Count by category
  allLogs.forEach(log => {
    stats.logsByCategory[log.category] = (stats.logsByCategory[log.category] || 0) + 1;
  });
  
  // Count by level
  allLogs.forEach(log => {
    stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1;
  });
  
  // Count security by severity
  securityEvents.forEach(event => {
    stats.securityBySeverity[event.severity] = (stats.securityBySeverity[event.severity] || 0) + 1;
  });
  
  res.json(stats);
});

// Simulate intelligent operation (for demo)
router.post('/api/simulate/:operation', (req, res) => {
  const { operation } = req.params;
  
  switch (operation) {
    case 'seating':
      intelligentLogger.logSeatingDecision('demo-exam', 'ALLOCATION_STARTED', { examCode: 'DEMO101' });
      setTimeout(() => {
        intelligentLogger.logSeatingDecision('demo-exam', 'CONFLICT_DETECTED', { resolution: 'smart swap algorithm' });
      }, 1000);
      break;
      
    case 'hallticket':
      intelligentLogger.logHallTicketDecision('demo-student', 'demo-exam', 'BLOCKED', 'attendance below 75%');
      break;
      
    case 'mindmap':
      intelligentLogger.logMindMapGeneration('demo-student', 'demo-syllabus', 'GENERATED', { subject: 'Demo Subject' });
      break;
      
    case 'conflict':
      intelligentLogger.logEventConflict('demo-event', 'EXAM_CONFLICT', 'automatically rescheduled');
      break;
      
    case 'failure':
      intelligentLogger.logSystemFailure('DEMO_COMPONENT', new Error('Demo failure'), 'rollback completed', 'admin notified');
      break;
      
    case 'security':
      intelligentLogger.logSecurityEvent('FAILED_LOGIN', 'demo-user', { ip: '192.168.1.999', email: 'demo@test.com' }, 'HIGH');
      break;
      
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }
  
  res.json({ success: true, message: `Simulated ${operation} operation` });
});

module.exports = router;