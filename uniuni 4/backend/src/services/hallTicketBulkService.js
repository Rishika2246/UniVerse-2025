const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const AdmZip = require('adm-zip');
const csv = require('csv-parser');
const intelligentLogger = require('./intelligentLogger');

const prisma = new PrismaClient();

class HallTicketBulkService {
    constructor() {
        this.processingJobs = new Map();
        this.uploadDir = 'uploads/hall-tickets-bulk';
        this.tempDir = 'uploads/temp';
        this.ensureUploadDir();
        this.ensureTempDir();
    }

    ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    // Parse CSV for preview/validation
    async parseCSVStream(filePath) {
        console.log('parseCSVStream called for:', filePath);
        
        return new Promise((resolve, reject) => {
            const results = {
                totalRows: 0,
                validRows: [],
                invalidRows: [],
                validCount: 0,
                invalidCount: 0
            };
            
            let rowIndex = 0;
            
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    rowIndex++;
                    console.log(`Row ${rowIndex} raw data:`, data);
                    const row = this.normalizeCSVRow(data, rowIndex);
                    console.log(`Row ${rowIndex} normalized:`, row);
                    
                    // Validate required fields for hall tickets
                    // Only require rollNumber since studentName might be in different column
                    if (row.rollNumber) {
                        results.validRows.push(row);
                        results.validCount++;
                        console.log(`Row ${rowIndex}: VALID - rollNumber found: ${row.rollNumber}`);
                    } else {
                        results.invalidRows.push({
                            row: rowIndex,
                            data: row,
                            error: 'Missing required field: rollNumber/student_id'
                        });
                        results.invalidCount++;
                        console.log(`Row ${rowIndex}: INVALID - No rollNumber found. Row keys:`, Object.keys(row));
                    }
                })
                .on('end', () => {
                    results.totalRows = rowIndex;
                    console.log('CSV parsing completed:', {
                        totalRows: results.totalRows,
                        validCount: results.validCount,
                        invalidCount: results.invalidCount,
                        firstValidRow: results.validRows[0]
                    });
                    resolve(results);
                })
                .on('error', (error) => {
                    console.error('CSV stream error:', error);
                    reject(error);
                });
        });
    }

    // Normalize CSV row to standard format - FIXED for your CSV structure
    normalizeCSVRow(data, rowNumber) {
        const normalized = { __rowNumber: rowNumber };
        
        // Log the raw data keys
        console.log(`Row ${rowNumber} raw keys:`, Object.keys(data));
        
        // Check for your specific column names
        Object.keys(data).forEach(key => {
            const value = data[key] ? data[key].toString().trim() : '';
            const lowerKey = key.toLowerCase().trim();
            console.log(`Processing key: "${key}" (lower: "${lowerKey}") = "${value}"`);
            
            // Map based on your exact CSV headers
            if (lowerKey === 'student_id') {
                normalized.rollNumber = value;
                console.log(`  -> Mapped to rollNumber: ${value}`);
            } else if (lowerKey === 'student_name') {
                normalized.studentName = value;
                console.log(`  -> Mapped to studentName: ${value}`);
            } else if (lowerKey === 'exam_id') {
                normalized.examId = value;
                console.log(`  -> Mapped to examId: ${value}`);
            } else if (lowerKey === 'exam_name') {
                normalized.examName = value;
            } else if (lowerKey === 'department') {
                normalized.department = value;
            } else if (lowerKey === 'hall_name') {
                normalized.hallName = value;
            } else if (lowerKey === 'seat_number') {
                normalized.seatNumber = value;
            } else if (lowerKey === 'exam_date') {
                normalized.examDate = value;
            } else if (lowerKey === 'exam_time') {
                normalized.examTime = value;
            } else if (lowerKey === 'qr_code_id') {
                normalized.qrCode = value;
            } else if (lowerKey === 'email') {
                normalized.email = value;
            } else {
                // Keep original for debugging
                normalized[lowerKey] = value;
            }
        });
        
        // If we didn't find rollNumber in expected column, try to find it
        if (!normalized.rollNumber) {
            // Look for any value that looks like a roll number
            for (const key in data) {
                const value = data[key];
                if (value && (value.toString().includes('CBIT') || /^[A-Z0-9]{6,12}$/.test(value.toString()))) {
                    normalized.rollNumber = value.toString().trim();
                    console.log(`Found rollNumber in unexpected column "${key}": ${value}`);
                    break;
                }
            }
        }
        
        // Ensure email field exists
        if (!normalized.email && normalized.rollNumber) {
            normalized.email = `${normalized.rollNumber}@college.edu`;
        }
        
        console.log(`Row ${rowNumber} final normalized:`, normalized);
        return normalized;
    }

    // Create bulk upload job
    async createBulkUploadJob(filename, totalRows, examId, branch, uploadedBy) {
        return await prisma.bulkUploadJob.create({
            data: {
                id: crypto.randomUUID(),
                filename,
                totalRows,
                examId,
                branch,
                uploadedBy,
                status: 'PROCESSING',
                startedAt: new Date(),
                uploadType: 'CSV'
            }
        });
    }

    // Process bulk upload from CSV with batching
    async processBulkUpload(jobId, rows, examId, branch) {
        console.log(`Processing bulk upload job ${jobId} with ${rows.length} rows`);
        
        const job = await prisma.bulkUploadJob.findUnique({
            where: { id: jobId }
        });
        
        if (!job) {
            throw new Error('Job not found');
        }
        
        let processed = 0;
        let success = 0;
        let failed = 0;
        
        const BATCH_SIZE = 5; // Process 5 rows at a time
        
        // Process rows in batches
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(rows.length/BATCH_SIZE)}`);
            
            // Process batch
            for (const row of batch) {
                try {
                    await this.processCSVRow(row, examId, branch, jobId);
                    success++;
                } catch (error) {
                    failed++;
                    // Log the error
                    await prisma.bulkUploadLog.create({
                        data: {
                            bulkUploadJobId: jobId,
                            rowNumber: row.__rowNumber,
                            status: 'FAILED',
                            errorMessage: error.message,
                            processingData: JSON.stringify(row)
                        }
                    });
                    console.error(`Row ${row.__rowNumber} failed:`, error.message);
                }
                
                processed++;
            }
            
            // Update job progress after each batch
            await prisma.bulkUploadJob.update({
                where: { id: jobId },
                data: {
                    processedRows: processed,
                    successRows: success,
                    failedRows: failed
                }
            });
            
            // Yield control to event loop between batches
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms pause
            
            console.log(`Batch completed. Progress: ${processed}/${rows.length} (${success} success, ${failed} failed)`);
        }
        
        // Complete the job
        await prisma.bulkUploadJob.update({
            where: { id: jobId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                processedRows: processed,
                successRows: success,
                failedRows: failed,
                deliveredCount: success,
                failedCount: failed
            }
        });
        
        console.log(`Job ${jobId} completed: ${success} succeeded, ${failed} failed`);
    }

    // Process individual CSV row with error handling
    async processCSVRow(row, examId, branch, jobId) {
        const rollNumber = row.rollNumber;
        
        if (!rollNumber) {
            throw new Error('Roll number not found in CSV row');
        }

        // Clean roll number
        const cleanRollNumber = rollNumber.toString().trim().toUpperCase();

        try {
            // Find student by roll number
            const student = await prisma.user.findFirst({
                where: {
                    rollNo: cleanRollNumber,
                    roles: {
                        some: {
                            role: { name: 'STUDENT' }
                        }
                    }
                }
            });

            if (!student) {
                throw new Error(`Student not found for roll number: ${cleanRollNumber}`);
            }

            // Check if hall ticket already exists
            let hallTicket = await prisma.hallTicket.findFirst({
                where: {
                    studentId: student.id,
                    examId
                }
            });

            if (hallTicket) {
                // Update existing hall ticket
                hallTicket = await prisma.hallTicket.update({
                    where: { id: hallTicket.id },
                    data: {
                        deliveryStatus: 'DELIVERED',
                        branch,
                        bulkUploadJobId: jobId,
                        updatedAt: new Date(),
                        deliveredAt: new Date()
                    }
                });
            } else {
                // Create new hall ticket record
                hallTicket = await prisma.hallTicket.create({
                    data: {
                        studentId: student.id,
                        examId,
                        qrToken: crypto.randomBytes(16).toString('hex'),
                        deliveryStatus: 'DELIVERED',
                        branch,
                        bulkUploadJobId: jobId,
                        deliveredAt: new Date()
                    }
                });
            }

            console.log(`✓ Row ${row.__rowNumber}: ${cleanRollNumber}`);
            return {
                success: true,
                hallTicketId: hallTicket.id,
                studentId: student.id,
                rollNumber: cleanRollNumber
            };
        } catch (error) {
            console.error(`✗ Row ${row.__rowNumber}: ${cleanRollNumber} - ${error.message}`);
            throw error;
        }
    }

    // Process bulk hall ticket upload (files or CSV)
    async processBulkHallTicketUpload(files, examId, branch, uploadedBy, uploadType = 'FILES') {
        console.log('processBulkHallTicketUpload called:', {
            fileCount: files.length,
            examId,
            branch,
            uploadType
        });

        const jobId = crypto.randomUUID();
        
        try {
            // Validate inputs
            if (!examId || !branch || !uploadedBy) {
                throw new Error('Missing required parameters: examId, branch, or uploadedBy');
            }

            // Verify exam exists
            const exam = await prisma.exam.findUnique({
                where: { id: examId }
            });

            if (!exam) {
                throw new Error(`Exam with ID ${examId} not found`);
            }

            // Create bulk upload job
            const job = await prisma.bulkUploadJob.create({
                data: {
                    id: jobId,
                    filename: `bulk-hall-tickets-${branch}-${Date.now()}`,
                    totalRows: files.length,
                    examSession: `Exam-${examId}`,
                    uploadedBy,
                    uploadType: uploadType === 'CSV' ? 'CSV' : 'HALL_TICKET_FILES',
                    branch,
                    examId,
                    status: 'PROCESSING',
                    startedAt: new Date()
                }
            });

            console.log(`Created job ${jobId} for ${files.length} files`);

            // Process based on upload type
            if (uploadType === 'CSV') {
                // Find CSV file
                const csvFile = files.find(file => 
                    file.mimetype === 'text/csv' || 
                    file.originalname.endsWith('.csv')
                );

                if (!csvFile) {
                    throw new Error('No CSV file found in upload');
                }

                console.log(`Processing CSV file: ${csvFile.originalname}`);

                // Parse and process CSV
                const csvData = await this.parseCSVStream(csvFile.path);
                console.log(`CSV parsed: ${csvData.validRows.length} valid rows`);
                
                // Process in background with error handling
                setImmediate(async () => {
                    try {
                        console.log(`🚀 Starting background processing for job ${jobId}`);
                        await this.processBulkUpload(jobId, csvData.validRows, examId, branch);
                        console.log(`✅ Job ${jobId} completed successfully`);
                    } catch (error) {
                        console.error(`❌ Job ${jobId} failed:`, error);
                        // Mark job as failed
                        try {
                            await prisma.bulkUploadJob.update({
                                where: { id: jobId },
                                data: {
                                    status: 'FAILED',
                                    completedAt: new Date(),
                                    errorSummary: error.message
                                }
                            });
                        } catch (updateError) {
                            console.error('Failed to update job status:', updateError);
                        }
                    }
                });

            } else {
                // Process hall ticket files in background
                setTimeout(async () => {
                    try {
                        await this.processHallTicketFiles(jobId, files, examId, branch);
                    } catch (error) {
                        console.error('Background processing error:', error);
                    }
                }, 0);
            }

            return {
                success: true,
                jobId,
                message: `Started processing ${files.length} ${uploadType === 'CSV' ? 'CSV rows' : 'hall ticket files'} for ${branch} branch`
            };

        } catch (error) {
            console.error('Bulk hall ticket upload failed:', error);

            // Clean up uploaded files on error
            files.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (cleanupError) {
                    console.error('Failed to clean up file:', cleanupError.message);
                }
            });

            throw new Error(`Failed to start bulk upload: ${error.message}`);
        }
    }

    // The rest of your methods remain the same...
    // Get exams for dropdown
    async getExams() {
        try {
            const exams = await prisma.exam.findMany({
                select: {
                    id: true,
                    examType: true,
                    examDate: true,
                    course: {
                        select: {
                            name: true,
                            code: true,
                            department: true
                        }
                    }
                },
                where: {
                    examDate: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                },
                orderBy: {
                    examDate: 'desc'
                }
            });

            return exams;
        } catch (error) {
            console.error('Failed to get exams:', error);
            throw new Error(`Failed to get exams: ${error.message}`);
        }
    }

    // Get branches for dropdown
    async getBranches() {
        try {
            const distinctBranches = await prisma.hallTicket.findMany({
                select: {
                    branch: true
                },
                where: {
                    branch: {
                        not: null
                    }
                },
                distinct: ['branch'],
                orderBy: {
                    branch: 'asc'
                }
            });

            const branches = distinctBranches.map(b => b.branch).filter(b => b);
            
            // If no branches found, return default branches
            if (branches.length === 0) {
                return ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'BIO', 'CHEM', 'MATH', 'PHY'];
            }
            
            return branches;
        } catch (error) {
            console.error('Failed to get branches:', error);
            throw new Error(`Failed to get branches: ${error.message}`);
        }
    }

    // Get student hall tickets
    async getStudentHallTickets(studentId) {
        try {
            const tickets = await prisma.hallTicket.findMany({
                where: {
                    studentId,
                    deliveryStatus: {
                        in: ['DELIVERED', 'ACKNOWLEDGED']
                    },
                    pdfPath: {
                        not: null
                    }
                },
                include: {
                    exam: {
                        select: {
                            examType: true,
                            examDate: true,
                            course: {
                                select: {
                                    name: true,
                                    code: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    exam: {
                        examDate: 'desc'
                    }
                }
            });

            return tickets.map(ticket => ({
                id: ticket.id,
                examType: ticket.exam.examType,
                examDate: ticket.exam.examDate,
                courseName: ticket.exam.course.name,
                courseCode: ticket.exam.course.code,
                deliveryStatus: ticket.deliveryStatus,
                deliveredAt: ticket.deliveredAt,
                acknowledgedAt: ticket.acknowledgedAt,
                originalFileName: ticket.originalFileName,
                branch: ticket.branch,
                hasFile: !!ticket.pdfPath
            }));
        } catch (error) {
            console.error('Failed to get student hall tickets:', error);
            throw new Error(`Failed to get hall tickets: ${error.message}`);
        }
    }

    // Get hall ticket for download
    async getHallTicket(hallTicketId, studentId) {
        try {
            const ticket = await prisma.hallTicket.findFirst({
                where: {
                    id: hallTicketId,
                    studentId,
                    deliveryStatus: {
                        in: ['DELIVERED', 'ACKNOWLEDGED']
                    },
                    pdfPath: {
                        not: null
                    }
                }
            });

            return ticket;
        } catch (error) {
            console.error('Failed to get hall ticket:', error);
            throw new Error(`Failed to get hall ticket: ${error.message}`);
        }
    }

    // Get job status
    async getJobStatus(jobId) {
        const job = await prisma.bulkUploadJob.findUnique({
            where: { id: jobId },
            include: {
                logs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!job) {
            throw new Error('Job not found');
        }

        return {
            id: job.id,
            filename: job.filename,
            status: job.status,
            totalRows: job.totalRows,
            processedRows: job.processedRows,
            successRows: job.successRows,
            failedRows: job.failedRows,
            deliveredCount: job.deliveredCount,
            failedCount: job.failedCount,
            progress: job.totalRows > 0 ? (job.processedRows / job.totalRows) * 100 : 0,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            errorSummary: job.errorSummary,
            branch: job.branch,
            uploadType: job.uploadType,
            recentLogs: job.logs
        };
    }

    // Generate delivery report
    async generateDeliveryReport(examId, branch = null) {
        const whereClause = { examId };
        if (branch) {
            whereClause.branch = branch;
        }

        const hallTickets = await prisma.hallTicket.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        id: true,
                        rollNo: true,
                        fullName: true,
                        email: true
                    }
                },
                exam: {
                    select: {
                        id: true,
                        examType: true,
                        examDate: true
                    }
                }
            },
            orderBy: [
                { branch: 'asc' },
                { deliveryStatus: 'asc' },
                { student: { rollNo: 'asc' } }
            ]
        });

        // Group by branch and status
        const report = {};
        
        hallTickets.forEach(ticket => {
            const ticketBranch = ticket.branch || 'UNKNOWN';
            
            if (!report[ticketBranch]) {
                report[ticketBranch] = {
                    branch: ticketBranch,
                    total: 0,
                    delivered: 0,
                    failed: 0,
                    pending: 0,
                    acknowledged: 0,
                    pendingCsv: 0,
                    students: []
                };
            }

            report[ticketBranch].total++;
            report[ticketBranch].students.push({
                rollNo: ticket.student?.rollNo || 'N/A',
                fullName: ticket.student?.fullName || 'Unknown',
                email: ticket.student?.email || 'N/A',
                deliveryStatus: ticket.deliveryStatus,
                deliveredAt: ticket.deliveredAt,
                acknowledgedAt: ticket.acknowledgedAt,
                failureReason: ticket.failureReason,
                originalFileName: ticket.originalFileName,
                hasFile: !!ticket.pdfPath
            });

            switch (ticket.deliveryStatus) {
                case 'DELIVERED':
                    report[ticketBranch].delivered++;
                    break;
                case 'FAILED':
                    report[ticketBranch].failed++;
                    break;
                case 'ACKNOWLEDGED':
                    report[ticketBranch].acknowledged++;
                    break;
                case 'PENDING_CSV':
                    report[ticketBranch].pendingCsv++;
                    break;
                default:
                    report[ticketBranch].pending++;
            }
        });

        return {
            examId,
            branch,
            generatedAt: new Date(),
            summary: Object.values(report),
            totalStudents: hallTickets.length,
            overallStats: {
                delivered: hallTickets.filter(t => t.deliveryStatus === 'DELIVERED').length,
                failed: hallTickets.filter(t => t.deliveryStatus === 'FAILED').length,
                pending: hallTickets.filter(t => t.deliveryStatus === 'PENDING').length,
                acknowledged: hallTickets.filter(t => t.deliveryStatus === 'ACKNOWLEDGED').length,
                pendingCsv: hallTickets.filter(t => t.deliveryStatus === 'PENDING_CSV').length
            }
        };
    }

    // Get failed uploads
    async getFailedUploads(examId, branch = null) {
        const whereClause = {
            examId,
            deliveryStatus: 'FAILED'
        };
        
        if (branch) {
            whereClause.branch = branch;
        }

        const failedTickets = await prisma.hallTicket.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        rollNo: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                student: { rollNo: 'asc' }
            }
        });

        return failedTickets.map(ticket => ({
            id: ticket.id,
            rollNo: ticket.student?.rollNo || 'N/A',
            fullName: ticket.student?.fullName || 'Unknown',
            email: ticket.student?.email || 'N/A',
            failureReason: ticket.failureReason,
            originalFileName: ticket.originalFileName,
            branch: ticket.branch,
            createdAt: ticket.createdAt
        }));
    }

    // Acknowledge delivery
    async acknowledgeDelivery(examId, rollNumbers) {
        const students = await prisma.user.findMany({
            where: {
                rollNo: { in: rollNumbers },
                roles: {
                    some: {
                        role: { name: 'STUDENT' }
                    }
                }
            }
        });

        const studentIds = students.map(s => s.id);

        const result = await prisma.hallTicket.updateMany({
            where: {
                examId,
                studentId: { in: studentIds },
                deliveryStatus: 'DELIVERED'
            },
            data: {
                deliveryStatus: 'ACKNOWLEDGED',
                acknowledgedAt: new Date(),
                updatedAt: new Date()
            }
        });

        return {
            acknowledgedCount: result.count,
            rollNumbers: students.map(s => s.rollNo)
        };
    }
}

module.exports = new HallTicketBulkService();