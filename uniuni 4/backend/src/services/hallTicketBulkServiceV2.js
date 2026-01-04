const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const csv = require('csv-parser');
const EventEmitter = require('events');

const prisma = new PrismaClient();

/**
 * Hall Ticket Bulk Processing Service V2
 * Complete rewrite with production-grade architecture
 */
class HallTicketBulkServiceV2 extends EventEmitter {
    constructor() {
        super();
        this.jobs = new Map(); // In-memory job tracking
        this.BATCH_SIZE = 10; // Process 10 rows at a time
        this.BATCH_DELAY = 200; // 200ms between batches
        this.uploadDir = 'uploads/hall-tickets-bulk';
        this.tempDir = 'uploads/temp';
        
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.uploadDir, this.tempDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * Step 1: Parse and validate CSV file
     */
    async parseAndValidateCSV(filePath) {
        console.log(`📋 Parsing CSV: ${filePath}`);
        
        return new Promise((resolve, reject) => {
            const results = {
                totalRows: 0,
                validRows: [],
                invalidRows: [],
                headers: []
            };
            
            let isFirstRow = true;
            let rowIndex = 0;
            
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('headers', (headers) => {
                    results.headers = headers;
                    console.log(`📊 CSV Headers: ${headers.join(', ')}`);
                })
                .on('data', (rawRow) => {
                    rowIndex++;
                    
                    if (isFirstRow) {
                        console.log(`🔍 Sample row data:`, rawRow);
                        isFirstRow = false;
                    }
                    
                    const normalizedRow = this.normalizeRow(rawRow, rowIndex);
                    const validation = this.validateRow(normalizedRow, rowIndex);
                    
                    if (validation.isValid) {
                        results.validRows.push(normalizedRow);
                    } else {
                        results.invalidRows.push({
                            rowNumber: rowIndex,
                            data: normalizedRow,
                            errors: validation.errors
                        });
                    }
                })
                .on('end', () => {
                    results.totalRows = rowIndex;
                    console.log(`✅ CSV parsing complete: ${results.validRows.length} valid, ${results.invalidRows.length} invalid`);
                    resolve(results);
                })
                .on('error', (error) => {
                    console.error(`❌ CSV parsing error:`, error);
                    reject(error);
                });
        });
    }

    /**
     * Normalize CSV row to standard format
     */
    normalizeRow(rawRow, rowNumber) {
        const normalized = { __rowNumber: rowNumber };
        
        // Map CSV columns to our standard format
        Object.keys(rawRow).forEach(key => {
            const value = rawRow[key] ? rawRow[key].toString().trim() : '';
            const lowerKey = key.toLowerCase().trim();
            
            switch (lowerKey) {
                case 'student_id':
                case 'roll_number':
                case 'rollnumber':
                    normalized.rollNumber = value.toUpperCase();
                    break;
                case 'student_name':
                case 'name':
                case 'full_name':
                    normalized.studentName = value;
                    break;
                case 'exam_id':
                    normalized.examId = value;
                    break;
                case 'exam_name':
                    normalized.examName = value;
                    break;
                case 'department':
                case 'branch':
                    normalized.department = value.toUpperCase();
                    break;
                case 'hall_name':
                    normalized.hallName = value;
                    break;
                case 'seat_number':
                    normalized.seatNumber = value;
                    break;
                case 'exam_date':
                    normalized.examDate = value;
                    break;
                case 'exam_time':
                    normalized.examTime = value;
                    break;
                case 'qr_code_id':
                case 'qr_code':
                    normalized.qrCode = value;
                    break;
                case 'email':
                    normalized.email = value;
                    break;
                default:
                    // Keep original for debugging
                    normalized[lowerKey] = value;
            }
        });
        
        // Generate email if missing
        if (!normalized.email && normalized.rollNumber) {
            normalized.email = `${normalized.rollNumber.toLowerCase()}@college.edu`;
        }
        
        return normalized;
    }

    /**
     * Validate individual row
     */
    validateRow(row, rowNumber) {
        const errors = [];
        
        // Required fields validation
        if (!row.rollNumber) {
            errors.push('Missing roll number');
        }
        
        // Roll number format validation
        if (row.rollNumber && !/^[A-Z0-9]{3,15}$/.test(row.rollNumber)) {
            errors.push('Invalid roll number format');
        }
        
        // Email validation
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push('Invalid email format');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Step 2: Create bulk processing job
     */
    async createBulkJob(csvData, examId, branch, uploadedBy) {
        const jobId = crypto.randomUUID();
        
        // Create job in database
        const job = await prisma.bulkUploadJob.create({
            data: {
                id: jobId,
                filename: `bulk-hall-tickets-${branch}-${Date.now()}.csv`,
                totalRows: csvData.validRows.length,
                examId,
                examSession: `Exam-${examId}`,
                branch,
                uploadedBy,
                status: 'PENDING',
                uploadType: 'CSV',
                startedAt: new Date()
            }
        });
        
        // Store job data in memory for processing
        this.jobs.set(jobId, {
            id: jobId,
            csvData,
            examId,
            branch,
            uploadedBy,
            status: 'PENDING',
            processedRows: 0,
            successRows: 0,
            failedRows: 0,
            currentBatch: 0,
            totalBatches: Math.ceil(csvData.validRows.length / this.BATCH_SIZE),
            errors: []
        });
        
        console.log(`📝 Created job ${jobId}: ${csvData.validRows.length} rows, ${this.jobs.get(jobId).totalBatches} batches`);
        
        return job;
    }

    /**
     * Step 3: Start bulk processing (async background)
     */
    async startBulkProcessing(jobId) {
        const jobData = this.jobs.get(jobId);
        if (!jobData) {
            throw new Error(`Job ${jobId} not found`);
        }
        
        console.log(`🚀 Starting bulk processing for job ${jobId}`);
        
        // Update job status to PROCESSING
        await this.updateJobStatus(jobId, 'PROCESSING');
        jobData.status = 'PROCESSING';
        
        // Start processing in background
        setImmediate(() => this.processBatches(jobId));
        
        return { jobId, status: 'PROCESSING' };
    }

    /**
     * Process rows in batches
     */
    async processBatches(jobId) {
        const jobData = this.jobs.get(jobId);
        if (!jobData) {
            console.error(`❌ Job ${jobId} not found during processing`);
            return;
        }
        
        try {
            const { csvData, examId, branch } = jobData;
            const rows = csvData.validRows;
            
            console.log(`📦 Processing ${rows.length} rows in ${jobData.totalBatches} batches`);
            
            // Process each batch
            for (let batchIndex = 0; batchIndex < jobData.totalBatches; batchIndex++) {
                const startIdx = batchIndex * this.BATCH_SIZE;
                const endIdx = Math.min(startIdx + this.BATCH_SIZE, rows.length);
                const batch = rows.slice(startIdx, endIdx);
                
                console.log(`📦 Processing batch ${batchIndex + 1}/${jobData.totalBatches} (rows ${startIdx + 1}-${endIdx})`);
                
                // Process batch
                await this.processBatch(jobId, batch, examId, branch, batchIndex + 1);
                
                // Update progress
                jobData.currentBatch = batchIndex + 1;
                jobData.processedRows = endIdx;
                
                // Update database progress
                await this.updateJobProgress(jobId, jobData.processedRows, jobData.successRows, jobData.failedRows);
                
                // Yield control to event loop
                if (batchIndex < jobData.totalBatches - 1) {
                    await this.delay(this.BATCH_DELAY);
                }
                
                // Emit progress event
                this.emit('progress', {
                    jobId,
                    batch: batchIndex + 1,
                    totalBatches: jobData.totalBatches,
                    processedRows: jobData.processedRows,
                    totalRows: rows.length,
                    successRows: jobData.successRows,
                    failedRows: jobData.failedRows
                });
            }
            
            // Complete the job
            await this.completeJob(jobId);
            
        } catch (error) {
            console.error(`❌ Batch processing failed for job ${jobId}:`, error);
            await this.failJob(jobId, error.message);
        }
    }

    /**
     * Process a single batch of rows
     */
    async processBatch(jobId, batch, examId, branch, batchNumber) {
        const jobData = this.jobs.get(jobId);
        
        for (const row of batch) {
            try {
                await this.processRow(row, examId, branch, jobId);
                jobData.successRows++;
                
            } catch (error) {
                jobData.failedRows++;
                jobData.errors.push({
                    rowNumber: row.__rowNumber,
                    rollNumber: row.rollNumber,
                    error: error.message
                });
                
                // Log error to database
                await this.logRowError(jobId, row, error.message);
                
                console.error(`❌ Row ${row.__rowNumber} (${row.rollNumber}): ${error.message}`);
            }
        }
        
        console.log(`✅ Batch ${batchNumber} complete: ${jobData.successRows} success, ${jobData.failedRows} failed`);
    }

    /**
     * Process individual row
     */
    async processRow(row, examId, branch, jobId) {
        const { rollNumber } = row;
        
        // Find student
        const student = await prisma.user.findFirst({
            where: {
                rollNo: rollNumber,
                roles: {
                    some: {
                        role: { name: 'STUDENT' }
                    }
                }
            }
        });
        
        if (!student) {
            throw new Error(`Student not found: ${rollNumber}`);
        }
        
        // Check if hall ticket already exists
        let hallTicket = await prisma.hallTicket.findFirst({
            where: {
                studentId: student.id,
                examId
            }
        });
        
        if (hallTicket) {
            // Update existing
            hallTicket = await prisma.hallTicket.update({
                where: { id: hallTicket.id },
                data: {
                    deliveryStatus: 'DELIVERED',
                    branch,
                    bulkUploadJobId: jobId,
                    deliveredAt: new Date(),
                    updatedAt: new Date()
                }
            });
        } else {
            // Create new
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
        
        return hallTicket;
    }

    /**
     * Utility methods
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async updateJobStatus(jobId, status) {
        await prisma.bulkUploadJob.update({
            where: { id: jobId },
            data: { status }
        });
    }

    async updateJobProgress(jobId, processedRows, successRows, failedRows) {
        await prisma.bulkUploadJob.update({
            where: { id: jobId },
            data: {
                processedRows,
                successRows,
                failedRows
            }
        });
    }

    async logRowError(jobId, row, errorMessage) {
        await prisma.bulkUploadLog.create({
            data: {
                bulkUploadJobId: jobId,
                rowNumber: row.__rowNumber,
                status: 'FAILED',
                errorMessage,
                processingData: JSON.stringify(row)
            }
        });
    }

    async completeJob(jobId) {
        const jobData = this.jobs.get(jobId);
        
        await prisma.bulkUploadJob.update({
            where: { id: jobId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                deliveredCount: jobData.successRows,
                failedCount: jobData.failedRows
            }
        });
        
        jobData.status = 'COMPLETED';
        
        console.log(`🎉 Job ${jobId} completed: ${jobData.successRows} success, ${jobData.failedRows} failed`);
        
        this.emit('completed', {
            jobId,
            successRows: jobData.successRows,
            failedRows: jobData.failedRows,
            totalRows: jobData.csvData.validRows.length
        });
    }

    async failJob(jobId, errorMessage) {
        await prisma.bulkUploadJob.update({
            where: { id: jobId },
            data: {
                status: 'FAILED',
                completedAt: new Date(),
                errorSummary: errorMessage
            }
        });
        
        const jobData = this.jobs.get(jobId);
        if (jobData) {
            jobData.status = 'FAILED';
        }
        
        console.log(`❌ Job ${jobId} failed: ${errorMessage}`);
        
        this.emit('failed', { jobId, error: errorMessage });
    }

    /**
     * Get job status
     */
    async getJobStatus(jobId) {
        const dbJob = await prisma.bulkUploadJob.findUnique({
            where: { id: jobId },
            include: {
                logs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
        
        if (!dbJob) {
            throw new Error('Job not found');
        }
        
        const memoryJob = this.jobs.get(jobId);
        
        return {
            id: dbJob.id,
            filename: dbJob.filename,
            status: dbJob.status,
            totalRows: dbJob.totalRows,
            processedRows: dbJob.processedRows || 0,
            successRows: dbJob.successRows || 0,
            failedRows: dbJob.failedRows || 0,
            progress: dbJob.totalRows > 0 ? (dbJob.processedRows / dbJob.totalRows) * 100 : 0,
            startedAt: dbJob.startedAt,
            completedAt: dbJob.completedAt,
            errorSummary: dbJob.errorSummary,
            branch: dbJob.branch,
            uploadType: dbJob.uploadType,
            recentLogs: dbJob.logs,
            // Memory-only data
            currentBatch: memoryJob?.currentBatch || 0,
            totalBatches: memoryJob?.totalBatches || 0,
            recentErrors: memoryJob?.errors?.slice(-5) || []
        };
    }

    /**
     * Get available exams
     */
    async getExams() {
        return await prisma.exam.findMany({
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
    }

    /**
     * Get available branches
     */
    async getBranches() {
        const distinctBranches = await prisma.hallTicket.findMany({
            select: { branch: true },
            where: { branch: { not: null } },
            distinct: ['branch'],
            orderBy: { branch: 'asc' }
        });
        
        const branches = distinctBranches.map(b => b.branch).filter(b => b);
        
        // Default branches if none found
        if (branches.length === 0) {
            return ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'BIO', 'CHEM', 'MATH', 'PHY'];
        }
        
        return branches;
    }
}

// Export singleton instance
module.exports = new HallTicketBulkServiceV2();