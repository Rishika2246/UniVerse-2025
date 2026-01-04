const express = require('express');
const {
  createRoom,
  getAllRooms,
  getRoom,
  generateSeatingAllocation,
  getExamSeatingAllocation,
  getStudentSeat,
  clearSeatingAllocation,
  getAllExamHalls,
  getHallLayout,
  generateQRCodes,
  getAnalytics,
  getLiveOccupancy,
  updateAttendance,
  exportSeatingChart,
  getSeatingManagerDashboard,
  createOrUpdateExam,
  deleteExam,
  createOrUpdateHall,
  getStudentsForAllocation,
  generateAdvancedSeatingAllocation,
  getAllocationConflicts,
  getAllocationVersions,
  publishAllocation
} = require('../controllers/seatingController');
const { auth, hasAnyRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Public routes
router.get('/rooms', getAllRooms);
router.get('/rooms/:id', getRoom);
router.get('/rooms/:id/seats', async (req, res, next) => {
  try {
    const seats = await prisma.seat.findMany({ where: { roomId: req.params.id }, orderBy: [{ rowNumber: 'asc' }, { colNumber: 'asc' }] });
    res.json({ results: seats.length, seats });
  } catch (error) { next(error); }
});

// Public exam halls routes
router.get('/halls', getAllExamHalls);
router.get('/halls/:hallId/layout', getHallLayout);

// Protected routes
router.use(auth);

// Student routes
router.get('/exams/:examId/my-seat', getStudentSeat);
router.get('/exams/:examId/students/:studentId/seat', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getStudentSeat);

// Admin routes
router.post('/rooms', hasAnyRole('ADMIN'), createRoom);
router.post('/exams/:examId/allocate', hasAnyRole('ADMIN', 'SEATING_MANAGER'), generateSeatingAllocation);
router.get('/exams/:examId/allocations', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getExamSeatingAllocation);
router.delete('/exams/:examId/allocations', hasAnyRole('ADMIN'), clearSeatingAllocation);

// Enhanced seating manager routes
router.get('/exams/:examId/qr-codes', hasAnyRole('ADMIN', 'SEATING_MANAGER'), generateQRCodes);
router.get('/exams/:examId/analytics', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getAnalytics);
router.get('/exams/:examId/live-occupancy', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getLiveOccupancy);
router.patch('/exams/:examId/students/:studentId/attendance', hasAnyRole('ADMIN', 'SEATING_MANAGER'), updateAttendance);
router.get('/exams/:examId/export', hasAnyRole('ADMIN', 'SEATING_MANAGER'), exportSeatingChart);

// ===== NEW ENHANCED SEATING MANAGER ROUTES =====

// Dashboard and overview
router.get('/manager/dashboard', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getSeatingManagerDashboard);

// Exam management
router.post('/exams', hasAnyRole('ADMIN', 'SEATING_MANAGER'), createOrUpdateExam);
router.put('/exams/:examId', hasAnyRole('ADMIN', 'SEATING_MANAGER'), createOrUpdateExam);
router.delete('/exams/:examId', hasAnyRole('ADMIN', 'SEATING_MANAGER'), deleteExam);

// Hall management
router.post('/halls', hasAnyRole('ADMIN', 'SEATING_MANAGER'), createOrUpdateHall);
router.put('/halls/:hallId', hasAnyRole('ADMIN', 'SEATING_MANAGER'), createOrUpdateHall);

// Student data management
router.get('/students', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getStudentsForAllocation);

// Advanced allocation
router.post('/exams/:examId/advanced-allocate', hasAnyRole('ADMIN', 'SEATING_MANAGER'), generateAdvancedSeatingAllocation);
router.get('/exams/:examId/conflicts', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getAllocationConflicts);
router.get('/exams/:examId/versions', hasAnyRole('ADMIN', 'SEATING_MANAGER'), getAllocationVersions);

// Publishing
router.post('/exams/:examId/publish', hasAnyRole('ADMIN', 'SEATING_MANAGER'), publishAllocation);

module.exports = router;
