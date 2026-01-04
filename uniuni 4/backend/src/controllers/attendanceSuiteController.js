const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== ATTENDANCE SUITE APIS =====

// Get attendance suite dashboard
const getAttendanceSuiteDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = {
      overallAttendance: 92,
      currentCGPA: 9.3,
      activeCourses: 12,
      wellbeingScore: 72,
      attendanceStreak: 28,
      shortageAlerts: 1
    };

    const weeklyData = [
      { day: 'Mon', present: 5, absent: 1 },
      { day: 'Tue', present: 6, absent: 0 },
      { day: 'Wed', present: 4, absent: 2 },
      { day: 'Thu', present: 5, absent: 1 },
      { day: 'Fri', present: 6, absent: 0 }
    ];

    const monthlyTrend = [
      { month: 'Aug', attendance: 85 },
      { month: 'Sep', attendance: 78 },
      { month: 'Oct', attendance: 92 },
      { month: 'Nov', attendance: 88 },
      { month: 'Dec', attendance: 95 }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        weeklyData,
        monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get subject-wise attendance
const getSubjectWiseAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subjects = [
      { code: 'CS301', name: 'Data Structures', attended: 42, total: 45, percentage: 93, canMiss: 5, color: '#10b981' },
      { code: 'CS302', name: 'Web Development', attended: 38, total: 44, percentage: 86, canMiss: 3, color: '#3b82f6' },
      { code: 'CS303', name: 'Database Systems', attended: 35, total: 42, percentage: 83, canMiss: 2, color: '#8b5cf6' },
      { code: 'CS304', name: 'Computer Networks', attended: 32, total: 45, percentage: 71, canMiss: 0, color: '#ef4444' },
      { code: 'CS305', name: 'Operating Systems', attended: 40, total: 44, percentage: 91, canMiss: 4, color: '#06b6d4' },
      { code: 'CS306', name: 'Software Engineering', attended: 41, total: 43, percentage: 95, canMiss: 6, color: '#ec4899' }
    ];

    res.status(200).json({
      status: 'success',
      data: { subjects }
    });
  } catch (error) {
    next(error);
  }
};

// Get today's schedule
const getTodaySchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const todaySchedule = [
      { time: '9:00 AM', subject: 'Data Structures', room: 'Lab 301', faculty: 'Prof. Sharma', status: 'attended' },
      { time: '11:00 AM', subject: 'Web Development', room: 'Room 205', faculty: 'Prof. Patel', status: 'attended' },
      { time: '2:00 PM', subject: 'Database Systems', room: 'Lab 402', faculty: 'Prof. Reddy', status: 'upcoming' },
      { time: '4:00 PM', subject: 'Computer Networks', room: 'Room 108', faculty: 'Prof. Singh', status: 'upcoming' }
    ];

    res.status(200).json({
      status: 'success',
      data: { todaySchedule }
    });
  } catch (error) {
    next(error);
  }
};

// Mark attendance for class
const markAttendance = async (req, res, next) => {
  try {
    const { classId, status } = req.body;
    const userId = req.user.id;

    // Mock attendance marking
    const attendanceRecord = {
      id: Date.now(),
      userId,
      classId,
      status, // 'present' or 'absent'
      markedAt: new Date().toISOString(),
      method: 'manual' // or 'qr', 'biometric', etc.
    };

    res.status(201).json({
      status: 'success',
      message: `Attendance marked as ${status}`,
      data: { attendanceRecord }
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance analytics
const getAttendanceAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeRange = '30d' } = req.query;

    const analytics = {
      semesterComparison: [
        { semester: 'Sem 1', attendance: 88 },
        { semester: 'Sem 2', attendance: 85 },
        { semester: 'Sem 3', attendance: 92 },
        { semester: 'Sem 4', attendance: 90 },
        { semester: 'Sem 5', attendance: 92 }
      ],
      attendanceByTimeSlot: [
        { slot: '8-9 AM', percentage: 85, count: 68 },
        { slot: '9-10 AM', percentage: 92, count: 74 },
        { slot: '10-11 AM', percentage: 95, count: 76 },
        { slot: '11-12 PM', percentage: 88, count: 70 },
        { slot: '2-3 PM', percentage: 90, count: 72 },
        { slot: '3-4 PM', percentage: 87, count: 69 }
      ],
      peerComparison: [
        { category: 'Attendance', you: 92, classAvg: 85 },
        { category: 'Punctuality', you: 88, classAvg: 82 },
        { category: 'Leave Days', you: 3, classAvg: 5 }
      ],
      attendanceGoals: [
        { goal: 'Reach 95% Overall', current: 92, target: 95, daysNeeded: 8 },
        { goal: 'Fix CS304 Shortage', current: 71, target: 75, daysNeeded: 12 },
        { goal: 'Maintain Perfect Week', current: 5, target: 5, daysNeeded: 0 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance badges and achievements
const getAttendanceBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const badges = [
      { name: 'Perfect Month', icon: 'Trophy', earned: true, date: 'Nov 2024' },
      { name: '30-Day Streak', icon: 'Flame', earned: true, date: 'Current' },
      { name: '95% Club', icon: 'Award', earned: false, progress: 92 },
      { name: 'Early Bird', icon: 'Zap', earned: true, date: 'Oct 2024' }
    ];

    res.status(200).json({
      status: 'success',
      data: { badges }
    });
  } catch (error) {
    next(error);
  }
};

// Get leave applications
const getLeaveApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const leaveApplications = [
      { id: 1, type: 'Medical', date: '2024-12-10', duration: '1 day', status: 'Approved', reason: 'Fever' },
      { id: 2, type: 'Personal', date: '2024-11-28', duration: '2 days', status: 'Approved', reason: 'Family Function' },
      { id: 3, type: 'Medical', date: '2024-11-15', duration: '3 days', status: 'Approved', reason: 'Viral Infection' }
    ];

    res.status(200).json({
      status: 'success',
      results: leaveApplications.length,
      data: { leaveApplications }
    });
  } catch (error) {
    next(error);
  }
};

// Apply for leave
const applyForLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason, documents } = req.body;
    const userId = req.user.id;

    const leaveApplication = {
      id: Date.now(),
      userId,
      type,
      startDate,
      endDate,
      reason,
      documents: documents || [],
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      duration: `${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} day(s)`
    };

    res.status(201).json({
      status: 'success',
      message: 'Leave application submitted successfully',
      data: { leaveApplication }
    });
  } catch (error) {
    next(error);
  }
};

// Get late arrivals
const getLateArrivals = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const lateArrivals = [
      { date: '2024-12-08', time: '9:15 AM', subject: 'Data Structures', delay: '15 min', reason: 'Traffic' },
      { date: '2024-12-01', time: '8:20 AM', subject: 'Web Dev', delay: '20 min', reason: 'Bus delay' }
    ];

    res.status(200).json({
      status: 'success',
      results: lateArrivals.length,
      data: { lateArrivals }
    });
  } catch (error) {
    next(error);
  }
};

// Get parent notifications
const getParentNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const parentNotifications = [
      { date: '2024-12-01', message: 'Attendance below 75% in CS304', sent: true },
      { date: '2024-11-15', message: 'Improved attendance - Good progress', sent: true }
    ];

    res.status(200).json({
      status: 'success',
      results: parentNotifications.length,
      data: { parentNotifications }
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance predictions
const getAttendancePredictions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const predictions = {
      endOfSemesterForecast: 94,
      gpaCorrelation: 8.8,
      currentStreak: 28,
      riskAnalysis: {
        subjects: [
          { code: 'CS304', risk: 'high', currentAttendance: 71, requiredAttendance: 75 }
        ],
        recommendations: [
          'Attend next 12 CS304 classes to avoid shortage',
          'Maintain current pattern for other subjects',
          'Consider medical leave if needed'
        ]
      }
    };

    res.status(200).json({
      status: 'success',
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};

// Export attendance report
const exportAttendanceReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { format = 'pdf', timeRange = '30d' } = req.query;

    // Mock report generation
    const report = {
      id: `report_${Date.now()}`,
      format,
      timeRange,
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/reports/attendance_${userId}_${Date.now()}.${format}`,
      size: '2.5 MB'
    };

    res.status(200).json({
      status: 'success',
      message: 'Report generated successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

// QR code attendance
const markAttendanceByQR = async (req, res, next) => {
  try {
    const { qrCode, location } = req.body;
    const userId = req.user.id;

    // Mock QR code validation and attendance marking
    const attendanceRecord = {
      id: Date.now(),
      userId,
      qrCode,
      location,
      status: 'present',
      markedAt: new Date().toISOString(),
      method: 'qr',
      verified: true
    };

    res.status(201).json({
      status: 'success',
      message: 'Attendance marked successfully via QR code',
      data: { attendanceRecord }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendanceSuiteDashboard,
  getSubjectWiseAttendance,
  getTodaySchedule,
  markAttendance,
  getAttendanceAnalytics,
  getAttendanceBadges,
  getLeaveApplications,
  applyForLeave,
  getLateArrivals,
  getParentNotifications,
  getAttendancePredictions,
  exportAttendanceReport,
  markAttendanceByQR
};