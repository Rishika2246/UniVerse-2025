const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';

async function testBatchProcessing() {
    console.log('🧪 Testing Batch Processing for Hall Tickets');
    console.log('='.repeat(50));
    
    try {
        // Step 1: Test CSV validation first
        console.log('📋 Step 1: Testing CSV validation...');
        
        const formData = new FormData();
        formData.append('csvFile', fs.createReadStream('test_simple.csv'));
        
        const validateResponse = await axios.post(`${BASE_URL}/api/hall-tickets/validate-csv`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000
        });
        
        console.log('✅ CSV Validation Result:', {
            success: validateResponse.data.success,
            totalRows: validateResponse.data.data.totalRows,
            validRows: validateResponse.data.data.validRows,
            invalidRows: validateResponse.data.data.invalidRows,
            isValid: validateResponse.data.data.isValid
        });
        
        if (!validateResponse.data.data.isValid) {
            console.log('❌ CSV validation failed, stopping test');
            return;
        }
        
        // Step 2: Test bulk processing
        console.log('\n🚀 Step 2: Testing bulk processing...');
        
        const bulkFormData = new FormData();
        bulkFormData.append('hallTickets', fs.createReadStream('test_simple.csv'));
        bulkFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        bulkFormData.append('branch', 'CSE');
        bulkFormData.append('uploadType', 'CSV');
        
        // In development mode, auth middleware will auto-use first student
        const bulkResponse = await axios.post(`${BASE_URL}/api/hall-tickets/bulk-upload`, bulkFormData, {
            headers: {
                ...bulkFormData.getHeaders(),
            },
            timeout: 60000 // 1 minute timeout
        });
        
        console.log('✅ Bulk Upload Started:', {
            success: bulkResponse.data.success,
            jobId: bulkResponse.data.data?.jobId,
            message: bulkResponse.data.message
        });
        
        const jobId = bulkResponse.data.data?.jobId;
        
        if (jobId) {
            // Step 3: Monitor job progress
            console.log('\n📊 Step 3: Monitoring job progress...');
            
            let completed = false;
            let attempts = 0;
            const maxAttempts = 20; // 20 seconds max
            
            while (!completed && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                attempts++;
                
                try {
                    const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets/job-status/${jobId}`, {
                        timeout: 10000
                    });
                    
                    const status = statusResponse.data.data;
                    console.log(`⏳ Attempt ${attempts}: ${status.status} - ${status.processedRows}/${status.totalRows} (${status.progress.toFixed(1)}%)`);
                    
                    if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                        completed = true;
                        console.log('\n🎯 Final Status:', {
                            status: status.status,
                            totalRows: status.totalRows,
                            processedRows: status.processedRows,
                            successRows: status.successRows,
                            failedRows: status.failedRows,
                            progress: status.progress
                        });
                        
                        if (status.status === 'COMPLETED') {
                            console.log('🎉 SUCCESS: Bulk processing completed without crashes!');
                        } else {
                            console.log('❌ FAILED: Job failed with error:', status.errorSummary);
                        }
                    }
                } catch (statusError) {
                    console.log(`⚠️  Status check failed: ${statusError.message}`);
                }
            }
            
            if (!completed) {
                console.log('⏰ Timeout: Job is still running after 20 seconds');
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testBatchProcessing().catch(console.error);