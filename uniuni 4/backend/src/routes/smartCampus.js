const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simulated IoT data - In production, this would come from actual sensors
let iotData = {
  parkingAreas: [
    { 
      id: 'p1', 
      name: 'Block A Parking', 
      type: 'two-wheeler', 
      total: 150, 
      available: 45, 
      reserved: 10, 
      location: 'Academic Block A', 
      distance: 0.2, 
      status: 'medium',
      building: 'Block A, Ground Floor',
      contact: '+91 98765 43210',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      amenities: ['Covered', 'CCTV', 'Security'],
      peakHours: '9 AM - 11 AM',
      averageStayTime: '4-6 hours'
    },
    { 
      id: 'p2', 
      name: 'Block B Parking', 
      type: 'two-wheeler', 
      total: 100, 
      available: 12, 
      reserved: 5, 
      location: 'Academic Block B', 
      distance: 0.4, 
      status: 'high',
      building: 'Block B, Basement',
      contact: '+91 98765 43211',
      coordinates: { lat: 12.9717, lng: 77.5947 },
      amenities: ['Covered', 'CCTV', 'Security', 'Lighting'],
      peakHours: '8 AM - 10 AM',
      averageStayTime: '3-5 hours'
    },
    { 
      id: 'p3', 
      name: 'Main Gate Parking', 
      type: 'four-wheeler', 
      total: 80, 
      available: 25, 
      reserved: 8, 
      location: 'Main Entrance', 
      distance: 0.6, 
      status: 'medium',
      building: 'Main Gate Area',
      contact: '+91 98765 43212',
      coordinates: { lat: 12.9718, lng: 77.5948 },
      amenities: ['Open', 'CCTV', 'Security', 'EV Charging'],
      peakHours: '8 AM - 12 PM',
      averageStayTime: '5-8 hours'
    },
    { 
      id: 'p4', 
      name: 'Sports Complex', 
      type: 'four-wheeler', 
      total: 60, 
      available: 48, 
      reserved: 2, 
      location: 'Sports Area', 
      distance: 0.8, 
      status: 'low',
      building: 'Sports Complex',
      contact: '+91 98765 43213',
      coordinates: { lat: 12.9719, lng: 77.5949 },
      amenities: ['Open', 'CCTV'],
      peakHours: '4 PM - 7 PM',
      averageStayTime: '2-3 hours'
    },
    { 
      id: 'p5', 
      name: 'Library Parking', 
      type: 'two-wheeler', 
      total: 120, 
      available: 5, 
      reserved: 15, 
      location: 'Central Library', 
      distance: 0.3, 
      status: 'high',
      building: 'Library Building',
      contact: '+91 98765 43214',
      coordinates: { lat: 12.9720, lng: 77.5950 },
      amenities: ['Covered', 'CCTV', 'Security', 'Lighting'],
      peakHours: '10 AM - 4 PM',
      averageStayTime: '3-4 hours'
    }
  ],
  
  libraryZones: [
    { 
      id: 'l1', 
      name: 'Silent Study Zone', 
      type: 'silent', 
      total: 80, 
      available: 12, 
      crowdLevel: 'high',
      floor: 1,
      facilities: ['AC', 'Power Outlets', 'WiFi', 'Individual Desks'],
      openingTime: '7:00 AM',
      closingTime: '10:00 PM',
      temperature: 22,
      noise: 20
    },
    { 
      id: 'l2', 
      name: 'Reading Zone', 
      type: 'reading', 
      total: 120, 
      available: 45, 
      crowdLevel: 'medium',
      floor: 2,
      facilities: ['AC', 'Power Outlets', 'WiFi', 'Comfortable Seating', 'Natural Light'],
      openingTime: '7:00 AM',
      closingTime: '10:00 PM',
      temperature: 23,
      noise: 35
    },
    { 
      id: 'l3', 
      name: 'Group Study Area', 
      type: 'group', 
      total: 60, 
      available: 35, 
      crowdLevel: 'low',
      floor: 3,
      facilities: ['AC', 'Power Outlets', 'WiFi', 'Whiteboards', 'Discussion Rooms'],
      openingTime: '8:00 AM',
      closingTime: '9:00 PM',
      temperature: 24,
      noise: 45
    },
    { 
      id: 'l4', 
      name: 'Reference Section', 
      type: 'reading', 
      total: 40, 
      available: 8, 
      crowdLevel: 'high',
      floor: 1,
      facilities: ['AC', 'Power Outlets', 'WiFi', 'Reference Books'],
      openingTime: '7:00 AM',
      closingTime: '8:00 PM',
      temperature: 22,
      noise: 25
    }
  ],
  
  labs: [
    { 
      id: 'lab1', 
      name: 'Computer Lab 1', 
      building: 'Block A', 
      status: 'in-use', 
      capacity: 60, 
      currentOccupancy: 58, 
      equipment: ['60 Computers', 'Projector', 'Smart Board'],
      nextFreeSlot: '14:00',
      supervisor: 'Dr. Rajesh Kumar',
      contact: 'rajesh.kumar@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Monday', slots: ['9:00-11:00', '14:00-16:00'] },
        { day: 'Tuesday', slots: ['10:00-12:00', '15:00-17:00'] }
      ]
    },
    { 
      id: 'lab2', 
      name: 'Computer Lab 2', 
      building: 'Block A', 
      status: 'free', 
      capacity: 60, 
      currentOccupancy: 0, 
      equipment: ['60 Computers', 'Whiteboard', 'Projector'],
      supervisor: 'Prof. Anita Sharma',
      contact: 'anita.sharma@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Monday', slots: ['11:00-13:00'] },
        { day: 'Wednesday', slots: ['14:00-16:00'] }
      ]
    },
    { 
      id: 'lab3', 
      name: 'Physics Lab', 
      building: 'Block B', 
      status: 'in-use', 
      capacity: 40, 
      currentOccupancy: 35, 
      equipment: ['Lab Equipment', 'Safety Gear', 'Measuring Instruments'],
      nextFreeSlot: '15:30',
      supervisor: 'Dr. Vikram Singh',
      contact: 'vikram.singh@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Tuesday', slots: ['9:00-12:00'] },
        { day: 'Thursday', slots: ['14:00-17:00'] }
      ]
    },
    { 
      id: 'lab4', 
      name: 'Chemistry Lab', 
      building: 'Block B', 
      status: 'free', 
      capacity: 40, 
      currentOccupancy: 0, 
      equipment: ['Chemicals', 'Safety Gear', 'Fume Hoods', 'Lab Benches'],
      supervisor: 'Dr. Priya Desai',
      contact: 'priya.desai@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Monday', slots: ['14:00-17:00'] },
        { day: 'Friday', slots: ['9:00-12:00'] }
      ]
    },
    { 
      id: 'lab5', 
      name: 'Electronics Lab', 
      building: 'Block C', 
      status: 'in-use', 
      capacity: 50, 
      currentOccupancy: 22, 
      equipment: ['Oscilloscopes', 'Multimeters', 'Breadboards', 'Power Supplies'],
      nextFreeSlot: '13:00',
      supervisor: 'Prof. Amit Patel',
      contact: 'amit.patel@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Wednesday', slots: ['10:00-13:00', '14:00-17:00'] },
        { day: 'Friday', slots: ['14:00-17:00'] }
      ]
    },
    { 
      id: 'lab6', 
      name: 'AI/ML Lab', 
      building: 'Block C', 
      status: 'free', 
      capacity: 45, 
      currentOccupancy: 0, 
      equipment: ['High-end Computers', 'GPUs', 'Smart Board', 'VR Headsets'],
      supervisor: 'Dr. Neha Gupta',
      contact: 'neha.gupta@uni.edu',
      bookable: true,
      schedule: [
        { day: 'Tuesday', slots: ['15:00-18:00'] },
        { day: 'Thursday', slots: ['10:00-13:00'] }
      ]
    }
  ],
  
  commonAreas: [
    { 
      id: 'ca1', 
      name: 'Main Cafeteria', 
      type: 'cafeteria', 
      crowdLevel: 'high', 
      status: 'busy',
      capacity: 200,
      currentCount: 175,
      openTime: '7:00 AM',
      closeTime: '9:00 PM',
      specialties: ['Indian', 'Continental', 'Chinese', 'Snacks']
    },
    { 
      id: 'ca2', 
      name: 'Food Court', 
      type: 'cafeteria', 
      crowdLevel: 'medium', 
      status: 'available',
      capacity: 150,
      currentCount: 80,
      openTime: '8:00 AM',
      closeTime: '8:00 PM',
      specialties: ['Fast Food', 'Beverages', 'Ice Cream']
    },
    { 
      id: 'ca3', 
      name: 'Block A Washroom', 
      type: 'washroom', 
      crowdLevel: 'low', 
      status: 'available',
      capacity: 20,
      currentCount: 3,
      openTime: '24/7',
      closeTime: '24/7'
    },
    { 
      id: 'ca4', 
      name: 'Study Hall 1', 
      type: 'study-hall', 
      crowdLevel: 'medium', 
      status: 'available',
      capacity: 80,
      currentCount: 45,
      openTime: '6:00 AM',
      closeTime: '11:00 PM',
      specialties: ['AC', 'WiFi', 'Power Outlets']
    },
    { 
      id: 'ca5', 
      name: 'Common Room', 
      type: 'common-room', 
      crowdLevel: 'low', 
      status: 'available',
      capacity: 50,
      currentCount: 12,
      openTime: '7:00 AM',
      closeTime: '10:00 PM',
      specialties: ['Games', 'TV', 'Comfortable Seating']
    },
    { 
      id: 'ca6', 
      name: 'Juice Bar', 
      type: 'cafeteria', 
      crowdLevel: 'low', 
      status: 'available',
      capacity: 30,
      currentCount: 8,
      openTime: '8:00 AM',
      closeTime: '6:00 PM',
      specialties: ['Fresh Juice', 'Smoothies', 'Healthy Snacks']
    }
  ],
  
  weather: {
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    airQuality: 'Good'
  },
  
  alerts: [
    { id: 'a1', type: 'library', priority: 'high', message: 'Silent Study Zone is almost full (85% occupied)', timestamp: new Date(Date.now() - 300000), read: false, action: 'View Zones' },
    { id: 'a2', type: 'parking', priority: 'medium', message: 'New parking slot opened at Block A', timestamp: new Date(Date.now() - 600000), read: false, action: 'Navigate' },
    { id: 'a3', type: 'lab', priority: 'low', message: 'Computer Lab 2 is now available', timestamp: new Date(Date.now() - 900000), read: true, action: 'Book Now' },
    { id: 'a4', type: 'weather', priority: 'medium', message: 'Light rain expected in 30 minutes', timestamp: new Date(Date.now() - 1200000), read: false, action: 'View Weather' }
  ]
};

// Simulate IoT data updates
function simulateIoTUpdate() {
  // Update parking areas
  iotData.parkingAreas = iotData.parkingAreas.map(area => {
    const change = Math.floor(Math.random() * 6) - 3; // -3 to +3 change
    const newAvailable = Math.max(0, Math.min(area.total - area.reserved, area.available + change));
    const occupancyRate = (area.total - newAvailable - area.reserved) / area.total;
    
    return {
      ...area,
      available: newAvailable,
      status: occupancyRate > 0.8 ? 'high' : occupancyRate > 0.5 ? 'medium' : 'low'
    };
  });

  // Update library zones
  iotData.libraryZones = iotData.libraryZones.map(zone => {
    const change = Math.floor(Math.random() * 5) - 2;
    const newAvailable = Math.max(0, Math.min(zone.total, zone.available + change));
    const occupancyRate = (zone.total - newAvailable) / zone.total;
    const tempChange = (Math.random() - 0.5);
    
    return {
      ...zone,
      available: newAvailable,
      crowdLevel: occupancyRate > 0.7 ? 'high' : occupancyRate > 0.4 ? 'medium' : 'low',
      temperature: Math.round((zone.temperature + tempChange) * 10) / 10,
      noise: Math.max(15, Math.min(50, zone.noise + Math.floor(Math.random() * 10) - 5))
    };
  });

  // Update labs
  iotData.labs = iotData.labs.map(lab => {
    if (Math.random() > 0.85) {
      const newStatus = lab.status === 'free' ? 'in-use' : lab.status === 'in-use' ? 'free' : lab.status;
      return {
        ...lab,
        status: newStatus,
        currentOccupancy: newStatus === 'free' ? 0 : Math.floor(Math.random() * lab.capacity * 0.9)
      };
    }
    return lab;
  });

  // Update common areas
  iotData.commonAreas = iotData.commonAreas.map(area => {
    const change = Math.floor(Math.random() * 10) - 5;
    const newCount = Math.max(0, Math.min(area.capacity, area.currentCount + change));
    const crowdRate = newCount / area.capacity;
    
    return {
      ...area,
      currentCount: newCount,
      crowdLevel: crowdRate > 0.7 ? 'high' : crowdRate > 0.4 ? 'medium' : 'low',
      status: crowdRate > 0.8 ? 'busy' : 'available'
    };
  });

  // Update weather
  iotData.weather = {
    ...iotData.weather,
    temperature: Math.round((iotData.weather.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
    humidity: Math.max(40, Math.min(90, iotData.weather.humidity + Math.floor(Math.random() * 6) - 3))
  };
}

// Auto-update IoT data every 8 seconds
setInterval(simulateIoTUpdate, 8000);

// Routes

// Get all Smart Campus data
router.get('/data', async (req, res) => {
  try {
    res.json({
      success: true,
      data: iotData,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching Smart Campus data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching Smart Campus data: ' + error.message 
    });
  }
});

// Get parking data
router.get('/parking', async (req, res) => {
  try {
    const { type } = req.query;
    let parkingAreas = iotData.parkingAreas;
    
    if (type && type !== 'all') {
      parkingAreas = parkingAreas.filter(area => area.type === type);
    }
    
    res.json({
      success: true,
      data: { parkingAreas },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching parking data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching parking data: ' + error.message 
    });
  }
});

// Get library data
router.get('/library', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { libraryZones: iotData.libraryZones },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching library data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching library data: ' + error.message 
    });
  }
});

// Get labs data
router.get('/labs', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { labs: iotData.labs },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching labs data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching labs data: ' + error.message 
    });
  }
});

// Get common areas data
router.get('/common-areas', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { commonAreas: iotData.commonAreas },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching common areas data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching common areas data: ' + error.message 
    });
  }
});

// Get weather data
router.get('/weather', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { weather: iotData.weather },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching weather data: ' + error.message 
    });
  }
});

// Get alerts
router.get('/alerts', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { alerts: iotData.alerts },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching alerts: ' + error.message 
    });
  }
});

// Book a lab
router.post('/labs/:labId/book', async (req, res) => {
  try {
    const { labId } = req.params;
    const { date, timeSlot, purpose, participants, notes } = req.body;
    const studentId = req.body.studentId || 'demo-student-id';
    
    const lab = iotData.labs.find(l => l.id === labId);
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }
    
    if (lab.status !== 'free') {
      return res.status(400).json({
        success: false,
        message: 'Lab is not available for booking'
      });
    }
    
    // In a real application, you would save this to the database
    const booking = {
      id: `booking-${Date.now()}`,
      labId,
      labName: lab.name,
      studentId,
      date,
      timeSlot,
      purpose,
      participants: parseInt(participants),
      notes,
      status: 'confirmed',
      createdAt: new Date()
    };
    
    // Simulate booking confirmation
    setTimeout(() => {
      // Update lab status (in real app, this would be based on actual schedule)
      const labIndex = iotData.labs.findIndex(l => l.id === labId);
      if (labIndex !== -1) {
        iotData.labs[labIndex].status = 'in-use';
        iotData.labs[labIndex].currentOccupancy = parseInt(participants);
      }
    }, 2000);
    
    res.json({
      success: true,
      data: { booking },
      message: 'Lab booked successfully! Confirmation email will be sent shortly.'
    });
    
  } catch (error) {
    console.error('Error booking lab:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error booking lab: ' + error.message 
    });
  }
});

// Mark alert as read
router.put('/alerts/:alertId/read', async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alertIndex = iotData.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    iotData.alerts[alertIndex].read = true;
    
    res.json({
      success: true,
      data: { alert: iotData.alerts[alertIndex] },
      message: 'Alert marked as read'
    });
    
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating alert: ' + error.message 
    });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const parkingTrendData = [
      { time: '6 AM', occupancy: 20 },
      { time: '8 AM', occupancy: 75 },
      { time: '10 AM', occupancy: 95 },
      { time: '12 PM', occupancy: 90 },
      { time: '2 PM', occupancy: 85 },
      { time: '4 PM', occupancy: 70 },
      { time: '6 PM', occupancy: 40 },
      { time: '8 PM', occupancy: 15 },
    ];

    const libraryTrendData = [
      { time: '7 AM', seats: 30 },
      { time: '9 AM', seats: 120 },
      { time: '11 AM', seats: 200 },
      { time: '1 PM', seats: 180 },
      { time: '3 PM', seats: 250 },
      { time: '5 PM', seats: 220 },
      { time: '7 PM', seats: 150 },
      { time: '9 PM', seats: 80 },
    ];

    const weeklyData = [
      { day: 'Mon', parking: 85, library: 220, labs: 45 },
      { day: 'Tue', parking: 90, library: 240, labs: 52 },
      { day: 'Wed', parking: 88, library: 235, labs: 48 },
      { day: 'Thu', parking: 92, library: 250, labs: 55 },
      { day: 'Fri', parking: 95, library: 210, labs: 42 },
      { day: 'Sat', parking: 40, library: 120, labs: 20 },
      { day: 'Sun', parking: 25, library: 80, labs: 10 },
    ];

    const resourceDistribution = [
      { name: 'Parking', value: iotData.parkingAreas.reduce((sum, p) => sum + (p.total - p.available - p.reserved), 0) },
      { name: 'Library', value: iotData.libraryZones.reduce((sum, l) => sum + (l.total - l.available), 0) },
      { name: 'Labs', value: iotData.labs.reduce((sum, l) => sum + l.currentOccupancy, 0) },
      { name: 'Common Areas', value: iotData.commonAreas.reduce((sum, c) => sum + c.currentCount, 0) },
    ];
    
    res.json({
      success: true,
      data: {
        parkingTrendData,
        libraryTrendData,
        weeklyData,
        resourceDistribution
      },
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics data: ' + error.message 
    });
  }
});

// Get navigation data
router.post('/navigation', async (req, res) => {
  try {
    const { destinationId, destinationType } = req.body;
    
    let destination = null;
    
    switch (destinationType) {
      case 'parking':
        destination = iotData.parkingAreas.find(p => p.id === destinationId);
        break;
      case 'library':
        destination = iotData.libraryZones.find(l => l.id === destinationId);
        break;
      case 'lab':
        destination = iotData.labs.find(l => l.id === destinationId);
        break;
      case 'common':
        destination = iotData.commonAreas.find(c => c.id === destinationId);
        break;
    }
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    
    // Generate navigation data
    const navigationData = {
      destination,
      distance: destination.distance || (Math.random() * 0.8 + 0.2).toFixed(1),
      estimatedTime: Math.ceil((destination.distance || 0.3) * 3),
      directions: [
        'Head south from your current location',
        'Turn right at the main pathway',
        'Continue straight for 200m',
        'Destination will be on your left'
      ],
      coordinates: destination.coordinates || { lat: 12.9716, lng: 77.5946 }
    };
    
    res.json({
      success: true,
      data: navigationData,
      message: 'Navigation data generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating navigation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating navigation: ' + error.message 
    });
  }
});

module.exports = router;