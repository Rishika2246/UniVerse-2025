const { PrismaClient } = require('@prisma/client');
const systemStatus = require('./systemStatus');

const prisma = new PrismaClient();

class IntelligentLogger {
  constructor() {
    this.logs = [];
    this.auditLogs = [];
    this.securityEvents = [];
    this.maxLogs = 1000;
  }

  // Core intelligent logging methods
  logSeatingDecision(examId, action, details) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      category: 'SEATING_ENGINE',
      level: 'INFO',
      action,
      examId,
      message: this.formatSeatingMessage(action, details),
      details,
      intelligence: true
    };
    this.addLog(log);
    // console.log(`🪑 ${log.message}`); // Disabled for clean terminal
  }

  logHallTicketDecision(studentId, examId, action, reason) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      category: 'HALL_TICKET_ENGINE',
      level: action === 'BLOCKED' ? 'WARNING' : 'INFO',
      action,
      studentId,
      examId,
      message: this.formatHallTicketMessage(action, reason),
      reason,
      intelligence: true
    };
    this.addLog(log);
    console.log(`🎫 ${log.message}`);
  }

  logMindMapGeneration(studentId, syllabusId, action, details) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      category: 'MINDMAP_ENGINE',
      level: 'INFO',
      action,
      studentId,
      syllabusId,
      message: this.formatMindMapMessage(action, details),
      details,
      intelligence: true
    };
    this.addLog(log);
    console.log(`🧠 ${log.message}`);
  }

  logEventConflict(eventId, conflictType, resolution) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      category: 'EVENT_ENGINE',
      level: 'WARNING',
      action: 'CONFLICT_DETECTED',
      eventId,
      message: this.formatEventConflictMessage(conflictType, resolution),
      conflictType,
      resolution,
      intelligence: true
    };
    this.addLog(log);
    console.log(`🎭 ${log.message}`);
  }

  logSystemFailure(component, error, rollbackAction, notification) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      category: 'SYSTEM_FAILURE',
      level: 'ERROR',
      action: 'FAILURE_HANDLED',
      component,
      message: this.formatFailureMessage(component, error, rollbackAction, notification),
      error: error.message,
      rollbackAction,
      notification,
      intelligence: true
    };
    this.addLog(log);
    console.log(`⚠️  ${log.message}`);
  }

  // Security and audit logging
  logSecurityEvent(type, userId, details, severity = 'MEDIUM') {
    const event = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      type,
      userId,
      severity,
      details,
      message: this.formatSecurityMessage(type, details)
    };
    this.securityEvents.unshift(event);
    if (this.securityEvents.length > 500) this.securityEvents.pop();
    
    console.log(`🔒 SECURITY: ${event.message}`);
  }

  logAuditEvent(action, userId, resource, changes) {
    const audit = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      action,
      userId,
      resource,
      changes,
      message: this.formatAuditMessage(action, resource, changes)
    };
    this.auditLogs.unshift(audit);
    if (this.auditLogs.length > 1000) this.auditLogs.pop();
    
    console.log(`📋 AUDIT: ${audit.message}`);
  }

  // Message formatting methods
  formatSeatingMessage(action, details) {
    switch (action) {
      case 'ALLOCATION_STARTED':
        return `Seating allocation started for Exam ${details.examCode}`;
      case 'CONFLICT_DETECTED':
        return `Conflict detected → resolved via ${details.resolution}`;
      case 'ALLOCATION_COMPLETED':
        return `Seating allocation completed for ${details.studentCount} students`;
      case 'CAPACITY_EXCEEDED':
        return `Hall capacity insufficient for Exam ${details.examCode}`;
      case 'OPTIMIZATION_APPLIED':
        return `Applied ${details.algorithm} optimization for better seat distribution`;
      default:
        return `Seating engine: ${action}`;
    }
  }

  formatHallTicketMessage(action, reason) {
    switch (action) {
      case 'GENERATED':
        return `Hall ticket generated successfully`;
      case 'BLOCKED':
        return `Hall ticket blocked due to ${reason}`;
      case 'REGENERATED':
        return `Hall ticket regenerated due to ${reason}`;
      case 'QR_EXPIRED':
        return `QR code expired and renewed`;
      default:
        return `Hall ticket: ${action}`;
    }
  }

  formatMindMapMessage(action, details) {
    switch (action) {
      case 'GENERATED':
        return `Mind map generated for ${details.subject} syllabus`;
      case 'UPDATED':
        return `Mind map updated with ${details.newNodes} new concepts`;
      case 'SHARED':
        return `Mind map shared with study group`;
      case 'AI_ENHANCED':
        return `AI enhanced mind map with ${details.suggestions} suggestions`;
      default:
        return `Mind map: ${action}`;
    }
  }

  formatEventConflictMessage(conflictType, resolution) {
    switch (conflictType) {
      case 'EXAM_CONFLICT':
        return `Event registration blocked due to exam conflict → ${resolution}`;
      case 'VENUE_CONFLICT':
        return `Venue double-booking detected → ${resolution}`;
      case 'RESOURCE_CONFLICT':
        return `Resource unavailable → ${resolution}`;
      default:
        return `Event conflict: ${conflictType} → ${resolution}`;
    }
  }

  formatFailureMessage(component, error, rollbackAction, notification) {
    return `${component} failed: ${error.message} → Rollback: ${rollbackAction} → Notified: ${notification}`;
  }

  formatSecurityMessage(type, details) {
    switch (type) {
      case 'FAILED_LOGIN':
        return `Failed login attempt from ${details.ip} for user ${details.email}`;
      case 'SUSPICIOUS_ACTIVITY':
        return `Suspicious activity detected: ${details.activity}`;
      case 'QR_SCAN_FAILED':
        return `Invalid QR code scan attempt: ${details.qrCode}`;
      case 'UNAUTHORIZED_ACCESS':
        return `Unauthorized access attempt to ${details.resource}`;
      case 'SESSION_HIJACK':
        return `Potential session hijacking detected for user ${details.userId}`;
      default:
        return `Security event: ${type}`;
    }
  }

  formatAuditMessage(action, resource, changes) {
    return `${action} on ${resource}: ${JSON.stringify(changes)}`;
  }

  // Utility methods
  addLog(log) {
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) this.logs.pop();
  }

  getIntelligentLogs(limit = 50) {
    return this.logs.filter(log => log.intelligence).slice(0, limit);
  }

  getSecurityEvents(limit = 50) {
    return this.securityEvents.slice(0, limit);
  }

  getAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, limit);
  }

  getAllLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }

  // Simulate intelligent operations for demo
  async simulateIntelligentOperations() {
    // Simulate seating allocation
    setTimeout(() => {
      this.logSeatingDecision('exam-cs401', 'ALLOCATION_STARTED', { examCode: 'CS401' });
    }, 2000);

    setTimeout(() => {
      this.logSeatingDecision('exam-cs401', 'CONFLICT_DETECTED', { resolution: 'local swap algorithm' });
    }, 4000);

    setTimeout(() => {
      this.logSeatingDecision('exam-cs401', 'ALLOCATION_COMPLETED', { studentCount: 45 });
    }, 6000);

    // Simulate hall ticket decisions
    setTimeout(() => {
      this.logHallTicketDecision('student-123', 'exam-math201', 'BLOCKED', 'attendance shortage (65% required)');
    }, 8000);

    // Simulate mind map generation
    setTimeout(() => {
      this.logMindMapGeneration('student-456', 'syllabus-dbms', 'GENERATED', { subject: 'DBMS' });
    }, 10000);

    // Simulate event conflicts
    setTimeout(() => {
      this.logEventConflict('event-tech-fest', 'EXAM_CONFLICT', 'rescheduled to next week');
    }, 12000);

    // Simulate security events
    setTimeout(() => {
      this.logSecurityEvent('FAILED_LOGIN', 'user-789', { ip: '192.168.1.100', email: 'hacker@example.com' }, 'HIGH');
    }, 14000);

    setTimeout(() => {
      this.logSecurityEvent('QR_SCAN_FAILED', 'student-321', { qrCode: 'INVALID-QR-12345' }, 'MEDIUM');
    }, 16000);

    // Simulate system failure
    setTimeout(() => {
      this.logSystemFailure('SEATING_ENGINE', new Error('Hall capacity insufficient'), 'allocation reverted', 'admin@university.edu');
    }, 18000);
  }

  // Start continuous intelligent logging simulation (DISABLED)
  startIntelligentLogging() {
    // Disabled to reduce terminal noise
    // this.simulateIntelligentOperations();
    
    // Continue generating logs every 30 seconds
    // setInterval(() => {
    //   this.simulateRandomIntelligentOperation();
    // }, 30000);
  }

  simulateRandomIntelligentOperation() {
    const operations = [
      () => this.logSeatingDecision(`exam-${Math.random().toString(36).substr(2, 6)}`, 'OPTIMIZATION_APPLIED', { algorithm: 'genetic algorithm' }),
      () => this.logHallTicketDecision(`student-${Math.random().toString(36).substr(2, 6)}`, `exam-${Math.random().toString(36).substr(2, 6)}`, 'GENERATED', 'eligibility verified'),
      () => this.logMindMapGeneration(`student-${Math.random().toString(36).substr(2, 6)}`, `syllabus-${Math.random().toString(36).substr(2, 6)}`, 'AI_ENHANCED', { suggestions: Math.floor(Math.random() * 10) + 1 }),
      () => this.logEventConflict(`event-${Math.random().toString(36).substr(2, 6)}`, 'VENUE_CONFLICT', 'moved to alternate venue'),
      () => this.logSecurityEvent('SUSPICIOUS_ACTIVITY', `user-${Math.random().toString(36).substr(2, 6)}`, { activity: 'multiple rapid API calls' }, 'MEDIUM')
    ];

    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    randomOperation();
  }
}

// Create singleton instance
const intelligentLogger = new IntelligentLogger();

module.exports = intelligentLogger;