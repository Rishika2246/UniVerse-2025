import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, X, ChevronLeft, ChevronRight, Plus, Edit2, Trash2,
  CheckCircle, AlertCircle, AlertTriangle, Target, Brain, BookOpen,
  Coffee, TrendingUp, Zap, Flame, Award, RotateCcw, Play, Pause,
  SkipForward, Eye, EyeOff, Sparkles, Bell, Moon, Sun, RefreshCw,
  Check, XCircle, Settings, BarChart3, Activity, Star, Trophy
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  syllabusSize: number; // in hours
  completed: number; // percentage
  priority: 'high' | 'medium' | 'low';
  examDate: Date;
  topics: string[];
  weakTopics?: string[];
}

interface RevisionSession {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  type: 'light' | 'heavy';
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'pending' | 'shifted' | 'skipped';
  completed?: boolean;
  shiftedFrom?: Date;
}

interface DayPlan {
  date: Date;
  sessions: RevisionSession[];
  totalLoad: number; // in minutes
  isRestDay: boolean;
  isAdjusted: boolean;
  loadType: 'light' | 'moderate' | 'heavy' | 'rest';
}

interface RevisionPlannerProps {
  onClose: () => void;
}

export function RevisionPlanner({ onClose }: RevisionPlannerProps) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  const [revisionMode, setRevisionMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFloatingWidget, setShowFloatingWidget] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Data Structures',
      syllabusSize: 40,
      completed: 65,
      priority: 'high',
      examDate: new Date(2025, 0, 15),
      topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hashing'],
      weakTopics: ['Graphs', 'Trees']
    },
    {
      id: '2',
      name: 'Database Management',
      syllabusSize: 35,
      completed: 70,
      priority: 'high',
      examDate: new Date(2025, 0, 18),
      topics: ['SQL', 'Normalization', 'Transactions', 'Indexing'],
      weakTopics: ['Transactions']
    },
    {
      id: '3',
      name: 'Operating Systems',
      syllabusSize: 38,
      completed: 55,
      priority: 'medium',
      examDate: new Date(2025, 0, 22),
      topics: ['Processes', 'Memory Management', 'File Systems', 'Deadlocks'],
      weakTopics: ['Deadlocks', 'Memory Management']
    },
    {
      id: '4',
      name: 'Computer Networks',
      syllabusSize: 30,
      completed: 80,
      priority: 'low',
      examDate: new Date(2025, 0, 25),
      topics: ['TCP/IP', 'Routing', 'Network Security', 'Protocols']
    }
  ]);

  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [revisionStreak, setRevisionStreak] = useState(7);
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(23);

  // Generate week plan
  useEffect(() => {
    generateWeekPlan();
  }, [selectedWeek, subjects]);

  const generateWeekPlan = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + selectedWeek * 7);
    
    const plan: DayPlan[] = [];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      
      const sessions = generateDaySessions(dayDate, i);
      const totalLoad = sessions.reduce((sum, s) => sum + s.duration, 0);
      
      // Detect if day should be rest day
      const isRestDay = shouldBeRestDay(i, totalLoad, sessions);
      const loadType = getLoadType(totalLoad, isRestDay);
      
      plan.push({
        date: dayDate,
        sessions: isRestDay ? [] : sessions,
        totalLoad: isRestDay ? 0 : totalLoad,
        isRestDay,
        isAdjusted: false,
        loadType
      });
    }
    
    setWeekPlan(plan);
  };

  const generateDaySessions = (date: Date, dayIndex: number): RevisionSession[] => {
    const sessions: RevisionSession[] = [];
    const dayOfWeek = date.getDay();
    
    // Avoid heavy sessions on Sunday (0) and suggest lighter days
    if (dayOfWeek === 0) return sessions;
    
    // Prioritize subjects by exam proximity and priority
    const sortedSubjects = [...subjects].sort((a, b) => {
      const daysToExamA = Math.ceil((a.examDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const daysToExamB = Math.ceil((b.examDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      // Prioritize closer exams
      if (daysToExamA !== daysToExamB) return daysToExamA - daysToExamB;
      
      // Then by priority
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    // Generate 2-4 sessions per day
    const sessionCount = dayOfWeek === 6 ? 2 : (dayIndex === 3 ? 2 : 3); // Lighter on Saturdays and mid-week
    
    for (let i = 0; i < sessionCount && i < sortedSubjects.length; i++) {
      const subject = sortedSubjects[i];
      const topic = subject.weakTopics && subject.weakTopics.length > 0 
        ? subject.weakTopics[i % subject.weakTopics.length]
        : subject.topics[i % subject.topics.length];
      
      const isHeavy = subject.priority === 'high' || (subject.weakTopics && subject.weakTopics.includes(topic));
      const duration = isHeavy ? 90 : 60;
      
      sessions.push({
        id: `${date.toISOString()}-${i}`,
        subject: subject.name,
        topic,
        duration,
        type: isHeavy ? 'heavy' : 'light',
        priority: subject.priority,
        status: 'pending',
        completed: false
      });
    }
    
    return sessions;
  };

  const shouldBeRestDay = (dayIndex: number, totalLoad: number, sessions: RevisionSession[]): boolean => {
    // Suggest rest on Sunday or if overloaded
    if (dayIndex === 0) return true;
    if (totalLoad > 240) return true; // More than 4 hours
    
    // Mid-week light day
    if (dayIndex === 3 && sessions.filter(s => s.type === 'heavy').length > 2) return true;
    
    return false;
  };

  const getLoadType = (totalLoad: number, isRestDay: boolean): 'light' | 'moderate' | 'heavy' | 'rest' => {
    if (isRestDay) return 'rest';
    if (totalLoad < 90) return 'light';
    if (totalLoad < 180) return 'moderate';
    return 'heavy';
  };

  const handleSessionComplete = (dayIndex: number, sessionId: string) => {
    const updatedPlan = [...weekPlan];
    const session = updatedPlan[dayIndex].sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.status = 'completed';
      session.completed = true;
      setTotalSessionsCompleted(prev => prev + 1);
      setWeekPlan(updatedPlan);
    }
  };

  const handleSessionSkip = (dayIndex: number, sessionId: string) => {
    const updatedPlan = [...weekPlan];
    const session = updatedPlan[dayIndex].sessions.find(s => s.id === sessionId);
    
    if (session) {
      session.status = 'skipped';
      
      // Auto-adjust: Move to next available day
      const nextDayIndex = dayIndex + 1;
      if (nextDayIndex < 7) {
        const shiftedSession = { 
          ...session, 
          id: `${updatedPlan[nextDayIndex].date.toISOString()}-shifted`,
          status: 'shifted' as const,
          shiftedFrom: updatedPlan[dayIndex].date 
        };
        updatedPlan[nextDayIndex].sessions.push(shiftedSession);
        updatedPlan[nextDayIndex].totalLoad += session.duration;
        updatedPlan[nextDayIndex].isAdjusted = true;
      }
      
      setWeekPlan(updatedPlan);
    }
  };

  const handleAddSession = (dayIndex: number) => {
    const updatedPlan = [...weekPlan];
    const newSession: RevisionSession = {
      id: `${updatedPlan[dayIndex].date.toISOString()}-custom`,
      subject: subjects[0].name,
      topic: 'Custom Topic',
      duration: 60,
      type: 'light',
      priority: 'medium',
      status: 'pending',
      completed: false
    };
    
    updatedPlan[dayIndex].sessions.push(newSession);
    updatedPlan[dayIndex].totalLoad += 60;
    setWeekPlan(updatedPlan);
  };

  const getDaysUntilExam = (subject: Subject) => {
    const today = new Date();
    const days = Math.ceil((subject.examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    return {
      high: 'from-red-400 to-orange-500',
      medium: 'from-amber-400 to-yellow-500',
      low: 'from-green-400 to-emerald-500'
    }[priority];
  };

  const getLoadColor = (loadType: string) => {
    return {
      rest: 'from-green-400 to-emerald-500',
      light: 'from-cyan-400 to-blue-400',
      moderate: 'from-amber-400 to-orange-400',
      heavy: 'from-red-400 to-rose-500'
    }[loadType] || 'from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-cyan-200"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl border-b border-cyan-200 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/30 to-purple-200/30" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Revision Week Generator
                </h2>
                <p className="text-slate-600 mt-1">Smart daily revision planning with auto-adjustment</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Revision Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRevisionMode(!revisionMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  revisionMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-white/60 text-slate-700 border border-cyan-200'
                }`}
              >
                {revisionMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {revisionMode ? 'Focus Mode' : 'Normal Mode'}
              </motion.button>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/60 hover:bg-white/80 rounded-xl flex items-center justify-center transition-all border border-cyan-200"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="relative mt-6 flex items-center gap-4">
            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-600">Revision Streak</p>
                  <p className="text-xl font-bold text-slate-800">{revisionStreak} days</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-slate-600">Sessions Completed</p>
                  <p className="text-xl font-bold text-slate-800">{totalSessionsCompleted}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-600">Achievement</p>
                  <p className="text-sm font-bold text-amber-600">Consistent Revising</p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-xs text-slate-600">Weekly Progress</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-cyan-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '68%' }} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Subjects Overview */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-500" />
                    Subjects
                  </h3>
                  <button className="text-cyan-500 hover:text-cyan-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {subjects.map((subject) => {
                    const daysUntil = getDaysUntilExam(subject);
                    const urgency = daysUntil <= 5 ? 'critical' : daysUntil <= 10 ? 'warning' : 'normal';
                    
                    return (
                      <div key={subject.id} className="bg-white/70 border border-cyan-100 rounded-xl p-3 hover:bg-white/90 transition-all shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{subject.name}</h4>
                            <p className="text-xs text-slate-600 mt-1">
                              Exam in {daysUntil} days
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getPriorityColor(subject.priority)} text-white`}>
                            {subject.priority.toUpperCase()}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">Completion</span>
                            <span className="text-xs font-bold text-slate-800">{subject.completed}%</span>
                          </div>
                          <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getPriorityColor(subject.priority)}`}
                              style={{ width: `${subject.completed}%` }}
                            />
                          </div>
                        </div>

                        {/* Weak Topics */}
                        {subject.weakTopics && subject.weakTopics.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-cyan-100">
                            <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-orange-500" />
                              Weak Areas
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {subject.weakTopics.map((topic, idx) => (
                                <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-lg border border-orange-200">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Urgency Indicator */}
                        {urgency === 'critical' && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-2 py-1.5 rounded-lg border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            Critical - Exam very close!
                          </div>
                        )}
                        {urgency === 'warning' && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Focus needed soon
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reminder Card */}
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 backdrop-blur-xl border border-cyan-300 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Today's Reminder</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Complete Data Structures revision (2 sessions) • Keep up the streak! 🔥
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Week Plan */}
            <div className="col-span-9 space-y-4">
              {/* Week Navigation */}
              <div className="bg-white/60 backdrop-blur-xl border border-cyan-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 rounded-xl border border-cyan-200 text-slate-700 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Week
                  </button>

                  <div className="text-center">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {selectedWeek === 0 ? 'Current Week' : selectedWeek > 0 ? `Week +${selectedWeek}` : `Week ${selectedWeek}`}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {weekPlan[0]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekPlan[6]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 rounded-xl border border-cyan-200 text-slate-700 transition-all"
                  >
                    Next Week
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-3">
                {weekPlan.map((day, dayIndex) => {
                  const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayDate = day.date.getDate();
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  
                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dayIndex * 0.05 }}
                      className={`bg-gradient-to-br ${
                        day.isRestDay 
                          ? 'from-green-50 to-emerald-50 border-green-300' 
                          : 'from-white/70 to-cyan-50/50 border-cyan-200'
                      } backdrop-blur-xl border rounded-2xl p-4 ${
                        isToday ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20' : ''
                      }`}
                    >
                      {/* Day Header */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-800">{dayName}</h4>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                            isToday 
                              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white' 
                              : 'bg-cyan-100 text-slate-700'
                          }`}>
                            {dayDate}
                          </div>
                        </div>

                        {/* Load Indicator */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-cyan-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getLoadColor(day.loadType)}`}
                              style={{ width: day.isRestDay ? '0%' : `${Math.min((day.totalLoad / 240) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">
                            {day.isRestDay ? 'Rest' : `${Math.floor(day.totalLoad / 60)}h ${day.totalLoad % 60}m`}
                          </span>
                        </div>

                        {/* Load Type Badge */}
                        <div className="mt-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${getLoadColor(day.loadType)}`}>
                            {day.loadType === 'rest' && <Moon className="w-3 h-3" />}
                            {day.loadType === 'light' && <Sun className="w-3 h-3" />}
                            {day.loadType === 'moderate' && <Activity className="w-3 h-3" />}
                            {day.loadType === 'heavy' && <Zap className="w-3 h-3" />}
                            {day.loadType.toUpperCase()}
                          </div>
                        </div>

                        {/* Adjusted Indicator */}
                        {day.isAdjusted && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                            <RefreshCw className="w-3 h-3" />
                            Auto-adjusted
                          </div>
                        )}
                      </div>

                      {/* Sessions List */}
                      <div className="space-y-2 min-h-[200px]">
                        {day.isRestDay ? (
                          <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <Coffee className="w-12 h-12 text-green-500 mb-3" />
                            <p className="font-semibold text-green-600 mb-1">Recommended Rest Day</p>
                            <p className="text-xs text-slate-600">Recharge for better focus</p>
                          </div>
                        ) : (
                          <>
                            {day.sessions.map((session, sessionIndex) => (
                              <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: sessionIndex * 0.05 }}
                                className={`group relative bg-white/70 border rounded-xl p-3 hover:bg-white/90 transition-all ${
                                  session.status === 'completed' 
                                    ? 'border-green-300 bg-green-50' 
                                    : session.status === 'shifted'
                                    ? 'border-amber-300 bg-amber-50'
                                    : session.status === 'skipped'
                                    ? 'border-red-300 bg-red-50 opacity-50'
                                    : 'border-cyan-200'
                                }`}
                              >
                                {/* Session Type Badge */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    session.type === 'heavy' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-cyan-100 text-cyan-700'
                                  }`}>
                                    {session.type === 'heavy' ? '🔥 Heavy' : '✨ Light'}
                                  </div>
                                  
                                  {session.status === 'shifted' && (
                                    <div className="text-xs text-amber-600 flex items-center gap-1">
                                      <RotateCcw className="w-3 h-3" />
                                      Shifted
                                    </div>
                                  )}
                                </div>

                                {/* Subject and Topic */}
                                <h5 className="font-semibold text-slate-800 text-sm mb-1">{session.subject}</h5>
                                <p className="text-xs text-slate-600 mb-2">{session.topic}</p>

                                {/* Duration */}
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-3">
                                  <Clock className="w-3 h-3" />
                                  {session.duration} mins
                                </div>

                                {/* Action Buttons */}
                                {session.status === 'pending' && (
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleSessionComplete(dayIndex, session.id)}
                                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg text-xs font-semibold text-green-700 transition-all"
                                    >
                                      <Check className="w-3 h-3" />
                                      Done
                                    </button>
                                    <button
                                      onClick={() => handleSessionSkip(dayIndex, session.id)}
                                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg text-xs font-semibold text-red-700 transition-all"
                                    >
                                      <SkipForward className="w-3 h-3" />
                                      Skip
                                    </button>
                                  </div>
                                )}

                                {session.status === 'completed' && (
                                  <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-semibold">
                                    <CheckCircle className="w-4 h-4" />
                                    Completed
                                  </div>
                                )}
                              </motion.div>
                            ))}

                            {/* Add Session Button */}
                            {!revisionMode && (
                              <button
                                onClick={() => handleAddSession(dayIndex)}
                                className="w-full py-2 border-2 border-dashed border-cyan-300 hover:border-cyan-400 rounded-xl text-xs text-slate-600 hover:text-cyan-600 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Session
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Smart Suggestions Panel */}
              {!revisionMode && (
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-xl border border-purple-300 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 mb-2">💡 Smart Suggestions</h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-500 mt-0.5">•</span>
                          <span>Consider taking Wednesday as a light day - you have 3 heavy sessions scheduled</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>Data Structures exam is in 11 days - increase focus on Graphs and Trees (weak topics)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>Great job maintaining your 7-day streak! Keep it up for the "Week Warrior" badge</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating "What's Next?" Widget */}
        {showFloatingWidget && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 right-8 bg-gradient-to-br from-cyan-500/90 to-blue-600/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-cyan-500/30 max-w-xs"
          >
            <button
              onClick={() => setShowFloatingWidget(false)}
              className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
            >
              <X className="w-3 h-3 text-white" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-white mb-1">What's Next?</h5>
                <p className="text-sm text-white/90 mb-2">
                  Up next: Database Management - SQL (90 mins)
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '40%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-xs text-white/90 font-semibold">In 2h</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}