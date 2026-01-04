const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware to authenticate JWT token
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token && req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        const devUser = await prisma.user.findFirst({
          where: { roles: { some: { role: { name: 'STUDENT' } } } },
          select: { id: true, email: true, fullName: true, roles: { select: { role: { select: { name: true } } } } },
        });
        if (devUser) {
          req.user = {
            id: devUser.id,
            email: devUser.email,
            fullName: devUser.fullName,
            roles: devUser.roles.map((r) => r.role.name),
          };
          return next();
        }
      }
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Add user data to request
    req.user = {
      id: currentUser.id,
      email: currentUser.email,
      fullName: currentUser.fullName,
      roles: currentUser.roles.map((userRole) => userRole.role.name),
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again!',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.',
      });
    }
    next(error);
  }
};

/**
 * Middleware to restrict route to specific roles
 * @param  {...String} roles - Array of role names
 * @returns {Function} Express middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles[0])) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Check if user has any of the specified roles
const hasAnyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.some(role => roles.includes(role))) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = {
  auth,
  protect: auth, // Alias for compatibility
  restrictTo,
  hasAnyRole,
};
