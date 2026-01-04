const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== SOS SYSTEM APIS =====

// Create SOS alert
const createSOSAlert = async (req, res, next) => {
  try {
    const { type, location, description, severity, anonymous } = req.body;
    const userId = req.user.id;

    const sosAlert = {
      id: `SOS_${Date.now()}`,
      userId: anonymous ? null : userId,
      type, // 'emergency', 'medical', 'security', 'mental_health', 'harassment', 'other'
      location: {
        coordinates: location.coordinates,
        building: location.building,
        room: location.room,
        description: location.description
      },
      description,
      severity, // 'low', 'medium', 'high', 'critical'
      anonymous: anonymous || false,
      status: 'active',
      createdAt: new Date().toISOString(),
      respondedAt: null,
      resolvedAt: null,
      responders: [],
      updates: []
    };

    // Mock emergency response team notification
    const notifications = [
      { team: 'Campus Security', notified: true, eta: '3-5 minutes' },
      { team: 'Medical Team', notified: severity === 'critical', eta: '5-8 minutes' },
      { team: 'Counseling Services', notified: type === 'mental_health', eta: '10-15 minutes' }
    ];

    res.status(201).json({
      status: 'success',
      message: 'SOS alert created successfully. Help is on the way.',
      data: {
        alert: sosAlert,
        notifications,
        emergencyContacts: [
          { name: 'Campus Security', phone: '+91-9876543210' },
          { name: 'Medical Emergency', phone: '+91-9876543211' },
          { name: 'Counseling Services', phone: '+91-9876543212' }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's SOS alerts
const getUserSOSAlerts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const alerts = [
      {
        id: 'SOS_1701234567890',
        type: 'medical',
        location: { building: 'Main Block', room: 'Room 301', description: 'Near library entrance' },
        description: 'Student feeling dizzy and nauseous',
        severity: 'medium',
        status: 'resolved',
        createdAt: '2024-11-28T10:30:00Z',
        respondedAt: '2024-11-28T10:33:00Z',
        resolvedAt: '2024-11-28T10:45:00Z',
        responseTime: '3 minutes',
        responders: ['Medical Team', 'Campus Security']
      },
      {
        id: 'SOS_1701234567891',
        type: 'security',
        location: { building: 'Hostel Block A', room: 'Ground Floor', description: 'Near main entrance' },
        description: 'Suspicious activity reported',
        severity: 'high',
        status: 'in_progress',
        createdAt: '2024-12-01T22:15:00Z',
        respondedAt: '2024-12-01T22:17:00Z',
        resolvedAt: null,
        responseTime: '2 minutes',
        responders: ['Campus Security']
      }
    ];

    const filteredAlerts = status ? alerts.filter(a => a.status === status) : alerts;

    res.status(200).json({
      status: 'success',
      results: filteredAlerts.length,
      data: {
        alerts: filteredAlerts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredAlerts.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update SOS alert status
const updateSOSAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { status, update, responderId } = req.body;

    const alertUpdate = {
      alertId,
      status,
      update,
      updatedBy: responderId || req.user.id,
      updatedAt: new Date().toISOString()
    };

    // Mock status updates
    const statusMessages = {
      'acknowledged': 'Alert acknowledged. Help is on the way.',
      'in_progress': 'Responders are on site and handling the situation.',
      'resolved': 'Situation resolved successfully.',
      'false_alarm': 'Alert marked as false alarm.'
    };

    res.status(200).json({
      status: 'success',
      message: statusMessages[status] || 'Alert updated successfully',
      data: { alertUpdate }
    });
  } catch (error) {
    next(error);
  }
};

// Get emergency contacts
const getEmergencyContacts = async (req, res, next) => {
  try {
    const emergencyContacts = {
      campus: [
        { name: 'Campus Security', phone: '+91-9876543210', available24x7: true, type: 'security' },
        { name: 'Medical Emergency', phone: '+91-9876543211', available24x7: true, type: 'medical' },
        { name: 'Counseling Services', phone: '+91-9876543212', available24x7: false, hours: '9 AM - 6 PM', type: 'mental_health' },
        { name: 'Hostel Warden', phone: '+91-9876543213', available24x7: true, type: 'hostel' },
        { name: 'Dean of Students', phone: '+91-9876543214', available24x7: false, hours: '9 AM - 5 PM', type: 'academic' }
      ],
      external: [
        { name: 'Police Emergency', phone: '100', available24x7: true, type: 'police' },
        { name: 'Medical Emergency', phone: '108', available24x7: true, type: 'medical' },
        { name: 'Fire Emergency', phone: '101', available24x7: true, type: 'fire' },
        { name: 'Women Helpline', phone: '1091', available24x7: true, type: 'women_safety' }
      ],
      quickActions: [
        { name: 'Call Campus Security', action: 'call', number: '+91-9876543210' },
        { name: 'Send Location to Emergency Contact', action: 'location_share' },
        { name: 'Start Recording', action: 'record' },
        { name: 'Silent Alarm', action: 'silent_alert' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: emergencyContacts
    });
  } catch (error) {
    next(error);
  }
};

// Get safety resources
const getSafetyResources = async (req, res, next) => {
  try {
    const safetyResources = {
      guidelines: [
        {
          category: 'Personal Safety',
          tips: [
            'Always inform someone about your whereabouts',
            'Use well-lit paths when walking alone',
            'Keep emergency contacts readily available',
            'Trust your instincts if something feels wrong'
          ]
        },
        {
          category: 'Digital Safety',
          tips: [
            'Don\'t share personal information online',
            'Use strong passwords and enable 2FA',
            'Be cautious of suspicious links and emails',
            'Report cyberbullying or harassment'
          ]
        },
        {
          category: 'Mental Health',
          tips: [
            'Reach out for help when feeling overwhelmed',
            'Maintain a healthy work-life balance',
            'Practice stress management techniques',
            'Connect with counseling services if needed'
          ]
        }
      ],
      emergencyProcedures: [
        {
          situation: 'Medical Emergency',
          steps: [
            'Call campus medical emergency number immediately',
            'Provide clear location and nature of emergency',
            'Stay with the person until help arrives',
            'Follow instructions from medical personnel'
          ]
        },
        {
          situation: 'Fire Emergency',
          steps: [
            'Activate fire alarm if safe to do so',
            'Evacuate immediately using nearest exit',
            'Do not use elevators',
            'Gather at designated assembly point'
          ]
        },
        {
          situation: 'Security Threat',
          steps: [
            'Move to a safe location immediately',
            'Call campus security',
            'Follow lockdown procedures if announced',
            'Stay calm and follow official instructions'
          ]
        }
      ],
      safeZones: [
        { name: 'Library', location: 'Main Block', hours: '24/7', features: ['CCTV', 'Security Guard', 'Emergency Phone'] },
        { name: 'Student Center', location: 'Central Campus', hours: '6 AM - 11 PM', features: ['CCTV', 'Staff Present', 'Emergency Button'] },
        { name: 'Medical Center', location: 'Health Block', hours: '24/7', features: ['Medical Staff', 'Emergency Equipment', 'Direct Police Line'] }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: safetyResources
    });
  } catch (error) {
    next(error);
  }
};

// Report incident (non-emergency)
const reportIncident = async (req, res, next) => {
  try {
    const { type, location, description, anonymous, witnesses, evidence } = req.body;
    const userId = req.user.id;

    const incident = {
      id: `INC_${Date.now()}`,
      userId: anonymous ? null : userId,
      type, // 'harassment', 'theft', 'vandalism', 'discrimination', 'other'
      location,
      description,
      anonymous: anonymous || false,
      witnesses: witnesses || [],
      evidence: evidence || [],
      status: 'reported',
      reportedAt: new Date().toISOString(),
      assignedTo: null,
      updates: []
    };

    res.status(201).json({
      status: 'success',
      message: 'Incident reported successfully. We will investigate and take appropriate action.',
      data: {
        incident,
        referenceNumber: incident.id,
        nextSteps: [
          'Your report has been logged and assigned a reference number',
          'Investigation team will review the incident within 24 hours',
          'You will be contacted if additional information is needed',
          'Updates will be provided as the investigation progresses'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get incident reports
const getIncidentReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;

    const incidents = [
      {
        id: 'INC_1701234567890',
        type: 'harassment',
        location: { building: 'Academic Block', description: 'Near cafeteria' },
        description: 'Inappropriate behavior reported',
        status: 'under_investigation',
        reportedAt: '2024-11-25T14:30:00Z',
        lastUpdate: '2024-11-26T10:00:00Z',
        assignedTo: 'Investigation Team A'
      },
      {
        id: 'INC_1701234567891',
        type: 'theft',
        location: { building: 'Library', description: 'Study area, 2nd floor' },
        description: 'Laptop stolen from unattended desk',
        status: 'resolved',
        reportedAt: '2024-11-20T16:45:00Z',
        lastUpdate: '2024-11-22T12:00:00Z',
        assignedTo: 'Security Team'
      }
    ];

    let filteredIncidents = incidents;
    if (status) filteredIncidents = filteredIncidents.filter(i => i.status === status);
    if (type) filteredIncidents = filteredIncidents.filter(i => i.type === type);

    res.status(200).json({
      status: 'success',
      results: filteredIncidents.length,
      data: { incidents: filteredIncidents }
    });
  } catch (error) {
    next(error);
  }
};

// Get SOS analytics (for admin/security)
const getSOSAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '30d' } = req.query;

    const analytics = {
      overview: {
        totalAlerts: 45,
        resolvedAlerts: 42,
        activeAlerts: 3,
        averageResponseTime: '4.2 minutes',
        falseAlarms: 8
      },
      alertsByType: [
        { type: 'medical', count: 18, percentage: 40 },
        { type: 'security', count: 12, percentage: 27 },
        { type: 'mental_health', count: 8, percentage: 18 },
        { type: 'harassment', count: 4, percentage: 9 },
        { type: 'other', count: 3, percentage: 6 }
      ],
      alertsBySeverity: [
        { severity: 'low', count: 15, avgResponseTime: '6.1 minutes' },
        { severity: 'medium', count: 20, avgResponseTime: '4.8 minutes' },
        { severity: 'high', count: 8, avgResponseTime: '2.9 minutes' },
        { severity: 'critical', count: 2, avgResponseTime: '1.5 minutes' }
      ],
      responseTeamPerformance: [
        { team: 'Campus Security', alerts: 35, avgResponseTime: '3.2 minutes', rating: 4.8 },
        { team: 'Medical Team', alerts: 18, avgResponseTime: '5.1 minutes', rating: 4.9 },
        { team: 'Counseling Services', alerts: 8, avgResponseTime: '12.3 minutes', rating: 4.7 }
      ],
      timeAnalysis: {
        peakHours: ['10:00-12:00', '14:00-16:00', '20:00-22:00'],
        peakDays: ['Monday', 'Wednesday', 'Friday'],
        monthlyTrend: [
          { month: 'Sep', alerts: 38 },
          { month: 'Oct', alerts: 42 },
          { month: 'Nov', alerts: 45 },
          { month: 'Dec', alerts: 28 }
        ]
      }
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSOSAlert,
  getUserSOSAlerts,
  updateSOSAlert,
  getEmergencyContacts,
  getSafetyResources,
  reportIncident,
  getIncidentReports,
  getSOSAnalytics
};