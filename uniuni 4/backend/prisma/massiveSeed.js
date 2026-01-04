const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const prisma = new PrismaClient();

// Helper functions
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(name, domain = 'university.edu') {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`;
}

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel', 'Linda', 'Matthew', 'Barbara', 'Anthony', 'Elizabeth', 'Mark', 'Susan', 'Donald', 'Jessica', 'Steven', 'Karen', 'Paul', 'Nancy', 'Andrew', 'Betty', 'Joshua', 'Margaret', 'Kenneth', 'Sandra', 'Kevin', 'Ashley', 'Brian', 'Kimberly', 'George', 'Emily', 'Timothy', 'Donna', 'Ronald', 'Michelle', 'Edward', 'Carol', 'Jason', 'Amanda', 'Jeffrey', 'Melissa'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

async function main() {
  console.log('🚀 Starting MASSIVE data seeding...\n');
  
  // Create roles
  console.log('📋 Creating roles...');
  const roles = ['ADMIN', 'STUDENT', 'SEATING_MANAGER', 'CLUB_COORDINATOR', 'FACULTY'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('✅ Roles created\n');

  // Get role IDs
  const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
  const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
  const facultyRole = await prisma.role.findFirst({ where: { name: 'FACULTY' } });
  const seatingRole = await prisma.role.findFirst({ where: { name: 'SEATING_MANAGER' } });
  const clubRole = await prisma.role.findFirst({ where: { name: 'CLUB_COORDINATOR' } });

  // Create admin
  console.log('👨‍💼 Creating admin user...');
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      passwordHash: adminHash,
      fullName: 'System Administrator',
      rollNo: 'ADMIN001',
      roles: { create: [{ roleId: adminRole.id }] },
    },
  });
  console.log('✅ Admin created\n');

  // Create 100 faculty members
  console.log('👨‍🏫 Creating 100 faculty members...');
  const faculties = [];
  const facultyHash = await bcrypt.hash('faculty123', 12);
  for (let i = 1; i <= 100; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = generateEmail(`faculty${i}`);
    const faculty = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: facultyHash,
        fullName: name,
        rollNo: `FAC${String(i).padStart(4, '0')}`,
        roles: { create: [{ roleId: facultyRole.id }] },
      },
    });
    faculties.push(faculty);
    if (i % 10 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 100 faculty members created\n');

  // Create 20 seating managers
  console.log('🪑 Creating 20 seating managers...');
  const seatingManagers = [];
  const seatHash = await bcrypt.hash('seat123', 12);
  for (let i = 1; i <= 20; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = generateEmail(`seating${i}`);
    const manager = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: seatHash,
        fullName: name,
        rollNo: `SEAT${String(i).padStart(4, '0')}`,
        roles: { create: [{ roleId: seatingRole.id }] },
      },
    });
    seatingManagers.push(manager);
  }
  console.log('✅ 20 seating managers created\n');

  // Create 20 club coordinators
  console.log('🎭 Creating 20 club coordinators...');
  const clubCoordinators = [];
  const coordHash = await bcrypt.hash('coord123', 12);
  for (let i = 1; i <= 20; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = generateEmail(`clubcoord${i}`);
    const coordinator = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: coordHash,
        fullName: name,
        rollNo: `CC${String(i).padStart(4, '0')}`,
        roles: { create: [{ roleId: clubRole.id }] },
      },
    });
    clubCoordinators.push(coordinator);
  }
  console.log('✅ 20 club coordinators created\n');

  // Create 500 students
  console.log('👨‍🎓 Creating 500 students...');
  const students = [];
  const studentHash = await bcrypt.hash('student123', 12);
  for (let i = 1; i <= 500; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = generateEmail(`student${i}`);
    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: studentHash,
        fullName: name,
        rollNo: `STU${String(i).padStart(4, '0')}`,
        roles: { create: [{ roleId: studentRole.id }] },
      },
    });
    students.push(student);
    if (i % 50 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 500 students created\n');

  // Create 100 courses across departments
  console.log('📚 Creating 100 courses...');
  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'CHEM', 'BIO', 'MATH', 'PHY'];
  const courses = [];
  for (const dept of departments) {
    for (let sem = 1; sem <= 8; sem++) {
      for (let i = 1; i <= 2; i++) {
        const code = `${dept}${sem}${i}`;
        const course = await prisma.course.upsert({
          where: { code },
          update: {},
          create: {
            code,
            name: `${dept} Course ${sem}.${i}`,
            semester: sem,
            department: dept,
          },
        });
        courses.push(course);
        
        // Create syllabus for each course
        const existingSyl = await prisma.syllabus.findFirst({ where: { courseId: course.id } });
        if (!existingSyl) {
          await prisma.syllabus.create({
            data: {
              courseId: course.id,
              content: `# ${course.name} Syllabus\n\n## Module 1: Introduction\nBasic concepts and fundamentals\n\n## Module 2: Core Topics\nAdvanced concepts and applications\n\n## Module 3: Advanced Topics\nSpecialized knowledge and skills\n\n## Module 4: Practical Applications\nHands-on projects and case studies`,
            },
          });
        }
      }
    }
  }
  console.log(`✅ ${courses.length} courses created with syllabi\n`);

  // Enroll students in courses (each student in 5-8 courses)
  console.log('📝 Enrolling students in courses...');
  for (const student of students) {
    const numCourses = randInt(5, 8);
    const selectedCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, numCourses);
    for (const course of selectedCourses) {
      await prisma.studentCourse.upsert({
        where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
        update: {},
        create: { studentId: student.id, courseId: course.id },
      });
    }
    if (students.indexOf(student) % 50 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Students enrolled in courses\n');

  // Create 200 exams
  console.log('📝 Creating 200 exams...');
  const examTypes = ['MID1', 'MID2', 'END', 'QUIZ'];
  for (let i = 0; i < 200; i++) {
    const course = pick(courses);
    const examDate = new Date(Date.now() + randInt(-30, 60) * 24 * 60 * 60 * 1000);
    const startTime = new Date(examDate);
    startTime.setHours(randInt(9, 14), 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + randInt(2, 3), 0, 0, 0);
    
    await prisma.exam.create({
      data: {
        courseId: course.id,
        examType: pick(examTypes),
        examDate,
        startTime,
        endTime,
      },
    });
    if (i % 20 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 200 exams created\n');

  // Create 50 rooms with seats
  console.log('🏢 Creating 50 rooms with seats...');
  const rooms = [];
  for (let i = 1; i <= 50; i++) {
    const capacity = randInt(30, 100);
    const rows = Math.ceil(Math.sqrt(capacity));
    const cols = Math.ceil(capacity / rows);
    
    const room = await prisma.room.upsert({
      where: { name: `Room-${String(i).padStart(3, '0')}` },
      update: {},
      create: {
        name: `Room-${String(i).padStart(3, '0')}`,
        capacity,
        rows,
        cols,
      },
    });
    rooms.push(room);
    
    // Create seats for the room
    const existingSeatCount = await prisma.seat.count({ where: { roomId: room.id } });
    if (existingSeatCount === 0) {
      const seats = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          seats.push({ roomId: room.id, rowNumber: r, colNumber: c });
        }
      }
      await prisma.seat.createMany({ data: seats });
    }
    if (i % 10 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 50 rooms created with seats\n');

  // Create seating allocations for exams
  console.log('🪑 Creating seating allocations...');
  const exams = await prisma.exam.findMany({ take: 100 });
  const allSeats = await prisma.seat.findMany({ take: 5000 });
  
  for (const exam of exams) {
    const numStudents = randInt(20, 50);
    const examStudents = [...students].sort(() => 0.5 - Math.random()).slice(0, numStudents);
    const examSeats = [...allSeats].sort(() => 0.5 - Math.random()).slice(0, numStudents);
    
    for (let i = 0; i < examStudents.length; i++) {
      const student = examStudents[i];
      const seat = examSeats[i];
      
      try {
        await prisma.seatingAllocation.upsert({
          where: { examId_studentId: { examId: exam.id, studentId: student.id } },
          update: {},
          create: { examId: exam.id, studentId: student.id, seatId: seat.id },
        });
      } catch (error) {
        // Skip if seat already allocated for this exam
        continue;
      }
    }
    if (exams.indexOf(exam) % 10 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Seating allocations created\n');

  // Create hall tickets
  console.log('🎫 Creating hall tickets...');
  const allocations = await prisma.seatingAllocation.findMany({ take: 1000 });
  for (const allocation of allocations) {
    const qrToken = `QR-${allocation.examId}-${allocation.studentId}-${Date.now()}`;
    await prisma.hallTicket.upsert({
      where: { studentId_examId: { studentId: allocation.studentId, examId: allocation.examId } },
      update: {},
      create: {
        studentId: allocation.studentId,
        examId: allocation.examId,
        qrToken: qrToken,
      },
    });
    if (allocations.indexOf(allocation) % 100 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Hall tickets created\n');

  // Create 100 mind maps
  console.log('🧠 Creating 100 mind maps...');
  const syllabi = await prisma.syllabus.findMany({ 
    take: 50,
    include: { course: true }
  });
  for (let i = 0; i < 100; i++) {
    const student = pick(students);
    const syllabus = pick(syllabi);
    
    const mindMap = await prisma.mindMap.create({
      data: {
        title: `Mind Map ${i + 1} - ${syllabus.course.name}`,
        studentId: student.id,
        syllabusId: syllabus.id,
      },
    });
    
    // Create nodes for the mind map
    const root = await prisma.mindMapNode.create({
      data: { label: 'Root Topic', orderIndex: 0, mindmapId: mindMap.id },
    });
    
    for (let j = 1; j <= randInt(3, 7); j++) {
      await prisma.mindMapNode.create({
        data: {
          label: `Subtopic ${j}`,
          orderIndex: j,
          mindmapId: mindMap.id,
          parentId: root.id,
        },
      });
    }
    if (i % 10 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 100 mind maps created\n');

  // Create 50 clubs
  console.log('🎭 Creating 50 clubs...');
  const clubNames = ['Coding', 'Robotics', 'Literary', 'Music', 'Dance', 'Drama', 'Photography', 'Art', 'Debate', 'Quiz', 'Sports', 'Chess', 'Science', 'Math', 'Environment', 'Social Service', 'Entrepreneurship', 'Innovation', 'Cultural', 'Technical'];
  const clubTypes = ['Club', 'Society', 'Association', 'Forum', 'Group'];
  const clubs = [];
  
  for (let i = 0; i < 50; i++) {
    const name = `${pick(clubNames)} ${pick(clubTypes)} ${i + 1}`;
    const coordinator = pick(faculties);
    
    const club = await prisma.club.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `A vibrant community for ${pick(clubNames).toLowerCase()} enthusiasts`,
        coordinatorId: coordinator.id,
      },
    });
    clubs.push(club);
  }
  console.log(`✅ ${clubs.length} clubs created\n`);

  // Create 200 events
  console.log('🎪 Creating 200 events...');
  const eventTypes = ['Workshop', 'Seminar', 'Competition', 'Exhibition', 'Conference', 'Meetup', 'Hackathon', 'Webinar'];
  const statuses = ['APPROVED', 'PENDING', 'APPROVED', 'APPROVED']; // More approved events
  
  for (let i = 0; i < 200; i++) {
    const club = pick(clubs);
    const startDateTime = new Date(Date.now() + randInt(-30, 90) * 24 * 60 * 60 * 1000);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + randInt(2, 6));
    
    const event = await prisma.event.create({
      data: {
        title: `${pick(eventTypes)} ${i + 1}`,
        description: `An exciting ${pick(eventTypes).toLowerCase()} organized by ${club.name}`,
        startDateTime,
        endDateTime,
        location: `Hall ${randInt(1, 10)}`,
        status: pick(statuses),
        clubId: club.id,
        createdById: club.coordinatorId,
      },
    });
    
    // Add attendees to events
    const numAttendees = randInt(10, 50);
    const attendees = [...students].sort(() => 0.5 - Math.random()).slice(0, numAttendees);
    for (const attendee of attendees) {
      await prisma.eventAttendee.upsert({
        where: { eventId_userId: { eventId: event.id, userId: attendee.id } },
        update: {},
        create: { eventId: event.id, userId: attendee.id, status: 'GOING' },
      });
    }
    
    if (i % 20 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 200 events created with attendees\n');

  // Import CSV student performance data
  console.log('📊 Importing CSV student performance data...');
  try {
    const mathFile = '/Users/rishika/Downloads/student+performance/student/student-mat.csv';
    const portugueseFile = '/Users/rishika/Downloads/student+performance/student/student-por.csv';

    if (fs.existsSync(mathFile)) {
      const mathData = parse(fs.readFileSync(mathFile, 'utf8'), {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true
      });
      
      console.log(`Found ${mathData.length} math students in CSV`);
      await importCSVStudents(mathData, 'MATH');
    }

    if (fs.existsSync(portugueseFile)) {
      const portugueseData = parse(fs.readFileSync(portugueseFile, 'utf8'), {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true
      });
      
      console.log(`Found ${portugueseData.length} portuguese students in CSV`);
      await importCSVStudents(portugueseData, 'PORTUGUESE');
    }
  } catch (error) {
    console.log('⚠️  CSV files not found, skipping CSV import');
  }

  console.log('\n🎉 MASSIVE SEEDING COMPLETED!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Courses: ${await prisma.course.count()}`);
  console.log(`   - Exams: ${await prisma.exam.count()}`);
  console.log(`   - Rooms: ${await prisma.room.count()}`);
  console.log(`   - Seats: ${await prisma.seat.count()}`);
  console.log(`   - Seating Allocations: ${await prisma.seatingAllocation.count()}`);
  console.log(`   - Hall Tickets: ${await prisma.hallTicket.count()}`);
  console.log(`   - Mind Maps: ${await prisma.mindMap.count()}`);
  console.log(`   - Clubs: ${await prisma.club.count()}`);
  console.log(`   - Events: ${await prisma.event.count()}`);
  console.log(`   - Student Performance Records: ${await prisma.student.count()}`);
  console.log(`   - Grades: ${await prisma.grade.count()}`);
}

async function importCSVStudents(students, subject) {
  let successCount = 0;
  
  for (const student of students) {
    const studentId = `${student.school}-${student.sex}-${student.age}-${student.address}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await prisma.student.upsert({
        where: { id: studentId },
        update: {},
        create: {
          id: studentId,
          school: student.school,
          sex: student.sex,
          age: parseInt(student.age) || 0,
          address: student.address,
          famsize: student.famsize,
          Pstatus: student.Pstatus,
          Medu: parseInt(student.Medu) || 0,
          Fedu: parseInt(student.Fedu) || 0,
          Mjob: student.Mjob,
          Fjob: student.Fjob,
          reason: student.reason,
          guardian: student.guardian,
          traveltime: parseInt(student.traveltime) || 0,
          studytime: parseInt(student.studytime) || 0,
          failures: parseInt(student.failures) || 0,
          schoolsup: student.schoolsup === 'yes',
          famsup: student.famsup === 'yes',
          paid: student.paid === 'yes',
          activities: student.activities === 'yes',
          nursery: student.nursery === 'yes',
          higher: student.higher === 'yes',
          internet: student.internet === 'yes',
          romantic: student.romantic === 'yes',
          famrel: parseInt(student.famrel) || 0,
          freetime: parseInt(student.freetime) || 0,
          goout: parseInt(student.goout) || 0,
          Dalc: parseInt(student.Dalc) || 0,
          Walc: parseInt(student.Walc) || 0,
          health: parseInt(student.health) || 0,
          absences: parseInt(student.absences) || 0,
        },
      });

      await prisma.grade.create({
        data: {
          studentId: studentId,
          subject: subject,
          G1: parseInt(student.G1) || 0,
          G2: parseInt(student.G2) || 0,
          G3: parseInt(student.G3) || 0,
        },
      });

      successCount++;
      if (successCount % 50 === 0) process.stdout.write('.');
    } catch (error) {
      // Skip duplicates
    }
  }
  
  console.log(`\n✅ Imported ${successCount} ${subject} students from CSV`);
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });