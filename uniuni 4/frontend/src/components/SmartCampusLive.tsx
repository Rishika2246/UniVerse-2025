import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Car, BookOpen, Microscope, Coffee, Users, Navigation,
  RefreshCw, TrendingUp, Clock, AlertCircle, Bell, BellOff,
  ChevronRight, Map, Calendar, Activity, Wifi, Battery,
  CheckCircle, XCircle, AlertTriangle, Info, Filter, Search,
  Zap, Eye, Settings, BarChart3, Timer, Target, Radio,
  Minus, DoorOpen, UtensilsCrossed, Armchair, Volume2, BookMarked,
  Star, Heart, Route, Bookmark, TrendingDown, PieChart, X,
  Phone, Mail, Building, Wind, Thermometer, Droplets, Sun,
  CloudRain, ArrowRight, ChevronDown, ChevronUp, Maximize2,
  Share2, Download, Camera, Video, Lock, Unlock, UserCheck,
  ClipboardList, MessageSquare, Send, MoreVertical, ExternalLink
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ParkingTab, LibraryTab, LabsTab, CommonAreasTab, MapTab, AlertsTab, AnalyticsTab } from './SmartCampusCompact';

interface ParkingArea {
  id: string;
  name: string;
  type: 'two-wheeler' | 'four-wheeler';
  total: number;
  available: number;
  reserved: number;
  location: string;
  distance: number;
  status: 'low' | 'medium' | 'high';
  building: string;
  contact: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  peakHours: string;
  averageStayTime: string;
}

interface LibraryZone {
  id: string;
  name: string;
  total: number;
  available: number;
  type: 'silent' | 'reading' | 'group';
  crowdLevel: 'low' | 'medium' | 'high';
  floor: number;
  facilities: string[];
  openingTime: string;
  closingTime: string;
  temperature: number;
  noise: number;
}

interface Lab {
  id: string;
  name: string;
  building: string;
  status: 'free' | 'in-use' | 'closed';
  capacity: number;
  currentOccupancy: number;
  nextFreeSlot?: string;
  equipment: string[];
  supervisor: string;
  contact: string;
  bookable: boolean;
  schedule: { day: string; slots: string[] }[];
}

interface CommonArea {
  id: string;
  name: string;
  type: 'cafeteria' | 'washroom' | 'study-hall' | 'common-room';
  crowdLevel: 'low' | 'medium' | 'high';
  status: 'available' | 'busy' | 'closed';
  capacity: number;
  currentCount: number;
  openTime: string;
  closeTime: string;
  specialties?: string[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  airQuality: 'Good' | 'Moderate' | 'Poor';
}

interface CampusMapArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'available' | 'moderate' | 'full';
  type: 'parking' | 'library' | 'lab' | 'cafeteria';
  details: string;
}

interface Alert {
  id: string;
  type: 'parking' | 'library' | 'lab' | 'general' | 'weather' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  read: boolean;
  action?: string;
}

interface Favorite {
  id: string;
  resourceType: 'parking' | 'library' | 'lab' | 'common';
  resourceId: string;
  resourceName: string;
}

export function SmartCampusLive({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'parking' | 'library' | 'labs' | 'common' | 'map' | 'alerts' | 'analytics'>('overview');
  const [parkingFilter, setParkingFilter] = useState<'all' | 'two-wheeler' | 'four-wheeler'>('all');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMapArea, setSelectedMapArea] = useState<CampusMapArea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingResource, setBookingResource] = useState<any>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    parking: true,
    library: true,
    labs: true,
    weather: true,
    emergency: true
  });

  // Weather Data
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    airQuality: 'Good'
  });

  const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // Simulated IoT Data - Updates in real-time
  const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
  const [libraryZones, setLibraryZones] = useState<LibraryZone[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);

  // Load initial data from API
  useEffect(() => {
    loadSmartCampusData();
  }, []);

  const loadSmartCampusData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/smart-campus/data`);
      const result = await response.json();
      
      if (result.success) {
        setParkingAreas(result.data.parkingAreas);
        setLibraryZones(result.data.libraryZones);
        setLabs(result.data.labs);
        setCommonAreas(result.data.commonAreas);
        setWeather(result.data.weather);
        setAlerts(result.data.alerts);
      } else {
        console.warn('Smart Campus API returned error:', result.message);
        loadFallbackData();
      }
    } catch (error) {
      console.error('Error loading Smart Campus data:', error);
      console.log('Loading fallback data...');
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    // Fallback data in case API is not available
    setParkingAreas([
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
    ]);

    setLibraryZones([
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
    ]);

    setLabs([
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
    ]);

    setCommonAreas([
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
    ]);

    setWeather({
      temperature: 28,
      humidity: 65,
      condition: 'Partly Cloudy',
      windSpeed: 12,
      airQuality: 'Good'
    });
  };

  const [campusMapAreas, setCampusMapAreas] = useState<CampusMapArea[]>([
    { id: 'm1', name: 'Block A Parking', x: 10, y: 20, width: 80, height: 60, status: 'moderate', type: 'parking', details: '45 slots available' },
    { id: 'm2', name: 'Central Library', x: 120, y: 20, width: 100, height: 80, status: 'full', type: 'library', details: '100 seats occupied' },
    { id: 'm3', name: 'Computer Labs', x: 250, y: 20, width: 90, height: 70, status: 'moderate', type: 'lab', details: '3 labs free' },
    { id: 'm4', name: 'Main Cafeteria', x: 10, y: 110, width: 80, height: 60, status: 'full', type: 'cafeteria', details: '175/200 capacity' },
    { id: 'm5', name: 'Block B Parking', x: 120, y: 130, width: 80, height: 50, status: 'available', type: 'parking', details: '48 slots free' },
    { id: 'm6', name: 'Sports Complex', x: 250, y: 110, width: 90, height: 80, status: 'available', type: 'parking', details: 'Low crowd' },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'a1', type: 'library', priority: 'high', message: 'Silent Study Zone is almost full (85% occupied)', timestamp: new Date(Date.now() - 300000), read: false, action: 'View Zones' },
    { id: 'a2', type: 'parking', priority: 'medium', message: 'New parking slot opened at Block A', timestamp: new Date(Date.now() - 600000), read: false, action: 'Navigate' },
    { id: 'a3', type: 'lab', priority: 'low', message: 'Computer Lab 2 is now available', timestamp: new Date(Date.now() - 900000), read: true, action: 'Book Now' },
    { id: 'a4', type: 'weather', priority: 'medium', message: 'Light rain expected in 30 minutes', timestamp: new Date(Date.now() - 1200000), read: false, action: 'View Weather' },
  ]);

  // Analytics Data
  const [parkingTrendData] = useState([
    { time: '6 AM', occupancy: 20 },
    { time: '8 AM', occupancy: 75 },
    { time: '10 AM', occupancy: 95 },
    { time: '12 PM', occupancy: 90 },
    { time: '2 PM', occupancy: 85 },
    { time: '4 PM', occupancy: 70 },
    { time: '6 PM', occupancy: 40 },
    { time: '8 PM', occupancy: 15 },
  ]);

  const [libraryTrendData] = useState([
    { time: '7 AM', seats: 30 },
    { time: '9 AM', seats: 120 },
    { time: '11 AM', seats: 200 },
    { time: '1 PM', seats: 180 },
    { time: '3 PM', seats: 250 },
    { time: '5 PM', seats: 220 },
    { time: '7 PM', seats: 150 },
    { time: '9 PM', seats: 80 },
  ]);

  const [weeklyData] = useState([
    { day: 'Mon', parking: 85, library: 220, labs: 45 },
    { day: 'Tue', parking: 90, library: 240, labs: 52 },
    { day: 'Wed', parking: 88, library: 235, labs: 48 },
    { day: 'Thu', parking: 92, library: 250, labs: 55 },
    { day: 'Fri', parking: 95, library: 210, labs: 42 },
    { day: 'Sat', parking: 40, library: 120, labs: 20 },
    { day: 'Sun', parking: 25, library: 80, labs: 10 },
  ]);

  const [resourceDistribution] = useState([
    { name: 'Parking', value: parkingAreas.reduce((sum, p) => sum + (p.total - p.available - p.reserved), 0) },
    { name: 'Library', value: libraryZones.reduce((sum, l) => sum + (l.total - l.available), 0) },
    { name: 'Labs', value: labs.reduce((sum, l) => sum + l.currentOccupancy, 0) },
    { name: 'Common Areas', value: commonAreas.reduce((sum, c) => sum + c.currentCount, 0) },
  ]);

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  // Real-time simulation - Update data every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadSmartCampusData(); // Load fresh data from API
      setLastUpdated(new Date());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const manualRefresh = () => {
    setIsRefreshing(true);
    loadSmartCampusData();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getPredictiveInsight = (type: 'library' | 'parking' | 'cafeteria'): string => {
    const hour = new Date().getHours();
    
    if (type === 'library') {
      if (hour >= 9 && hour <= 11) return '🔴 Peak study hours. Visit after 3 PM for better availability.';
      if (hour >= 14 && hour <= 17) return '🟡 Moderate crowd. Good time to study.';
      return '🟢 Low crowd expected. Perfect time to visit!';
    }
    
    if (type === 'parking') {
      if (hour >= 8 && hour <= 10) return '🔴 Morning rush. Consider two-wheeler parking or arrive before 8 AM.';
      if (hour >= 12 && hour <= 14) return '🟡 Lunch break - parking filling up quickly.';
      return '🟢 Good parking availability expected.';
    }
    
    if (type === 'cafeteria') {
      if (hour >= 12 && hour <= 14) return '🔴 Peak lunch hours. Expect 15-20 min wait time.';
      if (hour >= 16 && hour <= 18) return '🟡 Evening snack time - moderately busy.';
      return '🟢 Low crowd - quick service expected!';
    }
    
    return 'Real-time data available';
  };

  const handleViewDetails = (resource: any, type: string) => {
    setSelectedResource({ ...resource, resourceType: type });
    setShowDetailModal(true);
  };

  const handleNavigate = (resource: any) => {
    setNavigationDestination(resource);
    setShowNavigationModal(true);
  };

  const handleBookLab = (lab: Lab) => {
    setBookingResource(lab);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      const formData = new FormData();
      const form = document.querySelector('#booking-form') as HTMLFormElement;
      if (!form) return;
      
      const formElements = form.elements as any;
      const bookingData = {
        date: formElements.date.value,
        timeSlot: formElements.timeSlot.value,
        purpose: formElements.purpose.value,
        participants: formElements.participants.value,
        notes: formElements.notes.value
      };
      
      const response = await fetch(`${API_BASE_URL}/smart-campus/labs/${bookingResource.id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        setShowBookingModal(false);
        setBookingResource(null);
        loadSmartCampusData(); // Refresh data
      } else {
        alert(result.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const toggleFavorite = (resourceType: string, resourceId: string, resourceName: string) => {
    const existingFav = favorites.find(f => f.resourceId === resourceId);
    if (existingFav) {
      setFavorites(favorites.filter(f => f.resourceId !== resourceId));
    } else {
      setFavorites([...favorites, { 
        id: `fav${Date.now()}`, 
        resourceType: resourceType as any, 
        resourceId, 
        resourceName 
      }]);
    }
  };

  const isFavorite = (resourceId: string) => {
    return favorites.some(f => f.resourceId === resourceId);
  };

  const handleAlertAction = (alert: Alert) => {
    if (alert.action === 'Navigate' && alert.type === 'parking') {
      const parkingArea = parkingAreas.find(p => alert.message.includes(p.name));
      if (parkingArea) handleNavigate(parkingArea);
    } else if (alert.action === 'View Zones' && alert.type === 'library') {
      setActiveTab('library');
    } else if (alert.action === 'Book Now' && alert.type === 'lab') {
      setActiveTab('labs');
    }
    
    // Mark as read
    setAlerts(alerts.map(a => a.id === alert.id ? { ...a, read: true } : a));
  };

  const filteredParkingAreas = parkingFilter === 'all' 
    ? parkingAreas 
    : parkingAreas.filter(area => area.type === parkingFilter);

  const totalLibrarySeats = libraryZones.reduce((sum, zone) => sum + zone.total, 0);
  const availableLibrarySeats = libraryZones.reduce((sum, zone) => sum + zone.available, 0);
  const libraryOccupancy = ((totalLibrarySeats - availableLibrarySeats) / totalLibrarySeats * 100).toFixed(0);

  const freeLabs = labs.filter(lab => lab.status === 'free').length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold text-slate-800">Smart Campus Live</h2>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3" />
                LIVE IOT
              </div>
            </div>
            <p className="text-slate-600">Real-time campus resource availability powered by IoT sensors</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-400 to-slate-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={manualRefresh}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all ${isRefreshing ? 'opacity-50' : ''}`}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Bell className="w-5 h-5" />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {unreadAlerts}
                </span>
              )}
            </button>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-slate-600">Temperature</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{weather.temperature}°C</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-slate-600">Humidity</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{weather.humidity}%</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-cyan-600" />
              <span className="text-xs text-slate-600">Wind Speed</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{weather.windSpeed} km/h</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              {weather.condition === 'Sunny' ? <Sun className="w-5 h-5 text-yellow-600" /> : <CloudRain className="w-5 h-5 text-slate-600" />}
              <span className="text-xs text-slate-600">Condition</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{weather.condition}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-green-600" />
              <span className="text-xs text-slate-600">Air Quality</span>
            </div>
            <p className="text-lg font-bold text-green-600">{weather.airQuality}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Parking Spots', value: parkingAreas.reduce((sum, area) => sum + area.available, 0), icon: Car, color: 'from-blue-500 to-cyan-500', onClick: () => setActiveTab('parking') },
            { label: 'Library Seats', value: availableLibrarySeats, icon: BookOpen, color: 'from-purple-500 to-pink-500', onClick: () => setActiveTab('library') },
            { label: 'Free Labs', value: freeLabs, icon: Microscope, color: 'from-green-500 to-emerald-500', onClick: () => setActiveTab('labs') },
            { label: 'IoT Sensors', value: '47 Active', icon: Wifi, color: 'from-orange-500 to-red-500', onClick: () => {} },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={stat.onClick}
              className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Auto-refresh: 8s</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Full</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'parking', label: 'Parking', icon: Car },
            { id: 'library', label: 'Library', icon: BookOpen },
            { id: 'labs', label: 'Labs', icon: Microscope },
            { id: 'common', label: 'Common Areas', icon: Coffee },
            { id: 'map', label: 'Live Map', icon: Map },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.id === 'alerts' && unreadAlerts > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                  {unreadAlerts}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab - Enhanced */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Favorites Quick Access */}
            {favorites.length > 0 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-slate-800">Your Favorites</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favorites.slice(0, 3).map((fav) => (
                    <div key={fav.id} className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                      <p className="font-semibold text-slate-800">{fav.resourceName}</p>
                      <p className="text-xs text-slate-600 capitalize">{fav.resourceType}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Access Cards - Continue with rest of overview... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parking Overview */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Smart Parking</h3>
                      <p className="text-sm text-slate-600">Real-time availability</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('parking')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {parkingAreas.slice(0, 3).map((area) => (
                    <div key={area.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer" onClick={() => handleViewDetails(area, 'parking')}>
                      <div>
                        <p className="font-semibold text-slate-800">{area.name}</p>
                        <p className="text-xs text-slate-600">{area.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-800">{area.available}</p>
                        <p className="text-xs text-slate-600">spots free</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Library Overview */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Library</h3>
                      <p className="text-sm text-slate-600">{libraryOccupancy}% occupied</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View Zones
                  </button>
                </div>
                <div className="space-y-3">
                  {libraryZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer" onClick={() => handleViewDetails(zone, 'library')}>
                      <div>
                        <p className="font-semibold text-slate-800">{zone.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            zone.crowdLevel === 'low' ? 'bg-green-500' :
                            zone.crowdLevel === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <p className="text-xs text-slate-600 capitalize">{zone.crowdLevel} crowd</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-800">{zone.available}</p>
                        <p className="text-xs text-slate-600">seats</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labs Overview */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Microscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Labs</h3>
                      <p className="text-sm text-slate-600">{freeLabs} labs available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('labs')}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View Labs
                  </button>
                </div>
                <div className="space-y-3">
                  {labs.slice(0, 3).map((lab) => (
                    <div key={lab.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer" onClick={() => handleViewDetails(lab, 'lab')}>
                      <div>
                        <p className="font-semibold text-slate-800">{lab.name}</p>
                        <p className="text-xs text-slate-600">{lab.building}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lab.status === 'free' ? 'bg-green-100 text-green-700' :
                        lab.status === 'in-use' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {lab.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Areas Overview */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Common Areas</h3>
                      <p className="text-sm text-slate-600">Cafeteria, study halls</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('common')}
                    className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {commonAreas.slice(0, 3).map((area) => (
                    <div key={area.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer" onClick={() => handleViewDetails(area, 'common')}>
                      <div className="flex items-center gap-3">
                        {area.type === 'cafeteria' && <UtensilsCrossed className="w-5 h-5 text-orange-600" />}
                        {area.type === 'washroom' && <DoorOpen className="w-5 h-5 text-blue-600" />}
                        {area.type === 'study-hall' && <BookMarked className="w-5 h-5 text-purple-600" />}
                        {area.type === 'common-room' && <Armchair className="w-5 h-5 text-green-600" />}
                        <div>
                          <p className="font-semibold text-slate-800">{area.name}</p>
                          <p className="text-xs text-slate-600 capitalize">{area.type.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        area.crowdLevel === 'low' ? 'bg-green-100 text-green-700' :
                        area.crowdLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {area.crowdLevel.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parking Tab - Continue in next message due to length... */}
        {activeTab === 'parking' && (
          <ParkingTab
            parkingAreas={parkingAreas}
            filteredParkingAreas={filteredParkingAreas}
            parkingFilter={parkingFilter}
            setParkingFilter={setParkingFilter}
            handleViewDetails={handleViewDetails}
            handleNavigate={handleNavigate}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {/* Library Tab - Continue in next message due to length... */}
        {activeTab === 'library' && (
          <LibraryTab
            libraryZones={libraryZones}
            handleViewDetails={handleViewDetails}
            handleNavigate={handleNavigate}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {/* Labs Tab - Continue in next message due to length... */}
        {activeTab === 'labs' && (
          <LabsTab
            labs={labs}
            handleViewDetails={handleViewDetails}
            handleBookLab={handleBookLab}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {/* Common Areas Tab - Continue in next message due to length... */}
        {activeTab === 'common' && (
          <CommonAreasTab
            commonAreas={commonAreas}
            handleViewDetails={handleViewDetails}
            handleNavigate={handleNavigate}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {/* Map Tab - Continue in next message due to length... */}
        {activeTab === 'map' && (
          <MapTab
            campusMapAreas={campusMapAreas}
            selectedMapArea={selectedMapArea}
            setSelectedMapArea={setSelectedMapArea}
            handleViewDetails={handleViewDetails}
            handleNavigate={handleNavigate}
          />
        )}

        {/* Alerts Tab - Continue in next message due to length... */}
        {activeTab === 'alerts' && (
          <AlertsTab
            alerts={alerts}
            handleAlertAction={handleAlertAction}
          />
        )}

        {/* Analytics Tab - Continue in next message due to length... */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            parkingTrendData={parkingTrendData}
            libraryTrendData={libraryTrendData}
            weeklyData={weeklyData}
            resourceDistribution={resourceDistribution}
            COLORS={COLORS}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      
      {/* Detail Modal */}
      {showDetailModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedResource.name} - Detailed Information
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Current Status</h3>
                    {selectedResource.resourceType === 'parking' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Available Spots:</span>
                          <span className="font-bold">{selectedResource.available}/{selectedResource.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reserved:</span>
                          <span className="font-bold">{selectedResource.reserved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vehicle Type:</span>
                          <span className="font-bold capitalize">{selectedResource.type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-bold">{selectedResource.distance} km</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedResource.resourceType === 'library' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Available Seats:</span>
                          <span className="font-bold">{selectedResource.available}/{selectedResource.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zone Type:</span>
                          <span className="font-bold capitalize">{selectedResource.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Floor:</span>
                          <span className="font-bold">{selectedResource.floor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="font-bold">{selectedResource.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Noise Level:</span>
                          <span className="font-bold">{selectedResource.noise} dB</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedResource.resourceType === 'lab' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`font-bold capitalize ${
                            selectedResource.status === 'free' ? 'text-green-600' :
                            selectedResource.status === 'in-use' ? 'text-red-600' :
                            'text-slate-600'
                          }`}>{selectedResource.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span className="font-bold">{selectedResource.capacity} people</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Occupancy:</span>
                          <span className="font-bold">{selectedResource.currentOccupancy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Building:</span>
                          <span className="font-bold">{selectedResource.building}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supervisor:</span>
                          <span className="font-bold">{selectedResource.supervisor}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedResource.resourceType === 'common' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Count:</span>
                          <span className="font-bold">{selectedResource.currentCount}/{selectedResource.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-bold capitalize">{selectedResource.type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Crowd Level:</span>
                          <span className={`font-bold capitalize ${
                            selectedResource.crowdLevel === 'low' ? 'text-green-600' :
                            selectedResource.crowdLevel === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{selectedResource.crowdLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operating Hours:</span>
                          <span className="font-bold">{selectedResource.openTime} - {selectedResource.closeTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Facilities/Amenities */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">
                      {selectedResource.resourceType === 'parking' ? 'Amenities' : 
                       selectedResource.resourceType === 'library' ? 'Facilities' :
                       selectedResource.resourceType === 'lab' ? 'Equipment' : 'Available Services'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedResource.amenities || selectedResource.facilities || selectedResource.equipment || selectedResource.specialties || []).map((item: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  {selectedResource.contact && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="font-bold text-slate-800 mb-3">Contact Information</h3>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-slate-700">{selectedResource.contact}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Real-time Chart */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Usage Trend (Today)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { time: '8 AM', usage: Math.random() * 100 },
                        { time: '10 AM', usage: Math.random() * 100 },
                        { time: '12 PM', usage: Math.random() * 100 },
                        { time: '2 PM', usage: Math.random() * 100 },
                        { time: '4 PM', usage: Math.random() * 100 },
                        { time: '6 PM', usage: Math.random() * 100 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="usage" stroke="#06b6d4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Predictive Insights */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">AI Insights</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-yellow-600 mt-1" />
                        <p className="text-sm text-slate-700">
                          {getPredictiveInsight(selectedResource.resourceType === 'parking' ? 'parking' : 
                                               selectedResource.resourceType === 'library' ? 'library' : 'cafeteria')}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-1" />
                        <p className="text-sm text-slate-700">
                          Peak usage typically occurs between {
                            selectedResource.resourceType === 'parking' ? '9 AM - 11 AM' :
                            selectedResource.resourceType === 'library' ? '2 PM - 5 PM' :
                            selectedResource.resourceType === 'lab' ? '10 AM - 3 PM' :
                            '12 PM - 2 PM'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-600 mt-1" />
                        <p className="text-sm text-slate-700">
                          Average wait time: {Math.floor(Math.random() * 10) + 1} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Schedule (for labs) */}
                  {selectedResource.resourceType === 'lab' && selectedResource.schedule && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                      <h3 className="font-bold text-slate-800 mb-3">Weekly Schedule</h3>
                      <div className="space-y-2">
                        {selectedResource.schedule.map((day: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{day.day}:</span>
                            <div className="flex gap-1">
                              {day.slots.map((slot: string, slotIndex: number) => (
                                <span key={slotIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                  {slot}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleNavigate(selectedResource);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
                
                {selectedResource.resourceType === 'lab' && selectedResource.bookable && selectedResource.status === 'free' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleBookLab(selectedResource);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Book Now
                  </button>
                )}
                
                <button
                  onClick={() => toggleFavorite(selectedResource.resourceType, selectedResource.id, selectedResource.name)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(selectedResource.id) ? 'fill-current' : ''}`} />
                  {isFavorite(selectedResource.id) ? 'Remove Favorite' : 'Add Favorite'}
                </button>
                
                <button
                  onClick={() => {
                    navigator.share({
                      title: selectedResource.name,
                      text: `Check out ${selectedResource.name} on Smart Campus`,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Modal */}
      {showNavigationModal && navigationDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Navigation to {navigationDestination.name}</h2>
                <button
                  onClick={() => setShowNavigationModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-3">Route Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="font-bold">{navigationDestination.distance || '0.3'} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Time:</span>
                      <span className="font-bold">{Math.ceil((navigationDestination.distance || 0.3) * 3)} minutes walking</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-bold">{navigationDestination.location || navigationDestination.building}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-3">Turn-by-Turn Directions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-slate-700">Head south from your current location</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-slate-700">Turn right at the main pathway</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-slate-700">Continue straight for 200m</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-slate-700">Destination will be on your left</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-3">Helpful Tips</h3>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Look for the blue campus signage</li>
                    <li>• {navigationDestination.resourceType === 'parking' ? 'Check for available spots on arrival' : 'Building entrance is clearly marked'}</li>
                    <li>• Contact: {navigationDestination.contact || 'Campus Help: +91 98765 43210'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    window.open(`https://maps.google.com/?q=${navigationDestination.coordinates?.lat || 12.9716},${navigationDestination.coordinates?.lng || 77.5946}`, '_blank');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in Google Maps
                </button>
                <button
                  onClick={() => {
                    alert('Navigation started! Follow the blue path markers on campus.');
                    setShowNavigationModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Start Navigation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && bookingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Book {bookingResource.name}</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-3">Lab Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-600">Capacity:</span>
                      <p className="font-bold">{bookingResource.capacity} people</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Building:</span>
                      <p className="font-bold">{bookingResource.building}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Supervisor:</span>
                      <p className="font-bold">{bookingResource.supervisor}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Contact:</span>
                      <p className="font-bold">{bookingResource.contact}</p>
                    </div>
                  </div>
                </div>
                
                <form id="booking-form" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <input
                        name="date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Time Slot</label>
                      <select 
                        name="timeSlot"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select time slot</option>
                        <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
                        <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                        <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
                    <select 
                      name="purpose"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select purpose</option>
                      <option value="Class/Lecture">Class/Lecture</option>
                      <option value="Lab Session">Lab Session</option>
                      <option value="Project Work">Project Work</option>
                      <option value="Research">Research</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Participants</label>
                    <input
                      name="participants"
                      type="number"
                      min="1"
                      max={bookingResource.capacity}
                      placeholder="Enter number of participants"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Any special requirements or notes..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </form>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-2">Booking Terms</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Bookings must be made at least 2 hours in advance</li>
                    <li>• Maximum booking duration is 4 hours</li>
                    <li>• Cancellations allowed up to 1 hour before booking time</li>
                    <li>• Lab supervisor approval may be required for certain equipment</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Smart Campus Settings</h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    {Object.entries(notificationPreferences).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className="text-slate-700 capitalize">{key} Alerts</span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationPreferences(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-4">Auto-Refresh Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Enable Auto-Refresh</span>
                      <input
                        type="checkbox"
                        checked={alertsEnabled}
                        onChange={(e) => setAlertsEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Refresh Interval</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>5 seconds</option>
                        <option selected>8 seconds</option>
                        <option>10 seconds</option>
                        <option>15 seconds</option>
                        <option>30 seconds</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-4">Display Preferences</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Default Tab</label>
                      <select 
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="overview">Overview</option>
                        <option value="parking">Parking</option>
                        <option value="library">Library</option>
                        <option value="labs">Labs</option>
                        <option value="common">Common Areas</option>
                        <option value="map">Live Map</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Light Mode</option>
                        <option>Dark Mode</option>
                        <option>Auto (System)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                  <h3 className="font-bold text-slate-800 mb-4">Data & Privacy</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-left">
                      Export My Data
                    </button>
                    <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-left">
                      Clear All Favorites
                    </button>
                    <button className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all text-left">
                      Reset All Settings
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Settings saved successfully!');
                    setShowSettingsModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}