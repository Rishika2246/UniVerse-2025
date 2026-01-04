const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/error');
const intelligentLogger = require('../services/intelligentLogger');

const prisma = new PrismaClient();
const otpStore = new Map();
const otpRate = new Map();

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// User registration
const signup = async (req, res, next) => {
  try {
    const { email, password, fullName, rollNo, roles } = req.body;

    // 1) Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // 2) Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3) Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        rollNo,
      },
    });

    // 4) Assign roles
    if (roles && roles.length > 0) {
      const roleAssignments = roles.map((roleName) =>
        prisma.role.findUnique({ where: { name: roleName } }).then((role) => {
          if (!role) return null;
          return prisma.userRole.create({
            data: {
              user: { connect: { id: newUser.id } },
              role: { connect: { id: role.id } },
            },
          });
        })
      );

      await Promise.all(roleAssignments);
    } else {
      // Default role is STUDENT if no roles specified
      const studentRole = await prisma.role.findUnique({
        where: { name: 'STUDENT' },
      });

      if (studentRole) {
        await prisma.userRole.create({
          data: {
            user: { connect: { id: newUser.id } },
            role: { connect: { id: studentRole.id } },
          },
        });
      }
    }

    // 5) Get user with roles
    const userWithRoles = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 6) Generate token and send response
    createSendToken(
      {
        ...userWithRoles,
        roles: userWithRoles.roles.map((ur) => ur.role.name),
      },
      201,
      res
    );
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      // Log failed login attempt
      intelligentLogger.logSecurityEvent('FAILED_LOGIN', user?.id || 'unknown', {
        email,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }, 'HIGH');
      
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    // Log successful login
    intelligentLogger.logAuditEvent('LOGIN', user.id, 'USER_SESSION', {
      email: user.email,
      roles: user.roles.map((ur) => ur.role.name),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    
    createSendToken(
      {
        ...user,
        roles: user.roles.map((ur) => ur.role.name),
      },
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

// Get current user
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user,
          roles: user.roles.map((ur) => ur.role.name),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Get user from collection
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // 2) Check if POSTed current password is correct
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    // 4) Log user in, send JWT
    createSendToken(
      {
        ...user,
        passwordHash: undefined,
      },
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 400));
    const now = Date.now();
    const last = otpRate.get(email) || 0;
    if (now - last < 60 * 1000) return next(new AppError('Too many requests', 429));
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError('User not found', 404));
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(email, { code, expiresAt: now + 5 * 60 * 1000, userId: user.id });
    otpRate.set(email, now);
    console.log(`OTP for ${email}: ${code}`);
    res.status(200).json({ status: 'success', message: 'OTP sent' });
  } catch (error) { next(error); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return next(new AppError('Email and code are required', 400));
    const entry = otpStore.get(email);
    if (!entry) return next(new AppError('OTP not found', 404));
    if (Date.now() > entry.expiresAt) return next(new AppError('OTP expired', 400));
    if (entry.code !== code) return next(new AppError('Invalid OTP', 400));
    const user = await prisma.user.findUnique({ where: { id: entry.userId } });
    if (!user) return next(new AppError('User not found', 404));
    createSendToken(user, 200, res);
    otpStore.delete(email);
  } catch (error) { next(error); }
};

module.exports = {
  signup,
  login,
  getMe,
  updatePassword,
  sendOtp,
  verifyOtp,
};
