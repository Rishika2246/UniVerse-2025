const express = require('express');
const router = express.Router();
const studySuiteController = require('../controllers/studySuiteController');
const { protect } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Dashboard
router.get('/dashboard', studySuiteController.getStudySuiteDashboard);

// Mind Maps
router.get('/mindmaps', studySuiteController.getMindMaps);
router.post('/mindmaps', studySuiteController.createMindMap);
router.patch('/mindmaps/:mindMapId', studySuiteController.updateMindMap);
router.delete('/mindmaps/:mindMapId', studySuiteController.deleteMindMap);

// Notes Generator
router.post('/notes/generate', studySuiteController.generateNotes);
router.get('/notes', studySuiteController.getGeneratedNotes);

// Smart Summaries
router.post('/summaries/generate', studySuiteController.generateSummary);

// Flashcards
router.post('/flashcards', studySuiteController.createFlashcards);
router.get('/flashcards', studySuiteController.getFlashcardSets);
router.post('/flashcards/:setId/study', studySuiteController.studyFlashcards);

// Quiz Generator
router.post('/quizzes/generate', studySuiteController.generateQuiz);
router.get('/quizzes', studySuiteController.getQuizzes);
router.post('/quizzes/:quizId/attempt', studySuiteController.submitQuizAttempt);

// Concept Maps
router.post('/concept-maps', studySuiteController.createConceptMap);

// Visual Mind Graphs
router.post('/mind-graphs', studySuiteController.createVisualMindGraph);

module.exports = router;