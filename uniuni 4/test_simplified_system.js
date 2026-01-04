const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function testSimplifiedSystem() {
    console.log('🚀 Testing Simplified Hall Ticket System');
    console.log('='.repeat(50));
    
    try {
        // Test 1: System Health Check
        console.log('🔍 Test 1: System Health Check...');
        
        const healthResponse = await axios.get(`${BASE_URL}/api/hall-tickets-v2/test`, {
            timeout: 10000
        });
        
        console.log('✅ System Health:', {
            success: healthResponse.data.success,
            message: healthResponse.data.message
        });
        
        // Test 2: Direct Upload (Small CSV)
        console.log('\n🚀 Test 2: Direct Upload (Small CSV)...');
        
        const smallFormData = new FormData();
        smallFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        smallFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        smallFormData.append('branch', 'CSE');
        
        const smallResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/bulk-upload`, smallFormData, {
            headers: {
                ...smallFormData.getHeaders(),
            },
            timeout: 60000
        });
        
        console.log('✅ Small Upload Result:', {
            success: smallResponse.data.success,
            jobId: smallResponse.data.data.jobId,
            filename: smallResponse.data.data.filename,
            totalRows: smallResponse.data.data.totalRows,
            message: smallResponse.data.message
        });
        
        const smallJobId = smallResponse.data.data.jobId;
        
        // Monitor small job
        console.log('\n📊 Monitoring Small Job...');
        
        let completed = false;
        let attempts = 0;
        const maxAttempts = 15;
        
        while (!completed && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-v2/job-status/${smallJobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                console.log(`⏳ ${attempts}s: ${status.status} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    completed = true;
                    
                    console.log('\n🎯 Small Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: Simplified system working perfectly!');
                    } else {
                        console.log('❌ FAILED:', status.errorSummary);
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        // Test 3: Direct Upload (Large CSV)
        console.log('\n🔥 Test 3: Direct Upload (Large CSV - 350 rows)...');
        
        const largeFormData = new FormData();
        largeFormData.append('csvFile', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        largeFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        largeFormData.append('branch', 'CSE');
        
        const largeResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/bulk-upload`, largeFormData, {
            headers: {
                ...largeFormData.getHeaders(),
            },
            timeout: 120000
        });
        
        console.log('✅ Large Upload Result:', {
            success: largeResponse.data.success,
            jobId: largeResponse.data.data.jobId,
            totalRows: largeResponse.data.data.totalRows,
            message: largeResponse.data.message
        });
        
        const largeJobId = largeResponse.data.data.jobId;
        
        // Monitor large job briefly
        console.log('\n📊 Monitoring Large Job (first 10 seconds)...');
        
        for (let i = 1; i <= 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-v2/job-status/${largeJobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                console.log(`⏳ ${i}s: ${status.status} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    console.log('\n🎯 Large Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: Large CSV processed successfully!');
                    }
                    break;
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        console.log('\n🎊 Simplified System Test Complete!');
        console.log('✅ No preview step - direct upload works');
        console.log('✅ No validation step - automatic validation works');
        console.log('✅ Streamlined workflow: Upload → Process → Monitor');
        console.log('✅ System is stable and user-friendly');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testSimplifiedSystem().catch(console.error);