import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  GraduationCap, 
  Users, 
  Eye, 
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import StudentDashboardEdgeCases from './StudentDashboardEdgeCases';
import AdminDashboardEdgeCases from './AdminDashboardEdgeCases';
import FacultyDashboardEdgeCases from './FacultyDashboardEdgeCases';

type RoleType = 'student' | 'admin' | 'faculty' | 'overview';

const EdgeCaseShowcase: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleType>('overview');
  const [demoMode, setDemoMode] = useState(true);

  const roles = [
    {
      id: 'overview' as RoleType,
      label: 'System Overview',
      icon: Eye,
      description: 'Complete edge case visibility across all roles',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'student' as RoleType,
      label: 'Student View',
      icon: GraduationCap,
      description: 'Personal status with transparent explanations',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'admin' as RoleType,
      label: 'Admin Dashboard',
      icon: Shield,
      description: 'Full system control and edge case management',
      color: 'from-red-600 to-pink-600'
    },
    {
      id: 'faculty' as RoleType,
      label: 'Faculty Portal',
      icon: Users,
      description: 'Event management and coordination tools',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const edgeCases = [
    {
      title: 'Credit Shortage After Promotion',
      description: 'Academic status reversal due to updated results',
      roles: ['student', 'admin'],
      status: 'critical',
      count: 5
    },
    {
      title: 'Hall Ticket Mapping Failures',
      description: 'Bulk upload issues with filename mismatches',
      roles: ['student', 'admin'],
      status: 'warning',
      count: 3
    },
    {
      title: 'Seat Allocation Exclusions',
      description: 'Detained students blocked from exam seating',
      roles: ['student', 'admin'],
      status: 'info',
      count: 15
    },
    {
      title: 'Event Rescheduling',
      description: 'Club events with venue conflicts and notifications',
      roles: ['student', 'faculty'],
      status: 'warning',
      count: 2
    },
    {
      title: 'Registration Cancellations',
      description: 'Events cancelled due to insufficient participation',
      roles: ['student', 'faculty'],
      status: 'critical',
      count: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (activeRole !== 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Role Navigation Bar */}
        <div className="bg-black/20 backdrop-blur border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveRole('overview')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Back to Overview
              </button>
              <div className="text-white font-medium">
                Current View: {roles.find(r => r.id === activeRole)?.label}
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-300">
              <Star className="w-4 h-4" />
              Demo Mode Active
            </div>
          </div>
        </div>

        {/* Role-Specific Dashboard */}
        {activeRole === 'student' && <StudentDashboardEdgeCases />}
        {activeRole === 'admin' && <AdminDashboardEdgeCases />}
        {activeRole === 'faculty' && <FacultyDashboardEdgeCases />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">UniVerse Edge Case Showcase</h1>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Demonstrating intelligent edge case handling across all user roles. 
            Every edge case is visually explained with transparent status indicators and actionable insights.
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-300 bg-yellow-500/20 rounded-full px-6 py-2 inline-flex">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Demo Mode: All Edge Cases Visible</span>
          </div>
        </div>

        {/* Judge Demo Script */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur rounded-2xl p-6 border border-purple-300/30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Judge Demo Script (2 Minutes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div>
              <h3 className="font-bold text-lg mb-3 text-purple-300">What Makes This Special:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Edge cases are <strong>visually surfaced</strong>, not hidden in logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Each role sees <strong>relevant information</strong> with proper context</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>System <strong>explains itself</strong> - no blank screens or silent failures</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Real-time status updates with <strong>actionable next steps</strong></span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-blue-300">Demo Flow:</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Show <strong>Student View</strong> - Credit shortage with clear timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Show <strong>Admin Dashboard</strong> - Bulk operations with failure handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Show <strong>Faculty Portal</strong> - Event management with notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <span>Highlight <strong>role-based visibility</strong> and intelligent explanations</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Edge Cases Overview */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Edge Cases Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {edgeCases.map((edgeCase, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-white text-sm">{edgeCase.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(edgeCase.status)}`}>
                    {getStatusIcon(edgeCase.status)}
                    {edgeCase.count}
                  </span>
                </div>
                <p className="text-gray-300 text-xs mb-3">{edgeCase.description}</p>
                <div className="flex flex-wrap gap-1">
                  {edgeCase.roles.map((role) => (
                    <span key={role} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.slice(1).map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${role.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto group-hover:bg-white/30 transition-colors">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.label}</h3>
                  <p className="text-white/80 text-sm">{role.description}</p>
                  <div className="mt-4 text-white/60 text-xs">
                    Click to explore →
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">System Intelligence Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-300">✅ What We Do Right</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Visual status indicators with color-coded badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Progress timelines showing status changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Actionable buttons for next steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Role-based information filtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Real-time notifications and updates</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-red-300">❌ What We Avoid</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Silent failures without explanation</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Blank screens with no context</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Technical error messages for end users</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Hidden system states and processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Overwhelming information for wrong roles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Judge Quote */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur rounded-2xl p-6 border border-yellow-300/30 text-center">
          <div className="text-3xl font-bold text-white mb-4">
            "UniVerse doesn't just handle edge cases — it visually explains them in real time so students and admins always know what's happening and why."
          </div>
          <div className="text-yellow-300 font-medium">
            — Perfect for judge demonstrations and user confidence
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeCaseShowcase;