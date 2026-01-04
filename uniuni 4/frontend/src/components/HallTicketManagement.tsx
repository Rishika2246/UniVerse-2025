import React, { useState } from 'react';
import { Upload, BarChart3, Users, FileText, Settings } from 'lucide-react';
import HallTicketBulkUploadMock from './HallTicketBulkUploadMock';
import HallTicketDeliveryReport from './HallTicketDeliveryReport';

type TabType = 'upload' | 'report' | 'analytics' | 'settings';

const HallTicketManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  const tabs = [
    { id: 'upload' as TabType, label: 'Bulk Upload', icon: Upload },
    { id: 'report' as TabType, label: 'Delivery Report', icon: FileText },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <HallTicketBulkUploadMock />;
      case 'report':
        return <HallTicketDeliveryReport />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <HallTicketBulkUploadMock />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Hall Ticket Management</h1>
          <p className="text-gray-300">Manage bulk hall ticket uploads and track delivery status</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/20">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const uploadStats = {
    totalUploads: 1250,
    successRate: 94.2,
    avgProcessingTime: '2.3 min',
    totalBranches: 8
  };

  const branchStats = [
    { branch: 'CSE', total: 320, delivered: 315, failed: 5, rate: 98.4 },
    { branch: 'ECE', total: 280, delivered: 275, failed: 5, rate: 98.2 },
    { branch: 'MECH', total: 250, delivered: 240, failed: 10, rate: 96.0 },
    { branch: 'CIVIL', total: 200, delivered: 195, failed: 5, rate: 97.5 },
    { branch: 'EEE', total: 200, delivered: 190, failed: 10, rate: 95.0 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/20 backdrop-blur rounded-xl p-6 border border-blue-300/30">
          <div className="text-3xl font-bold text-white mb-2">{uploadStats.totalUploads}</div>
          <div className="text-blue-200">Total Hall Tickets</div>
        </div>
        <div className="bg-green-500/20 backdrop-blur rounded-xl p-6 border border-green-300/30">
          <div className="text-3xl font-bold text-white mb-2">{uploadStats.successRate}%</div>
          <div className="text-green-200">Success Rate</div>
        </div>
        <div className="bg-purple-500/20 backdrop-blur rounded-xl p-6 border border-purple-300/30">
          <div className="text-3xl font-bold text-white mb-2">{uploadStats.avgProcessingTime}</div>
          <div className="text-purple-200">Avg Processing Time</div>
        </div>
        <div className="bg-orange-500/20 backdrop-blur rounded-xl p-6 border border-orange-300/30">
          <div className="text-3xl font-bold text-white mb-2">{uploadStats.totalBranches}</div>
          <div className="text-orange-200">Active Branches</div>
        </div>
      </div>

      {/* Branch Performance */}
      <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Branch-wise Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-3">Branch</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Delivered</th>
                <th className="text-left p-3">Failed</th>
                <th className="text-left p-3">Success Rate</th>
                <th className="text-left p-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {branchStats.map(branch => (
                <tr key={branch.branch} className="border-b border-white/10">
                  <td className="p-3 font-medium">{branch.branch}</td>
                  <td className="p-3">{branch.total}</td>
                  <td className="p-3 text-green-400">{branch.delivered}</td>
                  <td className="p-3 text-red-400">{branch.failed}</td>
                  <td className="p-3">
                    <span className={`font-medium ${
                      branch.rate >= 98 ? 'text-green-400' :
                      branch.rate >= 95 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {branch.rate}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${branch.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  const [settings, setSettings] = useState({
    autoAcknowledge: false,
    emailNotifications: true,
    maxFileSize: 10,
    allowedFormats: ['PDF', 'JPG', 'PNG'],
    batchSize: 50,
    retryAttempts: 3
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Settings */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Upload Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Batch Processing Size
              </label>
              <input
                type="number"
                value={settings.batchSize}
                onChange={(e) => handleSettingChange('batchSize', parseInt(e.target.value))}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Retry Attempts
              </label>
              <input
                type="number"
                value={settings.retryAttempts}
                onChange={(e) => handleSettingChange('retryAttempts', parseInt(e.target.value))}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto Acknowledge Delivery</span>
              <input
                type="checkbox"
                checked={settings.autoAcknowledge}
                onChange={(e) => handleSettingChange('autoAcknowledge', e.target.checked)}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default HallTicketManagement;