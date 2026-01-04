#!/usr/bin/env node

const fs = require('fs');

// Read the students data
const studentsData = JSON.parse(fs.readFileSync('backend/students_data.json', 'utf8'));

// Exam ID from database
const examId = '85f0d55a-c961-4fdd-8351-cef10fdfd5d6';
const examName = 'CSE23 MID1 Exam';
const examDate = '2025-01-25';
const examTime = '09:30';

// Hall configurations
const halls = ['HALL-A', 'HALL-B', 'HALL-C', 'HALL-D', 'HALL-E', 'HALL-F', 'HALL-G', 'HALL-H'];
const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'];

// CSV header
let csvContent = 'student_id,student_name,exam_id,exam_name,department,hall_name,seat_number,exam_date,exam_time,qr_code_id\n';

// Generate rows for each student
studentsData.forEach((student, index) => {
    const hallIndex = Math.floor(index / 50); // 50 students per hall
    const hall = halls[hallIndex % halls.length];
    const department = departments[index % departments.length];
    
    // Calculate seat position
    const rowInHall = Math.floor((index % 50) / 5) + 1;
    const seatInRow = (index % 5) + 1;
    const seatNumber = `${hall.split('-')[1]}-${rowInHall}-${seatInRow}`;
    
    // Escape student name if it contains commas
    const studentName = student.fullName.includes(',') ? `"${student.fullName}"` : student.fullName;
    
    // Create CSV row
    const row = [
        student.rollNo,
        studentName,
        examId,
        examName,
        department,
        hall,
        seatNumber,
        examDate,
        examTime,
        `QR-${student.rollNo}`
    ].join(',');
    
    csvContent += row + '\n';
});

// Write to file
fs.writeFileSync('bulk_hall_tickets_350_samples.csv', csvContent);

console.log(`✅ Generated CSV file with ${studentsData.length} students`);
console.log(`📊 File: bulk_hall_tickets_350_samples.csv`);
console.log(`🎯 Exam ID: ${examId}`);
console.log(`📅 Exam Date: ${examDate} at ${examTime}`);
console.log(`🏢 Halls: ${halls.join(', ')}`);
console.log(`🎓 Departments: ${departments.join(', ')}`);

// Show sample rows
console.log('\n📋 Sample rows:');
const lines = csvContent.split('\n');
console.log(lines[0]); // header
console.log(lines[1]); // first row
console.log(lines[2]); // second row
console.log('...');
console.log(lines[lines.length - 3]); // last row with data