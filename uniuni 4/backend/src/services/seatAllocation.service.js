// Seat Allocation Service - Detention-Aware Seating Engine

const { academicStatusService } = require('./academicStatus.service');

class SeatAllocationService {
  constructor() {
    this.allocationHistory = [];
    this.exclusionLogs = [];
  }

  /**
   * Generate seat allocation with detention awareness
   */
  async generateAllocation(examId, students, halls, config = {}) {
    const startTime = Date.now();
    
    // Step 1: Filter eligible students
    const { eligible, excluded } = this.filterEligibleStudents(students);
    
    // Log exclusions
    this.logExclusions(examId, excluded);
    
    if (eligible.length === 0) {
      throw new Error('No eligible students found for seat allocation');
    }
    
    // Step 2: Apply allocation strategy
    const sortedStudents = this.applyAllocationStrategy(eligible, config);
    
    // Step 3: Distribute across halls
    const allocation = this.distributeStudentsToHalls(sortedStudents, halls, config);
    
    // Step 4: Validate allocation
    const validation = this.validateAllocation(allocation);
    
    // Step 5: Save allocation history
    const allocationRecord = {
      id: `ALLOC_${Date.now()}`,
      examId,
      timestamp: new Date().toISOString(),
      totalStudents: students.length,
      eligibleStudents: eligible.length,
      excludedStudents: excluded.length,
      hallsUsed: allocation.length,
      config,
      validation,
      processingTime: Date.now() - startTime,
    };
    
    this.allocationHistory.push(allocationRecord);
    
    return {
      success: true,
      allocation,
      summary: {
        totalStudents: students.length,
        eligible: eligible.length,
        excluded: excluded.length,
        excludedDetails: excluded.map(s => ({
          studentId: s.id,
          name: s.name,
          rollNo: s.rollNo,
          status: s.academicStatus,
          reason: academicStatusService.getExclusionReason(s.id),
        })),
        hallsUsed: allocation.length,
        seatsAllocated: eligible.length,
      },
      validation,
      allocationId: allocationRecord.id,
    };
  }

  /**
   * Filter students by eligibility status
   */
  filterEligibleStudents(students) {
    const eligible = [];
    const excluded = [];
    
    students.forEach(student => {
      const isEligible = academicStatusService.isEligibleForSeating(student.id);
      
      if (isEligible) {
        eligible.push(student);
      } else {
        excluded.push({
          ...student,
          academicStatus: academicStatusService.getStudentStatus(student.id),
          exclusionReason: academicStatusService.getExclusionReason(student.id),
        });
      }
    });
    
    return { eligible, excluded };
  }

  /**
   * Log exclusions for audit trail
   */
  logExclusions(examId, excludedStudents) {
    excludedStudents.forEach(student => {
      this.exclusionLogs.push({
        examId,
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        status: student.academicStatus,
        reason: student.exclusionReason,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Apply allocation strategy (random, department-based, optimized)
   */
  applyAllocationStrategy(students, config) {
    const { strategy = 'optimized', antiCheat = true } = config;
    
    let sorted = [...students];
    
    if (antiCheat) {
      sorted = this.shuffleArray(sorted);
    }
    
    if (strategy === 'department') {
      sorted.sort((a, b) => a.department.localeCompare(b.department));
    } else if (strategy === 'optimized') {
      sorted = this.optimizedDistribution(sorted);
    }
    
    return sorted;
  }

  /**
   * Shuffle array for random distribution
   */
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Optimized distribution to prevent same-department adjacency
   */
  optimizedDistribution(students) {
    const deptGroups = {};
    students.forEach(s => {
      if (!deptGroups[s.department]) deptGroups[s.department] = [];
      deptGroups[s.department].push(s);
    });
    
    const result = [];
    const depts = Object.keys(deptGroups);
    const maxLen = Math.max(...Object.values(deptGroups).map(g => g.length));
    
    for (let i = 0; i < maxLen; i++) {
      depts.forEach(dept => {
        if (deptGroups[dept][i]) {
          result.push(deptGroups[dept][i]);
        }
      });
    }
    
    return result;
  }

  /**
   * Distribute students to halls
   */
  distributeStudentsToHalls(students, halls, config) {
    const allocation = [];
    let studentIndex = 0;
    
    halls.forEach(hall => {
      const hallAllocation = {
        hallId: hall.id,
        hallName: hall.name,
        capacity: hall.capacity,
        students: [],
      };
      
      // Allocate students to this hall
      while (studentIndex < students.length && hallAllocation.students.length < hall.capacity) {
        const student = students[studentIndex];
        hallAllocation.students.push({
          ...student,
          seatNumber: `${hall.id}_${hallAllocation.students.length + 1}`,
          hallId: hall.id,
          hallName: hall.name,
        });
        studentIndex++;
      }
      
      if (hallAllocation.students.length > 0) {
        allocation.push(hallAllocation);
      }
    });
    
    return allocation;
  }

  /**
   * Validate allocation for conflicts
   */
  validateAllocation(allocation) {
    const conflicts = [];
    let totalSeats = 0;
    let occupiedSeats = 0;
    
    allocation.forEach(hall => {
      totalSeats += hall.capacity;
      occupiedSeats += hall.students.length;
      
      // Check for duplicate seat assignments
      const seatNumbers = hall.students.map(s => s.seatNumber);
      const duplicates = seatNumbers.filter((s, i) => seatNumbers.indexOf(s) !== i);
      
      if (duplicates.length > 0) {
        conflicts.push({
          type: 'duplicate_seat',
          hallId: hall.hallId,
          description: `Duplicate seat assignments found: ${duplicates.join(', ')}`,
        });
      }
      
      // Check capacity
      if (hall.students.length > hall.capacity) {
        conflicts.push({
          type: 'capacity_exceeded',
          hallId: hall.hallId,
          description: `Hall capacity exceeded: ${hall.students.length}/${hall.capacity}`,
        });
      }
    });
    
    return {
      isValid: conflicts.length === 0,
      conflicts,
      utilizationRate: (occupiedSeats / totalSeats * 100).toFixed(2),
      totalSeats,
      occupiedSeats,
    };
  }

  /**
   * Get allocation history
   */
  getAllocationHistory() {
    return this.allocationHistory;
  }

  /**
   * Get exclusion logs
   */
  getExclusionLogs(examId = null) {
    if (examId) {
      return this.exclusionLogs.filter(log => log.examId === examId);
    }
    return this.exclusionLogs;
  }

  /**
   * Get allocation preview without actually allocating
   */
  getAllocationPreview(students, halls) {
    const { eligible, excluded } = this.filterEligibleStudents(students);
    
    return {
      totalStudents: students.length,
      eligibleStudents: eligible.length,
      detainedStudents: excluded.length,
      excludedCount: excluded.length,
      hallsRequired: Math.ceil(eligible.length / 64), // Assuming 64 seats per hall
      utilizationRate: (eligible.length / (Math.ceil(eligible.length / 64) * 64)) * 100,
      excludedDetails: excluded.map(s => ({
        studentId: s.id,
        name: s.name,
        rollNo: s.rollNo,
        department: s.department,
        status: s.academicStatus,
        reason: s.exclusionReason,
      })),
    };
  }
}

// Singleton instance
const seatAllocationService = new SeatAllocationService();

module.exports = {
  seatAllocationService,
};
