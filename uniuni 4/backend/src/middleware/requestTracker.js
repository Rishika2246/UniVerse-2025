const systemStatus = require('../services/systemStatus');

const requestTracker = (req, res, next) => {
  systemStatus.incrementRequest();
  
  // Log intelligent operations based on routes
  const path = req.path;
  const method = req.method;
  
  // Seating allocation intelligence
  if (path.includes('/seating/generate') && method === 'POST') {
    systemStatus.logIntelligentOperation('Seating Engine', 'Seating allocation generation started');
  }
  
  // Hall ticket generation
  if (path.includes('/hall-tickets/generate') && method === 'POST') {
    systemStatus.logIntelligentOperation('Hall Ticket Engine', 'Hall ticket generation initiated');
  }
  
  // Mind map generation
  if (path.includes('/mindmaps/generate') && method === 'POST') {
    systemStatus.logIntelligentOperation('Mind Map Engine', 'AI-powered mind map generation started');
  }
  
  // Authentication events
  if (path.includes('/auth/login') && method === 'POST') {
    systemStatus.logIntelligentOperation('Auth Service', 'User authentication attempt');
  }
  
  // Exam operations
  if (path.includes('/exams') && method === 'POST') {
    systemStatus.logIntelligentOperation('Academic Engine', 'New exam creation initiated');
  }
  
  // Event registrations
  if (path.includes('/events') && path.includes('/register') && method === 'POST') {
    systemStatus.logIntelligentOperation('Event Management', 'Event registration processing');
  }
  
  // SOS alerts
  if (path.includes('/sos/alert') && method === 'POST') {
    systemStatus.logIntelligentOperation('Emergency System', '🚨 SOS alert received - immediate response triggered');
  }
  
  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    // Log successful operations
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (path.includes('/seating/generate')) {
        systemStatus.logSuccess('Seating Engine', 'Seating allocation completed successfully');
      } else if (path.includes('/hall-tickets/generate')) {
        systemStatus.logSuccess('Hall Ticket Engine', 'Hall ticket generated with QR code');
      } else if (path.includes('/mindmaps/generate')) {
        systemStatus.logSuccess('Mind Map Engine', 'Mind map generated from syllabus content');
      } else if (path.includes('/auth/login')) {
        systemStatus.logSuccess('Auth Service', 'User authenticated successfully');
      }
    } else if (res.statusCode >= 400) {
      // Log errors
      if (path.includes('/seating/generate')) {
        systemStatus.logError('Seating Engine', 'Seating allocation failed - checking constraints');
      } else if (path.includes('/hall-tickets/generate')) {
        systemStatus.logError('Hall Ticket Engine', 'Hall ticket generation blocked - eligibility check failed');
      } else if (path.includes('/auth/login')) {
        systemStatus.logError('Auth Service', 'Authentication failed - invalid credentials');
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = requestTracker;