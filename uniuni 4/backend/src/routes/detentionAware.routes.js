// Detention-Aware Seating Routes

const express = require('express');
const router = express.Router();
const {
  getAllocationPreview,
  getStudentStatus,
  updateStudentStatus,
  getDetainedStudents,
  runSeatingAllocation,
  getAllocationHistory,
  getExclusionLogs,
  bulkUpdateStatuses,
  getStatusHistory,
  initializeDemoData,
} = require('../controllers/detentionAwareController');

// ===== ALLOCATION PREVIEW =====
/**
 * @route GET /api/detention-aware/preview
 * @desc Get allocation preview with detention filtering
 * @access Public (for demo)
 */
router.get('/preview', getAllocationPreview);

// ===== STUDENT STATUS MANAGEMENT =====
/**
 * @route GET /api/detention-aware/student/:studentId/status
 * @desc Get student academic status
 * @access Public (for demo)
 */
router.get('/student/:studentId/status', getStudentStatus);

/**
 * @route PUT /api/detention-aware/student/:studentId/status
 * @desc Update student academic status (admin override)
 * @access Admin only (in production)
 */
router.put('/student/:studentId/status', updateStudentStatus);

/**
 * @route GET /api/detention-aware/student/:studentId/history
 * @desc Get status change history for a student
 * @access Admin only (in production)
 */
router.get('/student/:studentId/history', getStatusHistory);

// ===== DETAINED STUDENTS =====
/**
 * @route GET /api/detention-aware/detained
 * @desc Get all detained students
 * @access Admin only (in production)
 */
router.get('/detained', getDetainedStudents);

// ===== SEAT ALLOCATION =====
/**
 * @route POST /api/detention-aware/allocate
 * @desc Run detention-aware seat allocation
 * @access Admin only (in production)
 */
router.post('/allocate', runSeatingAllocation);

/**
 * @route GET /api/detention-aware/allocation/history
 * @desc Get allocation history
 * @access Admin only (in production)
 */
router.get('/allocation/history', getAllocationHistory);

// ===== AUDIT & LOGGING =====
/**
 * @route GET /api/detention-aware/exclusions
 * @desc Get exclusion logs
 * @access Admin only (in production)
 */
router.get('/exclusions', getExclusionLogs);

// ===== BULK OPERATIONS =====
/**
 * @route POST /api/detention-aware/bulk-update
 * @desc Bulk update student statuses
 * @access Admin only (in production)
 */
router.post('/bulk-update', bulkUpdateStatuses);

// ===== DEMO & TESTING =====
/**
 * @route POST /api/detention-aware/init-demo
 * @desc Initialize demo data for testing
 * @access Development only
 */
router.post('/init-demo', initializeDemoData);

// ===== HEALTH CHECK =====
/**
 * @route GET /api/detention-aware/health
 * @desc Health check for detention-aware module
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    module: 'Detention-Aware Seating',
    status: 'operational',
    timestamp: new Date().toISOString(),
    features: [
      'Academic status filtering',
      'Automatic exclusion',
      'Admin overrides',
      'Audit logging',
      'Allocation preview',
    ],
  });
});

module.exports = router;