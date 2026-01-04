const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');
const systemStatus = require('../services/systemStatus');

const prisma = new PrismaClient();

// Data Management Dashboard
router.get('/', (req, res) => {
  res.render('data-management');
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.role.count(),
      prisma.course.count(),
      prisma.exam.count(),
      prisma.room.count(),
      prisma.seat.count(),
      prisma.seatingAllocation.count(),
      prisma.hallTicket.count(),
      prisma.mindMap.count(),
      prisma.mindMapNode.count(),
      prisma.club.count(),
      prisma.event.count(),
      prisma.eventAttendee.count(),
      prisma.student.count(),
      prisma.grade.count(),
      prisma.syllabus.count(),
      prisma.studentCourse.count(),
      prisma.userRole.count()
    ]);

    const [
      users, roles, courses, exams, rooms, seats, seatingAllocations,
      hallTickets, mindMaps, mindMapNodes, clubs, events, eventAttendees,
      students, grades, syllabi, studentCourses, userRoles
    ] = stats;

    // Get role breakdown
    const roleBreakdown = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    // Get department breakdown
    const departmentBreakdown = await prisma.course.groupBy({
      by: ['department'],
      _count: {
        department: true
      }
    });

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { fullName: true, email: true, createdAt: true }
    });

    const recentExams = await prisma.exam.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { course: { select: { name: true, code: true } } }
    });

    res.json({
      summary: {
        users,
        roles,
        courses,
        exams,
        rooms,
        seats,
        seatingAllocations,
        hallTickets,
        mindMaps,
        mindMapNodes,
        clubs,
        events,
        eventAttendees,
        students,
        grades,
        syllabi,
        studentCourses,
        userRoles
      },
      breakdown: {
        roles: roleBreakdown,
        departments: departmentBreakdown
      },
      recent: {
        users: recentUsers,
        exams: recentExams
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run massive seed
router.post('/seed/massive', async (req, res) => {
  try {
    systemStatus.logIntelligentOperation('Data Management', 'Starting massive seed operation...');
    
    const seedProcess = spawn('node', ['prisma/massiveSeed.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    let error = '';

    seedProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    seedProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    seedProcess.on('close', (code) => {
      if (code === 0) {
        systemStatus.logSuccess('Data Management', 'Massive seed completed successfully');
        res.json({
          success: true,
          message: 'Massive seed completed successfully',
          output: output,
          timestamp: new Date().toISOString()
        });
      } else {
        systemStatus.logError('Data Management', `Massive seed failed with code ${code}`);
        res.status(500).json({
          success: false,
          message: 'Massive seed failed',
          error: error,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    });

  } catch (error) {
    systemStatus.logError('Data Management', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Import CSV data
router.post('/import/csv', async (req, res) => {
  try {
    systemStatus.logIntelligentOperation('Data Management', 'Starting CSV import...');
    
    const importProcess = spawn('node', ['prisma/importStudentData.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    let error = '';

    importProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    importProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    importProcess.on('close', (code) => {
      if (code === 0) {
        systemStatus.logSuccess('Data Management', 'CSV import completed successfully');
        res.json({
          success: true,
          message: 'CSV import completed successfully',
          output: output,
          timestamp: new Date().toISOString()
        });
      } else {
        systemStatus.logError('Data Management', `CSV import failed with code ${code}`);
        res.status(500).json({
          success: false,
          message: 'CSV import failed',
          error: error,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    });

  } catch (error) {
    systemStatus.logError('Data Management', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
router.post('/clear', async (req, res) => {
  try {
    systemStatus.logIntelligentOperation('Data Management', 'Clearing all data...');
    
    // Delete in correct order to avoid foreign key constraints
    await prisma.eventAttendee.deleteMany();
    await prisma.eventDocument.deleteMany();
    await prisma.event.deleteMany();
    await prisma.club.deleteMany();
    await prisma.studyResource.deleteMany();
    await prisma.mindMapNode.deleteMany();
    await prisma.mindMap.deleteMany();
    await prisma.hallTicket.deleteMany();
    await prisma.seatingAllocation.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.room.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.studentCourse.deleteMany();
    await prisma.syllabus.deleteMany();
    await prisma.course.deleteMany();
    await prisma.grade.deleteMany();
    await prisma.student.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    systemStatus.logSuccess('Data Management', 'All data cleared successfully');
    res.json({
      success: true,
      message: 'All data cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    systemStatus.logError('Data Management', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Reset database (clear + seed)
router.post('/reset', async (req, res) => {
  try {
    systemStatus.logIntelligentOperation('Data Management', 'Resetting database...');
    
    const resetProcess = spawn('npx', ['prisma', 'migrate', 'reset', '--force'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    let error = '';

    resetProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    resetProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    resetProcess.on('close', (code) => {
      if (code === 0) {
        systemStatus.logSuccess('Data Management', 'Database reset completed successfully');
        res.json({
          success: true,
          message: 'Database reset completed successfully',
          output: output,
          timestamp: new Date().toISOString()
        });
      } else {
        systemStatus.logError('Data Management', `Database reset failed with code ${code}`);
        res.status(500).json({
          success: false,
          message: 'Database reset failed',
          error: error,
          output: output,
          timestamp: new Date().toISOString()
        });
      }
    });

  } catch (error) {
    systemStatus.logError('Data Management', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;