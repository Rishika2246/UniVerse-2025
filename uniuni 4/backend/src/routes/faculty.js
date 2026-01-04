const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect, restrictTo } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);
router.use(restrictTo('FACULTY'));

// Dashboard
router.get('/dashboard', facultyController.getFacultyDashboard);

// Academic Delivery
router.get('/materials', facultyController.getCourseMaterials);
router.post('/materials', facultyController.uploadCourseMaterial);
router.patch('/materials/:materialId', facultyController.updateCourseMaterial);
router.delete('/materials/:materialId', facultyController.deleteCourseMaterial);
router.post('/materials/:materialId/share', facultyController.shareMaterial);

// Assignments
router.get('/assignments', facultyController.getAssignments);
router.post('/assignments', facultyController.createAssignment);
router.patch('/assignments/:assignmentId', facultyController.updateAssignment);
router.delete('/assignments/:assignmentId', facultyController.deleteAssignment);

// Attendance
router.get('/attendance', facultyController.getAttendanceData);
router.post('/attendance', facultyController.markAttendance);
router.post('/attendance/qr', facultyController.generateAttendanceQR);

// Communication
router.get('/announcements', facultyController.getAnnouncements);
router.post('/announcements', facultyController.createAnnouncement);
router.post('/bulk-email', facultyController.sendBulkEmail);

// Student Management
router.get('/students', facultyController.getStudents);
router.get('/students/:studentId', facultyController.getStudentDetails);

// Evaluation & Grading
router.get('/grades', facultyController.getGrades);
router.post('/grades', facultyController.submitGrades);

// Quizzes
router.get('/quizzes', facultyController.getQuizzes);
router.post('/quizzes', facultyController.createQuiz);

// Analytics
router.get('/analytics', facultyController.getPerformanceAnalytics);

module.exports = router;