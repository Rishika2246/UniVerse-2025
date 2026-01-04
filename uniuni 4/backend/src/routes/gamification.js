const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// User Profile & Stats
router.get('/profile', gamificationController.getGamificationProfile);
router.get('/achievements', gamificationController.getUserAchievements);
router.get('/stats', gamificationController.getUserStats);

// Leaderboards
router.get('/leaderboards', gamificationController.getLeaderboards);

// XP System
router.post('/xp/award', gamificationController.awardXP);

// Challenges
router.get('/challenges', gamificationController.getUserChallenges);
router.post('/challenges/:challengeId/complete', gamificationController.completeChallenge);

// Daily Rewards
router.get('/rewards/daily', gamificationController.getDailyRewards);
router.post('/rewards/daily/claim', gamificationController.claimDailyReward);

// Social Features
router.get('/social', gamificationController.getSocialFeatures);

module.exports = router;