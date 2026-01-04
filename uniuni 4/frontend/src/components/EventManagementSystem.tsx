import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, MapPin, Users, Edit3, Trash2, Save, X,
  Send, Bell, CheckCircle, AlertTriangle, Mail, Phone,
  MessageSquare, History, RefreshCw, Ban, Check, Eye,
  Filter, Search, Download, Upload, Settings, ChevronDown,
  UserCheck, Briefcase, DollarSign, FileText, Image as ImageIcon,
  Sparkles, TrendingUp, Star, Award, Target, Zap
} from 'lucide-react';

interface Event {
  id: number;
  name: string;
  club: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  budget: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registeredParticipants: number;
  maxParticipants: number;
  coordinator: string;
  category: string;
  tags: string[];
  participants: Participant[];
  changeHistory: ChangeRecord[];
  imageUrl?: string;
  requirements: string[];
}

interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredOn: string;
  role: 'student' | 'faculty';
  department: string;
  notificationPreference: 'email' | 'sms' | 'both';
}

interface ChangeRecord {
  id: number;
  timestamp: string;
  changedBy: string;
  changeType: 'edit' | 'reschedule' | 'cancel' | 'restore';
  oldValue: string;
  newValue: string;
  field: string;
  notificationsSent: number;
}

export function EventManagementSystem() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: 'Tech Hackathon 2024',
      club: 'Tech Club',
      date: '2024-04-15',
      time: '09:00 AM',
      venue: 'Main Auditorium',
      description: 'A 24-hour coding hackathon with industry mentors and exciting prizes.',
      budget: '₹50,000',
      status: 'upcoming',
      registeredParticipants: 156,
      maxParticipants: 200,
      coordinator: 'Raj Kumar',
      category: 'Technical',
      tags: ['coding', 'competition', 'prizes'],
      requirements: ['Laptop', 'Student ID', 'Team of 2-4 members'],
      participants: [
        { id: 1, name: 'Amit Sharma', email: 'amit@uni.edu', phone: '9876543210', registeredOn: '2024-03-01', role: 'student', department: 'CSE', notificationPreference: 'both' },
        { id: 2, name: 'Priya Singh', email: 'priya@uni.edu', phone: '9876543211', registeredOn: '2024-03-02', role: 'student', department: 'IT', notificationPreference: 'email' },
        { id: 3, name: 'Rahul Verma', email: 'rahul@uni.edu', phone: '9876543212', registeredOn: '2024-03-03', role: 'student', department: 'CSE', notificationPreference: 'sms' },
        { id: 4, name: 'Sneha Patel', email: 'sneha@uni.edu', phone: '9876543213', registeredOn: '2024-03-04', role: 'student', department: 'IT', notificationPreference: 'both' },
        { id: 5, name: 'Vikram Joshi', email: 'vikram@uni.edu', phone: '9876543214', registeredOn: '2024-03-05', role: 'student', department: 'CSE', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 2,
      name: 'Spring Concert',
      club: 'Music Society',
      date: '2024-04-20',
      time: '06:00 PM',
      venue: 'Open Air Theatre',
      description: 'Annual spring concert featuring student bands and guest performers.',
      budget: '₹75,000',
      status: 'upcoming',
      registeredParticipants: 423,
      maxParticipants: 500,
      coordinator: 'Sarah Johnson',
      category: 'Cultural',
      tags: ['music', 'live performance', 'entertainment'],
      requirements: ['Valid ticket', 'Student ID'],
      participants: [
        { id: 6, name: 'Neha Gupta', email: 'neha@uni.edu', phone: '9876543215', registeredOn: '2024-03-05', role: 'student', department: 'Arts', notificationPreference: 'both' },
        { id: 7, name: 'Karan Mehta', email: 'karan@uni.edu', phone: '9876543216', registeredOn: '2024-03-06', role: 'student', department: 'Music', notificationPreference: 'email' },
        { id: 8, name: 'Ananya Roy', email: 'ananya@uni.edu', phone: '9876543217', registeredOn: '2024-03-07', role: 'student', department: 'Arts', notificationPreference: 'both' },
      ],
      changeHistory: [
        { id: 1, timestamp: '2024-03-10 02:30 PM', changedBy: 'Sarah Johnson', changeType: 'edit', oldValue: '05:00 PM', newValue: '06:00 PM', field: 'time', notificationsSent: 423 }
      ]
    },
    {
      id: 3,
      name: 'Annual Sports Meet',
      club: 'Sports Club',
      date: '2024-04-25',
      time: '08:00 AM',
      venue: 'Sports Complex',
      description: 'Inter-department sports competition with multiple events.',
      budget: '₹40,000',
      status: 'upcoming',
      registeredParticipants: 289,
      maxParticipants: 400,
      coordinator: 'Amit Patel',
      category: 'Sports',
      tags: ['athletics', 'competition', 'teamwork'],
      requirements: ['Sports attire', 'Medical certificate'],
      participants: [
        { id: 9, name: 'Rohan Das', email: 'rohan@uni.edu', phone: '9876543218', registeredOn: '2024-03-08', role: 'student', department: 'PE', notificationPreference: 'sms' },
        { id: 10, name: 'Kavya Iyer', email: 'kavya@uni.edu', phone: '9876543219', registeredOn: '2024-03-09', role: 'student', department: 'PE', notificationPreference: 'both' },
      ],
      changeHistory: []
    },
    {
      id: 4,
      name: 'AI & ML Workshop',
      club: 'Tech Club',
      date: '2024-04-18',
      time: '02:00 PM',
      venue: 'Computer Lab A',
      description: 'Hands-on workshop on Artificial Intelligence and Machine Learning fundamentals.',
      budget: '₹25,000',
      status: 'upcoming',
      registeredParticipants: 87,
      maxParticipants: 100,
      coordinator: 'Raj Kumar',
      category: 'Technical',
      tags: ['AI', 'ML', 'workshop', 'hands-on'],
      requirements: ['Laptop', 'Basic Python knowledge', 'Student ID'],
      participants: [
        { id: 11, name: 'Aditya Kulkarni', email: 'aditya@uni.edu', phone: '9876543220', registeredOn: '2024-03-10', role: 'student', department: 'CSE', notificationPreference: 'email' },
        { id: 12, name: 'Divya Nair', email: 'divya@uni.edu', phone: '9876543221', registeredOn: '2024-03-11', role: 'student', department: 'IT', notificationPreference: 'both' },
      ],
      changeHistory: []
    },
    {
      id: 5,
      name: 'Photography Exhibition',
      club: 'Photography Club',
      date: '2024-04-22',
      time: '10:00 AM',
      venue: 'Art Gallery',
      description: 'Annual photography exhibition showcasing student work from across the year.',
      budget: '₹15,000',
      status: 'upcoming',
      registeredParticipants: 145,
      maxParticipants: 200,
      coordinator: 'Meera Desai',
      category: 'Cultural',
      tags: ['photography', 'exhibition', 'art'],
      requirements: ['Valid ID', 'Pre-registration'],
      participants: [
        { id: 13, name: 'Arjun Reddy', email: 'arjun@uni.edu', phone: '9876543222', registeredOn: '2024-03-12', role: 'student', department: 'Arts', notificationPreference: 'both' },
        { id: 14, name: 'Ishita Banerjee', email: 'ishita@uni.edu', phone: '9876543223', registeredOn: '2024-03-13', role: 'student', department: 'Media', notificationPreference: 'email' },
      ],
      changeHistory: [
        { id: 2, timestamp: '2024-03-15 11:00 AM', changedBy: 'Meera Desai', changeType: 'reschedule', oldValue: '2024-04-21', newValue: '2024-04-22', field: 'date', notificationsSent: 145 }
      ]
    },
    {
      id: 6,
      name: 'Debate Competition',
      club: 'Literary Society',
      date: '2024-04-12',
      time: '03:00 PM',
      venue: 'Seminar Hall B',
      description: 'Inter-college debate competition on contemporary topics.',
      budget: '₹20,000',
      status: 'ongoing',
      registeredParticipants: 64,
      maxParticipants: 80,
      coordinator: 'Dr. Anjali Sharma',
      category: 'Academic',
      tags: ['debate', 'competition', 'public speaking'],
      requirements: ['Team of 3', 'College ID', 'Registration fee'],
      participants: [
        { id: 15, name: 'Siddharth Malhotra', email: 'siddharth@uni.edu', phone: '9876543224', registeredOn: '2024-03-01', role: 'student', department: 'English', notificationPreference: 'both' },
        { id: 16, name: 'Riya Khanna', email: 'riya@uni.edu', phone: '9876543225', registeredOn: '2024-03-02', role: 'student', department: 'Law', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 7,
      name: 'Dance Workshop',
      club: 'Dance Society',
      date: '2024-04-28',
      time: '05:00 PM',
      venue: 'Dance Studio',
      description: 'Contemporary dance workshop by professional choreographers.',
      budget: '₹30,000',
      status: 'upcoming',
      registeredParticipants: 112,
      maxParticipants: 150,
      coordinator: 'Priya Sharma',
      category: 'Cultural',
      tags: ['dance', 'workshop', 'contemporary'],
      requirements: ['Comfortable clothing', 'Dance shoes (optional)', 'Student ID'],
      participants: [
        { id: 17, name: 'Tanvi Agarwal', email: 'tanvi@uni.edu', phone: '9876543226', registeredOn: '2024-03-14', role: 'student', department: 'Performing Arts', notificationPreference: 'both' },
        { id: 18, name: 'Kabir Singh', email: 'kabir@uni.edu', phone: '9876543227', registeredOn: '2024-03-15', role: 'student', department: 'Arts', notificationPreference: 'sms' },
      ],
      changeHistory: []
    },
    {
      id: 8,
      name: 'Startup Pitch Competition',
      club: 'Entrepreneurship Cell',
      date: '2024-04-30',
      time: '11:00 AM',
      venue: 'Innovation Hub',
      description: 'Pitch your startup ideas to investors and win seed funding.',
      budget: '₹60,000',
      status: 'upcoming',
      registeredParticipants: 45,
      maxParticipants: 60,
      coordinator: 'Nikhil Verma',
      category: 'Technical',
      tags: ['startup', 'entrepreneurship', 'pitch', 'funding'],
      requirements: ['Business plan', 'Prototype/MVP', 'Team of 2-5'],
      participants: [
        { id: 19, name: 'Aarav Gupta', email: 'aarav@uni.edu', phone: '9876543228', registeredOn: '2024-03-16', role: 'student', department: 'MBA', notificationPreference: 'both' },
        { id: 20, name: 'Zara Ahmed', email: 'zara@uni.edu', phone: '9876543229', registeredOn: '2024-03-17', role: 'student', department: 'Engineering', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 9,
      name: 'Film Screening & Discussion',
      club: 'Film Society',
      date: '2024-03-20',
      time: '07:00 PM',
      venue: 'Mini Theatre',
      description: 'Screening of award-winning independent films followed by panel discussion.',
      budget: '₹12,000',
      status: 'completed',
      registeredParticipants: 78,
      maxParticipants: 100,
      coordinator: 'Ravi Kumar',
      category: 'Cultural',
      tags: ['film', 'cinema', 'discussion'],
      requirements: ['Student ID', 'Pre-registration'],
      participants: [
        { id: 21, name: 'Maya Reddy', email: 'maya@uni.edu', phone: '9876543230', registeredOn: '2024-03-01', role: 'student', department: 'Media', notificationPreference: 'both' },
        { id: 22, name: 'Aryan Chopra', email: 'aryan@uni.edu', phone: '9876543231', registeredOn: '2024-03-02', role: 'faculty', department: 'Film Studies', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 10,
      name: 'Career Fair 2024',
      club: 'Placement Cell',
      date: '2024-05-05',
      time: '09:00 AM',
      venue: 'Convention Center',
      description: 'Meet with top recruiters and explore career opportunities across industries.',
      budget: '₹1,50,000',
      status: 'upcoming',
      registeredParticipants: 567,
      maxParticipants: 800,
      coordinator: 'Dr. Suresh Iyer',
      category: 'Academic',
      tags: ['placement', 'career', 'recruitment', 'jobs'],
      requirements: ['Resume copies', 'Formal attire', 'Student ID'],
      participants: [
        { id: 23, name: 'Pooja Malhotra', email: 'pooja@uni.edu', phone: '9876543232', registeredOn: '2024-03-18', role: 'student', department: 'CSE', notificationPreference: 'both' },
        { id: 24, name: 'Rajesh Yadav', email: 'rajesh@uni.edu', phone: '9876543233', registeredOn: '2024-03-19', role: 'student', department: 'Mechanical', notificationPreference: 'email' },
        { id: 25, name: 'Simran Kaur', email: 'simran@uni.edu', phone: '9876543234', registeredOn: '2024-03-20', role: 'student', department: 'ECE', notificationPreference: 'both' },
      ],
      changeHistory: []
    },
    {
      id: 11,
      name: 'Blood Donation Camp',
      club: 'Social Service Club',
      date: '2024-04-08',
      time: '09:00 AM',
      venue: 'Medical Center',
      description: 'Annual blood donation drive in collaboration with city blood bank.',
      budget: '₹8,000',
      status: 'upcoming',
      registeredParticipants: 234,
      maxParticipants: 300,
      coordinator: 'Dr. Anita Singh',
      category: 'Social',
      tags: ['blood donation', 'social service', 'health'],
      requirements: ['Age 18+', 'Health certificate', 'Valid ID'],
      participants: [
        { id: 26, name: 'Harsh Mehta', email: 'harsh@uni.edu', phone: '9876543235', registeredOn: '2024-03-21', role: 'student', department: 'Medicine', notificationPreference: 'both' },
        { id: 27, name: 'Nandini Joshi', email: 'nandini@uni.edu', phone: '9876543236', registeredOn: '2024-03-22', role: 'faculty', department: 'Nursing', notificationPreference: 'sms' },
      ],
      changeHistory: [
        { id: 3, timestamp: '2024-03-08 10:00 AM', changedBy: 'Dr. Anita Singh', changeType: 'edit', oldValue: 'Health Center', newValue: 'Medical Center', field: 'venue', notificationsSent: 234 }
      ]
    },
    {
      id: 12,
      name: 'Gaming Tournament',
      club: 'Gaming Club',
      date: '2024-04-16',
      time: '12:00 PM',
      venue: 'Gaming Arena',
      description: 'E-sports tournament featuring popular games like VALORANT, CS:GO, and FIFA.',
      budget: '₹35,000',
      status: 'upcoming',
      registeredParticipants: 178,
      maxParticipants: 200,
      coordinator: 'Rohit Sharma',
      category: 'Technical',
      tags: ['gaming', 'e-sports', 'tournament', 'competition'],
      requirements: ['Gaming setup', 'Team registration', 'Entry fee'],
      participants: [
        { id: 28, name: 'Karthik Subramanian', email: 'karthik@uni.edu', phone: '9876543237', registeredOn: '2024-03-23', role: 'student', department: 'CSE', notificationPreference: 'both' },
        { id: 29, name: 'Shruti Nambiar', email: 'shruti@uni.edu', phone: '9876543238', registeredOn: '2024-03-24', role: 'student', department: 'IT', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 13,
      name: 'Classical Music Night',
      club: 'Music Society',
      date: '2024-03-15',
      time: '07:00 PM',
      venue: 'Open Air Theatre',
      description: 'Evening of classical Indian music performances by students and guest artists.',
      budget: '₹45,000',
      status: 'completed',
      registeredParticipants: 312,
      maxParticipants: 400,
      coordinator: 'Sarah Johnson',
      category: 'Cultural',
      tags: ['music', 'classical', 'performance'],
      requirements: ['Free entry', 'Student ID'],
      participants: [],
      changeHistory: []
    },
    {
      id: 14,
      name: 'Coding Bootcamp',
      club: 'Tech Club',
      date: '2024-03-25',
      time: '10:00 AM',
      venue: 'Computer Lab B',
      description: 'Week-long intensive coding bootcamp covering full-stack development.',
      budget: '₹28,000',
      status: 'cancelled',
      registeredParticipants: 92,
      maxParticipants: 100,
      coordinator: 'Raj Kumar',
      category: 'Technical',
      tags: ['coding', 'bootcamp', 'web development'],
      requirements: ['Laptop', 'Basic programming knowledge'],
      participants: [
        { id: 30, name: 'Varun Deshmukh', email: 'varun@uni.edu', phone: '9876543239', registeredOn: '2024-02-28', role: 'student', department: 'CSE', notificationPreference: 'both' },
      ],
      changeHistory: [
        { id: 4, timestamp: '2024-03-20 03:00 PM', changedBy: 'Raj Kumar', changeType: 'cancel', oldValue: 'upcoming', newValue: 'cancelled', field: 'status', notificationsSent: 92 }
      ]
    },
    {
      id: 15,
      name: 'Art & Craft Fair',
      club: 'Fine Arts Club',
      date: '2024-05-01',
      time: '11:00 AM',
      venue: 'Campus Lawn',
      description: 'Student art exhibition and craft sale featuring handmade items.',
      budget: '₹18,000',
      status: 'upcoming',
      registeredParticipants: 156,
      maxParticipants: 250,
      coordinator: 'Kavita Pillai',
      category: 'Cultural',
      tags: ['art', 'craft', 'exhibition', 'sale'],
      requirements: ['Artist registration', 'Stall booking'],
      participants: [
        { id: 31, name: 'Sanya Kapoor', email: 'sanya@uni.edu', phone: '9876543240', registeredOn: '2024-03-25', role: 'student', department: 'Fine Arts', notificationPreference: 'both' },
        { id: 32, name: 'Manish Tiwari', email: 'manish@uni.edu', phone: '9876543241', registeredOn: '2024-03-26', role: 'student', department: 'Design', notificationPreference: 'email' },
      ],
      changeHistory: []
    },
    {
      id: 16,
      name: 'Yoga & Wellness Session',
      club: 'Wellness Club',
      date: '2024-04-10',
      time: '06:00 AM',
      venue: 'Yoga Center',
      description: 'Morning yoga and meditation session for stress relief and wellness.',
      budget: '₹5,000',
      status: 'upcoming',
      registeredParticipants: 89,
      maxParticipants: 120,
      coordinator: 'Dr. Meera Krishnan',
      category: 'Social',
      tags: ['yoga', 'wellness', 'meditation', 'health'],
      requirements: ['Yoga mat', 'Comfortable clothing', 'Registration'],
      participants: [
        { id: 33, name: 'Anjali Rao', email: 'anjali.rao@uni.edu', phone: '9876543242', registeredOn: '2024-03-27', role: 'faculty', department: 'Physical Education', notificationPreference: 'both' },
        { id: 34, name: 'Deepak Kumar', email: 'deepak@uni.edu', phone: '9876543243', registeredOn: '2024-03-28', role: 'student', department: 'Yoga', notificationPreference: 'sms' },
      ],
      changeHistory: []
    },
    {
      id: 17,
      name: 'Science Quiz Competition',
      club: 'Science Club',
      date: '2024-04-14',
      time: '02:00 PM',
      venue: 'Auditorium C',
      description: 'Inter-department science quiz testing knowledge across various scientific fields.',
      budget: '₹15,000',
      status: 'upcoming',
      registeredParticipants: 96,
      maxParticipants: 120,
      coordinator: 'Dr. Vikram Shah',
      category: 'Academic',
      tags: ['quiz', 'science', 'competition', 'knowledge'],
      requirements: ['Team of 3', 'Student ID', 'Pre-registration'],
      participants: [
        { id: 35, name: 'Ritika Ghosh', email: 'ritika@uni.edu', phone: '9876543244', registeredOn: '2024-03-29', role: 'student', department: 'Physics', notificationPreference: 'both' },
        { id: 36, name: 'Abhishek Pandey', email: 'abhishek@uni.edu', phone: '9876543245', registeredOn: '2024-03-30', role: 'student', department: 'Chemistry', notificationPreference: 'email' },
      ],
      changeHistory: [
        { id: 5, timestamp: '2024-03-12 04:15 PM', changedBy: 'Dr. Vikram Shah', changeType: 'reschedule', oldValue: '01:00 PM', newValue: '02:00 PM', field: 'time', notificationsSent: 96 }
      ]
    },
    {
      id: 18,
      name: 'Fashion Show 2024',
      club: 'Fashion Society',
      date: '2024-05-10',
      time: '06:30 PM',
      venue: 'Main Auditorium',
      description: 'Annual fashion show featuring student designers and models.',
      budget: '₹95,000',
      status: 'upcoming',
      registeredParticipants: 345,
      maxParticipants: 500,
      coordinator: 'Natasha Verma',
      category: 'Cultural',
      tags: ['fashion', 'runway', 'design', 'modeling'],
      requirements: ['Ticket purchase', 'Formal dress code', 'Valid ID'],
      participants: [
        { id: 37, name: 'Tara Menon', email: 'tara@uni.edu', phone: '9876543246', registeredOn: '2024-03-31', role: 'student', department: 'Fashion Design', notificationPreference: 'both' },
        { id: 38, name: 'Samar Jain', email: 'samar@uni.edu', phone: '9876543247', registeredOn: '2024-04-01', role: 'student', department: 'Design', notificationPreference: 'email' },
      ],
      changeHistory: []
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event });
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    if (!editedEvent || !selectedEvent) return;

    const changes: ChangeRecord[] = [];
    const now = new Date().toLocaleString();
    const changedBy = editedEvent.coordinator;

    // Track all changes
    if (editedEvent.date !== selectedEvent.date) {
      changes.push({
        id: Date.now() + 1,
        timestamp: now,
        changedBy,
        changeType: 'reschedule',
        oldValue: selectedEvent.date,
        newValue: editedEvent.date,
        field: 'date',
        notificationsSent: editedEvent.registeredParticipants
      });
    }

    if (editedEvent.time !== selectedEvent.time) {
      changes.push({
        id: Date.now() + 2,
        timestamp: now,
        changedBy,
        changeType: 'reschedule',
        oldValue: selectedEvent.time,
        newValue: editedEvent.time,
        field: 'time',
        notificationsSent: editedEvent.registeredParticipants
      });
    }

    if (editedEvent.venue !== selectedEvent.venue) {
      changes.push({
        id: Date.now() + 3,
        timestamp: now,
        changedBy,
        changeType: 'edit',
        oldValue: selectedEvent.venue,
        newValue: editedEvent.venue,
        field: 'venue',
        notificationsSent: editedEvent.registeredParticipants
      });
    }

    if (editedEvent.name !== selectedEvent.name) {
      changes.push({
        id: Date.now() + 4,
        timestamp: now,
        changedBy,
        changeType: 'edit',
        oldValue: selectedEvent.name,
        newValue: editedEvent.name,
        field: 'name',
        notificationsSent: editedEvent.registeredParticipants
      });
    }

    // Update events with changes
    const updatedEvent = {
      ...editedEvent,
      changeHistory: [...editedEvent.changeHistory, ...changes]
    };

    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    
    // Show notification modal if there are changes
    if (changes.length > 0) {
      setNotificationMessage(generateNotificationMessage(changes, updatedEvent));
      setShowNotificationModal(true);
    }

    setEditMode(false);
    setSelectedEvent(updatedEvent);
  };

  const handleCancelEvent = (event: Event) => {
    if (confirm(`Are you sure you want to cancel "${event.name}"? All ${event.registeredParticipants} participants will be notified.`)) {
      const cancelRecord: ChangeRecord = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        changedBy: event.coordinator,
        changeType: 'cancel',
        oldValue: event.status,
        newValue: 'cancelled',
        field: 'status',
        notificationsSent: event.registeredParticipants
      };

      const updatedEvent = {
        ...event,
        status: 'cancelled' as const,
        changeHistory: [...event.changeHistory, cancelRecord]
      };

      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      setNotificationMessage(`Event "${event.name}" has been cancelled. Notifications sent to ${event.registeredParticipants} participants.`);
      setShowNotificationModal(true);
    }
  };

  const handleRestoreEvent = (event: Event) => {
    const restoreRecord: ChangeRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      changedBy: event.coordinator,
      changeType: 'restore',
      oldValue: 'cancelled',
      newValue: 'upcoming',
      field: 'status',
      notificationsSent: event.registeredParticipants
    };

    const updatedEvent = {
      ...event,
      status: 'upcoming' as const,
      changeHistory: [...event.changeHistory, restoreRecord]
    };

    setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
    setNotificationMessage(`Event "${event.name}" has been restored. Notifications sent to ${event.registeredParticipants} participants.`);
    setShowNotificationModal(true);
  };

  const generateNotificationMessage = (changes: ChangeRecord[], event: Event) => {
    const changeDescriptions = changes.map(c => {
      if (c.field === 'date') return `Date changed from ${c.oldValue} to ${c.newValue}`;
      if (c.field === 'time') return `Time changed from ${c.oldValue} to ${c.newValue}`;
      if (c.field === 'venue') return `Venue changed from ${c.oldValue} to ${c.newValue}`;
      if (c.field === 'name') return `Event name changed from "${c.oldValue}" to "${c.newValue}"`;
      return '';
    }).filter(Boolean).join(', ');

    return `Event "${event.name}" has been updated:\n\n${changeDescriptions}\n\nNotifications will be sent to ${event.registeredParticipants} registered participants via their preferred channels (email/SMS).`;
  };

  const sendNotifications = () => {
    alert('Notifications sent successfully to all registered participants via Email, SMS, and In-App notifications!');
    setShowNotificationModal(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'from-cyan-500 to-blue-500' },
    { label: 'Active Events', value: events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Participants', value: events.reduce((sum, e) => sum + e.registeredParticipants, 0), icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Recent Changes', value: events.reduce((sum, e) => sum + e.changeHistory.length, 0), icon: History, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Event Management System</h2>
            <p className="text-slate-600">Manage, edit, reschedule, and cancel events with automatic participant notifications</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Calendar className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-cyan-200"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-xs text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>
      </div>

      {/* Events Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{event.name}</h3>
                <p className="text-cyan-600 font-semibold text-sm">{event.club}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
                event.status === 'ongoing' ? 'bg-green-100 text-green-600' :
                event.status === 'completed' ? 'bg-purple-100 text-purple-600' :
                'bg-red-100 text-red-600'
              }`}>
                {event.status.toUpperCase()}
              </span>
            </div>

            {/* Event Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-cyan-600" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="w-4 h-4 text-cyan-600" />
                <span>{event.registeredParticipants} / {event.maxParticipants} registered</span>
              </div>
              {event.changeHistory.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <History className="w-4 h-4" />
                  <span>{event.changeHistory.length} change(s)</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span>Registration</span>
                <span>{Math.round((event.registeredParticipants / event.maxParticipants) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(event.registeredParticipants / event.maxParticipants) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleEditEvent(event)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>

              {event.status === 'cancelled' ? (
                <button
                  onClick={() => handleRestoreEvent(event)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restore
                </button>
              ) : (
                <button
                  onClick={() => handleCancelEvent(event)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Ban className="w-4 h-4" />
                  Cancel
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedEvent(event);
                  setShowParticipants(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <UserCheck className="w-4 h-4" />
                Participants
              </button>

              <button
                onClick={() => {
                  setSelectedEvent(event);
                  setShowHistory(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {editMode && editedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditMode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Edit Event</h3>
                  </div>
                  <button
                    onClick={() => setEditMode(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Event Name</label>
                    <input
                      type="text"
                      value={editedEvent.name}
                      onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Club */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Club</label>
                    <input
                      type="text"
                      value={editedEvent.club}
                      onChange={(e) => setEditedEvent({ ...editedEvent, club: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={editedEvent.date}
                      onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time
                    </label>
                    <input
                      type="text"
                      value={editedEvent.time}
                      onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })}
                      placeholder="e.g., 09:00 AM"
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Venue
                    </label>
                    <input
                      type="text"
                      value={editedEvent.venue}
                      onChange={(e) => setEditedEvent({ ...editedEvent, venue: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Budget
                    </label>
                    <input
                      type="text"
                      value={editedEvent.budget}
                      onChange={(e) => setEditedEvent({ ...editedEvent, budget: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={editedEvent.maxParticipants}
                      onChange={(e) => setEditedEvent({ ...editedEvent, maxParticipants: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={editedEvent.category}
                      onChange={(e) => setEditedEvent({ ...editedEvent, category: e.target.value })}
                      className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option>Technical</option>
                      <option>Cultural</option>
                      <option>Sports</option>
                      <option>Academic</option>
                      <option>Social</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={editedEvent.description}
                    onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Change Warning */}
                {(editedEvent.date !== selectedEvent?.date || 
                  editedEvent.time !== selectedEvent?.time || 
                  editedEvent.venue !== selectedEvent?.venue ||
                  editedEvent.name !== selectedEvent?.name) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-orange-800 mb-1">Notification Alert</h4>
                        <p className="text-sm text-orange-700">
                          You've made changes that will affect participants. All {editedEvent.registeredParticipants} registered participants will be notified automatically via their preferred channels (Email/SMS/In-App).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 p-6 rounded-b-3xl flex gap-3 justify-end">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Changes & Notify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Confirmation Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNotificationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
            >
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Send Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-slate-700 whitespace-pre-line">{notificationMessage}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800">Notification Channels:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-4 text-center">
                      <Mail className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">Email</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 text-center">
                      <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">SMS</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 text-center">
                      <Bell className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">In-App</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-b-3xl flex gap-3 justify-end">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={sendNotifications}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                  Send Notifications
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowParticipants(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-6 h-6" />
                    <div>
                      <h3 className="text-2xl font-bold">{selectedEvent.name}</h3>
                      <p className="text-sm opacity-90">{selectedEvent.registeredParticipants} Registered Participants</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {selectedEvent.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{participant.name}</h4>
                          <p className="text-sm text-slate-600">{participant.department} • {participant.role}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {participant.email}
                            </span>
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {participant.phone}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600">Registered on</p>
                          <p className="text-sm font-semibold text-slate-800">{participant.registeredOn}</p>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-600">
                            {participant.notificationPreference}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedEvent.participants.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No participant details available</p>
                      <p className="text-sm text-slate-400">{selectedEvent.registeredParticipants} participants registered</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-b-3xl flex gap-3 justify-end">
                <button
                  onClick={() => setShowParticipants(false)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change History Modal */}
      <AnimatePresence>
        {showHistory && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <History className="w-6 h-6" />
                    <div>
                      <h3 className="text-2xl font-bold">Change History</h3>
                      <p className="text-sm opacity-90">{selectedEvent.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedEvent.changeHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvent.changeHistory.map((change) => (
                      <div
                        key={change.id}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              change.changeType === 'cancel' ? 'bg-red-100' :
                              change.changeType === 'restore' ? 'bg-green-100' :
                              change.changeType === 'reschedule' ? 'bg-blue-100' :
                              'bg-purple-100'
                            }`}>
                              {change.changeType === 'cancel' && <Ban className="w-4 h-4 text-red-600" />}
                              {change.changeType === 'restore' && <RefreshCw className="w-4 h-4 text-green-600" />}
                              {change.changeType === 'reschedule' && <Calendar className="w-4 h-4 text-blue-600" />}
                              {change.changeType === 'edit' && <Edit3 className="w-4 h-4 text-purple-600" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 capitalize">{change.changeType}</h4>
                              <p className="text-xs text-slate-600">{change.timestamp}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-xs font-semibold">
                            {change.notificationsSent} notified
                          </span>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-sm text-slate-700">
                            <span className="font-semibold capitalize">{change.field}</span> changed:
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            From: <span className="font-semibold text-red-600">{change.oldValue}</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            To: <span className="font-semibold text-green-600">{change.newValue}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-2">Changed by: {change.changedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No changes recorded yet</p>
                    <p className="text-sm text-slate-400">Event details haven't been modified</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-b-3xl flex gap-3 justify-end">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
