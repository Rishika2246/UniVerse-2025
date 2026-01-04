import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, FileText, Upload, Download, Check, X,
  Clock, AlertCircle, CheckCircle, Eye, MessageSquare,
  TrendingUp, Star, Award, Sparkles, Send, DollarSign,
  UserPlus, Settings, Bell, Target, BarChart3, Mail, Plus, Edit,
  Brain, Zap, Lightbulb, Hash, TrendingDown,
  Activity, Gift, Shield, Search, Filter, ChevronDown, MoreVertical
} from 'lucide-react';
import { AIClubSupport } from './AIClubSupport';
import { ClubBudgetTab } from './ClubBudgetTab';
import { ClubFeedbackTab } from './ClubFeedbackTab';
import { ClubAnalyticsTab } from './ClubAnalyticsTab';
import { ClubCalendarView } from './ClubCalendarView';
import { EventManagementSystem } from './EventManagementSystem';

interface ClubCoordinatorDashboardProps {
  user: any;
}

export function ClubCoordinatorDashboard({ user }: ClubCoordinatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'clubs' | 'budget' | 'feedback' | 'analytics' | 'calendar' | 'events' | 'ai'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAISupport, setShowAISupport] = useState(false);
  const [selectedClubForAI, setSelectedClubForAI] = useState<any>(null);

  const stats = [
    { icon: Clock, label: 'Pending Requests', value: '12', color: 'from-orange-500 to-red-500', trend: '+3' },
    { icon: CheckCircle, label: 'Approved Events', value: '34', color: 'from-green-500 to-teal-500', trend: '+8' },
    { icon: Calendar, label: 'Upcoming Events', value: '8', color: 'from-cyan-500 to-blue-500', trend: '+2' },
    { icon: Users, label: 'Active Clubs', value: '15', color: 'from-purple-500 to-pink-500', trend: '0' },
    { icon: DollarSign, label: 'Total Budget', value: '₹12.5L', color: 'from-yellow-500 to-orange-500', trend: '+₹2L' },
    { icon: Star, label: 'Avg Rating', value: '4.6', color: 'from-indigo-500 to-purple-500', trend: '+0.2' },
  ];

  const pendingRequests = [
    {
      id: 1,
      club: 'Tech Club',
      clubDomain: 'tech',
      event: 'Hackathon 2024',
      date: '2024-04-15',
      venue: 'Main Auditorium',
      participants: 200,
      budget: '₹50,000',
      priority: 'high',
      documents: ['Proposal.pdf', 'Budget.xlsx', 'Agenda.docx'],
      submittedOn: '2024-03-01',
      description: 'A 24-hour coding hackathon with industry mentors and exciting prizes.',
      aiSuggestions: ['High participation potential', 'No exam conflicts', 'Budget is realistic']
    },
    {
      id: 2,
      club: 'Music Society',
      clubDomain: 'cultural',
      event: 'Spring Concert',
      date: '2024-04-20',
      venue: 'Open Air Theatre',
      participants: 500,
      budget: '75,000',
      priority: 'medium',
      documents: ['Event_Plan.pdf', 'Artist_List.pdf'],
      submittedOn: '2024-03-05',
      description: 'Annual spring concert featuring student bands and guest performers.',
      aiSuggestions: ['Weather dependent - backup plan needed', 'Peak attendance expected', 'Consider sound equipment rental']
    },
    {
      id: 3,
      club: 'Drama Club',
      clubDomain: 'cultural',
      event: 'Theatre Workshop',
      date: '2024-04-10',
      venue: 'Drama Hall',
      participants: 50,
      budget: '₹15,000',
      priority: 'low',
      documents: ['Workshop_Details.pdf'],
      submittedOn: '2024-03-08',
      description: 'Interactive workshop on contemporary theatre techniques.',
      aiSuggestions: ['Low cost, high value', 'Easy to organize', 'Good timing']
    },
  ];

  const approvedEvents = [
    {
      id: 4,
      club: 'Photography Club',
      event: 'Photo Walk',
      date: '2024-03-25',
      status: 'scheduled',
      participants: 30,
      approvedOn: '2024-02-20',
      budget: '₹5,000'
    },
    {
      id: 5,
      club: 'Dance Society',
      event: 'Dance Competition',
      date: '2024-04-05',
      status: 'scheduled',
      participants: 150,
      approvedOn: '2024-02-25',
      budget: '₹30,000'
    },
  ];

  const clubsData = [
    {
      id: 1,
      name: 'Tech Club',
      domain: 'tech',
      members: 156,
      eventsThisYear: 24,
      rating: 4.8,
      budget: '₹3.5L',
      budgetUsed: 72,
      coordinator: 'Raj Kumar',
      description: 'Technical excellence through innovation',
      upcomingEvents: 3,
      activeMembers: 142
    },
    {
      id: 2,
      name: 'Cultural Society',
      domain: 'cultural',
      members: 203,
      eventsThisYear: 18,
      rating: 4.7,
      budget: '₹2.8L',
      budgetUsed: 65,
      coordinator: 'Priya Sharma',
      description: 'Celebrating diversity through arts',
      upcomingEvents: 2,
      activeMembers: 189
    },
    {
      id: 3,
      name: 'Sports Club',
      domain: 'sports',
      members: 178,
      eventsThisYear: 15,
      rating: 4.6,
      budget: '₹2.2L',
      budgetUsed: 58,
      coordinator: 'Amit Patel',
      description: 'Fitness and competitive spirit',
      upcomingEvents: 2,
      activeMembers: 165
    },
    {
      id: 4,
      name: 'Music Society',
      domain: 'cultural',
      members: 134,
      eventsThisYear: 12,
      rating: 4.5,
      budget: '₹1.8L',
      budgetUsed: 45,
      coordinator: 'Sarah Johnson',
      description: 'Harmony through melodies',
      upcomingEvents: 1,
      activeMembers: 120
    },
    {
      id: 5,
      name: 'Drama Club',
      domain: 'cultural',
      members: 89,
      eventsThisYear: 10,
      rating: 4.4,
      budget: '₹1.2L',
      budgetUsed: 38,
      coordinator: 'Ravi Mehta',
      description: 'Stories that move hearts',
      upcomingEvents: 1,
      activeMembers: 78
    }
  ];

  const handleApprove = (request: any) => {
    alert(`Event "${request.event}" approved! It will be added to the campus calendar and the club will be notified.`);
    setSelectedRequest(null);
  };

  const handleReject = (request: any) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Event "${request.event}" rejected. Notification sent to ${request.club} with feedback: "${reason}"`);
      setSelectedRequest(null);
    }
  };

  const handleRequestChanges = (request: any) => {
    const feedback = prompt('Please provide feedback for requested changes:');
    if (feedback) {
      alert(`Feedback sent to ${request.club} for event "${request.event}": "${feedback}"`);
      setSelectedRequest(null);
    }
  };

  const openAISupport = (club: any) => {
    setSelectedClubForAI(club);
    setShowAISupport(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Club & Event Coordination</h2>
            <p className="text-slate-600">Review event proposals, manage club activities, and coordinate campus events</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('calendar')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
            >
              <Calendar className="w-5 h-5" />
              Event Calendar
            </motion.button>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-xs text-slate-600">{stat.label}</p>
              </div>
              <span className="text-xs font-semibold text-green-600">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyan-200 overflow-x-auto pb-2">
        {[
          { id: 'events', label: 'Event Management', icon: Settings },
          { id: 'pending', label: 'Pending Requests', icon: Clock, badge: 12 },
          { id: 'approved', label: 'Approved Events', icon: CheckCircle },
          { id: 'clubs', label: 'Club Management', icon: Users },
          { id: 'calendar', label: 'Event Calendar', icon: Calendar },
          { id: 'budget', label: 'Budget', icon: DollarSign },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-b from-cyan-100 to-blue-100 border-b-2 border-cyan-500 text-cyan-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {tab.badge && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Event Management Tab */}
        {activeTab === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EventManagementSystem />
          </motion.div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-slate-800">{request.event}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.priority === 'high' ? 'bg-red-100 text-red-600' :
                          request.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {request.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-cyan-600 font-semibold mb-2">{request.club}</p>
                      <p className="text-slate-600 text-sm mb-3">{request.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm text-slate-700">{request.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm text-slate-700">{request.participants} attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm text-slate-700">{request.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm text-slate-700">{request.documents.length} docs</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestChanges(request);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Request Changes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(request);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Approved Events Tab */}
        {activeTab === 'approved' && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {approvedEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-slate-800">{event.event}</h4>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        APPROVED
                      </span>
                    </div>
                    <p className="text-cyan-600 font-semibold mb-3">{event.club}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-slate-700">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-slate-700">{event.participants} attendees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-slate-700">{event.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">Approved on {event.approvedOn}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      <Send className="w-4 h-4" />
                      Send Update
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Club Management Tab */}
        {activeTab === 'clubs' && (
          <motion.div
            key="clubs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubsData.map((club) => (
                <motion.div
                  key={club.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-1">{club.name}</h4>
                      <p className="text-sm text-slate-600 mb-3">{club.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-slate-800">{club.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-3">
                      <p className="text-xs text-slate-600 mb-1">Members</p>
                      <p className="text-lg font-bold text-slate-800">{club.members}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-3">
                      <p className="text-xs text-slate-600 mb-1">Events</p>
                      <p className="text-lg font-bold text-slate-800">{club.eventsThisYear}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3">
                      <p className="text-xs text-slate-600 mb-1">Budget</p>
                      <p className="text-lg font-bold text-slate-800">{club.budget}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-3">
                      <p className="text-xs text-slate-600 mb-1">Used</p>
                      <p className="text-lg font-bold text-slate-800">{club.budgetUsed}%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>Budget Utilization</span>
                      <span>{club.budgetUsed}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${club.budgetUsed}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          club.budgetUsed > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          club.budgetUsed > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button 
                      onClick={() => openAISupport(club)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Brain className="w-4 h-4" />
                      AI Support
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ClubBudgetTab />
          </motion.div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ClubFeedbackTab />
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ClubAnalyticsTab />
          </motion.div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ClubCalendarView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Club Support Modal */}
      <AnimatePresence>
        {showAISupport && selectedClubForAI && (
          <AIClubSupport
            onClose={() => {
              setShowAISupport(false);
              setSelectedClubForAI(null);
            }}
            clubName={selectedClubForAI.name}
            clubDomain={selectedClubForAI.domain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}