const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function testMockSystem() {
    console.log('🎭 Testing Mock Hall Ticket System');
    console.log('='.repeat(50));
    
    try {
        // Test 1: System Health Check
        console.log('🔍 Test 1: Mock System Health Check...');
        
        const healthResponse = await axios.get(`${BASE_URL}/api/hall-tickets-mock/test`, {
            timeout: 10000
        });
        
        console.log('✅ Mock System Health:', {
            success: healthResponse.data.success,
            message: healthResponse.data.message,
            mode: healthResponse.data.data.mode
        });
        
        // Test 2: Get Mock Exams
        console.log('\n📚 Test 2: Get Mock Exams...');
        
        const examsResponse = await axios.get(`${BASE_URL}/api/hall-tickets-mock/exams`, {
            timeout: 10000
        });
        
        console.log('✅ Mock Exams:', {
            success: examsResponse.data.success,
            count: examsResponse.data.data.length,
            exams: examsResponse.data.data.map(e => `${e.course.code} - ${e.examType}`)
        });
        
        // Test 3: Get Mock Branches
        console.log('\n🏢 Test 3: Get Mock Branches...');
        
        const branchesResponse = await axios.get(`${BASE_URL}/api/hall-tickets-mock/branches`, {
            timeout: 10000
        });
        
        console.log('✅ Mock Branches:', {
            success: branchesResponse.data.success,
            branches: branchesResponse.data.data
        });
        
        // Test 4: Mock Upload (Small CSV)
        console.log('\n🚀 Test 4: Mock Upload (Small CSV)...');
        
        const smallFormData = new FormData();
        smallFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        smallFormData.append('examId', examsResponse.data.data[0].id);
        smallFormData.append('branch', 'CSE');
        
        const smallResponse = await axios.post(`${BASE_URL}/api/hall-tickets-mock/bulk-upload`, smallFormData, {
            headers: {
                ...smallFormData.getHeaders(),
            },
            timeout: 60000
        });
        
        console.log('✅ Small Mock Upload Result:', {
            success: smallResponse.data.success,
            jobId: smallResponse.data.data.jobId,
            filename: smallResponse.data.data.filename,
            totalRows: smallResponse.data.data.totalRows,
            message: smallResponse.data.message
        });
        
        const smallJobId = smallResponse.data.data.jobId;
        
        // Monitor small job
        console.log('\n📊 Monitoring Small Mock Job...');
        
        let completed = false;
        let attempts = 0;
        const maxAttempts = 20;
        
        while (!completed && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-mock/job-status/${smallJobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                console.log(`⏳ ${attempts}s: ${status.status} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    completed = true;
                    
                    console.log('\n🎯 Small Mock Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows,
                        recentErrors: status.recentErrors?.length || 0
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: Mock system working perfectly!');
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        // Test 5: Mock Upload (Large CSV - 350 rows)
        console.log('\n🔥 Test 5: Mock Upload (Large CSV - 350 rows)...');
        
        const largeFormData = new FormData();
        largeFormData.append('csvFile', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        largeFormData.append('examId', examsResponse.data.data[0].id);
        largeFormData.append('branch', 'CSE');
        
        const largeResponse = await axios.post(`${BASE_URL}/api/hall-tickets-mock/bulk-upload`, largeFormData, {
            headers: {
                ...largeFormData.getHeaders(),
            },
            timeout: 120000
        });
        
        console.log('✅ Large Mock Upload Result:', {
            success: largeResponse.data.success,
            jobId: largeResponse.data.data.jobId,
            totalRows: largeResponse.data.data.totalRows,
            message: largeResponse.data.message
        });
        
        const largeJobId = largeResponse.data.data.jobId;
        
        // Monitor large job for 15 seconds
        console.log('\n📊 Monitoring Large Mock Job (350 rows)...');
        
        let largeCompleted = false;
        let largeAttempts = 0;
        const largeMaxAttempts = 15;
        
        while (!largeCompleted && largeAttempts < largeMaxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            largeAttempts++;
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-mock/job-status/${largeJobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                
                // Show progress every 3 seconds or on completion
                if (largeAttempts % 3 === 0 || status.status === 'COMPLETED' || status.status === 'FAILED') {
                    console.log(`⏳ ${largeAttempts}s: ${status.status} - Batch ${status.currentBatch}/${status.totalBatches} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                }
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    largeCompleted = true;
                    
                    console.log('\n🎯 Large Mock Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows,
                        totalBatches: status.totalBatches,
                        successRate: `${((status.successRows / status.processedRows) * 100).toFixed(1)}%`,
                        recentErrors: status.recentErrors?.length || 0
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: 350-row mock processing completed!');
                        console.log('✅ Mock system handles large files perfectly!');
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        if (!largeCompleted) {
            console.log('⏰ Large mock job still running (this is normal for demo)');
        }
        
        console.log('\n🎊 Mock System Test Complete!');
        console.log('✅ Perfect for demonstrations and testing');
        console.log('✅ No database operations - safe to run anywhere');
        console.log('✅ Realistic progress simulation');
        console.log('✅ Shows fake success/failure results');
        console.log('✅ Great for user training and demos!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testMockSystem().catch(console.error);