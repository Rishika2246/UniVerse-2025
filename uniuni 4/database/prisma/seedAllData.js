const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Configuration
const NUM_STUDENTS = 50; // Reduced for faster seeding
const NUM_FACULTY = 10;  // Reduced for faster seeding
const NUM_COURSES = 10;  // Reduced for faster seeding
const NUM_CLUBS = 5;     // Reduced for faster seeding
const EVENTS_PER_CLUB = 3;
const EXAMS_PER_COURSE = 2;
const ROOMS = 5;         // Reduced for faster seeding
const SEATS_PER_ROW = 10;
const ROWS_PER_ROOM = 5;

// Helper functions
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create roles
  console.log('🔑 Creating roles...');
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'STUDENT' },
      update: {},
      create: { name: 'STUDENT' }
    }),
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' }
    }),
    prisma.role.upsert({
      where: { name: 'FACULTY' },
      update: {},
      create: { name: 'FACULTY' }
    }),
    prisma.role.upsert({
      where: { name: 'CLUB_COORDINATOR' },
      update: {},
      create: { name: 'CLUB_COORDINATOR' }
    })
  ]);

  // 2. Create admin user
  console.log('👑 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      roles: {
        create: {
          role: {
            connect: { name: 'ADMIN' }
          }
        }
      }
    }
  });

  // 3. Create faculty
  console.log('👨\u200d🏫 Creating faculty members...');
  const faculty = [];
  for (let i = 0; i < NUM_FACULTY; i++) {
    const facultyMember = await prisma.user.create({
      data: {
        email: `faculty${i+1}@university.edu`,
        passwordHash: await bcrypt.hash('faculty123', 10),
        fullName: faker.person.fullName(),
        roles: {
          create: {
            role: {
              connect: { name: 'FACULTY' }
            }
          }
        }
      }
    });
    faculty.push(facultyMember);
  }

  // 4. Create students
  console.log(`👥 Creating ${NUM_STUDENTS} students...`);
  const students = [];
  for (let i = 0; i < NUM_STUDENTS; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i+1}@university.edu`,
        passwordHash: await bcrypt.hash('student123', 10),
        fullName: faker.person.fullName(),
        rollNo: `STU${1000 + i}`,
        roles: {
          create: {
            role: {
              connect: { name: 'STUDENT' }
            }
          }
        }
      }
    });
    students.push(student);
  }

  // 5. Create courses
  console.log(`📚 Creating ${NUM_COURSES} courses...`);
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const courses = [];
  
  for (let i = 0; i < NUM_COURSES; i++) {
    const course = await prisma.course.create({
      data: {
        code: `CS${i+1}01`,
        name: `Course ${i+1}`,
        semester: (i % 4) + 1,
        department: departments[i % departments.length],
        syllabus: {
          create: {
            content: `# Course ${i+1} Syllabus\n\nThis is the syllabus for Course ${i+1}.`,
            sourcePdfUrl: `https://example.com/syllabus/course${i+1}.pdf`
          }
        }
      }
    });
    courses.push(course);
  }

  // 6. Enroll students in courses
  console.log('🎓 Enrolling students in courses...');
  for (const student of students) {
    // Each student takes 3-5 random courses
    const numCourses = 3 + Math.floor(Math.random() * 3);
    const studentCourses = [...courses]
      .sort(() => 0.5 - Math.random())
      .slice(0, numCourses);
    
    for (const course of studentCourses) {
      await prisma.studentCourse.create({
        data: {
          student: { connect: { id: student.id } },
          course: { connect: { id: course.id } }
        }
      });
    }
  }

  // 7. Create exams
  console.log(`📝 Creating ${EXAMS_PER_COURSE} exams per course...`);
  const exams = [];
  const examTypes = ['MID1', 'MID2', 'END'];
  
  for (const course of courses) {
    for (let i = 0; i < EXAMS_PER_COURSE; i++) {
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + (i * 14)); // 2 weeks apart
      
      const exam = await prisma.exam.create({
        data: {
          course: { connect: { id: course.id } },
          examType: examTypes[i % examTypes.length],
          examDate: examDate,
          startTime: new Date(examDate.setHours(9, 0, 0, 0)),
          endTime: new Date(examDate.setHours(12, 0, 0, 0))
        }
      });
      exams.push(exam);
    }
  }

  // 8. Create rooms and seats
  console.log(`🏫 Creating ${ROOMS} rooms with ${ROWS_PER_ROOM}x${SEATS_PER_ROW} seats each...`);
  const rooms = [];
  for (let i = 0; i < ROOMS; i++) {
    const room = await prisma.room.create({
      data: {
        name: `A-${i+1}`,
        capacity: ROWS_PER_ROOM * SEATS_PER_ROW,
        rows: ROWS_PER_ROOM,
        cols: SEATS_PER_ROW
      }
    });
    rooms.push(room);

    // Create seats for this room
    for (let row = 1; row <= ROWS_PER_ROOM; row++) {
      for (let col = 1; col <= SEATS_PER_ROW; col++) {
        await prisma.seat.create({
          data: {
            room: { connect: { id: room.id } },
            rowNumber: row,
            colNumber: col
          }
        });
      }
    }
  }

  // 9. Create hall tickets and seating allocations
  console.log('🎫 Creating hall tickets and seating allocations...');
  for (const exam of exams) {
    const courseStudents = await prisma.studentCourse.findMany({
      where: { courseId: exam.courseId },
      include: { student: true }
    });

    let seatCounter = 0;
    for (const { student } of courseStudents) {
      // Create hall ticket
      await prisma.hallTicket.create({
        data: {
          student: { connect: { id: student.id } },
          exam: { connect: { id: exam.id } },
          qrCode: `TICKET-${exam.id.substring(0, 8)}-${student.id.substring(0, 8)}`
        }
      });

      // Assign seat
      const room = rooms[seatCounter % rooms.length];
      const seats = await prisma.seat.findMany({
        where: { roomId: room.id }
      });
      const seat = seats[seatCounter % seats.length];

      await prisma.seatingAllocation.create({
        data: {
          exam: { connect: { id: exam.id } },
          student: { connect: { id: student.id } },
          seat: { connect: { id: seat.id } }
        }
      });

      seatCounter++;
    }
  }

  // 10. Create clubs
  console.log(`🎭 Creating ${NUM_CLUBS} clubs...`);
  const clubNames = ['Tech Club', 'Coding Club', 'Robotics Club', 'Literary Club', 'Music Club'];
  const clubs = [];
  
  for (let i = 0; i < NUM_CLUBS; i++) {
    const club = await prisma.club.create({
      data: {
        name: clubNames[i],
        description: `This is the ${clubNames[i]}`,
        coordinator: {
          connect: { id: students[i % students.length].id }
        }
      }
    });
    clubs.push(club);
  }

  // 11. Create events
  console.log(`🎉 Creating ${EVENTS_PER_CLUB} events per club...`);
  const eventTitles = ['Workshop', 'Seminar', 'Guest Lecture', 'Hackathon', 'Competition'];

  for (const club of clubs) {
    for (let i = 0; i < EVENTS_PER_CLUB; i++) {
      const startDate = randomDate(new Date(), new Date(2024, 11, 31));
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2); // 2-hour events

      await prisma.event.create({
        data: {
          club: { connect: { id: club.id } },
          title: `${randomItem(eventTitles)}: ${faker.lorem.words(3)}`,
          description: faker.lorem.paragraph(),
          startDateTime: startDate,
          endDateTime: endDate,
          location: `${faker.location.buildingNumber()}, ${faker.location.street()}`,
          status: 'APPROVED',
          createdBy: { connect: { id: club.coordinatorId } },
          documents: {
            create: {
              fileUrl: `https://university.edu/events/${club.name.toLowerCase().replace(' ', '-')}-${i+1}.pdf`,
              fileType: 'PDF'
            }
          }
        }
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n🔑 Admin Login:');
  console.log('   Email: admin@university.edu');
  console.log('   Password: admin123');
  console.log('\n👨\u200d🎓 Student Login:');
  console.log('   Email: student1@university.edu');
  console.log('   Password: student123');
  console.log('\n👨\u200d🏫 Faculty Login:');
  console.log('   Email: faculty1@university.edu');
  console.log('   Password: faculty123');
  console.log('\n🚀 Start the application and log in to explore!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
