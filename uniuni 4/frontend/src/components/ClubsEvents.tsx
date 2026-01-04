import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Trophy, Star, TrendingUp, Clock, MapPin, Heart, Share2, 
  Settings, ChevronDown, ChevronUp, Plus, Upload, FileText, CheckCircle, 
  XCircle, Clock3, DollarSign, BarChart3, Download, Zap, Sparkles, 
  MessageSquare, Image as ImageIcon, Hash, Lightbulb, UserCheck, Network,
  Award, Target, Flame, Medal, Crown, Code, Dumbbell, Smile, Map, 
  QrCode, Navigation, Camera, Eye, Send, Edit, Trash2, Filter, Search,
  TrendingDown, Activity, PlayCircle, FileImage, Video, UserPlus, 
  ShieldCheck, Bell, PieChart, TrendingUpDown, Bot, Wand2, Brain,
  BadgeCheck, Gift, Ticket, AlertCircle, PhoneCall, Building
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ClubsEvents({ user }: { user: any }) {
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'clubs' | 'events' | 'budget' | 'ai' | 'gamification' | 'map'>('overview');
  const [expandedClub, setExpandedClub] = useState<number | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [selectedClubView, setSelectedClubView] = useState<'directory' | 'profile' | 'members'>('directory');
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [selectedAITool, setSelectedAITool] = useState<string | null>(null);

  const clubs = [
    {
      id: 1,
      name: 'Tech Club',
      members: 450,
      reputation: 4.8,
      category: 'Technology',
      color: 'from-blue-500 to-cyan-500',
      banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      description: 'Innovating the future through technology and coding excellence',
      activities: 24,
      reach: 12500,
      engagement: 85,
      growth: 15,
      posts: 45,
      stories: 12,
      reels: 8,
      skills: ['React', 'Python', 'AI/ML', 'Cloud'],
      alumniPartners: 8,
      virtualClubHouse: true
    },
    {
      id: 2,
      name: 'AI/ML Society',
      members: 320,
      reputation: 4.9,
      category: 'Technology',
      color: 'from-purple-500 to-pink-500',
      banner: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      description: 'Exploring artificial intelligence and machine learning frontiers',
      activities: 18,
      reach: 9800,
      engagement: 92,
      growth: 22,
      posts: 38,
      stories: 15,
      reels: 10,
      skills: ['TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
      alumniPartners: 12,
      virtualClubHouse: true
    },
    {
      id: 3,
      name: 'Photography Club',
      members: 280,
      reputation: 4.6,
      category: 'Arts',
      color: 'from-orange-500 to-red-500',
      banner: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
      description: 'Capturing moments and creating visual stories',
      activities: 15,
      reach: 7500,
      engagement: 78,
      growth: 10,
      posts: 52,
      stories: 20,
      reels: 15,
      skills: ['Photography', 'Editing', 'Composition', 'Lighting'],
      alumniPartners: 5,
      virtualClubHouse: false
    },
  ];

  const events = [
    {
      id: 1,
      title: 'TechFest 2024',
      club: 'Tech Club',
      date: '2024-12-15',
      time: '10:00 AM',
      venue: 'Main Auditorium',
      attendees: 450,
      maxCapacity: 500,
      type: 'Conference',
      status: 'approved',
      priority: true,
      budget: 50000,
      spent: 32000,
      hasQR: true,
      certificates: true,
      feedbackScore: 4.5,
      color: 'from-blue-500 to-cyan-500',
      proposals: ['Event Plan.pdf', 'Budget Sheet.xlsx'],
      conflictsWith: [],
      qrCheckins: 380
    },
    {
      id: 2,
      title: 'AI Workshop Series',
      club: 'AI/ML Society',
      date: '2024-12-10',
      time: '2:00 PM',
      venue: 'Lab 301',
      attendees: 80,
      maxCapacity: 100,
      type: 'Workshop',
      status: 'pending',
      priority: false,
      budget: 15000,
      spent: 5000,
      hasQR: true,
      certificates: false,
      color: 'from-purple-500 to-pink-500',
      proposals: ['Workshop Plan.pdf'],
      conflictsWith: ['Math Quiz - Same time slot'],
      qrCheckins: 0
    },
  ];

  const membersList = [
    { id: 1, name: 'Rahul Sharma', role: 'President', engagement: 95, skills: ['Leadership', 'React', 'Python'], avatar: '👨‍💻', attendance: 24, level: 'Gold' },
    { id: 2, name: 'Priya Patel', role: 'Vice President', engagement: 88, skills: ['Design', 'Management'], avatar: '👩‍💼', attendance: 22, level: 'Silver' },
    { id: 3, name: 'Arjun Singh', role: 'Core Team', engagement: 82, skills: ['AI/ML', 'Data Science'], avatar: '🧑‍🔬', attendance: 20, level: 'Silver' },
    { id: 4, name: 'Sneha Gupta', role: 'Member', engagement: 65, skills: ['Frontend', 'UI/UX'], avatar: '👩‍🎨', attendance: 16, level: 'Bronze' },
  ];

  const aiTools = [
    { id: 'idea', name: 'Event Idea Generator', icon: Lightbulb, color: 'from-yellow-500 to-orange-500', description: 'Generate creative event ideas based on trends and club interests' },
    { id: 'poster', name: 'Event Poster Generator', icon: ImageIcon, color: 'from-pink-500 to-purple-500', description: 'Create stunning event posters with AI-powered design' },
    { id: 'caption', name: 'Caption & Hashtag Generator', icon: Hash, color: 'from-blue-500 to-cyan-500', description: 'Generate engaging captions and trending hashtags for social media' },
    { id: 'budget', name: 'Budget Optimizer', icon: DollarSign, color: 'from-green-500 to-teal-500', description: 'Optimize budget allocation with AI recommendations' },
    { id: 'speaker', name: 'Speaker Recommendation', icon: UserCheck, color: 'from-indigo-500 to-blue-500', description: 'Find perfect speakers based on event theme and audience' },
    { id: 'collab', name: 'Club Collaboration Recommender', icon: Network, color: 'from-orange-500 to-red-500', description: 'Discover collaboration opportunities with other clubs' },
    { id: 'skill', name: 'Skill → Club Match Prediction', icon: Target, color: 'from-purple-500 to-pink-500', description: 'Match students to clubs based on their skills and interests' },
  ];

  const leaderboards = {
    classWise: [
      { rank: 1, name: 'Class A - 3rd Year', points: 4500, badge: '🥇' },
      { rank: 2, name: 'Class B - 2nd Year', points: 4200, badge: '🥈' },
      { rank: 3, name: 'Class C - 4th Year', points: 3800, badge: '🥉' },
    ],
    yearWise: [
      { rank: 1, name: '3rd Year Students', points: 15000, badge: '🥇' },
      { rank: 2, name: '2nd Year Students', points: 12500, badge: '🥈' },
      { rank: 3, name: '4th Year Students', points: 11000, badge: '🥉' },
    ],
    clubWise: [
      { rank: 1, name: 'Tech Club', points: 25000, badge: '🥇' },
      { rank: 2, name: 'AI/ML Society', points: 22000, badge: '🥈' },
      { rank: 3, name: 'Photography Club', points: 18000, badge: '🥉' },
    ],
  };

  const challenges = [
    { id: 1, name: 'Tech Quiz Marathon', type: 'Quiz', icon: Code, participants: 245, xp: 500, color: 'from-blue-500 to-cyan-500', status: 'active' },
    { id: 2, name: '30-Day Fitness Challenge', type: 'Fitness', icon: Dumbbell, participants: 180, xp: 300, color: 'from-green-500 to-teal-500', status: 'active' },
    { id: 3, name: 'Coding Sprint', type: 'Coding', icon: Code, participants: 320, xp: 800, color: 'from-purple-500 to-pink-500', status: 'upcoming' },
    { id: 4, name: 'Meme War 2024', type: 'Meme', icon: Smile, participants: 420, xp: 200, color: 'from-orange-500 to-red-500', status: 'active' },
  ];

  const campusBlocks = [
    { id: 1, name: 'Academic Block A', events: 3, rooms: 15, color: 'from-blue-500 to-cyan-500', hasEvents: true },
    { id: 2, name: 'Academic Block B', events: 1, rooms: 12, color: 'from-purple-500 to-pink-500', hasEvents: true },
    { id: 3, name: 'Main Auditorium', events: 5, rooms: 3, color: 'from-orange-500 to-red-500', hasEvents: true },
    { id: 4, name: 'Sports Complex', events: 2, rooms: 8, color: 'from-green-500 to-teal-500', hasEvents: true },
    { id: 5, name: 'Library', events: 0, rooms: 10, color: 'from-gray-500 to-slate-500', hasEvents: false },
  ];

  const AIToolModal = ({ tool }: { tool: any }) => (
    <DialogContent className="max-w-2xl bg-slate-900 border border-white/10">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
            <tool.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl">{tool.name}</h3>
            <p className="text-sm text-gray-400 font-normal">{tool.description}</p>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm">Input Parameters</label>
          <Textarea 
            placeholder={`Enter details for ${tool.name.toLowerCase()}...`}
            className="bg-white/5 border-white/10 min-h-[120px]"
          />
        </div>
        <div className="flex gap-2">
          <button className={`flex-1 py-3 bg-gradient-to-r ${tool.color} text-white rounded-xl hover:shadow-lg transition-all`}>
            <Wand2 className="w-4 h-4 inline mr-2" />
            Generate with AI
          </button>
          <button className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Users className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-3xl text-white mb-1">48</h3>
          <p className="text-gray-400 text-sm">Active Clubs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Calendar className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-3xl text-white mb-1">156</h3>
          <p className="text-gray-400 text-sm">Events This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Trophy className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-3xl text-white mb-1">8,450</h3>
          <p className="text-gray-400 text-sm">Active Members</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <DollarSign className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-3xl text-white mb-1">₹5.2L</h3>
          <p className="text-gray-400 text-sm">Budget Allocated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <Star className="w-8 h-8 text-pink-400 mb-4" />
          <h3 className="text-3xl text-white mb-1">4.7</h3>
          <p className="text-gray-400 text-sm">Avg Satisfaction</p>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'clubs', label: 'Club Management', icon: Users },
            { id: 'events', label: 'Event Management', icon: Calendar },
            { id: 'budget', label: 'Budget & Finance', icon: DollarSign },
            { id: 'ai', label: 'AI Support', icon: Brain },
            { id: 'gamification', label: 'Gamification', icon: Trophy },
            { id: 'map', label: 'Campus Map', icon: Map },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-6 transition-colors whitespace-nowrap ${
                activeMainTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeMainTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="grid md:grid-cols-4 gap-4">
                <button className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-white/10 transition-all text-left">
                  <Plus className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-white">Create New Club</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new club</p>
                </button>
                <button className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border border-white/10 transition-all text-left">
                  <Calendar className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="text-white">Schedule Event</p>
                  <p className="text-xs text-gray-400 mt-1">Add new event</p>
                </button>
                <button className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 rounded-xl border border-white/10 transition-all text-left">
                  <FileText className="w-6 h-6 text-orange-400 mb-2" />
                  <p className="text-white">Review Proposals</p>
                  <p className="text-xs text-gray-400 mt-1">12 pending</p>
                </button>
                <button className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 hover:from-green-500/20 hover:to-teal-500/20 rounded-xl border border-white/10 transition-all text-left">
                  <BarChart3 className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-white">View Analytics</p>
                  <p className="text-xs text-gray-400 mt-1">Full reports</p>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New event proposal', detail: 'TechFest 2024 submitted by Tech Club', time: '5 min ago', icon: FileText, color: 'from-blue-500 to-cyan-500' },
                    { action: 'Budget approved', detail: '₹50,000 for AI Workshop Series', time: '1 hour ago', icon: CheckCircle, color: 'from-green-500 to-teal-500' },
                    { action: 'New club registration', detail: 'Robotics Club registered', time: '3 hours ago', icon: Users, color: 'from-purple-500 to-pink-500' },
                    { action: 'Event completed', detail: 'Photography Contest - 145 participants', time: '1 day ago', icon: Trophy, color: 'from-orange-500 to-red-500' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* CLUB MANAGEMENT TAB */}
          {activeMainTab === 'clubs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Sub-navigation */}
              <div className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <button
                  onClick={() => setSelectedClubView('directory')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedClubView === 'directory' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Club Directory
                </button>
                <button
                  onClick={() => setSelectedClubView('profile')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedClubView === 'profile' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Club Profiles
                </button>
                <button
                  onClick={() => setSelectedClubView('members')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedClubView === 'members' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Member Management
                </button>
              </div>

              {/* Club Directory View */}
              {selectedClubView === 'directory' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        placeholder="Search clubs..." 
                        className="pl-10 bg-white/5 border-white/10"
                      />
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
                      <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                      <Plus className="w-5 h-5 inline mr-2" />
                      Add Club
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clubs.map((club) => (
                      <motion.div
                        key={club.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 overflow-hidden transition-all group"
                      >
                        <div className={`h-32 bg-gradient-to-br ${club.color} relative`}>
                          <img src={club.banner} alt={club.name} className="w-full h-full object-cover opacity-50" />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black/50 text-white border-0">
                              <Star className="w-3 h-3 inline mr-1 fill-yellow-400 text-yellow-400" />
                              {club.reputation}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg text-white mb-1">{club.name}</h4>
                          <p className="text-sm text-gray-400 mb-3">{club.category}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Users className="w-4 h-4" />
                              {club.members}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Activity className="w-4 h-4" />
                              {club.activities}
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedClubView('profile')}
                            className={`w-full py-2 bg-gradient-to-r ${club.color} text-white rounded-lg hover:shadow-lg transition-all`}
                          >
                            View Profile
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Profile View */}
              {selectedClubView === 'profile' && (
                <div className="space-y-6">
                  {clubs.slice(0, 1).map((club) => (
                    <div key={club.id} className="space-y-6">
                      {/* Club Header */}
                      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className={`h-48 bg-gradient-to-br ${club.color} relative`}>
                          <img src={club.banner} alt={club.name} className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <h2 className="text-4xl text-white mb-2">{club.name}</h2>
                              <p className="text-lg text-white/80">{club.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 grid md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-2xl text-white">{club.members}</p>
                            <p className="text-sm text-gray-400">Members</p>
                          </div>
                          <div className="text-center">
                            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2 fill-yellow-400" />
                            <p className="text-2xl text-white">{club.reputation}</p>
                            <p className="text-sm text-gray-400">Reputation</p>
                          </div>
                          <div className="text-center">
                            <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <p className="text-2xl text-white">{club.reach}</p>
                            <p className="text-sm text-gray-400">Reach</p>
                          </div>
                          <div className="text-center">
                            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                            <p className="text-2xl text-white">{club.engagement}%</p>
                            <p className="text-sm text-gray-400">Engagement</p>
                          </div>
                          <div className="text-center">
                            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl text-white">+{club.growth}%</p>
                            <p className="text-sm text-gray-400">Growth</p>
                          </div>
                        </div>
                      </div>

                      {/* Activity Feed & Analytics */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Activity Feed */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-xl text-white mb-4">Activity Feed</h3>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-white/5 rounded-lg">
                              <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                              <p className="text-2xl text-white">{club.posts}</p>
                              <p className="text-xs text-gray-400">Posts</p>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-lg">
                              <ImageIcon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                              <p className="text-2xl text-white">{club.stories}</p>
                              <p className="text-xs text-gray-400">Stories</p>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-lg">
                              <Video className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                              <p className="text-2xl text-white">{club.reels}</p>
                              <p className="text-xs text-gray-400">Reels</p>
                            </div>
                          </div>
                          <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
                            <Plus className="w-4 h-4 inline mr-2" />
                            Create Post
                          </button>
                        </div>

                        {/* Analytics */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-xl text-white mb-4">Analytics Overview</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-400">Reach</span>
                                <span className="text-sm text-white">{club.reach}</span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-400">Engagement</span>
                                <span className="text-sm text-white">{club.engagement}%</span>
                              </div>
                              <Progress value={club.engagement} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-400">Growth Rate</span>
                                <span className="text-sm text-green-400">+{club.growth}%</span>
                              </div>
                              <Progress value={club.growth * 5} className="h-2" />
                            </div>
                          </div>
                          <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            <BarChart3 className="w-4 h-4 inline mr-2" />
                            View Full Report
                          </button>
                        </div>
                      </div>

                      {/* Skills & Alumni Collaboration */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-xl text-white mb-4">Skill Growth Tracker</h3>
                          <div className="space-y-3">
                            {club.skills.map((skill, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-white">{skill}</span>
                                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 border-0">
                                  +{15 + idx * 5}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-xl text-white mb-4">Alumni Collaboration</h3>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-3xl text-white">{club.alumniPartners}</p>
                              <p className="text-sm text-gray-400">Active Mentors</p>
                            </div>
                            <Network className="w-12 h-12 text-orange-400" />
                          </div>
                          <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all">
                            Connect with Alumni
                          </button>
                        </div>
                      </div>

                      {/* Virtual Club House */}
                      {club.virtualClubHouse && (
                        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl text-white mb-2">Virtual Club House</h3>
                              <p className="text-gray-400">Experience the club in 3D virtual space</p>
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                              <Eye className="w-4 h-4 inline mr-2" />
                              Enter Virtual Space
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Member Management View */}
              {selectedClubView === 'members' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl text-white">Tech Club Members</h3>
                      <p className="text-sm text-gray-400">Manage roles, permissions, and track engagement</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Add Member
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Member</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Role</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Engagement</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Skills</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Level</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membersList.map((member) => (
                            <tr key={member.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
                                    {member.avatar}
                                  </div>
                                  <div>
                                    <p className="text-white">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member.attendance} events</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className="bg-blue-500/20 text-blue-400 border-0">
                                  {member.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Progress value={member.engagement} className="h-2 w-20" />
                                  <span className="text-sm text-white">{member.engagement}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap max-w-[200px]">
                                  {member.skills.slice(0, 2).map((skill, idx) => (
                                    <Badge key={idx} className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {member.skills.length > 2 && (
                                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">
                                      +{member.skills.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`border-0 ${
                                  member.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                                  member.level === 'Silver' ? 'bg-gray-400/20 text-gray-300' :
                                  'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {member.level}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4 text-gray-400" />
                                  </button>
                                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* EVENT MANAGEMENT TAB */}
          {activeMainTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-white">Event Management</h3>
                  <p className="text-sm text-gray-400">Manage proposals, registrations, and smart features</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Event
                </button>
              </div>

              {events.map((event) => (
                <div key={event.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-6">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-2xl text-white">{event.title}</h4>
                          <Badge className={`${
                            event.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            event.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          } border-0`}>
                            {event.status.toUpperCase()}
                          </Badge>
                          {event.priority && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-0">
                              <Flame className="w-3 h-3 inline mr-1" />
                              Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400">by {event.club} • {event.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Share2 className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="text-white">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Clock className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="text-white">{event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-400">Venue</p>
                          <p className="text-white">{event.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Users className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Attendees</p>
                          <p className="text-white">{event.attendees}/{event.maxCapacity}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Sections */}
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors mb-4"
                    >
                      <span className="text-white">Advanced Event Features</span>
                      {expandedEvent === event.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 mb-6"
                        >
                          {/* Event Proposal Workflow */}
                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg text-white mb-4">📄 Event Proposal Workflow</h4>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="text-sm text-gray-400">Uploaded Documents</label>
                                <div className="space-y-2">
                                  {event.proposals.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm text-white">{doc}</span>
                                      </div>
                                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                                        View
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                  <Upload className="w-4 h-4 inline mr-2" />
                                  Upload Document
                                </button>
                              </div>
                              <div className="space-y-3">
                                <label className="text-sm text-gray-400">Review Status</label>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                                  {event.status === 'approved' ? (
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                  ) : event.status === 'pending' ? (
                                    <Clock3 className="w-8 h-8 text-yellow-400" />
                                  ) : (
                                    <XCircle className="w-8 h-8 text-red-400" />
                                  )}
                                  <div>
                                    <p className="text-white">
                                      {event.status === 'approved' ? 'Approved' :
                                       event.status === 'pending' ? 'Pending Review' :
                                       'Rejected'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {event.status === 'approved' ? 'Event is ready to go live' :
                                       event.status === 'pending' ? 'Awaiting admin approval' :
                                       'Changes required'}
                                    </p>
                                  </div>
                                </div>
                                {event.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                                      Approve
                                    </button>
                                    <button className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Smart Event Features */}
                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg text-white mb-4">⚡ Smart Event Features</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              {/* AI Clash Detector */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <AlertCircle className={`w-5 h-5 ${event.conflictsWith.length > 0 ? 'text-red-400' : 'text-green-400'}`} />
                                  <p className="text-white">Clash Detector</p>
                                </div>
                                {event.conflictsWith.length > 0 ? (
                                  <div className="space-y-1">
                                    {event.conflictsWith.map((conflict, idx) => (
                                      <p key={idx} className="text-xs text-red-400">{conflict}</p>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-green-400">No conflicts detected</p>
                                )}
                              </div>

                              {/* QR Check-in */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <QrCode className="w-5 h-5 text-blue-400" />
                                  <p className="text-white">QR Check-in</p>
                                </div>
                                <p className="text-2xl text-white mb-1">{event.qrCheckins}</p>
                                <p className="text-xs text-gray-400">Scanned / {event.attendees} registered</p>
                                <button className="w-full mt-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors">
                                  View QR
                                </button>
                              </div>

                              {/* Certificates */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <Award className="w-5 h-5 text-yellow-400" />
                                  <p className="text-white">Certificates</p>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Switch checked={event.certificates} />
                                  <span className="text-xs text-gray-400">Auto-generate</span>
                                </div>
                                <button className="w-full py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30 transition-colors">
                                  Generate
                                </button>
                              </div>

                              {/* Priority Registration */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <Flame className="w-5 h-5 text-orange-400" />
                                  <p className="text-white">Priority Access</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch checked={event.priority} />
                                  <span className="text-xs text-gray-400">Enable priority registration</span>
                                </div>
                              </div>

                              {/* Ticket/Voucher */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <Ticket className="w-5 h-5 text-purple-400" />
                                  <p className="text-white">Tickets</p>
                                </div>
                                <button className="w-full py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30 transition-colors">
                                  Generate Vouchers
                                </button>
                              </div>

                              {/* Feedback Analyzer */}
                              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                  <MessageSquare className="w-5 h-5 text-green-400" />
                                  <p className="text-white">Feedback</p>
                                </div>
                                {event.feedbackScore ? (
                                  <>
                                    <p className="text-2xl text-white mb-1">{event.feedbackScore}/5</p>
                                    <p className="text-xs text-gray-400">Avg satisfaction</p>
                                  </>
                                ) : (
                                  <p className="text-xs text-gray-400">No feedback yet</p>
                                )}
                              </div>
                            </div>

                            {/* Additional Smart Features */}
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <button className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-lg border border-white/10 transition-all text-left">
                                <Camera className="w-5 h-5 text-blue-400 mb-2" />
                                <p className="text-white text-sm">AR Poster Scanner</p>
                                <p className="text-xs text-gray-400">Scan physical posters for AR preview</p>
                              </button>
                              <button className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-lg border border-white/10 transition-all text-left">
                                <Users className="w-5 h-5 text-purple-400 mb-2" />
                                <p className="text-white text-sm">Live Queue Management</p>
                                <p className="text-xs text-gray-400">Real-time queue tracking system</p>
                              </button>
                            </div>
                          </div>

                          {/* Budget Info */}
                          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h4 className="text-lg text-white mb-4">💰 Budget Information</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Allocated</p>
                                <p className="text-2xl text-white">₹{event.budget.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Spent</p>
                                <p className="text-2xl text-orange-400">₹{event.spent.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Remaining</p>
                                <p className="text-2xl text-green-400">₹{(event.budget - event.spent).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Progress value={(event.spent / event.budget) * 100} className="h-3" />
                              <p className="text-xs text-gray-400 mt-2">
                                {Math.round((event.spent / event.budget) * 100)}% utilized
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Full Details
                      </button>
                      <button className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <Map className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <Bell className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* BUDGET & FINANCE TAB */}
          {activeMainTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <DollarSign className="w-8 h-8 text-green-400 mb-4" />
                  <p className="text-3xl text-white mb-1">₹5.2L</p>
                  <p className="text-sm text-gray-400">Total Allocated</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                  <TrendingDown className="w-8 h-8 text-orange-400 mb-4" />
                  <p className="text-3xl text-white mb-1">₹3.1L</p>
                  <p className="text-sm text-gray-400">Total Spent</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                  <PieChart className="w-8 h-8 text-blue-400 mb-4" />
                  <p className="text-3xl text-white mb-1">₹2.1L</p>
                  <p className="text-sm text-gray-400">Available</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
                  <p className="text-3xl text-white mb-1">60%</p>
                  <p className="text-sm text-gray-400">Utilization</p>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white">Event-wise Budget Allocation</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                      <Download className="w-4 h-4 inline mr-2 text-gray-400" />
                      Export Report
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      AI Optimize
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white">{event.title}</p>
                          <p className="text-sm text-gray-400">{event.club}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">₹{event.budget.toLocaleString()}</p>
                          <p className="text-sm text-gray-400">Allocated</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-400">Spent</p>
                          <p className="text-lg text-orange-400">₹{event.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Remaining</p>
                          <p className="text-lg text-green-400">₹{(event.budget - event.spent).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Utilization</p>
                          <p className="text-lg text-white">{Math.round((event.spent / event.budget) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(event.spent / event.budget) * 100} className="h-2" />
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                          <FileText className="w-4 h-4 inline mr-2" />
                          View Expenses
                        </button>
                        <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Expense
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Reports */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-4">Financial Reports</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {['Monthly Report', 'Quarterly Report', 'Annual Report'].map((report, idx) => (
                    <button key={idx} className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-left">
                      <FileText className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-white mb-1">{report}</p>
                      <p className="text-xs text-gray-400">Download PDF report</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI SUPPORT TAB */}
          {activeMainTab === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl text-white mb-2">AI Club Support Center</h2>
                <p className="text-gray-400">Leverage AI to enhance your club management and event planning</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiTools.map((tool) => (
                  <Dialog key={tool.id}>
                    <DialogTrigger asChild>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-left"
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                          <tool.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg text-white mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-400">{tool.description}</p>
                        <button className={`mt-4 w-full py-2 bg-gradient-to-r ${tool.color} text-white rounded-lg hover:shadow-lg transition-all`}>
                          Launch Tool
                        </button>
                      </motion.button>
                    </DialogTrigger>
                    <AIToolModal tool={tool} />
                  </Dialog>
                ))}
              </div>

              {/* AI Usage Stats */}
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-4">AI Usage Statistics</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl text-white mb-1">127</p>
                    <p className="text-sm text-gray-400">AI Generations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl text-white mb-1">45</p>
                    <p className="text-sm text-gray-400">Events Optimized</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl text-white mb-1">₹32K</p>
                    <p className="text-sm text-gray-400">Budget Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl text-white mb-1">98%</p>
                    <p className="text-sm text-gray-400">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* GAMIFICATION TAB */}
          {activeMainTab === 'gamification' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* XP & Badges Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                  <Star className="w-8 h-8 text-yellow-400 mb-4 fill-yellow-400" />
                  <p className="text-3xl text-white mb-1">125K</p>
                  <p className="text-sm text-gray-400">Total XP Earned</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                  <Award className="w-8 h-8 text-purple-400 mb-4" />
                  <p className="text-3xl text-white mb-1">48</p>
                  <p className="text-sm text-gray-400">Badges Awarded</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/10">
                  <Trophy className="w-8 h-8 text-blue-400 mb-4" />
                  <p className="text-3xl text-white mb-1">12</p>
                  <p className="text-sm text-gray-400">Active Challenges</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                  <Users className="w-8 h-8 text-green-400 mb-4" />
                  <p className="text-3xl text-white mb-1">2,450</p>
                  <p className="text-sm text-gray-400">Active Players</p>
                </div>
              </div>

              {/* Leaderboards */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-6">🏆 Leaderboards</h3>
                <Tabs defaultValue="class" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 rounded-lg">
                    <TabsTrigger value="class">Class-wise</TabsTrigger>
                    <TabsTrigger value="year">Year-wise</TabsTrigger>
                    <TabsTrigger value="club">Club-wise</TabsTrigger>
                  </TabsList>
                  {['class', 'year', 'club'].map((type) => (
                    <TabsContent key={type} value={type} className="mt-6">
                      <div className="space-y-3">
                        {leaderboards[`${type}Wise` as keyof typeof leaderboards].map((entry) => (
                          <div key={entry.rank} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              entry.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                              entry.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                              'bg-gradient-to-br from-orange-600 to-orange-700'
                            }`}>
                              {entry.badge}
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{entry.name}</p>
                              <p className="text-sm text-gray-400">Rank #{entry.rank}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl text-white">{entry.points.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">XP Points</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Active Challenges */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white">Active Challenges</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Challenge
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center flex-shrink-0`}>
                          <challenge.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white">{challenge.name}</h4>
                            <Badge className={`text-xs border-0 ${
                              challenge.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {challenge.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{challenge.type} Challenge</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white">+{challenge.xp} XP</span>
                        </div>
                      </div>
                      <button className={`w-full py-2 bg-gradient-to-r ${challenge.color} text-white rounded-lg hover:shadow-lg transition-all`}>
                        View Challenge
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge Showcase */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-6">🎖️ Badge System</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {['🥇', '🥈', '🥉', '⭐', '🔥', '💎', '🎯', '🚀', '💪', '🧠', '🎨', '👑'].map((badge, idx) => (
                    <div key={idx} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-4xl hover:bg-white/10 transition-colors cursor-pointer">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* CAMPUS MAP TAB */}
          {activeMainTab === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Map className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl text-white mb-2">Interactive Campus Map</h2>
                <p className="text-gray-400">Navigate campus with event hotspots and interactive challenges</p>
              </div>

              {/* Map Controls */}
              <div className="flex gap-2 justify-center mb-6">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                  <Building className="w-4 h-4 inline mr-2" />
                  All Buildings
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
                  Event Hotspots
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <QrCode className="w-4 h-4 inline mr-2 text-gray-400" />
                  Treasure Hunt
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Navigation className="w-4 h-4 inline mr-2 text-gray-400" />
                  Navigate
                </button>
              </div>

              {/* Campus Blocks Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campusBlocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 overflow-hidden transition-all cursor-pointer"
                  >
                    <div className={`h-32 bg-gradient-to-br ${block.color} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="w-16 h-16 text-white opacity-50" />
                      </div>
                      {block.hasEvents && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-500 text-white border-0 animate-pulse">
                            {block.events} Events
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg text-white mb-2">{block.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {block.rooms} rooms
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {block.events} events
                        </div>
                      </div>
                      <button className={`w-full py-2 bg-gradient-to-r ${block.color} text-white rounded-lg hover:shadow-lg transition-all`}>
                        <Navigation className="w-4 h-4 inline mr-2" />
                        Navigate Here
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* QR Treasure Hunt */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl text-white mb-2">🗺️ QR Treasure Hunt</h3>
                    <p className="text-gray-400">Scan QR codes across campus to unlock rewards</p>
                  </div>
                  <QrCode className="w-16 h-16 text-orange-400" />
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-3xl text-white mb-1">12</p>
                    <p className="text-sm text-gray-400">Checkpoints</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-3xl text-white mb-1">345</p>
                    <p className="text-sm text-gray-400">Active Hunters</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-3xl text-white mb-1">8</p>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-3xl text-white mb-1">1000</p>
                    <p className="text-sm text-gray-400">XP Reward</p>
                  </div>
                </div>
              </div>

              {/* Event Navigation Overlay */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl text-white mb-4">📍 Upcoming Event Locations</h3>
                <div className="space-y-3">
                  {events.slice(0, 2).map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${event.color} flex items-center justify-center flex-shrink-0`}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{event.title}</p>
                        <p className="text-sm text-gray-400">{event.venue} • {event.date}</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all">
                        <Navigation className="w-4 h-4 inline mr-2" />
                        Navigate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
