const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== CLUB COORDINATOR DASHBOARD APIS =====

// Get club coordinator dashboard
const getClubCoordinatorDashboard = async (req, res, next) => {
  try {
    const coordinatorId = req.user.id;

    const stats = {
      pendingRequests: 12,
      approvedEvents: 34,
      upcomingEvents: 8,
      activeClubs: 15,
      totalBudget: '₹12.5L',
      avgRating: 4.6
    };

    const recentActivity = [
      { action: 'Event approved', item: 'Tech Club Hackathon', time: '2 hours ago' },
      { action: 'Budget allocated', item: 'Music Society Concert', time: '5 hours ago' },
      { action: 'Feedback received', item: 'Drama Club Workshop', time: '1 day ago' }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===== EVENT APPROVAL WORKFLOW APIS =====

// Get pending event requests
const getPendingEventRequests = async (req, res, next) => {
  try {
    const { priority, club, page = 1, limit = 20 } = req.query;

    const pendingRequests = [
      {
        id: 1,
        club: 'Tech Club',
        event: 'Hackathon 2024',
        date: '2024-04-15',
        venue: 'Main Auditorium',
        participants: 200,
        budget: '₹50,000',
        priority: 'high',
        documents: ['Proposal.pdf', 'Budget.xlsx', 'Agenda.docx'],
        submittedOn: '2024-03-01',
        description: 'A 24-hour coding hackathon with industry mentors and exciting prizes.',
        status: 'pending'
      },
      {
        id: 2,
        club: 'Music Society',
        event: 'Spring Concert',
        date: '2024-04-20',
        venue: 'Open Air Theatre',
        participants: 500,
        budget: '₹75,000',
        priority: 'medium',
        documents: ['Event_Plan.pdf', 'Artist_List.pdf'],
        submittedOn: '2024-03-05',
        description: 'Annual spring concert featuring student bands and guest performers.',
        status: 'pending'
      },
      {
        id: 3,
        club: 'Drama Club',
        event: 'Theatre Workshop',
        date: '2024-04-10',
        venue: 'Drama Hall',
        participants: 50,
        budget: '₹15,000',
        priority: 'low',
        documents: ['Workshop_Details.pdf'],
        submittedOn: '2024-03-08',
        description: 'Interactive workshop on contemporary theatre techniques.',
        status: 'pending'
      }
    ];

    let filteredRequests = pendingRequests;
    if (priority) filteredRequests = filteredRequests.filter(r => r.priority === priority);
    if (club) filteredRequests = filteredRequests.filter(r => r.club.toLowerCase().includes(club.toLowerCase()));

    res.status(200).json({
      status: 'success',
      results: filteredRequests.length,
      data: {
        requests: filteredRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredRequests.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get approved events
const getApprovedEvents = async (req, res, next) => {
  try {
    const { status, club } = req.query;

    const approvedEvents = [
      {
        id: 4,
        club: 'Photography Club',
        event: 'Photo Walk',
        date: '2024-03-25',
        status: 'scheduled',
        participants: 30,
        approvedOn: '2024-02-20',
        budget: '₹5,000'
      },
      {
        id: 5,
        club: 'Dance Society',
        event: 'Dance Competition',
        date: '2024-04-05',
        status: 'scheduled',
        participants: 150,
        approvedOn: '2024-02-25',
        budget: '₹25,000'
      }
    ];

    let filteredEvents = approvedEvents;
    if (status) filteredEvents = filteredEvents.filter(e => e.status === status);
    if (club) filteredEvents = filteredEvents.filter(e => e.club.toLowerCase().includes(club.toLowerCase()));

    res.status(200).json({
      status: 'success',
      results: filteredEvents.length,
      data: { events: filteredEvents }
    });
  } catch (error) {
    next(error);
  }
};

// Approve event request
const approveEventRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { comments, budgetApproved, conditions } = req.body;
    const coordinatorId = req.user.id;

    const approval = {
      requestId,
      status: 'approved',
      approvedBy: coordinatorId,
      approvedAt: new Date().toISOString(),
      comments,
      budgetApproved,
      conditions: conditions || [],
      nextSteps: [
        'Add event to campus calendar',
        'Notify club coordinator',
        'Release approved budget',
        'Send confirmation to stakeholders'
      ]
    };

    res.status(200).json({
      status: 'success',
      message: 'Event request approved successfully',
      data: { approval }
    });
  } catch (error) {
    next(error);
  }
};

// Reject event request
const rejectEventRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { reason, feedback } = req.body;
    const coordinatorId = req.user.id;

    const rejection = {
      requestId,
      status: 'rejected',
      rejectedBy: coordinatorId,
      rejectedAt: new Date().toISOString(),
      reason,
      feedback,
      appealProcess: 'Club can resubmit with modifications within 7 days'
    };

    res.status(200).json({
      status: 'success',
      message: 'Event request rejected',
      data: { rejection }
    });
  } catch (error) {
    next(error);
  }
};

// Request changes to event proposal
const requestEventChanges = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { feedback, requiredChanges } = req.body;
    const coordinatorId = req.user.id;

    const changeRequest = {
      requestId,
      status: 'changes_requested',
      requestedBy: coordinatorId,
      requestedAt: new Date().toISOString(),
      feedback,
      requiredChanges,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    res.status(200).json({
      status: 'success',
      message: 'Change request sent to club',
      data: { changeRequest }
    });
  } catch (error) {
    next(error);
  }
};

// ===== CLUB MANAGEMENT APIS =====

// Get all clubs
const getAllClubs = async (req, res, next) => {
  try {
    const { category, status } = req.query;

    const clubs = [
      {
        id: 1,
        name: 'Tech Club',
        category: 'Technical',
        members: 120,
        coordinator: 'John Doe',
        email: 'techclub@university.edu',
        status: 'active',
        eventsThisYear: 24,
        rating: 4.8,
        budget: '₹2,50,000',
        lastActivity: '2024-12-01'
      },
      {
        id: 2,
        name: 'Cultural Society',
        category: 'Cultural',
        members: 95,
        coordinator: 'Jane Smith',
        email: 'cultural@university.edu',
        status: 'active',
        eventsThisYear: 18,
        rating: 4.7,
        budget: '₹1,80,000',
        lastActivity: '2024-11-28'
      },
      {
        id: 3,
        name: 'Sports Club',
        category: 'Sports',
        members: 85,
        coordinator: 'Mike Johnson',
        email: 'sports@university.edu',
        status: 'active',
        eventsThisYear: 15,
        rating: 4.6,
        budget: '₹1,20,000',
        lastActivity: '2024-11-25'
      }
    ];

    let filteredClubs = clubs;
    if (category) filteredClubs = filteredClubs.filter(c => c.category.toLowerCase() === category.toLowerCase());
    if (status) filteredClubs = filteredClubs.filter(c => c.status === status);

    res.status(200).json({
      status: 'success',
      results: filteredClubs.length,
      data: { clubs: filteredClubs }
    });
  } catch (error) {
    next(error);
  }
};

// Get club details
const getClubDetails = async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const clubDetails = {
      id: clubId,
      name: 'Tech Club',
      category: 'Technical',
      description: 'A club focused on technology, programming, and innovation',
      members: 120,
      coordinator: {
        name: 'John Doe',
        email: 'john.doe@university.edu',
        phone: '+91 9876543210'
      },
      status: 'active',
      establishedDate: '2020-08-15',
      eventsThisYear: 24,
      rating: 4.8,
      budget: {
        allocated: '₹2,50,000',
        spent: '₹1,80,000',
        remaining: '₹70,000'
      },
      recentEvents: [
        { name: 'Hackathon 2024', date: '2024-03-15', status: 'completed', rating: 4.9 },
        { name: 'Tech Talk Series', date: '2024-02-20', status: 'completed', rating: 4.7 }
      ],
      upcomingEvents: [
        { name: 'AI Workshop', date: '2024-04-10', status: 'approved' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: { club: clubDetails }
    });
  } catch (error) {
    next(error);
  }
};

// ===== BUDGET MANAGEMENT APIS =====

// Get budget overview
const getBudgetOverview = async (req, res, next) => {
  try {
    const budgetOverview = {
      totalAllocated: '₹12,50,000',
      totalSpent: '₹8,75,000',
      totalRemaining: '₹3,75,000',
      utilizationRate: 70,
      clubBudgets: [
        { club: 'Tech Club', allocated: '₹2,50,000', spent: '₹1,80,000', utilization: 72 },
        { club: 'Cultural Society', allocated: '₹1,80,000', spent: '₹1,20,000', utilization: 67 },
        { club: 'Sports Club', allocated: '₹1,20,000', spent: '₹90,000', utilization: 75 },
        { club: 'Music Society', allocated: '₹1,50,000', spent: '₹1,10,000', utilization: 73 }
      ],
      monthlySpending: [
        { month: 'Jan', amount: 85000 },
        { month: 'Feb', amount: 120000 },
        { month: 'Mar', amount: 95000 },
        { month: 'Apr', amount: 110000 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: budgetOverview
    });
  } catch (error) {
    next(error);
  }
};

// Allocate budget to club
const allocateBudget = async (req, res, next) => {
  try {
    const { clubId, amount, purpose, validUntil } = req.body;
    const coordinatorId = req.user.id;

    const budgetAllocation = {
      id: Date.now(),
      clubId,
      amount,
      purpose,
      allocatedBy: coordinatorId,
      allocatedAt: new Date().toISOString(),
      validUntil,
      status: 'active'
    };

    res.status(201).json({
      status: 'success',
      message: `Budget of ${amount} allocated to club`,
      data: { budgetAllocation }
    });
  } catch (error) {
    next(error);
  }
};

// ===== FEEDBACK SYSTEM APIS =====

// Get event feedback
const getEventFeedback = async (req, res, next) => {
  try {
    const { eventId, club } = req.query;

    const feedback = [
      {
        id: 1,
        eventId: 1,
        eventName: 'Tech Hackathon',
        club: 'Tech Club',
        rating: 4.8,
        totalResponses: 85,
        feedback: {
          positive: 72,
          neutral: 10,
          negative: 3
        },
        comments: [
          { rating: 5, comment: 'Excellent organization and great prizes!', date: '2024-03-16' },
          { rating: 4, comment: 'Good event but could use better food arrangements', date: '2024-03-16' },
          { rating: 5, comment: 'Amazing learning experience', date: '2024-03-17' }
        ],
        averageRatings: {
          organization: 4.7,
          content: 4.8,
          venue: 4.5,
          overall: 4.8
        }
      }
    ];

    let filteredFeedback = feedback;
    if (eventId) filteredFeedback = filteredFeedback.filter(f => f.eventId == eventId);
    if (club) filteredFeedback = filteredFeedback.filter(f => f.club.toLowerCase().includes(club.toLowerCase()));

    res.status(200).json({
      status: 'success',
      results: filteredFeedback.length,
      data: { feedback: filteredFeedback }
    });
  } catch (error) {
    next(error);
  }
};

// Get feedback analytics
const getFeedbackAnalytics = async (req, res, next) => {
  try {
    const analytics = {
      overallSatisfaction: 85,
      totalFeedbackReceived: 1250,
      responseRate: 78,
      trendAnalysis: {
        improving: ['organization', 'content_quality'],
        declining: ['food_quality'],
        stable: ['venue', 'timing']
      },
      clubPerformance: [
        { club: 'Tech Club', avgRating: 4.8, events: 24 },
        { club: 'Cultural Society', avgRating: 4.7, events: 18 },
        { club: 'Sports Club', avgRating: 4.6, events: 15 },
        { club: 'Music Society', avgRating: 4.5, events: 12 }
      ],
      commonIssues: [
        { issue: 'Food quality', frequency: 23, severity: 'medium' },
        { issue: 'Venue acoustics', frequency: 18, severity: 'low' },
        { issue: 'Registration process', frequency: 15, severity: 'high' }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// ===== ANALYTICS & REPORTING APIS =====

// Get event statistics
const getEventStatistics = async (req, res, next) => {
  try {
    const { timeRange = '1y' } = req.query;

    const statistics = {
      totalEvents: 156,
      approvalRate: 87,
      avgProcessingTime: 2.5, // days
      eventsByCategory: [
        { category: 'Technical', count: 45, percentage: 29 },
        { category: 'Cultural', count: 38, percentage: 24 },
        { category: 'Sports', count: 32, percentage: 21 },
        { category: 'Academic', count: 25, percentage: 16 },
        { category: 'Social', count: 16, percentage: 10 }
      ],
      monthlyTrend: [
        { month: 'Jan', events: 12, approved: 10 },
        { month: 'Feb', events: 15, approved: 13 },
        { month: 'Mar', events: 18, approved: 16 },
        { month: 'Apr', events: 14, approved: 12 }
      ],
      topPerformingClubs: [
        { club: 'Tech Club', events: 24, rating: 4.8 },
        { club: 'Cultural Society', events: 18, rating: 4.7 },
        { club: 'Sports Club', events: 15, rating: 4.6 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

// Generate comprehensive report
const generateComprehensiveReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate, format = 'pdf' } = req.query;

    const report = {
      id: `report_${Date.now()}`,
      type,
      period: { startDate, endDate },
      format,
      generatedAt: new Date().toISOString(),
      sections: [
        'Event Statistics',
        'Club Performance',
        'Budget Analysis',
        'Feedback Summary',
        'Recommendations'
      ],
      downloadUrl: `/api/reports/club_coordinator_${Date.now()}.${format}`,
      size: '3.2 MB'
    };

    res.status(200).json({
      status: 'success',
      message: 'Report generated successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClubCoordinatorDashboard,
  getPendingEventRequests,
  getApprovedEvents,
  approveEventRequest,
  rejectEventRequest,
  requestEventChanges,
  getAllClubs,
  getClubDetails,
  getBudgetOverview,
  allocateBudget,
  getEventFeedback,
  getFeedbackAnalytics,
  getEventStatistics,
  generateComprehensiveReport
};