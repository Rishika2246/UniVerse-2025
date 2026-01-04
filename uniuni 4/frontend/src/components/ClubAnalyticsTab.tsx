import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Calendar, Star, DollarSign, Activity, Target, Award, Zap } from 'lucide-react';

export function ClubAnalyticsTab() {
  const analyticsOverview = [
    { label: 'Total Events (YTD)', value: '87', trend: '+24%', color: 'from-cyan-400 to-blue-500', icon: Calendar },
    { label: 'Total Participation', value: '3,245', trend: '+18%', color: 'from-purple-400 to-pink-500', icon: Users },
    { label: 'Avg Event Rating', value: '4.6/5', trend: '+0.3', color: 'from-yellow-400 to-orange-500', icon: Star },
    { label: 'Engagement Rate', value: '78%', trend: '+12%', color: 'from-green-400 to-emerald-500', icon: Activity },
  ];

  const clubPerformance = [
    { club: 'Tech Club', events: 24, participants: 1156, rating: 4.8, engagement: 85, budget: 350000, roi: 145 },
    { club: 'Cultural Society', events: 18, participants: 987, rating: 4.7, engagement: 82, budget: 280000, roi: 138 },
    { club: 'Sports Club', events: 15, participants: 756, rating: 4.6, engagement: 78, budget: 220000, roi: 132 },
    { club: 'Music Society', events: 12, participants: 645, rating: 4.5, engagement: 75, budget: 180000, roi: 128 },
    { club: 'Drama Club', events: 10, participants: 412, rating: 4.4, engagement: 72, budget: 120000, roi: 125 },
    { club: 'Art Club', events: 8, participants: 289, rating: 4.3, engagement: 68, budget: 150000, roi: 118 },
  ];

  const monthlyTrends = [
    { month: 'Sep', events: 12, participants: 456 },
    { month: 'Oct', events: 15, participants: 589 },
    { month: 'Nov', events: 18, participants: 672 },
    { month: 'Dec', events: 14, participants: 523 },
    { month: 'Jan', events: 16, participants: 645 },
    { month: 'Feb', events: 12, participants: 360 },
  ];

  const eventCategories = [
    { category: 'Workshops', count: 28, percentage: 32, color: 'from-cyan-400 to-blue-500' },
    { category: 'Competitions', count: 22, percentage: 25, color: 'from-purple-400 to-pink-500' },
    { category: 'Performances', count: 18, percentage: 21, color: 'from-green-400 to-emerald-500' },
    { category: 'Talks/Seminars', count: 12, percentage: 14, color: 'from-amber-400 to-orange-500' },
    { category: 'Social Events', count: 7, percentage: 8, color: 'from-rose-400 to-red-500' },
  ];

  const topEvents = [
    { name: 'Hackathon 2024', club: 'Tech Club', participants: 200, rating: 4.9, impact: 'Very High' },
    { name: 'Spring Concert', club: 'Music Society', participants: 342, rating: 4.8, impact: 'Very High' },
    { name: 'Sports Day', club: 'Sports Club', participants: 289, rating: 4.7, impact: 'High' },
    { name: 'Cultural Fest', club: 'Cultural Society', participants: 456, rating: 4.8, impact: 'Very High' },
    { name: 'Art Exhibition', club: 'Art Club', participants: 178, rating: 4.6, impact: 'High' },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {analyticsOverview.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8" />
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">{stat.trend}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Club Performance Leaderboard */}
      <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          Club Performance Leaderboard
        </h3>
        <div className="space-y-3">
          {clubPerformance.map((club, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' :
                  index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                  'bg-gradient-to-br from-cyan-400 to-blue-500'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-lg">{club.club}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {club.events} events
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {club.participants} participants
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {club.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-slate-600 mb-1">Engagement</p>
                  <p className="text-lg font-bold text-purple-600">{club.engagement}%</p>
                  <div className="mt-2 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${club.engagement}%` }} />
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-slate-600 mb-1">Budget</p>
                  <p className="text-lg font-bold text-green-600">₹{(club.budget / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                  <p className="text-xs text-slate-600 mb-1">ROI Score</p>
                  <p className="text-lg font-bold text-cyan-600">{club.roi}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Trends & Event Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            Monthly Activity Trends
          </h3>
          <div className="space-y-4">
            {monthlyTrends.map((month, index) => {
              const maxParticipants = Math.max(...monthlyTrends.map(m => m.participants));
              const barWidth = (month.participants / maxParticipants) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{month.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{month.events} events</span>
                      <span className="text-cyan-600 font-bold">{month.participants} participants</span>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-end pr-3"
                    >
                      <span className="text-xs font-bold text-white">{month.participants}</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Categories */}
        <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-600" />
            Event Categories Distribution
          </h3>
          <div className="space-y-4">
            {eventCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{category.category}</span>
                  <span className="text-slate-600">{category.count} events ({category.percentage}%)</span>
                </div>
                <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${category.color} flex items-center justify-end pr-3`}
                  >
                    <span className="text-xs font-bold text-white">{category.percentage}%</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-600" />
          Top Performing Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  event.impact === 'Very High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {event.impact}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{event.name}</h4>
              <p className="text-xs text-slate-600 mb-3">{event.club}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Participants</span>
                  <span className="font-bold text-slate-800">{event.participants}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-800">{event.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-600" />
          Key Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Growth Trend</p>
            <p className="text-xs text-slate-600">Event participation increased by 18% compared to last year. Tech and Cultural clubs lead the growth.</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Peak Performance</p>
            <p className="text-xs text-slate-600">November had the highest activity with 18 events and 672 participants. Plan major events during this period.</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Engagement Focus</p>
            <p className="text-xs text-slate-600">Workshops and competitions have the highest engagement rates. Consider increasing these event types.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
