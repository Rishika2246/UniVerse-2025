const express = require('express');
const router = express.Router();
const hallTicketController = require('../controllers/hallTicketControllerV2');
const { auth } = require('../middleware/auth');

/**
 * Hall Ticket Bulk Processing Routes V2
 * Simplified: Direct upload and process
 */

// Test endpoint (no auth required for development)
router.get('/test', hallTicketController.testBulkSystem);

// Direct bulk upload and processing (combines all steps)
router.post('/bulk-upload', auth, hallTicketController.bulkUploadAndProcess);

// Get job status
router.get('/job-status/:jobId', auth, hallTicketController.getJobStatus);

// Get available exams
router.get('/exams', auth, hallTicketController.getExams);

// Get available branches
router.get('/branches', auth, hallTicketController.getBranches);

module.exports = router;