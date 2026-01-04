import { motion } from 'motion/react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, AlertCircle, Eye, Filter, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

export function ClubFeedbackTab() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const feedbackStats = [
    { label: 'Total Feedback', value: '1,247', color: 'from-cyan-400 to-blue-500', icon: MessageSquare },
    { label: 'Avg Rating', value: '4.6/5', color: 'from-yellow-400 to-orange-500', icon: Star },
    { label: 'Positive', value: '892 (72%)', color: 'from-green-400 to-emerald-500', icon: ThumbsUp },
    { label: 'Needs Action', value: '87 (7%)', color: 'from-red-400 to-orange-500', icon: AlertCircle },
  ];

  const feedbackData = [
    {
      id: 1,
      event: 'Hackathon 2024',
      club: 'Tech Club',
      rating: 4.8,
      sentiment: 'positive',
      date: '2024-03-15',
      responses: 156,
      feedback: [
        { user: 'Rahul V.', rating: 5, comment: 'Amazing organization! The mentors were incredibly helpful and the prizes were great. Best hackathon experience!', sentiment: 'positive', date: '2024-03-16' },
        { user: 'Priya S.', rating: 5, comment: 'Loved the energy and the networking opportunities. Great platform to showcase our skills!', sentiment: 'positive', date: '2024-03-16' },
        { user: 'Amit K.', rating: 4, comment: 'Good event overall. Could have better food arrangements. Otherwise excellent!', sentiment: 'neutral', date: '2024-03-16' }
      ],
      keyHighlights: ['Great mentors', 'Well organized', 'Good prizes'],
      improvements: ['Food quality', 'Longer duration']
    },
    {
      id: 2,
      event: 'Spring Concert',
      club: 'Music Society',
      rating: 4.7,
      sentiment: 'positive',
      date: '2024-03-20',
      responses: 342,
      feedback: [
        { user: 'Sarah M.', rating: 5, comment: 'Absolutely fantastic performances! The sound quality was perfect and the ambiance was amazing.', sentiment: 'positive', date: '2024-03-21' },
        { user: 'Karan P.', rating: 5, comment: 'Best concert of the year! Every performer was talented. Looking forward to more events.', sentiment: 'positive', date: '2024-03-21' },
        { user: 'Neha R.', rating: 4, comment: 'Great music but seating arrangements could be better. Some people were standing throughout.', sentiment: 'neutral', date: '2024-03-21' }
      ],
      keyHighlights: ['Excellent performances', 'Great sound quality', 'Perfect ambiance'],
      improvements: ['Better seating', 'More space']
    },
    {
      id: 3,
      event: 'Theatre Workshop',
      club: 'Drama Club',
      rating: 4.3,
      sentiment: 'neutral',
      date: '2024-03-10',
      responses: 45,
      feedback: [
        { user: 'Ravi M.', rating: 4, comment: 'Good learning experience. The instructor was knowledgeable but the pace was a bit fast.', sentiment: 'neutral', date: '2024-03-11' },
        { user: 'Anjali D.', rating: 5, comment: 'Loved every minute of it! Learned so many new techniques. Highly recommend.', sentiment: 'positive', date: '2024-03-11' },
        { user: 'Vikram S.', rating: 3, comment: 'Expected more practical sessions. Too much theory for a workshop.', sentiment: 'negative', date: '2024-03-11' }
      ],
      keyHighlights: ['Knowledgeable instructor', 'New techniques learned'],
      improvements: ['Slow down pace', 'More practical sessions', 'Less theory']
    },
    {
      id: 4,
      event: 'Sports Day',
      club: 'Sports Club',
      rating: 4.5,
      sentiment: 'positive',
      date: '2024-03-05',
      responses: 289,
      feedback: [
        { user: 'Aditya K.', rating: 5, comment: 'Super fun and competitive! Great organization and amazing sportsmanship from everyone.', sentiment: 'positive', date: '2024-03-06' },
        { user: 'Meera T.', rating: 4, comment: 'Really enjoyed participating. Could have more events for beginners though.', sentiment: 'neutral', date: '2024-03-06' },
        { user: 'Rohan D.', rating: 5, comment: 'Best sports day ever! The energy was incredible. Loved every moment.', sentiment: 'positive', date: '2024-03-06' }
      ],
      keyHighlights: ['Great organization', 'High energy', 'Good sportsmanship'],
      improvements: ['More beginner events', 'Better hydration stations']
    }
  ];

  const filteredFeedback = selectedFilter === 'all' 
    ? feedbackData 
    : feedbackData.filter(f => f.sentiment === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {feedbackStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <span className="font-semibold text-slate-700">Filter by:</span>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Feedback' },
            { id: 'positive', label: 'Positive' },
            { id: 'neutral', label: 'Neutral' },
            { id: 'negative', label: 'Needs Action' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'bg-white border border-cyan-200 text-slate-600 hover:bg-cyan-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Feedback Cards */}
      <div className="space-y-6">
        {filteredFeedback.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{event.event}</h3>
                <p className="text-sm text-slate-600">{event.club} • {event.date}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-slate-800">{event.rating}</span>
                </div>
                <p className="text-xs text-slate-600">{event.responses} responses</p>
              </div>
            </div>

            {/* Sentiment Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                event.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                event.sentiment === 'neutral' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {event.sentiment === 'positive' ? '😊 Positive' : event.sentiment === 'neutral' ? '😐 Neutral' : '😕 Needs Attention'}
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    event.sentiment === 'positive' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    event.sentiment === 'neutral' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                    'bg-gradient-to-r from-amber-400 to-orange-500'
                  }`}
                  style={{ width: `${(event.rating / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Key Highlights & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Key Highlights
                </h4>
                <ul className="space-y-1">
                  {event.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Suggested Improvements
                </h4>
                <ul className="space-y-1">
                  {event.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="text-amber-600">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Individual Feedback Comments */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Recent Feedback Comments</h4>
              <div className="space-y-3">
                {event.feedback.map((fb, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    fb.sentiment === 'positive' ? 'bg-green-50 border-green-200' :
                    fb.sentiment === 'neutral' ? 'bg-blue-50 border-blue-200' :
                    'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {fb.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{fb.user}</p>
                          <p className="text-xs text-slate-600">{fb.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-cyan-200">
              <button className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                View All {event.responses} Responses
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Insights */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Overall Feedback Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 mb-1">Most Appreciated Aspect</p>
            <p className="text-lg font-bold text-purple-600">Event Organization</p>
            <p className="text-xs text-slate-600 mt-1">Mentioned in 78% of positive feedback</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 mb-1">Top Improvement Area</p>
            <p className="text-lg font-bold text-amber-600">Food & Refreshments</p>
            <p className="text-xs text-slate-600 mt-1">Mentioned in 42% of feedback</p>
          </div>
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 mb-1">Trend</p>
            <p className="text-lg font-bold text-green-600">+0.3 Rating Increase</p>
            <p className="text-xs text-slate-600 mt-1">Compared to last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
