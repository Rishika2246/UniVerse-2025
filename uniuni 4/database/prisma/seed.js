const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const roles = ['ADMIN', 'STUDENT', 'SEATING_MANAGER', 'CLUB_COORDINATOR', 'FACULTY'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const adminHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      passwordHash: adminHash,
      fullName: 'Admin User',
      rollNo: 'ADMIN001',
      roles: { create: [{ role: { connect: { name: 'ADMIN' } } }] },
    },
  });

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const courses = [];
  for (const dept of departments) {
    for (let sem = 1; sem <= 4; sem++) {
      for (let i = 1; i <= 3; i++) {
        const code = `${dept}${sem}${i}`;
        const course = await prisma.course.upsert({
          where: { code },
          update: { name: `Course ${dept} ${sem}.${i}`, semester: sem, department: dept },
          create: { code, name: `Course ${dept} ${sem}.${i}`, semester: sem, department: dept },
        });
        courses.push(course);
        const existingSyl = await prisma.syllabus.findFirst({ where: { courseId: course.id } });
        if (!existingSyl) {
          await prisma.syllabus.create({
            data: {
              course: { connect: { id: course.id } },
              content: `Syllabus for ${course.name}`,
            },
          });
        }
      }
    }
  }

  const faculties = [];
  for (let i = 1; i <= 10; i++) {
    const email = `faculty${i}@university.edu`;
    const f = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: await bcrypt.hash('faculty123', 12),
        fullName: `Faculty ${i}`,
        rollNo: `FAC${String(i).padStart(3, '0')}`,
        roles: { create: [{ role: { connect: { name: 'FACULTY' } } }] },
      },
    });
    faculties.push(f);
  }

  const students = [];
  for (let i = 1; i <= 50; i++) {
    const email = `student${i}@university.edu`;
    const s = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: await bcrypt.hash('student123', 12),
        fullName: `Student ${i}`,
        rollNo: `STU${String(i).padStart(3, '0')}`,
        roles: { create: [{ role: { connect: { name: 'STUDENT' } } }] },
      },
    });
    students.push(s);
  }

  for (const s of students) {
    const selected = [...courses].sort(() => 0.5 - Math.random()).slice(0, 5);
    for (const c of selected) {
      await prisma.studentCourse.upsert({
        where: { studentId_courseId: { studentId: s.id, courseId: c.id } },
        update: {},
        create: { studentId: s.id, courseId: c.id },
      });
    }
  }

  const examTypes = ['MID1', 'MID2', 'END', 'QUIZ'];
  for (let i = 0; i < 20; i++) {
    const c = pick(courses);
    const examDate = new Date(Date.now() + randInt(5, 40) * 24 * 60 * 60 * 1000);
    await prisma.exam.create({
      data: {
        course: { connect: { id: c.id } },
        examType: pick(examTypes),
        examDate,
        startTime: new Date(examDate.getTime() + 10 * 60 * 60 * 1000),
        endTime: new Date(examDate.getTime() + 12 * 60 * 60 * 1000),
      },
    });
  }

  const clubNames = ['Coding Club', 'Robotics Club', 'Literary Club', 'Music Club', 'Dance Club'];
  const clubs = [];
  for (let i = 0; i < clubNames.length; i++) {
    const coord = pick(faculties);
    const club = await prisma.club.upsert({
      where: { name: clubNames[i] },
      update: { description: `Club ${clubNames[i]}`, coordinatorId: coord.id },
      create: { name: clubNames[i], description: `Club ${clubNames[i]}`, coordinator: { connect: { id: coord.id } } },
    });
    clubs.push(club);
  }

  for (let i = 0; i < 15; i++) {
    const club = pick(clubs);
    const start = new Date(Date.now() + randInt(3, 30) * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    await prisma.event.create({
      data: {
        title: `Event ${i + 1} - ${club.name}`,
        description: `Event for ${club.name}`,
        startDateTime: start,
        endDateTime: end,
        location: `Hall ${i + 1}`,
        status: i % 2 === 0 ? 'APPROVED' : 'PENDING',
        club: { connect: { id: club.id } },
        createdBy: { connect: { id: pick(faculties).id } },
      },
    });
  }

  for (let i = 1; i <= 3; i++) {
    const name = `R${i}0${i}`;
    const room = await prisma.room.upsert({
      where: { name },
      update: {},
      create: { name, capacity: 30, rows: 5, cols: 6 },
    });
    const existingSeatCount = await prisma.seat.count({ where: { roomId: room.id } });
    if (existingSeatCount === 0) {
      const seats = [];
      for (let r = 1; r <= 5; r++) {
        for (let c = 1; c <= 6; c++) {
          seats.push({ roomId: room.id, rowNumber: r, colNumber: c });
        }
      }
      await prisma.seat.createMany({ data: seats });
    }
  }

  const someStudents = students.slice(0, 10);
  const someExams = await prisma.exam.findMany({ take: 3 });
  const seatsPool = await prisma.seat.findMany({ take: 100 });
  let seatIndex = 0;
  for (const s of someStudents) {
    const e = pick(someExams);
    await prisma.hallTicket.upsert({
      where: { studentId_examId: { studentId: s.id, examId: e.id } },
      update: { qrCode: `QR-${s.rollNo}-${e.id}` },
      create: { student: { connect: { id: s.id } }, exam: { connect: { id: e.id } }, qrCode: `QR-${s.rollNo}-${e.id}` },
    });
    const seat = seatsPool[seatIndex % seatsPool.length];
    seatIndex++;
    await prisma.seatingAllocation.upsert({
      where: { examId_studentId: { examId: e.id, studentId: s.id } },
      update: { seatId: seat.id },
      create: { examId: e.id, studentId: s.id, seatId: seat.id },
    });
  }

  const someSyllabi = await prisma.syllabus.findMany({ take: 5 });
  for (let i = 0; i < 10; i++) {
    const s = pick(students);
    const sy = pick(someSyllabi);
    const mm = await prisma.mindMap.create({
      data: {
        title: `Mind Map ${i + 1}`,
        student: { connect: { id: s.id } },
        syllabus: { connect: { id: sy.id } },
      },
    });
    const root = await prisma.mindMapNode.create({
      data: { label: 'Root', orderIndex: 0, mindmap: { connect: { id: mm.id } } },
    });
    for (let j = 1; j <= 3; j++) {
      await prisma.mindMapNode.create({
        data: {
          label: `Topic ${j}`,
          orderIndex: j,
          mindmap: { connect: { id: mm.id } },
          parent: { connect: { id: root.id } },
        },
      });
    }
  }

  console.log('Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
