// src/routes/mindmaps.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all mind maps
router.get('/', async (req, res) => {
  try {
    const mindMaps = await prisma.mindMap.findMany({
      include: { nodes: true }
    });
    res.json(mindMaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new mind map
router.post('/', async (req, res) => {
  try {
    const { title, studentId, syllabusId } = req.body;
    const mindMap = await prisma.mindMap.create({
      data: {
        title,
        student: { connect: { id: studentId } },
        syllabus: { connect: { id: syllabusId } }
      }
    });
    res.status(201).json(mindMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
