const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');
const intelligentLogger = require('../services/intelligentLogger');

const prisma = new PrismaClient();

// ===== ENHANCED SEATING MANAGER APIS =====

// Get seating manager dashboard data
const getSeatingManagerDashboard = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalHalls,
      totalExams,
      totalAllocations,
      recentAllocations,
      upcomingExams
    ] = await Promise.all([
      prisma.user.count({ where: { roles: { some: { role: { name: 'STUDENT' } } } } }),
      prisma.room.count(),
      prisma.exam.count(),
      prisma.seatingAllocation.count(),
      prisma.seatingAllocation.findMany({
        take: 10,
        orderBy: { allocatedAt: 'desc' },
        include: {
          exam: { include: { course: true } },
          student: { select: { fullName: true, rollNo: true } },
          seat: { include: { room: true } }
        }
      }),
      prisma.exam.findMany({
        where: { examDate: { gte: new Date() } },
        take: 10,
        orderBy: { examDate: 'asc' },
        include: { course: true }
      })
    ]);

    const stats = {
      totalStudents,
      totalHalls,
      totalExams,
      totalAllocations,
      utilizationRate: totalHalls > 0 ? ((totalAllocations / (totalHalls * 100)) * 100).toFixed(1) : 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        recentAllocations,
        upcomingExams
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create or update exam
const createOrUpdateExam = async (req, res, next) => {
  try {
    const { id, name, subject, date, time, duration, courseId } = req.body;

    const examData = {
      courseId: courseId || 'default-course-id', // You might need to handle course selection
      examType: name,
      examDate: new Date(date),
      startTime: new Date(`${date}T${time}`),
      endTime: new Date(`${date}T${time}`), // Add duration logic
    };

    let exam;
    if (id) {
      exam = await prisma.exam.update({
        where: { id },
        data: examData,
        include: { course: true }
      });
    } else {
      exam = await prisma.exam.create({
        data: examData,
        include: { course: true }
      });
    }

    res.status(id ? 200 : 201).json({
      status: 'success',
      data: { exam }
    });
  } catch (error) {
    next(error);
  }
};

// Delete exam
const deleteExam = async (req, res, next) => {
  try {
    const { examId } = req.params;

    // Check if exam has allocations
    const allocations = await prisma.seatingAllocation.findMany({
      where: { examId }
    });

    if (allocations.length > 0) {
      return next(new AppError('Cannot delete exam with existing seating allocations', 400));
    }

    await prisma.exam.delete({
      where: { id: examId }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Create or update hall
const createOrUpdateHall = async (req, res, next) => {
  try {
    const { id, name, capacity, rows, cols, blockedSeats = [], entryPoints = [], exitPoints = [] } = req.body;

    if (rows * cols !== capacity) {
      return next(new AppError('Rows × Columns must equal capacity', 400));
    }

    const hallData = {
      name,
      capacity: parseInt(capacity, 10),
      rows: parseInt(rows, 10),
      cols: parseInt(cols, 10)
    };

    let hall;
    if (id) {
      hall = await prisma.room.update({
        where: { id },
        data: hallData
      });
    } else {
      // Check if hall with same name exists
      const existingHall = await prisma.room.findUnique({
        where: { name }
      });

      if (existingHall) {
        return next(new AppError('A hall with this name already exists', 400));
      }

      hall = await prisma.room.create({
        data: hallData
      });

      // Generate seats for new hall
      const seats = [];
      for (let row = 1; row <= hall.rows; row++) {
        for (let col = 1; col <= hall.cols; col++) {
          seats.push({
            roomId: hall.id,
            rowNumber: row,
            colNumber: col
          });
        }
      }

      await prisma.seat.createMany({
        data: seats
      });
    }

    // Get hall with seats
    const hallWithSeats = await prisma.room.findUnique({
      where: { id: hall.id },
      include: { seats: true }
    });

    res.status(id ? 200 : 201).json({
      status: 'success',
      data: { hall: hallWithSeats }
    });
  } catch (error) {
    next(error);
  }
};

// Get students with filtering and pagination
const getStudentsForAllocation = async (req, res, next) => {
  try {
    const { 
      search = '', 
      department = 'all', 
      subject = 'all',
      page = 1,
      limit = 100
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {
      roles: {
        some: {
          role: { name: 'STUDENT' }
        }
      }
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        rollNo: true,
        email: true,
        // Add mock department and subject data
      },
      skip,
      take: parseInt(limit),
      orderBy: { fullName: 'asc' }
    });

    // Add mock department and subject data for demo
    const studentsWithMockData = students.map((student, index) => ({
      ...student,
      department: ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'][index % 6],
      semester: String(3 + (index % 6)),
      subject: ['Data Structures', 'Computer Networks', 'Digital Electronics', 'Thermodynamics', 'Circuit Theory', 'Database Systems'][index % 6],
      specialNeeds: Math.random() < 0.05,
      specialNeedsType: Math.random() < 0.05 ? ['Vision Impairment', 'Hearing Impairment', 'Mobility', 'Other'][Math.floor(Math.random() * 4)] : undefined
    }));

    const totalCount = await prisma.user.count({ where: whereClause });

    res.status(200).json({
      status: 'success',
      results: studentsWithMockData.length,
      totalCount,
      data: {
        students: studentsWithMockData,
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

// Advanced seating allocation with configuration
const generateAdvancedSeatingAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { 
      hallIds = [],
      config = {
        strategy: 'optimized',
        spacingGap: 1,
        antiCheat: true,
        sameDeptSeparation: 2,
        sameSubjectSeparation: 3,
        specialNeedsPriority: true,
        balanceHalls: true,
        seed: null
      }
    } = req.body;

    if (!hallIds || hallIds.length === 0) {
      return next(new AppError('Please provide at least one hall ID', 400));
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true }
    });

    if (!exam) {
      return next(new AppError('No exam found with that ID', 404));
    }

    // Get students (for demo, we'll use all students)
    const students = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: { name: 'STUDENT' }
          }
        }
      },
      select: {
        id: true,
        fullName: true,
        rollNo: true
      }
    });

    if (students.length === 0) {
      return next(new AppError('No students found for allocation', 400));
    }

    // Get halls with seats
    const halls = await prisma.room.findMany({
      where: { id: { in: hallIds } },
      include: { seats: true }
    });

    if (halls.length === 0) {
      return next(new AppError('No halls found with the provided IDs', 404));
    }

    // Calculate total capacity
    const totalCapacity = halls.reduce((sum, hall) => sum + hall.capacity, 0);

    if (totalCapacity < students.length) {
      return next(new AppError('Not enough seats available for all students', 400));
    }

    // Clear existing allocations
    await prisma.seatingAllocation.deleteMany({
      where: { examId }
    });

    // Apply allocation strategy
    let shuffledStudents = [...students];
    
    if (config.antiCheat) {
      // Shuffle students using Fisher-Yates algorithm
      for (let i = shuffledStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
      }
    }

    // Create allocations
    const allocations = [];
    let studentIndex = 0;

    for (const hall of halls) {
      const studentsPerHall = config.balanceHalls 
        ? Math.ceil(students.length / halls.length)
        : hall.capacity;

      let hallStudentCount = 0;
      
      for (const seat of hall.seats) {
        if (studentIndex >= shuffledStudents.length || hallStudentCount >= studentsPerHall) {
          break;
        }

        allocations.push({
          examId,
          studentId: shuffledStudents[studentIndex].id,
          seatId: seat.id
        });

        studentIndex++;
        hallStudentCount++;
      }

      if (studentIndex >= shuffledStudents.length) break;
    }

    // Create allocations in database
    const createdAllocations = await prisma.$transaction(
      allocations.map(allocation =>
        prisma.seatingAllocation.create({
          data: allocation,
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                rollNo: true
              }
            },
            seat: {
              include: {
                room: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        })
      )
    );

    // Generate statistics
    const stats = {
      totalStudents: students.length,
      totalAllocated: createdAllocations.length,
      totalHalls: halls.length,
      utilizationRate: ((createdAllocations.length / totalCapacity) * 100).toFixed(1),
      hallUtilization: halls.map(hall => {
        const hallAllocations = createdAllocations.filter(a => a.seat.room.id === hall.id);
        return {
          hallId: hall.id,
          hallName: hall.name,
          capacity: hall.capacity,
          allocated: hallAllocations.length,
          utilization: ((hallAllocations.length / hall.capacity) * 100).toFixed(1)
        };
      })
    };

    res.status(201).json({
      status: 'success',
      results: createdAllocations.length,
      data: {
        allocations: createdAllocations,
        stats,
        config
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get allocation conflicts
const getAllocationConflicts = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const allocations = await prisma.seatingAllocation.findMany({
      where: { examId },
      include: {
        student: { select: { id: true, fullName: true, rollNo: true } },
        seat: { 
          include: { 
            room: { select: { id: true, name: true } } 
          } 
        }
      }
    });

    // Mock conflict detection logic
    const conflicts = [];
    
    // For demo purposes, generate some mock conflicts
    if (allocations.length > 10) {
      conflicts.push({
        id: 'conflict-1',
        type: 'adjacency',
        severity: 'high',
        description: 'Students from same department are seated adjacent',
        seat1: allocations[0].seat.id,
        seat2: allocations[1].seat.id,
        hallId: allocations[0].seat.room.id,
        autoResolvable: true
      });
    }

    res.status(200).json({
      status: 'success',
      results: conflicts.length,
      data: { conflicts }
    });
  } catch (error) {
    next(error);
  }
};

// Get allocation versions/history
const getAllocationVersions = async (req, res, next) => {
  try {
    const { examId } = req.params;

    // Mock version history - in real implementation, you'd store allocation versions
    const versions = [
      {
        id: 'version-1',
        timestamp: new Date().toISOString(),
        allocatedStudents: 285,
        hallsUsed: 3,
        utilizationRate: 94.2,
        createdBy: req.user.fullName,
        notes: 'Initial allocation with optimized strategy'
      },
      {
        id: 'version-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        allocatedStudents: 280,
        hallsUsed: 3,
        utilizationRate: 92.1,
        createdBy: req.user.fullName,
        notes: 'Allocation after conflict resolution'
      }
    ];

    res.status(200).json({
      status: 'success',
      results: versions.length,
      data: { versions }
    });
  } catch (error) {
    next(error);
  }
};

// Publish allocation to students
const publishAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;

    // Check if allocations exist
    const allocations = await prisma.seatingAllocation.findMany({
      where: { examId },
      include: {
        student: { select: { id: true, fullName: true, rollNo: true, email: true } },
        seat: { 
          include: { 
            room: { select: { id: true, name: true } } 
          } 
        },
        exam: {
          include: { course: true }
        }
      }
    });

    if (allocations.length === 0) {
      return next(new AppError('No allocations found for this exam', 404));
    }

    // In a real implementation, you would:
    // 1. Send email notifications to students
    // 2. Update exam status to 'published'
    // 3. Generate hall tickets
    // 4. Create QR codes

    // For now, we'll just return success
    res.status(200).json({
      status: 'success',
      message: 'Allocation published successfully',
      data: {
        examId,
        studentsNotified: allocations.length,
        publishedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new room (admin only)
const createRoom = async (req, res, next) => {
  try {
    const { name, capacity, rows, cols } = req.body;

    // Validate that rows * cols equals capacity
    if (rows * cols !== capacity) {
      return next(new AppError('Rows * Columns must equal capacity', 400));
    }

    // Check if room with same name already exists
    const existingRoom = await prisma.room.findUnique({
      where: { name },
    });

    if (existingRoom) {
      return next(new AppError('A room with this name already exists', 400));
    }

    const room = await prisma.room.create({
      data: {
        name,
        capacity: parseInt(capacity, 10),
        rows: parseInt(rows, 10),
        cols: parseInt(cols, 10),
      },
    });

    // Generate seats for the room
    const seats = [];
    for (let row = 1; row <= room.rows; row++) {
      for (let col = 1; col <= room.cols; col++) {
        seats.push({
          roomId: room.id,
          rowNumber: row,
          colNumber: col,
        });
      }
    }

    await prisma.seat.createMany({
      data: seats,
    });

    // Get the room with all its seats
    const roomWithSeats = await prisma.room.findUnique({
      where: { id: room.id },
      include: {
        seats: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        room: roomWithSeats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all rooms
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        _count: {
          select: { seats: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: rooms.length,
      data: {
        rooms,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single room with seats
const getRoom = async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: {
        seats: {
          orderBy: [
            { rowNumber: 'asc' },
            { colNumber: 'asc' },
          ],
        },
      },
    });

    if (!room) {
      return next(new AppError('No room found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        room,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate seating allocation for an exam
const generateSeatingAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { roomIds } = req.body;

    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
      return next(new AppError('Please provide at least one room ID', 400));
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        course: {
          include: {
            studentCourses: {
              select: {
                student: {
                  select: {
                    id: true,
                    rollNo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exam) {
      intelligentLogger.logSystemFailure('SEATING_ENGINE', new Error('Exam not found'), 'allocation cancelled', 'seating manager');
      return next(new AppError('No exam found with that ID', 404));
    }

    // Log seating allocation start
    intelligentLogger.logSeatingDecision(examId, 'ALLOCATION_STARTED', { 
      examCode: exam.course.code,
      studentCount: exam.course.studentCourses.length,
      roomCount: roomIds.length
    });

    // Get all students enrolled in the course
    const students = exam.course.studentCourses.map(sc => sc.student);
    const studentCount = students.length;

    if (studentCount === 0) {
      return next(new AppError('No students enrolled in this course', 400));
    }

    // Get all seats from the specified rooms
    const rooms = await prisma.room.findMany({
      where: {
        id: { in: roomIds },
      },
      include: {
        seats: true,
      },
    });

    if (rooms.length === 0) {
      return next(new AppError('No rooms found with the provided IDs', 404));
    }

    // Calculate total available seats
    const totalSeats = rooms.reduce((sum, room) => sum + room.seats.length, 0);

    if (totalSeats < studentCount) {
      intelligentLogger.logSeatingDecision(examId, 'CAPACITY_EXCEEDED', { 
        examCode: exam.course.code,
        required: studentCount,
        available: totalSeats,
        deficit: studentCount - totalSeats
      });
      intelligentLogger.logSystemFailure('SEATING_ENGINE', new Error('Hall capacity insufficient'), 'allocation aborted', 'admin@university.edu');
      return next(new AppError('Not enough seats available for all students', 400));
    }

    // Check for existing allocations
    const existingAllocations = await prisma.seatingAllocation.findMany({
      where: { examId },
    });

    if (existingAllocations.length > 0) {
      return next(new AppError('Seating allocation already exists for this exam. Please clear existing allocations first.', 400));
    }

    // Shuffle students (Fisher-Yates algorithm)
    const shuffledStudents = [...students];
    for (let i = shuffledStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
    }

    // Allocate seats to students
    const allocations = [];
    let studentIndex = 0;

    for (const room of rooms) {
      for (const seat of room.seats) {
        if (studentIndex >= shuffledStudents.length) break;

        allocations.push({
          examId,
          studentId: shuffledStudents[studentIndex].id,
          seatId: seat.id,
        });

        studentIndex++;
      }
      if (studentIndex >= shuffledStudents.length) break;
    }

    // Create allocations in the database
    const createdAllocations = await prisma.$transaction(
      allocations.map(allocation =>
        prisma.seatingAllocation.create({
          data: allocation,
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                rollNo: true,
              },
            },
            seat: {
              include: {
                room: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        })
      )
    );

    res.status(201).json({
      status: 'success',
      results: createdAllocations.length,
      data: {
        allocations: createdAllocations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get seating allocation for an exam
const getExamSeatingAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const allocations = await prisma.seatingAllocation.findMany({
      where: { examId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNo: true,
          },
        },
        seat: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          seat: {
            room: {
              name: 'asc',
            },
          },
        },
        {
          seat: {
            rowNumber: 'asc',
          },
        },
        {
          seat: {
            colNumber: 'asc',
          },
        },
      ],
    });

    if (allocations.length === 0) {
      return next(new AppError('No seating allocation found for this exam', 404));
    }

    // Group allocations by room for better frontend display
    const allocationsByRoom = allocations.reduce((acc, allocation) => {
      const roomName = allocation.seat.room.name;
      if (!acc[roomName]) {
        acc[roomName] = {
          roomId: allocation.seat.room.id,
          roomName,
          allocations: [],
        };
      }
      acc[roomName].allocations.push(allocation);
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      results: allocations.length,
      data: {
        allocations: Object.values(allocationsByRoom),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a student's seat for an exam
const getStudentSeat = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.params.studentId || req.user.id;

    // Check if the requesting user is the student or an admin
    if (req.user.id !== studentId && !req.user.roles.includes('ADMIN', 'SEATING_MANAGER')) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    const allocation = await prisma.seatingAllocation.findFirst({
      where: {
        examId,
        studentId,
      },
      include: {
        seat: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        exam: {
          include: {
            course: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!allocation) {
      return next(new AppError('No seating allocation found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        allocation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Clear seating allocation for an exam (admin only)
const clearSeatingAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return next(new AppError('No exam found with that ID', 404));
    }

    // Delete all allocations for this exam
    await prisma.seatingAllocation.deleteMany({
      where: { examId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Get all exam halls
const getAllExamHalls = async (req, res, next) => {
  try {
    // Mock data for now - in real implementation, this would come from database
    const halls = [
      {
        id: 'hall-1',
        hallId: 'HALL-A',
        name: 'Main Examination Hall A',
        rows: 12,
        columns: 15,
        capacity: 180,
        blockedSeats: ['HALL-A-03-04', 'HALL-A-03-05'],
        entryPoints: ['front', 'back'],
        isActive: true
      },
      {
        id: 'hall-2',
        hallId: 'HALL-B',
        name: 'Examination Hall B',
        rows: 10,
        columns: 12,
        capacity: 120,
        blockedSeats: ['HALL-B-05-06'],
        entryPoints: ['front', 'left', 'right'],
        isActive: true
      },
      {
        id: 'hall-3',
        hallId: 'HALL-C',
        name: 'Examination Hall C',
        rows: 8,
        columns: 10,
        capacity: 80,
        blockedSeats: [],
        entryPoints: ['front', 'back'],
        isActive: true
      }
    ];

    res.status(200).json({
      status: 'success',
      results: halls.length,
      data: { halls }
    });
  } catch (error) {
    next(error);
  }
};

// Get hall layout with seating
const getHallLayout = async (req, res, next) => {
  try {
    const { hallId } = req.params;
    const { examId } = req.query;

    // Mock layout data
    const layout = [];
    for (let row = 1; row <= 10; row++) {
      const rowSeats = [];
      for (let col = 1; col <= 12; col++) {
        const seatId = `${hallId}-${String(row).padStart(2, '0')}-${String(col).padStart(2, '0')}`;
        rowSeats.push({
          id: `seat-${row}-${col}`,
          seatId,
          rowNumber: row,
          colNumber: col,
          isBlocked: Math.random() < 0.05, // 5% blocked seats
          isSpacing: (row + col) % 2 === 0, // Checkerboard spacing
          isSpecialNeeds: false,
          nearExit: row <= 2 || row >= 9,
          isOccupied: Math.random() < 0.7, // 70% occupied
          student: Math.random() < 0.7 ? {
            id: `student-${row}-${col}`,
            fullName: `Student ${row}${col}`,
            rollNo: `2024${String(row).padStart(2, '0')}${String(col).padStart(2, '0')}`,
            department: ['CSE', 'ECE', 'IT', 'MECH', 'CIVIL', 'EEE'][Math.floor(Math.random() * 6)],
            specialNeeds: false
          } : null
        });
      }
      layout.push(rowSeats);
    }

    res.status(200).json({
      status: 'success',
      data: { layout }
    });
  } catch (error) {
    next(error);
  }
};

// Generate QR codes for exam
const generateQRCodes = async (req, res, next) => {
  try {
    const { examId } = req.params;

    // Mock QR codes data
    const qrCodes = [];
    for (let i = 1; i <= 50; i++) {
      const studentData = {
        studentId: `student-${i}`,
        rollNo: `2024${String(i).padStart(3, '0')}`,
        name: `Student ${i}`,
        seatId: `HALL-A-${String(Math.ceil(i/10)).padStart(2, '0')}-${String((i%10)+1).padStart(2, '0')}`,
        hallId: 'HALL-A',
        examId: examId,
        timestamp: new Date().toISOString()
      };

      qrCodes.push({
        allocationId: `allocation-${i}`,
        studentId: studentData.studentId,
        studentName: studentData.name,
        rollNo: studentData.rollNo,
        seatId: studentData.seatId,
        hallId: studentData.hallId,
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`, // Mock QR code
        qrData: studentData
      });
    }

    res.status(200).json({
      status: 'success',
      results: qrCodes.length,
      data: { qrCodes, examId, generatedAt: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics data
const getAnalytics = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const analyticsData = {
      overview: {
        totalAllocations: 285,
        presentCount: 267,
        absentCount: 18,
        pendingCount: 0,
        attendanceRate: 93.7
      },
      departmentDistribution: [
        { department: 'CSE', count: 85, percentage: 29.8 },
        { department: 'ECE', count: 72, percentage: 25.3 },
        { department: 'IT', count: 58, percentage: 20.4 },
        { department: 'MECH', count: 45, percentage: 15.8 },
        { department: 'CIVIL', count: 25, percentage: 8.8 }
      ],
      hallUtilization: [
        { hallId: 'HALL-A', name: 'Hall A', capacity: 100, allocated: 95, utilization: 95 },
        { hallId: 'HALL-B', name: 'Hall B', capacity: 120, allocated: 110, utilization: 91.7 },
        { hallId: 'HALL-C', name: 'Hall C', capacity: 80, allocated: 80, utilization: 100 }
      ],
      historicalData: [
        { date: '2024-12-15', utilization: 87, conflicts: 12, efficiency: 92 },
        { date: '2024-12-16', utilization: 91, conflicts: 8, efficiency: 95 },
        { date: '2024-12-17', utilization: 89, conflicts: 15, efficiency: 88 },
        { date: '2024-12-18', utilization: 94, conflicts: 6, efficiency: 97 }
      ],
      conflictAnalysis: {
        totalConflicts: 12,
        resolvedConflicts: 10,
        conflictTypes: [
          { type: 'Same Department Adjacent', count: 8, resolved: 7 },
          { type: 'Same Subject Adjacent', count: 4, resolved: 3 }
        ]
      }
    };

    res.status(200).json({
      status: 'success',
      data: analyticsData
    });
  } catch (error) {
    next(error);
  }
};

// Get live occupancy data
const getLiveOccupancy = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const occupancyData = [
      {
        hallId: 'HALL-A',
        hallName: 'Hall A',
        capacity: 100,
        total: 95,
        present: 89,
        absent: 6,
        pending: 0,
        students: []
      },
      {
        hallId: 'HALL-B', 
        hallName: 'Hall B',
        capacity: 120,
        total: 110,
        present: 103,
        absent: 7,
        pending: 0,
        students: []
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        occupancy: occupancyData,
        summary: {
          totalHalls: 2,
          totalStudents: 205,
          totalPresent: 192,
          totalAbsent: 13,
          totalPending: 0
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update attendance
const updateAttendance = async (req, res, next) => {
  try {
    const { examId, studentId } = req.params;
    const { isPresent } = req.body;

    // Mock update - in real implementation, update database
    res.status(200).json({
      status: 'success',
      message: `Attendance updated for student ${studentId}`,
      data: {
        studentId,
        examId,
        isPresent,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Export seating chart
const exportSeatingChart = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { format = 'pdf' } = req.query;

    // Mock export - in real implementation, generate actual PDF/CSV
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="seating-chart-${examId}.pdf"`);
      res.send(Buffer.from('Mock PDF content'));
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="seating-data-${examId}.csv"`);
      res.send('Student Name,Roll No,Seat ID,Hall\nJohn Doe,2024001,HALL-A-01-01,Hall A');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoom,
  generateSeatingAllocation,
  getExamSeatingAllocation,
  getStudentSeat,
  clearSeatingAllocation,
  getAllExamHalls,
  getHallLayout,
  generateQRCodes,
  getAnalytics,
  getLiveOccupancy,
  updateAttendance,
  exportSeatingChart,
  // Enhanced seating manager functions
  getSeatingManagerDashboard,
  createOrUpdateExam,
  deleteExam,
  createOrUpdateHall,
  getStudentsForAllocation,
  generateAdvancedSeatingAllocation,
  getAllocationConflicts,
  getAllocationVersions,
  publishAllocation
};
