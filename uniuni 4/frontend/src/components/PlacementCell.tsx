import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Building, Calendar, MapPin, DollarSign, Users, Star, 
  TrendingUp, Award, Clock, CheckCircle, AlertCircle, Send, Download,
  FileText, Video, Target, Zap, ThumbsUp, MessageCircle, Share2,
  BookOpen, Code, Brain, Sparkles, Trophy, ArrowRight, Eye, Edit,
  Upload, Filter, Search, Bell, Mail, Phone, Linkedin, Globe,
  BarChart3, PieChart, TrendingDown, Flame, Gift, Heart, User,
  GraduationCap, Mic, Headphones, FileCheck, ClipboardCheck
} from 'lucide-react';

export function PlacementCell({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drives' | 'applications' | 'interviews' | 'preparation' | 'analytics' | 'resume'>('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Placement Statistics
  const placementStats = {
    totalCompanies: 145,
    placedStudents: 423,
    averagePackage: '12.5 LPA',
    highestPackage: '45 LPA',
    internships: 234,
    ongoingDrives: 12,
    upcomingInterviews: 3,
    offersReceived: 2
  };

  // Upcoming Campus Drives
  const campusDrives = [
    {
      company: 'Google India',
      logo: '🔵',
      role: 'Software Engineer',
      type: 'Full-time',
      package: '28-32 LPA',
      deadline: '2024-12-15',
      visitDate: '2024-12-20',
      eligibility: 'CGPA ≥ 8.0',
      branches: ['CS', 'IT', 'ECE'],
      status: 'Open',
      applicants: 234,
      color: 'from-blue-500 to-cyan-500',
      rounds: ['Aptitude', 'Coding', 'Technical', 'HR']
    },
    {
      company: 'Microsoft',
      logo: '🟢',
      role: 'SDE Intern',
      type: 'Internship',
      package: '80k/month',
      deadline: '2024-12-18',
      visitDate: '2024-12-22',
      eligibility: 'CGPA ≥ 7.5',
      branches: ['CS', 'IT'],
      status: 'Open',
      applicants: 189,
      color: 'from-green-500 to-teal-500',
      rounds: ['Online Test', 'Technical', 'HR']
    },
    {
      company: 'Amazon',
      logo: '🟠',
      role: 'SDE-1',
      type: 'Full-time',
      package: '24-26 LPA',
      deadline: '2024-12-12',
      visitDate: '2024-12-16',
      eligibility: 'CGPA ≥ 7.0',
      branches: ['CS', 'IT', 'ECE', 'EEE'],
      status: 'Closing Soon',
      applicants: 456,
      color: 'from-orange-500 to-red-500',
      rounds: ['OA', 'Technical', 'Managerial', 'HR']
    },
    {
      company: 'Goldman Sachs',
      logo: '🔷',
      role: 'Analyst',
      type: 'Full-time',
      package: '22-24 LPA',
      deadline: '2024-12-14',
      visitDate: '2024-12-19',
      eligibility: 'CGPA ≥ 8.5',
      branches: ['CS', 'IT', 'Math'],
      status: 'Open',
      applicants: 167,
      color: 'from-purple-500 to-pink-500',
      rounds: ['Aptitude', 'Technical', 'HR']
    },
  ];

  // My Applications
  const myApplications = [
    {
      company: 'Google India',
      role: 'Software Engineer',
      appliedDate: '2024-12-01',
      status: 'Shortlisted',
      stage: 'Technical Round',
      nextRound: '2024-12-10',
      color: 'from-green-500 to-teal-500'
    },
    {
      company: 'Microsoft',
      role: 'SDE Intern',
      appliedDate: '2024-12-02',
      status: 'In Review',
      stage: 'Resume Screening',
      nextRound: 'TBD',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      company: 'Amazon',
      role: 'SDE-1',
      appliedDate: '2024-11-28',
      status: 'Selected',
      stage: 'Offer Letter',
      nextRound: 'Completed',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  // Upcoming Interviews
  const upcomingInterviews = [
    {
      company: 'Google India',
      role: 'Software Engineer',
      round: 'Technical Round 1',
      date: '2024-12-10',
      time: '2:00 PM',
      duration: '60 mins',
      mode: 'Virtual',
      interviewer: 'Senior Engineer',
      topics: ['DSA', 'System Design', 'Problem Solving'],
      preparation: 85
    },
    {
      company: 'TCS',
      role: 'Digital Developer',
      round: 'HR Round',
      date: '2024-12-11',
      time: '10:00 AM',
      duration: '30 mins',
      mode: 'On-Campus',
      interviewer: 'HR Manager',
      topics: ['Behavioral', 'Company Culture'],
      preparation: 92
    },
    {
      company: 'Infosys',
      role: 'Systems Engineer',
      round: 'Technical + HR',
      date: '2024-12-12',
      time: '3:30 PM',
      duration: '45 mins',
      mode: 'Virtual',
      interviewer: 'Team Lead',
      topics: ['Projects', 'Technical Skills'],
      preparation: 78
    },
  ];

  // Preparation Resources
  const preparationResources = [
    {
      category: 'Coding Practice',
      icon: Code,
      resources: [
        { name: 'LeetCode Problems', type: 'Practice', link: '#', difficulty: 'Hard' },
        { name: 'HackerRank Tests', type: 'Mock Test', link: '#', difficulty: 'Medium' },
        { name: 'GeeksforGeeks DSA', type: 'Tutorial', link: '#', difficulty: 'All Levels' }
      ],
      progress: 65,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Aptitude & Reasoning',
      icon: Brain,
      resources: [
        { name: 'Quantitative Aptitude', type: 'Practice', link: '#', difficulty: 'Medium' },
        { name: 'Logical Reasoning', type: 'Mock Test', link: '#', difficulty: 'Medium' },
        { name: 'Verbal Ability', type: 'Tutorial', link: '#', difficulty: 'Easy' }
      ],
      progress: 72,
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Interview Prep',
      icon: Mic,
      resources: [
        { name: 'Mock Interviews', type: 'Practice', link: '#', difficulty: 'Hard' },
        { name: 'HR Questions Bank', type: 'Guide', link: '#', difficulty: 'Easy' },
        { name: 'Behavioral Questions', type: 'Tutorial', link: '#', difficulty: 'Medium' }
      ],
      progress: 58,
      color: 'from-green-500 to-teal-500'
    },
    {
      category: 'Resume & LinkedIn',
      icon: FileText,
      resources: [
        { name: 'Resume Templates', type: 'Template', link: '#', difficulty: 'Easy' },
        { name: 'LinkedIn Optimization', type: 'Guide', link: '#', difficulty: 'Easy' },
        { name: 'Portfolio Building', type: 'Tutorial', link: '#', difficulty: 'Medium' }
      ],
      progress: 80,
      color: 'from-orange-500 to-red-500'
    },
  ];

  // Placement Analytics
  const placementTrends = {
    sectorsHiring: [
      { sector: 'IT & Software', percentage: 45, count: 189 },
      { sector: 'Core Engineering', percentage: 20, count: 84 },
      { sector: 'Consulting', percentage: 15, count: 63 },
      { sector: 'Finance', percentage: 12, count: 51 },
      { sector: 'Others', percentage: 8, count: 36 }
    ],
    packageRanges: [
      { range: '15+ LPA', count: 78, color: 'from-green-500 to-teal-500' },
      { range: '10-15 LPA', count: 145, color: 'from-blue-500 to-cyan-500' },
      { range: '6-10 LPA', count: 156, color: 'from-purple-500 to-pink-500' },
      { range: '3-6 LPA', count: 44, color: 'from-orange-500 to-red-500' }
    ],
    topRecruiters: [
      { company: 'Google', hires: 12, package: '28-45 LPA' },
      { company: 'Microsoft', hires: 15, package: '24-32 LPA' },
      { company: 'Amazon', hires: 23, package: '20-28 LPA' },
      { company: 'TCS', hires: 89, package: '3.5-7 LPA' },
      { company: 'Infosys', hires: 67, package: '4-8 LPA' }
    ]
  };

  // Success Stories
  const successStories = [
    {
      student: 'Rahul Sharma',
      company: 'Google',
      package: '45 LPA',
      role: 'SDE-2',
      batch: '2024',
      story: 'Consistent practice on LeetCode and strong fundamentals helped me crack Google!',
      avatar: 'RS',
      likes: 234
    },
    {
      student: 'Priya Patel',
      company: 'Microsoft',
      package: '32 LPA',
      role: 'SDE-1',
      batch: '2024',
      story: 'Focus on projects and system design concepts was key to my success.',
      avatar: 'PP',
      likes: 189
    },
    {
      student: 'Arjun Reddy',
      company: 'Amazon',
      package: '28 LPA',
      role: 'SDE-1',
      batch: '2024',
      story: 'Mock interviews and peer learning sessions really boosted my confidence!',
      avatar: 'AR',
      likes: 156
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Placement Cell</h2>
          <p className="text-gray-400">Your Gateway to Career Success</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Placement Brochure
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-white/10">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'drives', label: 'Campus Drives', icon: Building },
            { id: 'applications', label: 'My Applications', icon: ClipboardCheck },
            { id: 'interviews', label: 'Interviews', icon: Video },
            { id: 'preparation', label: 'Preparation', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'resume', label: 'Resume Builder', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 py-4 px-6 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Upcoming Interviews Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Upcoming Interviews</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {upcomingInterviews.map((interview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white mb-1">{interview.company}</h4>
                          <p className="text-sm text-gray-400">{interview.round}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          interview.mode === 'Virtual' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {interview.mode}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {interview.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4 text-purple-400" />
                          {interview.duration}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Preparation Status</p>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{ width: `${interview.preparation}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold">
                        Prepare Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Drives Section */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Active Campus Drives</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {campusDrives.slice(0, 4).map((drive, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${drive.color} bg-opacity-10 rounded-2xl p-5 border border-white/10 hover:scale-[1.02] transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{drive.logo}</div>
                          <div>
                            <h4 className="font-bold text-white">{drive.company}</h4>
                            <p className="text-sm text-gray-400">{drive.role}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          drive.status === 'Closing Soon' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {drive.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-xs text-gray-400">Package</p>
                          <p className="text-white font-semibold text-sm">{drive.package}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-xs text-gray-400">Type</p>
                          <p className="text-white font-semibold text-sm">{drive.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400">Deadline: {new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="text-xs text-cyan-400">{drive.applicants} applied</span>
                      </div>

                      <button className="w-full px-4 py-2 bg-white text-gray-900 font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
                        Apply Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Campus Drives Tab */}
          {activeTab === 'drives' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies, roles..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none">
                    <option>All Types</option>
                    <option>Full-time</option>
                    <option>Internship</option>
                  </select>
                  <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                    <Filter className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Drive Cards */}
              {campusDrives.map((drive, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${drive.color} bg-opacity-10 rounded-2xl p-6 border border-white/10`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-5xl">{drive.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">{drive.company}</h4>
                            <p className="text-gray-300 font-semibold">{drive.role}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            drive.status === 'Closing Soon' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {drive.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Package</p>
                      <p className="text-white font-semibold">{drive.package}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Type</p>
                      <p className="text-white font-semibold">{drive.type}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Visit Date</p>
                      <p className="text-white font-semibold">{new Date(drive.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Deadline</p>
                      <p className="text-white font-semibold">{new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Eligibility:</span>
                      <span className="text-white text-sm">{drive.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Branches:</span>
                      <div className="flex gap-2">
                        {drive.branches.map((branch, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                            {branch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Rounds:</span>
                      <div className="flex gap-2 flex-wrap">
                        {drive.rounds.map((round, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                            {round}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{drive.applicants} students applied</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-xl hover:shadow-lg transition-all">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* My Applications Tab */}
          {activeTab === 'applications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">My Applications</h3>
                  <p className="text-sm text-gray-400">{myApplications.length} applications submitted</p>
                </div>
              </div>

              {myApplications.map((app, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${app.color} bg-opacity-10 rounded-2xl p-6 border border-white/10`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{app.company}</h4>
                      <p className="text-gray-300">{app.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Selected' ? 'bg-green-500/20 text-green-400' :
                      app.status === 'Shortlisted' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Applied On</p>
                      <p className="text-white text-sm">{new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Current Stage</p>
                      <p className="text-white text-sm">{app.stage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Next Round</p>
                      <p className="text-white text-sm">{app.nextRound === 'TBD' ? 'TBD' : new Date(app.nextRound).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                      View Details
                    </button>
                    {app.status === 'Shortlisted' && (
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                        Prepare for Interview
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Interviews Tab */}
          {activeTab === 'interviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Interview Schedule</h3>
                  <p className="text-sm text-gray-400">{upcomingInterviews.length} upcoming interviews</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                  Book Mock Interview
                </button>
              </div>

              {upcomingInterviews.map((interview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{interview.company}</h4>
                      <p className="text-gray-300 mb-1">{interview.role} - {interview.round}</p>
                      <p className="text-sm text-gray-400">Interviewer: {interview.interviewer}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      interview.mode === 'Virtual' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {interview.mode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <p className="text-xs text-gray-400">Date</p>
                      </div>
                      <p className="text-white font-semibold">{new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <p className="text-xs text-gray-400">Time</p>
                      </div>
                      <p className="text-white font-semibold">{interview.time}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-orange-400" />
                        <p className="text-xs text-gray-400">Duration</p>
                      </div>
                      <p className="text-white font-semibold">{interview.duration}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Topics to Prepare:</p>
                    <div className="flex gap-2 flex-wrap">
                      {interview.topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Preparation Progress</p>
                      <span className="text-cyan-400 font-semibold text-sm">{interview.preparation}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${interview.preparation}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" />
                      Join Interview
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                      Reschedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Preparation Tab */}
          {activeTab === 'preparation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Preparation Resources</h3>
                  <p className="text-sm text-gray-400">Ace your interviews with structured preparation</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {preparationResources.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${category.color} bg-opacity-10 rounded-2xl p-6 border border-white/10`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{category.category}</h4>
                        <p className="text-xs text-gray-400">{category.resources.length} resources</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {category.resources.map((resource, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{resource.name}</p>
                            <p className="text-xs text-gray-400">{resource.type} • {resource.difficulty}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-cyan-400" />
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Progress</p>
                        <span className="text-cyan-400 font-semibold text-sm">{category.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          style={{ width: `${category.progress}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold">
                      Start Practicing
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Success Stories */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Success Stories</h3>
                <div className="space-y-4">
                  {successStories.map((story, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-2xl p-5 border border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {story.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-white">{story.student}</h4>
                              <p className="text-sm text-gray-400">{story.role} at {story.company} • {story.package}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">
                              Batch {story.batch}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{story.story}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span>{story.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Placement Analytics & Trends</h3>

              {/* Sector-wise Hiring */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold text-white mb-4">Sector-wise Hiring Distribution</h4>
                <div className="space-y-3">
                  {placementTrends.sectorsHiring.map((sector, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{sector.sector}</span>
                        <span className="text-cyan-400 font-semibold text-sm">{sector.percentage}% ({sector.count})</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sector.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Ranges */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold text-white mb-4">Package Distribution</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {placementTrends.packageRanges.map((range, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${range.color} bg-opacity-10 rounded-xl p-4 border border-white/10 text-center`}
                    >
                      <p className="text-2xl font-bold text-white mb-1">{range.count}</p>
                      <p className="text-sm text-gray-400">{range.range}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="font-bold text-white mb-4">Top Recruiters</h4>
                <div className="space-y-3">
                  {placementTrends.topRecruiters.map((recruiter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-cyan-400">#{index + 1}</span>
                        <div>
                          <p className="text-white font-semibold">{recruiter.company}</p>
                          <p className="text-xs text-gray-400">{recruiter.package}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{recruiter.hires}</p>
                        <p className="text-xs text-gray-400">hires</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Resume Builder Tab */}
          {activeTab === 'resume' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Resume Builder</h3>
                <p className="text-gray-400 mb-6">Create ATS-friendly resumes with our templates</p>
                <div className="flex gap-3 justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                    Create New Resume
                  </button>
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-semibold">
                    Upload Existing
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
import { LayoutDashboard } from 'lucide-react';