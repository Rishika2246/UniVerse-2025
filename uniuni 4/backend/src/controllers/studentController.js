const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== STUDENT DASHBOARD APIS =====

// Get student dashboard data
const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const [
      studentInfo,
      enrolledCourses,
      upcomingExams,
      recentGrades,
      seatingAllocations,
      attendanceStats
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          fullName: true,
          rollNo: true,
          email: true
        }
      }),
      prisma.studentCourse.findMany({
        where: { studentId },
        include: {
          course: {
            select: {
              id: true,
              code: true,
              name: true,
              semester: true,
              department: true
            }
          }
        },
        take: 10
      }),
      prisma.exam.findMany({
        where: {
          examDate: { gte: new Date() },
          course: {
            studentCourses: {
              some: { studentId }
            }
          }
        },
        include: {
          course: {
            select: {
              code: true,
              name: true
            }
          }
        },
        orderBy: { examDate: 'asc' },
        take: 5
      }),
      // Mock recent grades for demo
      [],
      prisma.seatingAllocation.findMany({
        where: { studentId },
        include: {
          exam: {
            include: {
              course: {
                select: {
                  code: true,
                  name: true
                }
              }
            }
          },
          seat: {
            include: {
              room: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { allocatedAt: 'desc' },
        take: 5
      }),
      // Mock attendance stats
      {
        totalClasses: 45,
        attendedClasses: 42,
        attendancePercentage: 93.3
      }
    ]);

    // Add mock data for demo
    const mockGrades = [
      { subject: 'Data Structures', grade: 'A', credits: 4, semester: 'Fall 2024' },
      { subject: 'Computer Networks', grade: 'A-', credits: 3, semester: 'Fall 2024' },
      { subject: 'Database Systems', grade: 'B+', credits: 4, semester: 'Spring 2024' }
    ];

    const mockAchievements = [
      { id: 1, title: 'Perfect Attendance', description: '100% attendance for 3 months', icon: 'trophy', earned: true },
      { id: 2, title: 'Dean\'s List', description: 'GPA above 3.5', icon: 'star', earned: true },
      { id: 3, title: 'Study Streak', description: '30 days of continuous study', icon: 'fire', earned: false }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        student: studentInfo,
        courses: enrolledCourses,
        upcomingExams,
        recentGrades: mockGrades,
        seatingAllocations,
        attendanceStats,
        achievements: mockAchievements,
        stats: {
          totalCourses: enrolledCourses.length,
          upcomingExams: upcomingExams.length,
          currentGPA: 3.67,
          creditsCompleted: 45
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get student's seating allocation for specific exam
const getStudentSeatingAllocation = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.id;

    const allocation = await prisma.seatingAllocation.findFirst({
      where: {
        examId,
        studentId
      },
      include: {
        exam: {
          include: {
            course: {
              select: {
                code: true,
                name: true
              }
            }
          }
        },
        seat: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                rows: true,
                cols: true
              }
            }
          }
        }
      }
    });

    if (!allocation) {
      return next(new AppError('No seating allocation found for this exam', 404));
    }

    // Get hall layout for visualization
    const hallLayout = await getHallLayoutForStudent(allocation.seat.room.id, examId);

    res.status(200).json({
      status: 'success',
      data: {
        allocation,
        hallLayout,
        examDetails: {
          name: `${allocation.exam.course.code} - ${allocation.exam.examType}`,
          date: allocation.exam.examDate,
          time: allocation.exam.startTime,
          hall: allocation.seat.room.name,
          seat: `${String.fromCharCode(64 + allocation.seat.rowNumber)}-${allocation.seat.colNumber}`,
          reportingTime: new Date(allocation.exam.startTime.getTime() - 30 * 60000), // 30 mins before
          entryGate: 'Main Entrance'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get hall layout for student view
const getHallLayoutForStudent = async (roomId, examId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { seats: true }
  });

  const allocations = await prisma.seatingAllocation.findMany({
    where: { 
      examId,
      seat: { roomId }
    },
    include: {
      student: {
        select: {
          fullName: true,
          rollNo: true
        }
      },
      seat: true
    }
  });

  // Create seat grid
  const seatGrid = Array(room.rows).fill(0).map(() => Array(room.cols).fill(null));
  
  allocations.forEach(allocation => {
    const row = allocation.seat.rowNumber - 1;
    const col = allocation.seat.colNumber - 1;
    seatGrid[row][col] = {
      seatId: `${String.fromCharCode(65 + row)}-${col + 1}`,
      student: allocation.student,
      isOccupied: true
    };
  });

  // Fill empty seats
  for (let r = 0; r < room.rows; r++) {
    for (let c = 0; c < room.cols; c++) {
      if (!seatGrid[r][c]) {
        seatGrid[r][c] = {
          seatId: `${String.fromCharCode(65 + r)}-${c + 1}`,
          student: null,
          isOccupied: false
        };
      }
    }
  }

  return {
    roomName: room.name,
    rows: room.rows,
    cols: room.cols,
    seatGrid
  };
};

// Get student's attendance records
const getStudentAttendance = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Mock attendance data for demo
    const attendanceRecords = [
      {
        date: '2024-12-18',
        subject: 'Data Structures',
        status: 'present',
        time: '10:00 AM'
      },
      {
        date: '2024-12-17',
        subject: 'Computer Networks',
        status: 'present',
        time: '2:00 PM'
      },
      {
        date: '2024-12-16',
        subject: 'Database Systems',
        status: 'absent',
        time: '11:00 AM'
      }
    ];

    const attendanceStats = {
      totalClasses: 45,
      attendedClasses: 42,
      absentClasses: 3,
      attendancePercentage: 93.3,
      monthlyStats: [
        { month: 'Sep', percentage: 95 },
        { month: 'Oct', percentage: 92 },
        { month: 'Nov', percentage: 94 },
        { month: 'Dec', percentage: 93 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: {
        records: attendanceRecords,
        stats: attendanceStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get student's study materials and resources
const getStudyMaterials = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get student's courses
    const courses = await prisma.studentCourse.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            syllabus: true
          }
        }
      }
    });

    // Get mind maps
    const mindMaps = await prisma.mindMap.findMany({
      where: { studentId },
      include: {
        syllabus: {
          include: {
            course: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    // Mock study resources
    const studyResources = [
      {
        id: 1,
        title: 'Data Structures - Trees and Graphs',
        type: 'PDF',
        subject: 'Data Structures',
        uploadedAt: '2024-12-15',
        size: '2.5 MB'
      },
      {
        id: 2,
        title: 'Network Protocols Explained',
        type: 'Video',
        subject: 'Computer Networks',
        uploadedAt: '2024-12-14',
        duration: '45 mins'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        courses,
        mindMaps,
        studyResources,
        stats: {
          totalCourses: courses.length,
          totalMindMaps: mindMaps.length,
          totalResources: studyResources.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get student's exam schedule and results
const getExamSchedule = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const upcomingExams = await prisma.exam.findMany({
      where: {
        examDate: { gte: new Date() },
        course: {
          studentCourses: {
            some: { studentId }
          }
        }
      },
      include: {
        course: {
          select: {
            code: true,
            name: true
          }
        },
        seatingAllocations: {
          where: { studentId },
          include: {
            seat: {
              include: {
                room: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { examDate: 'asc' }
    });

    // Mock past results
    const pastResults = [
      {
        examId: 'exam-1',
        subject: 'Data Structures',
        examType: 'Mid Semester',
        date: '2024-11-15',
        marksObtained: 85,
        totalMarks: 100,
        grade: 'A',
        rank: 12
      },
      {
        examId: 'exam-2',
        subject: 'Computer Networks',
        examType: 'Mid Semester',
        date: '2024-11-18',
        marksObtained: 78,
        totalMarks: 100,
        grade: 'B+',
        rank: 25
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        upcomingExams: upcomingExams.map(exam => ({
          ...exam,
          seatInfo: exam.seatingAllocations[0] ? {
            hall: exam.seatingAllocations[0].seat.room.name,
            seat: `${String.fromCharCode(64 + exam.seatingAllocations[0].seat.rowNumber)}-${exam.seatingAllocations[0].seat.colNumber}`
          } : null
        })),
        pastResults,
        stats: {
          upcomingCount: upcomingExams.length,
          completedCount: pastResults.length,
          averageGrade: 'B+',
          averageMarks: 81.5
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get student's clubs and events
const getStudentClubsAndEvents = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get all clubs (student can view all)
    const clubs = await prisma.club.findMany({
      include: {
        coordinator: {
          select: {
            fullName: true
          }
        },
        _count: {
          select: {
            events: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startDateTime: { gte: new Date() },
        status: 'APPROVED'
      },
      include: {
        club: {
          select: {
            name: true
          }
        }
      },
      orderBy: { startDateTime: 'asc' },
      take: 10
    });

    // Get student's event attendance
    const myEvents = await prisma.eventAttendee.findMany({
      where: { userId: studentId },
      include: {
        event: {
          include: {
            club: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.status(200).json({
      status: 'success',
      data: {
        clubs,
        upcomingEvents,
        myEvents,
        stats: {
          totalClubs: clubs.length,
          upcomingEvents: upcomingEvents.length,
          myEventsCount: myEvents.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Join/Leave event
const toggleEventAttendance = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    // Check if already attending
    const existingAttendance = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: studentId
        }
      }
    });

    if (existingAttendance) {
      // Remove attendance
      await prisma.eventAttendee.delete({
        where: {
          eventId_userId: {
            eventId,
            userId: studentId
          }
        }
      });

      res.status(200).json({
        status: 'success',
        message: 'Successfully left the event',
        data: { attending: false }
      });
    } else {
      // Add attendance
      await prisma.eventAttendee.create({
        data: {
          eventId,
          userId: studentId,
          status: 'GOING'
        }
      });

      res.status(200).json({
        status: 'success',
        message: 'Successfully joined the event',
        data: { attending: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get student analytics/performance
const getStudentAnalytics = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Mock analytics data
    const analyticsData = {
      academicPerformance: {
        currentGPA: 3.67,
        semesterGPA: 3.8,
        creditsCompleted: 45,
        creditsRequired: 120,
        progressPercentage: 37.5
      },
      attendanceAnalytics: {
        overallPercentage: 93.3,
        subjectWise: [
          { subject: 'Data Structures', percentage: 95 },
          { subject: 'Computer Networks', percentage: 92 },
          { subject: 'Database Systems', percentage: 94 }
        ],
        monthlyTrend: [
          { month: 'Sep', percentage: 95 },
          { month: 'Oct', percentage: 92 },
          { month: 'Nov', percentage: 94 },
          { month: 'Dec', percentage: 93 }
        ]
      },
      examPerformance: {
        averageScore: 81.5,
        bestSubject: 'Data Structures',
        improvementNeeded: 'Computer Networks',
        examHistory: [
          { exam: 'Mid Sem 1', score: 85, date: '2024-11-15' },
          { exam: 'Mid Sem 2', score: 78, date: '2024-11-18' }
        ]
      },
      studyPatterns: {
        totalStudyHours: 120,
        averageDaily: 4.2,
        mostActiveTime: '2:00 PM - 4:00 PM',
        studyStreak: 15
      },
      achievements: {
        badges: 8,
        points: 1250,
        rank: 45,
        recentAchievements: [
          'Perfect Attendance - November',
          'Top 10% in Data Structures',
          'Study Streak - 15 days'
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

module.exports = {
  getStudentDashboard,
  getStudentSeatingAllocation,
  getStudentAttendance,
  getStudyMaterials,
  getExamSchedule,
  getStudentClubsAndEvents,
  toggleEventAttendance,
  getStudentAnalytics
};