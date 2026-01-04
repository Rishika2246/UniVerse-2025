import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle,
  Users,
  Building,
  FileText,
  Calendar,
  Shield,
  Activity,
  BarChart3,
  Zap,
  RefreshCw,
  Download,
  Bell,
  Eye,
  Settings,
  Target,
  TrendingUp
} from 'lucide-react';

interface EdgeCasesOverviewProps {
  userRole: string;
}

const EdgeCasesOverview: React.FC<EdgeCasesOverviewProps> = ({ userRole }) => {
  const getFeaturesByRole = () => {
    switch (userRole) {
      case 'faculty':
        return {
          title: 'Faculty Edge Cases Management',
          description: 'Handle complex event management scenarios and student communication challenges',
          features: [
            {
              icon: Calendar,
              title: 'Event Rescheduling',
              description: 'Manage event conflicts, venue unavailability, and last-minute changes',
              capabilities: ['Automatic notification generation', 'Conflict detection', 'Bulk rescheduling']
            },
            {
              icon: Users,
              title: 'Registration Management',
              description: 'Handle overflow registrations, waitlists, and cancellations',
              capabilities: ['Waitlist management', 'Capacity overflow handling', 'Refund processing']
            },
            {
              icon: Bell,
              title: 'Communication Hub',
              description: 'Send targeted notifications for critical updates',
              capabilities: ['Multi-channel notifications', 'Template management', 'Delivery tracking']
            },
            {
              icon: BarChart3,
              title: 'Analytics & Insights',
              description: 'Track event performance and student engagement',
              capabilities: ['Attendance analytics', 'Engagement metrics', 'Trend analysis']
            }
          ]
        };

      case 'admin':
        return {
          title: 'Admin Edge Cases Dashboard',
          description: 'Monitor and resolve critical system-wide issues and student academic challenges',
          features: [
            {
              icon: AlertTriangle,
              title: 'Credit Risk Management',
              description: 'Identify and manage students with academic credit shortages',
              capabilities: ['Automated risk detection', 'Bulk review processes', 'Status tracking']
            },
            {
              icon: FileText,
              title: 'Hall Ticket Delivery',
              description: 'Track and resolve hall ticket delivery failures',
              capabilities: ['Failure analysis', 'Retry mechanisms', 'Delivery confirmation']
            },
            {
              icon: Building,
              title: 'Seating Allocation',
              description: 'Manage detained students and capacity issues',
              capabilities: ['Detention management', 'Capacity optimization', 'Accessibility compliance']
            },
            {
              icon: Activity,
              title: 'System Monitoring',
              description: 'Real-time monitoring of critical system processes',
              capabilities: ['Performance alerts', 'Data integrity checks', 'Automated recovery']
            }
          ]
        };

      case 'seating-manager':
        return {
          title: 'Seating Manager Edge Cases',
          description: 'Resolve complex seating conflicts and allocation challenges',
          features: [
            {
              icon: Target,
              title: 'Conflict Resolution',
              description: 'Detect and resolve seating arrangement conflicts',
              capabilities: ['Adjacency conflict detection', 'Auto-resolution algorithms', 'Manual override options']
            },
            {
              icon: Zap,
              title: 'Allocation Optimization',
              description: 'Handle overflow, underutilization, and distribution issues',
              capabilities: ['Capacity balancing', 'Department distribution', 'Special needs accommodation']
            },
            {
              icon: Shield,
              title: 'Accessibility Compliance',
              description: 'Ensure proper accommodation for special needs students',
              capabilities: ['Accessibility validation', 'Priority seating', 'Support assignment']
            },
            {
              icon: TrendingUp,
              title: 'Performance Analytics',
              description: 'Monitor allocation efficiency and conflict trends',
              capabilities: ['Resolution rate tracking', 'Conflict pattern analysis', 'Optimization suggestions']
            }
          ]
        };

      default:
        return {
          title: 'Edge Cases Management',
          description: 'Comprehensive edge case handling across all system components',
          features: []
        };
    }
  };

  const roleFeatures = getFeaturesByRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">{roleFeatures.title}</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {roleFeatures.description}
          </p>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="font-bold text-white mb-2">Proactive Detection</h3>
              <p className="text-gray-300 text-sm">
                Automatically identify potential issues before they become critical problems
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-bold text-white mb-2">Automated Resolution</h3>
              <p className="text-gray-300 text-sm">
                Smart algorithms resolve common conflicts automatically with manual override options
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="font-bold text-white mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-300 text-sm">
                Detailed insights and trends to prevent future edge cases and optimize processes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roleFeatures.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-cyan-300">Key Capabilities:</h4>
                    <ul className="space-y-1">
                      {feature.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-8 border border-red-300/30"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Handle Edge Cases?</h2>
            <p className="text-gray-300 mb-6">
              Access the full edge cases management system through your dashboard navigation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all">
                <Eye className="w-5 h-5" />
                View Live Demo
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <Download className="w-5 h-5" />
                Export Documentation
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <Settings className="w-5 h-5" />
                Configure Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-300 mb-1">95%</div>
            <div className="text-sm text-gray-300">Auto-Resolution Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-300 mb-1">24/7</div>
            <div className="text-sm text-gray-300">Monitoring Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-yellow-300 mb-1">&lt;2min</div>
            <div className="text-sm text-gray-300">Average Response Time</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-300 mb-1">99.9%</div>
            <div className="text-sm text-gray-300">System Reliability</div>
          </div>
        </motion.div>

        {/* Demo Mode Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-yellow-500/20 backdrop-blur rounded-xl p-4 border border-yellow-300/30"
        >
          <div className="flex items-center gap-2 text-yellow-200 font-medium mb-2">
            <AlertTriangle className="w-5 h-5" />
            Demo Mode Information
          </div>
          <div className="text-sm text-yellow-300 space-y-1">
            <p>• All edge cases shown are simulated for demonstration purposes</p>
            <p>• Interactive features include real-time conflict resolution and automated notifications</p>
            <p>• Data is reset on page refresh - no permanent changes are made</p>
            <p>• Full functionality available through role-specific navigation tabs</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EdgeCasesOverview;