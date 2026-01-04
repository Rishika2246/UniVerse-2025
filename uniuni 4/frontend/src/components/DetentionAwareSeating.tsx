import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, AlertTriangle, CheckCircle, XCircle, Shield, 
  UserCheck, UserX, RefreshCw, Eye, Settings, Download,
  Clock, FileText, AlertCircle, Ban, Lock, Unlock,
  Filter, Search, Edit, Save, History, BarChart3,
  MapPin, Zap, Target, Award, Bell, Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  academicStatus: 'ELIGIBLE' | 'PROVISIONALLY_ELIGIBLE' | 'DETAINED' | 'NOT_ELIGIBLE' | 'SUSPENDED';
  exclusionReason?: string;
  lastStatusUpdate?: string;
  updatedBy?: string;
  specialNeeds?: boolean;
}

interface DetentionOverride {
  studentId: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  updatedBy: string;
  timestamp: string;
  requiresApproval: boolean;
}

interface AllocationPreview {
  totalStudents: number;
  eligibleStudents: number;
  detainedStudents: number;
  excludedCount: number;
  hallsRequired: number;
  utilizationRate: number;
}

export function DetentionAwareSeating() {
  // ===== STATE MANAGEMENT =====
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Allocation State
  const [allocationPreview, setAllocationPreview] = useState<AllocationPreview | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [excludedStudents, setExcludedStudents] = useState<Student[]>([]);
  
  // Override Management
  const [overrides, setOverrides] = useState<DetentionOverride[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState('preview');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  // ===== INITIALIZATION =====
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Generate mock students with various academic statuses
    const mockStudents: Student[] = [
      // Detained Students
      { id: 'STU001', name: 'Rahul Sharma', rollNo: '2022CSE001', department: 'CSE', semester: '5', academicStatus: 'DETAINED', exclusionReason: 'Academic detention due to low CGPA', lastStatusUpdate: '2024-12-15', updatedBy: 'Academic Office' },
      { id: 'STU002', name: 'Priya Patel', rollNo: '2022ECE015', department: 'ECE', semester: '5', academicStatus: 'DETAINED', exclusionReason: 'Disciplinary action pending', lastStatusUpdate: '2024-12-10', updatedBy: 'Dean Office' },
      { id: 'STU003', name: 'Amit Kumar', rollNo: '2022ME025', department: 'ME', semester: '5', academicStatus: 'NOT_ELIGIBLE', exclusionReason: 'Fee payment pending', lastStatusUpdate: '2024-12-18', updatedBy: 'Accounts Office' },
      { id: 'STU004', name: 'Sneha Reddy', rollNo: '2022CE012', department: 'CE', semester: '5', academicStatus: 'SUSPENDED', exclusionReason: 'Temporary suspension - misconduct', lastStatusUpdate: '2024-12-12', updatedBy: 'Disciplinary Committee' },
      
      // Eligible Students
      ...Array.from({ length: 50 }, (_, i) => ({
        id: `STU${String(i + 5).padStart(3, '0')}`,
        name: `Student ${i + 5}`,
        rollNo: `2022${['CSE', 'ECE', 'ME', 'CE', 'EEE'][i % 5]}${String(i + 100).padStart(3, '0')}`,
        department: ['CSE', 'ECE', 'ME', 'CE', 'EEE'][i % 5],
        semester: '5',
        academicStatus: Math.random() > 0.1 ? 'ELIGIBLE' : 'PROVISIONALLY_ELIGIBLE' as any,
        specialNeeds: Math.random() < 0.05,
      })),
    ];

    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    generateAllocationPreview(mockStudents);
  };

  // ===== FILTERING =====
  useEffect(() => {
    filterStudents();
  }, [searchQuery, statusFilter, departmentFilter, students]);

  const filterStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.academicStatus === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(s => s.department === departmentFilter);
    }

    setFilteredStudents(filtered);
  };

  // ===== ALLOCATION PREVIEW =====
  const generateAllocationPreview = (studentList: Student[] = students) => {
    setIsGeneratingPreview(true);

    setTimeout(() => {
      const eligible = studentList.filter(s => 
        s.academicStatus === 'ELIGIBLE' || s.academicStatus === 'PROVISIONALLY_ELIGIBLE'
      );
      const detained = studentList.filter(s => 
        s.academicStatus === 'DETAINED' || s.academicStatus === 'NOT_ELIGIBLE' || s.academicStatus === 'SUSPENDED'
      );

      const preview: AllocationPreview = {
        totalStudents: studentList.length,
        eligibleStudents: eligible.length,
        detainedStudents: detained.length,
        excludedCount: detained.length,
        hallsRequired: Math.ceil(eligible.length / 64), // Assuming 64 seats per hall
        utilizationRate: (eligible.length / (Math.ceil(eligible.length / 64) * 64)) * 100,
      };

      setAllocationPreview(preview);
      setExcludedStudents(detained);
      setIsGeneratingPreview(false);
    }, 1500);
  };

  // ===== STATUS OVERRIDE =====
  const openOverrideModal = (student: Student) => {
    setEditingStudent(student);
    setOverrideReason('');
    setShowOverrideModal(true);
  };

  const submitStatusOverride = () => {
    if (!editingStudent || !overrideReason.trim()) {
      toast.error('Please provide a reason for the status change');
      return;
    }

    const override: DetentionOverride = {
      studentId: editingStudent.id,
      previousStatus: editingStudent.academicStatus,
      newStatus: 'ELIGIBLE', // For demo, always override to eligible
      reason: overrideReason,
      updatedBy: 'Dr. Smith (Seating Manager)',
      timestamp: new Date().toISOString(),
      requiresApproval: editingStudent.academicStatus === 'SUSPENDED',
    };

    // Update student status
    const updatedStudents = students.map(s =>
      s.id === editingStudent.id
        ? { ...s, academicStatus: 'ELIGIBLE' as any, lastStatusUpdate: new Date().toISOString().split('T')[0], updatedBy: 'Dr. Smith' }
        : s
    );

    setStudents(updatedStudents);
    setOverrides([override, ...overrides]);
    setShowOverrideModal(false);
    setEditingStudent(null);
    setOverrideReason('');

    // Regenerate preview
    generateAllocationPreview(updatedStudents);

    toast.success(`Status updated for ${editingStudent.name}. ${override.requiresApproval ? 'Requires admin approval.' : 'Change applied immediately.'}`);
  };

  // ===== SEAT ALLOCATION =====
  const runSeatingAllocation = () => {
    const eligibleStudents = students.filter(s => 
      s.academicStatus === 'ELIGIBLE' || s.academicStatus === 'PROVISIONALLY_ELIGIBLE'
    );

    if (eligibleStudents.length === 0) {
      toast.error('No eligible students found for seat allocation!');
      return;
    }

    toast.success(`Seat allocation initiated for ${eligibleStudents.length} eligible students. ${excludedStudents.length} students excluded due to detention/ineligibility.`);
    
    // In real implementation, this would trigger the actual allocation
    setTimeout(() => {
      toast.success('Seat allocation completed successfully! All detained students were automatically excluded.');
    }, 2000);
  };

  // ===== RENDER FUNCTIONS =====
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ELIGIBLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'PROVISIONALLY_ELIGIBLE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DETAINED': return 'bg-red-100 text-red-800 border-red-200';
      case 'NOT_ELIGIBLE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SUSPENDED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ELIGIBLE': return <CheckCircle className="w-4 h-4" />;
      case 'PROVISIONALLY_ELIGIBLE': return <Clock className="w-4 h-4" />;
      case 'DETAINED': return <Ban className="w-4 h-4" />;
      case 'NOT_ELIGIBLE': return <XCircle className="w-4 h-4" />;
      case 'SUSPENDED': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sky-400/20 to-cyan-400/20 backdrop-blur-xl rounded-2xl p-8 border border-sky-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-sky-600" />
              Detention-Aware Seat Allocation
            </h1>
            <p className="text-gray-700 mb-4">
              Advanced seating system that automatically excludes detained students and ensures academic integrity
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {students.length} Total Students
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {students.filter(s => s.academicStatus === 'ELIGIBLE' || s.academicStatus === 'PROVISIONALLY_ELIGIBLE').length} Eligible
              </span>
              <span className="flex items-center gap-1">
                <Ban className="w-4 h-4 text-red-600" />
                {students.filter(s => s.academicStatus === 'DETAINED' || s.academicStatus === 'NOT_ELIGIBLE' || s.academicStatus === 'SUSPENDED').length} Excluded
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-sky-200 flex gap-2 overflow-x-auto">
        {[
          { id: 'preview', label: 'Allocation Preview', icon: Eye },
          { id: 'students', label: 'Student Status', icon: Users },
          { id: 'overrides', label: 'Status Overrides', icon: Edit },
          { id: 'audit', label: 'Audit Log', icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Allocation Preview Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allocationPreview && [
                  { 
                    icon: Users, 
                    label: 'Total Students', 
                    value: allocationPreview.totalStudents, 
                    color: 'from-blue-500 to-cyan-500',
                    description: 'All registered students'
                  },
                  { 
                    icon: CheckCircle, 
                    label: 'Eligible for Seating', 
                    value: allocationPreview.eligibleStudents, 
                    color: 'from-green-500 to-emerald-500',
                    description: 'Will receive seat numbers'
                  },
                  { 
                    icon: Ban, 
                    label: 'Excluded (Detained)', 
                    value: allocationPreview.detainedStudents, 
                    color: 'from-red-500 to-rose-500',
                    description: 'Blocked from allocation'
                  },
                  { 
                    icon: MapPin, 
                    label: 'Halls Required', 
                    value: allocationPreview.hallsRequired, 
                    color: 'from-purple-500 to-violet-500',
                    description: `${allocationPreview.utilizationRate.toFixed(1)}% utilization`
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-sky-200 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-10 h-10 text-sky-600" />
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl opacity-20`} />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Exclusion Banner */}
              {excludedStudents.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                      <h3 className="text-xl font-bold text-red-800">
                        {excludedStudents.length} Students Excluded from Seat Allocation
                      </h3>
                      <p className="text-red-700">
                        These students will not receive seat numbers due to academic detention or ineligibility
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {excludedStudents.slice(0, 4).map((student) => (
                      <div key={student.id} className="bg-white rounded-xl p-4 border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.rollNo} • {student.department}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.academicStatus)}`}>
                            {getStatusIcon(student.academicStatus)}
                            <span className="ml-1">{student.academicStatus.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                          <strong>Reason:</strong> {student.exclusionReason}
                        </p>
                        <button
                          onClick={() => openOverrideModal(student)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Override Status →
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {excludedStudents.length > 4 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setActiveTab('students')}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        View all {excludedStudents.length} excluded students →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => generateAllocationPreview()}
                  disabled={isGeneratingPreview}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isGeneratingPreview ? 'animate-spin' : ''}`} />
                  {isGeneratingPreview ? 'Generating Preview...' : 'Refresh Preview'}
                </button>
                
                <button
                  onClick={runSeatingAllocation}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Run Seat Allocation
                </button>
                
                <button
                  onClick={() => setActiveTab('audit')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
                >
                  <History className="w-5 h-5" />
                  View Audit Log
                </button>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl p-6 border border-sky-200">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Search Students</label>
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Academic Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="ELIGIBLE">Eligible</option>
                      <option value="PROVISIONALLY_ELIGIBLE">Provisionally Eligible</option>
                      <option value="DETAINED">Detained</option>
                      <option value="NOT_ELIGIBLE">Not Eligible</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Department</label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">Electronics</option>
                      <option value="ME">Mechanical</option>
                      <option value="CE">Civil</option>
                      <option value="EEE">Electrical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Student Academic Status</h3>
                  <p className="text-gray-600">Showing {filteredStudents.length} of {students.length} students</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Academic Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Exclusion Reason</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.rollNo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                              {student.department}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 w-fit ${getStatusColor(student.academicStatus)}`}>
                              {getStatusIcon(student.academicStatus)}
                              {student.academicStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {student.exclusionReason || 'No restrictions'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div>{student.lastStatusUpdate || 'N/A'}</div>
                              <div className="text-gray-500">{student.updatedBy || 'System'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {(student.academicStatus === 'DETAINED' || student.academicStatus === 'NOT_ELIGIBLE' || student.academicStatus === 'SUSPENDED') && (
                              <button
                                onClick={() => openOverrideModal(student)}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                              >
                                Override Status
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overrides' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-sky-200">
                <h3 className="text-xl font-bold mb-4">Status Override History</h3>
                <p className="text-gray-600 mb-6">Track all administrative overrides to student academic status</p>
                
                {overrides.length === 0 ? (
                  <div className="text-center py-12">
                    <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No status overrides recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {overrides.map((override, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Edit className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Status Override</h4>
                              <p className="text-sm text-gray-600">
                                {students.find(s => s.id === override.studentId)?.name} ({students.find(s => s.id === override.studentId)?.rollNo})
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{new Date(override.timestamp).toLocaleString()}</div>
                            {override.requiresApproval && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Requires Approval
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Previous Status:</span>
                            <div className={`mt-1 px-2 py-1 rounded text-xs font-semibold w-fit ${getStatusColor(override.previousStatus)}`}>
                              {override.previousStatus.replace('_', ' ')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">New Status:</span>
                            <div className={`mt-1 px-2 py-1 rounded text-xs font-semibold w-fit ${getStatusColor(override.newStatus)}`}>
                              {override.newStatus.replace('_', ' ')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Updated By:</span>
                            <div className="mt-1 font-semibold">{override.updatedBy}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 text-sm">Reason:</span>
                          <p className="mt-1">{override.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-sky-200">
                <h3 className="text-xl font-bold mb-4">Audit Trail</h3>
                <p className="text-gray-600 mb-6">Complete log of all detention-aware allocation activities</p>
                
                <div className="space-y-4">
                  {[
                    { time: '2024-12-20 10:30 AM', action: 'Allocation Preview Generated', user: 'Dr. Smith', details: '54 eligible, 4 excluded students identified' },
                    { time: '2024-12-20 10:25 AM', action: 'Status Override Applied', user: 'Dr. Smith', details: 'Changed Rahul Sharma from DETAINED to ELIGIBLE' },
                    { time: '2024-12-20 10:20 AM', action: 'Detention Check Completed', user: 'System', details: 'Automatic scan identified 4 ineligible students' },
                    { time: '2024-12-20 10:15 AM', action: 'Module Initialized', user: 'Dr. Smith', details: 'Detention-aware seating system activated' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{log.action}</h4>
                          <span className="text-sm text-gray-500">{log.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                        <p className="text-xs text-gray-500">By: {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Status Override Modal */}
      {showOverrideModal && editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Override Academic Status</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold">{editingStudent.name}</h4>
              <p className="text-sm text-gray-600">{editingStudent.rollNo} • {editingStudent.department}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Current Status:</span>
                <div className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(editingStudent.academicStatus)}`}>
                  {editingStudent.academicStatus.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Reason for Override</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Provide detailed reason for status change..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitStatusOverride}
                className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all"
              >
                Apply Override
              </button>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}