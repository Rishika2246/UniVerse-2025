const { PrismaClient } = require('@prisma/client');
const csv = require('csv-parser');
const fs = require('fs');
const crypto = require('crypto');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const path = require('path');

const prisma = new PrismaClient();

class BulkUploadService {
    constructor() {
        this.processingJobs = new Map();
        this.uploadDir = 'uploads/bulk-upload';
        this.qrDir = 'uploads/qr-codes';
        this.pdfDir = 'uploads/hall-tickets';
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.uploadDir, this.qrDir, this.pdfDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // Stream CSV parsing for large files
    async parseCSVStream(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            const errors = [];
            let rowCount = 0;

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (record) => {
                    rowCount++;
                    
                    // Normalize column names
                    const normalizedRecord = this.normalizeRecord(record);
                    
                    // Validate row
                    const validation = this.validateRow(normalizedRecord, rowCount);
                    if (validation.isValid) {
                        results.push({ ...normalizedRecord, rowNumber: rowCount });
                    } else {
                        errors.push({
                            rowNumber: rowCount,
                            data: normalizedRecord,
                            errors: validation.errors
                        });
                    }
                })
                .on('end', () => {
                    resolve({
                        totalRows: rowCount,
                        validRows: results,
                        invalidRows: errors,
                        validCount: results.length,
                        invalidCount: errors.length
                    });
                })
                .on('error', (err) => {
                    reject(new Error(`CSV parsing error: ${err.message}`));
                });
        });
    }

    // Normalize column names
    normalizeRecord(record) {
        const normalized = {};
        Object.keys(record).forEach(key => {
            const normalizedKey = key.toLowerCase().trim();
            if (normalizedKey.includes('roll') || normalizedKey.includes('id') || normalizedKey === 'student_id') {
                normalized.student_id = record[key];
            } else if (normalizedKey.includes('exam') && normalizedKey.includes('id')) {
                normalized.exam_id = record[key];
            } else if (normalizedKey.includes('exam') && normalizedKey.includes('name')) {
                normalized.exam_name = record[key];
            } else if (normalizedKey.includes('seat') || normalizedKey.includes('number')) {
                normalized.seat_number = record[key];
            } else if (normalizedKey.includes('hall') || normalizedKey.includes('venue')) {
                normalized.hall_name = record[key];
            } else if (normalizedKey.includes('date')) {
                normalized.exam_date = record[key];
            } else if (normalizedKey.includes('time')) {
                normalized.exam_time = record[key];
            } else if (normalizedKey.includes('department') || normalizedKey.includes('branch')) {
                normalized.department = record[key];
            } else if (normalizedKey.includes('gate')) {
                normalized.gate = record[key];
            } else if (normalizedKey.includes('block')) {
                normalized.block = record[key];
            } else if (normalizedKey.includes('invigilator')) {
                normalized.invigilator_name = record[key];
            } else {
                normalized[normalizedKey] = record[key];
            }
        });
        return normalized;
    }

    // Validate individual CSV row
    validateRow(record, rowNumber) {
        const errors = [];
        
        // Check for roll number/student ID (required)
        if (!record.student_id || record.student_id.trim() === '') {
            errors.push('Missing required field: student_id or roll number');
        }
        
        // Check for exam ID (required)
        if (!record.exam_id || record.exam_id.trim() === '') {
            errors.push('Missing required field: exam_id');
        }
        
        // Check for seat number (required)
        if (!record.seat_number || record.seat_number.trim() === '') {
            errors.push('Missing required field: seat_number');
        }
        
        // Check for hall name (required)
        if (!record.hall_name || record.hall_name.trim() === '') {
            errors.push('Missing required field: hall_name');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Create bulk upload job
    async createBulkUploadJob(filename, totalRows, examId, branch, uploadedBy) {
        try {
            // Get or create exam session name
            let examSession = `Exam-${examId}`;
            const exam = await prisma.exam.findUnique({
                where: { id: examId },
                include: { course: true }
            });
            
            if (exam) {
                examSession = `${exam.course.code}-${exam.examType}`;
            }

            // Check if user exists
            let uploader = await prisma.user.findUnique({
                where: { id: uploadedBy }
            });

            if (!uploader) {
                throw new Error(`Uploader user with ID ${uploadedBy} not found`);
            }

            return await prisma.bulkUploadJob.create({
                data: {
                    id: crypto.randomUUID(),
                    filename,
                    totalRows,
                    examSession,
                    uploadedBy: uploader.id,
                    uploadType: 'HALL_TICKET_CSV',
                    branch,
                    examId,
                    status: 'PROCESSING',
                    startedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error creating bulk upload job:', error);
            throw error;
        }
    }

    // Process bulk upload with background job simulation
    async processBulkUpload(jobId, validRows, examId, branch) {
        const job = await prisma.bulkUploadJob.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            throw new Error('Job not found');
        }

        let successCount = 0;
        let failedCount = 0;

        try {
            // Process in batches for better performance
            const batchSize = 10;
            for (let i = 0; i < validRows.length; i += batchSize) {
                const batch = validRows.slice(i, i + batchSize);
                
                for (const row of batch) {
                    try {
                        await this.processHallTicketRow(row, jobId, examId, branch);
                        successCount++;
                        
                        // Log success
                        await this.createLog(jobId, row.rowNumber, row.student_id, examId, 'SUCCESS');
                        
                    } catch (error) {
                        failedCount++;
                        console.error(`Error processing row ${row.rowNumber}:`, error);
                        
                        // Log failure
                        await this.createLog(jobId, row.rowNumber, row.student_id, examId, 'FAILED', error.message);
                    }

                    // Update progress
                    await prisma.bulkUploadJob.update({
                        where: { id: jobId },
                        data: {
                            processedRows: successCount + failedCount,
                            successRows: successCount,
                            failedRows: failedCount
                        }
                    });
                }
            }

            // Complete job
            await prisma.bulkUploadJob.update({
                where: { id: jobId },
                data: {
                    status: successCount > 0 ? 'COMPLETED' : 'FAILED',
                    completedAt: new Date(),
                    deliveredCount: successCount,
                    failedCount: failedCount,
                    errorSummary: failedCount > 0 ? `${failedCount} rows failed processing` : null
                }
            });

            return {
                jobId,
                totalProcessed: successCount + failedCount,
                successCount,
                failedCount
            };

        } catch (error) {
            // Mark job as failed
            await prisma.bulkUploadJob.update({
                where: { id: jobId },
                data: {
                    status: 'FAILED',
                    completedAt: new Date(),
                    errorSummary: `Job failed: ${error.message}`
                }
            });
            throw error;
        }
    }

    // Process individual hall ticket row
    async processHallTicketRow(row, jobId, examId, branch) {
        try {
            // Find student by roll number
            const student = await prisma.user.findFirst({
                where: {
                    rollNo: row.student_id.toString().trim(),
                    roles: {
                        some: {
                            role: { name: 'STUDENT' }
                        }
                    }
                }
            });

            if (!student) {
                throw new Error(`Student with roll number ${row.student_id} not found`);
            }

            // Check if hall ticket already exists
            const existingTicket = await prisma.hallTicket.findFirst({
                where: {
                    studentId: student.id,
                    examId: examId
                }
            });

            if (existingTicket) {
                throw new Error(`Hall ticket already exists for student ${student.rollNo}`);
            }

            // Check seat uniqueness within same exam and hall
            const existingSeat = await prisma.hallTicket.findFirst({
                where: {
                    examId: examId,
                    hallName: row.hall_name,
                    seatNumber: row.seat_number
                }
            });

            if (existingSeat) {
                throw new Error(`Seat ${row.seat_number} in ${row.hall_name} already assigned`);
            }

            // Generate QR token
            const qrToken = this.generateQRToken();

            // Create hall ticket
            const hallTicket = await prisma.hallTicket.create({
                data: {
                    studentId: student.id,
                    examId: examId,
                    hallTicketNumber: `${student.rollNo}-${examId}-${qrToken.substring(0, 8)}`,
                    examSession: row.exam_session || 'Regular',
                    seatNumber: row.seat_number,
                    hallName: row.hall_name,
                    examDate: row.exam_date ? new Date(row.exam_date) : null,
                    examTime: row.exam_time,
                    qrToken: qrToken,
                    gate: row.gate || null,
                    block: row.block || null,
                    invigilatorName: row.invigilator_name || null,
                    bulkUploadJobId: jobId,
                    branch: branch,
                    status: 'ACTIVE',
                    deliveryStatus: 'DELIVERED',
                    deliveredAt: new Date()
                }
            });

            // Generate QR code and PDF asynchronously
            setTimeout(async () => {
                try {
                    await this.generateQRCodeAndPDF(hallTicket.id, student);
                } catch (error) {
                    console.error(`Error generating files for hall ticket ${hallTicket.id}:`, error);
                }
            }, 0);

            return hallTicket;

        } catch (error) {
            throw error;
        }
    }

    // Generate QR code and PDF
    async generateQRCodeAndPDF(hallTicketId, student) {
        try {
            const hallTicket = await prisma.hallTicket.findUnique({
                where: { id: hallTicketId },
                include: {
                    exam: {
                        include: {
                            course: true
                        }
                    }
                }
            });

            if (!hallTicket) {
                throw new Error('Hall ticket not found');
            }

            // Generate QR code
            const qrData = {
                hallTicketId: hallTicket.id,
                studentId: student.id,
                rollNo: student.rollNo,
                examId: hallTicket.examId,
                timestamp: new Date().toISOString()
            };

            const qrImagePath = await this.generateQRImage(hallTicket.qrToken, JSON.stringify(qrData));

            // Generate PDF
            const pdfPath = await this.generateHallTicketPDF(hallTicket, student);

            // Update hall ticket with file paths
            await prisma.hallTicket.update({
                where: { id: hallTicketId },
                data: {
                    qrImagePath,
                    pdfPath
                }
            });

        } catch (error) {
            console.error('Error generating QR code and PDF:', error);
        }
    }

    // Generate QR image
    async generateQRImage(qrToken, qrData) {
        const filename = `${qrToken}.png`;
        const filePath = path.join(this.qrDir, filename);

        try {
            await QRCode.toFile(filePath, qrData, {
                errorCorrectionLevel: 'M',
                type: 'png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return `/uploads/qr-codes/${filename}`;
        } catch (error) {
            console.error('Error generating QR image:', error);
            return null;
        }
    }

    // Generate hall ticket PDF
    async generateHallTicketPDF(hallTicket, student) {
        const filename = `hall-ticket-${hallTicket.qrToken}.pdf`;
        const filePath = path.join(this.pdfDir, filename);

        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        try {
            // Get exam details
            const exam = await prisma.exam.findUnique({
                where: { id: hallTicket.examId },
                include: { course: true }
            });

            // Header
            doc.fontSize(24).fillColor('#1e40af').text('UNIVERSITY HALL TICKET', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(18).fillColor('#374151').text(exam?.course?.name || 'Examination', { align: 'center' });
            doc.moveDown(1);

            // Student Information
            doc.fontSize(16).fillColor('#1f2937').text('STUDENT INFORMATION', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Student Name: ${student.fullName}`);
            doc.text(`Roll Number: ${student.rollNo}`);
            doc.text(`Hall Ticket Number: ${hallTicket.hallTicketNumber}`);
            doc.moveDown(1);

            // Exam Details
            if (exam) {
                doc.fontSize(16).fillColor('#1f2937').text('EXAMINATION DETAILS', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12).fillColor('#374151');
                doc.text(`Subject: ${exam.course.name}`);
                doc.text(`Course Code: ${exam.course.code}`);
                doc.text(`Exam Type: ${exam.examType}`);
                doc.moveDown(1);
            }

            // Venue Information
            doc.fontSize(16).fillColor('#1f2937').text('VENUE DETAILS', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#374151');
            doc.text(`Examination Hall: ${hallTicket.hallName}`);
            doc.text(`Seat Number: ${hallTicket.seatNumber}`);
            if (hallTicket.examDate) {
                doc.text(`Exam Date: ${new Date(hallTicket.examDate).toDateString()}`);
            }
            if (hallTicket.examTime) {
                doc.text(`Exam Time: ${hallTicket.examTime}`);
            }
            if (hallTicket.gate) doc.text(`Gate: ${hallTicket.gate}`);
            if (hallTicket.block) doc.text(`Block: ${hallTicket.block}`);
            doc.moveDown(2);

            // Footer
            doc.fontSize(10).fillColor('#6b7280').text('Generated by University Examination System', { align: 'center' });
            doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.text(`Ticket ID: ${hallTicket.qrToken}`, { align: 'center' });

            doc.end();

            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    resolve(`/uploads/hall-tickets/${filename}`);
                });
                writeStream.on('error', reject);
            });

        } catch (error) {
            doc.end();
            writeStream.end();
            throw error;
        }
    }

    // Create processing log
    async createLog(jobId, rowNumber, studentId, examId, status, errorMessage = null) {
        return await prisma.bulkUploadLog.create({
            data: {
                bulkUploadJobId: jobId,
                rowNumber,
                studentId: studentId,
                examId: examId,
                status,
                errorMessage
            }
        });
    }

    // Get job status
    async getJobStatus(jobId) {
        const job = await prisma.bulkUploadJob.findUnique({
            where: { id: jobId },
            include: {
                logs: {
                    orderBy: { rowNumber: 'asc' },
                    take: 10
                }
            }
        });

        if (!job) {
            throw new Error('Job not found');
        }

        const progress = job.totalRows > 0 ? (job.processedRows / job.totalRows) * 100 : 0;
        
        return {
            ...job,
            progress,
            recentLogs: job.logs
        };
    }

    // Get failed rows for download
    async getFailedRows(jobId) {
        const logs = await prisma.bulkUploadLog.findMany({
            where: {
                bulkUploadJobId: jobId,
                status: 'FAILED'
            },
            orderBy: { rowNumber: 'asc' }
        });

        return logs.map(log => ({
            rowNumber: log.rowNumber,
            studentId: log.studentId,
            examId: log.examId,
            error: log.errorMessage
        }));
    }

    // Get exams
    async getExams() {
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
            orderBy: {
                examDate: 'desc'
            }
        });
        
        return exams;
    }

    // Get branches
    async getBranches() {
        const distinctBranches = await prisma.hallTicket.findMany({
            select: {
                branch: true
            },
            distinct: ['branch']
        });
        
        return distinctBranches.map(b => b.branch).filter(b => b);
    }

    // Get student hall tickets
    async getStudentHallTickets(studentId) {
        return await prisma.hallTicket.findMany({
            where: {
                studentId,
                deliveryStatus: {
                    in: ['DELIVERED', 'ACKNOWLEDGED']
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
    }

    // Get hall ticket
    async getHallTicket(hallTicketId, studentId) {
        return await prisma.hallTicket.findFirst({
            where: {
                id: hallTicketId,
                studentId
            }
        });
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
                }
            }
        });

        const total = hallTickets.length;
        const delivered = hallTickets.filter(t => t.deliveryStatus === 'DELIVERED').length;
        const acknowledged = hallTickets.filter(t => t.deliveryStatus === 'ACKNOWLEDGED').length;
        const pending = hallTickets.filter(t => t.deliveryStatus === 'PENDING').length;
        const failed = hallTickets.filter(t => t.deliveryStatus === 'FAILED').length;

        return {
            examId,
            branch,
            total,
            delivered,
            acknowledged,
            pending,
            failed,
            hallTickets: hallTickets.map(ticket => ({
                rollNo: ticket.student?.rollNo,
                fullName: ticket.student?.fullName,
                deliveryStatus: ticket.deliveryStatus,
                hallName: ticket.hallName,
                seatNumber: ticket.seatNumber
            }))
        };
    }

    // Utility functions
    generateQRToken() {
        return crypto.randomBytes(16).toString('hex').toUpperCase();
    }

    generateSignature(studentId, examId, qrToken) {
        const data = `${studentId}:${examId}:${qrToken}`;
        return crypto.createHmac('sha256', process.env.QR_SECRET || 'default-secret').update(data).digest('hex');
    }

    async generateTempPassword() {
        return crypto.createHash('sha256').update(`temp_${Date.now()}`).digest('hex');
    }

    isValidDate(dateString) {
        try {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        } catch (error) {
            return false;
        }
    }

    isValidTime(timeString) {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(timeString);
    }
}

module.exports = new BulkUploadService();