// src/routes/clubs.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        coordinator: true,
        members: true,
        events: true
      }
    });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new club
router.post('/', async (req, res) => {
  try {
    const { name, description, coordinatorId } = req.body;
    const club = await prisma.club.create({
      data: {
        name,
        description,
        coordinator: { connect: { id: coordinatorId } }
      },
      include: {
        coordinator: true
      }
    });
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
