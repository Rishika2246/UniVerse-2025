import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Filter,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';

interface CreditRiskStudent {
  rollNumber: string;
  name: string;
  department: string;
  year: number;
  creditsEarned: number;
  creditsRequired: number;
  status: string;
  statusChangeDate: string;
}

interface HallTicketDelivery {
  rollNumber: string;
  name: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  reason?: string;
  filename?: string;
}

interface SeatAllocationData {
  totalSeats: number;
  allocated: number;
  detained: number;
  pending: number;
  detainedStudents: Array<{
    rollNumber: string;
    name: string;
    reason: string;
  }>;
}

const AdminDashboardEdgeCases: React.FC = () => {
  const [demoMode, setDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'credit' | 'hallticket' | 'seating' | 'overview'>('overview');
  const [creditRiskStudents, setCreditRiskStudents] = useState<CreditRiskStudent[]>([]);
  const [hallTicketDelivery, setHallTicketDelivery] = useState<HallTicketDelivery[]>([]);
  const [seatAllocation, setSeatAllocation] = useState<SeatAllocationData | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');

  useEffect(() => {
    if (demoMode) {
      loadDemoData();
    }
  }, [demoMode]);

  const loadDemoData = () => {
    // Demo Credit Risk Students
    setCreditRiskStudents([
      {
        rollNumber: 'CSE001',
        name: 'Rahul Kumar',
        department: 'CSE',
        year: 4,
        creditsEarned: 142,
        creditsRequired: 160,
        status: 'CREDIT_SHORTAGE',
        statusChangeDate: '2025-01-21'
      },
      {
        rollNumber: 'CSE045',
        name: 'Priya Sharma',
        department: 'CSE',
        year: 3,
        creditsEarned: 95,
        creditsRequired: 120,
        status: 'PROVISIONALLY_PROMOTED',
        statusChangeDate: '2025-01-20'
      },
      {
        rollNumber: 'ECE023',
        name: 'Amit Patel',
        department: 'ECE',
        year: 4,
        creditsEarned: 138,
        creditsRequired: 160,
        status: 'CREDIT_SHORTAGE',
        statusChangeDate: '2025-01-21'
      },
      {
        rollNumber: 'MECH012',
        name: 'Sneha Reddy',
        department: 'MECH',
        year: 3,
        creditsEarned: 88,
        creditsRequired: 120,
        status: 'DETAINED',
        statusChangeDate: '2025-01-19'
      },
      {
        rollNumber: 'CSE078',
        name: 'Vikram Singh',
        department: 'CSE',
        year: 4,
        creditsEarned: 145,
        creditsRequired: 160,
        status: 'CREDIT_SHORTAGE',
        statusChangeDate: '2025-01-21'
      }
    ]);

    // Demo Hall Ticket Delivery Status
    setHallTicketDelivery([
      { rollNumber: 'CSE001', name: 'Rahul Kumar', status: 'DELIVERED' },
      { rollNumber: 'CSE002', name: 'Ananya Verma', status: 'DELIVERED' },
      { rollNumber: 'CSE003', name: 'Karthik Reddy', status: 'FAILED', reason: 'Filename mismatch', filename: 'CSE003_wrong.pdf' },
      { rollNumber: 'CSE004', name: 'Divya Iyer', status: 'DELIVERED' },
      { rollNumber: 'CSE005', name: 'Rohan Gupta', status: 'FAILED', reason: 'Roll number not found', filename: 'CSE005.pdf' },
      { rollNumber: 'CSE006', name: 'Meera Nair', status: 'PENDING', reason: 'Verification in progress' },
      { rollNumber: 'ECE001', name: 'Arjun Mehta', status: 'DELIVERED' },
      { rollNumber: 'ECE002', name: 'Pooja Desai', status: 'FAILED', reason: 'Invalid file format', filename: 'ECE002.jpg' },
      { rollNumber: 'ECE003', name: 'Sanjay Kumar', status: 'DELIVERED' },
      { rollNumber: 'MECH001', name: 'Lakshmi Rao', status: 'DELIVERED' }
    ]);

    // Demo Seat Allocation Data
    setSeatAllocation({
      totalSeats: 500,
      allocated: 475,
      detained: 15,
      pending: 10,
      detainedStudents: [
        { rollNumber: 'MECH012', name: 'Sneha Reddy', reason: 'Academic detention - Credit shortage' },
        { rollNumber: 'CSE089', name: 'Rajesh Kumar', reason: 'Academic detention - Multiple backlogs' },
        { rollNumber: 'ECE034', name: 'Kavya Sharma', reason: 'Academic detention - Attendance shortage' },
        { rollNumber: 'CIVIL021', name: 'Arun Patel', reason: 'Academic detention - Credit shortage' },
        { rollNumber: 'EEE045', name: 'Deepa Reddy', reason: 'Academic detention - Failed core subjects' }
      ]
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      DELIVERED: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      FAILED: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      CREDIT_SHORTAGE: { color: 'bg-red-100 text-red-800', text: 'Credit Shortage' },
      PROVISIONALLY_PROMOTED: { color: 'bg-yellow-100 text-yellow-800', text: 'Provisionally Promoted' },
      DETAINED: { color: 'bg-red-100 text-red-800', text: 'Detained' }
    };

    const badge = badges[status];
    if (!badge) return null;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const handleRetryFailedHallTickets = () => {
    const failedTickets = hallTicketDelivery.filter(h => h.status === 'FAILED');
    
    if (failedTickets.length === 0) {
      toast.info('No failed hall tickets to retry.');
      return;
    }

    // Simulate retry process
    toast.info(`Retrying ${failedTickets.length} failed hall tickets...`);
    
    setTimeout(() => {
      // Simulate some successes and some continued failures
      const updatedDelivery = hallTicketDelivery.map(ticket => {
        if (ticket.status === 'FAILED') {
          // 70% success rate on retry
          if (Math.random() > 0.3) {
            return { ...ticket, status: 'DELIVERED' as const, reason: undefined };
          }
        }
        return ticket;
      });
      
      setHallTicketDelivery(updatedDelivery);
      const newSuccesses = updatedDelivery.filter(h => h.status === 'DELIVERED').length - 
                          hallTicketDelivery.filter(h => h.status === 'DELIVERED').length;
      toast.success(`Retry completed! ${newSuccesses} additional tickets delivered successfully.`);
    }, 2000);
  };

  const handleResolveDetention = (rollNumber: string) => {
    if (seatAllocation) {
      const updatedDetained = seatAllocation.detainedStudents.filter(s => s.rollNumber !== rollNumber);
      setSeatAllocation({
        ...seatAllocation,
        detained: updatedDetained.length,
        detainedStudents: updatedDetained,
        allocated: seatAllocation.allocated + 1
      });
      toast.success(`Student ${rollNumber} detention resolved and seat allocated!`);
    }
  };

  const handleBulkCreditReview = () => {
    const criticalStudents = filteredCreditRiskStudents.filter(s => s.status === 'CREDIT_SHORTAGE');
    
    if (criticalStudents.length === 0) {
      toast.info('No critical credit shortage cases to review.');
      return;
    }

    toast.info(`Initiating bulk review for ${criticalStudents.length} students...`);
    
    setTimeout(() => {
      // Simulate review outcomes
      const updatedStudents = creditRiskStudents.map(student => {
        if (student.status === 'CREDIT_SHORTAGE') {
          // Some get provisionally promoted, others remain detained
          if (Math.random() > 0.4) {
            return { 
              ...student, 
              status: 'PROVISIONALLY_PROMOTED',
              statusChangeDate: new Date().toISOString().split('T')[0]
            };
          }
        }
        return student;
      });
      
      setCreditRiskStudents(updatedStudents);
      const promoted = updatedStudents.filter(s => s.status === 'PROVISIONALLY_PROMOTED').length -
                     creditRiskStudents.filter(s => s.status === 'PROVISIONALLY_PROMOTED').length;
      toast.success(`Bulk review completed! ${promoted} students provisionally promoted.`);
    }, 3000);
  };

  const handleExportReport = (type: 'credit' | 'hallticket' | 'seating') => {
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
      case 'credit':
        data = filteredCreditRiskStudents;
        filename = 'credit_risk_report.csv';
        break;
      case 'hallticket':
        data = hallTicketDelivery;
        filename = 'hall_ticket_delivery_report.csv';
        break;
      case 'seating':
        data = seatAllocation?.detainedStudents || [];
        filename = 'detained_students_report.csv';
        break;
    }
    
    toast.success(`Exporting ${data.length} records to ${filename}...`);
    // In real app, this would generate and download the CSV
  };

  const filteredCreditRiskStudents = creditRiskStudents.filter(student => {
    if (selectedDepartment !== 'ALL' && student.department !== selectedDepartment) return false;
    if (selectedYear !== 'ALL' && student.year.toString() !== selectedYear) return false;
    return true;
  });

  const hallTicketStats = {
    total: hallTicketDelivery.length,
    delivered: hallTicketDelivery.filter(h => h.status === 'DELIVERED').length,
    failed: hallTicketDelivery.filter(h => h.status === 'FAILED').length,
    pending: hallTicketDelivery.filter(h => h.status === 'PENDING').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard - Edge Cases</h1>
            <p className="text-gray-600">Monitor and manage critical edge cases across the system</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="rounded"
              />
              Demo Mode (Show Edge Cases)
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-sm">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'credit', label: 'Credit Risk', icon: AlertTriangle },
              { id: 'hallticket', label: 'Hall Tickets', icon: FileText },
              { id: 'seating', label: 'Seat Allocation', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-cyan-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 backdrop-blur rounded-xl p-6 border border-red-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{filteredCreditRiskStudents.length}</div>
                <div className="text-red-700 text-sm">Credit Risk Students</div>
              </div>

              <div className="bg-yellow-50 backdrop-blur rounded-xl p-6 border border-yellow-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <XCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{hallTicketStats.failed}</div>
                <div className="text-yellow-700 text-sm">Failed Hall Tickets</div>
              </div>

              <div className="bg-blue-50 backdrop-blur rounded-xl p-6 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-8 h-8 text-blue-600" />
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{seatAllocation?.detained || 0}</div>
                <div className="text-blue-700 text-sm">Detained Students</div>
              </div>

              <div className="bg-green-50 backdrop-blur rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{hallTicketStats.delivered}</div>
                <div className="text-green-700 text-sm">Successful Deliveries</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleBulkCreditReview}
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Review Credit Risks</div>
                    <div className="text-sm text-red-700">{filteredCreditRiskStudents.length} students need attention</div>
                  </div>
                </button>

                <button 
                  onClick={handleRetryFailedHallTickets}
                  className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                >
                  <RefreshCw className="w-6 h-6 text-yellow-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Retry Failed Hall Tickets</div>
                    <div className="text-sm text-yellow-700">{hallTicketStats.failed} failed uploads</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleExportReport('credit')}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Export Reports</div>
                    <div className="text-sm text-blue-700">Download all edge case data</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credit Risk Tab */}
        {activeTab === 'credit' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-white" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="ALL">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="ALL">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                <div className="ml-auto text-white">
                  Showing {filteredCreditRiskStudents.length} students
                </div>
              </div>
            </div>

            {/* Credit Risk Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Roll Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredCreditRiskStudents.map((student) => (
                      <tr key={student.rollNumber} className="hover:bg-white/5">
                        <td className="px-6 py-4 text-sm text-white font-medium">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-sm text-white">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{student.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{student.year}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-white">{student.creditsEarned} / {student.creditsRequired}</div>
                          <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(student.creditsEarned / student.creditsRequired) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(student.status)}</td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hall Ticket Tab */}
        {activeTab === 'hallticket' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{hallTicketStats.total}</div>
                <div className="text-gray-300 text-sm">Total Uploads</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur rounded-xl p-4 border border-green-300/30">
                <div className="text-2xl font-bold text-green-300">{hallTicketStats.delivered}</div>
                <div className="text-green-200 text-sm">Delivered</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur rounded-xl p-4 border border-red-300/30">
                <div className="text-2xl font-bold text-red-300">{hallTicketStats.failed}</div>
                <div className="text-red-200 text-sm">Failed</div>
              </div>
              <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-4 border border-yellow-300/30">
                <div className="text-2xl font-bold text-yellow-300">{hallTicketStats.pending}</div>
                <div className="text-yellow-200 text-sm">Pending</div>
              </div>
            </div>

            {/* Delivery Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Delivery Status</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Failed List
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Retry Failed Only
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Roll Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Filename</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {hallTicketDelivery.map((ticket) => (
                      <tr key={ticket.rollNumber} className="hover:bg-white/5">
                        <td className="px-6 py-4 text-sm text-white font-medium">{ticket.rollNumber}</td>
                        <td className="px-6 py-4 text-sm text-white">{ticket.name}</td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{ticket.reason || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{ticket.filename || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Seating Tab */}
        {activeTab === 'seating' && seatAllocation && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{seatAllocation.totalSeats}</div>
                <div className="text-gray-300 text-sm">Total Seats</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur rounded-xl p-4 border border-green-300/30">
                <div className="text-2xl font-bold text-green-300">{seatAllocation.allocated}</div>
                <div className="text-green-200 text-sm">Allocated</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur rounded-xl p-4 border border-red-300/30">
                <div className="text-2xl font-bold text-red-300">{seatAllocation.detained}</div>
                <div className="text-red-200 text-sm">Detained (Excluded)</div>
              </div>
              <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-4 border border-yellow-300/30">
                <div className="text-2xl font-bold text-yellow-300">{seatAllocation.pending}</div>
                <div className="text-yellow-200 text-sm">Pending</div>
              </div>
            </div>

            {/* Detained Students */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-red-300 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">
                  {seatAllocation.detained} Detained Students Excluded from Allocation
                </h3>
              </div>

              <div className="space-y-3">
                {seatAllocation.detainedStudents.map((student) => (
                  <div key={student.rollNumber} className="bg-red-500/10 border border-red-300/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{student.rollNumber} - {student.name}</div>
                        <div className="text-sm text-red-300 mt-1">{student.reason}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleResolveDetention(student.rollNumber)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Info */}
        {demoMode && (
          <div className="bg-yellow-50 backdrop-blur rounded-xl p-4 border border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Demo Mode Active - Showing Simulated Edge Cases
            </div>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• Credit shortage students with status timelines</p>
              <p>• Failed hall ticket mappings with reasons</p>
              <p>• Detained students excluded from seat allocation</p>
              <p>• All edge cases are visible and actionable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardEdgeCases;