const express = require('express');
const { signup, login, getMe, updatePassword, sendOtp, verifyOtp } = require('../controllers/authController');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', signup);
router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  return login(req, res, next);
});

router.post('/send-otp', [
  body('email').isEmail()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  return sendOtp(req, res, next);
});

router.post('/verify-otp', [
  body('email').isEmail(),
  body('code').isLength({ min: 4 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  return verifyOtp(req, res, next);
});

// Protected routes (require authentication)
router.use(auth);

router.get('/me', getMe);
router.patch('/update-password', updatePassword);

module.exports = router;
