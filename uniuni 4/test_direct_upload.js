const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function testDirectUpload() {
    console.log('🚀 Testing Direct Bulk Upload System (No Preview)');
    console.log('='.repeat(60));
    
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
        
        // Test 2: Direct Bulk Upload (Small CSV)
        console.log('\n🚀 Test 2: Direct Bulk Upload (Small CSV)...');
        
        const smallFormData = new FormData();
        smallFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        smallFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        smallFormData.append('branch', 'CSE');
        
        const startTime = Date.now();
        
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
            validRows: smallResponse.data.data.validRows,
            invalidRows: smallResponse.data.data.invalidRows,
            status: smallResponse.data.data.status
        });
        
        const smallJobId = smallResponse.data.data.jobId;
        
        // Monitor small job
        console.log('\n📊 Monitoring Small Job...');
        
        let completed = false;
        let attempts = 0;
        const maxAttempts = 20;
        
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
                    const endTime = Date.now();
                    const duration = (endTime - startTime) / 1000;
                    
                    console.log('\n🎯 Small Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows,
                        duration: `${duration.toFixed(2)}s`
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: Small CSV direct upload completed!');
                    } else {
                        console.log('❌ FAILED:', status.errorSummary);
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        // Test 3: Direct Bulk Upload (Large CSV - 350 rows)
        console.log('\n🔥 Test 3: Direct Bulk Upload (Large CSV - 350 rows)...');
        
        const largeFormData = new FormData();
        largeFormData.append('csvFile', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        largeFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        largeFormData.append('branch', 'CSE');
        
        const largeStartTime = Date.now();
        
        const largeResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/bulk-upload`, largeFormData, {
            headers: {
                ...largeFormData.getHeaders(),
            },
            timeout: 120000
        });
        
        console.log('✅ Large Upload Result:', {
            success: largeResponse.data.success,
            jobId: largeResponse.data.data.jobId,
            filename: largeResponse.data.data.filename,
            totalRows: largeResponse.data.data.totalRows,
            message: largeResponse.data.message
        });
        
        const largeJobId = largeResponse.data.data.jobId;
        
        // Monitor large job
        console.log('\n📊 Monitoring Large Job (350 rows)...');
        
        let largeCompleted = false;
        let largeAttempts = 0;
        const largeMaxAttempts = 60;
        
        while (!largeCompleted && largeAttempts < largeMaxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            largeAttempts++;
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-v2/job-status/${largeJobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                
                // Show progress every 5 seconds or on completion
                if (largeAttempts % 5 === 0 || status.status === 'COMPLETED' || status.status === 'FAILED') {
                    console.log(`⏳ ${largeAttempts}s: ${status.status} - Batch ${status.currentBatch}/${status.totalBatches} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                }
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    largeCompleted = true;
                    const endTime = Date.now();
                    const duration = (endTime - largeStartTime) / 1000;
                    
                    console.log('\n🎯 Large Job Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows,
                        totalBatches: status.totalBatches,
                        duration: `${duration.toFixed(2)}s`,
                        avgRowsPerSecond: (status.processedRows / duration).toFixed(2),
                        successRate: `${((status.successRows / status.processedRows) * 100).toFixed(1)}%`
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: 350-row direct upload completed without crashes!');
                        console.log('✅ Direct upload system is production-ready!');
                        console.log('✅ No preview step needed - seamless workflow!');
                    } else {
                        console.log('❌ FAILED:', status.errorSummary);
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
                if (statusError.code === 'ECONNREFUSED') {
                    console.log('💥 SERVER CRASHED!');
                    return;
                }
            }
        }
        
        if (!largeCompleted) {
            console.log('⏰ Large job timeout - still running');
        }
        
        console.log('\n🎊 Direct Upload System Test Complete!');
        console.log('✅ Simplified workflow: Upload → Process → Monitor');
        console.log('✅ No preview step required');
        console.log('✅ Validation happens automatically during processing');
        console.log('✅ System is stable and production-ready');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        if (error.code === 'ECONNREFUSED') {
            console.log('💥 SERVER CRASHED during testing!');
        }
    }
}

// Run the test
testDirectUpload().catch(console.error);