// Hall Ticket Management Controller with CSV support
const HallTicketBulkService = require('../services/hallTicketBulkService');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Bulk upload hall tickets
const bulkUploadHallTickets = async (req, res) => {
    console.log('=== BULK UPLOAD STARTED ===');
    console.log('Request body:', req.body);
    console.log('Files count:', req.files?.length);
    
    try {
        const multer = require('multer');
        
        // Configure multer
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
                files: 50 // Max 50 files per upload
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes = [
                    'text/csv',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/pdf',
                    'image/jpeg',
                    'image/png'
                ];
                
                if (allowedTypes.includes(file.mimetype) || 
                    file.originalname.endsWith('.csv') ||
                    file.originalname.endsWith('.xlsx') ||
                    file.originalname.endsWith('.xls')) {
                    console.log('File accepted:', file.originalname, file.mimetype);
                    cb(null, true);
                } else {
                    console.log('File rejected:', file.originalname, file.mimetype);
                    cb(new Error(`Invalid file type: ${file.mimetype}. Only CSV, Excel, PDF, JPG, PNG allowed.`));
                }
            }
        }).array('hallTickets', 50); // Accept multiple files

        upload(req, res, async (err) => {
            if (err) {
                console.error('Multer upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
            }

            console.log('Uploaded files:', req.files.map(f => ({
                name: f.originalname,
                size: f.size,
                type: f.mimetype,
                path: f.path
            })));

            const { examId, branch, uploadType = 'CSV' } = req.body;
            const uploadedBy = req.user?.id;
            
            console.log('Processing parameters:', { examId, branch, uploadType, uploadedBy });
            
            if (!examId || !branch || !uploadedBy) {
                // Clean up uploaded files
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({
                    success: false,
                    message: 'Exam ID, branch, and authenticated user are required'
                });
            }

            try {
                // Process the upload
                const result = await HallTicketBulkService.processBulkHallTicketUpload(
                    req.files,
                    examId,
                    branch,
                    uploadedBy,
                    uploadType
                );

                console.log('Bulk upload result:', result);

                return res.json({
                    success: true,
                    message: result.message,
                    data: {
                        jobId: result.jobId,
                        totalRows: req.files.length,
                        uploadType
                    }
                });

            } catch (error) {
                console.error('Bulk upload processing error:', error);
                // Clean up files on error
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to process upload'
                });
            }
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Preview CSV file
const previewCSV = async (req, res) => {
    console.log('=== CSV PREVIEW REQUEST ===');
    
    try {
        const multer = require('multer');
        
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
                fileSize: 5 * 1024 * 1024 // 5MB
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'text/csv' || 
                    file.originalname.endsWith('.csv') ||
                    file.mimetype.includes('excel') ||
                    file.mimetype.includes('spreadsheet')) {
                    console.log('CSV preview file accepted:', file.originalname);
                    cb(null, true);
                } else {
                    console.log('CSV preview file rejected:', file.originalname, file.mimetype);
                    cb(new Error('Only CSV or Excel files are allowed'));
                }
            }
        }).single('csvFile');

        upload(req, res, async (err) => {
            if (err) {
                console.error('CSV preview upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            console.log('CSV file for preview:', {
                name: req.file.originalname,
                size: req.file.size,
                path: req.file.path
            });

            try {
                const csvResult = await HallTicketBulkService.parseCSVStream(req.file.path);
                
                console.log('CSV parse result:', {
                    totalRows: csvResult.totalRows,
                    validCount: csvResult.validCount,
                    invalidCount: csvResult.invalidCount,
                    sampleRow: csvResult.validRows[0]
                });
                
                if (csvResult.invalidCount > 0) {
                    console.log('Invalid rows (first 5):', csvResult.invalidRows.slice(0, 5));
                }
                
                // Clean up file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.json({
                    success: true,
                    data: {
                        totalRows: csvResult.totalRows,
                        validRows: csvResult.validCount,
                        invalidRows: csvResult.invalidCount,
                        preview: csvResult.validRows.slice(0, 10),
                        sampleRow: csvResult.validRows[0] || {},
                        invalidRowsPreview: csvResult.invalidRows.slice(0, 5)
                    }
                });
            } catch (error) {
                console.error('CSV preview processing error:', error);
                
                // Clean up file on error
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to parse CSV'
                });
            }
        });
    } catch (error) {
        console.error('Preview CSV error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Validate CSV endpoint
const validateCSV = async (req, res) => {
    console.log('=== CSV VALIDATION REQUEST ===');
    
    try {
        const multer = require('multer');
        
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
                fileSize: 5 * 1024 * 1024 // 5MB
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'text/csv' || 
                    file.originalname.endsWith('.csv') ||
                    file.mimetype.includes('excel') ||
                    file.mimetype.includes('spreadsheet')) {
                    console.log('Validation file accepted:', file.originalname);
                    cb(null, true);
                } else {
                    cb(new Error('Only CSV or Excel files are allowed'));
                }
            }
        }).single('csvFile');

        upload(req, res, async (err) => {
            if (err) {
                console.error('CSV validation upload error:', err);
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

            console.log('CSV file for validation:', req.file.originalname);

            try {
                const csvResult = await HallTicketBulkService.parseCSVStream(req.file.path);
                
                console.log('CSV validation result:', {
                    totalRows: csvResult.totalRows,
                    validCount: csvResult.validCount,
                    invalidCount: csvResult.invalidCount,
                    isValid: csvResult.invalidCount === 0
                });
                
                // Clean up file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.json({
                    success: true,
                    data: {
                        isValid: csvResult.invalidCount === 0,
                        totalRows: csvResult.totalRows,
                        validRows: csvResult.validCount,
                        invalidRows: csvResult.invalidCount,
                        errors: csvResult.invalidRows.slice(0, 10)
                    }
                });
            } catch (error) {
                console.error('CSV validation processing error:', error);
                
                // Clean up file on error
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to validate CSV'
                });
            }
        });
    } catch (error) {
        console.error('Validate CSV error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Get delivery report
const getDeliveryReport = async (req, res) => {
    try {
        const { examId } = req.params;
        const { branch } = req.query;
        
        if (!examId) {
            return res.status(400).json({
                success: false,
                message: 'Exam ID is required'
            });
        }

        const report = await HallTicketBulkService.generateDeliveryReport(examId, branch);
        
        return res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Delivery report error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate report'
        });
    }
};

// Get job status
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
        
        return res.json({
            success: true,
            data: jobStatus
        });
    } catch (error) {
        console.error('Job status error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get job status'
        });
    }
};

// Get failed uploads
const getFailedUploads = async (req, res) => {
    try {
        const { examId } = req.params;
        const { branch } = req.query;
        
        if (!examId) {
            return res.status(400).json({
                success: false,
                message: 'Exam ID is required'
            });
        }

        const failedUploads = await HallTicketBulkService.getFailedUploads(examId, branch);
        
        return res.json({
            success: true,
            data: failedUploads
        });
    } catch (error) {
        console.error('Failed uploads error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get failed uploads'
        });
    }
};

// Acknowledge delivery
const acknowledgeDelivery = async (req, res) => {
    try {
        const { examId } = req.params;
        const { rollNumbers } = req.body;
        
        if (!examId || !rollNumbers || !Array.isArray(rollNumbers)) {
            return res.status(400).json({
                success: false,
                message: 'Exam ID and roll numbers array are required'
            });
        }

        const result = await HallTicketBulkService.acknowledgeDelivery(examId, rollNumbers);
        
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Acknowledge delivery error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to acknowledge delivery'
        });
    }
};

// Get exams
const getExams = async (req, res) => {
    try {
        const exams = await HallTicketBulkService.getExams();
        
        return res.json({
            success: true,
            data: exams
        });
    } catch (error) {
        console.error('Get exams error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get exams'
        });
    }
};

// Get branches
const getBranches = async (req, res) => {
    try {
        const branches = await HallTicketBulkService.getBranches();
        
        return res.json({
            success: true,
            data: branches
        });
    } catch (error) {
        console.error('Get branches error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get branches'
        });
    }
};

// Get student hall tickets
const getStudentHallTickets = async (req, res) => {
    try {
        const studentId = req.user.id;
        const tickets = await HallTicketBulkService.getStudentHallTickets(studentId);
        
        return res.json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.error('Get student tickets error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get hall tickets'
        });
    }
};

// Download hall ticket
const downloadHallTicket = async (req, res) => {
    try {
        const { hallTicketId } = req.params;
        const studentId = req.user.id;
        
        const ticket = await HallTicketBulkService.getHallTicket(hallTicketId, studentId);
        
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Hall ticket not found'
            });
        }
        
        const filePath = ticket.pdfPath ? path.join(__dirname, '../..', ticket.pdfPath) : null;
        
        if (!filePath || !fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Hall ticket file not found'
            });
        }
        
        const filename = `hall-ticket-${ticket.hallTicketNumber || ticket.qrToken || ticket.studentId}.pdf`;
        res.download(filePath, filename);
        
    } catch (error) {
        console.error('Download error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to download hall ticket'
        });
    }
};

// Test CSV parsing
const testCSVParsing = async (req, res) => {
    try {
        // Test CSV parsing with a sample string matching your CSV
        const sampleCSV = `student_id,student_name,exam_id,exam_name,department,hall_name,seat_number,exam_date,exam_time,qr_code_id
CBIT001,Ananya Reddy,EX101,DBMS Mid Sem,CSE,HALL-A,A-1-1,2025-01-15,09:30,QR-CBIT001
CBIT002,Rahul Sharma,EX101,DBMS Mid Sem,CSE,HALL-A,A-1-3,2025-01-15,09:30,QR-CBIT002`;
        
        // Write to temp file
        const fs = require('fs');
        const path = require('path');
        const tempDir = 'uploads/temp';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const tempPath = path.join(tempDir, `test-${Date.now()}.csv`);
        
        fs.writeFileSync(tempPath, sampleCSV);
        
        // Parse it
        const result = await HallTicketBulkService.parseCSVStream(tempPath);
        
        // Clean up
        fs.unlinkSync(tempPath);
        
        res.json({
            success: true,
            message: 'CSV parsing test successful',
            data: result
        });
        
    } catch (error) {
        console.error('CSV test error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'CSV parsing test failed'
        });
    }
};

module.exports = {
    bulkUploadHallTickets,
    getDeliveryReport,
    getJobStatus,
    getFailedUploads,
    acknowledgeDelivery,
    getExams,
    getBranches,
    getStudentHallTickets,
    downloadHallTicket,
    previewCSV,
    validateCSV,
    testCSVParsing
};