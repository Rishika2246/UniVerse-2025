const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== ADMIN DASHBOARD APIS =====

// Get admin dashboard overview
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeStudents,
      facultyMembers,
      totalCourses,
      totalExams,
      totalRooms,
      totalClubs,
      totalEvents,
      recentActivity,
      systemMetrics
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: { name: 'STUDENT' }
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: { name: 'FACULTY' }
            }
          }
        }
      }),
      prisma.course.count(),
      prisma.exam.count(),
      prisma.room.count(),
      prisma.club.count(),
      prisma.event.count(),
      // Mock recent activity
      Promise.resolve([
        { action: 'New student enrollment', user: 'System', time: '5 mins ago', type: 'success' },
        { action: 'Faculty account created', user: 'Admin', time: '15 mins ago', type: 'info' },
        { action: 'Failed login attempt detected', user: 'Security', time: '1 hour ago', type: 'warning' },
      ]),
      // Mock system metrics
      Promise.resolve({
        cpuUsage: 76,
        memoryUsage: 82,
        requestsPerMinute: 3200,
        systemHealth: 98
      })
    ]);

    const stats = {
      totalUsers,
      activeStudents,
      facultyMembers,
      totalCourses,
      totalExams,
      totalRooms,
      totalClubs,
      totalEvents,
      systemHealth: systemMetrics.systemHealth
    };

    // Mock enrollment data
    const enrollmentData = [
      { month: 'Jan', students: 1650, faculty: 120 },
      { month: 'Feb', students: 1700, faculty: 125 },
      { month: 'Mar', students: 1750, faculty: 130 },
      { month: 'Apr', students: 1800, faculty: 140 },
      { month: 'May', students: 1850, faculty: 145 },
    ];

    // Mock platform usage
    const platformUsage = [
      { name: 'Login Activity', value: 45000, color: '#06b6d4' },
      { name: 'Feature Usage', value: 35000, color: '#3b82f6' },
      { name: 'API Calls', value: 25000, color: '#8b5cf6' },
      { name: 'Data Transfers', value: 15000, color: '#ec4899' },
    ];

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        enrollmentData,
        platformUsage,
        recentActivity,
        systemMetrics
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '7d' } = req.query;

    // Mock analytics data based on time range
    const analyticsData = {
      systemPerformance: {
        cpuUsage: 76,
        memoryUsage: 82,
        requestsPerMinute: 3200,
        responseTime: 120
      },
      featureUsage: [
        { feature: 'Attendance', usage: 8500, growth: 15 },
        { feature: 'Exams', usage: 7200, growth: 22 },
        { feature: 'Study Materials', usage: 6800, growth: 18 },
        { feature: 'AI Assistant', usage: 5500, growth: 35 },
        { feature: 'Clubs & Events', usage: 4200, growth: 12 },
      ],
      userActivity: {
        totalLogins: 12500,
        uniqueUsers: 2340,
        averageSessionTime: 45,
        bounceRate: 12
      },
      systemMetrics: [
        { time: '00:00', cpu: 45, memory: 62, requests: 1200 },
        { time: '04:00', cpu: 32, memory: 58, requests: 800 },
        { time: '08:00', cpu: 78, memory: 85, requests: 3200 },
        { time: '12:00', cpu: 92, memory: 91, requests: 4500 },
        { time: '16:00', cpu: 88, memory: 87, requests: 4200 },
        { time: '20:00', cpu: 65, memory: 72, requests: 2800 },
      ]
    };

    res.status(200).json({
      status: 'success',
      data: analyticsData
    });
  } catch (error) {
    next(error);
  }
};

// User management
const getAllUsers = async (req, res, next) => {
  try {
    const { 
      filter = 'all', 
      search = '', 
      page = 1, 
      limit = 50 
    } = req.query;

    let whereClause = {};

    // Apply role filter
    if (filter !== 'all') {
      whereClause.roles = {
        some: {
          role: { name: filter.toUpperCase() }
        }
      };
    }

    // Apply search filter
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          roles: {
            include: {
              role: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    // Add mock additional data
    const usersWithStats = users.map(user => ({
      ...user,
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      coursesCount: Math.floor(Math.random() * 8) + 1
    }));

    res.status(200).json({
      status: 'success',
      results: users.length,
      totalCount,
      data: {
        users: usersWithStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create user
const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, rollNo, roles = ['STUDENT'] } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    // Hash password (in real implementation)
    const passwordHash = password; // Should be hashed

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        rollNo
      }
    });

    // Assign roles
    for (const roleName of roles) {
      const role = await prisma.role.findUnique({
        where: { name: roleName }
      });

      if (role) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id
          }
        });
      }
    }

    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// System management
const getDatabaseStats = async (req, res, next) => {
  try {
    const stats = {
      size: '2.4 GB',
      lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tables: 25,
      records: 125000,
      connections: 45
    };

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Backup database
const backupDatabase = async (req, res, next) => {
  try {
    // Mock backup process
    setTimeout(() => {
      // In real implementation, trigger actual backup
    }, 1000);

    res.status(200).json({
      status: 'success',
      message: 'Database backup initiated',
      data: {
        backupId: `backup_${Date.now()}`,
        estimatedTime: '5 minutes'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get security logs
const getSecurityLogs = async (req, res, next) => {
  try {
    const logs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        event: 'Failed login attempt',
        ip: '192.168.1.100',
        user: 'unknown',
        severity: 'medium'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        event: 'Successful admin login',
        ip: '192.168.1.50',
        user: 'admin@university.edu',
        severity: 'low'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

// System configuration
const getSystemConfig = async (req, res, next) => {
  try {
    const config = {
      maintenance: {
        enabled: false,
        scheduledAt: null,
        message: ''
      },
      security: {
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        passwordPolicy: {
          minLength: 8,
          requireSpecialChars: true,
          requireNumbers: true
        }
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      },
      features: {
        aiAssistant: true,
        mindMaps: true,
        seatingAllocation: true,
        clubsEvents: true
      }
    };

    res.status(200).json({
      status: 'success',
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// Update system configuration
const updateSystemConfig = async (req, res, next) => {
  try {
    const updates = req.body;

    // In real implementation, update system configuration
    // For now, just return success

    res.status(200).json({
      status: 'success',
      message: 'System configuration updated',
      data: updates
    });
  } catch (error) {
    next(error);
  }
};

// Reports and exports
const generateSystemReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;

    const report = {
      id: `report_${Date.now()}`,
      type,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: {
        users: {
          total: 2340,
          new: 45,
          active: 2180
        },
        activity: {
          logins: 12500,
          pageViews: 85000,
          features: {
            attendance: 8500,
            exams: 7200,
            study: 6800
          }
        },
        performance: {
          averageResponseTime: 120,
          uptime: 99.8,
          errors: 12
        }
      }
    };

    res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getSystemAnalytics,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getDatabaseStats,
  backupDatabase,
  getSecurityLogs,
  getSystemConfig,
  updateSystemConfig,
  generateSystemReport
};