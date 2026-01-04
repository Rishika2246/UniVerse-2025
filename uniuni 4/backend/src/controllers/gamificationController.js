const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== GAMIFICATION SYSTEM APIS =====

// Get user gamification profile
const getGamificationProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = {
      userId,
      level: 15,
      totalXP: 12450,
      xpToNextLevel: 550,
      currentLevelXP: 1450,
      nextLevelXP: 2000,
      rank: 23,
      totalUsers: 1250,
      streak: {
        current: 28,
        longest: 45,
        type: 'study_streak'
      },
      stats: {
        studyHours: 127.5,
        assignmentsCompleted: 45,
        quizzesTaken: 32,
        attendanceRate: 92,
        helpfulAnswers: 18
      }
    };

    res.status(200).json({
      status: 'success',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

// Get user achievements and badges
const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const achievements = {
      badges: [
        {
          id: 1,
          name: 'Study Master',
          description: 'Complete 100 hours of study',
          icon: 'trophy',
          rarity: 'gold',
          earned: true,
          earnedAt: '2024-11-15',
          progress: 100,
          category: 'study'
        },
        {
          id: 2,
          name: 'Perfect Attendance',
          description: 'Maintain 95%+ attendance for a month',
          icon: 'calendar-check',
          rarity: 'silver',
          earned: true,
          earnedAt: '2024-10-30',
          progress: 100,
          category: 'attendance'
        },
        {
          id: 3,
          name: 'Quiz Champion',
          description: 'Score 90%+ on 10 consecutive quizzes',
          icon: 'brain',
          rarity: 'gold',
          earned: false,
          progress: 70,
          category: 'academic'
        },
        {
          id: 4,
          name: 'Helper',
          description: 'Help 50 classmates with their studies',
          icon: 'helping-hand',
          rarity: 'bronze',
          earned: false,
          progress: 36,
          category: 'social'
        }
      ],
      categories: [
        { name: 'study', earned: 3, total: 8 },
        { name: 'attendance', earned: 2, total: 5 },
        { name: 'academic', earned: 4, total: 10 },
        { name: 'social', earned: 1, total: 6 }
      ],
      recentEarned: [
        { name: 'Study Master', earnedAt: '2024-11-15' },
        { name: 'Perfect Week', earnedAt: '2024-11-10' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

// Get leaderboards
const getLeaderboards = async (req, res, next) => {
  try {
    const { type = 'overall', timeframe = 'monthly' } = req.query;
    const userId = req.user.id;

    const leaderboards = {
      overall: [
        { rank: 1, userId: 'user123', name: 'Aarav Mehta', level: 18, xp: 15420, avatar: 'avatar1.jpg' },
        { rank: 2, userId: 'user456', name: 'Priya Sharma', level: 17, xp: 14850, avatar: 'avatar2.jpg' },
        { rank: 3, userId: 'user789', name: 'Rohan Patel', level: 16, xp: 13920, avatar: 'avatar3.jpg' },
        { rank: 23, userId: userId, name: 'Current User', level: 15, xp: 12450, avatar: 'avatar_user.jpg', isCurrentUser: true }
      ],
      study: [
        { rank: 1, userId: 'user123', name: 'Aarav Mehta', studyHours: 145.5 },
        { rank: 2, userId: 'user456', name: 'Priya Sharma', studyHours: 132.3 },
        { rank: 3, userId: 'user789', name: 'Rohan Patel', studyHours: 128.7 }
      ],
      attendance: [
        { rank: 1, userId: 'user456', name: 'Priya Sharma', attendance: 98.5 },
        { rank: 2, userId: 'user123', name: 'Aarav Mehta', attendance: 96.2 },
        { rank: 3, userId: 'user789', name: 'Rohan Patel', attendance: 94.8 }
      ],
      quiz: [
        { rank: 1, userId: 'user123', name: 'Aarav Mehta', avgScore: 94.2 },
        { rank: 2, userId: 'user456', name: 'Priya Sharma', avgScore: 91.8 },
        { rank: 3, userId: 'user789', name: 'Rohan Patel', avgScore: 89.5 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: {
        leaderboard: leaderboards[type] || leaderboards.overall,
        userRank: 23,
        timeframe,
        type
      }
    });
  } catch (error) {
    next(error);
  }
};

// Award XP to user
const awardXP = async (req, res, next) => {
  try {
    const { userId, amount, reason, category } = req.body;

    const xpAward = {
      id: Date.now(),
      userId,
      amount,
      reason,
      category,
      awardedAt: new Date().toISOString(),
      multiplier: 1.0
    };

    // Mock level up check
    const levelUp = amount >= 500 ? {
      newLevel: 16,
      previousLevel: 15,
      rewards: ['New avatar frame', '50 bonus XP', 'Special badge']
    } : null;

    res.status(201).json({
      status: 'success',
      message: `Awarded ${amount} XP for ${reason}`,
      data: {
        xpAward,
        levelUp
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user challenges
const getUserChallenges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status = 'active' } = req.query;

    const challenges = [
      {
        id: 1,
        title: 'Study Marathon',
        description: 'Study for 20 hours this week',
        type: 'weekly',
        category: 'study',
        status: 'active',
        progress: 15,
        target: 20,
        reward: {
          xp: 500,
          badge: 'Marathon Runner'
        },
        deadline: '2024-12-15',
        difficulty: 'medium'
      },
      {
        id: 2,
        title: 'Perfect Attendance',
        description: 'Attend all classes this week',
        type: 'weekly',
        category: 'attendance',
        status: 'active',
        progress: 4,
        target: 5,
        reward: {
          xp: 300,
          badge: 'Punctual Student'
        },
        deadline: '2024-12-15',
        difficulty: 'easy'
      },
      {
        id: 3,
        title: 'Quiz Master',
        description: 'Score 85%+ on 5 quizzes',
        type: 'monthly',
        category: 'academic',
        status: 'active',
        progress: 3,
        target: 5,
        reward: {
          xp: 750,
          badge: 'Quiz Champion'
        },
        deadline: '2024-12-31',
        difficulty: 'hard'
      }
    ];

    const filteredChallenges = challenges.filter(c => c.status === status);

    res.status(200).json({
      status: 'success',
      results: filteredChallenges.length,
      data: { challenges: filteredChallenges }
    });
  } catch (error) {
    next(error);
  }
};

// Complete challenge
const completeChallenge = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const completion = {
      challengeId,
      userId,
      completedAt: new Date().toISOString(),
      rewards: {
        xp: 500,
        badge: 'Marathon Runner',
        title: 'Study Enthusiast'
      },
      bonusRewards: {
        streak: 'Completed 3 challenges in a row',
        xpBonus: 100
      }
    };

    res.status(200).json({
      status: 'success',
      message: 'Challenge completed successfully!',
      data: { completion }
    });
  } catch (error) {
    next(error);
  }
};

// Get daily rewards
const getDailyRewards = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const dailyRewards = {
      streak: 7,
      lastClaimed: '2024-12-02',
      canClaim: true,
      todayReward: {
        xp: 50,
        coins: 10,
        bonus: 'Study time multiplier x1.2 for today'
      },
      weeklyBonus: {
        available: true,
        reward: {
          xp: 200,
          badge: 'Consistent Learner',
          specialItem: 'Golden Study Badge'
        }
      },
      upcomingRewards: [
        { day: 8, xp: 60, coins: 12 },
        { day: 9, xp: 70, coins: 14 },
        { day: 10, xp: 100, coins: 20, bonus: 'Special badge' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: { dailyRewards }
    });
  } catch (error) {
    next(error);
  }
};

// Claim daily reward
const claimDailyReward = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const claimedReward = {
      userId,
      day: 8,
      xp: 60,
      coins: 12,
      claimedAt: new Date().toISOString(),
      newStreak: 8,
      bonusApplied: false
    };

    res.status(200).json({
      status: 'success',
      message: 'Daily reward claimed successfully!',
      data: { claimedReward }
    });
  } catch (error) {
    next(error);
  }
};

// Get user stats and analytics
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timeframe = '30d' } = req.query;

    const stats = {
      overview: {
        totalXP: 12450,
        level: 15,
        rank: 23,
        badgesEarned: 12,
        challengesCompleted: 28
      },
      activity: {
        studyHours: 127.5,
        quizzesTaken: 32,
        assignmentsCompleted: 45,
        attendanceRate: 92,
        helpfulAnswers: 18
      },
      progress: {
        xpGained: [
          { date: '2024-12-01', xp: 120 },
          { date: '2024-12-02', xp: 85 },
          { date: '2024-12-03', xp: 150 },
          { date: '2024-12-04', xp: 95 }
        ],
        levelProgression: [
          { level: 13, reachedAt: '2024-10-15' },
          { level: 14, reachedAt: '2024-11-02' },
          { level: 15, reachedAt: '2024-11-20' }
        ]
      },
      achievements: {
        recentBadges: [
          { name: 'Study Master', earnedAt: '2024-11-15' },
          { name: 'Perfect Week', earnedAt: '2024-11-10' }
        ],
        nextGoals: [
          { name: 'Quiz Champion', progress: 70 },
          { name: 'Helper', progress: 36 }
        ]
      }
    };

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// Get social features
const getSocialFeatures = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const socialData = {
      friends: [
        { userId: 'user123', name: 'Aarav Mehta', level: 18, status: 'online', mutualChallenges: 3 },
        { userId: 'user456', name: 'Priya Sharma', level: 17, status: 'studying', mutualChallenges: 2 }
      ],
      studyGroups: [
        { id: 1, name: 'Data Structures Study Group', members: 8, level: 'intermediate' },
        { id: 2, name: 'Web Dev Warriors', members: 12, level: 'beginner' }
      ],
      competitions: [
        {
          id: 1,
          name: 'December Study Challenge',
          participants: 156,
          timeLeft: '5 days',
          userRank: 23,
          prize: 'Special badge + 1000 XP'
        }
      ],
      recentActivity: [
        { user: 'Aarav Mehta', action: 'completed Quiz Master challenge', time: '2 hours ago' },
        { user: 'Priya Sharma', action: 'reached level 17', time: '5 hours ago' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: socialData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGamificationProfile,
  getUserAchievements,
  getLeaderboards,
  awardXP,
  getUserChallenges,
  completeChallenge,
  getDailyRewards,
  claimDailyReward,
  getUserStats,
  getSocialFeatures
};