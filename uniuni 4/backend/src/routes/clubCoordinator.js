const express = require('express');
const router = express.Router();
const clubCoordinatorController = require('../controllers/clubCoordinatorController');
const { protect, restrictTo } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);
router.use(restrictTo('CLUB_COORDINATOR'));

// Dashboard
router.get('/dashboard', clubCoordinatorController.getClubCoordinatorDashboard);

// Event Approval Workflow
router.get('/requests/pending', clubCoordinatorController.getPendingEventRequests);
router.get('/events/approved', clubCoordinatorController.getApprovedEvents);
router.post('/requests/:requestId/approve', clubCoordinatorController.approveEventRequest);
router.post('/requests/:requestId/reject', clubCoordinatorController.rejectEventRequest);
router.post('/requests/:requestId/changes', clubCoordinatorController.requestEventChanges);

// Club Management
router.get('/clubs', clubCoordinatorController.getAllClubs);
router.get('/clubs/:clubId', clubCoordinatorController.getClubDetails);

// Budget Management
router.get('/budget', clubCoordinatorController.getBudgetOverview);
router.post('/budget/allocate', clubCoordinatorController.allocateBudget);

// Feedback System
router.get('/feedback', clubCoordinatorController.getEventFeedback);
router.get('/feedback/analytics', clubCoordinatorController.getFeedbackAnalytics);

// Analytics & Reporting
router.get('/statistics', clubCoordinatorController.getEventStatistics);
router.get('/reports', clubCoordinatorController.generateComprehensiveReport);

module.exports = router;