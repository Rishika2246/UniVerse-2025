import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Download, RefreshCw, AlertTriangle, Eye } from 'lucide-react';

interface Student {
  rollNo: string;
  fullName: string;
  email: string;
  deliveryStatus: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  failureReason?: string;
  originalFileName?: string;
}

interface BranchReport {
  branch: string;
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  acknowledged: number;
  students: Student[];
}

interface DeliveryReport {
  examId: string;
  branch?: string;
  generatedAt: string;
  summary: BranchReport[];
  totalStudents: number;
  overallStats: {
    delivered: number;
    failed: number;
    pending: number;
    acknowledged: number;
  };
}

interface Exam {
  id: string;
  examType: string;
  examDate: string;
  course: {
    name: string;
    code: string;
    department: string;
  };
}

const HallTicketDeliveryReport: React.FC = () => {
  const [report, setReport] = useState<DeliveryReport | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    loadExams();
    loadBranches();
  }, []);

  const loadExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hall-tickets/exams`);
      const result = await response.json();
      if (result.success) {
        setExams(result.data);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const loadBranches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hall-tickets/branches`);
      const result = await response.json();
      if (result.success) {
        setBranches(result.data);
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const generateReport = async () => {
    if (!selectedExam) {
      alert('Please select an exam');
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE_URL}/hall-tickets/delivery-report/${selectedExam}${
        selectedBranch ? `?branch=${selectedBranch}` : ''
      }`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setReport(result.data);
      } else {
        alert('Failed to generate report');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeDelivery = async (rollNumbers: string[]) => {
    if (!selectedExam || rollNumbers.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/hall-tickets/acknowledge/${selectedExam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumbers })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Acknowledged delivery for ${result.data.acknowledgedCount} students`);
        generateReport(); // Refresh report
        setSelectedStudents([]);
      } else {
        alert('Failed to acknowledge delivery');
      }
    } catch (error) {
      console.error('Failed to acknowledge delivery:', error);
      alert('Failed to acknowledge delivery');
    }
  };

  const downloadFailedList = async (branch?: string) => {
    if (!selectedExam) return;

    try {
      const url = `${API_BASE_URL}/hall-tickets/failed-uploads/${selectedExam}${
        branch ? `?branch=${branch}` : ''
      }`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        // Create CSV content
        const csvContent = [
          'Roll Number,Full Name,Email,Failure Reason,Original File Name,Branch',
          ...result.data.map((student: any) => 
            `${student.rollNo},${student.fullName},${student.email},"${student.failureReason || 'Unknown'}","${student.originalFileName || 'N/A'}",${student.branch || 'N/A'}`
          )
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `failed-hall-tickets-${branch || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('No failed uploads found');
      }
    } catch (error) {
      console.error('Failed to download failed list:', error);
      alert('Failed to download failed list');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'ACKNOWLEDGED': return 'text-blue-600 bg-blue-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      case 'ACKNOWLEDGED': return <CheckCircle className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const toggleStudentSelection = (rollNo: string) => {
    setSelectedStudents(prev => 
      prev.includes(rollNo) 
        ? prev.filter(r => r !== rollNo)
        : [...prev, rollNo]
    );
  };

  const selectAllDelivered = (branch: BranchReport) => {
    const deliveredStudents = branch.students
      .filter(s => s.deliveryStatus === 'DELIVERED')
      .map(s => s.rollNo);
    
    setSelectedStudents(prev => {
      const newSelection = [...prev];
      deliveredStudents.forEach(rollNo => {
        if (!newSelection.includes(rollNo)) {
          newSelection.push(rollNo);
        }
      });
      return newSelection;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Hall Ticket Delivery Report
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an exam...</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.course.code} - {exam.examType} ({new Date(exam.examDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Branch (Optional)
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={!selectedExam || loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{report.overallStats.delivered}</div>
              <div className="text-sm text-green-700">Delivered</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{report.overallStats.acknowledged}</div>
              <div className="text-sm text-blue-700">Acknowledged</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{report.overallStats.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">{report.overallStats.pending}</div>
              <div className="text-sm text-gray-700">Pending</div>
            </div>
          </div>
        )}

        {/* Acknowledge Selected Button */}
        {selectedStudents.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedStudents.length} students selected for acknowledgment
              </span>
              <button
                onClick={() => acknowledgeDelivery(selectedStudents)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Acknowledge Delivery
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Branch-wise Report */}
      {report && report.summary.map(branch => (
        <div key={branch.branch} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => setExpandedBranch(expandedBranch === branch.branch ? null : branch.branch)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">{branch.branch}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ {branch.delivered + branch.acknowledged}</span>
                  <span className="text-red-600">✗ {branch.failed}</span>
                  <span className="text-gray-600">⏳ {branch.pending}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAllDelivered(branch);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Select All Delivered
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFailedList(branch.branch);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {expandedBranch === branch.branch && (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Select</th>
                      <th className="text-left p-2">Roll No</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Delivered At</th>
                      <th className="text-left p-2">Failure Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branch.students.map(student => (
                      <tr key={student.rollNo} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {student.deliveryStatus === 'DELIVERED' && (
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.rollNo)}
                              onChange={() => toggleStudentSelection(student.rollNo)}
                              className="rounded"
                            />
                          )}
                        </td>
                        <td className="p-2 font-medium">{student.rollNo}</td>
                        <td className="p-2">{student.fullName}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.deliveryStatus)}`}>
                            {getStatusIcon(student.deliveryStatus)}
                            {student.deliveryStatus}
                          </span>
                        </td>
                        <td className="p-2">
                          {student.deliveredAt ? new Date(student.deliveredAt).toLocaleString() : '-'}
                        </td>
                        <td className="p-2 text-red-600">
                          {student.failureReason || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      {report && report.summary.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hall tickets found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HallTicketDeliveryReport;