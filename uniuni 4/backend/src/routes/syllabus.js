const express = require('express');
const {
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
} = require('../controllers/syllabusController');
const { auth, hasAnyRole } = require('../middleware/auth');

const router = express.Router();

// Public route
router.get('/:courseId', getSyllabus);

// Protected routes (require authentication)
router.use(auth);

// Admin only routes
router.post('/', hasAnyRole('ADMIN'), createSyllabus);
router
  .route('/:id')
  .patch(hasAnyRole('ADMIN'), updateSyllabus)
  .delete(hasAnyRole('ADMIN'), deleteSyllabus);

module.exports = router;
