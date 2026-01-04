const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);
router.use(restrictTo('ADMIN'));

// Dashboard
router.get('/dashboard', adminController.getAdminDashboard);
router.get('/analytics', adminController.getSystemAnalytics);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// System Management
router.get('/database/stats', adminController.getDatabaseStats);
router.post('/database/backup', adminController.backupDatabase);
router.get('/security/logs', adminController.getSecurityLogs);

// Configuration
router.get('/config', adminController.getSystemConfig);
router.patch('/config', adminController.updateSystemConfig);

// Reports
router.get('/reports', adminController.generateSystemReport);

module.exports = router;