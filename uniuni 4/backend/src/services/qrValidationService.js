const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

class QRValidationService {
    // Validate QR code scan
    async validateQRScan(qrToken, scannedBy, location = null, deviceInfo = null) {
        try {
            // Find QR record
            const qrRecord = await prisma.hallTicketQr.findUnique({
                where: { qrToken },
                include: {
                    hallTicket: {
                        include: {
                            student: true,
                            exam: {
                                include: {
                                    course: true
                                }
                            }
                        }
                    }
                }
            });

            if (!qrRecord) {
                return {
                    isValid: false,
                    error: 'QR_NOT_FOUND',
                    message: 'QR code not found in system'
                };
            }

            // Check if QR is expired
            if (new Date() > qrRecord.expiresAt) {
                return {
                    isValid: false,
                    error: 'QR_EXPIRED',
                    message: 'QR code has expired'
                };
            }

            // Check if hall ticket is locked
            if (qrRecord.hallTicket.isLocked) {
                return {
                    isValid: false,
                    error: 'HALL_TICKET_LOCKED',
                    message: 'Hall ticket is locked for this exam'
                };
            }

            // Parse and validate QR data
            let qrData;
            try {
                qrData = JSON.parse(qrRecord.qrData);
            } catch (error) {
                return {
                    isValid: false,
                    error: 'INVALID_QR_DATA',
                    message: 'QR code data is corrupted'
                };
            }

            // Validate signature
            const expectedSignature = this.generateSignature(
                qrData.student_id,
                qrData.exam_id,
                qrData.hall_ticket_id
            );

            if (qrData.signature !== expectedSignature) {
                return {
                    isValid: false,
                    error: 'INVALID_SIGNATURE',
                    message: 'QR code signature is invalid - possible tampering detected'
                };
            }

            // Check for reuse (if already used and exam is single-use)
            if (qrRecord.isUsed && this.isSingleUseExam(qrRecord.hallTicket.exam)) {
                return {
                    isValid: false,
                    error: 'QR_ALREADY_USED',
                    message: 'QR code has already been used for this exam'
                };
            }

            // Check timestamp validity (not too old)
            const qrTimestamp = new Date(qrData.timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            if (new Date() - qrTimestamp > maxAge) {
                return {
                    isValid: false,
                    error: 'QR_TOO_OLD',
                    message: 'QR code timestamp is too old'
                };
            }

            // Record the scan
            const scanRecord = await prisma.qrScan.create({
                data: {
                    hallTicketId: qrRecord.hallTicket.id,
                    hallTicketQrId: qrRecord.id,
                    scannedBy,
                    location,
                    deviceInfo,
                    isValid: true
                }
            });

            // Update QR record
            await prisma.hallTicketQr.update({
                where: { id: qrRecord.id },
                data: {
                    scanCount: { increment: 1 },
                    lastScannedAt: new Date(),
                    isUsed: this.isSingleUseExam(qrRecord.hallTicket.exam),
                    usedAt: this.isSingleUseExam(qrRecord.hallTicket.exam) ? new Date() : qrRecord.usedAt
                }
            });

            return {
                isValid: true,
                scanId: scanRecord.id,
                hallTicket: {
                    id: qrRecord.hallTicket.id,
                    hallTicketNumber: qrRecord.hallTicket.hallTicketNumber,
                    student: {
                        id: qrRecord.hallTicket.student.id,
                        name: qrRecord.hallTicket.student.fullName,
                        rollNo: qrRecord.hallTicket.student.rollNo
                    },
                    exam: {
                        id: qrRecord.hallTicket.exam.id,
                        name: qrRecord.hallTicket.exam.course.name,
                        date: qrRecord.hallTicket.examDate,
                        time: qrRecord.hallTicket.examTime
                    },
                    seating: {
                        hallName: qrRecord.hallTicket.hallName,
                        seatNumber: qrRecord.hallTicket.seatNumber,
                        gate: qrRecord.hallTicket.gate,
                        block: qrRecord.hallTicket.block
                    }
                },
                scanInfo: {
                    scanCount: qrRecord.scanCount + 1,
                    firstScan: qrRecord.scanCount === 0,
                    scannedAt: new Date()
                }
            };

        } catch (error) {
            console.error('QR validation error:', error);
            
            // Record invalid scan attempt
            try {
                await prisma.qrScan.create({
                    data: {
                        hallTicketId: null,
                        hallTicketQrId: null,
                        scannedBy,
                        location,
                        deviceInfo,
                        isValid: false,
                        validationError: error.message
                    }
                });
            } catch (logError) {
                console.error('Failed to log invalid scan:', logError);
            }

            return {
                isValid: false,
                error: 'VALIDATION_ERROR',
                message: 'An error occurred during QR validation'
            };
        }
    }

    // Detect fraud attempts
    async detectFraudAttempts(timeWindow = 60000) { // 1 minute window
        const recentTime = new Date(Date.now() - timeWindow);
        
        // Multiple failed scans from same device/location
        const suspiciousScans = await prisma.qrScan.groupBy({
            by: ['deviceInfo', 'location'],
            where: {
                scannedAt: { gte: recentTime },
                isValid: false
            },
            _count: {
                id: true
            },
            having: {
                id: {
                    _count: {
                        gt: 5 // More than 5 failed attempts
                    }
                }
            }
        });

        // Rapid scanning attempts
        const rapidScans = await prisma.qrScan.findMany({
            where: {
                scannedAt: { gte: recentTime }
            },
            orderBy: { scannedAt: 'desc' },
            take: 100
        });

        const fraudAlerts = [];

        // Analyze suspicious patterns
        suspiciousScans.forEach(scan => {
            fraudAlerts.push({
                type: 'MULTIPLE_FAILED_SCANS',
                deviceInfo: scan.deviceInfo,
                location: scan.location,
                count: scan._count.id,
                severity: 'HIGH'
            });
        });

        // Check for rapid scanning (more than 10 scans per minute from same device)
        const deviceScans = {};
        rapidScans.forEach(scan => {
            if (scan.deviceInfo) {
                deviceScans[scan.deviceInfo] = (deviceScans[scan.deviceInfo] || 0) + 1;
            }
        });

        Object.entries(deviceScans).forEach(([device, count]) => {
            if (count > 10) {
                fraudAlerts.push({
                    type: 'RAPID_SCANNING',
                    deviceInfo: device,
                    count,
                    severity: 'MEDIUM'
                });
            }
        });

        return fraudAlerts;
    }

    // Get QR scan statistics
    async getQRScanStats(examId = null) {
        const whereClause = examId ? {
            hallTicket: { examId }
        } : {};

        const [totalScans, validScans, invalidScans, uniqueQRs] = await Promise.all([
            prisma.qrScan.count({ where: whereClause }),
            prisma.qrScan.count({ where: { ...whereClause, isValid: true } }),
            prisma.qrScan.count({ where: { ...whereClause, isValid: false } }),
            prisma.qrScan.groupBy({
                by: ['hallTicketQrId'],
                where: { ...whereClause, isValid: true },
                _count: { id: true }
            })
        ]);

        return {
            totalScans,
            validScans,
            invalidScans,
            uniqueQRsScanned: uniqueQRs.length,
            fraudAttempts: invalidScans,
            successRate: totalScans > 0 ? ((validScans / totalScans) * 100).toFixed(2) : 0
        };
    }

    // Get recent scan activity
    async getRecentScanActivity(limit = 50) {
        return await prisma.qrScan.findMany({
            take: limit,
            orderBy: { scannedAt: 'desc' },
            include: {
                hallTicket: {
                    include: {
                        student: true,
                        exam: {
                            include: {
                                course: true
                            }
                        }
                    }
                },
                scanner: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });
    }

    // Utility functions
    generateSignature(studentId, examId, qrToken) {
        const data = `${studentId}:${examId}:${qrToken}`;
        return crypto.createHmac('sha256', process.env.QR_SECRET || 'default-secret').update(data).digest('hex');
    }

    isSingleUseExam(exam) {
        // For now, all exams are single-use
        // This can be made configurable based on exam type
        return true;
    }

    // Bulk invalidate QR codes
    async bulkInvalidateQRs(examId) {
        return await prisma.hallTicketQr.updateMany({
            where: {
                hallTicket: { examId }
            },
            data: {
                expiresAt: new Date() // Set to current time to expire immediately
            }
        });
    }

    // Generate QR scan report
    async generateScanReport(examId, startDate, endDate) {
        const scans = await prisma.qrScan.findMany({
            where: {
                hallTicket: { examId },
                scannedAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                hallTicket: {
                    include: {
                        student: true
                    }
                }
            },
            orderBy: { scannedAt: 'asc' }
        });

        const report = {
            examId,
            reportPeriod: { startDate, endDate },
            totalScans: scans.length,
            validScans: scans.filter(s => s.isValid).length,
            invalidScans: scans.filter(s => !s.isValid).length,
            uniqueStudents: new Set(scans.filter(s => s.isValid).map(s => s.hallTicket?.studentId)).size,
            scansByHour: {},
            fraudAttempts: scans.filter(s => !s.isValid).map(s => ({
                timestamp: s.scannedAt,
                error: s.validationError,
                location: s.location,
                deviceInfo: s.deviceInfo
            }))
        };

        // Group scans by hour
        scans.forEach(scan => {
            const hour = scan.scannedAt.getHours();
            report.scansByHour[hour] = (report.scansByHour[hour] || 0) + 1;
        });

        return report;
    }
}

module.exports = new QRValidationService();