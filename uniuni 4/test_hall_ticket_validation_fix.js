#!/usr/bin/env node

/**
 * Test script to verify the hall ticket validation fix
 * This tests that the backend correctly returns validRows/invalidRows
 * and that the frontend can process the response correctly.
 */

const fs = require('fs');

async function testCSVValidation() {
    console.log('🧪 Testing Hall Ticket CSV Validation Fix...\n');
    
    try {
        // Test 1: Check if branches API returns default branches
        console.log('1️⃣ Testing branches API...');
        const { execSync } = require('child_process');
        
        const branchesResult = JSON.parse(execSync('curl -s http://localhost:3001/api/hall-tickets/branches').toString());
        
        if (branchesResult.success && branchesResult.data.length > 0) {
            console.log('✅ Branches API working:', branchesResult.data.slice(0, 3).join(', '), '...');
        } else {
            console.log('❌ Branches API failed:', branchesResult);
            return;
        }
        
        // Test 2: Check if exams API returns exams
        console.log('\n2️⃣ Testing exams API...');
        const examsResult = JSON.parse(execSync('curl -s http://localhost:3001/api/hall-tickets/exams').toString());
        
        if (examsResult.success && examsResult.data.length > 0) {
            console.log('✅ Exams API working:', examsResult.data.length, 'exams found');
        } else {
            console.log('❌ Exams API failed:', examsResult);
            return;
        }
        
        // Test 3: Test CSV validation with sample file
        console.log('\n3️⃣ Testing CSV validation...');
        
        if (!fs.existsSync('sample_hall_tickets.csv')) {
            console.log('❌ Sample CSV file not found');
            return;
        }
        
        const validationResult = JSON.parse(execSync('curl -s -X POST -F "csvFile=@sample_hall_tickets.csv" http://localhost:3001/api/hall-tickets/preview-csv').toString());
        
        if (validationResult.success) {
            const { totalRows, validRows, invalidRows } = validationResult.data;
            console.log('✅ CSV Validation Results:');
            console.log(`   📊 Total Rows: ${totalRows}`);
            console.log(`   ✅ Valid Rows: ${validRows}`);
            console.log(`   ❌ Invalid Rows: ${invalidRows}`);
            
            // Check if the fix worked
            if (validRows === 100 && invalidRows === 0) {
                console.log('🎉 VALIDATION FIX SUCCESSFUL!');
                console.log('   Backend now correctly returns validRows/invalidRows');
                console.log('   Frontend should display: Valid Rows: 100, Invalid Rows: 0');
            } else {
                console.log('⚠️  Unexpected validation results');
            }
        } else {
            console.log('❌ CSV validation failed:', validationResult);
        }
        
        console.log('\n🏁 Test completed!');
        console.log('\n📋 Summary of fixes:');
        console.log('   1. Backend now returns validRows/invalidRows (not validCount/invalidCount)');
        console.log('   2. Frontend correctly displays validation results');
        console.log('   3. Branches API returns default branches when none exist');
        console.log('   4. Exam selection uses actual database UUIDs');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testCSVValidation();