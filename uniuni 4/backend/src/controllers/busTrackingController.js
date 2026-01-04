const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/error');

const prisma = new PrismaClient();

// ===== BUS TRACKING SYSTEM APIS =====

// Get all bus routes
const getBusRoutes = async (req, res, next) => {
  try {
    const routes = [
      {
        id: 1,
        routeNumber: 'R001',
        routeName: 'Main Campus - City Center',
        totalStops: 12,
        estimatedDuration: '45 minutes',
        operatingHours: '6:00 AM - 10:00 PM',
        frequency: '15 minutes',
        stops: [
          { id: 1, name: 'Main Campus Gate', time: '07:00', coordinates: { lat: 12.9716, lng: 77.5946 } },
          { id: 2, name: 'Engineering Block', time: '07:03', coordinates: { lat: 12.9720, lng: 77.5950 } },
          { id: 3, name: 'Library Junction', time: '07:06', coordinates: { lat: 12.9725, lng: 77.5955 } },
          { id: 4, name: 'Hostel Complex', time: '07:10', coordinates: { lat: 12.9730, lng: 77.5960 } },
          { id: 5, name: 'Metro Station', time: '07:25', coordinates: { lat: 12.9750, lng: 77.6000 } },
          { id: 6, name: 'City Center Mall', time: '07:45', coordinates: { lat: 12.9800, lng: 77.6100 } }
        ],
        activeBuses: 3
      },
      {
        id: 2,
        routeNumber: 'R002',
        routeName: 'Campus - Railway Station',
        totalStops: 8,
        estimatedDuration: '30 minutes',
        operatingHours: '6:30 AM - 9:30 PM',
        frequency: '20 minutes',
        stops: [
          { id: 1, name: 'Main Campus Gate', time: '07:00', coordinates: { lat: 12.9716, lng: 77.5946 } },
          { id: 2, name: 'Sports Complex', time: '07:05', coordinates: { lat: 12.9710, lng: 77.5940 } },
          { id: 3, name: 'Medical Center', time: '07:08', coordinates: { lat: 12.9705, lng: 77.5935 } },
          { id: 4, name: 'Railway Station', time: '07:30', coordinates: { lat: 12.9650, lng: 77.5800 } }
        ],
        activeBuses: 2
      }
    ];

    res.status(200).json({
      status: 'success',
      results: routes.length,
      data: { routes }
    });
  } catch (error) {
    next(error);
  }
};

// Get live bus locations
const getLiveBusLocations = async (req, res, next) => {
  try {
    const { routeId } = req.query;

    const buses = [
      {
        id: 'BUS001',
        routeId: 1,
        routeNumber: 'R001',
        driverName: 'Rajesh Kumar',
        driverPhone: '+91-9876543210',
        currentLocation: {
          lat: 12.9735,
          lng: 77.5965,
          address: 'Near Hostel Complex'
        },
        nextStop: {
          id: 5,
          name: 'Metro Station',
          eta: '12 minutes',
          distance: '2.3 km'
        },
        status: 'on_route', // 'on_route', 'at_stop', 'delayed', 'breakdown', 'off_duty'
        occupancy: {
          current: 28,
          capacity: 45,
          percentage: 62
        },
        speed: 35, // km/h
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'BUS002',
        routeId: 1,
        routeNumber: 'R001',
        driverName: 'Suresh Patel',
        driverPhone: '+91-9876543211',
        currentLocation: {
          lat: 12.9780,
          lng: 77.6050,
          address: 'Near City Center'
        },
        nextStop: {
          id: 6,
          name: 'City Center Mall',
          eta: '3 minutes',
          distance: '0.8 km'
        },
        status: 'on_route',
        occupancy: {
          current: 42,
          capacity: 45,
          percentage: 93
        },
        speed: 25,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'BUS003',
        routeId: 2,
        routeNumber: 'R002',
        driverName: 'Amit Singh',
        driverPhone: '+91-9876543212',
        currentLocation: {
          lat: 12.9700,
          lng: 77.5930,
          address: 'Near Medical Center'
        },
        nextStop: {
          id: 4,
          name: 'Railway Station',
          eta: '18 minutes',
          distance: '3.5 km'
        },
        status: 'delayed',
        occupancy: {
          current: 35,
          capacity: 45,
          percentage: 78
        },
        speed: 20,
        lastUpdated: new Date().toISOString()
      }
    ];

    const filteredBuses = routeId ? buses.filter(b => b.routeId == routeId) : buses;

    res.status(200).json({
      status: 'success',
      results: filteredBuses.length,
      data: { buses: filteredBuses }
    });
  } catch (error) {
    next(error);
  }
};

// Get bus schedule
const getBusSchedule = async (req, res, next) => {
  try {
    const { routeId, stopId } = req.query;

    const schedule = {
      routeId: routeId || 1,
      routeName: 'Main Campus - City Center',
      date: new Date().toISOString().split('T')[0],
      schedule: [
        {
          busId: 'BUS001',
          trips: [
            { departureTime: '07:00', arrivalTime: '07:45', status: 'completed' },
            { departureTime: '08:00', arrivalTime: '08:45', status: 'completed' },
            { departureTime: '09:00', arrivalTime: '09:45', status: 'in_progress' },
            { departureTime: '10:00', arrivalTime: '10:45', status: 'scheduled' },
            { departureTime: '11:00', arrivalTime: '11:45', status: 'scheduled' }
          ]
        },
        {
          busId: 'BUS002',
          trips: [
            { departureTime: '07:15', arrivalTime: '08:00', status: 'completed' },
            { departureTime: '08:15', arrivalTime: '09:00', status: 'completed' },
            { departureTime: '09:15', arrivalTime: '10:00', status: 'scheduled' },
            { departureTime: '10:15', arrivalTime: '11:00', status: 'scheduled' }
          ]
        }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: { schedule }
    });
  } catch (error) {
    next(error);
  }
};

// Get ETA for specific stop
const getETAForStop = async (req, res, next) => {
  try {
    const { stopId, routeId } = req.query;

    const eta = {
      stopId: parseInt(stopId),
      stopName: 'Metro Station',
      routeId: parseInt(routeId),
      upcomingBuses: [
        {
          busId: 'BUS001',
          eta: '12 minutes',
          distance: '2.3 km',
          occupancy: 62,
          status: 'on_time'
        },
        {
          busId: 'BUS002',
          eta: '27 minutes',
          distance: '5.8 km',
          occupancy: 45,
          status: 'on_time'
        },
        {
          busId: 'BUS003',
          eta: '42 minutes',
          distance: '8.2 km',
          occupancy: 30,
          status: 'delayed'
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: { eta }
    });
  } catch (error) {
    next(error);
  }
};

// Book bus seat (if applicable)
const bookBusSeat = async (req, res, next) => {
  try {
    const { busId, fromStopId, toStopId, tripTime } = req.body;
    const userId = req.user.id;

    const booking = {
      id: `BOOK_${Date.now()}`,
      userId,
      busId,
      fromStop: { id: fromStopId, name: 'Main Campus Gate' },
      toStop: { id: toStopId, name: 'City Center Mall' },
      tripTime,
      bookingTime: new Date().toISOString(),
      status: 'confirmed',
      seatNumber: Math.floor(Math.random() * 45) + 1,
      fare: 25,
      qrCode: `QR_${Date.now()}`
    };

    res.status(201).json({
      status: 'success',
      message: 'Bus seat booked successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const bookings = [
      {
        id: 'BOOK_1701234567890',
        busId: 'BUS001',
        routeName: 'Main Campus - City Center',
        fromStop: { name: 'Main Campus Gate', time: '09:00' },
        toStop: { name: 'Metro Station', time: '09:25' },
        bookingTime: '2024-12-03T08:30:00Z',
        status: 'upcoming',
        seatNumber: 15,
        fare: 20,
        qrCode: 'QR_1701234567890'
      },
      {
        id: 'BOOK_1701234567891',
        busId: 'BUS002',
        routeName: 'Campus - Railway Station',
        fromStop: { name: 'Main Campus Gate', time: '07:00' },
        toStop: { name: 'Railway Station', time: '07:30' },
        bookingTime: '2024-12-02T18:45:00Z',
        status: 'completed',
        seatNumber: 22,
        fare: 25,
        qrCode: 'QR_1701234567891'
      }
    ];

    const filteredBookings = status ? bookings.filter(b => b.status === status) : bookings;

    res.status(200).json({
      status: 'success',
      results: filteredBookings.length,
      data: { bookings: filteredBookings }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const cancellation = {
      bookingId,
      cancelledAt: new Date().toISOString(),
      refundAmount: 20,
      refundStatus: 'processed',
      reason: 'User cancellation'
    };

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: { cancellation }
    });
  } catch (error) {
    next(error);
  }
};

// Get bus notifications
const getBusNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = [
      {
        id: 1,
        type: 'delay',
        title: 'Bus Delayed',
        message: 'Bus R001 is running 10 minutes late due to traffic',
        busId: 'BUS001',
        routeName: 'Main Campus - City Center',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 2,
        type: 'arrival',
        title: 'Bus Arriving Soon',
        message: 'Your bus will arrive at Metro Station in 5 minutes',
        busId: 'BUS002',
        routeName: 'Main Campus - City Center',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 3,
        type: 'route_change',
        title: 'Route Modification',
        message: 'Route R002 will have a temporary diversion today',
        routeName: 'Campus - Railway Station',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markNotificationRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Get bus analytics (for admin)
const getBusAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '7d' } = req.query;

    const analytics = {
      overview: {
        totalRoutes: 8,
        activeBuses: 15,
        totalRides: 2450,
        averageOccupancy: 68,
        onTimePerformance: 87
      },
      routePerformance: [
        { routeId: 1, routeName: 'Main Campus - City Center', rides: 850, occupancy: 72, onTime: 89 },
        { routeId: 2, routeName: 'Campus - Railway Station', rides: 650, occupancy: 65, onTime: 85 },
        { routeId: 3, routeName: 'Hostel - Academic Block', rides: 450, occupancy: 58, onTime: 92 }
      ],
      peakHours: [
        { hour: '08:00', rides: 180 },
        { hour: '09:00', rides: 220 },
        { hour: '17:00', rides: 200 },
        { hour: '18:00', rides: 190 }
      ],
      delays: {
        total: 45,
        reasons: [
          { reason: 'Traffic', count: 20 },
          { reason: 'Weather', count: 12 },
          { reason: 'Mechanical', count: 8 },
          { reason: 'Other', count: 5 }
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
  getBusRoutes,
  getLiveBusLocations,
  getBusSchedule,
  getETAForStop,
  bookBusSeat,
  getUserBookings,
  cancelBooking,
  getBusNotifications,
  markNotificationRead,
  getBusAnalytics
};