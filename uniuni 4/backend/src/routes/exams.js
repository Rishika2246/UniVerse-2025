const express = require('express');
const { auth, hasAnyRole } = require('../middleware/auth');

const router = express.Router();

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    // Mock exam data - in real implementation, this would come from database
    const exams = [
      {
        id: 'exam-1',
        subject: 'Database Management Systems',
        examType: 'Mid Semester',
        date: '2024-12-20',
        time: '10:00 AM',
        duration: '3 hours',
        totalMarks: 100,
        status: 'scheduled'
      },
      {
        id: 'exam-2',
        subject: 'Computer Networks',
        examType: 'End Semester',
        date: '2024-12-22',
        time: '2:00 PM',
        duration: '3 hours',
        totalMarks: 100,
        status: 'scheduled'
      },
      {
        id: 'exam-3',
        subject: 'Operating Systems',
        examType: 'Mid Semester',
        date: '2024-12-25',
        time: '10:00 AM',
        duration: '3 hours',
        totalMarks: 100,
        status: 'scheduled'
      },
      {
        id: 'exam-4',
        subject: 'Software Engineering',
        examType: 'End Semester',
        date: '2024-12-28',
        time: '2:00 PM',
        duration: '3 hours',
        totalMarks: 100,
        status: 'scheduled'
      },
      {
        id: 'exam-5',
        subject: 'Machine Learning',
        examType: 'Mid Semester',
        date: '2024-12-30',
        time: '10:00 AM',
        duration: '3 hours',
        totalMarks: 100,
        status: 'scheduled'
      }
    ];

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: { exams }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch exams'
    });
  }
});

// Get single exam
router.get('/:examId', auth, async (req, res) => {
  try {
    const { examId } = req.params;
    
    // Mock single exam data
    const exam = {
      id: examId,
      subject: 'Database Management Systems',
      examType: 'Mid Semester',
      date: '2024-12-20',
      time: '10:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      status: 'scheduled',
      instructions: [
        'Arrive 30 minutes before exam time',
        'Bring valid ID card',
        'No electronic devices allowed',
        'Use only blue/black pen'
      ]
    };

    res.status(200).json({
      status: 'success',
      data: { exam }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch exam'
    });
  }
});

module.exports = router;