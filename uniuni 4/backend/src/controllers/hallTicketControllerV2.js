const HallTicketBulkService = require('../services/hallTicketBulkServiceV2');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

/**
 * Hall Ticket Controller V2
 * Complete rewrite with clean architecture
 */

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

/**
 * Direct Bulk Processing - Upload CSV and start processing immediately
 */
const bulkUploadAndProcess = async (req, res) => {
    console.log('🚀 Direct Bulk Upload & Processing Request');
    
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
        const uploadedBy = req.user?.id;
        
        if (!examId || !branch || !uploadedBy) {
            // Clean up file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Exam ID, branch, and authenticated user are required'
            });
        }
        
        try {
            console.log(`📊 Processing bulk upload: ${req.file.originalname}, examId=${examId}, branch=${branch}`);
            
            // Parse and validate CSV
            const csvData = await HallTicketBulkService.parseAndValidateCSV(req.file.path);
            
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            
            // Check for validation errors
            if (csvData.invalidRows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `CSV validation failed: ${csvData.invalidRows.length} invalid rows out of ${csvData.totalRows}`,
                    data: {
                        totalRows: csvData.totalRows,
                        validRows: csvData.validRows.length,
                        invalidRows: csvData.invalidRows.length,
                        errors: csvData.invalidRows.slice(0, 10), // Show first 10 errors
                        filename: req.file.originalname
                    }
                });
            }
            
            // Create bulk job
            const job = await HallTicketBulkService.createBulkJob(
                csvData,
                examId,
                branch,
                uploadedBy
            );
            
            // Start processing in background
            await HallTicketBulkService.startBulkProcessing(job.id);
            
            res.json({
                success: true,
                message: `Started processing ${csvData.validRows.length} hall tickets for ${branch} branch`,
                data: {
                    jobId: job.id,
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
            console.error('Bulk processing error:', error);
            
            // Clean up file on error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to start bulk processing'
            });
        }
    });
};

/**
 * Get job status
 */
const getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }
        
        const jobStatus = await HallTicketBulkService.getJobStatus(jobId);
        
        res.json({
            success: true,
            data: jobStatus
        });
        
    } catch (error) {
        console.error('Job status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get job status'
        });
    }
};

/**
 * Get available exams
 */
const getExams = async (req, res) => {
    try {
        const exams = await HallTicketBulkService.getExams();
        
        res.json({
            success: true,
            data: exams
        });
        
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get exams'
        });
    }
};

/**
 * Get available branches
 */
const getBranches = async (req, res) => {
    try {
        const branches = await HallTicketBulkService.getBranches();
        
        res.json({
            success: true,
            data: branches
        });
        
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get branches'
        });
    }
};

/**
 * Test endpoint for development
 */
const testBulkSystem = async (req, res) => {
    try {
        // Test with sample data
        const sampleCSV = `student_id,student_name,exam_id,exam_name,department
STU001,Test Student 1,85f0d55a-c961-4fdd-8351-cef10fdfd5d6,Test Exam,CSE
STU002,Test Student 2,85f0d55a-c961-4fdd-8351-cef10fdfd5d6,Test Exam,ECE`;
        
        // Write to temp file
        const tempPath = path.join('uploads/temp', `test-${Date.now()}.csv`);
        fs.writeFileSync(tempPath, sampleCSV);
        
        // Parse it
        const csvData = await HallTicketBulkService.parseAndValidateCSV(tempPath);
        
        // Clean up
        fs.unlinkSync(tempPath);
        
        res.json({
            success: true,
            message: 'Bulk system test successful',
            data: {
                totalRows: csvData.totalRows,
                validRows: csvData.validRows.length,
                invalidRows: csvData.invalidRows.length,
                sampleData: csvData.validRows
            }
        });
        
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Test failed'
        });
    }
};

module.exports = {
    bulkUploadAndProcess,
    getJobStatus,
    getExams,
    getBranches,
    testBulkSystem
};