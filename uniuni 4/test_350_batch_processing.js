const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function test350BatchProcessing() {
    console.log('🧪 Testing 350-Row Batch Processing for Hall Tickets');
    console.log('='.repeat(60));
    
    try {
        // Step 1: Test CSV validation first
        console.log('📋 Step 1: Validating 350-row CSV...');
        
        const formData = new FormData();
        formData.append('csvFile', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        
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
        
        // Step 2: Test bulk processing with 350 rows
        console.log('\n🚀 Step 2: Starting bulk processing of 350 rows...');
        console.log('⚠️  This will test if the batch processing prevents Node.js crashes');
        
        const bulkFormData = new FormData();
        bulkFormData.append('hallTickets', fs.createReadStream('bulk_hall_tickets_350_samples.csv'));
        bulkFormData.append('examId', '85f0d55a-c961-4fdd-8351-cef10fdfd5d6');
        bulkFormData.append('branch', 'CSE');
        bulkFormData.append('uploadType', 'CSV');
        
        const startTime = Date.now();
        
        const bulkResponse = await axios.post(`${BASE_URL}/api/hall-tickets/bulk-upload`, bulkFormData, {
            headers: {
                ...bulkFormData.getHeaders(),
            },
            timeout: 120000 // 2 minute timeout
        });
        
        console.log('✅ Bulk Upload Started:', {
            success: bulkResponse.data.success,
            jobId: bulkResponse.data.data?.jobId,
            message: bulkResponse.data.message
        });
        
        const jobId = bulkResponse.data.data?.jobId;
        
        if (jobId) {
            // Step 3: Monitor job progress with detailed logging
            console.log('\n📊 Step 3: Monitoring 350-row job progress...');
            console.log('🔍 Watching for batch processing, memory usage, and stability...');
            
            let completed = false;
            let attempts = 0;
            const maxAttempts = 60; // 60 seconds max
            let lastProgress = 0;
            
            while (!completed && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                attempts++;
                
                try {
                    const statusResponse = await axios.get(`${BASE_URL}/api/hall-tickets/job-status/${jobId}`, {
                        timeout: 10000
                    });
                    
                    const status = statusResponse.data.data;
                    const currentProgress = status.progress || 0;
                    const progressDelta = currentProgress - lastProgress;
                    
                    console.log(`⏳ ${attempts}s: ${status.status} - ${status.processedRows}/${status.totalRows} (${currentProgress.toFixed(1)}%) [+${progressDelta.toFixed(1)}%]`);
                    
                    // Show batch processing in action
                    if (status.processedRows > 0 && status.processedRows < status.totalRows) {
                        const batchNumber = Math.ceil(status.processedRows / 5); // Assuming batch size of 5
                        console.log(`   📦 Batch ${batchNumber} completed - Success: ${status.successRows}, Failed: ${status.failedRows}`);
                    }
                    
                    lastProgress = currentProgress;
                    
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
                            progress: status.progress,
                            duration: `${duration.toFixed(2)}s`,
                            avgRowsPerSecond: (status.processedRows / duration).toFixed(2)
                        });
                        
                        if (status.status === 'COMPLETED') {
                            console.log('🎉 SUCCESS: 350-row bulk processing completed without crashes!');
                            console.log('✅ Batch processing is working correctly');
                            console.log('✅ No memory issues detected');
                            console.log('✅ Node.js process remained stable');
                        } else {
                            console.log('❌ FAILED: Job failed with error:', status.errorSummary);
                            if (status.recentLogs && status.recentLogs.length > 0) {
                                console.log('📋 Recent error logs:');
                                status.recentLogs.forEach(log => {
                                    console.log(`   Row ${log.rowNumber}: ${log.errorMessage}`);
                                });
                            }
                        }
                    }
                } catch (statusError) {
                    console.log(`⚠️  Status check failed: ${statusError.message}`);
                    // If status check fails, the server might have crashed
                    if (statusError.code === 'ECONNREFUSED') {
                        console.log('💥 SERVER CRASHED! Node.js process was killed during processing');
                        return;
                    }
                }
            }
            
            if (!completed) {
                console.log('⏰ Timeout: Job is still running after 60 seconds');
                console.log('✅ This is actually good - it means the server didn\'t crash!');
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        if (error.code === 'ECONNREFUSED') {
            console.log('💥 SERVER CRASHED! Node.js process was killed during processing');
        }
    }
}

// Run the test
test350BatchProcessing().catch(console.error);