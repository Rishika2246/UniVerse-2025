import { motion } from 'motion/react';
import {
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  Calendar, Target, Flame, Award, Eye, FileText,
  ArrowLeft, Download, Upload, Activity, TimerIcon,
  MapPin, Mail, User, Phone, FileCheck, XCircle,
  Plane, Stethoscope, AlertCircleIcon, QrCode, Smartphone,
  Users, BarChart3, Trophy, Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function AttendanceSuite({ user, onBack }: { user: any; onBack: () => void }) {
  const weeklyData = [
    { day: 'Mon', present: 5, absent: 1 },
    { day: 'Tue', present: 6, absent: 0 },
    { day: 'Wed', present: 4, absent: 2 },
    { day: 'Thu', present: 5, absent: 1 },
    { day: 'Fri', present: 6, absent: 0 },
  ];

  const monthlyTrend = [
    { month: 'Aug', attendance: 85 },
    { month: 'Sep', attendance: 78 },
    { month: 'Oct', attendance: 92 },
    { month: 'Nov', attendance: 88 },
    { month: 'Dec', attendance: 95 },
  ];

  const subjects = [
    { code: 'CS301', name: 'Data Structures', attended: 42, total: 45, percentage: 93, canMiss: 5, color: '#10b981' },
    { code: 'CS302', name: 'Web Development', attended: 38, total: 44, percentage: 86, canMiss: 3, color: '#3b82f6' },
    { code: 'CS303', name: 'Database Systems', attended: 35, total: 42, percentage: 83, canMiss: 2, color: '#8b5cf6' },
    { code: 'CS304', name: 'Computer Networks', attended: 32, total: 45, percentage: 71, canMiss: 0, color: '#ef4444' },
    { code: 'CS305', name: 'Operating Systems', attended: 40, total: 44, percentage: 91, canMiss: 4, color: '#06b6d4' },
    { code: 'CS306', name: 'Software Engineering', attended: 41, total: 43, percentage: 95, canMiss: 6, color: '#ec4899' },
  ];

  const leaveApplications = [
    { id: 1, type: 'Medical', date: '2024-12-10', duration: '1 day', status: 'Approved', reason: 'Fever' },
    { id: 2, type: 'Personal', date: '2024-11-28', duration: '2 days', status: 'Approved', reason: 'Family Function' },
    { id: 3, type: 'Medical', date: '2024-11-15', duration: '3 days', status: 'Approved', reason: 'Viral Infection' },
  ];

  const lateArrivals = [
    { date: '2024-12-08', time: '9:15 AM', subject: 'Data Structures', delay: '15 min', reason: 'Traffic' },
    { date: '2024-12-01', time: '8:20 AM', subject: 'Web Dev', delay: '20 min', reason: 'Bus delay' },
  ];

  const semesterComparison = [
    { semester: 'Sem 1', attendance: 88 },
    { semester: 'Sem 2', attendance: 85 },
    { semester: 'Sem 3', attendance: 92 },
    { semester: 'Sem 4', attendance: 90 },
    { semester: 'Sem 5', attendance: 92 },
  ];

  const attendanceByTimeSlot = [
    { slot: '8-9 AM', percentage: 85, count: 68 },
    { slot: '9-10 AM', percentage: 92, count: 74 },
    { slot: '10-11 AM', percentage: 95, count: 76 },
    { slot: '11-12 PM', percentage: 88, count: 70 },
    { slot: '2-3 PM', percentage: 90, count: 72 },
    { slot: '3-4 PM', percentage: 87, count: 69 },
  ];

  const parentNotifications = [
    { date: '2024-12-01', message: 'Attendance below 75% in CS304', sent: true },
    { date: '2024-11-15', message: 'Improved attendance - Good progress', sent: true },
  ];

  const todaySchedule = [
    { time: '9:00 AM', subject: 'Data Structures', room: 'Lab 301', faculty: 'Prof. Sharma', status: 'attended' },
    { time: '11:00 AM', subject: 'Web Development', room: 'Room 205', faculty: 'Prof. Patel', status: 'attended' },
    { time: '2:00 PM', subject: 'Database Systems', room: 'Lab 402', faculty: 'Prof. Reddy', status: 'upcoming' },
    { time: '4:00 PM', subject: 'Computer Networks', room: 'Room 108', faculty: 'Prof. Singh', status: 'upcoming' },
  ];

  const peerComparison = [
    { category: 'Attendance', you: 92, classAvg: 85 },
    { category: 'Punctuality', you: 88, classAvg: 82 },
    { category: 'Leave Days', you: 3, classAvg: 5 },
  ];

  const radarData = [
    { subject: 'CS301', attendance: 93, fullMark: 100 },
    { subject: 'CS302', attendance: 86, fullMark: 100 },
    { subject: 'CS303', attendance: 83, fullMark: 100 },
    { subject: 'CS304', attendance: 71, fullMark: 100 },
    { subject: 'CS305', attendance: 91, fullMark: 100 },
    { subject: 'CS306', attendance: 95, fullMark: 100 },
  ];

  const attendanceGoals = [
    { goal: 'Reach 95% Overall', current: 92, target: 95, daysNeeded: 8 },
    { goal: 'Fix CS304 Shortage', current: 71, target: 75, daysNeeded: 12 },
    { goal: 'Maintain Perfect Week', current: 5, target: 5, daysNeeded: 0 },
  ];

  const badges = [
    { name: 'Perfect Month', icon: Trophy, earned: true, date: 'Nov 2024' },
    { name: '30-Day Streak', icon: Flame, earned: true, date: 'Current' },
    { name: '95% Club', icon: Award, earned: false, progress: 92 },
    { name: 'Early Bird', icon: Zap, earned: true, date: 'Oct 2024' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6">Today's Schedule</h3>
        <div className="space-y-3">
          {todaySchedule.map((classItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                classItem.status === 'attended' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    classItem.status === 'attended' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Clock className={`w-6 h-6 ${
                      classItem.status === 'attended' ? 'text-green-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{classItem.subject}</h4>
                    <p className="text-sm text-gray-400">
                      {classItem.time} • {classItem.room} • {classItem.faculty}
                    </p>
                  </div>
                </div>
                {classItem.status === 'attended' ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Attended</span>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                    Mark Attendance
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subject-wise Detailed Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Subject-wise Attendance Details</h3>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Detailed Table View */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-white font-semibold">Subject Code</th>
                  <th className="text-left p-4 text-white font-semibold">Subject Name</th>
                  <th className="text-center p-4 text-white font-semibold">Total Classes</th>
                  <th className="text-center p-4 text-white font-semibold">Attended</th>
                  <th className="text-center p-4 text-white font-semibold">Absent</th>
                  <th className="text-center p-4 text-white font-semibold">Percentage</th>
                  <th className="text-center p-4 text-white font-semibold">Score</th>
                  <th className="text-center p-4 text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <motion.tr
                    key={subject.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-white font-bold">{subject.code}</td>
                    <td className="p-4 text-gray-300">{subject.name}</td>
                    <td className="p-4 text-center text-gray-300">{subject.total}</td>
                    <td className="p-4 text-center text-green-400 font-semibold">{subject.attended}</td>
                    <td className="p-4 text-center text-red-400 font-semibold">{subject.total - subject.attended}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${
                          subject.percentage >= 90 ? 'text-green-400' :
                          subject.percentage >= 75 ? 'text-blue-400' : 'text-red-400'
                        }`}>
                          {subject.percentage}%
                        </span>
                        {subject.percentage < 75 && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        subject.percentage >= 90 ? 'bg-green-500/20 text-green-400' :
                        subject.percentage >= 75 ? 'bg-blue-500/20 text-blue-400' :
                        subject.percentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {subject.percentage >= 90 ? 'A+' :
                         subject.percentage >= 75 ? 'A' :
                         subject.percentage >= 60 ? 'B' : 'C'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {subject.percentage >= 75 ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                            Safe
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                            Shortage
                          </span>
                        )}
                        {subject.canMiss > 0 ? (
                          <span className="text-xs text-gray-400">
                            Can miss {subject.canMiss}
                          </span>
                        ) : (
                          <span className="text-xs text-red-400">
                            Cannot miss!
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/20 bg-white/10">
                  <td colSpan={2} className="p-4 text-white font-bold">OVERALL</td>
                  <td className="p-4 text-center text-white font-bold">
                    {subjects.reduce((acc, s) => acc + s.total, 0)}
                  </td>
                  <td className="p-4 text-center text-green-400 font-bold">
                    {subjects.reduce((acc, s) => acc + s.attended, 0)}
                  </td>
                  <td className="p-4 text-center text-red-400 font-bold">
                    {subjects.reduce((acc, s) => acc + (s.total - s.attended), 0)}
                  </td>
                  <td className="p-4 text-center text-cyan-400 font-bold">
                    {Math.round(
                      (subjects.reduce((acc, s) => acc + s.attended, 0) / 
                       subjects.reduce((acc, s) => acc + s.total, 0)) * 100
                    )}%
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-full font-bold bg-cyan-500/20 text-cyan-400">
                      A
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                      On Track
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Progress Bars for Visual Reference */}
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-400 mb-3">Visual Progress:</p>
          {subjects.map((subject, index) => (
            <div key={subject.code} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-400">{subject.code}</div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.percentage}%` }}
                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
              </div>
              <div className="w-16 text-right">
                <span className={`text-sm font-bold ${
                  subject.percentage >= 90 ? 'text-green-400' :
                  subject.percentage >= 75 ? 'text-blue-400' : 'text-red-400'
                }`}>
                  {subject.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Peer Comparison & Radar Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Peer Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Peer Comparison</h3>
              <p className="text-sm text-gray-400">How you compare to class average</p>
            </div>
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="space-y-6">
            {peerComparison.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">You: <span className="text-cyan-400 font-bold">{item.you}%</span></span>
                    <span className="text-sm text-gray-400">Avg: <span className="text-gray-300 font-bold">{item.classAvg}%</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.you}%` }}
                      transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.classAvg}%` }}
                      transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                      className="h-full bg-gray-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Subject-wise Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar name="Attendance" dataKey="attendance" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Attendance Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Attendance Goals</h3>
            <p className="text-sm text-gray-400">Track your progress toward goals</p>
          </div>
          <Target className="w-6 h-6 text-green-400" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {attendanceGoals.map((goal, index) => (
            <div key={index} className="p-5 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold text-white mb-4">{goal.goal}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Current</span>
                  <span className="text-cyan-400 font-bold">{goal.current}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Target</span>
                  <span className="text-green-400 font-bold">{goal.target}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    transition={{ duration: 1, delay: 1.0 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                  />
                </div>
                {goal.daysNeeded > 0 ? (
                  <p className="text-xs text-gray-400">
                    {goal.daysNeeded} more classes needed
                  </p>
                ) : (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Goal Achieved!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges & Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Badges & Achievements</h3>
            <p className="text-sm text-gray-400">Rewards for your dedication</p>
          </div>
          <Award className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className={`p-6 rounded-xl text-center transition-all ${
                badge.earned 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                  : 'bg-white/5 border border-white/10 opacity-60'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                badge.earned ? 'bg-yellow-500/30' : 'bg-white/10'
              }`}>
                <badge.icon className={`w-8 h-8 ${badge.earned ? 'text-yellow-400' : 'text-gray-500'}`} />
              </div>
              <h4 className="font-bold text-white mb-2">{badge.name}</h4>
              {badge.earned ? (
                <p className="text-xs text-yellow-400">{badge.date}</p>
              ) : (
                <div className="space-y-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{badge.progress}% complete</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Eye className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Forecast</h3>
          <p className="text-gray-400 text-sm mb-3">
            If you maintain current pattern, your end-of-semester attendance will be:
          </p>
          <div className="text-3xl font-bold text-blue-400">94%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Award className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-white font-bold mb-2">GPA Correlation</h3>
          <p className="text-gray-400 text-sm mb-3">
            Students with 90%+ attendance average:
          </p>
          <div className="text-3xl font-bold text-purple-400">8.8 GPA</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Flame className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Current Streak</h3>
          <p className="text-gray-400 text-sm mb-3">
            Consecutive days with 100% attendance:
          </p>
          <div className="text-3xl font-bold text-orange-400">28 days</div>
        </div>
      </motion.div>

      {/* Leave Applications & Late Arrivals */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leave Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Leave Applications</h3>
              <p className="text-sm text-gray-400">Track your leave requests</p>
            </div>
            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl transition-colors flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Apply Leave
            </button>
          </div>
          <div className="space-y-3">
            {leaveApplications.map((leave) => (
              <div key={leave.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {leave.type === 'Medical' ? (
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-red-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Plane className="w-5 h-5 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{leave.type} Leave</h4>
                      <p className="text-sm text-gray-400">{leave.date} • {leave.duration}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    leave.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 
                    leave.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Reason: {leave.reason}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Late Arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Late Arrivals</h3>
              <p className="text-sm text-gray-400">Track tardiness records</p>
            </div>
            <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-semibold">
              {lateArrivals.length} this month
            </div>
          </div>
          <div className="space-y-3">
            {lateArrivals.map((late, index) => (
              <div key={index} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{late.subject}</h4>
                      <p className="text-sm text-gray-400">{late.date} • {late.time}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
                    {late.delay}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Reason: {late.reason}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Semester Comparison & Time Slot Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Semester Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Semester-wise Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={semesterComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="semester" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="attendance" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">Current semester showing <span className="text-purple-400 font-semibold">strong improvement</span></p>
          </div>
        </motion.div>

        {/* Attendance by Time Slot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Attendance by Time Slot</h3>
          <div className="space-y-3">
            {attendanceByTimeSlot.map((slot, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{slot.slot}</span>
                  <span className={`font-bold ${
                    slot.percentage >= 90 ? 'text-green-400' :
                    slot.percentage >= 75 ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {slot.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${slot.percentage}%` }}
                      transition={{ duration: 1, delay: 1.4 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        slot.percentage >= 90 ? 'bg-green-500' :
                        slot.percentage >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{slot.count} classes</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Parent Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Parent Notifications</h3>
            <p className="text-sm text-gray-400">Automatic alerts sent to parents</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Auto-Enabled</span>
          </div>
        </div>
        <div className="space-y-3">
          {parentNotifications.map((notification, index) => (
            <div key={index} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{notification.message}</p>
                  <p className="text-sm text-gray-400">{notification.date}</p>
                </div>
              </div>
              {notification.sent && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sent</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}