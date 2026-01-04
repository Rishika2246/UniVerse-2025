const express = require('express');
const router = express.Router();
const busTrackingController = require('../controllers/busTrackingController');
const { protect, restrictTo } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Bus Routes & Schedules
router.get('/routes', busTrackingController.getBusRoutes);
router.get('/schedule', busTrackingController.getBusSchedule);

// Live Tracking
router.get('/live-locations', busTrackingController.getLiveBusLocations);
router.get('/eta', busTrackingController.getETAForStop);

// Booking System
router.post('/bookings', busTrackingController.bookBusSeat);
router.get('/bookings', busTrackingController.getUserBookings);
router.delete('/bookings/:bookingId', busTrackingController.cancelBooking);

// Notifications
router.get('/notifications', busTrackingController.getBusNotifications);
router.patch('/notifications/:notificationId/read', busTrackingController.markNotificationRead);

// Analytics (Admin only)
router.get('/analytics', restrictTo('ADMIN'), busTrackingController.getBusAnalytics);

module.exports = router;