const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const { protect, restrictTo } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// SOS Alerts
router.post('/alerts', sosController.createSOSAlert);
router.get('/alerts', sosController.getUserSOSAlerts);
router.patch('/alerts/:alertId', sosController.updateSOSAlert);

// Emergency Resources
router.get('/contacts', sosController.getEmergencyContacts);
router.get('/safety-resources', sosController.getSafetyResources);

// Incident Reporting
router.post('/incidents', sosController.reportIncident);
router.get('/incidents', sosController.getIncidentReports);

// Analytics (Admin/Security only)
router.get('/analytics', restrictTo('ADMIN', 'SECURITY'), sosController.getSOSAnalytics);

module.exports = router;