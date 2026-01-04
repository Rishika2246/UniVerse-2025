const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function importStudentData() {
  try {
    // Path to your CSV files
    const mathFile = '/Users/rishika/Downloads/student+performance/student/student-mat.csv';
    const portugueseFile = '/Users/rishika/Downloads/student+performance/student/student-por.csv';

    console.log('Reading CSV files...');
    
    // Read and parse CSV files
    const mathData = parse(fs.readFileSync(mathFile, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
      trim: true
    });

    const portugueseData = parse(fs.readFileSync(portugueseFile, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
      trim: true
    });

    console.log(`Found ${mathData.length} math students and ${portugueseData.length} portuguese students`);

    // Import math students
    if (mathData.length > 0) {
      console.log('\nImporting math students...');
      await importStudents(mathData, 'MATH');
    }
    
    // Import portuguese students
    if (portugueseData.length > 0) {
      console.log('\nImporting portuguese students...');
      await importStudents(portugueseData, 'PORTUGUESE');
    }

    console.log('\n✅ Student data import completed!');
  } catch (error) {
    console.error('❌ Error in import process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importStudents(students, subject) {
  let successCount = 0;
  let errorCount = 0;
  const batchSize = 10; // Process in batches to avoid timeouts
  
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(students.length/batchSize)}...`);
    
    await Promise.all(batch.map(async (student) => {
      const studentId = `${student.school}-${student.sex}-${student.age}-${student.address}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        // First, create or update the student
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

        // Then, create the grade record
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
        if (successCount % 10 === 0) {
          process.stdout.write('.');
        }
      } catch (error) {
        errorCount++;
        console.error(`\nError importing student ${studentId}:`, error.message);
      }
    }));
  }

  console.log(`\n✅ Imported ${successCount} ${subject} students successfully with ${errorCount} errors.`);
}

// Run the import
console.log('Starting student data import...');
importStudentData()
  .catch((e) => {
    console.error('Fatal error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
