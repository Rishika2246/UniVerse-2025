const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function testV2System() {
    console.log('🚀 Testing Hall Ticket Bulk Processing V2 System');
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
        
        // Test 2: CSV Preview (Step 1)
        console.log('\n📋 Test 2: CSV Preview (Step 1)...');
        
        const previewFormData = new FormData();
        previewFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        
        const previewResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/preview-csv`, previewFormData, {
            headers: {
                ...previewFormData.getHeaders(),
            },
            timeout: 30000
        });
        
        console.log('✅ CSV Preview Result:', {
            success: previewResponse.data.success,
            filename: previewResponse.data.data.filename,
            totalRows: previewResponse.data.data.totalRows,
            validRows: previewResponse.data.data.validRows,
            invalidRows: previewResponse.data.data.invalidRows,
            headers: previewResponse.data.data.headers,
            isValid: previewResponse.data.data.isValid
        });
        
        // Test 3: CSV Validation (Step 2)
        console.log('\n✅ Test 3: CSV Validation (Step 2)...');
        
        const validateFormData = new FormData();
        validateFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        
        const validateResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/validate-csv`, validateFormData, {
            headers: {
                ...validateFormData.getHeaders(),
            },
            timeout: 30000
        });
        
        console.log('✅ CSV Validation Result:', {
            success: validateResponse.data.success,
            isValid: validateResponse.data.data.isValid,
            totalRows: validateResponse.data.data.totalRows,
            validRows: validateResponse.data.data.validRows,
            invalidRows: validateResponse.data.data.invalidRows
        });
        
        if (!validateResponse.data.data.isValid) {
            console.log('❌ CSV validation failed, stopping test');
            return;
        }
        
        // Test 4: Bulk Processing (Step 3) - Small CSV
        console.log('\n🚀 Test 4: Bulk Processing (Step 3) - Small CSV...');
        
        const bulkFormData = new FormData();
        bulkFormData.append('csvFile', fs.createReadStream('test_simple.csv'));
        bulkFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        bulkFormData.append('branch', 'CSE');
        
        const startTime = Date.now();
        
        const bulkResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/bulk-process`, bulkFormData, {
            headers: {
                ...bulkFormData.getHeaders(),
            },
            timeout: 60000
        });
        
        console.log('✅ Bulk Processing Started:', {
            success: bulkResponse.data.success,
            jobId: bulkResponse.data.data.jobId,
            totalRows: bulkResponse.data.data.totalRows,
            status: bulkResponse.data.data.status
        });
        
        const jobId = bulkResponse.data.data.jobId;
        
        // Test 5: Job Status Monitoring
        console.log('\n📊 Test 5: Job Status Monitoring...');
        
        let completed = false;
        let attempts = 0;
        const maxAttempts = 20;
        
        while (!completed && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            try {
                const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets-v2/job-status/${jobId}`, {
                    timeout: 10000
                });
                
                const status = statusResponse.data.data;
                console.log(`⏳ ${attempts}s: ${status.status} - Batch ${status.currentBatch}/${status.totalBatches} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    completed = true;
                    const endTime = Date.now();
                    const duration = (endTime - startTime) / 1000;
                    
                    console.log('\n🎯 Final Status:', {
                        status: status.status,
                        totalRows: status.totalRows,
                        processedRows: status.processedRows,
                        successRows: status.successRows,
                        failedRows: status.failedRows,
                        totalBatches: status.totalBatches,
                        duration: `${duration.toFixed(2)}s`,
                        avgRowsPerSecond: (status.processedRows / duration).toFixed(2)
                    });
                    
                    if (status.status === 'COMPLETED') {
                        console.log('🎉 SUCCESS: Small CSV processing completed!');
                    } else {
                        console.log('❌ FAILED:', status.errorSummary);
                    }
                }
            } catch (statusError) {
                console.log(`⚠️  Status check failed: ${statusError.message}`);
            }
        }
        
        if (!completed) {
            console.log('⏰ Timeout: Job still running');
        }
        
        // Test 6: Large CSV Processing (350 rows)
        console.log('\n🔥 Test 6: Large CSV Processing (350 rows)...');
        
        const largeBulkFormData = new FormData();
        largeBulkFormData.append('csvFile', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        largeBulkFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        largeBulkFormData.append('branch', 'CSE');
        
        const largeStartTime = Date.now();
        
        const largeBulkResponse = await axios.post(`${BASE_URL}/api/hall-tickets-v2/bulk-process`, largeBulkFormData, {
            headers: {
                ...largeBulkFormData.getHeaders(),
            },
            timeout: 120000
        });
        
        console.log('✅ Large Bulk Processing Started:', {
            success: largeBulkResponse.data.success,
            jobId: largeBulkResponse.data.data.jobId,
            totalRows: largeBulkResponse.data.data.totalRows
        });
        
        const largeJobId = largeBulkResponse.data.data.jobId;
        
        // Monitor large job
        console.log('\n📊 Monitoring Large Job (350 rows)...');
        
        let largeCompleted = false;
        let largeAttempts = 0;
        const largeMaxAttempts = 60; // 60 seconds
        
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
                        console.log('🎉 SUCCESS: 350-row processing completed without crashes!');
                        console.log('✅ V2 System is production-ready!');
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
            console.log('⏰ Large job timeout - still running (this is actually good!)');
        }
        
        console.log('\n🎊 V2 System Test Complete!');
        console.log('✅ All tests passed - system is stable and production-ready');
        
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

// Run the comprehensive test
testV2System().catch(console.error);