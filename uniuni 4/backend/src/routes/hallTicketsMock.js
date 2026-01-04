const express = require('express');
const router = express.Router();
const hallTicketController = require('../controllers/hallTicketControllerMock');
const { auth } = require('../middleware/auth');

/**
 * Mock Hall Ticket Bulk Processing Routes
 * Simulates processing without real database operations
 */

// Test endpoint (no auth required for development)
router.get('/test', hallTicketController.testMockSystem);

// Mock bulk upload and processing
router.post('/bulk-upload', auth, hallTicketController.mockBulkUploadAndProcess);

// Get mock job status
router.get('/job-status/:jobId', auth, hallTicketController.getMockJobStatus);

// Get mock exams
router.get('/exams', auth, hallTicketController.getMockExams);

// Get mock branches
router.get('/branches', auth, hallTicketController.getMockBranches);

module.exports = router;