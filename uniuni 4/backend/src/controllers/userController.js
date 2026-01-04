const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        rollNo: true,
        createdAt: true,
        updatedAt: true,
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

    // Format the response
    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.roles.map((ur) => ur.role.name),
    }));

    res.status(200).json({
      status: 'success',
      results: formattedUsers.length,
      data: {
        users: formattedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        rollNo: true,
        createdAt: true,
        updatedAt: true,
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

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Format the response
    const formattedUser = {
      ...user,
      roles: user.roles.map((ur) => ur.role.name),
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: formattedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only or own profile)
const updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile or is an admin
    if (req.params.id !== req.user.id && !req.user.roles.includes('ADMIN')) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const { fullName, rollNo } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        fullName,
        rollNo,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        rollNo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res, next) => {
  try {
    // Prevent users from deleting themselves
    if (req.params.id === req.user.id) {
      return next(new AppError('You cannot delete your own account', 400));
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Delete user (Prisma's cascading deletes will handle related records)
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update user roles (admin only)
const updateUserRoles = async (req, res, next) => {
  try {
    const { roles } = req.body;

    // Check if roles array is provided
    if (!roles || !Array.isArray(roles)) {
      return next(new AppError('Please provide an array of roles', 400));
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
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

    // Get all valid roles from the database
    const validRoles = await prisma.role.findMany({
      where: {
        name: {
          in: roles,
        },
      },
    });

    // Check if all provided roles are valid
    if (validRoles.length !== roles.length) {
      return next(new AppError('One or more roles are invalid', 400));
    }

    // Delete existing user roles
    await prisma.userRole.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Add new roles
    const userRoles = await Promise.all(
      validRoles.map((role) =>
        prisma.userRole.create({
          data: {
            user: { connect: { id: user.id } },
            role: { connect: { id: role.id } },
          },
          include: {
            role: true,
          },
        })
      )
    );

    // Format the response
    const formattedUser = {
      ...user,
      roles: userRoles.map((ur) => ur.role.name),
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: formattedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRoles,
};
