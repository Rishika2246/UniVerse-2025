import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, BookOpen, Calendar, Users, Award, 
  MapPin, TrendingUp, Settings, LogOut, Menu, X,
  Bot, GraduationCap, ClipboardCheck, Trophy, Network,
  Scan, MessageSquare, Shield, Bell, ChevronDown, FileText,
  BarChart3, UserCheck, Building, Briefcase, Clock, Home,
  ArrowLeft, CheckCircle, MessageCircle, AlertTriangle, FileCheck, Bus, Upload
} from 'lucide-react';
import { StudentDashboard } from './StudentDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { SeatingManagerDashboard } from './SeatingManagerDashboard';
import { ClubCoordinatorDashboard } from './ClubCoordinatorDashboard';
import { UniVerseAIAssistant } from './AIAvatarAssistant';
import { AttendanceSuite } from './AttendanceSuite';
import { StudySuite } from './StudySuite';
import { ExamsCenter } from './ExamsCenter';
import { ClubsEvents } from './ClubsEvents';
import { StudentClubs } from './StudentClubs';
import { AlumniNetwork } from './AlumniNetwork';
import { ARMaps } from './ARMaps';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Gamification } from './Gamification';
import { SmartCalendar } from './SmartCalendar';
import { StudentProfile } from './StudentProfile';
import { SOSSystem } from './SOSSystem';
import { ClassroomGroups } from './ClassroomGroups';
import { PlacementCell } from './PlacementCell';
import { BusTracking } from './BusTracking';
import { StudentPortfolio } from './StudentPortfolio';
import { SmartCampusLive } from './SmartCampusLive';
import HallTicketManagement from './HallTicketManagement';
import FacultyDashboardEdgeCases from './FacultyDashboardEdgeCases';
import AdminDashboardEdgeCases from './AdminDashboardEdgeCases';
import SeatingManagerEdgeCases from './SeatingManagerEdgeCases';
import StudentDashboardEdgeCases from './StudentDashboardEdgeCases';

interface MainDashboardProps {
  user: any;
  onLogout: () => void;
}

type View = 'home' | 'dashboard' | 'ai-assistant' | 'attendance' | 'study' | 'exams' | 'clubs' | 'alumni' | 'maps' | 'analytics' | 'gamification' | 'calendar' | 'profile' | 'sos' | 'classroom' | 'placement' | 'bus-tracking' | 'portfolio' | 'smart-campus-live' | 'hall-ticket-management' | 'edge-cases';

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState(12);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const studentFeatures = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'My Dashboard', description: 'Overview of your academic journey', color: 'from-cyan-400 to-blue-500' },
    { id: 'classroom', icon: Users, label: 'Classroom Groups', description: 'Connect with classmates', color: 'from-purple-400 to-pink-500' },
    { id: 'ai-assistant', icon: Bot, label: 'AI Avatar Assistant', description: 'Your personal AI helper', color: 'from-indigo-400 to-violet-500' },
    { id: 'attendance', icon: ClipboardCheck, label: 'Attendance', description: 'Track your attendance records', color: 'from-green-400 to-teal-500' },
    { id: 'study', icon: BookOpen, label: 'Study Suite', description: 'Learning materials & resources', color: 'from-blue-400 to-indigo-500' },
    { id: 'exams', icon: GraduationCap, label: 'Exams Center', description: 'Exams, hall tickets, seating & results', color: 'from-orange-400 to-red-500' },
    { id: 'clubs', icon: MessageCircle, label: 'Clubs & Events', description: 'Campus activities & clubs', color: 'from-violet-400 to-purple-500' },
    { id: 'gamification', icon: Trophy, label: 'Achievements', description: 'Badges, points & leaderboard', color: 'from-yellow-400 to-orange-500' },
    { id: 'calendar', icon: Calendar, label: 'Smart Calendar', description: 'Schedule & timetable', color: 'from-teal-400 to-cyan-500' },
    { id: 'alumni', icon: Network, label: 'Alumni Network', description: 'Connect with alumni', color: 'from-indigo-400 to-blue-500' },
    { id: 'maps', icon: Scan, label: 'AR Campus Maps', description: 'Navigate with AR technology', color: 'from-emerald-400 to-green-500' },
    { id: 'analytics', icon: TrendingUp, label: 'My Analytics', description: 'Performance insights', color: 'from-rose-400 to-pink-500' },
    { id: 'sos', icon: Shield, label: 'SOS Emergency', description: 'Emergency help & safety', color: 'from-red-400 to-orange-500' },
    { id: 'placement', icon: Briefcase, label: 'Placement Cell', description: 'Job opportunities & placements', color: 'from-blue-400 to-indigo-500' },
    { id: 'bus-tracking', icon: Bus, label: 'Bus Tracking', description: 'Track your bus schedule', color: 'from-gray-400 to-gray-500' },
    { id: 'edge-cases', icon: AlertTriangle, label: 'Edge Cases Demo', description: 'System edge cases showcase', color: 'from-yellow-400 to-red-500' },
  ];

  const facultyFeatures = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Faculty overview', color: 'from-cyan-400 to-blue-500' },
    { id: 'academic', icon: BookOpen, label: 'Academic Delivery', description: 'Course materials & content', color: 'from-purple-400 to-pink-500' },
    { id: 'attendance', icon: UserCheck, label: 'Attendance', description: 'Record student attendance', color: 'from-green-400 to-teal-500' },
    { id: 'evaluation', icon: FileCheck, label: 'Evaluation', description: 'Grades & assessments', color: 'from-orange-400 to-red-500' },
    { id: 'communication', icon: MessageCircle, label: 'Communication', description: 'Announcements & messages', color: 'from-blue-400 to-indigo-500' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', description: 'Student performance data', color: 'from-pink-400 to-rose-500' },
    { id: 'events', icon: Calendar, label: 'Events', description: 'Schedule & activities', color: 'from-teal-400 to-cyan-500' },
    { id: 'students', icon: Users, label: 'Students', description: 'Manage student information', color: 'from-indigo-400 to-purple-500' },
    { id: 'edge-cases', icon: AlertTriangle, label: 'Edge Cases', description: 'Event management edge cases', color: 'from-yellow-400 to-red-500' },
  ];

  const adminFeatures = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'System overview', color: 'from-cyan-400 to-blue-500' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', description: 'Platform insights', color: 'from-purple-400 to-pink-500' },
    { id: 'users', icon: Users, label: 'User Management', description: 'Manage all users', color: 'from-green-400 to-teal-500' },
    { id: 'hall-ticket-management', icon: FileText, label: 'Hall Tickets', description: 'Bulk upload & delivery tracking', color: 'from-indigo-400 to-purple-500' },
    { id: 'system', icon: Settings, label: 'System', description: 'Advanced controls & logs', color: 'from-orange-400 to-red-500' },
    { id: 'seating', icon: Building, label: 'Seating & Halls', description: 'Configure exam halls', color: 'from-blue-400 to-indigo-500' },
    { id: 'calendar', icon: Calendar, label: 'Timetable', description: 'Manage schedules', color: 'from-orange-400 to-red-500' },
    { id: 'reports', icon: FileText, label: 'Reports', description: 'Generate reports', color: 'from-pink-400 to-rose-500' },
    { id: 'edge-cases', icon: AlertTriangle, label: 'Edge Cases', description: 'System edge cases & critical monitoring', color: 'from-red-400 to-orange-500' },
  ];

  const seatingManagerFeatures = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Seating management overview', color: 'from-cyan-400 to-blue-500' },
    { id: 'allocate', icon: Building, label: 'New Allocation', description: 'Create seating arrangements', color: 'from-purple-400 to-pink-500' },
    { id: 'manage', icon: FileText, label: 'Manage Allocations', description: 'View & edit existing', color: 'from-green-400 to-teal-500' },
    { id: 'hall-ticket-management', icon: Upload, label: 'Hall Tickets', description: 'Bulk upload & delivery tracking', color: 'from-indigo-400 to-purple-500' },
    { id: 'reports', icon: BarChart3, label: 'Reports', description: 'Generate seating reports', color: 'from-orange-400 to-red-500' },
    { id: 'edge-cases', icon: AlertTriangle, label: 'Edge Cases', description: 'Seating conflicts & critical issues', color: 'from-yellow-400 to-red-500' },
  ];

  const clubCoordinatorFeatures = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Coordination overview', color: 'from-cyan-400 to-blue-500' },
    { id: 'pending', icon: Clock, label: 'Pending Requests', description: 'Review event proposals', color: 'from-orange-400 to-red-500' },
    { id: 'clubs', icon: Users, label: 'Manage Clubs', description: 'Club profiles & activities', color: 'from-purple-400 to-pink-500' },
    { id: 'calendar', icon: Calendar, label: 'Event Calendar', description: 'Schedule & planning', color: 'from-blue-400 to-indigo-500' },
  ];

  const features = 
    user.role === 'faculty' ? facultyFeatures :
    user.role === 'admin' ? adminFeatures :
    user.role === 'seating-manager' ? seatingManagerFeatures :
    user.role === 'club-coordinator' ? clubCoordinatorFeatures :
    studentFeatures;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
      {/* Simplified Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-cyan-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  UniVerse
                </h1>
                <p className="text-xs text-gray-600">
                  {user.role === 'student' ? 'Student Portal' : 
                   user.role === 'faculty' ? 'Faculty Portal' : 'Admin Portal'}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 bg-white border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors shadow-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-600 transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Messages */}
              <button className="relative p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-600 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full border-2 border-white"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <span className="hidden lg:block text-gray-800 font-medium text-sm">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-64 bg-white border border-cyan-200 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">
                        <p className="text-gray-800 font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-cyan-600 mt-1 font-semibold">{user.role.toUpperCase()}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                      >
                        <Users className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Student Navigation Bar - Persistent across all student pages */}
        {user.role === 'student' && (
          <div className="sticky top-0 z-40 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 pt-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-lg mb-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-semibold">Dashboard</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('attendance')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'attendance'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="font-semibold">Attendance</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('study')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'study'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">Study Suite</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('exams')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'exams'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-semibold">Exams</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('clubs')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'clubs'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">Clubs</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('classroom')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'classroom'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Classroom</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('placement')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'placement'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="font-semibold">Placement</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('portfolio')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'portfolio'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">Portfolio</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('smart-campus-live')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'smart-campus-live'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Smart Campus</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('alumni')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'alumni'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <Network className="w-5 h-5" />
                  <span className="font-semibold">Alumni</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('sos')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'sos'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">SOS</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('bus-tracking')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    currentView === 'bus-tracking'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                  }`}
                >
                  <Bus className="w-5 h-5" />
                  <span className="font-semibold">Bus</span>
                </motion.button>

                {/* More Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      ['ai-assistant', 'analytics', 'calendar', 'gamification', 'maps'].includes(currentView)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                    }`}
                  >
                    <Menu className="w-5 h-5" />
                    <span className="font-semibold">More</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {moreMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setMoreMenuOpen(false)}
                        />
                        
                        {/* Dropdown Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 w-80 bg-white border-2 border-cyan-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                        >
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 sticky top-0 z-10">
                            <p className="text-white font-semibold text-sm">More Features</p>
                          </div>
                          
                          <div className="p-2">
                            <button
                              onClick={() => {
                                setCurrentView('ai-assistant');
                                setMoreMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                currentView === 'ai-assistant' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-semibold text-sm">AI Avatar Assistant</p>
                                <p className="text-xs text-gray-500">Your personal AI helper</p>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setCurrentView('calendar');
                                setMoreMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                currentView === 'calendar' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-teal-600" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-semibold text-sm">Smart Calendar</p>
                                <p className="text-xs text-gray-500">Schedule & timetable</p>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setCurrentView('gamification');
                                setMoreMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                currentView === 'gamification' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-semibold text-sm">Achievements</p>
                                <p className="text-xs text-gray-500">Badges & leaderboard</p>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setCurrentView('analytics');
                                setMoreMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                currentView === 'analytics' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-rose-600" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-semibold text-sm">My Analytics</p>
                                <p className="text-xs text-gray-500">Track your progress</p>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => {
                                setCurrentView('maps');
                                setMoreMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                currentView === 'maps' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Scan className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-semibold text-sm">AR Campus Maps</p>
                                <p className="text-xs text-gray-500">Navigate campus</p>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Faculty Navigation Bar - Persistent across all faculty pages */}
        {user.role === 'faculty' && (
          <div className="sticky top-0 z-40 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 pt-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-lg mb-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {facultyFeatures.map((feature) => (
                  <motion.button
                    key={feature.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(feature.id as View)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      currentView === feature.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                    <span className="font-semibold">{feature.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Navigation Bar - Persistent across all admin pages */}
        {user.role === 'admin' && (
          <div className="sticky top-0 z-40 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 pt-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-lg mb-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {adminFeatures.map((feature) => (
                  <motion.button
                    key={feature.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(feature.id as View)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      currentView === feature.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                    <span className="font-semibold">{feature.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Seating Manager Navigation Bar - Persistent across all seating manager pages */}
        {user.role === 'seating-manager' && (
          <div className="sticky top-0 z-40 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 pt-4 px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-lg mb-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                {seatingManagerFeatures.map((feature) => (
                  <motion.button
                    key={feature.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(feature.id as View)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      currentView === feature.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-cyan-50 text-gray-700 border border-cyan-100'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                    <span className="font-semibold">{feature.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' ? (
              <div className="p-6 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h2>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </motion.div>

                {/* Quick Access Navigation */}
                {user.role === 'student' && (
                  <>
                    {/* Top Navigation Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-lg mb-6"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('dashboard')}
                          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span className="font-semibold">Dashboard</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('attendance')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <ClipboardCheck className="w-5 h-5" />
                          <span className="font-semibold">Attendance</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('study')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <BookOpen className="w-5 h-5" />
                          <span className="font-semibold">Study Suite</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('exams')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <GraduationCap className="w-5 h-5" />
                          <span className="font-semibold">Exams</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('calendar')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <Calendar className="w-5 h-5" />
                          <span className="font-semibold">Calendar</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('classroom')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">Classroom</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('clubs')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-semibold">Clubs</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentView('gamification')}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                        >
                          <Trophy className="w-5 h-5" />
                          <span className="font-semibold">Achievements</span>
                        </motion.button>

                        {/* More Dropdown */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-cyan-50 text-gray-700 rounded-xl border border-cyan-100 transition-colors"
                          >
                            <Menu className="w-5 h-5" />
                            <span className="font-semibold">More</span>
                            <ChevronDown className="w-4 h-4" />
                          </motion.button>

                          <AnimatePresence>
                            {moreMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full mt-2 right-0 w-64 bg-white border border-cyan-200 rounded-xl shadow-xl overflow-hidden z-50"
                              >
                                <button
                                  onClick={() => {
                                    setCurrentView('ai-assistant');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                                >
                                  <Bot className="w-5 h-5 text-indigo-500" />
                                  <span>AI Avatar Assistant</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentView('analytics');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                                >
                                  <TrendingUp className="w-5 h-5 text-rose-500" />
                                  <span>My Analytics</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentView('alumni');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                                >
                                  <Network className="w-5 h-5 text-indigo-500" />
                                  <span>Alumni Network</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentView('placement');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                                >
                                  <Briefcase className="w-5 h-5 text-blue-500" />
                                  <span>Placement Cell</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentView('maps');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all"
                                >
                                  <Scan className="w-5 h-5 text-emerald-500" />
                                  <span>AR Campus Maps</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentView('sos');
                                    setMoreMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-cyan-50 transition-all border-t border-cyan-100"
                                >
                                  <Shield className="w-5 h-5 text-red-500" />
                                  <span>SOS Emergency</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-green-400/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-3xl font-bold text-gray-800 mb-1">95%</h4>
                        <p className="text-gray-600 font-medium">Attendance Rate</p>
                        <button
                          onClick={() => setCurrentView('attendance')}
                          className="mt-4 text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                        >
                          View Details →
                        </button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-orange-400/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-3xl font-bold text-gray-800 mb-1">8.5</h4>
                        <p className="text-gray-600 font-medium">Current CGPA</p>
                        <button
                          onClick={() => setCurrentView('analytics')}
                          className="mt-4 text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                        >
                          View Analytics →
                        </button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-3xl font-bold text-gray-800 mb-1">24</h4>
                        <p className="text-gray-600 font-medium">Achievements</p>
                        <button
                          onClick={() => setCurrentView('gamification')}
                          className="mt-4 text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                        >
                          View All →
                        </button>
                      </motion.div>
                    </div>
                  </>
                )}

                {/* For non-student roles, show original grid */}
                {user.role !== 'student' && user.role !== 'faculty' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <motion.button
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setCurrentView(feature.id as View)}
                        className="group relative bg-white rounded-2xl p-6 border border-cyan-200 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                        <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="relative">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors">
                            {feature.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {user.role === 'student' && (
                  <>
                    {currentView === 'dashboard' && <StudentDashboard user={user} onNavigate={setCurrentView} />}
                    {currentView === 'classroom' && <ClassroomGroups user={user} />}
                    {currentView === 'ai-assistant' && <UniVerseAIAssistant user={user} />}
                    {currentView === 'attendance' && <AttendanceSuite user={user} />}
                    {currentView === 'study' && <StudySuite user={user} />}
                    {currentView === 'exams' && <ExamsCenter user={user} />}
                    {currentView === 'clubs' && <StudentClubs user={user} />}
                    {currentView === 'alumni' && <AlumniNetwork user={user} />}
                    {currentView === 'maps' && <ARMaps user={user} />}
                    {currentView === 'analytics' && <AnalyticsDashboard user={user} />}
                    {currentView === 'gamification' && <Gamification user={user} />}
                    {currentView === 'calendar' && <SmartCalendar user={user} />}
                    {currentView === 'sos' && <SOSSystem user={user} />}
                    {currentView === 'profile' && <StudentProfile user={user} />}
                    {currentView === 'placement' && <PlacementCell user={user} />}
                    {currentView === 'bus-tracking' && <BusTracking user={user} />}
                    {currentView === 'portfolio' && <StudentPortfolio user={user} />}
                    {currentView === 'smart-campus-live' && <SmartCampusLive user={user} />}
                    {currentView === 'edge-cases' && <StudentDashboardEdgeCases />}
                  </>
                )}
                {user.role === 'faculty' && <FacultyDashboard user={user} currentView={currentView} />}
                {user.role === 'seating-manager' && currentView !== 'hall-ticket-management' && currentView !== 'edge-cases' && <SeatingManagerDashboard user={user} />}
                {user.role === 'club-coordinator' && <ClubCoordinatorDashboard user={user} />}
                {(user.role === 'admin' || user.role === 'seating-manager') && currentView === 'hall-ticket-management' && <HallTicketManagement />}
                {user.role === 'faculty' && currentView === 'edge-cases' && <FacultyDashboardEdgeCases />}
                {user.role === 'admin' && currentView === 'edge-cases' && <AdminDashboardEdgeCases />}
                {user.role === 'seating-manager' && currentView === 'edge-cases' && <SeatingManagerEdgeCases />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}