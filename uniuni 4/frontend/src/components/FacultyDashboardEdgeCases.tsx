import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Send,
  Eye,
  Bell
} from 'lucide-react';

interface ClubEvent {
  id: string;
  name: string;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED';
  originalDate: string;
  newDate?: string;
  venue: string;
  registeredStudents: number;
  maxCapacity: number;
  reason?: string;
  lastModified: string;
  modifiedBy: string;
}

interface EventRegistration {
  rollNumber: string;
  name: string;
  department: string;
  year: number;
  registrationDate: string;
  status: 'REGISTERED' | 'WAITLISTED' | 'CANCELLED';
}

interface NotificationPreview {
  eventId: string;
  eventName: string;
  type: 'RESCHEDULE' | 'CANCELLATION' | 'REMINDER';
  recipients: number;
  message: string;
  scheduledTime: string;
}

const FacultyDashboardEdgeCases: React.FC = () => {
  const [demoMode, setDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'notifications'>('events');
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [notifications, setNotifications] = useState<NotificationPreview[]>([]);

  useEffect(() => {
    if (demoMode) {
      loadDemoData();
    }
  }, [demoMode]);

  const loadDemoData = () => {
    // Demo Events with Edge Cases
    setEvents([
      {
        id: '1',
        name: 'Tech Symposium 2025',
        status: 'RESCHEDULED',
        originalDate: '2025-01-25',
        newDate: '2025-02-05',
        venue: 'Main Auditorium',
        registeredStudents: 150,
        maxCapacity: 200,
        reason: 'Venue unavailability due to exam schedule conflict',
        lastModified: '2025-01-20T10:30:00Z',
        modifiedBy: 'Dr. Rajesh Kumar'
      },
      {
        id: '2',
        name: 'Coding Competition',
        status: 'CANCELLED',
        originalDate: '2025-01-30',
        venue: 'Computer Lab',
        registeredStudents: 25,
        maxCapacity: 50,
        reason: 'Insufficient registrations (minimum 50 required)',
        lastModified: '2025-01-18T14:15:00Z',
        modifiedBy: 'Prof. Priya Sharma'
      },
      {
        id: '3',
        name: 'Cultural Fest',
        status: 'SCHEDULED',
        originalDate: '2025-02-15',
        venue: 'Open Ground',
        registeredStudents: 300,
        maxCapacity: 500,
        lastModified: '2025-01-10T09:00:00Z',
        modifiedBy: 'Dr. Amit Patel'
      },
      {
        id: '4',
        name: 'Workshop on AI/ML',
        status: 'RESCHEDULED',
        originalDate: '2025-02-01',
        newDate: '2025-02-08',
        venue: 'Seminar Hall',
        registeredStudents: 80,
        maxCapacity: 100,
        reason: 'Guest speaker unavailability',
        lastModified: '2025-01-19T16:45:00Z',
        modifiedBy: 'Dr. Sneha Reddy'
      }
    ]);

    // Demo Registrations
    setRegistrations([
      { rollNumber: 'CSE001', name: 'Rahul Kumar', department: 'CSE', year: 4, registrationDate: '2025-01-15', status: 'REGISTERED' },
      { rollNumber: 'CSE002', name: 'Ananya Verma', department: 'CSE', year: 3, registrationDate: '2025-01-16', status: 'REGISTERED' },
      { rollNumber: 'ECE001', name: 'Arjun Mehta', department: 'ECE', year: 4, registrationDate: '2025-01-17', status: 'WAITLISTED' },
      { rollNumber: 'MECH001', name: 'Lakshmi Rao', department: 'MECH', year: 2, registrationDate: '2025-01-18', status: 'CANCELLED' },
      { rollNumber: 'CSE003', name: 'Karthik Reddy', department: 'CSE', year: 3, registrationDate: '2025-01-19', status: 'REGISTERED' }
    ]);

    // Demo Notifications
    setNotifications([
      {
        eventId: '1',
        eventName: 'Tech Symposium 2025',
        type: 'RESCHEDULE',
        recipients: 150,
        message: 'Important Update: Tech Symposium has been rescheduled from Jan 25 to Feb 5 due to venue unavailability. New venue: Main Auditorium. We apologize for any inconvenience.',
        scheduledTime: '2025-01-20T11:00:00Z'
      },
      {
        eventId: '2',
        eventName: 'Coding Competition',
        type: 'CANCELLATION',
        recipients: 25,
        message: 'We regret to inform you that the Coding Competition scheduled for Jan 30 has been cancelled due to insufficient registrations. Registration fees will be refunded within 5 working days.',
        scheduledTime: '2025-01-18T15:00:00Z'
      },
      {
        eventId: '3',
        eventName: 'Cultural Fest',
        type: 'REMINDER',
        recipients: 300,
        message: 'Reminder: Cultural Fest is scheduled for Feb 15 at Open Ground. Please arrive 30 minutes early for registration. Bring your student ID card.',
        scheduledTime: '2025-02-13T09:00:00Z'
      }
    ]);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      SCHEDULED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Scheduled' },
      RESCHEDULED: { color: 'bg-yellow-100 text-yellow-800', icon: Calendar, text: 'Rescheduled' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' },
      REGISTERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Registered' },
      WAITLISTED: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Waitlisted' }
    };

    const badge = badges[status];
    if (!badge) return null;

    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const handleRescheduleEvent = (eventId: string, newDate: string, reason: string) => {
    setEvents(events.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            status: 'RESCHEDULED' as const,
            newDate,
            reason,
            lastModified: new Date().toISOString(),
            modifiedBy: 'Current User'
          }
        : e
    ));
    
    // Add notification
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newNotification = {
        eventId,
        eventName: event.name,
        type: 'RESCHEDULE' as const,
        recipients: event.registeredStudents,
        message: `Important Update: ${event.name} has been rescheduled from ${event.originalDate} to ${newDate}. Reason: ${reason}. We apologize for any inconvenience.`,
        scheduledTime: new Date().toISOString()
      };
      setNotifications([newNotification, ...notifications]);
    }
    
    toast.success('Event rescheduled and notifications queued!');
  };

  const handleCancelEvent = (eventId: string, reason: string) => {
    setEvents(events.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            status: 'CANCELLED' as const,
            reason,
            lastModified: new Date().toISOString(),
            modifiedBy: 'Current User'
          }
        : e
    ));
    
    // Add notification
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newNotification = {
        eventId,
        eventName: event.name,
        type: 'CANCELLATION' as const,
        recipients: event.registeredStudents,
        message: `We regret to inform you that ${event.name} scheduled for ${event.originalDate} has been cancelled. Reason: ${reason}. Registration fees will be refunded within 5 working days.`,
        scheduledTime: new Date().toISOString()
      };
      setNotifications([newNotification, ...notifications]);
    }
    
    toast.success('Event cancelled and notifications queued!');
  };

  const handleSendNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.eventId === notificationId);
    if (notification) {
      toast.success(`Notification sent to ${notification.recipients} students!`);
      // In real app, this would trigger email/SMS sending
    }
  };

  const handleBulkAction = (action: 'approve' | 'reschedule' | 'cancel', eventIds: string[]) => {
    if (action === 'approve') {
      setEvents(events.map(e => 
        eventIds.includes(e.id) 
          ? { ...e, status: 'SCHEDULED' as const }
          : e
      ));
      toast.success(`${eventIds.length} events approved!`);
    }
    // Add other bulk actions as needed
  };

  const getEventStats = () => {
    return {
      total: events.length,
      scheduled: events.filter(e => e.status === 'SCHEDULED').length,
      rescheduled: events.filter(e => e.status === 'RESCHEDULED').length,
      cancelled: events.filter(e => e.status === 'CANCELLED').length
    };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Faculty Dashboard - Event Management</h1>
            <p className="text-gray-600">Manage club events and handle edge cases</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-cyan-200 shadow-sm">
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.total}</div>
            <div className="text-gray-600">Total Events</div>
          </div>
          <div className="bg-green-50 backdrop-blur rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.scheduled}</div>
            <div className="text-green-700">Scheduled</div>
          </div>
          <div className="bg-yellow-50 backdrop-blur rounded-xl p-6 border border-yellow-200 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.rescheduled}</div>
            <div className="text-yellow-700">Rescheduled</div>
          </div>
          <div className="bg-red-50 backdrop-blur rounded-xl p-6 border border-red-200 shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
            <div className="text-red-700">Cancelled</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200 shadow-sm">
          <div className="flex gap-2">
            {[
              { id: 'events', label: 'Event Management', icon: Calendar },
              { id: 'registrations', label: 'Registrations', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell }
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

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(event.status)}
                      <span className="text-gray-600 text-sm">
                        {event.registeredStudents} / {event.maxCapacity} registered
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newDate = prompt('Enter new date (YYYY-MM-DD):');
                        const reason = prompt('Enter reason for rescheduling:');
                        if (newDate && reason) {
                          handleRescheduleEvent(event.id, newDate, reason);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button 
                      onClick={() => {
                        const reason = prompt('Enter reason for cancellation:');
                        if (reason) {
                          handleCancelEvent(event.id, reason);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Venue:</span>
                        <span className="text-gray-800">{event.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="text-gray-800">{event.maxCapacity} students</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Modified:</span>
                        <span className="text-gray-800">{new Date(event.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modified By:</span>
                        <span className="text-gray-800">{event.modifiedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Schedule Information</h4>
                    <div className="space-y-2 text-sm">
                      {event.status === 'RESCHEDULED' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Original Date:</span>
                            <span className="text-red-600 line-through">{event.originalDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">New Date:</span>
                            <span className="text-yellow-600 font-medium">{event.newDate}</span>
                          </div>
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-yellow-700 text-xs font-medium mb-1">Reschedule Reason:</div>
                            <div className="text-yellow-800 text-xs">{event.reason}</div>
                          </div>
                        </>
                      )}

                      {event.status === 'CANCELLED' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scheduled Date:</span>
                            <span className="text-red-600 line-through">{event.originalDate}</span>
                          </div>
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-red-700 text-xs font-medium mb-1">Cancellation Reason:</div>
                            <div className="text-red-800 text-xs">{event.reason}</div>
                          </div>
                        </>
                      )}

                      {event.status === 'SCHEDULED' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled Date:</span>
                          <span className="text-green-600">{event.originalDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Registration Progress</span>
                    <span>{event.registeredStudents} / {event.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        event.registeredStudents < event.maxCapacity * 0.5 ? 'bg-red-500' :
                        event.registeredStudents < event.maxCapacity * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(event.registeredStudents / event.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Event Registrations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {registrations.map((registration) => (
                    <tr key={registration.rollNumber} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white font-medium">{registration.rollNumber}</td>
                      <td className="px-6 py-4 text-sm text-white">{registration.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{registration.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{registration.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{registration.registrationDate}</td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(registration.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div key={notification.eventId} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{notification.eventName}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'RESCHEDULE' ? 'bg-yellow-100 text-yellow-800' :
                        notification.type === 'CANCELLATION' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {notification.recipients} recipients
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSendNotification(notification.eventId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    Send Now
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Notification Preview:</h4>
                  <p className="text-white text-sm leading-relaxed">{notification.message}</p>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  <strong>Scheduled Time:</strong> {new Date(notification.scheduledTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Mode Info */}
        {demoMode && (
          <div className="bg-yellow-50 backdrop-blur rounded-xl p-4 border border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Demo Mode Active - Faculty Edge Cases
            </div>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• Event rescheduling with automatic notifications</p>
              <p>• Event cancellation due to insufficient registrations</p>
              <p>• Registration management with waitlists</p>
              <p>• Notification preview before sending to students</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboardEdgeCases;