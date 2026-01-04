import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Users, Brain, Target, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function AnalyticsDashboard({ user }: { user: any }) {
  const moodTrend = [
    { day: 'Mon', mood: 7.5, stress: 4 },
    { day: 'Tue', mood: 8, stress: 3 },
    { day: 'Wed', mood: 6, stress: 7 },
    { day: 'Thu', mood: 7, stress: 5 },
    { day: 'Fri', mood: 9, stress: 2 },
  ];

  const performanceCorrelation = [
    { metric: 'Attendance', score: 92 },
    { metric: 'Study Hours', score: 85 },
    { metric: 'Sleep Quality', score: 70 },
    { metric: 'Exercise', score: 65 },
    { metric: 'Social Activity', score: 78 },
  ];

  const classroomPrediction = [
    { time: '9 AM', density: 85, color: '#ef4444' },
    { time: '10 AM', density: 95, color: '#ef4444' },
    { time: '11 AM', density: 75, color: '#f59e0b' },
    { time: '12 PM', density: 60, color: '#10b981' },
    { time: '2 PM', density: 70, color: '#f59e0b' },
    { time: '3 PM', density: 80, color: '#f59e0b' },
    { time: '4 PM', density: 50, color: '#10b981' },
  ];

  const anomalyDetections = [
    { type: 'Attendance', desc: 'Unusual absence pattern detected for CS304', severity: 'high', date: '2024-12-01' },
    { type: 'Performance', desc: 'Sudden drop in quiz scores', severity: 'medium', date: '2024-11-28' },
    { type: 'Behavior', desc: 'Late submissions increasing', severity: 'low', date: '2024-11-25' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Brain className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">7.8/10</h3>
          <p className="text-gray-400">Average Mood Score</p>
          <p className="text-sm text-blue-400 mt-2">Good this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Activity className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">85%</h3>
          <p className="text-gray-400">Study Efficiency</p>
          <p className="text-sm text-purple-400 mt-2">+5% from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Target className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">94%</h3>
          <p className="text-gray-400">Goal Achievement</p>
          <p className="text-sm text-green-400 mt-2">On track</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <AlertTriangle className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">3</h3>
          <p className="text-gray-400">Active Alerts</p>
          <p className="text-sm text-orange-400 mt-2">Needs attention</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood & Stress Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Mood & Stress Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} name="Mood Score" />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 6 }} name="Stress Level" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Mood Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Stress Level</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Correlation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Performance Factors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceCorrelation}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-400 text-center mt-4">
            Your performance is strongly correlated with attendance and study hours
          </p>
        </motion.div>
      </div>

      {/* Classroom Density Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Classroom Crowding Forecast</h3>
            <p className="text-sm text-gray-400">Tomorrow's predicted density</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-400">High</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classroomPrediction}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="density" radius={[8, 8, 0, 0]}>
              {classroomPrediction.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Anomaly Detections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">AI Anomaly Detection</h3>
            <p className="text-sm text-gray-400">Unusual patterns detected</p>
          </div>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {anomalyDetections.map((anomaly, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`p-4 rounded-xl border ${
                anomaly.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                anomaly.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    anomaly.severity === 'high' ? 'text-red-400' :
                    anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{anomaly.type}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                        anomaly.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{anomaly.desc}</p>
                    <p className="text-xs text-gray-500">Detected on {anomaly.date}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors">
                  Review
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resource Usage Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Users className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Library Usage Pattern</h3>
          <p className="text-sm text-gray-400 mb-4">
            Peak hours: 2-6 PM. Visit before 2 PM for better availability.
          </p>
          <div className="text-2xl font-bold text-blue-400">65% Full</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Activity className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Study Time Optimization</h3>
          <p className="text-sm text-gray-400 mb-4">
            Your peak productivity: 9-11 AM. Schedule important tasks accordingly.
          </p>
          <div className="text-2xl font-bold text-purple-400">89% Efficient</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Performance Prediction</h3>
          <p className="text-sm text-gray-400 mb-4">
            Based on current trends, predicted end-semester CGPA: 9.4
          </p>
          <div className="text-2xl font-bold text-green-400">Excellent</div>
        </div>
      </motion.div>
    </div>
  );
}
