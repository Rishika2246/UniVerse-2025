const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== FACULTY DASHBOARD APIS =====

// Get faculty dashboard overview
const getFacultyDashboard = async (req, res, next) => {
  try {
    const facultyId = req.user.id;

    const [
      totalStudents,
      activeClasses,
      totalMaterials,
      shortageAlerts,
      todaySchedule,
      recentActivity
    ] = await Promise.all([
      // Mock data - in real implementation, get from database
      Promise.resolve(125),
      Promise.resolve(3),
      Promise.resolve(24),
      Promise.resolve(3),
      Promise.resolve([
        { time: '09:00 AM - 10:30 AM', subject: 'Data Structures', room: 'Room 301', batch: 'CSE-3A', students: 45 },
        { time: '11:00 AM - 12:30 PM', subject: 'Web Development', room: 'Lab 4', batch: 'CSE-3B', students: 42 },
        { time: '02:00 PM - 03:30 PM', subject: 'Advanced Algorithms', room: 'Room 205', batch: 'CSE-4A', students: 38 }
      ]),
      Promise.resolve([
        { action: 'Material uploaded', item: 'Unit 1 - Introduction', time: '2 hours ago' },
        { action: 'Assignment created', item: 'Binary Trees Implementation', time: '5 hours ago' },
        { action: 'Attendance marked', item: 'CS301 - Data Structures', time: '1 day ago' }
      ])
    ]);

    const stats = {
      totalStudents,
      activeClasses,
      totalMaterials,
      shortageAlerts
    };

    const attendanceTrend = [
      { week: 'Week 1', attendance: 88, avgGrade: 75 },
      { week: 'Week 2', attendance: 92, avgGrade: 78 },
      { week: 'Week 3', attendance: 85, avgGrade: 76 },
      { week: 'Week 4', attendance: 90, avgGrade: 80 },
      { week: 'Week 5', attendance: 94, avgGrade: 82 }
    ];

    const gradeDistribution = [
      { grade: 'A+', count: 8, percentage: 18 },
      { grade: 'A', count: 12, percentage: 27 },
      { grade: 'B+', count: 10, percentage: 22 },
      { grade: 'B', count: 8, percentage: 18 },
      { grade: 'C', count: 5, percentage: 11 },
      { grade: 'F', count: 2, percentage: 4 }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        todaySchedule,
        attendanceTrend,
        gradeDistribution,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ACADEMIC DELIVERY APIS =====

// Get course materials
const getCourseMaterials = async (req, res, next) => {
  try {
    const { classCode, page = 1, limit = 20 } = req.query;
    const facultyId = req.user.id;

    // Mock materials data
    const materials = [
      { id: 1, title: 'Unit 1 - Introduction to DS', type: 'PDF', size: '2.5 MB', uploadDate: '2024-01-15', downloads: 42, views: 120, class: 'CS301', status: 'published', sharedWith: ['CS301', 'CS302'], fileName: 'unit1_intro.pdf' },
      { id: 2, title: 'Lecture 5 - Trees', type: 'PPT', size: '5.1 MB', uploadDate: '2024-01-20', downloads: 38, views: 98, class: 'CS301', status: 'published', sharedWith: ['CS301'], fileName: 'lecture5_trees.ppt' },
      { id: 3, title: 'Lab Assignment 3', type: 'PDF', size: '1.2 MB', uploadDate: '2024-01-25', downloads: 45, views: 135, class: 'CS301', status: 'draft', sharedWith: [], fileName: 'lab_assignment3.pdf' },
      { id: 4, title: 'Data Structures Video Tutorial', type: 'Video', size: '125 MB', uploadDate: '2024-01-28', downloads: 28, views: 85, class: 'CS301', status: 'published', sharedWith: ['CS301'], fileName: 'ds_tutorial.mp4' }
    ];

    const filteredMaterials = classCode ? materials.filter(m => m.class === classCode) : materials;

    res.status(200).json({
      status: 'success',
      results: filteredMaterials.length,
      data: {
        materials: filteredMaterials,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredMaterials.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Upload course material
const uploadCourseMaterial = async (req, res, next) => {
  try {
    const { title, type, classCode, description } = req.body;
    const facultyId = req.user.id;

    // In real implementation, handle file upload
    const material = {
      id: Date.now(),
      title,
      type,
      size: '2.5 MB', // Mock size
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
      class: classCode,
      status: 'published',
      sharedWith: [classCode],
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.${type.toLowerCase()}`,
      description,
      facultyId
    };

    res.status(201).json({
      status: 'success',
      data: { material }
    });
  } catch (error) {
    next(error);
  }
};

// Update course material
const updateCourseMaterial = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const updates = req.body;

    // Mock update
    const updatedMaterial = {
      id: materialId,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: { material: updatedMaterial }
    });
  } catch (error) {
    next(error);
  }
};

// Delete course material
const deleteCourseMaterial = async (req, res, next) => {
  try {
    const { materialId } = req.params;

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Share material with classes
const shareMaterial = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { classIds } = req.body;

    res.status(200).json({
      status: 'success',
      message: `Material shared with ${classIds.length} classes`,
      data: { sharedWith: classIds }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ASSIGNMENT MANAGEMENT APIS =====

// Get assignments
const getAssignments = async (req, res, next) => {
  try {
    const { classCode, status } = req.query;
    const facultyId = req.user.id;

    const assignments = [
      { id: 1, title: 'Binary Trees Implementation', dueDate: '2024-12-15', submitted: 38, total: 45, status: 'active', graded: 25, class: 'CS301', points: 100, type: 'Programming', description: 'Implement binary tree operations' },
      { id: 2, title: 'Sorting Algorithms', dueDate: '2024-12-10', submitted: 45, total: 45, status: 'completed', graded: 45, class: 'CS301', points: 100, type: 'Programming', description: 'Compare sorting algorithms' },
      { id: 3, title: 'Graph Traversal', dueDate: '2024-12-20', submitted: 12, total: 45, status: 'active', graded: 0, class: 'CS301', points: 100, type: 'Programming', description: 'Implement DFS and BFS' }
    ];

    let filteredAssignments = assignments;
    if (classCode) filteredAssignments = filteredAssignments.filter(a => a.class === classCode);
    if (status) filteredAssignments = filteredAssignments.filter(a => a.status === status);

    res.status(200).json({
      status: 'success',
      results: filteredAssignments.length,
      data: { assignments: filteredAssignments }
    });
  } catch (error) {
    next(error);
  }
};

// Create assignment
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, points, type, classCode } = req.body;
    const facultyId = req.user.id;

    const assignment = {
      id: Date.now(),
      title,
      description,
      dueDate,
      points: parseInt(points),
      type,
      class: classCode,
      status: 'active',
      submitted: 0,
      total: 45, // Mock total students
      graded: 0,
      createdAt: new Date().toISOString(),
      facultyId
    };

    res.status(201).json({
      status: 'success',
      data: { assignment }
    });
  } catch (error) {
    next(error);
  }
};

// Update assignment
const updateAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;

    const updatedAssignment = {
      id: assignmentId,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: { assignment: updatedAssignment }
    });
  } catch (error) {
    next(error);
  }
};

// Delete assignment
const deleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// ===== ATTENDANCE MANAGEMENT APIS =====

// Get attendance data
const getAttendanceData = async (req, res, next) => {
  try {
    const { classCode, date, month } = req.query;
    const facultyId = req.user.id;

    // Mock attendance data
    const attendanceData = {
      classCode,
      date: date || new Date().toISOString().split('T')[0],
      students: [
        { id: 'STU001', name: 'Aarav Mehta', rollNo: '20CS001', present: true, attendance: 92 },
        { id: 'STU002', name: 'Priya Sharma', rollNo: '20CS002', present: true, attendance: 88 },
        { id: 'STU003', name: 'Rohan Patel', rollNo: '20CS003', present: false, attendance: 65 },
        { id: 'STU004', name: 'Ananya Singh', rollNo: '20CS004', present: true, attendance: 95 }
      ],
      summary: {
        totalStudents: 45,
        present: 38,
        absent: 7,
        percentage: 84.4
      }
    };

    res.status(200).json({
      status: 'success',
      data: attendanceData
    });
  } catch (error) {
    next(error);
  }
};

// Mark attendance
const markAttendance = async (req, res, next) => {
  try {
    const { classCode, date, attendanceData } = req.body;
    const facultyId = req.user.id;

    // Mock attendance marking
    const result = {
      classCode,
      date,
      totalStudents: attendanceData.length,
      present: attendanceData.filter(a => a.present).length,
      absent: attendanceData.filter(a => !a.present).length,
      markedAt: new Date().toISOString(),
      markedBy: facultyId
    };

    res.status(200).json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Generate QR code for attendance
const generateAttendanceQR = async (req, res, next) => {
  try {
    const { classCode, sessionId } = req.body;
    const facultyId = req.user.id;

    const qrData = {
      sessionId: sessionId || `session_${Date.now()}`,
      classCode,
      facultyId,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      qrCode: `QR_${classCode}_${Date.now()}`
    };

    res.status(200).json({
      status: 'success',
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};

// ===== COMMUNICATION APIS =====

// Get announcements
const getAnnouncements = async (req, res, next) => {
  try {
    const facultyId = req.user.id;

    const announcements = [
      { id: 1, title: 'Class Postponed', message: 'Tomorrow\'s class is postponed to next week', date: '2024-12-03', urgent: true, sentTo: ['CS301'], status: 'sent' },
      { id: 2, title: 'Assignment Extension', message: 'Assignment 3 deadline extended by 2 days', date: '2024-12-02', urgent: false, sentTo: ['CS301', 'CS302'], status: 'sent' }
    ];

    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: { announcements }
    });
  } catch (error) {
    next(error);
  }
};

// Create announcement
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, urgent, classIds } = req.body;
    const facultyId = req.user.id;

    const announcement = {
      id: Date.now(),
      title,
      message,
      urgent: urgent || false,
      sentTo: classIds,
      status: 'sent',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      facultyId
    };

    res.status(201).json({
      status: 'success',
      data: { announcement }
    });
  } catch (error) {
    next(error);
  }
};

// Send bulk email
const sendBulkEmail = async (req, res, next) => {
  try {
    const { subject, message, recipients, classCode } = req.body;
    const facultyId = req.user.id;

    // Mock email sending
    const emailResult = {
      subject,
      message,
      recipientCount: recipients ? recipients.length : 45,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    res.status(200).json({
      status: 'success',
      message: `Email sent to ${emailResult.recipientCount} recipients`,
      data: emailResult
    });
  } catch (error) {
    next(error);
  }
};

// ===== STUDENT MANAGEMENT APIS =====

// Get students
const getStudents = async (req, res, next) => {
  try {
    const { classCode, search } = req.query;
    const facultyId = req.user.id;

    let students = [
      { id: 'STU001', name: 'Aarav Mehta', rollNo: '20CS001', attendance: 92, grade: 'A', cgpa: 8.5, email: 'aarav@university.edu', phone: '+91 9876543210', class: 'CS301', marks: { internal1: 85, internal2: 90, assignments: 88 } },
      { id: 'STU002', name: 'Priya Sharma', rollNo: '20CS002', attendance: 88, grade: 'A', cgpa: 8.2, email: 'priya@university.edu', phone: '+91 9876543211', class: 'CS301', marks: { internal1: 82, internal2: 85, assignments: 86 } },
      { id: 'STU003', name: 'Rohan Patel', rollNo: '20CS003', attendance: 65, grade: 'B', cgpa: 7.1, email: 'rohan@university.edu', phone: '+91 9876543212', class: 'CS301', marks: { internal1: 70, internal2: 68, assignments: 72 } }
    ];

    if (classCode) students = students.filter(s => s.class === classCode);
    if (search) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (error) {
    next(error);
  }
};

// Get student details
const getStudentDetails = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = {
      id: studentId,
      name: 'Aarav Mehta',
      rollNo: '20CS001',
      email: 'aarav@university.edu',
      phone: '+91 9876543210',
      attendance: 92,
      grade: 'A',
      cgpa: 8.5,
      class: 'CS301',
      marks: { internal1: 85, internal2: 90, assignments: 88 },
      attendanceHistory: [
        { date: '2024-12-01', status: 'present' },
        { date: '2024-11-30', status: 'present' },
        { date: '2024-11-29', status: 'absent' }
      ],
      assignmentSubmissions: [
        { title: 'Binary Trees', submittedAt: '2024-11-28', grade: 'A', marks: 88 },
        { title: 'Sorting Algorithms', submittedAt: '2024-11-20', grade: 'A+', marks: 95 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: { student }
    });
  } catch (error) {
    next(error);
  }
};

// ===== EVALUATION & GRADING APIS =====

// Get grades
const getGrades = async (req, res, next) => {
  try {
    const { classCode, examType } = req.query;
    const facultyId = req.user.id;

    const grades = [
      { studentId: 'STU001', name: 'Aarav Mehta', rollNo: '20CS001', internal1: 85, internal2: 90, assignments: 88, total: 87.7, grade: 'A' },
      { studentId: 'STU002', name: 'Priya Sharma', rollNo: '20CS002', internal1: 82, internal2: 85, assignments: 86, total: 84.3, grade: 'A' },
      { studentId: 'STU003', name: 'Rohan Patel', rollNo: '20CS003', internal1: 70, internal2: 68, assignments: 72, total: 70.0, grade: 'B' }
    ];

    res.status(200).json({
      status: 'success',
      results: grades.length,
      data: { grades }
    });
  } catch (error) {
    next(error);
  }
};

// Submit grades
const submitGrades = async (req, res, next) => {
  try {
    const { classCode, examType, grades } = req.body;
    const facultyId = req.user.id;

    // Mock grade submission
    const result = {
      classCode,
      examType,
      gradesSubmitted: grades.length,
      submittedAt: new Date().toISOString(),
      submittedBy: facultyId
    };

    res.status(200).json({
      status: 'success',
      message: `Grades submitted for ${grades.length} students`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// ===== QUIZ MANAGEMENT APIS =====

// Get quizzes
const getQuizzes = async (req, res, next) => {
  try {
    const { classCode } = req.query;
    const facultyId = req.user.id;

    const quizzes = [
      { id: 1, title: 'DS Mid-Term Quiz', date: '2024-12-18', duration: 60, questions: 30, totalMarks: 100, class: 'CS301', status: 'scheduled' },
      { id: 2, title: 'Tree Structures Quick Test', date: '2024-12-05', duration: 30, questions: 15, totalMarks: 50, class: 'CS301', status: 'completed' }
    ];

    const filteredQuizzes = classCode ? quizzes.filter(q => q.class === classCode) : quizzes;

    res.status(200).json({
      status: 'success',
      results: filteredQuizzes.length,
      data: { quizzes: filteredQuizzes }
    });
  } catch (error) {
    next(error);
  }
};

// Create quiz
const createQuiz = async (req, res, next) => {
  try {
    const { title, date, duration, questions, totalMarks, classCode } = req.body;
    const facultyId = req.user.id;

    const quiz = {
      id: Date.now(),
      title,
      date,
      duration: parseInt(duration),
      questions: parseInt(questions),
      totalMarks: parseInt(totalMarks),
      class: classCode,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      facultyId
    };

    res.status(201).json({
      status: 'success',
      data: { quiz }
    });
  } catch (error) {
    next(error);
  }
};

// ===== ANALYTICS APIS =====

// Get performance analytics
const getPerformanceAnalytics = async (req, res, next) => {
  try {
    const { classCode, timeRange = '30d' } = req.query;
    const facultyId = req.user.id;

    const analytics = {
      classPerformance: {
        averageAttendance: 89,
        averageGrade: 7.8,
        passRate: 92,
        topPerformers: 12
      },
      attendanceTrend: [
        { week: 'Week 1', attendance: 88 },
        { week: 'Week 2', attendance: 92 },
        { week: 'Week 3', attendance: 85 },
        { week: 'Week 4', attendance: 90 },
        { week: 'Week 5', attendance: 94 }
      ],
      gradeDistribution: [
        { grade: 'A+', count: 8 },
        { grade: 'A', count: 12 },
        { grade: 'B+', count: 10 },
        { grade: 'B', count: 8 },
        { grade: 'C', count: 5 },
        { grade: 'F', count: 2 }
      ],
      assignmentStats: {
        totalAssignments: 15,
        averageSubmissionRate: 91,
        averageGrade: 82
      }
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacultyDashboard,
  getCourseMaterials,
  uploadCourseMaterial,
  updateCourseMaterial,
  deleteCourseMaterial,
  shareMaterial,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAttendanceData,
  markAttendance,
  generateAttendanceQR,
  getAnnouncements,
  createAnnouncement,
  sendBulkEmail,
  getStudents,
  getStudentDetails,
  getGrades,
  submitGrades,
  getQuizzes,
  createQuiz,
  getPerformanceAnalytics
};