const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, hasAnyRole } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);
router.use(hasAnyRole('ADMIN'));

router.get('/stats', async (req, res, next) => {
  try {
    const [users, courses, exams, rooms, clubs, events] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.exam.count(),
      prisma.room.count(),
      prisma.club.count(),
      prisma.event.count(),
    ]);
    res.json({ users, courses, exams, rooms, clubs, events });
  } catch (error) { next(error); }
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const [stats, upcomingExams, recentEvents] = await Promise.all([
      Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.exam.count(),
        prisma.room.count(),
        prisma.club.count(),
        prisma.event.count(),
      ]).then(([users, courses, exams, rooms, clubs, events]) => ({ users, courses, exams, rooms, clubs, events })),
      prisma.exam.findMany({
        where: { examDate: { gte: new Date() } },
        include: { course: { select: { code: true, name: true } } },
        orderBy: { examDate: 'asc' },
        take: 10,
      }),
      prisma.event.findMany({ orderBy: { startDateTime: 'desc' }, take: 10 }),
    ]);
    res.json({ stats, upcomingExams, recentEvents });
  } catch (error) { next(error); }
});

router.get('/seating/summary/:examId', async (req, res, next) => {
  try {
    const examId = req.params.examId;
    const allocations = await prisma.seatingAllocation.findMany({
      where: { examId },
      include: { seat: { include: { room: true } } },
    });
    const byRoom = {};
    for (const a of allocations) {
      const r = a.seat.room.name;
      byRoom[r] = (byRoom[r] || 0) + 1;
    }
    res.json({ total: allocations.length, byRoom });
  } catch (error) { next(error); }
});

router.get('/users/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const where = q ? {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { rollNo: { contains: q, mode: 'insensitive' } },
      ],
    } : {};
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true, email: true, fullName: true, rollNo: true,
        roles: { select: { role: { select: { name: true } } } },
      },
      orderBy: { fullName: 'asc' },
      take: 200,
    });
    res.json({ results: users.length, users });
  } catch (error) { next(error); }
});

router.get('/rooms/summary', async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { _count: { select: { seats: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ rooms });
  } catch (error) { next(error); }
});

router.get('/exams/upcoming', async (req, res, next) => {
  try {
    const now = new Date();
    const exams = await prisma.exam.findMany({
      where: { examDate: { gte: now } },
      include: { course: { select: { code: true, name: true } } },
      orderBy: { examDate: 'asc' },
      take: 50,
    });
    res.json({ exams });
  } catch (error) { next(error); }
});

module.exports = router;
