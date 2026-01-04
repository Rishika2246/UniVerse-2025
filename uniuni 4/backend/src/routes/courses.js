const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  getEnrolledStudents,
} = require('../controllers/courseController');
const { auth, hasAnyRole } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const { q, department, semester, page = 1, limit = 20 } = req.query;
    const where = {};
    if (q) where.OR = [{ code: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }, { department: { contains: q, mode: 'insensitive' } }];
    if (department) where.department = { equals: department };
    if (semester) where.semester = parseInt(semester, 10);
    const take = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (parseInt(page, 10) - 1) * take;
    const [items, total] = await Promise.all([
      prisma.course.findMany({ where, orderBy: [{ department: 'asc' }, { semester: 'asc' }, { code: 'asc' }], skip, take }),
      prisma.course.count({ where }),
    ]);
    res.json({ total, page: parseInt(page, 10), limit: take, items });
  } catch (error) { next(error); }
});
router.get('/:id', getCourse);

// Protected routes (require authentication)
router.use(auth);

// Admin only routes
router.post('/', hasAnyRole('ADMIN'), createCourse);
router
  .route('/:id')
  .patch(hasAnyRole('ADMIN'), updateCourse)
  .delete(hasAnyRole('ADMIN'), deleteCourse);

// Student enrollment
router.post(
  '/:id/enroll',
  hasAnyRole('ADMIN'),
  enrollStudent
);

// Get enrolled students
router.get(
  '/:id/students',
  hasAnyRole('ADMIN', 'SEATING_MANAGER'),
  getEnrolledStudents
);

module.exports = router;
