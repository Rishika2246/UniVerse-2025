const express = require('express');
const router = express.Router();
const hallTicketController = require('../controllers/hallTicketControllerNew');
const { auth } = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Hall ticket routes working' });
});

// Student routes
router.get('/my-tickets', auth, hallTicketController.getStudentHallTickets);
router.get('/download/:hallTicketId', auth, hallTicketController.downloadHallTicket);

// Management routes
router.post('/bulk-upload', auth, hallTicketController.bulkUploadHallTickets);
router.post('/preview-csv', auth, hallTicketController.previewCSV);
router.post('/validate-csv', auth, hallTicketController.validateCSV);
router.get('/delivery-report/:examId', auth, hallTicketController.getDeliveryReport);
router.get('/job-status/:jobId', auth, hallTicketController.getJobStatus);
router.get('/failed-uploads/:examId', auth, hallTicketController.getFailedUploads);
router.post('/acknowledge/:examId', auth, hallTicketController.acknowledgeDelivery);
router.get('/exams', auth, hallTicketController.getExams);
router.get('/branches', auth, hallTicketController.getBranches);

// Test route for CSV parsing
router.get('/test-csv', auth, hallTicketController.testCSVParsing);

module.exports = router;