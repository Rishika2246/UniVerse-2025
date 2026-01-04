import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CheckCircle, Clock, TrendingUp, Award, FileText, Calendar, Mail, 
  Download, Upload, Search, Filter, Plus, Edit, Trash2, Send, Eye, X,
  BookOpen, Clipboard, Bell, AlertCircle, Target, BarChart3, PieChart,
  User, GraduationCap, MessageCircle, Share2, Printer, Save, RefreshCw,
  ChevronDown, ChevronRight, Star, ThumbsUp, Zap, Settings, QrCode,
  UserCheck, UserX, TrendingDown, FileCheck, Folder, Link2, Video, AlertTriangle,
  Copy, ExternalLink, Archive, CheckSquare, XCircle, MinusCircle, PlayCircle,
  Pause, MoreVertical, Tag, Image as ImageIcon, Film, Check
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface FacultyDashboardProps {
  user: any;
  currentView: string;
}

export function FacultyDashboard({ user, currentView }: FacultyDashboardProps) {
  const [selectedClass, setSelectedClass] = useState('CS301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMode, setAttendanceMode] = useState('manual');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [showGradeSubmissionModal, setShowGradeSubmissionModal] = useState(false);
  
  // Selected items
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Data states
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Unit 1 - Introduction to DS', type: 'PDF', size: '2.5 MB', uploadDate: '2024-01-15', downloads: 42, views: 120, class: 'CS301', status: 'published', sharedWith: ['CS301', 'CS302'], fileName: 'unit1_intro.pdf' },
    { id: 2, title: 'Lecture 5 - Trees', type: 'PPT', size: '5.1 MB', uploadDate: '2024-01-20', downloads: 38, views: 98, class: 'CS301', status: 'published', sharedWith: ['CS301'], fileName: 'lecture5_trees.ppt' },
    { id: 3, title: 'Lab Assignment 3', type: 'PDF', size: '1.2 MB', uploadDate: '2024-01-25', downloads: 45, views: 135, class: 'CS301', status: 'draft', sharedWith: [], fileName: 'lab_assignment3.pdf' },
    { id: 4, title: 'Data Structures Video Tutorial', type: 'Video', size: '125 MB', uploadDate: '2024-01-28', downloads: 28, views: 85, class: 'CS301', status: 'published', sharedWith: ['CS301'], fileName: 'ds_tutorial.mp4' },
  ]);
  
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Binary Trees Implementation', dueDate: '2024-12-15', submitted: 38, total: 45, status: 'active', graded: 25, class: 'CS301', points: 100, type: 'Programming', description: 'Implement binary tree operations' },
    { id: 2, title: 'Sorting Algorithms', dueDate: '2024-12-10', submitted: 45, total: 45, status: 'completed', graded: 45, class: 'CS301', points: 100, type: 'Programming', description: 'Compare sorting algorithms' },
    { id: 3, title: 'Graph Traversal', dueDate: '2024-12-20', submitted: 12, total: 45, status: 'active', graded: 0, class: 'CS301', points: 100, type: 'Programming', description: 'Implement DFS and BFS' },
  ]);
  
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Class Postponed', message: 'Tomorrow\'s class is postponed to next week', date: '2024-12-03', urgent: true, sentTo: ['CS301'], status: 'sent' },
    { id: 2, title: 'Assignment Extension', message: 'Assignment 3 deadline extended by 2 days', date: '2024-12-02', urgent: false, sentTo: ['CS301', 'CS302'], status: 'sent' },
  ]);
  
  const [students, setStudents] = useState([
    { id: 'STU001', name: 'Aarav Mehta', rollNo: '20CS001', attendance: 92, grade: 'A', cgpa: 8.5, email: 'aarav@university.edu', phone: '+91 9876543210', present: true, shortageAlert: false, assignments: 15, assignmentsSubmitted: 14, class: 'CS301', marks: { internal1: 85, internal2: 90, assignments: 88 } },
    { id: 'STU002', name: 'Priya Sharma', rollNo: '20CS002', attendance: 88, grade: 'A', cgpa: 8.2, email: 'priya@university.edu', phone: '+91 9876543211', present: true, shortageAlert: false, assignments: 15, assignmentsSubmitted: 15, class: 'CS301', marks: { internal1: 82, internal2: 85, assignments: 86 } },
    { id: 'STU003', name: 'Rohan Patel', rollNo: '20CS003', attendance: 65, grade: 'B', cgpa: 7.1, email: 'rohan@university.edu', phone: '+91 9876543212', present: false, shortageAlert: true, assignments: 15, assignmentsSubmitted: 10, class: 'CS301', marks: { internal1: 70, internal2: 68, assignments: 72 } },
    { id: 'STU004', name: 'Ananya Singh', rollNo: '20CS004', attendance: 95, grade: 'A+', cgpa: 9.2, email: 'ananya@university.edu', phone: '+91 9876543213', present: true, shortageAlert: false, assignments: 15, assignmentsSubmitted: 15, class: 'CS301', marks: { internal1: 95, internal2: 92, assignments: 94 } },
    { id: 'STU005', name: 'Vivek Kumar', rollNo: '20CS005', attendance: 82, grade: 'B+', cgpa: 7.8, email: 'vivek@university.edu', phone: '+91 9876543214', present: true, shortageAlert: false, assignments: 15, assignmentsSubmitted: 13, class: 'CS301', marks: { internal1: 75, internal2: 80, assignments: 78 } },
    { id: 'STU006', name: 'Ishita Reddy', rollNo: '20CS006', attendance: 90, grade: 'A', cgpa: 8.6, email: 'ishita@university.edu', phone: '+91 9876543215', present: true, shortageAlert: false, assignments: 15, assignmentsSubmitted: 15, class: 'CS301', marks: { internal1: 88, internal2: 87, assignments: 90 } },
    { id: 'STU007', name: 'Aditya Joshi', rollNo: '20CS007', attendance: 78, grade: 'B', cgpa: 7.5, email: 'aditya@university.edu', phone: '+91 9876543216', present: false, shortageAlert: false, assignments: 15, assignmentsSubmitted: 12, class: 'CS301', marks: { internal1: 72, internal2: 76, assignments: 74 } },
  ]);

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'DS Mid-Term Quiz', date: '2024-12-18', duration: 60, questions: 30, totalMarks: 100, class: 'CS301', status: 'scheduled' },
    { id: 2, title: 'Tree Structures Quick Test', date: '2024-12-05', duration: 30, questions: 15, totalMarks: 50, class: 'CS301', status: 'completed' },
  ]);

  const classes = [
    { code: 'CS301', name: 'Data Structures', students: 45, section: 'A', semester: 3 },
    { code: 'CS302', name: 'Web Development', students: 42, section: 'B', semester: 3 },
    { code: 'CS401', name: 'Advanced Algorithms', students: 38, section: 'A', semester: 4 },
  ];

  const attendanceTrend = [
    { week: 'Week 1', attendance: 88, avgGrade: 75 },
    { week: 'Week 2', attendance: 92, avgGrade: 78 },
    { week: 'Week 3', attendance: 85, avgGrade: 76 },
    { week: 'Week 4', attendance: 90, avgGrade: 80 },
    { week: 'Week 5', attendance: 94, avgGrade: 82 },
  ];

  const gradeDistribution = [
    { grade: 'A+', count: 8, percentage: 18 },
    { grade: 'A', count: 12, percentage: 27 },
    { grade: 'B+', count: 10, percentage: 22 },
    { grade: 'B', count: 8, percentage: 18 },
    { grade: 'C', count: 5, percentage: 11 },
    { grade: 'F', count: 2, percentage: 4 },
  ];

  // File upload handler
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Simulate file upload
  const simulateUpload = () => {
    return new Promise((resolve) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            resolve(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  // Upload material handler
  const handleUploadMaterial = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    await simulateUpload();
    
    const newMaterial = {
      id: materials.length + 1,
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
      class: selectedClass,
      status: 'published',
      sharedWith: [selectedClass],
      fileName: selectedFile.name
    };
    
    setMaterials([newMaterial, ...materials]);
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    toast.success(`Material "${newMaterial.title}" uploaded successfully!`);
  };

  // Delete material
  const handleDeleteMaterial = (id: number) => {
    const material = materials.find(m => m.id === id);
    setMaterials(materials.filter(m => m.id !== id));
    toast.success(`Deleted: ${material?.title}`);
  };

  // Edit material
  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material);
    setEditTitle(material.title);
    setEditDescription(material.description || '');
    setShowEditMaterialModal(true);
  };

  // Save material edits
  const handleSaveMaterialEdit = (e: any) => {
    e.preventDefault();
    setMaterials(materials.map(m => 
      m.id === selectedMaterial.id 
        ? { ...m, title: editTitle, description: editDescription }
        : m
    ));
    setShowEditMaterialModal(false);
    toast.success('Material updated successfully!');
  };

  // Share material
  const handleShareMaterial = (material: any, selectedClasses: string[]) => {
    setMaterials(materials.map(m => 
      m.id === material.id 
        ? { ...m, sharedWith: [...new Set([...m.sharedWith, ...selectedClasses])] }
        : m
    ));
    setShowShareModal(false);
    toast.success(`Shared with ${selectedClasses.length} class(es)`);
  };

  // Download material
  const handleDownloadMaterial = (material: any) => {
    setMaterials(materials.map(m => 
      m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m
    ));
    toast.success(`Downloading ${material.fileName}...`);
  };

  // Toggle attendance
  const handleToggleAttendance = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, present: !s.present } : s
    ));
  };

  // Bulk attendance
  const handleMarkAllPresent = () => {
    const classStudents = students.filter(s => s.class === selectedClass);
    setStudents(students.map(s => 
      s.class === selectedClass ? { ...s, present: true } : s
    ));
    toast.success(`Marked ${classStudents.length} students as present`);
  };

  const handleMarkAllAbsent = () => {
    const classStudents = students.filter(s => s.class === selectedClass);
    setStudents(students.map(s => 
      s.class === selectedClass ? { ...s, present: false } : s
    ));
    toast.info(`Marked ${classStudents.length} students as absent`);
  };

  // Save attendance
  const handleSaveAttendance = () => {
    const presentCount = students.filter(s => s.class === selectedClass && s.present).length;
    const totalCount = students.filter(s => s.class === selectedClass).length;
    toast.success(`Attendance saved: ${presentCount}/${totalCount} present on ${attendanceDate}`);
  };

  // Create announcement
  const handleCreateAnnouncement = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAnnouncement = {
      id: announcements.length + 1,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      date: new Date().toISOString().split('T')[0],
      urgent: formData.get('urgent') === 'on',
      sentTo: [selectedClass],
      status: 'sent'
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowAnnouncementModal(false);
    toast.success(`Announcement sent to ${selectedClass}`);
  };

  // Delete announcement
  const handleDeleteAnnouncement = (id: number) => {
    const announcement = announcements.find(a => a.id === id);
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success(`Deleted: ${announcement?.title}`);
  };

  // Create assignment
  const handleCreateAssignment = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAssignment = {
      id: assignments.length + 1,
      title: formData.get('title') as string,
      dueDate: formData.get('dueDate') as string,
      submitted: 0,
      total: students.filter(s => s.class === selectedClass).length,
      status: 'active',
      graded: 0,
      class: selectedClass,
      points: parseInt(formData.get('points') as string),
      type: formData.get('type') as string,
      description: formData.get('description') as string
    };
    
    setAssignments([newAssignment, ...assignments]);
    setShowAssignmentModal(false);
    toast.success(`Assignment "${newAssignment.title}" created!`);
  };

  // Delete assignment
  const handleDeleteAssignment = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success(`Deleted: ${assignment?.title}`);
  };

  // Create quiz
  const handleCreateQuiz = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newQuiz = {
      id: quizzes.length + 1,
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      duration: parseInt(formData.get('duration') as string),
      questions: parseInt(formData.get('questions') as string),
      totalMarks: parseInt(formData.get('totalMarks') as string),
      class: selectedClass,
      status: 'scheduled'
    };
    
    setQuizzes([newQuiz, ...quizzes]);
    setShowQuizModal(false);
    toast.success(`Quiz "${newQuiz.title}" created!`);
  };

  // View student details
  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentDetailModal(true);
  };

  // Send email to student
  const handleEmailStudent = (student: any) => {
    toast.success(`Opening email to ${student.email}`);
    window.location.href = `mailto:${student.email}`;
  };

  // Bulk email
  const handleSendBulkEmail = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const recipients = students.filter(s => s.class === selectedClass);
    
    setShowBulkEmailModal(false);
    toast.success(`Email sent to ${recipients.length} students`);
  };

  // Export attendance
  const handleExportAttendance = () => {
    toast.success('Exporting attendance to Excel...');
  };

  // Print report
  const handlePrintReport = () => {
    window.print();
    toast.success('Printing report...');
  };

  const filteredStudents = students
    .filter(s => s.class === selectedClass)
    .filter(s => 
      searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredMaterials = materials.filter(m => m.class === selectedClass);

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Faculty Dashboard</h2>
            <p className="text-gray-600">Welcome back, Prof. {user.name}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-white/30"
            >
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">125</h3>
              <p className="text-gray-600">Total Students</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/30"
            >
              <BookOpen className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">{classes.length}</h3>
              <p className="text-gray-600">Active Classes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/30"
            >
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">{materials.length}</h3>
              <p className="text-gray-600">Materials Uploaded</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-white/30"
            >
              <AlertCircle className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">{students.filter(s => s.shortageAlert).length}</h3>
              <p className="text-gray-600">Shortage Alerts</p>
            </motion.div>
          </div>

          {/* Today's Schedule & Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-600" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {[
                  { time: '09:00 AM - 10:30 AM', subject: 'Data Structures', room: 'Room 301', batch: 'CSE-3A', students: 45 },
                  { time: '11:00 AM - 12:30 PM', subject: 'Web Development', room: 'Lab 4', batch: 'CSE-3B', students: 42 },
                  { time: '02:00 PM - 03:30 PM', subject: 'Advanced Algorithms', room: 'Room 205', batch: 'CSE-4A', students: 38 },
                ].map((lecture, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{lecture.subject}</h4>
                          <p className="text-sm text-gray-600">{lecture.time}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>📍 {lecture.room}</span>
                            <span>👥 {lecture.batch}</span>
                            <span>🎓 {lecture.students} students</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toast.info('Opening attendance system...')}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Mark Attendance
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3 group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Upload Material</span>
                </button>
                <button 
                  onClick={() => setShowAssignmentModal(true)}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3 group"
                >
                  <Clipboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Create Assignment</span>
                </button>
                <button 
                  onClick={() => setShowAnnouncementModal(true)}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3 group"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Send Announcement</span>
                </button>
                <button 
                  onClick={() => setShowQuizModal(true)}
                  className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-3 group"
                >
                  <FileCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Create Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
                Attendance Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-cyan-600" />
                Grade Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Academic Delivery Section */}
      {currentView === 'academic' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Academic Delivery</h2>
              <p className="text-gray-600">Manage course materials, assignments, and content</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload New Material
            </button>
          </div>

          {/* Class Selector */}
          <div className="bg-white rounded-2xl p-4 border border-cyan-200">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="font-semibold text-gray-700">Select Class:</label>
              {classes.map((cls) => (
                <button
                  key={cls.code}
                  onClick={() => setSelectedClass(cls.code)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedClass === cls.code
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cls.code} - {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Folder className="w-6 h-6 text-cyan-600" />
                Course Materials ({filteredMaterials.length})
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportAttendance}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredMaterials.map((material) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        material.type === 'PDF' ? 'bg-red-100' :
                        material.type === 'PPT' ? 'bg-orange-100' :
                        material.type === 'Video' ? 'bg-purple-100' :
                        'bg-blue-100'
                      }`}>
                        {material.type === 'PDF' ? <FileText className="w-7 h-7 text-red-600" /> :
                         material.type === 'PPT' ? <FileText className="w-7 h-7 text-orange-600" /> :
                         material.type === 'Video' ? <Video className="w-7 h-7 text-purple-600" /> :
                         <FileText className="w-7 h-7 text-blue-600" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{material.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {material.type}
                              </span>
                              <span>{material.size}</span>
                              <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            material.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {material.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Download className="w-4 h-4" />
                            {material.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            {material.views} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDownloadMaterial(material)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMaterial(material);
                          setShowShareModal(true);
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditMaterial(material)}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Materials Yet</h3>
                  <p className="text-gray-600 mb-4">Upload your first course material</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Upload Material
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clipboard className="w-6 h-6 text-cyan-600" />
                Assignments ({assignments.filter(a => a.class === selectedClass).length})
              </h3>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Assignment
              </button>
            </div>

            <div className="grid gap-4">
              {assignments.filter(a => a.class === selectedClass).map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-800">{assignment.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          assignment.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {assignment.points} points
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                          {assignment.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowGradeSubmissionModal(true);
                        }}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        Grade ({assignment.submitted})
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Submissions</span>
                      <span className="font-semibold text-gray-800">{assignment.submitted}/{assignment.total}</span>
                    </div>
                    <Progress value={(assignment.submitted / assignment.total) * 100} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Graded</span>
                      <span className="font-semibold text-gray-800">{assignment.graded}/{assignment.submitted}</span>
                    </div>
                    <Progress value={assignment.submitted > 0 ? (assignment.graded / assignment.submitted) * 100 : 0} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendance Section */}
      {currentView === 'attendance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
              <p className="text-gray-600">Mark and track student attendance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAttendanceMode('manual')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  attendanceMode === 'manual'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-5 h-5 inline mr-2" />
                Manual
              </button>
              <button
                onClick={() => setAttendanceMode('qr')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  attendanceMode === 'qr'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <QrCode className="w-5 h-5 inline mr-2" />
                QR Code
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                >
                  {classes.map((cls) => (
                    <option key={cls.code} value={cls.code}>
                      {cls.code} - {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleMarkAllPresent}
                  className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-5 h-5" />
                  All Present
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleMarkAllAbsent}
                  className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Mode */}
          {attendanceMode === 'qr' && (
            <div className="bg-white rounded-2xl p-8 border border-cyan-200 text-center">
              <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Active</h3>
              <p className="text-gray-600 mb-4">Students can scan this code to mark their attendance</p>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => toast.success('QR Code regenerated')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate QR
                </button>
                <button 
                  onClick={() => toast.success('QR Code downloaded')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  12 students marked present via QR code
                </p>
              </div>
            </div>
          )}

          {/* Manual Attendance */}
          {attendanceMode === 'manual' && (
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Student List ({filteredStudents.filter(s => s.present).length}/{filteredStudents.length} Present)
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Attendance
                  </button>
                  <button
                    onClick={handleExportAttendance}
                    className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Roll No</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Student Name</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Attendance %</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-800">{student.rollNo}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800">{student.name}</p>
                            {student.shortageAlert && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                                <AlertCircle className="w-3 h-3" />
                                Shortage
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${
                            student.attendance >= 75 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.present 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleAttendance(student.id)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              student.present
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {student.present ? (
                              <>
                                <UserX className="w-4 h-4 inline mr-2" />
                                Mark Absent
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 inline mr-2" />
                                Mark Present
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Communication Section */}
      {currentView === 'communication' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Communication</h2>
              <p className="text-gray-600">Send announcements and messages to students</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Bell className="w-5 h-5" />
                New Announcement
              </button>
              <button
                onClick={() => setShowBulkEmailModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Bulk Email
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-cyan-600" />
              Recent Announcements ({announcements.length})
            </h3>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border-2 ${
                    announcement.urgent
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-800">{announcement.title}</h4>
                        {announcement.urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {announcement.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(announcement.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Sent to: {announcement.sentTo.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success('Resending announcement...')}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Resend"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Message Templates */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-cyan-600" />
              Quick Message Templates
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Class Cancellation', message: 'Today\'s class has been cancelled due to...', icon: X, color: 'from-red-400 to-orange-500' },
                { title: 'Assignment Reminder', message: 'Reminder: Assignment due in 2 days...', icon: Clock, color: 'from-yellow-400 to-orange-500' },
                { title: 'Exam Schedule', message: 'The upcoming exam will be held on...', icon: Calendar, color: 'from-purple-400 to-pink-500' },
                { title: 'Good Performance', message: 'Congratulations on your excellent...', icon: Award, color: 'from-green-400 to-teal-500' },
              ].map((template, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAnnouncementModal(true);
                    toast.info(`Template loaded: ${template.title}`);
                  }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center`}>
                      <template.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800">{template.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{template.message}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Students Section */}
      {currentView === 'students' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h2>
              <p className="text-gray-600">View and manage student information</p>
            </div>
            <button
              onClick={() => setShowBulkEmailModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Bulk Communication
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-cyan-200">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                >
                  {classes.map((cls) => (
                    <option key={cls.code} value={cls.code}>
                      {cls.code} - {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 border border-cyan-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.rollNo}</p>
                    </div>
                  </div>
                  {student.shortageAlert && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Alert
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendance</span>
                    <span className={`font-bold ${
                      student.attendance >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {student.attendance}%
                    </span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CGPA</span>
                    <span className="font-bold text-gray-800">{student.cgpa}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                      {student.grade}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <span className="text-sm text-gray-800">
                      {student.assignmentsSubmitted}/{student.assignments}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="flex-1 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEmailStudent(student)}
                    className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Evaluation Section - COMPLETE WITH GRADING */}
      {currentView === 'evaluation' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Evaluation & Grading</h2>
              <p className="text-gray-600">Manage marks, grades, and student evaluations</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMarksModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Enter Marks
              </button>
              <button
                onClick={() => toast.success('Exporting grades...')}
                className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Class Selector */}
          <div className="bg-white rounded-2xl p-4 border border-cyan-200">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="font-semibold text-gray-700">Select Class:</label>
              {classes.map((cls) => (
                <button
                  key={cls.code}
                  onClick={() => setSelectedClass(cls.code)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedClass === cls.code
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cls.code} - {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/30">
              <Award className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">8.2</h3>
              <p className="text-gray-600">Class Average</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-white/30">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">92%</h3>
              <p className="text-gray-600">Pass Rate</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/30">
              <Star className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">12</h3>
              <p className="text-gray-600">Top Performers</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-white/30">
              <AlertCircle className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">3</h3>
              <p className="text-gray-600">Need Attention</p>
            </div>
          </div>

          {/* Grading Table */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-cyan-600" />
                Student Marks
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Roll No</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Internal 1</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Internal 2</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Assignments</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Total</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const total = ((student.marks?.internal1 || 0) + (student.marks?.internal2 || 0) + (student.marks?.assignments || 0)) / 3;
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-800">{student.rollNo}</td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-800">{student.name}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${
                            (student.marks?.internal1 || 0) >= 75 ? 'text-green-600' : 
                            (student.marks?.internal1 || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.marks?.internal1 || '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${
                            (student.marks?.internal2 || 0) >= 75 ? 'text-green-600' : 
                            (student.marks?.internal2 || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.marks?.internal2 || '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-semibold ${
                            (student.marks?.assignments || 0) >= 75 ? 'text-green-600' : 
                            (student.marks?.assignments || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.marks?.assignments || '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-gray-800">{total.toFixed(1)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.grade === 'A+' || student.grade === 'A' ? 'bg-green-100 text-green-700' :
                            student.grade === 'B+' || student.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                            student.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowMarksModal(true);
                            }}
                            className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors flex items-center gap-2 mx-auto"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-cyan-600" />
              Grade Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.grade}: ${entry.count}`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Analytics Section - COMPLETE */}
      {currentView === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Performance Analytics</h2>
            <p className="text-gray-600">Detailed insights and performance metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <Users className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">{students.length}</h3>
              <p className="text-gray-600">Total Students</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">89%</h3>
              <p className="text-gray-600">Avg Attendance</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <Award className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">7.8</h3>
              <p className="text-gray-600">Avg CGPA</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <Clipboard className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-3xl font-bold text-gray-800">91%</h3>
              <p className="text-gray-600">Assignment Rate</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={gradeDistribution} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={100} label>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Events Section - COMPLETE */}
      {currentView === 'events' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Events & Schedule</h2>
            <p className="text-gray-600">Manage classes and events</p>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Classes</h3>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', subject: 'Data Structures', room: 'Room 301', students: 45 },
                { time: '11:00 AM', subject: 'Web Development', room: 'Lab 4', students: 42 },
                { time: '02:00 PM', subject: 'Advanced Algorithms', room: 'Room 205', students: 38 },
              ].map((event, idx) => (
                <div key={idx} className="p-4 bg-cyan-50 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800">{event.subject}</h4>
                    <p className="text-sm text-gray-600">{event.time} • {event.room} • {event.students} students</p>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                    Start Class
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* MODALS - All with real forms and functionality */}
      
      {/* Upload Material Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Upload className="w-6 h-6 text-cyan-600" />
              Upload New Material
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadMaterial}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Unit 1 - Introduction to Data Structures"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="PPT">PowerPoint Presentation</option>
                  <option value="Video">Video</option>
                  <option value="Document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">File *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors">
                  {selectedFile ? (
                    <div className="space-y-3">
                      <Check className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="text-green-700 font-semibold">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, PPT, Video (max. 100MB)</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={handleFileSelect}
                    className="hidden" 
                    id="file-upload"
                    required
                  />
                  {!selectedFile && (
                    <label 
                      htmlFor="file-upload"
                      className="mt-4 inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  )}
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="font-semibold text-gray-800">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Material Modal */}
      <Dialog open={showEditMaterialModal} onOpenChange={setShowEditMaterialModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Edit className="w-6 h-6 text-yellow-600" />
              Edit Material
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMaterialEdit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditMaterialModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Material Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-green-600" />
              Share Material
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">Select classes to share this material with:</p>
            
            <div className="space-y-2">
              {classes.map((cls) => (
                <label key={cls.code} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedMaterial?.sharedWith.includes(cls.code)}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{cls.code}</p>
                    <p className="text-sm text-gray-600">{cls.name} - {cls.students} students</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const selectedClasses = classes.map(c => c.code);
                  handleShareMaterial(selectedMaterial, selectedClasses);
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Now
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Announcement Modal */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-cyan-600" />
              Create Announcement
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAnnouncement}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Important: Class Schedule Change"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Type your announcement message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="urgent"
                  id="urgent"
                  className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <label htmlFor="urgent" className="text-sm font-semibold text-gray-700">
                  Mark as Urgent
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Announcement
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Modal */}
      <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clipboard className="w-6 h-6 text-purple-600" />
              Create New Assignment
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAssignment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Binary Search Tree Implementation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Points *</label>
                  <input
                    type="number"
                    name="points"
                    required
                    defaultValue="100"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Type *</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Programming">Programming</option>
                  <option value="Theory">Theory</option>
                  <option value="Project">Project</option>
                  <option value="Lab">Lab Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Provide detailed instructions for the assignment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Quiz Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-orange-600" />
              Create Quiz
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateQuiz}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Data Structures Mid-Term Quiz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (min) *</label>
                  <input
                    type="number"
                    name="duration"
                    required
                    defaultValue="60"
                    min="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Questions *</label>
                  <input
                    type="number"
                    name="questions"
                    required
                    defaultValue="30"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks *</label>
                <input
                  type="number"
                  name="totalMarks"
                  required
                  defaultValue="100"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Create Quiz
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Modal */}
      <Dialog open={showBulkEmailModal} onOpenChange={setShowBulkEmailModal}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Mail className="w-6 h-6 text-purple-600" />
              Send Bulk Email
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendBulkEmail}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Email subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Type your email message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  <Users className="w-4 h-4 inline mr-2" />
                  This email will be sent to {students.filter(s => s.class === selectedClass).length} students in {selectedClass}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkEmailModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Detail Modal */}
      <Dialog open={showStudentDetailModal} onOpenChange={setShowStudentDetailModal}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.rollNo}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-green-700">{selectedStudent.attendance}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-sm text-gray-600">CGPA</p>
                  <p className="text-2xl font-bold text-purple-700">{selectedStudent.cgpa}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedStudent.grade}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Internal 1</span>
                      <span className="font-semibold text-gray-800">{selectedStudent.marks?.internal1}/100</span>
                    </div>
                    <Progress value={selectedStudent.marks?.internal1} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Internal 2</span>
                      <span className="font-semibold text-gray-800">{selectedStudent.marks?.internal2}/100</span>
                    </div>
                    <Progress value={selectedStudent.marks?.internal2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Assignments</span>
                      <span className="font-semibold text-gray-800">{selectedStudent.marks?.assignments}/100</span>
                    </div>
                    <Progress value={selectedStudent.marks?.assignments} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowStudentDetailModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEmailStudent(selectedStudent)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
