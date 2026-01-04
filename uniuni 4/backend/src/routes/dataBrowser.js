const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Main data browser interface
router.get('/', (req, res) => {
  res.render('data-browser');
});

// Get all table schemas
router.get('/schema', async (req, res) => {
  try {
    const tables = [
      { name: 'User', icon: '👥', description: 'System users (students, faculty, admin)' },
      { name: 'Role', icon: '🎭', description: 'User roles and permissions' },
      { name: 'Course', icon: '📚', description: 'Academic courses' },
      { name: 'Exam', icon: '📝', description: 'Scheduled examinations' },
      { name: 'Room', icon: '🏢', description: 'Examination rooms' },
      { name: 'Seat', icon: '🪑', description: 'Individual seats in rooms' },
      { name: 'SeatingAllocation', icon: '📋', description: 'Student seat assignments' },
      { name: 'HallTicket', icon: '🎫', description: 'Exam hall tickets' },
      { name: 'MindMap', icon: '🧠', description: 'Study mind maps' },
      { name: 'Club', icon: '🎭', description: 'Student clubs' },
      { name: 'Event', icon: '🎪', description: 'Club events' },
      { name: 'Student', icon: '🎓', description: 'Student performance data' },
      { name: 'Grade', icon: '📊', description: 'Academic grades' }
    ];
    
    res.json({ tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table data with pagination and filtering
router.get('/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    let data, total, columns;
    
    switch (tableName.toLowerCase()) {
      case 'user':
        // Get users with roles
        data = await prisma.user.findMany({
          skip,
          take,
          include: {
            roles: {
              include: {
                role: true
              }
            }
          },
          where: search ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { rollNo: { contains: search, mode: 'insensitive' } }
            ]
          } : {},
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.user.count({
          where: search ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { rollNo: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        });
        columns = ['id', 'fullName', 'email', 'rollNo', 'roles', 'createdAt'];
        break;
        
      case 'role':
        data = await prisma.role.findMany({
          skip,
          take,
          include: {
            _count: { select: { users: true } }
          },
          where: search ? {
            name: { contains: search, mode: 'insensitive' }
          } : {},
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.role.count({
          where: search ? {
            name: { contains: search, mode: 'insensitive' }
          } : {}
        });
        columns = ['id', 'name', 'userCount', 'createdAt'];
        break;
        
      case 'course':
        data = await prisma.course.findMany({
          skip,
          take,
          where: search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
              { department: { contains: search, mode: 'insensitive' } }
            ]
          } : {},
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.course.count({
          where: search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
              { department: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        });
        columns = ['id', 'code', 'name', 'department', 'semester', 'createdAt'];
        break;
        
      case 'exam':
        data = await prisma.exam.findMany({
          skip,
          take,
          include: {
            course: true
          },
          where: search ? {
            course: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
              ]
            }
          } : {},
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.exam.count({
          where: search ? {
            course: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
              ]
            }
          } : {}
        });
        columns = ['id', 'course', 'examType', 'examDate', 'startTime', 'endTime'];
        break;
        
      case 'room':
        const roomSortBy = sortBy === 'createdAt' ? 'name' : sortBy;
        data = await prisma.room.findMany({
          skip,
          take,
          include: {
            _count: { select: { seats: true } }
          },
          where: search ? {
            name: { contains: search, mode: 'insensitive' }
          } : {},
          orderBy: { [roomSortBy]: sortOrder }
        });
        total = await prisma.room.count({
          where: search ? {
            name: { contains: search, mode: 'insensitive' }
          } : {}
        });
        columns = ['id', 'name', 'capacity', 'rows', 'cols', 'seatsCount'];
        break;
        
      case 'seat':
        const seatSortBy = sortBy === 'createdAt' ? 'rowNumber' : sortBy;
        data = await prisma.seat.findMany({
          skip,
          take,
          include: {
            room: true,
            _count: { select: { allocations: true } }
          },
          orderBy: { [seatSortBy]: sortOrder }
        });
        total = await prisma.seat.count();
        columns = ['id', 'room', 'rowNumber', 'colNumber', 'allocationsCount'];
        break;
        
      case 'seatingallocation':
        const seatingAllocSortBy = sortBy === 'createdAt' ? 'allocatedAt' : sortBy;
        data = await prisma.seatingAllocation.findMany({
          skip,
          take,
          include: {
            student: true,
            exam: { include: { course: true } },
            seat: { include: { room: true } }
          },
          orderBy: { [seatingAllocSortBy]: sortOrder }
        });
        total = await prisma.seatingAllocation.count();
        columns = ['id', 'student', 'exam', 'seat', 'room', 'allocatedAt'];
        break;
        
      case 'hallticket':
        const hallTicketSortBy = sortBy === 'createdAt' ? 'issueDate' : sortBy;
        data = await prisma.hallTicket.findMany({
          skip,
          take,
          include: {
            student: true,
            exam: { include: { course: true } }
          },
          orderBy: { [hallTicketSortBy]: sortOrder }
        });
        total = await prisma.hallTicket.count();
        columns = ['id', 'student', 'exam', 'qrCode', 'issueDate'];
        break;
        
      case 'mindmap':
        data = await prisma.mindMap.findMany({
          skip,
          take,
          include: {
            student: true,
            syllabus: { include: { course: true } }
          },
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.mindMap.count();
        columns = ['id', 'title', 'student', 'course', 'createdAt'];
        break;
        
      case 'club':
        data = await prisma.club.findMany({
          skip,
          take,
          include: {
            coordinator: true,
            _count: { select: { events: true } }
          },
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.club.count();
        columns = ['id', 'name', 'description', 'coordinator', 'eventsCount', 'createdAt'];
        break;
        
      case 'event':
        data = await prisma.event.findMany({
          skip,
          take,
          include: {
            club: true,
            createdBy: true
          },
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.event.count();
        columns = ['id', 'title', 'club', 'startDateTime', 'status', 'createdBy'];
        break;
        
      case 'room':
        data = await prisma.room.findMany({
          skip,
          take,
          include: {
            _count: { select: { seats: true } }
          },
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.room.count();
        columns = ['id', 'name', 'capacity', 'rows', 'cols', 'seatsCount'];
        break;
        
      case 'student':
        data = await prisma.student.findMany({
          skip,
          take,
          include: {
            grades: true
          },
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.student.count();
        columns = ['id', 'school', 'sex', 'age', 'address', 'Medu', 'Fedu', 'grades'];
        break;
        
      case 'grade':
        data = await prisma.grade.findMany({
          skip,
          take,
          include: {
            student: true
          },
          where: search ? {
            OR: [
              { subject: { contains: search, mode: 'insensitive' } },
              { student: { school: { contains: search, mode: 'insensitive' } } }
            ]
          } : {},
          orderBy: { [sortBy]: sortOrder }
        });
        total = await prisma.grade.count({
          where: search ? {
            OR: [
              { subject: { contains: search, mode: 'insensitive' } },
              { student: { school: { contains: search, mode: 'insensitive' } } }
            ]
          } : {}
        });
        columns = ['id', 'student', 'subject', 'G1', 'G2', 'G3', 'createdAt'];
        break;
        
      default:
        return res.status(404).json({ error: 'Table not found' });
    }
    
    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      columns,
      tableName
    });
    
  } catch (error) {
    console.error('Data browser error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single record details
router.get('/record/:tableName/:id', async (req, res) => {
  try {
    const { tableName, id } = req.params;
    let record;
    
    switch (tableName.toLowerCase()) {
      case 'user':
        record = await prisma.user.findUnique({
          where: { id },
          include: {
            roles: { include: { role: true } },
            hallTickets: { include: { exam: { include: { course: true } } } },
            mindMaps: { include: { syllabus: { include: { course: true } } } },
            seatingAllocations: { include: { exam: { include: { course: true } }, seat: { include: { room: true } } } }
          }
        });
        break;
        
      case 'course':
        record = await prisma.course.findUnique({
          where: { id },
          include: {
            exams: true,
            syllabus: true,
            studentCourses: { include: { student: true } }
          }
        });
        break;
        
      case 'exam':
        record = await prisma.exam.findUnique({
          where: { id },
          include: {
            course: true,
            hallTickets: { include: { student: true } },
            seatingAllocations: { include: { student: true, seat: { include: { room: true } } } }
          }
        });
        break;
        
      default:
        return res.status(404).json({ error: 'Table not found' });
    }
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ record, tableName });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;