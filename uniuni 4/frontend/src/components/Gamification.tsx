import { motion } from 'motion/react';
import { Trophy, Award, Zap, Target, Flame, Star, TrendingUp, Crown, Medal } from 'lucide-react';

export function Gamification({ user }: { user: any }) {
  const userStats = {
    level: 24,
    xp: 12450,
    xpToNextLevel: 15000,
    totalBadges: 28,
    rank: 42,
    totalStudents: 1250,
    streakDays: 28
  };

  const badges = [
    { name: 'Attendance Hero', desc: '100% attendance for a month', rarity: 'legendary', color: 'from-yellow-500 to-orange-500', earned: true },
    { name: 'Quiz Master', desc: 'Score 90%+ in 10 quizzes', rarity: 'epic', color: 'from-purple-500 to-pink-500', earned: true },
    { name: 'Study Streak', desc: '30 days continuous learning', rarity: 'rare', color: 'from-blue-500 to-cyan-500', earned: true },
    { name: 'Club Leader', desc: 'Lead a club for a semester', rarity: 'epic', color: 'from-green-500 to-teal-500', earned: false },
    { name: 'Perfect Score', desc: 'Get 100% in any exam', rarity: 'legendary', color: 'from-red-500 to-pink-500', earned: false },
    { name: 'Social Butterfly', desc: 'Attend 20+ events', rarity: 'rare', color: 'from-indigo-500 to-purple-500', earned: true },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', level: 32, xp: 24500, avatar: 'SC' },
    { rank: 2, name: 'Raj Patel', level: 30, xp: 22100, avatar: 'RP' },
    { rank: 3, name: 'Emma Wilson', level: 28, xp: 19800, avatar: 'EW' },
    { rank: 42, name: user.name, level: userStats.level, xp: userStats.xp, avatar: user.name.split(' ').map((n: string) => n[0]).join(''), isUser: true },
  ];

  const challenges = [
    { title: 'Perfect Week', desc: 'Attend all classes this week', progress: 4, total: 6, xp: 500, difficulty: 'medium', color: 'from-blue-500 to-cyan-500' },
    { title: 'Quiz Champion', desc: 'Score 95%+ in next quiz', progress: 0, total: 1, xp: 1000, difficulty: 'hard', color: 'from-purple-500 to-pink-500' },
    { title: 'Study Master', desc: 'Study 10 hours this week', progress: 7, total: 10, xp: 750, difficulty: 'medium', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Player Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Level {userStats.level}</h2>
                <p className="text-gray-400">{user.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">XP Progress</span>
                  <span className="text-white font-semibold">{userStats.xp.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {(userStats.xpToNextLevel - userStats.xp).toLocaleString()} XP to Level {userStats.level + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.totalBadges}</p>
              <p className="text-sm text-gray-400">Badges Earned</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Target className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">#{userStats.rank}</p>
              <p className="text-sm text-gray-400">Global Rank</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Flame className="w-8 h-8 text-orange-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.streakDays}</p>
              <p className="text-sm text-gray-400">Day Streak</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Star className="w-8 h-8 text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.xp.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total XP</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Active Challenges</h3>
            <p className="text-sm text-gray-400">Complete to earn XP and badges</p>
          </div>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
            View All
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative overflow-hidden bg-gradient-to-br ${challenge.color} p-6 rounded-2xl group hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Zap className="w-8 h-8 text-white" />
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    challenge.difficulty === 'easy' ? 'bg-green-500/30' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-500/30' : 'bg-red-500/30'
                  } text-white`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-white font-bold mb-2">{challenge.title}</h4>
                <p className="text-sm text-white/80 mb-4">{challenge.desc}</p>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/80">Progress</span>
                    <span className="text-white font-bold">{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <span className="text-sm">Reward</span>
                  <span className="font-bold">+{challenge.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Badge Collection</h3>
            <p className="text-sm text-gray-400">Showcase your achievements</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Legendary</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Epic</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Rare</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className={`relative group ${badge.earned ? '' : 'opacity-40'}`}
            >
              <div className={`bg-gradient-to-br ${badge.color} aspect-square rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform`}>
                {badge.earned ? (
                  <Award className="w-12 h-12 text-white mb-2" />
                ) : (
                  <div className="w-12 h-12 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center mb-2">
                    <Award className="w-8 h-8 text-white/50" />
                  </div>
                )}
                <p className="text-xs text-white text-center font-semibold">{badge.name}</p>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {badge.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            <p className="text-sm text-gray-400">Top students on campus</p>
          </div>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
            View Full List
          </button>
        </div>

        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                player.isUser
                  ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-2 border-purple-500'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="relative">
                {player.rank <= 3 ? (
                  <div className={`w-12 h-12 bg-gradient-to-br ${
                    player.rank === 1 ? 'from-yellow-500 to-orange-500' :
                    player.rank === 2 ? 'from-gray-300 to-gray-500' :
                    'from-orange-600 to-yellow-700'
                  } rounded-full flex items-center justify-center font-bold text-white text-xl`}>
                    {player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'}
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{player.avatar}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-white font-semibold">{player.name}</p>
                <p className="text-sm text-gray-400">Level {player.level}</p>
              </div>

              <div className="text-right">
                <p className="text-white font-bold">{player.xp.toLocaleString()} XP</p>
                <p className="text-sm text-gray-400">Rank #{player.rank}</p>
              </div>

              {player.rank <= 3 && (
                <Medal className={`w-8 h-8 ${
                  player.rank === 1 ? 'text-yellow-400' :
                  player.rank === 2 ? 'text-gray-400' : 'text-orange-600'
                }`} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
