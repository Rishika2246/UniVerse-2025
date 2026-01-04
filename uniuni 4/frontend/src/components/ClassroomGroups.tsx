import { useState } from 'react';
import { motion } from 'motion/react';
import EnhancedClassroomChat from './EnhancedClassroomChat';
import { 
  Users, MessageCircle, Upload, Download, Calendar, BookOpen, Video, Phone, 
  Mail, Search, Plus, Settings, Bell, Send, Paperclip, Smile, FileText,
  BarChart3, Award, Clock, CheckCircle, TrendingUp, Vote, Megaphone,
  BookMarked, Target, Lightbulb, Share2, Star, AlertCircle, ChevronLeft,
  ChevronRight, Minimize2, Maximize2, X
} from 'lucide-react';

interface ClassroomGroupsProps {
  user: any;
}

export function ClassroomGroups({ user }: ClassroomGroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('cs301');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'files' | 'assignments' | 'polls' | 'announcements' | 'study'>('members');
  const [chatVisible, setChatVisible] = useState(true);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatWidth, setChatWidth] = useState(400); // Default chat width

  const groups = [
    { id: 'cs301', name: 'Data Structures - Section A', course: 'CS301', members: 45, unread: 5, color: 'from-cyan-400 to-blue-500' },
    { id: 'cs302', name: 'Web Development - Section B', course: 'CS302', members: 42, unread: 2, color: 'from-purple-400 to-pink-500' },
    { id: 'cs401', name: 'Algorithms - Section A', course: 'CS401', members: 38, unread: 0, color: 'from-green-400 to-teal-500' },
    { id: 'math201', name: 'Linear Algebra', course: 'MATH201', members: 50, unread: 8, color: 'from-orange-400 to-red-500' },
  ];

  const members = [
    { id: 1, name: 'Aarav Sharma', role: 'Student', avatar: 'AS', status: 'online', lastSeen: 'Active now', contribution: 92 },
    { id: 2, name: 'Diya Patel', role: 'Student', avatar: 'DP', status: 'online', lastSeen: 'Active now', contribution: 88 },
    { id: 3, name: 'Arjun Reddy', role: 'Student', avatar: 'AR', status: 'offline', lastSeen: '2 hours ago', contribution: 75 },
    { id: 4, name: 'Priya Singh', role: 'Student', avatar: 'PS', status: 'online', lastSeen: 'Active now', contribution: 95 },
    { id: 5, name: 'Prof. Kapoor', role: 'Faculty', avatar: 'PK', status: 'online', lastSeen: 'Active now', contribution: 100 },
  ];

  const messages = [
    { id: 1, sender: 'Aarav Sharma', avatar: 'AS', message: 'Hey everyone! Did anyone finish the assignment?', time: '10:30 AM', own: false },
    { id: 2, sender: 'You', avatar: user.name.split(' ').map((n: string) => n[0]).join(''), message: 'Yes, I submitted it yesterday. The recursion part was tricky!', time: '10:32 AM', own: true },
    { id: 3, sender: 'Diya Patel', avatar: 'DP', message: 'Can someone share the lecture notes from Monday?', time: '10:35 AM', own: false },
    { id: 4, sender: 'Prof. Kapoor', avatar: 'PK', message: 'I\'ve uploaded all lecture materials in the files section. Check it out!', time: '10:40 AM', own: false },
    { id: 5, sender: 'Priya Singh', avatar: 'PS', message: 'Thanks Prof! Also, when is the next quiz?', time: '10:42 AM', own: false },
  ];

  const files = [
    { name: 'Lecture_05_Trees.pdf', size: '2.4 MB', uploadedBy: 'Prof. Kapoor', date: 'Dec 1, 2024', type: 'pdf', downloads: 42 },
    { name: 'Assignment_03_Solutions.zip', size: '1.8 MB', uploadedBy: 'Prof. Kapoor', date: 'Nov 28, 2024', type: 'zip', downloads: 38 },
    { name: 'Study_Guide_Midterm.docx', size: '456 KB', uploadedBy: 'Aarav Sharma', date: 'Nov 25, 2024', type: 'doc', downloads: 35 },
    { name: 'Code_Examples.zip', size: '3.2 MB', uploadedBy: 'Diya Patel', date: 'Nov 20, 2024', type: 'zip', downloads: 28 },
  ];

  const assignments = [
    { title: 'Binary Search Tree Implementation', dueDate: 'Dec 5, 2024', submitted: 35, total: 45, grade: 'A', status: 'Graded', avgScore: 88 },
    { title: 'Graph Algorithms Project', dueDate: 'Dec 10, 2024', submitted: 12, total: 45, grade: null, status: 'In Progress', avgScore: 0 },
    { title: 'Quiz - Recursion & Dynamic Programming', dueDate: 'Dec 8, 2024', submitted: 0, total: 45, grade: null, status: 'Upcoming', avgScore: 0 },
  ];

  const polls = [
    { 
      id: 1, 
      question: 'Best time for doubt clearing session?', 
      options: [
        { text: 'Morning (8-10 AM)', votes: 18 },
        { text: 'Afternoon (2-4 PM)', votes: 12 },
        { text: 'Evening (6-8 PM)', votes: 15 }
      ],
      totalVotes: 45,
      endsIn: '2 days',
      createdBy: 'Prof. Kapoor'
    },
    { 
      id: 2, 
      question: 'Preferred mode for next class?', 
      options: [
        { text: 'In-person', votes: 25 },
        { text: 'Online', votes: 12 },
        { text: 'Hybrid', votes: 8 }
      ],
      totalVotes: 45,
      endsIn: '5 hours',
      createdBy: 'Prof. Kapoor'
    }
  ];

  const announcements = [
    { id: 1, title: 'Midterm Exam Schedule Released', content: 'The midterm exam will be held on December 15, 2024. Topics covered: Trees, Graphs, and Dynamic Programming.', time: '2 hours ago', priority: 'high', author: 'Prof. Kapoor' },
    { id: 2, title: 'Guest Lecture - Advanced Algorithms', content: 'Dr. Mehta will be conducting a guest lecture on Advanced Graph Algorithms this Friday at 3 PM.', time: '1 day ago', priority: 'medium', author: 'Prof. Kapoor' },
    { id: 3, title: 'Study Group Formation', content: 'Students interested in forming study groups for the upcoming exam, please coordinate in the chat.', time: '3 days ago', priority: 'low', author: 'Aarav Sharma' },
  ];

  const studySessions = [
    { id: 1, title: 'Trees & BST Deep Dive', host: 'Aarav Sharma', date: 'Dec 6, 2024', time: '4:00 PM', participants: 12, duration: '2 hours', status: 'upcoming' },
    { id: 2, title: 'Graph Algorithms Workshop', host: 'Prof. Kapoor', date: 'Dec 4, 2024', time: '2:00 PM', participants: 28, duration: '3 hours', status: 'ongoing' },
    { id: 3, title: 'DP Problem Solving', host: 'Priya Singh', date: 'Nov 30, 2024', time: '6:00 PM', participants: 15, duration: '1.5 hours', status: 'completed' },
  ];

  const currentGroup = groups.find(g => g.id === selectedGroup);

  return (
    <div className="p-6 h-[calc(100vh-100px)]">
      <div className="flex gap-6 h-full">
        {/* Groups Sidebar */}
        <div className="w-80 bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <h3 className="text-xl font-bold text-black mb-3">My Classes</h3>
            <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Join Class
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {groups.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full p-4 rounded-xl mb-2 text-left transition-all ${
                  selectedGroup === group.id
                    ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-400'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${group.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  {group.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {group.unread}
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-black text-sm mb-1">{group.course}</h4>
                <p className="text-xs text-gray-600 mb-2">{group.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  {group.members} members
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-cyan-200 bg-gray-50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Groups</span>
              <span className="font-bold text-cyan-600">{groups.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Members</span>
              <span className="font-bold text-cyan-600">175</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className="flex-1 bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden flex flex-col"
          style={{ 
            width: chatVisible ? `calc(100% - 320px - ${chatWidth}px - 24px)` : 'calc(100% - 320px - 24px)' 
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentGroup?.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{currentGroup?.name}</h2>
                  <p className="text-sm text-gray-600">{currentGroup?.members} members • {currentGroup?.unread} unread</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Video className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Phone className="w-5 h-5 text-black" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-5 h-5 text-black" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  onClick={() => setChatVisible(!chatVisible)}
                  className={`p-2 rounded-lg transition-colors ${
                    chatVisible ? 'bg-cyan-100 text-cyan-600' : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {(['members', 'files', 'assignments', 'polls', 'announcements', 'study'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'members' && <Users className="w-4 h-4" />}
                  {tab === 'files' && <FileText className="w-4 h-4" />}
                  {tab === 'assignments' && <BookMarked className="w-4 h-4" />}
                  {tab === 'polls' && <Vote className="w-4 h-4" />}
                  {tab === 'announcements' && <Megaphone className="w-4 h-4" />}
                  {tab === 'study' && <Lightbulb className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-cyan-200 rounded-xl text-black placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{member.avatar}</span>
                        </div>
                        {member.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role} • {member.lastSeen}</p>
                      </div>
                      <div className="text-right mr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm font-semibold text-gray-700">Contribution</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${member.contribution}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-cyan-600">{member.contribution}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                        <MessageCircle className="w-4 h-4 text-black" />
                      </button>
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                        <Mail className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black">Shared Files</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{file.name}</h4>
                        <p className="text-sm text-gray-600">{file.size} • Uploaded by {file.uploadedBy}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-gray-500">{file.date}</p>
                          <div className="flex items-center gap-1 text-xs text-cyan-600">
                            <Download className="w-3 h-3" />
                            <span>{file.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Share2 className="w-5 h-5 text-black" />
                      </button>
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Download className="w-5 h-5 text-black" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 bg-white rounded-xl border border-cyan-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-black mb-2">{assignment.title}</h4>
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Due: {assignment.dueDate}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            assignment.status === 'Graded' ? 'bg-green-100 text-green-700' :
                            assignment.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {assignment.status}
                          </span>
                          {assignment.grade && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              Grade: {assignment.grade}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-500">Submission Rate</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                  style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-cyan-600">
                                {assignment.submitted}/{assignment.total}
                              </span>
                            </div>
                          </div>
                          {assignment.avgScore > 0 && (
                            <div>
                              <p className="text-xs text-gray-500">Class Average</p>
                              <p className="text-lg font-bold text-purple-600 mt-1">{assignment.avgScore}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {assignment.status !== 'Graded' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                          View Details
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Polls Tab */}
          {activeTab === 'polls' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black">Active Polls</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Poll
                </button>
              </div>

              <div className="space-y-4">
                {polls.map((poll) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-black mb-2">{poll.question}</h4>
                        <p className="text-sm text-gray-600">Created by {poll.createdBy} • {poll.totalVotes} votes</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        Ends in {poll.endsIn}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = (option.votes / poll.totalVotes) * 100;
                        return (
                          <button
                            key={index}
                            className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-black">{option.text}</span>
                              <span className="text-sm font-bold text-cyan-600">{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{option.votes} votes</p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black">Announcements</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Announcement
                </button>
              </div>

              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border-l-4 ${
                      announcement.priority === 'high' ? 'bg-red-50 border-red-500' :
                      announcement.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        announcement.priority === 'high' ? 'bg-red-100' :
                        announcement.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <Megaphone className={`w-5 h-5 ${
                          announcement.priority === 'high' ? 'text-red-600' :
                          announcement.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-black">{announcement.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {announcement.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By {announcement.author}</span>
                          <span>•</span>
                          <span>{announcement.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Study Sessions Tab */}
          {activeTab === 'study' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black">Study Sessions</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Session
                </button>
              </div>

              <div className="space-y-4">
                {studySessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white rounded-xl border border-cyan-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-black">{session.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            session.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Host: {session.host}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{session.time} ({session.duration})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-500" />
                          <span className="text-sm text-gray-700">{session.participants} participants</span>
                        </div>
                      </div>
                      {session.status === 'upcoming' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                          Join Session
                        </button>
                      )}
                      {session.status === 'ongoing' && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:shadow-lg transition-all animate-pulse">
                          Join Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Chat Panel */}
        {chatVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: chatMinimized ? 60 : chatWidth, 
              opacity: 1 
            }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden flex flex-col"
            style={{ minWidth: chatMinimized ? '60px' : '300px', maxWidth: '500px' }}
          >
            {/* Chat Header */}
            <div className="p-3 border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-between">
              {!chatMinimized && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-black">Class Chat</h3>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {currentGroup?.unread || 0}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                {!chatMinimized && (
                  <button
                    onClick={() => setChatMinimized(true)}
                    className="p-1 hover:bg-cyan-100 rounded transition-colors"
                  >
                    <Minimize2 className="w-4 h-4 text-cyan-600" />
                  </button>
                )}
                {chatMinimized && (
                  <button
                    onClick={() => setChatMinimized(false)}
                    className="p-1 hover:bg-cyan-100 rounded transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 text-cyan-600" />
                  </button>
                )}
                <button
                  onClick={() => setChatVisible(false)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!chatMinimized && (
              <div className="flex-1 flex flex-col">
                <EnhancedClassroomChat
                  classroomId={selectedGroup || 'cs301'}
                  currentUser={{
                    id: 'demo-student-id',
                    fullName: user?.fullName || 'Demo Student',
                    email: user?.email || 'demo@student.com'
                  }}
                />
              </div>
            )}

            {/* Minimized Chat Indicator */}
            {chatMinimized && (
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                <MessageCircle className="w-8 h-8 text-cyan-600 mb-2" />
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </motion.div>
        )}

        {/* Chat Toggle Button (when chat is hidden) */}
        {!chatVisible && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setChatVisible(true)}
            className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
          >
            <MessageCircle className="w-6 h-6" />
            {currentGroup?.unread && currentGroup.unread > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {currentGroup.unread}
              </span>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
