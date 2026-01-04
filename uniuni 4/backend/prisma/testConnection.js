const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by fetching the count of students
    const studentCount = await prisma.student.count();
    console.log(`✅ Successfully connected to the database. Found ${studentCount} students.`);
    
    // Try to create a test student
    const testStudent = await prisma.student.create({
      data: {
        id: 'test-student-1',
        school: 'GP',
        sex: 'F',
        age: 18,
        address: 'U',
        famsize: 'GT3',
        Pstatus: 'T',
        Medu: 2,
        Fedu: 2,
        Mjob: 'at_home',
        Fjob: 'services',
        reason: 'course',
        guardian: 'mother',
        traveltime: 1,
        studytime: 2,
        failures: 0,
        schoolsup: false,
        famsup: true,
        paid: false,
        activities: true,
        nursery: true,
        higher: true,
        internet: true,
        romantic: false,
        famrel: 4,
        freetime: 3,
        goout: 3,
        Dalc: 1,
        Walc: 2,
        health: 5,
        absences: 2,
      },
    });
    
    console.log('✅ Successfully created test student:', testStudent);
    
    // Create a test grade
    const testGrade = await prisma.grade.create({
      data: {
        studentId: 'test-student-1',
        subject: 'MATH',
        G1: 15,
        G2: 16,
        G3: 16,
      },
    });
    
    console.log('✅ Successfully created test grade:', testGrade);
    
  } catch (error) {
    console.error('❌ Error testing connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
