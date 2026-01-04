const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generic table view renderer
function renderTableView(title, data, columns, req, res) {
  const isJsonRequest = req.headers.accept && req.headers.accept.includes('application/json');
  
  if (isJsonRequest) {
    return res.json(data);
  }
  
  res.render('table-view', {
    title,
    data: Array.isArray(data) ? data : data.items || [data],
    columns,
    pagination: data.pagination || null,
    currentUrl: req.originalUrl
  });
}

// Courses with table view
router.get('/courses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              exams: true,
              studentCourses: true
            }
          }
        }
      }),
      prisma.course.count()
    ]);
    
    const data = {
      items: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'code', label: 'Course Code', type: 'text' },
      { key: 'name', label: 'Course Name', type: 'text' },
      { key: 'department', label: 'Department', type: 'badge' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: '_count.exams', label: 'Exams', type: 'number' },
      { key: '_count.studentCourses', label: 'Enrolled', type: 'number' },
      { key: 'createdAt', label: 'Created', type: 'date' }
    ];
    
    renderTableView('📚 Courses', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exams with table view
router.get('/exams', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        skip,
        take: limit,
        orderBy: { examDate: 'desc' },
        include: {
          course: true,
          _count: {
            select: {
              hallTickets: true,
              seatingAllocations: true
            }
          }
        }
      }),
      prisma.exam.count()
    ]);
    
    const data = {
      items: exams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'course.code', label: 'Course', type: 'text' },
      { key: 'course.name', label: 'Course Name', type: 'text' },
      { key: 'examType', label: 'Type', type: 'badge' },
      { key: 'examDate', label: 'Exam Date', type: 'date' },
      { key: 'startTime', label: 'Start Time', type: 'time' },
      { key: 'endTime', label: 'End Time', type: 'time' },
      { key: '_count.hallTickets', label: 'Hall Tickets', type: 'number' },
      { key: '_count.seatingAllocations', label: 'Seats Allocated', type: 'number' }
    ];
    
    renderTableView('📝 Exams', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users with table view
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: {
              role: true
            }
          },
          _count: {
            select: {
              hallTickets: true,
              mindMaps: true,
              seatingAllocations: true
            }
          }
        }
      }),
      prisma.user.count()
    ]);
    
    const data = {
      items: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'fullName', label: 'Full Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'rollNo', label: 'Roll Number', type: 'text' },
      { key: 'roles', label: 'Roles', type: 'badges' },
      { key: '_count.hallTickets', label: 'Hall Tickets', type: 'number' },
      { key: '_count.mindMaps', label: 'Mind Maps', type: 'number' },
      { key: 'createdAt', label: 'Joined', type: 'date' }
    ];
    
    renderTableView('👥 Users', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seating Allocations with table view
router.get('/seating', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [allocations, total] = await Promise.all([
      prisma.seatingAllocation.findMany({
        skip,
        take: limit,
        orderBy: { allocatedAt: 'desc' },
        include: {
          student: true,
          exam: {
            include: {
              course: true
            }
          },
          seat: {
            include: {
              room: true
            }
          }
        }
      }),
      prisma.seatingAllocation.count()
    ]);
    
    const data = {
      items: allocations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'student.fullName', label: 'Student', type: 'text' },
      { key: 'student.rollNo', label: 'Roll No', type: 'text' },
      { key: 'exam.course.code', label: 'Course', type: 'text' },
      { key: 'exam.examType', label: 'Exam Type', type: 'badge' },
      { key: 'seat.room.name', label: 'Room', type: 'text' },
      { key: 'seat.rowNumber', label: 'Row', type: 'number' },
      { key: 'seat.colNumber', label: 'Column', type: 'number' },
      { key: 'allocatedAt', label: 'Allocated', type: 'date' }
    ];
    
    renderTableView('🪑 Seating Allocations', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mind Maps with table view
router.get('/mindmaps', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [mindMaps, total] = await Promise.all([
      prisma.mindMap.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: true,
          syllabus: {
            include: {
              course: true
            }
          },
          _count: {
            select: {
              nodes: true
            }
          }
        }
      }),
      prisma.mindMap.count()
    ]);
    
    const data = {
      items: mindMaps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'student.fullName', label: 'Student', type: 'text' },
      { key: 'syllabus.course.code', label: 'Course', type: 'text' },
      { key: 'syllabus.course.name', label: 'Course Name', type: 'text' },
      { key: '_count.nodes', label: 'Nodes', type: 'number' },
      { key: 'createdAt', label: 'Created', type: 'date' }
    ];
    
    renderTableView('🧠 Mind Maps', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clubs with table view
router.get('/clubs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [clubs, total] = await Promise.all([
      prisma.club.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          coordinator: true,
          _count: {
            select: {
              events: true
            }
          }
        }
      }),
      prisma.club.count()
    ]);
    
    const data = {
      items: clubs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'name', label: 'Club Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'coordinator.fullName', label: 'Coordinator', type: 'text' },
      { key: '_count.events', label: 'Events', type: 'number' },
      { key: 'createdAt', label: 'Created', type: 'date' }
    ];
    
    renderTableView('🎭 Clubs', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events with table view
router.get('/events', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { startDateTime: 'desc' },
        include: {
          club: true,
          createdBy: true,
          _count: {
            select: {
              attendees: true
            }
          }
        }
      }),
      prisma.event.count()
    ]);
    
    const data = {
      items: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    const columns = [
      { key: 'title', label: 'Event Title', type: 'text' },
      { key: 'club.name', label: 'Club', type: 'text' },
      { key: 'startDateTime', label: 'Start Date', type: 'datetime' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: '_count.attendees', label: 'Attendees', type: 'number' },
      { key: 'createdBy.fullName', label: 'Created By', type: 'text' }
    ];
    
    renderTableView('🎪 Events', data, columns, req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;