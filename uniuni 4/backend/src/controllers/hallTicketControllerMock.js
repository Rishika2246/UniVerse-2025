const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const csv = require('csv-parser');

/**
 * Mock Hall Ticket Controller
 * Simulates bulk processing without actual database operations
 */

// In-memory job storage for demo
const mockJobs = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/temp';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        
        const isValidType = allowedTypes.includes(file.mimetype);
        const isValidExtension = allowedExtensions.some(ext => 
            file.originalname.toLowerCase().endsWith(ext)
        );
        
        if (isValidType || isValidExtension) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
});

// Parse CSV and count rows
const parseCSVForMock = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = {
            totalRows: 0,
            validRows: [],
            invalidRows: []
        };
        
        let rowIndex = 0;
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                rowIndex++;
                
                // Simple validation - just check if we have some data
                const hasData = Object.values(data).some(value => value && value.toString().trim());
                
                if (hasData) {
                    results.validRows.push({
                        rowNumber: rowIndex,
                        rollNumber: data.student_id || data.roll_number || `STU${String(rowIndex).padStart(3, '0')}`,
                        studentName: data.student_name || data.name || `Student ${rowIndex}`,
                        department: data.department || data.branch || 'CSE',
                        ...data
                    });
                } else {
                    results.invalidRows.push({
                        rowNumber: rowIndex,
                        error: 'Empty or invalid row'
                    });
                }
            })
            .on('end', () => {
                results.totalRows = rowIndex;
                console.log(`Mock CSV parsing complete: ${results.validRows.length} valid, ${results.invalidRows.length} invalid`);
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Simulate processing with fake progress
const simulateProcessing = async (jobId, totalRows) => {
    const job = mockJobs.get(jobId);
    if (!job) return;
    
    const batchSize = 10;
    const totalBatches = Math.ceil(totalRows / batchSize);
    let processedRows = 0;
    
    // Simulate processing batches
    for (let batch = 1; batch <= totalBatches; batch++) {
        // Wait a bit to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        
        const batchRows = Math.min(batchSize, totalRows - processedRows);
        processedRows += batchRows;
        
        // Simulate some failures (5-10% failure rate)
        const failureRate = 0.05 + Math.random() * 0.05; // 5-10%
        const batchFailures = Math.floor(batchRows * failureRate);
        const batchSuccesses = batchRows - batchFailures;
        
        // Update job progress
        job.processedRows = processedRows;
        job.successRows += batchSuccesses;
        job.failedRows += batchFailures;
        job.progress = (processedRows / totalRows) * 100;
        job.currentBatch = batch;
        job.totalBatches = totalBatches;
        
        console.log(`Mock processing batch ${batch}/${totalBatches}: ${processedRows}/${totalRows} (${job.progress.toFixed(1)}%)`);
        
        // Update status
        if (processedRows >= totalRows) {
            job.status = 'COMPLETED';
            job.completedAt = new Date().toISOString();
            console.log(`Mock job ${jobId} completed: ${job.successRows} success, ${job.failedRows} failed`);
            break;
        }
    }
};

/**
 * Mock bulk upload and processing
 */
const mockBulkUploadAndProcess = async (req, res) => {
    console.log('🎭 Mock Bulk Upload & Processing Request');
    
    const uploadSingle = upload.single('csvFile');
    
    uploadSingle(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No CSV file uploaded'
            });
        }
        
        const { examId, branch } = req.body;
        
        if (!examId || !branch) {
            // Clean up file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Exam ID and branch are required'
            });
        }
        
        try {
            console.log(`🎭 Mock processing: ${req.file.originalname}, examId=${examId}, branch=${branch}`);
            
            // Parse CSV to get row count
            const csvData = await parseCSVForMock(req.file.path);
            
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            
            // Create mock job
            const jobId = crypto.randomUUID();
            const mockJob = {
                id: jobId,
                filename: req.file.originalname,
                status: 'PROCESSING',
                totalRows: csvData.validRows.length,
                processedRows: 0,
                successRows: 0,
                failedRows: 0,
                progress: 0,
                startedAt: new Date().toISOString(),
                completedAt: null,
                branch,
                examId,
                currentBatch: 0,
                totalBatches: Math.ceil(csvData.validRows.length / 10)
            };
            
            // Store mock job
            mockJobs.set(jobId, mockJob);
            
            // Start fake processing in background
            setImmediate(() => {
                simulateProcessing(jobId, csvData.validRows.length);
            });
            
            res.json({
                success: true,
                message: `Started mock processing ${csvData.validRows.length} hall tickets for ${branch} branch`,
                data: {
                    jobId,
                    filename: req.file.originalname,
                    totalRows: csvData.validRows.length,
                    validRows: csvData.validRows.length,
                    invalidRows: csvData.invalidRows.length,
                    status: 'PROCESSING',
                    branch,
                    examId
                }
            });
            
        } catch (error) {
            console.error('Mock processing error:', error);
            
            // Clean up file on error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to start mock processing'
            });
        }
    });
};

/**
 * Get mock job status
 */
const getMockJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }
        
        const job = mockJobs.get(jobId);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                id: job.id,
                filename: job.filename,
                status: job.status,
                totalRows: job.totalRows,
                processedRows: job.processedRows,
                successRows: job.successRows,
                failedRows: job.failedRows,
                progress: job.progress,
                startedAt: job.startedAt,
                completedAt: job.completedAt,
                branch: job.branch,
                currentBatch: job.currentBatch,
                totalBatches: job.totalBatches,
                // Mock some recent errors for demo
                recentErrors: job.failedRows > 0 ? [
                    { rowNumber: 15, rollNumber: 'STU015', error: 'Student not found in database' },
                    { rowNumber: 42, rollNumber: 'STU042', error: 'Invalid roll number format' },
                    { rowNumber: 78, rollNumber: 'STU078', error: 'Duplicate entry' }
                ].slice(0, Math.min(3, job.failedRows)) : []
            }
        });
        
    } catch (error) {
        console.error('Mock job status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get job status'
        });
    }
};

/**
 * Get mock exams
 */
const getMockExams = async (req, res) => {
    try {
        const mockExams = [
            {
                id: '85f0d55a-c961-4fdd-8351-cef10fdfd5d6',
                examType: 'MID SEMESTER',
                examDate: '2025-01-25',
                course: {
                    name: 'Database Management Systems',
                    code: 'CSE301',
                    department: 'CSE'
                }
            },
            {
                id: 'b2c4d6e8-f1a3-4b5c-9d7e-8f2a1b3c4d5e',
                examType: 'END SEMESTER',
                examDate: '2025-02-15',
                course: {
                    name: 'Data Structures and Algorithms',
                    code: 'CSE201',
                    department: 'CSE'
                }
            },
            {
                id: 'c3d5e7f9-a2b4-5c6d-8e9f-1a2b3c4d5e6f',
                examType: 'MID SEMESTER',
                examDate: '2025-01-30',
                course: {
                    name: 'Digital Electronics',
                    code: 'ECE202',
                    department: 'ECE'
                }
            }
        ];
        
        res.json({
            success: true,
            data: mockExams
        });
        
    } catch (error) {
        console.error('Mock exams error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get exams'
        });
    }
};

/**
 * Get mock branches
 */
const getMockBranches = async (req, res) => {
    try {
        const mockBranches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'BIO', 'CHEM'];
        
        res.json({
            success: true,
            data: mockBranches
        });
        
    } catch (error) {
        console.error('Mock branches error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get branches'
        });
    }
};

/**
 * Test endpoint
 */
const testMockSystem = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Mock bulk system is working perfectly!',
            data: {
                mode: 'MOCK',
                description: 'This is a demonstration system that simulates bulk processing',
                features: [
                    'CSV parsing and validation',
                    'Simulated batch processing',
                    'Fake progress tracking',
                    'Mock success/failure results'
                ]
            }
        });
        
    } catch (error) {
        console.error('Mock test error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Mock test failed'
        });
    }
};

module.exports = {
    mockBulkUploadAndProcess,
    getMockJobStatus,
    getMockExams,
    getMockBranches,
    testMockSystem
};