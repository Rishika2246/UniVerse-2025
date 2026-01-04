const express = require('express');
const { 
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  updateUserRoles 
} = require('../controllers/userController');
const { auth, hasAnyRole } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(auth);

// Admin only routes
router.get('/', hasAnyRole('ADMIN'), getAllUsers);
router
  .route('/:id')
  .get(hasAnyRole('ADMIN'), getUser)
  .patch(updateUser) // Users can update their own profile
  .delete(hasAnyRole('ADMIN'), deleteUser);

// Update user roles (admin only)
router.patch('/:id/roles', hasAnyRole('ADMIN'), updateUserRoles);

module.exports = router;
