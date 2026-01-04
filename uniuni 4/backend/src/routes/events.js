// src/routes/events.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth, hasAnyRole } = require('../middleware/auth');
const prisma = new PrismaClient();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        createdBy: true,
        attendees: true,
      }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startDateTime, 
      endDateTime, 
      location, 
      clubId, 
      createdById 
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        location,
        club: { connect: { id: clubId } },
        createdBy: { connect: { id: createdById } }
      },
      include: {
        club: true,
        createdBy: true
      }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.use(auth);

router.patch('/:id/approve', hasAnyRole('ADMIN'), async (req, res) => {
  try {
    const event = await prisma.event.update({ where: { id: req.params.id }, data: { status: 'APPROVED' } });
    res.json(event);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

router.patch('/:id/reject', hasAnyRole('ADMIN'), async (req, res) => {
  try {
    const event = await prisma.event.update({ where: { id: req.params.id }, data: { status: 'REJECTED' } });
    res.json(event);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// RSVP to an event (development-friendly: uses default student if unauthenticated in dev)
router.post('/:id/rsvp', async (req, res) => {
  try {
    const eventId = req.params.id;
    let userId = req.user?.id;
    if (!userId) {
      const student = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'STUDENT' } } } },
        select: { id: true },
      });
      userId = student?.id;
    }
    if (!userId) return res.status(400).json({ error: 'No user available for RSVP' });

    const attendee = await prisma.eventAttendee.upsert({
      where: { eventId_userId: { eventId, userId } },
      update: { status: req.body?.status || 'GOING' },
      create: { eventId, userId, status: req.body?.status || 'GOING' },
    });
    res.json(attendee);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

router.delete('/:id/rsvp', async (req, res) => {
  try {
    const eventId = req.params.id;
    let userId = req.user?.id;
    if (!userId) {
      const student = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'STUDENT' } } } },
        select: { id: true },
      });
      userId = student?.id;
    }
    if (!userId) return res.status(400).json({ error: 'No user available for RSVP' });

    await prisma.eventAttendee.delete({
      where: { eventId_userId: { eventId, userId } },
    });
    res.status(204).send();
  } catch (error) { res.status(400).json({ error: error.message }); }
});

module.exports = router;
