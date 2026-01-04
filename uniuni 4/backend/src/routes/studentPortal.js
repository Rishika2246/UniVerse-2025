const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

// Get student's hall tickets
router.get('/api/hall-tickets', async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        const hallTickets = await prisma.hallTicket.findMany({
            where: {
                studentId,
                status: { in: ['ACTIVE', 'LOCKED'] }
            },
            include: {
                exam: {
                    include: {
                        course: true
                    }
                },
                hallTicketQrs: {
                    select: {
                        qrToken: true,
                        isUsed: true,
                        scanCount: true,
                        expiresAt: true
                    }
                }
            },
            orderBy: { examDate: 'asc' }
        });

        const formattedTickets = hallTickets.map(ticket => ({
            id: ticket.id,
            hallTicketNumber: ticket.hallTicketNumber,
            examSession: ticket.examSession,
            status: ticket.status,
            isLocked: ticket.isLocked,
            exam: {
                id: ticket.exam.id,
                name: ticket.exam.course.name,
                code: ticket.exam.course.code,
                department: ticket.exam.course.department,
                type: ticket.exam.examType,
                date: ticket.examDate,
                time: ticket.examTime
            },
            venue: {
                hallName: ticket.hallName,
                seatNumber: ticket.seatNumber,
                gate: ticket.gate,
                block: ticket.block,
                invigilator: ticket.invigilatorName
            },
            qr: ticket.hallTicketQrs[0] ? {
                token: ticket.hallTicketQrs[0].qrToken,
                isUsed: ticket.hallTicketQrs[0].isUsed,
                scanCount: ticket.hallTicketQrs[0].scanCount,
                expiresAt: ticket.hallTicketQrs[0].expiresAt
            } : null,
            files: {
                pdfPath: ticket.pdfPath,
                qrImagePath: ticket.qrImagePath
            },
            issueDate: ticket.issueDate
        }));

        res.json({
            success: true,
            hallTickets: formattedTickets,
            count: formattedTickets.length
        });

    } catch (error) {
        console.error('Get hall tickets error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Download hall ticket PDF
router.get('/api/hall-tickets/:ticketId/pdf', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { studentId } = req.query;

        const hallTicket = await prisma.hallTicket.findFirst({
            where: {
                id: ticketId,
                studentId // Ensure student can only access their own tickets
            }
        });

        if (!hallTicket) {
            return res.status(404).json({ success: false, message: 'Hall ticket not found' });
        }

        if (!hallTicket.pdfPath) {
            return res.status(404).json({ success: false, message: 'PDF not available' });
        }

        const filePath = path.join(__dirname, '../..', hallTicket.pdfPath);
        
        if (!require('fs').existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'PDF file not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="hall-ticket-${hallTicket.hallTicketNumber}.pdf"`);
        res.sendFile(filePath);

    } catch (error) {
        console.error('Download PDF error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get QR code image
router.get('/api/hall-tickets/:ticketId/qr', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { studentId } = req.query;

        const hallTicket = await prisma.hallTicket.findFirst({
            where: {
                id: ticketId,
                studentId
            }
        });

        if (!hallTicket) {
            return res.status(404).json({ success: false, message: 'Hall ticket not found' });
        }

        if (!hallTicket.qrImagePath) {
            return res.status(404).json({ success: false, message: 'QR code not available' });
        }

        const filePath = path.join(__dirname, '../..', hallTicket.qrImagePath);
        
        if (!require('fs').existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'QR code file not found' });
        }

        res.setHeader('Content-Type', 'image/png');
        res.sendFile(filePath);

    } catch (error) {
        console.error('Get QR code error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get exam schedule for student
router.get('/api/exam-schedule', async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        const examSchedule = await prisma.hallTicket.findMany({
            where: {
                studentId,
                status: { in: ['ACTIVE', 'LOCKED'] },
                examDate: { gte: new Date() } // Only future exams
            },
            include: {
                exam: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: { examDate: 'asc' }
        });

        const schedule = examSchedule.map(ticket => ({
            examId: ticket.exam.id,
            hallTicketId: ticket.id,
            subject: ticket.exam.course.name,
            code: ticket.exam.course.code,
            department: ticket.exam.course.department,
            date: ticket.examDate,
            time: ticket.examTime,
            duration: '3 hours', // Default duration
            venue: {
                hall: ticket.hallName,
                seat: ticket.seatNumber,
                gate: ticket.gate,
                block: ticket.block
            },
            status: ticket.status,
            isLocked: ticket.isLocked
        }));

        res.json({
            success: true,
            examSchedule: schedule,
            upcomingExams: schedule.length
        });

    } catch (error) {
        console.error('Get exam schedule error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get hall ticket details for QR display
router.get('/api/hall-tickets/:ticketId/qr-data', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { studentId } = req.query;

        const hallTicket = await prisma.hallTicket.findFirst({
            where: {
                id: ticketId,
                studentId
            },
            include: {
                exam: {
                    include: {
                        course: true
                    }
                },
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        rollNo: true
                    }
                },
                hallTicketQrs: {
                    select: {
                        qrToken: true,
                        qrData: true,
                        isUsed: true,
                        expiresAt: true
                    }
                }
            }
        });

        if (!hallTicket) {
            return res.status(404).json({ success: false, message: 'Hall ticket not found' });
        }

        const qrInfo = hallTicket.hallTicketQrs[0];
        
        res.json({
            success: true,
            qrData: {
                token: qrInfo?.qrToken,
                data: qrInfo?.qrData,
                isUsed: qrInfo?.isUsed,
                expiresAt: qrInfo?.expiresAt,
                isExpired: qrInfo ? new Date() > new Date(qrInfo.expiresAt) : true
            },
            hallTicket: {
                id: hallTicket.id,
                number: hallTicket.hallTicketNumber,
                student: hallTicket.student,
                exam: {
                    name: hallTicket.exam.course.name,
                    code: hallTicket.exam.course.code,
                    date: hallTicket.examDate,
                    time: hallTicket.examTime
                },
                venue: {
                    hall: hallTicket.hallName,
                    seat: hallTicket.seatNumber,
                    gate: hallTicket.gate,
                    block: hallTicket.block
                },
                status: hallTicket.status,
                isLocked: hallTicket.isLocked
            }
        });

    } catch (error) {
        console.error('Get QR data error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;