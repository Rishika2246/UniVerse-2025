const { PrismaClient } = require('@prisma/client');
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

// Generate realistic student performance data
function generateStudentData(index) {
  const schools = ['GP', 'MS'];
  const sexes = ['F', 'M'];
  const addresses = ['U', 'R'];
  const famsizes = ['LE3', 'GT3'];
  const pstatuses = ['T', 'A'];
  const jobs = ['teacher', 'health', 'services', 'at_home', 'other'];
  const reasons = ['home', 'reputation', 'course', 'other'];
  const guardians = ['mother', 'father', 'other'];

  return {
    id: `SYNTH-${String(index).padStart(4, '0')}`,
    school: pick(schools),
    sex: pick(sexes),
    age: randInt(15, 22),
    address: pick(addresses),
    famsize: pick(famsizes),
    Pstatus: pick(pstatuses),
    Medu: randInt(0, 4),
    Fedu: randInt(0, 4),
    Mjob: pick(jobs),
    Fjob: pick(jobs),
    reason: pick(reasons),
    guardian: pick(guardians),
    traveltime: randInt(1, 4),
    studytime: randInt(1, 4),
    failures: randInt(0, 3),
    schoolsup: Math.random() > 0.5,
    famsup: Math.random() > 0.3,
    paid: Math.random() > 0.7,
    activities: Math.random() > 0.4,
    nursery: Math.random() > 0.2,
    higher: Math.random() > 0.1,
    internet: Math.random() > 0.2,
    romantic: Math.random() > 0.6,
    famrel: randInt(1, 5),
    freetime: randInt(1, 5),
    goout: randInt(1, 5),
    Dalc: randInt(1, 5),
    Walc: randInt(1, 5),
    health: randInt(1, 5),
    absences: randInt(0, 30),
  };
}

// Generate correlated grades based on student characteristics
function generateGrades(studentData, subject) {
  // Base performance influenced by study factors
  let basePerformance = 10; // Start with middle performance
  
  // Positive factors
  if (studentData.studytime >= 3) basePerformance += 2;
  if (studentData.higher) basePerformance += 3;
  if (studentData.famsup) basePerformance += 1;
  if (studentData.schoolsup) basePerformance += 1;
  if (studentData.internet) basePerformance += 1;
  if (studentData.Medu >= 3) basePerformance += 1;
  if (studentData.Fedu >= 3) basePerformance += 1;
  
  // Negative factors
  if (studentData.failures > 0) basePerformance -= studentData.failures * 2;
  if (studentData.goout >= 4) basePerformance -= 1;
  if (studentData.Dalc >= 3) basePerformance -= 1;
  if (studentData.Walc >= 4) basePerformance -= 2;
  if (studentData.absences > 10) basePerformance -= Math.floor(studentData.absences / 10);
  if (studentData.traveltime >= 3) basePerformance -= 1;
  
  // Add some randomness
  const variation = randInt(-3, 3);
  basePerformance += variation;
  
  // Ensure within bounds
  basePerformance = Math.max(0, Math.min(20, basePerformance));
  
  // Generate progressive grades (G1 -> G2 -> G3)
  const G1 = Math.max(0, Math.min(20, basePerformance + randInt(-2, 2)));
  const G2 = Math.max(0, Math.min(20, G1 + randInt(-3, 3)));
  const G3 = Math.max(0, Math.min(20, Math.round((G1 + G2) / 2) + randInt(-2, 2)));
  
  return { G1, G2, G3 };
}

async function main() {
  console.log('🚀 Starting CSV Student Data Import and Generation...\n');
  
  let totalStudents = 0;
  let totalGrades = 0;
  
  // Try to import from actual CSV files first
  console.log('📊 Looking for student performance CSV files...');
  
  const csvPaths = [
    { path: '/Users/rishika/Downloads/student+performance/student/student-mat.csv', subject: 'MATH' },
    { path: '/Users/rishika/Downloads/student+performance/student/student-por.csv', subject: 'PORTUGUESE' },
    { path: './data/student-mat.csv', subject: 'MATH' },
    { path: './data/student-por.csv', subject: 'PORTUGUESE' },
    { path: './student-mat.csv', subject: 'MATH' },
    { path: './student-por.csv', subject: 'PORTUGUESE' },
    { path: '../student-mat.csv', subject: 'MATH' },
    { path: '../student-por.csv', subject: 'PORTUGUESE' }
  ];
  
  for (const { path: csvPath, subject } of csvPaths) {
    if (fs.existsSync(csvPath)) {
      console.log(`📁 Found ${subject} CSV file: ${csvPath}`);
      
      try {
        const csvData = parse(fs.readFileSync(csvPath, 'utf8'), {
          columns: true,
          skip_empty_lines: true,
          delimiter: ';',
          trim: true
        });
        
        console.log(`📈 Processing ${csvData.length} ${subject} student records...`);
        
        let imported = 0;
        for (const [index, row] of csvData.entries()) {
          const studentId = `CSV-${subject}-${String(index + 1).padStart(4, '0')}`;
          
          try {
            // Create student record
            await prisma.student.upsert({
              where: { id: studentId },
              update: {},
              create: {
                id: studentId,
                school: row.school || 'GP',
                sex: row.sex || 'M',
                age: parseInt(row.age) || 18,
                address: row.address || 'U',
                famsize: row.famsize || 'GT3',
                Pstatus: row.Pstatus || 'T',
                Medu: parseInt(row.Medu) || 0,
                Fedu: parseInt(row.Fedu) || 0,
                Mjob: row.Mjob || 'other',
                Fjob: row.Fjob || 'other',
                reason: row.reason || 'course',
                guardian: row.guardian || 'mother',
                traveltime: parseInt(row.traveltime) || 1,
                studytime: parseInt(row.studytime) || 2,
                failures: parseInt(row.failures) || 0,
                schoolsup: row.schoolsup === 'yes',
                famsup: row.famsup === 'yes',
                paid: row.paid === 'yes',
                activities: row.activities === 'yes',
                nursery: row.nursery === 'yes',
                higher: row.higher === 'yes',
                internet: row.internet === 'yes',
                romantic: row.romantic === 'yes',
                famrel: parseInt(row.famrel) || 4,
                freetime: parseInt(row.freetime) || 3,
                goout: parseInt(row.goout) || 3,
                Dalc: parseInt(row.Dalc) || 1,
                Walc: parseInt(row.Walc) || 1,
                health: parseInt(row.health) || 5,
                absences: parseInt(row.absences) || 0,
              },
            });
            
            // Create grade record
            await prisma.grade.create({
              data: {
                studentId: studentId,
                subject: subject,
                G1: parseInt(row.G1) || 0,
                G2: parseInt(row.G2) || 0,
                G3: parseInt(row.G3) || 0,
              },
            });
            
            imported++;
            totalStudents++;
            totalGrades++;
            
            if (imported % 50 === 0) process.stdout.write('.');
          } catch (error) {
            // Skip duplicates or invalid records
            continue;
          }
        }
        
        console.log(`\n✅ Imported ${imported} ${subject} student records from CSV`);
      } catch (error) {
        console.log(`❌ Error processing ${csvPath}: ${error.message}`);
      }
    }
  }
  
  // Generate additional synthetic student data
  console.log('\n🎲 Generating additional synthetic student performance data...');
  
  const subjects = ['MATH', 'PORTUGUESE', 'ENGLISH', 'SCIENCE', 'HISTORY', 'GEOGRAPHY'];
  const additionalStudents = 500; // Generate 500 additional students
  
  for (let i = 1; i <= additionalStudents; i++) {
    const studentData = generateStudentData(i);
    
    try {
      // Create student record
      await prisma.student.create({
        data: studentData,
      });
      totalStudents++;
      
      // Create grades for 2-4 random subjects
      const numSubjects = randInt(2, 4);
      const selectedSubjects = [...subjects].sort(() => 0.5 - Math.random()).slice(0, numSubjects);
      
      for (const subject of selectedSubjects) {
        const grades = generateGrades(studentData, subject);
        
        await prisma.grade.create({
          data: {
            studentId: studentData.id,
            subject: subject,
            G1: grades.G1,
            G2: grades.G2,
            G3: grades.G3,
          },
        });
        totalGrades++;
      }
      
      if (i % 50 === 0) process.stdout.write('.');
    } catch (error) {
      // Skip if student ID already exists
      continue;
    }
  }
  
  console.log(`\n✅ Generated ${additionalStudents} additional synthetic student records`);
  
  // Create some advanced analytics data
  console.log('\n📊 Creating advanced student analytics...');
  
  // Create performance trends
  const students = await prisma.student.findMany({ take: 100 });
  for (const student of students) {
    const grades = await prisma.grade.findMany({ where: { studentId: student.id } });
    
    for (const grade of grades) {
      // Create additional grade entries to simulate semester progression
      for (let semester = 2; semester <= 4; semester++) {
        const prevGrade = grade.G3;
        const trend = student.studytime >= 3 ? 1 : (student.failures > 0 ? -1 : 0);
        const newG1 = Math.max(0, Math.min(20, prevGrade + trend + randInt(-2, 2)));
        const newG2 = Math.max(0, Math.min(20, newG1 + randInt(-2, 2)));
        const newG3 = Math.max(0, Math.min(20, Math.round((newG1 + newG2) / 2) + randInt(-1, 1)));
        
        try {
          await prisma.grade.create({
            data: {
              studentId: student.id,
              subject: `${grade.subject}_SEM${semester}`,
              G1: newG1,
              G2: newG2,
              G3: newG3,
            },
          });
          totalGrades++;
        } catch (error) {
          // Skip duplicates
          continue;
        }
      }
    }
    
    if (students.indexOf(student) % 10 === 0) process.stdout.write('.');
  }
  
  console.log('\n✅ Advanced analytics data created');
  
  // Create performance summary statistics
  console.log('\n📈 Generating performance statistics...');
  
  const stats = await prisma.grade.groupBy({
    by: ['subject'],
    _avg: {
      G1: true,
      G2: true,
      G3: true,
    },
    _count: {
      studentId: true,
    },
  });
  
  console.log('\n📊 Performance Statistics by Subject:');
  console.log('=====================================');
  for (const stat of stats) {
    console.log(`${stat.subject}:`);
    console.log(`  Students: ${stat._count.studentId}`);
    console.log(`  Avg G1: ${stat._avg.G1?.toFixed(2) || 'N/A'}`);
    console.log(`  Avg G2: ${stat._avg.G2?.toFixed(2) || 'N/A'}`);
    console.log(`  Avg G3: ${stat._avg.G3?.toFixed(2) || 'N/A'}`);
    console.log('');
  }
  
  console.log('\n🎉 CSV STUDENT DATA IMPORT COMPLETED!\n');
  console.log('📊 Final Summary:');
  console.log(`   - Total Student Performance Records: ${totalStudents}`);
  console.log(`   - Total Grade Records: ${totalGrades}`);
  console.log(`   - Subjects Covered: ${stats.length}`);
  console.log(`   - Average Students per Subject: ${Math.round(totalGrades / stats.length)}`);
  
  // Show some sample data
  console.log('\n📋 Sample Student Data:');
  const sampleStudents = await prisma.student.findMany({ 
    take: 3,
    include: { grades: true }
  });
  
  for (const student of sampleStudents) {
    console.log(`\nStudent ID: ${student.id}`);
    console.log(`School: ${student.school}, Sex: ${student.sex}, Age: ${student.age}`);
    console.log(`Study Time: ${student.studytime}, Failures: ${student.failures}`);
    console.log(`Grades: ${student.grades.length} subjects`);
    for (const grade of student.grades.slice(0, 2)) {
      console.log(`  ${grade.subject}: G1=${grade.G1}, G2=${grade.G2}, G3=${grade.G3}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });