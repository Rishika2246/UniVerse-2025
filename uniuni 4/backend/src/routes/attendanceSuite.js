const express = require('express');
const router = express.Router();
const attendanceSuiteController = require('../controllers/attendanceSuiteController');
const { protect } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Dashboard
router.get('/dashboard', attendanceSuiteController.getAttendanceSuiteDashboard);

// Attendance Data
router.get('/subjects', attendanceSuiteController.getSubjectWiseAttendance);
router.get('/schedule/today', attendanceSuiteController.getTodaySchedule);
router.post('/mark', attendanceSuiteController.markAttendance);
router.post('/mark/qr', attendanceSuiteController.markAttendanceByQR);

// Analytics
router.get('/analytics', attendanceSuiteController.getAttendanceAnalytics);
router.get('/badges', attendanceSuiteController.getAttendanceBadges);
router.get('/predictions', attendanceSuiteController.getAttendancePredictions);

// Leave Management
router.get('/leave-applications', attendanceSuiteController.getLeaveApplications);
router.post('/leave-applications', attendanceSuiteController.applyForLeave);

// Additional Features
router.get('/late-arrivals', attendanceSuiteController.getLateArrivals);
router.get('/parent-notifications', attendanceSuiteController.getParentNotifications);

// Reports
router.get('/export', attendanceSuiteController.exportAttendanceReport);

module.exports = router;