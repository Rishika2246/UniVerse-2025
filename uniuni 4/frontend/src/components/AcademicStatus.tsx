import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle, CheckCircle, XCircle, TrendingDown, BookOpen,
  Clock, Award, Target, BarChart3, Calendar, FileText, Download,
  ChevronRight, Info, AlertCircle, Zap, Activity, TrendingUp,
  GraduationCap, Flag, MapPin, Shield, Star, RefreshCw
} from 'lucide-react';

interface AcademicStatusProps {
  user: any;
}

interface Subject {
  code: string;
  name: string;
  credits: number;
  status: 'passed' | 'failed' | 'backlog';
  grade?: string;
  semester: number;
}

interface StatusChange {
  id: string;
  date: Date;
  event: string;
  oldStatus: string;
  newStatus: string;
  reason: string;
}

export function AcademicStatus({ user }: AcademicStatusProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'backlog' | 'timeline'>('overview');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  // Mock data - in real app, fetch from API
  const academicData = {
    currentStatus: 'credit-shortage', // 'promoted' | 'credit-shortage' | 'detained'
    totalCreditsRequired: 160,
    creditsEarned: 142,
    creditsShortage: 18,
    currentYear: 3,
    cgpa: 7.8,
    backlogCount: 3,
    promotionStatus: 'provisional', // 'confirmed' | 'provisional' | 'blocked'
  };

  const backlogSubjects: Subject[] = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, status: 'backlog', semester: 3 },
    { code: 'CS302', name: 'Computer Networks', credits: 4, status: 'backlog', semester: 3 },
    { code: 'MA201', name: 'Probability & Statistics', credits: 4, status: 'backlog', semester: 2 },
  ];

  const allSubjects: Subject[] = [
    { code: 'CS101', name: 'Programming Fundamentals', credits: 4, status: 'passed', grade: 'A', semester: 1 },
    { code: 'CS102', name: 'Data Structures', credits: 4, status: 'passed', grade: 'A-', semester: 1 },
    { code: 'MA101', name: 'Calculus I', credits: 4, status: 'passed', grade: 'B+', semester: 1 },
    { code: 'CS201', name: 'Algorithms', credits: 4, status: 'passed', grade: 'A', semester: 2 },
    { code: 'MA201', name: 'Probability & Statistics', credits: 4, status: 'backlog', semester: 2 },
    { code: 'CS301', name: 'Database Management Systems', credits: 4, status: 'backlog', semester: 3 },
    { code: 'CS302', name: 'Computer Networks', credits: 4, status: 'backlog', semester: 3 },
    { code: 'CS303', name: 'Operating Systems', credits: 4, status: 'passed', grade: 'B+', semester: 3 },
  ];

  const statusTimeline: StatusChange[] = [
    {
      id: '1',
      date: new Date('2024-05-15'),
      event: 'Semester 5 Results Declared',
      oldStatus: 'Year 2 Student',
      newStatus: 'Promoted to Year 3',
      reason: 'Initial promotion based on preliminary results'
    },
    {
      id: '2',
      date: new Date('2024-06-10'),
      event: 'Result Re-evaluation',
      oldStatus: 'Promoted to Year 3',
      newStatus: 'Provisionally Promoted',
      reason: 'Updated results revealed credit shortage in Semester 3'
    },
    {
      id: '3',
      date: new Date('2024-06-15'),
      event: 'Academic Status Review',
      oldStatus: 'Provisionally Promoted',
      newStatus: 'Credit Shortage Detected',
      reason: 'Missing 18 credits from failed subjects'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'promoted': return 'from-green-500 to-emerald-500';
      case 'credit-shortage': return 'from-orange-500 to-red-500';
      case 'detained': return 'from-red-500 to-pink-500';
      default: return 'from-cyan-500 to-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'promoted': return CheckCircle;
      case 'credit-shortage': return AlertTriangle;
      case 'detained': return XCircle;
      default: return Info;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'promoted': return 'Successfully Promoted';
      case 'credit-shortage': return 'Credit Shortage Detected';
      case 'detained': return 'Academic Detention';
      default: return 'Under Review';
    }
  };

  const filteredSubjects = selectedSemester === 'all' 
    ? allSubjects 
    : allSubjects.filter(s => s.semester === selectedSemester);

  const StatusIcon = getStatusIcon(academicData.currentStatus);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header with Status Alert */}
      <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-8 h-8 text-cyan-600" />
                <h1 className="text-3xl font-bold text-slate-800">Academic Status</h1>
              </div>
              <p className="text-slate-600">Real-time tracking of your academic progress and promotion status</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-1">Current Year</div>
              <div className="text-3xl font-bold text-cyan-600">{academicData.currentYear}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {academicData.currentStatus !== 'promoted' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden bg-gradient-to-r ${getStatusColor(academicData.currentStatus)} text-white rounded-2xl p-6 shadow-2xl`}
        >
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <StatusIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{getStatusText(academicData.currentStatus)}</h3>
              <p className="text-white/90 mb-4">
                Your promotion status has been re-evaluated due to updated results. You are currently missing {academicData.creditsShortage} credits required for unconditional promotion.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('credits')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all backdrop-blur-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Credit Breakdown
                </button>
                <button
                  onClick={() => setActiveTab('backlog')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all backdrop-blur-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  View Backlog Subjects
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all backdrop-blur-sm"
                >
                  <Clock className="w-4 h-4" />
                  Status Timeline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'credits', label: 'Credit Analysis', icon: BarChart3 },
            { id: 'backlog', label: 'Backlog Subjects', icon: AlertCircle },
            { id: 'timeline', label: 'Status Timeline', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl p-6 border border-cyan-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-8 h-8 text-cyan-600" />
                  <div className="px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-bold">CGPA</div>
                </div>
                <div className="text-4xl font-bold text-cyan-600 mb-1">{academicData.cgpa}</div>
                <p className="text-sm text-slate-700">Cumulative GPA</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">EARNED</div>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-1">{academicData.creditsEarned}</div>
                <p className="text-sm text-slate-700">Credits Completed</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 border border-orange-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                  <div className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-bold">SHORTAGE</div>
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-1">{academicData.creditsShortage}</div>
                <p className="text-sm text-slate-700">Credits Missing</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">BACKLOG</div>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-1">{academicData.backlogCount}</div>
                <p className="text-sm text-slate-700">Pending Subjects</p>
              </motion.div>
            </div>

            {/* Promotion Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Flag className="w-6 h-6 text-cyan-600" />
                Promotion Status
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${
                  academicData.promotionStatus === 'confirmed' ? 'from-green-500 to-emerald-500' :
                  academicData.promotionStatus === 'provisional' ? 'from-yellow-500 to-orange-500' :
                  'from-red-500 to-pink-500'
                }`}>
                  {academicData.promotionStatus === 'confirmed' ? '✓ Confirmed Promotion' :
                   academicData.promotionStatus === 'provisional' ? '⚠ Provisionally Promoted' :
                   '✗ Promotion Blocked'}
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                {academicData.promotionStatus === 'provisional' && 
                  'You are currently promoted to the next year with conditions. Clear all backlog subjects to confirm your promotion status.'}
              </p>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Next Steps:</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <ChevronRight className="w-4 h-4 text-cyan-600" />
                    Clear {academicData.backlogCount} backlog subjects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <ChevronRight className="w-4 h-4 text-cyan-600" />
                    Earn {academicData.creditsShortage} additional credits
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <ChevronRight className="w-4 h-4 text-cyan-600" />
                    Maintain minimum attendance (75%)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* CREDITS TAB */}
        {activeTab === 'credits' && (
          <motion.div
            key="credits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Credit Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {academicData.creditsEarned} / {academicData.totalCreditsRequired} Credits
                  </span>
                  <span className="text-sm font-semibold text-cyan-600">
                    {Math.round((academicData.creditsEarned / academicData.totalCreditsRequired) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-end px-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${(academicData.creditsEarned / academicData.totalCreditsRequired) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <span className="text-white text-xs font-bold">
                      {academicData.creditsEarned}
                    </span>
                  </motion.div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{academicData.creditsEarned}</div>
                  <div className="text-sm text-slate-600">Earned</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">{academicData.creditsShortage}</div>
                  <div className="text-sm text-slate-600">Shortage</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{academicData.totalCreditsRequired}</div>
                  <div className="text-sm text-slate-600">Required</div>
                </div>
              </div>
            </div>

            {/* Semester Filter */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedSemester('all')}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedSemester === 'all'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Semesters
                </button>
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedSemester === sem
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject List */}
            <div className="space-y-3">
              {filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-4 border shadow-lg ${
                    subject.status === 'passed' ? 'border-green-200' :
                    'border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        subject.status === 'passed' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {subject.status === 'passed' ? 
                          <CheckCircle className="w-6 h-6 text-green-600" /> :
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800">{subject.code}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                            Sem {subject.semester}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{subject.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-600">{subject.credits}</div>
                      <div className="text-xs text-slate-600">Credits</div>
                      {subject.grade && (
                        <div className="mt-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-bold">
                          {subject.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BACKLOG TAB */}
        {activeTab === 'backlog' && (
          <motion.div
            key="backlog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {academicData.backlogCount} Backlog Subject{academicData.backlogCount > 1 ? 's' : ''}
                  </h3>
                  <p className="text-white/90">These subjects must be cleared to confirm your promotion</p>
                </div>
              </div>
            </div>

            {backlogSubjects.map((subject, index) => (
              <motion.div
                key={subject.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-orange-200 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-1">{subject.code}</h4>
                      <p className="text-slate-600">{subject.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                          Semester {subject.semester}
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          {subject.credits} Credits
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold">
                    BACKLOG
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h5 className="font-semibold text-slate-800 mb-2">Action Required:</h5>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <ChevronRight className="w-4 h-4 text-orange-600" />
                      Register for re-examination
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <ChevronRight className="w-4 h-4 text-orange-600" />
                      Complete additional assignments (if applicable)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <ChevronRight className="w-4 h-4 text-orange-600" />
                      Minimum passing grade: D
                    </li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-600" />
                Academic Status Timeline
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500" />

                {statusTimeline.map((change, index) => (
                  <motion.div
                    key={change.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative pl-20 pb-8 last:pb-0"
                  >
                    {/* Timeline Dot */}
                    <motion.div
                      className="absolute left-6 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-4 border-white shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-slate-800">{change.event}</h4>
                        <span className="text-xs text-slate-500">
                          {change.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">From:</span>
                          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold">
                            {change.oldStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">To:</span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                            {change.newStatus}
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">Reason:</span> {change.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Download Report */}
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
              Download Academic Status Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
