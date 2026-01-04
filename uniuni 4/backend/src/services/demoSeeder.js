const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const systemStatus = require('./systemStatus');

const prisma = new PrismaClient();

class DemoSeederService {
  async seedDemoData() {
    try {
      // Silent seeding
      
      // Check if demo data already exists
      const existingUsers = await prisma.user.count();
      if (existingUsers > 0) {
        // Silent check
        return;
      }

      // Seed Users
      await this.seedUsers();
      await this.seedCourses();
      await this.seedExams();
      await this.seedRooms();
      await this.seedSeatingAllocations();
      await this.seedMindMaps();
      await this.seedClubs();
      await this.seedEvents();
      await this.seedHallTickets();

      systemStatus.logSuccess('Demo Seeder', 'All demo data seeded successfully');
    } catch (error) {
      systemStatus.logError('Demo Seeder', error.message);
      throw error;
    }
  }

  async seedUsers() {
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // First create roles if they don't exist
    const roles = [
      { name: 'ADMIN' },
      { name: 'FACULTY' },
      { name: 'STUDENT' },
      { name: 'SEATING_MANAGER' },
      { name: 'CLUB_COORDINATOR' }
    ];

    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role
      });
    }

    // Get role IDs
    const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
    const facultyRole = await prisma.role.findFirst({ where: { name: 'FACULTY' } });
    const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
    
    const users = [
      // Admin
      { email: 'admin@universe.edu', passwordHash: hashedPassword, fullName: 'System Admin', roleId: adminRole.id },
      
      // Faculty
      { email: 'prof.smith@universe.edu', passwordHash: hashedPassword, fullName: 'Dr. John Smith', roleId: facultyRole.id },
      { email: 'prof.johnson@universe.edu', passwordHash: hashedPassword, fullName: 'Dr. Sarah Johnson', roleId: facultyRole.id },
      
      // Students
      { email: 'alice.student@universe.edu', passwordHash: hashedPassword, fullName: 'Alice Cooper', rollNo: 'CS2021001', roleId: studentRole.id },
      { email: 'bob.student@universe.edu', passwordHash: hashedPassword, fullName: 'Bob Wilson', rollNo: 'CS2021002', roleId: studentRole.id },
      { email: 'charlie.student@universe.edu', passwordHash: hashedPassword, fullName: 'Charlie Brown', rollNo: 'CS2021003', roleId: studentRole.id },
      { email: 'diana.student@universe.edu', passwordHash: hashedPassword, fullName: 'Diana Prince', rollNo: 'CS2021004', roleId: studentRole.id },
      { email: 'eve.student@universe.edu', passwordHash: hashedPassword, fullName: 'Eve Adams', rollNo: 'CS2021005', roleId: studentRole.id }
    ];

    for (const userData of users) {
      const { roleId, ...userCreateData } = userData;
      
      // Create user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userCreateData
      });

      // Assign role
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: roleId
          }
        },
        update: {},
        create: {
          userId: user.id,
          roleId: roleId
        }
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', `Created ${users.length} demo users with roles`);
  }

  async seedCourses() {
    const courses = [
      { code: 'CS401', name: 'Database Management Systems', semester: 4, department: 'Computer Science' },
      { code: 'CS402', name: 'Computer Networks', semester: 4, department: 'Computer Science' },
      { code: 'CS403', name: 'Software Engineering', semester: 4, department: 'Computer Science' },
      { code: 'CS404', name: 'Operating Systems', semester: 4, department: 'Computer Science' },
      { code: 'CS405', name: 'Web Technologies', semester: 4, department: 'Computer Science' }
    ];

    for (const course of courses) {
      await prisma.course.upsert({
        where: { code: course.code },
        update: {},
        create: course
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', `Created ${courses.length} demo courses`);
  }

  async seedExams() {
    const courses = await prisma.course.findMany();
    const exams = [];

    for (const course of courses) {
      const examDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const startTime = new Date(examDate);
      startTime.setHours(9, 0, 0, 0); // 9 AM
      const endTime = new Date(startTime);
      endTime.setHours(12, 0, 0, 0); // 12 PM

      exams.push({
        courseId: course.id,
        examType: 'MID1',
        examDate: examDate,
        startTime: startTime,
        endTime: endTime
      });
    }

    for (const exam of exams) {
      await prisma.exam.create({ data: exam });
    }
    
    systemStatus.logSuccess('Demo Seeder', `Created ${exams.length} demo exams`);
  }

  async seedRooms() {
    const rooms = [
      { name: 'Main Hall A', capacity: 120, rows: 10, cols: 12 },
      { name: 'Main Hall B', capacity: 100, rows: 10, cols: 10 },
      { name: 'CS Lab 1', capacity: 60, rows: 6, cols: 10 },
      { name: 'CS Lab 2', capacity: 60, rows: 6, cols: 10 },
      { name: 'Auditorium', capacity: 200, rows: 20, cols: 10 }
    ];

    for (const room of rooms) {
      const createdRoom = await prisma.room.upsert({
        where: { name: room.name },
        update: {},
        create: room
      });

      // Create seats for the room
      for (let row = 1; row <= room.rows; row++) {
        for (let col = 1; col <= room.cols; col++) {
          await prisma.seat.upsert({
            where: {
              roomId_rowNumber_colNumber: {
                roomId: createdRoom.id,
                rowNumber: row,
                colNumber: col
              }
            },
            update: {},
            create: {
              roomId: createdRoom.id,
              rowNumber: row,
              colNumber: col
            }
          });
        }
      }
    }
    
    systemStatus.logSuccess('Demo Seeder', `Created ${rooms.length} demo rooms with seats`);
  }

  async seedSeatingAllocations() {
    const exams = await prisma.exam.findMany();
    const rooms = await prisma.room.findMany();
    const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
    const studentUserRoles = await prisma.userRole.findMany({ 
      where: { roleId: studentRole.id },
      include: { user: true }
    });
    const students = studentUserRoles.map(ur => ur.user);

    for (let i = 0; i < Math.min(3, exams.length); i++) {
      const exam = exams[i];
      const room = rooms[i % rooms.length];
      const seats = await prisma.seat.findMany({ where: { roomId: room.id } });
      
      // Allocate seats to students for this exam
      for (let j = 0; j < Math.min(students.length, seats.length); j++) {
        const student = students[j];
        const seat = seats[j];
        
        await prisma.seatingAllocation.upsert({
          where: {
            examId_studentId: {
              examId: exam.id,
              studentId: student.id
            }
          },
          update: {},
          create: {
            examId: exam.id,
            studentId: student.id,
            seatId: seat.id
          }
        });
      }
    }
    
    systemStatus.logSuccess('Demo Seeder', 'Created demo seating allocations');
  }

  async seedMindMaps() {
    const courses = await prisma.course.findMany();
    const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
    const studentUserRoles = await prisma.userRole.findMany({ 
      where: { roleId: studentRole.id },
      include: { user: true }
    });
    const students = studentUserRoles.map(ur => ur.user);
    
    if (students.length === 0) return;
    
    for (let i = 0; i < Math.min(3, courses.length); i++) {
      const course = courses[i];
      const student = students[0]; // Use first student
      
      // Create syllabus first
      const syllabus = await prisma.syllabus.upsert({
        where: { 
          courseId: course.id 
        },
        update: {},
        create: {
          courseId: course.id,
          content: `# ${course.name} Syllabus\n\n## Introduction\nBasic concepts and fundamentals\n\n## Core Topics\nAdvanced concepts and applications`
        }
      });
      
      // Create mind map
      await prisma.mindMap.create({
        data: {
          title: `${course.name} - Study Guide`,
          studentId: student.id,
          syllabusId: syllabus.id
        }
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', 'Created demo mind maps');
  }

  async seedClubs() {
    const facultyRole = await prisma.role.findFirst({ where: { name: 'FACULTY' } });
    const facultyUserRoles = await prisma.userRole.findMany({ 
      where: { roleId: facultyRole.id },
      include: { user: true }
    });
    const faculty = facultyUserRoles.map(ur => ur.user);
    
    if (faculty.length === 0) return;
    
    const clubs = [
      { name: 'Computer Science Club', description: 'For CS enthusiasts', coordinatorId: faculty[0].id },
      { name: 'Photography Club', description: 'Capture moments', coordinatorId: faculty[0].id },
      { name: 'Debate Society', description: 'Art of argumentation', coordinatorId: faculty[1]?.id || faculty[0].id }
    ];

    for (const club of clubs) {
      await prisma.club.upsert({
        where: { name: club.name },
        update: {},
        create: club
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', `Created ${clubs.length} demo clubs`);
  }

  async seedEvents() {
    const clubs = await prisma.club.findMany({ include: { coordinator: true } });
    
    for (const club of clubs) {
      const startDateTime = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 2); // 2 hour event
      
      await prisma.event.create({
        data: {
          title: `${club.name} Workshop`,
          description: `Annual workshop by ${club.name}`,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          location: 'Main Auditorium',
          clubId: club.id,
          createdById: club.coordinatorId,
          status: 'APPROVED'
        }
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', 'Created demo events');
  }

  async seedHallTickets() {
    const exams = await prisma.exam.findMany();
    const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
    const studentUserRoles = await prisma.userRole.findMany({ 
      where: { roleId: studentRole.id },
      include: { user: true }
    });
    const students = studentUserRoles.map(ur => ur.user);
    
    for (let i = 0; i < Math.min(exams.length, students.length); i++) {
      const exam = exams[i];
      const student = students[i];
      
      await prisma.hallTicket.upsert({
        where: {
          studentId_examId: {
            studentId: student.id,
            examId: exam.id
          }
        },
        update: {},
        create: {
          examId: exam.id,
          studentId: student.id,
          qrCode: `QR_${exam.id}_${student.id}_${Date.now()}`
        }
      });
    }
    
    systemStatus.logSuccess('Demo Seeder', 'Created demo hall tickets');
  }

  async getDemoStats() {
    try {
      const stats = await systemStatus.getSystemStats();
      return {
        message: 'Demo data statistics',
        data: stats,
        demoCredentials: {
          admin: { email: 'admin@universe.edu', password: 'demo123' },
          faculty: { email: 'prof.smith@universe.edu', password: 'demo123' },
          student: { email: 'alice.student@universe.edu', password: 'demo123' }
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DemoSeederService();