// Detention-Aware Seating Controller

const { academicStatusService, ACADEMIC_STATUS } = require('../services/academicStatus.service');
const { seatAllocationService } = require('../services/seatAllocation.service');

/**
 * Get allocation preview with detention filtering
 */
const getAllocationPreview = (req, res) => {
  try {
    // Mock student data for demo
    const mockStudents = [
      { id: 'STU001', name: 'Rahul Sharma', rollNo: '2022CSE001', department: 'CSE' },
      { id: 'STU002', name: 'Priya Patel', rollNo: '2022ECE015', department: 'ECE' },
      { id: 'STU003', name: 'Amit Kumar', rollNo: '2022ME025', department: 'ME' },
      // Add more mock students...
    ];

    const mockHalls = [
      { id: 'HALL_A', name: 'Hall A', capacity: 64 },
      { id: 'HALL_B', name: 'Hall B', capacity: 64 },
    ];

    const preview = seatAllocationService.getAllocationPreview(mockStudents, mockHalls);

    res.json({
      success: true,
      preview,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating allocation preview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate allocation preview',
      message: error.message,
    });
  }
};

/**
 * Get student academic status
 */
const getStudentStatus = (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required',
      });
    }

    const status = academicStatusService.getStudentStatus(studentId);
    const isEligible = academicStatusService.isEligibleForSeating(studentId);
    const exclusionReason = academicStatusService.getExclusionReason(studentId);

    res.json({
      success: true,
      studentId,
      academicStatus: status,
      isEligible,
      exclusionReason,
    });
  } catch (error) {
    console.error('Error getting student status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get student status',
      message: error.message,
    });
  }
};

/**
 * Update student academic status (admin override)
 */
const updateStudentStatus = (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, reason, updatedBy } = req.body;

    if (!studentId || !status || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, status, and reason are required',
      });
    }

    if (!Object.values(ACADEMIC_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid academic status',
        validStatuses: Object.values(ACADEMIC_STATUS),
      });
    }

    const result = academicStatusService.setStudentStatus(
      studentId,
      status,
      reason,
      updatedBy || 'Admin'
    );

    res.json({
      success: true,
      result,
      message: 'Student status updated successfully',
    });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student status',
      message: error.message,
    });
  }
};

/**
 * Get all detained students
 */
const getDetainedStudents = (req, res) => {
  try {
    const detainedStudents = academicStatusService.getDetainedStudents();

    res.json({
      success: true,
      detainedStudents,
      count: detainedStudents.length,
    });
  } catch (error) {
    console.error('Error getting detained students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get detained students',
      message: error.message,
    });
  }
};

/**
 * Run detention-aware seat allocation
 */
const runSeatingAllocation = (req, res) => {
  try {
    const { examId, students, halls, config } = req.body;

    if (!examId || !students || !halls) {
      return res.status(400).json({
        success: false,
        error: 'Exam ID, students, and halls are required',
      });
    }

    // Run the allocation
    const result = seatAllocationService.generateAllocation(examId, students, halls, config);

    res.json({
      success: true,
      ...result,
      message: 'Seat allocation completed successfully',
    });
  } catch (error) {
    console.error('Error running seat allocation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run seat allocation',
      message: error.message,
    });
  }
};

/**
 * Get allocation history
 */
const getAllocationHistory = (req, res) => {
  try {
    const history = seatAllocationService.getAllocationHistory();

    res.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error getting allocation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get allocation history',
      message: error.message,
    });
  }
};

/**
 * Get exclusion logs
 */
const getExclusionLogs = (req, res) => {
  try {
    const { examId } = req.query;
    const logs = seatAllocationService.getExclusionLogs(examId);

    res.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error getting exclusion logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get exclusion logs',
      message: error.message,
    });
  }
};

/**
 * Bulk update student statuses
 */
const bulkUpdateStatuses = (req, res) => {
  try {
    const { updates, updatedBy } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: 'Updates array is required',
      });
    }

    const results = academicStatusService.bulkUpdateStatuses(updates, updatedBy || 'Admin');

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
      message: `Bulk update completed: ${successCount} successful, ${failureCount} failed`,
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform bulk update',
      message: error.message,
    });
  }
};

/**
 * Get status change history for a student
 */
const getStatusHistory = (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required',
      });
    }

    const history = academicStatusService.getStatusHistory(studentId);

    res.json({
      success: true,
      studentId,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error getting status history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get status history',
      message: error.message,
    });
  }
};

/**
 * Initialize demo data for testing
 */
const initializeDemoData = (req, res) => {
  try {
    // Clear existing data
    academicStatusService.clearAllStatuses();

    // Set some students as detained for demo
    const demoStatuses = [
      { studentId: 'STU001', status: ACADEMIC_STATUS.DETAINED, reason: 'Academic detention due to low CGPA' },
      { studentId: 'STU002', status: ACADEMIC_STATUS.DETAINED, reason: 'Disciplinary action pending' },
      { studentId: 'STU003', status: ACADEMIC_STATUS.NOT_ELIGIBLE, reason: 'Fee payment pending' },
      { studentId: 'STU004', status: ACADEMIC_STATUS.SUSPENDED, reason: 'Temporary suspension - misconduct' },
    ];

    const results = academicStatusService.bulkUpdateStatuses(demoStatuses, 'System Demo');

    res.json({
      success: true,
      message: 'Demo data initialized successfully',
      results,
    });
  } catch (error) {
    console.error('Error initializing demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize demo data',
      message: error.message,
    });
  }
};

module.exports = {
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
};