import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight,
  Search, Bell, Download, X, MapPin, Users, BookOpen, Trophy,
  Target, Flame, Zap, CheckCircle, AlertCircle, Filter, Eye,
  Edit2, Trash2, Copy, Share2, TrendingUp, BarChart3, Home,
  Sunrise, Sunset, Moon, Sun, GraduationCap, Brain, AlertTriangle,
  Star, Coffee, Dumbbell, Utensils, Lightbulb, TrendingDown,
  Play, Pause, SkipForward, Activity, Award, BookMarked,
  ClipboardCheck, FileText, GitBranch, Hash, Lock, Unlock

} from 'lucide-react';

interface CalendarEvent {
  id: number;
  title: string;
  type: 'class' | 'exam' | 'lab' | 'club' | 'deadline' | 'workshop' | 'sports' | 'event' | 'personal' | 'study';
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  professor?: string;
  important?: boolean;
  color: string;
  attendanceCritical?: boolean;
  examData?: {
    syllabus_completion: number;
    days_until: number;
    readiness: 'good' | 'warning' | 'critical';
  };
}

export function SmartCalendar({ user }: { user: any }) {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda' | 'timeline'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventFilter, setEventFilter] = useState('all');
  const [focusMode, setFocusMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showFloatingWidget, setShowFloatingWidget] = useState(true);

  // Extended events data with smart features
  const events: CalendarEvent[] = [
    { 
      id: 1, 
      title: 'Data Structures', 
      type: 'class', 
      date: new Date(2025, 0, 4), 
      startTime: '09:00', 
      endTime: '10:00', 
      location: 'Room 301', 
      professor: 'Dr. Rajesh Kumar', 
      color: 'blue',
      attendanceCritical: true
    },
    { 
      id: 2, 
      title: 'Web Development Lab', 
      type: 'lab', 
      date: new Date(2025, 0, 4), 
      startTime: '11:00', 
      endTime: '13:00', 
      location: 'Lab 202', 
      professor: 'Prof. Priya Sharma', 
      color: 'purple'
    },
    { 
      id: 3, 
      title: 'DBMS Mid-Sem Exam', 
      type: 'exam', 
      date: new Date(2025, 0, 8), 
      startTime: '14:00', 
      endTime: '17:00', 
      location: 'Hall A', 
      important: true, 
      color: 'red',
      examData: {
        syllabus_completion: 65,
        days_until: 4,
        readiness: 'warning'
      }
    },
    { 
      id: 4, 
      title: 'Tech Club Meeting', 
      type: 'club', 
      date: new Date(2025, 0, 4), 
      startTime: '17:00', 
      endTime: '18:30', 
      location: 'Club Room', 
      color: 'green'
    },
    { 
      id: 5, 
      title: 'Machine Learning', 
      type: 'class', 
      date: new Date(2025, 0, 5), 
      startTime: '10:00', 
      endTime: '11:00', 
      location: 'Room 205', 
      professor: 'Dr. Ananya Iyer', 
      color: 'blue'
    },
    { 
      id: 6, 
      title: 'AI Workshop', 
      type: 'workshop', 
      date: new Date(2025, 0, 5), 
      startTime: '15:00', 
      endTime: '18:00', 
      location: 'Auditorium', 
      important: true, 
      color: 'orange'
    },
    { 
      id: 7, 
      title: 'OS Assignment Due', 
      type: 'deadline', 
      date: new Date(2025, 0, 6), 
      startTime: '23:59', 
      endTime: '23:59', 
      location: 'Online Submit', 
      important: true, 
      color: 'red'
    },
    { 
      id: 8, 
      title: 'Basketball Practice', 
      type: 'sports', 
      date: new Date(2025, 0, 6), 
      startTime: '17:00', 
      endTime: '19:00', 
      location: 'Sports Complex', 
      color: 'yellow'
    },
    { 
      id: 9, 
      title: 'Study Session - Algorithms', 
      type: 'study', 
      date: new Date(2025, 0, 7), 
      startTime: '15:00', 
      endTime: '17:00', 
      location: 'Library', 
      color: 'purple'
    },
    { 
      id: 10, 
      title: 'Gym Workout', 
      type: 'personal', 
      date: new Date(2025, 0, 7), 
      startTime: '06:00', 
      endTime: '07:00', 
      location: 'Campus Gym', 
      color: 'yellow'
    },
    { 
      id: 11, 
      title: 'ML Final Exam', 
      type: 'exam', 
      date: new Date(2025, 0, 15), 
      startTime: '09:00', 
      endTime: '12:00', 
      location: 'Hall B', 
      important: true, 
      color: 'red',
      examData: {
        syllabus_completion: 45,
        days_until: 11,
        readiness: 'critical'
      }
    },
  ];

  const eventTypes = [
    { id: 'all', label: 'All Events', color: 'bg-white/10', count: events.length },
    { id: 'class', label: 'Classes', color: 'bg-blue-100/10 text-blue-300', count: events.filter(e => e.type === 'class').length },
    { id: 'exam', label: 'Exams', color: 'bg-red-100/10 text-red-300', count: events.filter(e => e.type === 'exam').length },
    { id: 'club', label: 'Clubs', color: 'bg-green-100/10 text-green-300', count: events.filter(e => e.type === 'club').length },
    { id: 'deadline', label: 'Deadlines', color: 'bg-orange-100/10 text-orange-300', count: events.filter(e => e.type === 'deadline').length },
    { id: 'study', label: 'Study', color: 'bg-purple-100/10 text-purple-300', count: events.filter(e => e.type === 'study').length },
  ];

  const getEventColor = (color: string) => {
    const colors: any = {
      blue: 'from-blue-400 to-cyan-400',
      purple: 'from-purple-400 to-pink-400',
      red: 'from-red-400 to-orange-400',
      green: 'from-green-400 to-teal-400',
      orange: 'from-orange-400 to-yellow-400',
      yellow: 'from-yellow-400 to-amber-400',
      pink: 'from-pink-400 to-rose-400',
    };
    return colors[color] || 'from-gray-400 to-gray-500';
  };

  // Smart Calendar Functions
  const calculateDayLoad = (date: Date): 'light' | 'busy' | 'high-stress' => {
    const dayEvents = getEventsForDate(date);
    const hasExam = dayEvents.some(e => e.type === 'exam');
    const hasDeadline = dayEvents.some(e => e.type === 'deadline');
    const eventCount = dayEvents.length;

    if (hasExam && hasDeadline) return 'high-stress';
    if (hasExam || hasDeadline || eventCount >= 5) return 'high-stress';
    if (eventCount >= 3) return 'busy';
    return 'light';
  };

  const getLoadColor = (load: 'light' | 'busy' | 'high-stress') => {
    switch (load) {
      case 'light': return 'bg-green-400/20 border-green-400/40';
      case 'busy': return 'bg-yellow-400/20 border-yellow-400/40';
      case 'high-stress': return 'bg-red-400/20 border-red-400/40';
    }
  };

  const getLoadIcon = (load: 'light' | 'busy' | 'high-stress') => {
    switch (load) {
      case 'light': return '🟢';
      case 'busy': return '🟡';
      case 'high-stress': return '🔴';
    }
  };

  const generateSmartSuggestions = () => {
    const today = new Date();
    const todayEvents = getEventsForDate(today);
    const upcomingExams = events.filter(e => e.type === 'exam' && e.date > today);
    const upcomingDeadlines = events.filter(e => e.type === 'deadline' && e.date > today);

    const suggestions = [];

    // Exam preparation suggestions
    upcomingExams.forEach(exam => {
      if (exam.examData) {
        const daysUntil = exam.examData.days_until;
        if (daysUntil <= 3 && exam.examData.syllabus_completion < 70) {
          suggestions.push({
            type: 'urgent',
            icon: AlertTriangle,
            message: `${exam.title} in ${daysUntil} days - Only ${exam.examData.syllabus_completion}% syllabus complete!`,
            action: 'Start studying now',
            color: 'red'
          });
        } else if (daysUntil <= 7 && exam.examData.syllabus_completion < 80) {
          suggestions.push({
            type: 'warning',
            icon: Brain,
            message: `${exam.title} approaching - Revise ${100 - exam.examData.syllabus_completion}% remaining`,
            action: 'Create study plan',
            color: 'orange'
          });
        }
      }
    });

    // Free slot suggestions
    if (todayEvents.length < 3) {
      suggestions.push({
        type: 'info',
        icon: Lightbulb,
        message: 'Light day ahead - Perfect for deep work or revision',
        action: 'Block study time',
        color: 'blue'
      });
    }

    // Deadline approaching
    upcomingDeadlines.slice(0, 2).forEach(deadline => {
      const daysUntil = Math.ceil((deadline.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 2) {
        suggestions.push({
          type: 'urgent',
          icon: Clock,
          message: `${deadline.title} due in ${daysUntil} days`,
          action: 'Work on it',
          color: 'red'
        });
      }
    });

    // Attendance suggestions
    const criticalClasses = todayEvents.filter(e => e.attendanceCritical);
    if (criticalClasses.length > 0) {
      suggestions.push({
        type: 'important',
        icon: AlertCircle,
        message: `Critical attendance: ${criticalClasses[0].title}`,
        action: 'Do NOT miss',
        color: 'orange'
      });
    }

    return suggestions.slice(0, 4);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const isSameDate = event.date.toDateString() === date.toDateString();
      const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
      const matchesFocusMode = !focusMode || ['exam', 'deadline', 'study', 'class'].includes(event.type);
      return isSameDate && matchesFilter && matchesFocusMode;
    });
  };

  const getTodayEvents = () => {
    return events
      .filter(e => {
        const isToday = e.date.toDateString() === new Date().toDateString();
        const matchesFocusMode = !focusMode || ['exam', 'deadline', 'study', 'class'].includes(e.type);
        return isToday && matchesFocusMode;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getNextEvent = () => {
    const now = new Date();
    const upcomingEvents = events
      .filter(e => e.date >= now)
      .sort((a, b) => {
        const dateCompare = a.date.getTime() - b.date.getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
    return upcomingEvents[0];
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Calendar Heatmap Data
  const getMonthHeatmap = () => {
    const { daysInMonth } = getDaysInMonth(currentDate);
    const heatmap: { [key: number]: number } = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      heatmap[day] = getEventsForDate(date).length;
    }
    
    return heatmap;
  };

  // Month View with Enhanced Features
  const MonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    const heatmap = getMonthHeatmap();
    const maxEvents = Math.max(...Object.values(heatmap));

    return (
      <div className="space-y-4">
        {/* Calendar Grid */}
        <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-4 border-b border-cyan-200/20 pb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-bold text-cyan-300">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) return (
                <div 
                  key={`empty-${index}`} 
                  className="aspect-square rounded-xl bg-cyan-100/5"
                />
              );
              
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isPast = date < new Date() && !isToday;
              const dayLoad = calculateDayLoad(date);
              const eventIntensity = heatmap[date.getDate()] / (maxEvents || 1);
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-3 rounded-2xl transition-all relative overflow-hidden group ${
                    isToday
                      ? 'bg-gradient-to-br from-cyan-400/30 to-blue-400/30 border-2 border-cyan-400/60 shadow-lg shadow-cyan-400/20'
                      : isSelected
                      ? 'bg-gradient-to-br from-cyan-100/20 to-blue-100/20 border-2 border-cyan-300/40'
                      : isPast
                      ? 'bg-cyan-100/5 opacity-60'
                      : 'bg-cyan-100/10 hover:bg-cyan-100/20 border-2 border-transparent hover:border-cyan-300/30'
                  }`}
                  style={{
                    backgroundColor: !isPast && eventIntensity > 0 
                      ? `rgba(34, 211, 238, ${0.05 + eventIntensity * 0.15})` 
                      : undefined
                  }}
                >
                  {/* Day Load Indicator */}
                  {!isPast && dayEvents.length > 0 && (
                    <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getLoadColor(dayLoad)}`} />
                  )}

                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-bold mb-auto ${
                      isToday ? 'text-white' : isPast ? 'text-gray-500' : 'text-cyan-100'
                    }`}>
                      {date.getDate()}
                    </span>
                    
                    {dayEvents.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {dayEvents.slice(0, 2).map((event, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full bg-gradient-to-r ${getEventColor(event.color)} shadow-sm`}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-[10px] text-cyan-300 font-bold text-center">
                            +{dayEvents.length - 2}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isToday && (
                    <div className="absolute top-1 left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Events */}
        {getEventsForDate(selectedDate).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-300" />
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLoadColor(calculateDayLoad(selectedDate))}`}>
                {getLoadIcon(calculateDayLoad(selectedDate))} {calculateDayLoad(selectedDate).toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Smart Timeline View
  const TimelineView = () => {
    const next14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });

    return (
      <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-300" />
          Next 2 Weeks Timeline
        </h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-400" />
          
          <div className="space-y-6">
            {next14Days.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const dayLoad = calculateDayLoad(date);
              
              return (
                <div key={index} className="flex gap-6">
                  {/* Date Marker */}
                  <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${
                    isToday 
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-400 text-white shadow-lg shadow-cyan-400/30' 
                      : 'bg-cyan-100/10 text-cyan-200'
                  } border-2 ${
                    isToday ? 'border-cyan-300' : 'border-cyan-200/20'
                  }`}>
                    <span className="text-xs font-semibold">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold">{date.getDate()}</span>
                  </div>
                  
                  {/* Events */}
                  <div className="flex-1 space-y-2">
                    {dayEvents.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getLoadColor(dayLoad)}`}>
                            {getLoadIcon(dayLoad)}
                          </span>
                          <span className="text-cyan-200 text-sm">{dayEvents.length} events</span>
                        </div>
                        {dayEvents.map(event => (
                          <motion.div
                            key={event.id}
                            whileHover={{ x: 4 }}
                            className={`p-3 rounded-xl bg-gradient-to-r ${getEventColor(event.color)}/20 border border-white/10 cursor-pointer`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-bold text-sm">{event.title}</p>
                                <p className="text-xs text-cyan-200">
                                  {event.startTime} • {event.location}
                                </p>
                              </div>
                              {event.important && (
                                <span className="px-2 py-1 bg-red-400/20 text-red-300 text-xs rounded-full">
                                  Important
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm py-2">No events - Free day 😌</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Event Card Component
  const EventCard = ({ event, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-xl bg-gradient-to-r ${getEventColor(event.color)}/20 border border-cyan-200/20 hover:border-cyan-300/40 transition-all text-left group`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-bold">{event.title}</h4>
        <div className="flex gap-1">
          {event.important && (
            <span className="px-2 py-1 bg-red-400/20 text-red-300 text-xs rounded-full">Important</span>
          )}
          {event.attendanceCritical && (
            <span className="px-2 py-1 bg-orange-400/20 text-orange-300 text-xs rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Critical
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-cyan-200">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {event.startTime} - {event.endTime}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {event.location}
        </span>
      </div>
      {event.professor && (
        <p className="text-xs text-cyan-300 mt-2 flex items-center gap-1">
          <Users className="w-3 h-3" />
          {event.professor}
        </p>
      )}
      {event.examData && (
        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cyan-200">Syllabus Progress</span>
            <span className={`text-xs font-bold ${
              event.examData.syllabus_completion >= 70 ? 'text-green-300' : 
              event.examData.syllabus_completion >= 50 ? 'text-yellow-300' : 'text-red-300'
            }`}>
              {event.examData.syllabus_completion}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                event.examData.syllabus_completion >= 70 ? 'bg-green-400' : 
                event.examData.syllabus_completion >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${event.examData.syllabus_completion}%` }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );

  // Floating "What's Next" Widget
  const FloatingWidget = () => {
    const nextEvent = getNextEvent();
    if (!nextEvent || !showFloatingWidget) return null;

    const timeUntil = nextEvent.date.getTime() - new Date().getTime();
    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-cyan-400 to-blue-400 text-white rounded-2xl p-4 shadow-2xl shadow-cyan-400/30 border-2 border-white/20 max-w-xs"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <h4 className="font-bold">What's Next?</h4>
          </div>
          <button 
            onClick={() => setShowFloatingWidget(false)}
            className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="font-bold text-lg">{nextEvent.title}</p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {hoursUntil > 0 && `${hoursUntil}h `}
              {minutesUntil}m away
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{nextEvent.location}</span>
          </div>
          {nextEvent.professor && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{nextEvent.professor}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const suggestions = generateSmartSuggestions();

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2 flex items-center gap-3">
              Smart Calendar
              {focusMode && (
                <span className="px-3 py-1 bg-purple-400/20 text-purple-300 text-sm rounded-full flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  Exam Mode
                </span>
              )}
            </h2>
            <p className="text-cyan-200">AI-powered academic planning & stress management</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFocusMode(!focusMode)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                focusMode 
                  ? 'bg-purple-400/30 text-purple-200 border-2 border-purple-400/40' 
                  : 'bg-cyan-100/10 text-cyan-200 border-2 border-cyan-200/20'
              }`}
            >
              <Brain className="w-4 h-4" />
              {focusMode ? 'Exit Exam Mode' : 'Exam Mode'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border-2 border-cyan-200/20 transition-colors"
            >
              <Bell className="w-5 h-5 text-cyan-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border-2 border-cyan-200/20 transition-colors"
            >
              <Download className="w-5 h-5 text-cyan-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards with Day Load & Exam Readiness */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-100/10 to-cyan-100/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-300" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{getTodayEvents().length}</h3>
          <p className="text-cyan-200 text-sm">Events Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-100/10 to-pink-100/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <AlertCircle className="w-5 h-5 text-red-300" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {events.filter(e => e.type === 'exam' && e.date > new Date()).length}
          </h3>
          <p className="text-purple-200 text-sm">Upcoming Exams</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-100/10 to-teal-100/10 backdrop-blur-xl rounded-2xl p-6 border border-green-200/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getLoadColor(calculateDayLoad(new Date()))}`}>
              {getLoadIcon(calculateDayLoad(new Date()))}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 capitalize">{calculateDayLoad(new Date())}</h3>
          <p className="text-green-200 text-sm">Today's Load</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-100/10 to-amber-100/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-200/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <Trophy className="w-5 h-5 text-yellow-300" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">12</h3>
          <p className="text-orange-200 text-sm">Day Streak</p>
        </motion.div>
      </div>

      {/* Smart Suggestions Panel */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-100/10 to-pink-100/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-200/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
              Smart Suggestions for You
            </h3>
            <button 
              onClick={() => setShowSuggestions(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-r from-${suggestion.color}-400/10 to-${suggestion.color}-400/5 border border-${suggestion.color}-200/20`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${suggestion.color}-400/20 flex items-center justify-center flex-shrink-0`}>
                    <suggestion.icon className={`w-5 h-5 text-${suggestion.color}-300`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold mb-1">{suggestion.message}</p>
                    <button className={`text-xs text-${suggestion.color}-300 hover:text-${suggestion.color}-200 font-semibold transition-colors flex items-center gap-1`}>
                      {suggestion.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* View Switcher */}
        <div className="flex gap-2 bg-cyan-100/10 p-1 rounded-xl border-2 border-cyan-200/20">
          {[
            { id: 'month', label: 'Month', icon: CalendarIcon },
            { id: 'timeline', label: 'Timeline', icon: TrendingUp },
            { id: 'day', label: 'Day', icon: Clock },
          ].map(v => (
            <motion.button
              key={v.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(v.id as any)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                view === v.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg shadow-cyan-400/20'
                  : 'text-cyan-200 hover:text-white hover:bg-cyan-100/10'
              }`}
            >
              <v.icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{v.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth}
            className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border-2 border-cyan-200/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-300" />
          </motion.button>
          
          <div className="text-center min-w-[200px]">
            <h3 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth}
            className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border-2 border-cyan-200/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-cyan-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 border-2 border-cyan-300/40 transition-colors font-semibold text-sm"
          >
            Today
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white transition-colors font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/20"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </motion.button>
        </div>
      </div>

      {/* Event Filters */}
      {!focusMode && (
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEventFilter(type.id)}
              className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold border-2 ${
                eventFilter === type.id
                  ? 'bg-cyan-100/20 text-white border-cyan-300/40 shadow-lg shadow-cyan-400/10'
                  : `${type.color} border-cyan-200/20 hover:bg-cyan-100/10`
              }`}
            >
              {type.label} ({type.count})
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'month' && <MonthView />}
          {view === 'timeline' && <TimelineView />}
          {view === 'day' && (
            <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-300" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {getTodayEvents().length > 0 ? (
                  getTodayEvents().map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Coffee className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white mb-2">No events today</h3>
                    <p className="text-cyan-200">Perfect day to catch up or relax 😌</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Exam Readiness Panel */}
      {events.filter(e => e.type === 'exam' && e.examData && e.date > new Date()).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-100/10 to-orange-100/10 backdrop-blur-xl rounded-3xl p-6 border border-red-200/20"
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-300" />
            Exam Readiness Dashboard
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {events
              .filter(e => e.type === 'exam' && e.examData && e.date > new Date())
              .map(exam => (
                <div key={exam.id} className="p-4 rounded-xl bg-white/5 border border-red-200/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">{exam.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      exam.examData!.readiness === 'good' ? 'bg-green-400/20 text-green-300' :
                      exam.examData!.readiness === 'warning' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-red-400/20 text-red-300'
                    }`}>
                      {exam.examData!.days_until} days left
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cyan-200">Syllabus Completion</span>
                      <span className={`font-bold ${
                        exam.examData!.syllabus_completion >= 70 ? 'text-green-300' :
                        exam.examData!.syllabus_completion >= 50 ? 'text-yellow-300' :
                        'text-red-300'
                      }`}>
                        {exam.examData!.syllabus_completion}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          exam.examData!.syllabus_completion >= 70 ? 'bg-green-400' :
                          exam.examData!.syllabus_completion >= 50 ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                        style={{ width: `${exam.examData!.syllabus_completion}%` }}
                      />
                    </div>
                    
                    {exam.examData!.readiness === 'critical' && (
                      <div className="mt-3 p-2 rounded-lg bg-red-400/10 border border-red-300/20 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                        <p className="text-red-200 text-xs">
                          You should start intensive revision now!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Floating Widget */}
      <FloatingWidget />

      {/* Add Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 max-w-lg w-full border-2 border-cyan-400/30 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Event</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-cyan-200 mb-2 block">Event Title</label>
                  <input
                    type="text"
                    placeholder="Enter event title..."
                    className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-cyan-200 mb-2 block">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white focus:border-cyan-400/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cyan-200 mb-2 block">Type</label>
                    <select className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white focus:border-cyan-400/60 focus:outline-none transition-colors">
                      <option value="class">Class</option>
                      <option value="exam">Exam</option>
                      <option value="club">Club</option>
                      <option value="deadline">Deadline</option>
                      <option value="study">Study Session</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-cyan-200 mb-2 block">Start Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white focus:border-cyan-400/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cyan-200 mb-2 block">End Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white focus:border-cyan-400/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-cyan-200 mb-2 block">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full px-4 py-3 bg-cyan-100/10 border-2 border-cyan-200/20 rounded-xl text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-semibold border-2 border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-cyan-400/20"
                >
                  Add Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-gradient-to-br ${getEventColor(selectedEvent.color)}/10 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full border-2 border-cyan-200/30 shadow-2xl`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full uppercase">
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">{selectedEvent.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-cyan-100">
                  <Clock className="w-5 h-5" />
                  <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-100">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedEvent.location}</span>
                </div>
                {selectedEvent.professor && (
                  <div className="flex items-center gap-3 text-cyan-100">
                    <Users className="w-5 h-5" />
                    <span>{selectedEvent.professor}</span>
                  </div>
                )}
              </div>

              {selectedEvent.attendanceCritical && (
                <div className="mb-4 p-3 rounded-xl bg-orange-400/10 border border-orange-300/20 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-300" />
                  <p className="text-orange-200 text-sm font-semibold">
                    Critical attendance - Do NOT miss this class!
                  </p>
                </div>
              )}

              {selectedEvent.examData && (
                <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-bold mb-3">Exam Readiness</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-cyan-200">Syllabus Progress</span>
                        <span className={`font-bold ${
                          selectedEvent.examData.syllabus_completion >= 70 ? 'text-green-300' :
                          selectedEvent.examData.syllabus_completion >= 50 ? 'text-yellow-300' :
                          'text-red-300'
                        }`}>
                          {selectedEvent.examData.syllabus_completion}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedEvent.examData.syllabus_completion >= 70 ? 'bg-green-400' :
                            selectedEvent.examData.syllabus_completion >= 50 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${selectedEvent.examData.syllabus_completion}%` }}
                        />
                      </div>
                    </div>
                    
                    {selectedEvent.examData.readiness === 'critical' && (
                      <div className="p-3 rounded-lg bg-red-400/10 border border-red-300/20">
                        <p className="text-red-200 text-sm font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Start intensive revision immediately!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 px-4 py-3 bg-red-400/20 hover:bg-red-400/30 text-red-300 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
