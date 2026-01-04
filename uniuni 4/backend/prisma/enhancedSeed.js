const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

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

// Enhanced name lists for more realistic data
const indianFirstNames = [
  'Ananya', 'Rahul', 'Sneha', 'Arjun', 'Priya', 'Amit', 'Neha', 'Rohit', 'Kiran', 'Pooja',
  'Vikram', 'Meera', 'Rajesh', 'Kavya', 'Suresh', 'Divya', 'Arun', 'Lakshmi', 'Ravi', 'Sita',
  'Harish', 'Geetha', 'Mohan', 'Padma', 'Venkat', 'Swathi', 'Naveen', 'Bhavani', 'Srinivas', 'Ramya',
  'Mahesh', 'Sunitha', 'Prakash', 'Jyothi', 'Ramesh', 'Usha', 'Sunil', 'Madhavi', 'Chandra', 'Vasantha',
  'Raju', 'Shanti', 'Bhaskar', 'Latha', 'Gopal', 'Saroja', 'Naresh', 'Kamala', 'Satish', 'Radha'
];

const indianLastNames = [
  'Reddy', 'Sharma', 'Patel', 'Verma', 'Nair', 'Joshi', 'Singh', 'Mehta', 'Rao', 'Kulkarni',
  'Gupta', 'Kumar', 'Babu', 'Devi', 'Teja', 'Mahalakshmi', 'Chandra', 'Rani', 'Krishna', 'Naidu',
  'Prasad', 'Kumari', 'Sekhar', 'Latha', 'Murthy', 'Prasanna', 'Lakshmi', 'Srinivas', 'Venkatesh'
];

// Department and course data
const departments = [
  { code: 'CSE', name: 'Computer Science Engineering', courses: ['DBMS', 'OS', 'CN', 'SE', 'AI', 'ML', 'DS', 'TOC'] },
  { code: 'ECE', name: 'Electronics & Communication', courses: ['DSP', 'VLSI', 'Microprocessors', 'Signals', 'Communications', 'Embedded'] },
  { code: 'MECH', name: 'Mechanical Engineering', courses: ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing', 'Design', 'Materials', 'Heat Transfer'] },
  { code: 'EEE', name: 'Electrical Engineering', courses: ['Power Systems', 'Machines', 'Control Systems', 'Electronics', 'Circuits'] },
  { code: 'CIVIL', name: 'Civil Engineering', courses: ['Structures', 'Geotechnical', 'Transportation', 'Environmental', 'Construction'] },
  { code: 'IT', name: 'Information Technology', courses: ['Web Tech', 'Mobile Computing', 'Cloud Computing', 'Cybersecurity', 'IoT'] }
];

// Hall names for realistic seating
const hallNames = ['HALL-A', 'HALL-B', 'HALL-C', 'HALL-D', 'HALL-E', 'HALL-F', 'HALL-G', 'HALL-H', 'HALL-I', 'HALL-J'];

async function main() {
  console.log('🚀 Starting ENHANCED data seeding with CSV integration...\n');
  
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

  // Create admin users
  console.log('👨‍💼 Creating admin users...');
  const adminHash = await bcrypt.hash('admin123', 12);
  const admins = [];
  
  for (let i = 1; i <= 5; i++) {
    const admin = await prisma.user.upsert({
      where: { email: `admin${i}@university.edu` },
      update: {},
      create: {
        email: `admin${i}@university.edu`,
        passwordHash: adminHash,
        fullName: `System Administrator ${i}`,
        rollNo: `ADMIN${String(i).padStart(3, '0')}`,
        roles: { create: [{ roleId: adminRole.id }] },
      },
    });
    admins.push(admin);
  }
  console.log('✅ Admin users created\n');

  // Create faculty members
  console.log('👨‍🏫 Creating 150 faculty members...');
  const faculties = [];
  const facultyHash = await bcrypt.hash('faculty123', 12);
  
  for (let i = 1; i <= 150; i++) {
    const firstName = pick(indianFirstNames);
    const lastName = pick(indianLastNames);
    const name = `${firstName} ${lastName}`;
    const email = generateEmail(`faculty${i}`);
    const department = pick(departments);
    
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
    faculties.push({ ...faculty, department: department.code });
    if (i % 25 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 150 faculty members created\n');

  // Create seating managers
  console.log('🪑 Creating 25 seating managers...');
  const seatingManagers = [];
  const seatHash = await bcrypt.hash('seat123', 12);
  
  for (let i = 1; i <= 25; i++) {
    const firstName = pick(indianFirstNames);
    const lastName = pick(indianLastNames);
    const name = `${firstName} ${lastName}`;
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
  console.log('✅ 25 seating managers created\n');

  // Create club coordinators
  console.log('🎭 Creating 30 club coordinators...');
  const clubCoordinators = [];
  const coordHash = await bcrypt.hash('coord123', 12);
  
  for (let i = 1; i <= 30; i++) {
    const firstName = pick(indianFirstNames);
    const lastName = pick(indianLastNames);
    const name = `${firstName} ${lastName}`;
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
  console.log('✅ 30 club coordinators created\n');

  // Create courses for all departments
  console.log('📚 Creating comprehensive course catalog...');
  const courses = [];
  
  for (const dept of departments) {
    for (let sem = 1; sem <= 8; sem++) {
      for (const courseName of dept.courses) {
        const code = `${dept.code}${sem}${courseName.substring(0, 3).toUpperCase()}`;
        const course = await prisma.course.upsert({
          where: { code },
          update: {},
          create: {
            code,
            name: `${courseName} - Semester ${sem}`,
            semester: sem,
            department: dept.code,
          },
        });
        courses.push(course);
        
        // Create detailed syllabus
        const existingSyl = await prisma.syllabus.findFirst({ where: { courseId: course.id } });
        if (!existingSyl) {
          await prisma.syllabus.create({
            data: {
              courseId: course.id,
              content: generateSyllabusContent(courseName, sem),
            },
          });
        }
      }
    }
  }
  console.log(`✅ ${courses.length} courses created with detailed syllabi\n`);

  // Import students from CSV and create additional students
  console.log('👨‍🎓 Creating students from CSV and additional data...');
  const students = [];
  const studentHash = await bcrypt.hash('student123', 12);
  
  // First, import from CSV
  try {
    const csvPath = path.join(__dirname, '../../sample_hall_tickets.csv');
    if (fs.existsSync(csvPath)) {
      const csvData = parse(fs.readFileSync(csvPath, 'utf8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
      
      console.log(`Found ${csvData.length} students in CSV file`);
      
      for (const row of csvData) {
        const email = generateEmail(row.student_name.replace(/\s+/g, '.'));
        const student = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            passwordHash: studentHash,
            fullName: row.student_name,
            rollNo: row.student_id,
            roles: { create: [{ roleId: studentRole.id }] },
          },
        });
        students.push({ ...student, department: row.department });
      }
      console.log(`✅ Imported ${csvData.length} students from CSV`);
    }
  } catch (error) {
    console.log('⚠️  CSV file not found, continuing with generated data');
  }
  
  // Create additional students to reach 1000 total
  const additionalStudents = 1000 - students.length;
  console.log(`Creating ${additionalStudents} additional students...`);
  
  for (let i = students.length + 1; i <= 1000; i++) {
    const firstName = pick(indianFirstNames);
    const lastName = pick(indianLastNames);
    const name = `${firstName} ${lastName}`;
    const email = generateEmail(`student${i}`);
    const department = pick(departments);
    const rollNo = `CBIT${String(i).padStart(4, '0')}`;
    
    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: studentHash,
        fullName: name,
        rollNo: rollNo,
        roles: { create: [{ roleId: studentRole.id }] },
      },
    });
    students.push({ ...student, department: department.code });
    if (i % 100 === 0) process.stdout.write('.');
  }
  console.log(`\n✅ Total ${students.length} students created\n`);

  // Enroll students in courses based on their department
  console.log('📝 Enrolling students in department-specific courses...');
  for (const student of students) {
    const deptCourses = courses.filter(c => c.department === student.department);
    const numCourses = randInt(6, 10);
    const selectedCourses = [...deptCourses].sort(() => 0.5 - Math.random()).slice(0, numCourses);
    
    for (const course of selectedCourses) {
      await prisma.studentCourse.upsert({
        where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
        update: {},
        create: { studentId: student.id, courseId: course.id },
      });
    }
    if (students.indexOf(student) % 100 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Students enrolled in courses\n');

  // Create comprehensive exam schedule
  console.log('📝 Creating comprehensive exam schedule...');
  const examTypes = ['MID1', 'MID2', 'END', 'QUIZ', 'LAB'];
  const exams = [];
  
  for (const course of courses) {
    for (const examType of examTypes.slice(0, 3)) { // MID1, MID2, END for each course
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + randInt(-30, 90));
      
      const startTime = new Date(examDate);
      if (examType === 'MID1' || examType === 'MID2') {
        startTime.setHours(randInt(9, 14), 30, 0, 0);
      } else {
        startTime.setHours(randInt(9, 14), 0, 0, 0);
      }
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + (examType === 'END' ? 3 : 2), 0, 0, 0);
      
      const exam = await prisma.exam.create({
        data: {
          courseId: course.id,
          examType,
          examDate,
          startTime,
          endTime,
        },
      });
      exams.push(exam);
    }
    if (courses.indexOf(course) % 50 === 0) process.stdout.write('.');
  }
  console.log(`\n✅ ${exams.length} exams created\n`);

  // Create realistic room structure
  console.log('🏢 Creating realistic room and seating structure...');
  const rooms = [];
  
  for (const hallName of hallNames) {
    const capacity = randInt(80, 120);
    const rows = Math.ceil(capacity / 20); // Approximately 20 seats per row
    const cols = Math.ceil(capacity / rows);
    
    const room = await prisma.room.upsert({
      where: { name: hallName },
      update: {},
      create: {
        name: hallName,
        capacity,
        rows,
        cols,
      },
    });
    rooms.push(room);
    
    // Create seats with realistic numbering
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
  }
  console.log(`✅ ${rooms.length} halls created with realistic seating\n`);

  // Create exam seating and hall tickets from CSV data
  console.log('🎫 Creating exam seating and hall tickets from CSV data...');
  try {
    const csvPath = path.join(__dirname, '../../sample_hall_tickets.csv');
    if (fs.existsSync(csvPath)) {
      const csvData = parse(fs.readFileSync(csvPath, 'utf8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
      
      // Group CSV data by exam
      const examGroups = {};
      for (const row of csvData) {
        if (!examGroups[row.exam_id]) {
          examGroups[row.exam_id] = [];
        }
        examGroups[row.exam_id].push(row);
      }
      
      // Create exams and seating from CSV
      for (const [examId, examRows] of Object.entries(examGroups)) {
        const firstRow = examRows[0];
        const examDate = new Date(firstRow.exam_date);
        const [hours, minutes] = firstRow.exam_time.split(':');
        const startTime = new Date(examDate);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 3, 0, 0, 0);
        
        // Find or create course for this exam
        const course = courses.find(c => c.name.includes(firstRow.exam_name.split(' ')[0])) || courses[0];
        
        const exam = await prisma.exam.create({
          data: {
            courseId: course.id,
            examType: 'MID1',
            examDate,
            startTime,
            endTime,
          },
        });
        
        // Create exam seating entries
        for (const row of examRows) {
          const student = students.find(s => s.rollNo === row.student_id);
          if (student) {
            await prisma.examSeating.create({
              data: {
                examId: exam.id,
                hallName: row.hall_name,
                seatNumber: row.seat_number,
                studentId: student.id,
                gate: row.hall_name.includes('A') || row.hall_name.includes('B') ? 'Gate-1' : 'Gate-2',
                block: row.hall_name.charAt(row.hall_name.length - 1),
              },
            });
            
            // Create hall ticket
            await prisma.hallTicket.create({
              data: {
                studentId: student.id,
                examId: exam.id,
                hallTicketNumber: `HT-${row.student_id}-${examId}`,
                examSession: 'REGULAR',
                seatNumber: row.seat_number,
                hallName: row.hall_name,
                examDate,
                examTime: firstRow.exam_time,
                qrToken: row.qr_code_id,
                gate: row.hall_name.includes('A') || row.hall_name.includes('B') ? 'Gate-1' : 'Gate-2',
                block: row.hall_name.charAt(row.hall_name.length - 1),
                invigilatorName: `Invigilator ${randInt(1, 20)}`,
              },
            });
          }
        }
        process.stdout.write('.');
      }
      console.log(`\n✅ Created exam seating and hall tickets from CSV data`);
    }
  } catch (error) {
    console.log('⚠️  Error processing CSV data:', error.message);
  }

  // Create additional seating allocations for other exams
  console.log('🪑 Creating additional seating allocations...');
  const allSeats = await prisma.seat.findMany();
  const remainingExams = await prisma.exam.findMany({
    where: {
      seatingAllocations: { none: {} }
    },
    take: 100
  });
  
  for (const exam of remainingExams) {
    const course = await prisma.course.findUnique({ where: { id: exam.courseId } });
    const enrolledStudents = await prisma.studentCourse.findMany({
      where: { courseId: course.id },
      include: { student: true }
    });
    
    const numStudents = Math.min(enrolledStudents.length, randInt(30, 80));
    const selectedStudents = enrolledStudents.slice(0, numStudents);
    const selectedSeats = [...allSeats].sort(() => 0.5 - Math.random()).slice(0, numStudents);
    
    for (let i = 0; i < selectedStudents.length; i++) {
      const student = selectedStudents[i].student;
      const seat = selectedSeats[i];
      
      try {
        await prisma.seatingAllocation.create({
          data: {
            examId: exam.id,
            studentId: student.id,
            seatId: seat.id,
          },
        });
        
        // Create hall ticket
        await prisma.hallTicket.upsert({
          where: { studentId_examId: { studentId: student.id, examId: exam.id } },
          update: {},
          create: {
            studentId: student.id,
            examId: exam.id,
            qrToken: `QR-${student.rollNo}-${exam.id}-${Date.now()}`,
            hallTicketNumber: `HT-${student.rollNo}-${exam.id}`,
            examSession: 'REGULAR',
          },
        });
      } catch (error) {
        // Skip if already allocated
        continue;
      }
    }
    if (remainingExams.indexOf(exam) % 10 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Additional seating allocations created\n');

  // Create comprehensive mind maps
  console.log('🧠 Creating comprehensive mind maps...');
  const syllabi = await prisma.syllabus.findMany({ 
    take: 100,
    include: { course: true }
  });
  
  for (let i = 0; i < 200; i++) {
    const student = pick(students);
    const syllabus = pick(syllabi);
    
    const mindMap = await prisma.mindMap.create({
      data: {
        title: `${syllabus.course.name} - Study Map ${i + 1}`,
        studentId: student.id,
        syllabusId: syllabus.id,
      },
    });
    
    // Create comprehensive node structure
    const root = await prisma.mindMapNode.create({
      data: { 
        label: syllabus.course.name, 
        orderIndex: 0, 
        mindmapId: mindMap.id,
        notes: 'Main course overview and objectives'
      },
    });
    
    const modules = ['Introduction', 'Core Concepts', 'Advanced Topics', 'Applications', 'Case Studies'];
    for (let j = 0; j < modules.length; j++) {
      const moduleNode = await prisma.mindMapNode.create({
        data: {
          label: modules[j],
          orderIndex: j + 1,
          mindmapId: mindMap.id,
          parentId: root.id,
          notes: `Detailed notes for ${modules[j]} module`
        },
      });
      
      // Create subtopics
      for (let k = 1; k <= randInt(3, 6); k++) {
        await prisma.mindMapNode.create({
          data: {
            label: `${modules[j]} - Topic ${k}`,
            orderIndex: k,
            mindmapId: mindMap.id,
            parentId: moduleNode.id,
            notes: `Specific content for topic ${k}`
          },
        });
      }
    }
    
    if (i % 25 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 200 comprehensive mind maps created\n');

  // Create diverse clubs
  console.log('🎭 Creating diverse clubs...');
  const clubCategories = {
    'Technical': ['Coding', 'Robotics', 'AI/ML', 'Cybersecurity', 'IoT', 'Blockchain'],
    'Cultural': ['Music', 'Dance', 'Drama', 'Art', 'Photography', 'Literary'],
    'Sports': ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Athletics'],
    'Academic': ['Mathematics', 'Science', 'Quiz', 'Debate', 'Research', 'Innovation'],
    'Social': ['Environment', 'Community Service', 'NGO', 'Blood Donation', 'Awareness'],
    'Professional': ['Entrepreneurship', 'Leadership', 'Toastmasters', 'Career', 'Industry']
  };
  
  const clubs = [];
  for (const [category, clubNames] of Object.entries(clubCategories)) {
    for (const clubName of clubNames) {
      const coordinator = pick(faculties);
      const club = await prisma.club.upsert({
        where: { name: `${clubName} ${category} Club` },
        update: {},
        create: {
          name: `${clubName} ${category} Club`,
          description: `A vibrant ${category.toLowerCase()} club focused on ${clubName.toLowerCase()} activities and skill development`,
          coordinatorId: coordinator.id,
        },
      });
      clubs.push(club);
    }
  }
  console.log(`✅ ${clubs.length} diverse clubs created\n`);

  // Create comprehensive events
  console.log('🎪 Creating comprehensive events...');
  const eventTypes = ['Workshop', 'Seminar', 'Competition', 'Exhibition', 'Conference', 'Hackathon', 'Cultural Show', 'Sports Meet'];
  const statuses = ['APPROVED', 'PENDING', 'APPROVED', 'APPROVED']; // More approved events
  
  for (let i = 0; i < 300; i++) {
    const club = pick(clubs);
    const eventType = pick(eventTypes);
    const startDateTime = new Date(Date.now() + randInt(-60, 120) * 24 * 60 * 60 * 1000);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + randInt(2, 8));
    
    const event = await prisma.event.create({
      data: {
        title: `${eventType} - ${club.name.split(' ')[0]} ${i + 1}`,
        description: `An exciting ${eventType.toLowerCase()} organized by ${club.name} featuring industry experts and hands-on activities`,
        startDateTime,
        endDateTime,
        location: `${pick(hallNames)} / Auditorium ${randInt(1, 5)}`,
        status: pick(statuses),
        clubId: club.id,
        createdById: club.coordinatorId,
      },
    });
    
    // Add realistic number of attendees
    const numAttendees = randInt(15, 100);
    const attendees = [...students].sort(() => 0.5 - Math.random()).slice(0, numAttendees);
    for (const attendee of attendees) {
      await prisma.eventAttendee.upsert({
        where: { eventId_userId: { eventId: event.id, userId: attendee.id } },
        update: {},
        create: { 
          eventId: event.id, 
          userId: attendee.id, 
          status: pick(['GOING', 'MAYBE', 'GOING', 'GOING']) // More going than maybe
        },
      });
    }
    
    if (i % 30 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 300 comprehensive events created\n');

  // Create attendance records
  console.log('📊 Creating attendance records...');
  const attendanceStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
  const attendanceWeights = [0.7, 0.15, 0.1, 0.05]; // 70% present, 15% absent, etc.
  
  for (let i = 0; i < 5000; i++) {
    const student = pick(students);
    const course = pick(courses);
    const date = new Date(Date.now() - randInt(1, 90) * 24 * 60 * 60 * 1000);
    const faculty = pick(faculties);
    
    // Weighted random selection for attendance status
    const rand = Math.random();
    let status = attendanceStatuses[0];
    let cumulative = 0;
    for (let j = 0; j < attendanceStatuses.length; j++) {
      cumulative += attendanceWeights[j];
      if (rand <= cumulative) {
        status = attendanceStatuses[j];
        break;
      }
    }
    
    try {
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          date,
          status,
          markedBy: faculty.id,
          notes: status === 'EXCUSED' ? 'Medical leave' : status === 'LATE' ? 'Traffic delay' : null,
        },
      });
    } catch (error) {
      // Skip duplicates
      continue;
    }
    
    if (i % 500 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 5000 attendance records created\n');

  // Create system configurations
  console.log('⚙️ Creating system configurations...');
  const configs = [
    { key: 'HALL_TICKET_EXPIRY_HOURS', value: '24', type: 'NUMBER', category: 'EXAM_SYSTEM', description: 'Hours before hall ticket expires' },
    { key: 'MAX_SEATING_CAPACITY', value: '100', type: 'NUMBER', category: 'SEATING_SYSTEM', description: 'Maximum capacity per hall' },
    { key: 'ENABLE_QR_VALIDATION', value: 'true', type: 'BOOLEAN', category: 'FEATURE_TOGGLE', description: 'Enable QR code validation' },
    { key: 'NOTIFICATION_EMAIL_ENABLED', value: 'true', type: 'BOOLEAN', category: 'NOTIFICATION', description: 'Enable email notifications' },
    { key: 'AI_RECOMMENDATION_THRESHOLD', value: '0.75', type: 'NUMBER', category: 'AI_CONFIG', description: 'Minimum confidence for AI recommendations' },
  ];
  
  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: { ...config, updatedBy: admins[0].id },
    });
  }
  console.log('✅ System configurations created\n');

  // Import student performance data if available
  console.log('📊 Importing student performance data...');
  await importStudentPerformanceData();

  console.log('\n🎉 ENHANCED SEEDING COMPLETED!\n');
  console.log('📊 Final Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Courses: ${await prisma.course.count()}`);
  console.log(`   - Exams: ${await prisma.exam.count()}`);
  console.log(`   - Rooms: ${await prisma.room.count()}`);
  console.log(`   - Seats: ${await prisma.seat.count()}`);
  console.log(`   - Seating Allocations: ${await prisma.seatingAllocation.count()}`);
  console.log(`   - Exam Seating: ${await prisma.examSeating.count()}`);
  console.log(`   - Hall Tickets: ${await prisma.hallTicket.count()}`);
  console.log(`   - Mind Maps: ${await prisma.mindMap.count()}`);
  console.log(`   - Mind Map Nodes: ${await prisma.mindMapNode.count()}`);
  console.log(`   - Clubs: ${await prisma.club.count()}`);
  console.log(`   - Events: ${await prisma.event.count()}`);
  console.log(`   - Event Attendees: ${await prisma.eventAttendee.count()}`);
  console.log(`   - Attendance Records: ${await prisma.attendance.count()}`);
  console.log(`   - Student Performance Records: ${await prisma.student.count()}`);
  console.log(`   - Grades: ${await prisma.grade.count()}`);
  console.log(`   - System Configs: ${await prisma.systemConfig.count()}`);
}

function generateSyllabusContent(courseName, semester) {
  return `# ${courseName} - Semester ${semester} Syllabus

## Course Overview
This course provides comprehensive coverage of ${courseName} concepts and applications.

## Learning Objectives
- Understand fundamental concepts of ${courseName}
- Apply theoretical knowledge to practical problems
- Develop analytical and problem-solving skills
- Gain hands-on experience through projects

## Module 1: Introduction to ${courseName}
- Basic concepts and terminology
- Historical perspective and evolution
- Current trends and applications
- Industry relevance

## Module 2: Core Concepts
- Fundamental principles
- Key algorithms and methodologies
- Mathematical foundations
- Theoretical frameworks

## Module 3: Advanced Topics
- Specialized techniques
- Optimization methods
- Performance analysis
- Case studies

## Module 4: Practical Applications
- Real-world implementations
- Project work
- Industry best practices
- Future directions

## Assessment Pattern
- Mid Semester 1: 20%
- Mid Semester 2: 20%
- End Semester: 40%
- Assignments: 10%
- Lab/Project: 10%

## Reference Materials
- Standard textbooks in ${courseName}
- Research papers and journals
- Online resources and tutorials
- Industry documentation`;
}

async function importStudentPerformanceData() {
  try {
    // Try to find student performance CSV files
    const possiblePaths = [
      '/Users/rishika/Downloads/student+performance/student/student-mat.csv',
      '/Users/rishika/Downloads/student+performance/student/student-por.csv',
      './data/student-mat.csv',
      './data/student-por.csv',
      './student-mat.csv',
      './student-por.csv'
    ];
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const subject = filePath.includes('mat') ? 'MATH' : 'PORTUGUESE';
        const data = parse(fs.readFileSync(filePath, 'utf8'), {
          columns: true,
          skip_empty_lines: true,
          delimiter: ';',
          trim: true
        });
        
        console.log(`Found ${data.length} ${subject} students in performance data`);
        await importCSVStudents(data, subject);
      }
    }
  } catch (error) {
    console.log('⚠️  Student performance CSV files not found, skipping import');
  }
}

async function importCSVStudents(students, subject) {
  let successCount = 0;
  
  for (const student of students) {
    const studentId = `PERF-${student.school}-${student.sex}-${student.age}-${Math.random().toString(36).substr(2, 6)}`;
    
    try {
      await prisma.student.upsert({
        where: { id: studentId },
        update: {},
        create: {
          id: studentId,
          school: student.school || 'GP',
          sex: student.sex || 'M',
          age: parseInt(student.age) || 18,
          address: student.address || 'U',
          famsize: student.famsize || 'GT3',
          Pstatus: student.Pstatus || 'T',
          Medu: parseInt(student.Medu) || 0,
          Fedu: parseInt(student.Fedu) || 0,
          Mjob: student.Mjob || 'other',
          Fjob: student.Fjob || 'other',
          reason: student.reason || 'course',
          guardian: student.guardian || 'mother',
          traveltime: parseInt(student.traveltime) || 1,
          studytime: parseInt(student.studytime) || 2,
          failures: parseInt(student.failures) || 0,
          schoolsup: student.schoolsup === 'yes',
          famsup: student.famsup === 'yes',
          paid: student.paid === 'yes',
          activities: student.activities === 'yes',
          nursery: student.nursery === 'yes',
          higher: student.higher === 'yes',
          internet: student.internet === 'yes',
          romantic: student.romantic === 'yes',
          famrel: parseInt(student.famrel) || 4,
          freetime: parseInt(student.freetime) || 3,
          goout: parseInt(student.goout) || 3,
          Dalc: parseInt(student.Dalc) || 1,
          Walc: parseInt(student.Walc) || 1,
          health: parseInt(student.health) || 5,
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
      // Skip duplicates or errors
      continue;
    }
  }
  
  console.log(`\n✅ Imported ${successCount} ${subject} performance records`);
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });