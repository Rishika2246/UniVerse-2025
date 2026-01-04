// Academic Status Service - Manages student eligibility and detention status

const ACADEMIC_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  PROVISIONALLY_ELIGIBLE: 'PROVISIONALLY_ELIGIBLE',
  DETAINED: 'DETAINED',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  SUSPENDED: 'SUSPENDED'
};

const EXCLUSION_REASONS = {
  DETAINED: 'Student is currently detained',
  NOT_ELIGIBLE: 'Student does not meet eligibility criteria',
  SUSPENDED: 'Student is under suspension',
  INSUFFICIENT_ATTENDANCE: 'Attendance below minimum requirement',
  PENDING_FEES: 'Fee payment pending',
  DISCIPLINARY_ACTION: 'Under disciplinary action'
};

class AcademicStatusService {
  constructor() {
    // In-memory storage for demo (replace with database in production)
    this.studentStatuses = new Map();
    this.statusHistory = [];
  }

  /**
   * Check if student is eligible for seat allocation
   */
  isEligibleForSeating(studentId) {
    const status = this.getStudentStatus(studentId);
    return status === ACADEMIC_STATUS.ELIGIBLE || 
           status === ACADEMIC_STATUS.PROVISIONALLY_ELIGIBLE;
  }

  /**
   * Get student's current academic status
   */
  getStudentStatus(studentId) {
    return this.studentStatuses.get(studentId) || ACADEMIC_STATUS.ELIGIBLE;
  }

  /**
   * Set student academic status
   */
  setStudentStatus(studentId, status, reason, updatedBy) {
    if (!Object.values(ACADEMIC_STATUS).includes(status)) {
      throw new Error(`Invalid academic status: ${status}`);
    }

    const previousStatus = this.getStudentStatus(studentId);
    this.studentStatuses.set(studentId, status);

    // Log status change
    this.statusHistory.push({
      studentId,
      previousStatus,
      newStatus: status,
      reason,
      updatedBy,
      timestamp: new Date()
    });

    return {
      success: true,
      studentId,
      previousStatus,
      newStatus: status,
      reason
    };
  }

  /**
   * Get exclusion reason for ineligible student
   */
  getExclusionReason(studentId) {
    const status = this.getStudentStatus(studentId);
    
    switch (status) {
      case ACADEMIC_STATUS.DETAINED:
        return EXCLUSION_REASONS.DETAINED;
      case ACADEMIC_STATUS.NOT_ELIGIBLE:
        return EXCLUSION_REASONS.NOT_ELIGIBLE;
      case ACADEMIC_STATUS.SUSPENDED:
        return EXCLUSION_REASONS.SUSPENDED;
      default:
        return null;
    }
  }

  /**
   * Get all detained students
   */
  getDetainedStudents() {
    const detained = [];
    for (const [studentId, status] of this.studentStatuses.entries()) {
      if (status === ACADEMIC_STATUS.DETAINED || 
          status === ACADEMIC_STATUS.NOT_ELIGIBLE ||
          status === ACADEMIC_STATUS.SUSPENDED) {
        detained.push({
          studentId,
          status,
          reason: this.getExclusionReason(studentId)
        });
      }
    }
    return detained;
  }

  /**
   * Get status change history for a student
   */
  getStatusHistory(studentId) {
    return this.statusHistory.filter(entry => entry.studentId === studentId);
  }

  /**
   * Bulk update student statuses
   */
  bulkUpdateStatuses(updates, updatedBy) {
    const results = [];
    
    for (const update of updates) {
      try {
        const result = this.setStudentStatus(
          update.studentId,
          update.status,
          update.reason,
          updatedBy
        );
        results.push({ ...result, success: true });
      } catch (error) {
        results.push({
          success: false,
          studentId: update.studentId,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Clear all status overrides (for testing)
   */
  clearAllStatuses() {
    this.studentStatuses.clear();
    this.statusHistory = [];
  }
}

// Singleton instance
const academicStatusService = new AcademicStatusService();

module.exports = {
  academicStatusService,
  ACADEMIC_STATUS,
  EXCLUSION_REASONS
};
