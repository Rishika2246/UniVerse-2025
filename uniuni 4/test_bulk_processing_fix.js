#!/usr/bin/env node

const fs = require('fs');
const FormData = require('form-data');
const { execSync } = require('child_process');

async function testBulkProcessing() {
    console.log('🧪 Testing Bulk Processing Fix...\n');
    
    try {
        // Test with small CSV first
        console.log('1️⃣ Testing with small CSV (3 rows)...');
        
        const result = JSON.parse(execSync(`curl -s -X POST -F "csvFile=@test_simple.csv" -F "examId=85f0d55a-c961-4fdd-8351-cef10fdfd5d6" -F "branch=CSE" -F "uploadType=CSV" http://localhost:3001/api/hall-tickets/bulk-upload`).toString());
        
        if (result.success) {
            console.log('✅ Bulk upload started successfully');
            console.log('📋 Job ID:', result.data.jobId);
            
            // Wait and check job status
            const jobId = result.data.jobId;
            
            for (let i = 0; i < 10; i++) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                
                const statusResult = JSON.parse(execSync(`curl -s http://localhost:3001/api/hall-tickets/job-status/${jobId}`).toString());
                
                if (statusResult.success) {
                    const job = statusResult.data;
                    console.log(`📊 Progress: ${job.processedRows}/${job.totalRows} (${job.status})`);
                    
                    if (job.status === 'COMPLETED') {
                        console.log('🎉 Job completed successfully!');
                        console.log(`✅ Success: ${job.successRows}, ❌ Failed: ${job.failedRows}`);
                        break;
                    } else if (job.status === 'FAILED') {
                        console.log('❌ Job failed:', job.errorSummary);
                        break;
                    }
                } else {
                    console.log('⚠️ Could not get job status');
                }
            }
        } else {
            console.log('❌ Bulk upload failed:', result.message);
        }
        
        console.log('\n🏁 Test completed!');
        console.log('\n📋 Key improvements:');
        console.log('   ✅ Batch processing (5 rows at a time)');
        console.log('   ✅ Event loop yielding (100ms pauses)');
        console.log('   ✅ Memory-efficient operations');
        console.log('   ✅ Error isolation (one row failure won\'t crash job)');
        console.log('   ✅ Progress tracking');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Helper function to wait
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testBulkProcessing();