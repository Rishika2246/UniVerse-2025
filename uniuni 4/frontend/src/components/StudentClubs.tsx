import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Trophy, Star, TrendingUp, Clock, MapPin, Heart, Share2, 
  Filter, Search, ChevronDown, CheckCircle, XCircle, Award, Target, Flame, 
  Medal, Crown, Code, Dumbbell, Music, Camera, Palette, Mic, Book, 
  MessageSquare, Bell, Download, Eye, Send, ThumbsUp, AlertCircle,
  UserPlus, UserMinus, Loader, Sparkles, Zap, BarChart3, Calendar as CalendarIcon,
  Image as ImageIcon, Video, FileText, ShieldCheck, Flag, TrendingDown,
  Navigation, Map, QrCode, Gift, Ticket, PhoneCall, Mail, Globe, Linkedin,
  Instagram, Twitter, Facebook, Youtube, PlayCircle, ExternalLink, Link2,
  Plus, Check, X, Hash, Lightbulb, BadgeCheck, Activity, PieChart, Briefcase
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface StudentClubsProps {
  user: any;
}

export function StudentClubs({ user }: StudentClubsProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-clubs' | 'events' | 'dashboard' | 'achievements'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [joinRequests, setJoinRequests] = useState<number[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([1, 3]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    skill: 'all',
    recruitment: 'all',
    activity: 'all'
  });

  // Mock data for clubs
  const allClubs = [
    {
      id: 1,
      name: 'Tech Innovators Club',
      category: 'Technology',
      domain: 'AI/ML',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      members: 450,
      reputation: 4.8,
      description: 'Innovating the future through technology and coding excellence. Join us to build amazing projects!',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      achievements: ['Won National Hackathon 2024', 'Published 5 Research Papers', 'Built 20+ Projects'],
      upcomingEvents: 3,
      skills: ['React', 'Python', 'AI/ML', 'Cloud Computing', 'Blockchain'],
      recruitmentOpen: true,
      activeMembers: 420,
      weeklyActivity: 92,
      founded: '2018',
      president: 'Rahul Sharma',
      socialLinks: { instagram: '@techinnovators', linkedin: 'tech-innovators-club' },
      events: [1, 2],
      benefits: ['Industry Mentorship', 'Project Funding', 'Internship Opportunities', 'Workshops & Bootcamps'],
      requirements: 'Basic programming knowledge',
      meetingSchedule: 'Every Saturday 4 PM',
      alumniNetwork: 150,
      industryPartners: ['Google', 'Microsoft', 'Amazon']
    },
    {
      id: 2,
      name: 'AI & Robotics Society',
      category: 'Technology',
      domain: 'Robotics',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      members: 320,
      reputation: 4.9,
      description: 'Exploring artificial intelligence, machine learning, and robotics. Build intelligent systems with us!',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      achievements: ['ICPC Regional Winners', 'Smart India Hackathon', 'Built Autonomous Robot'],
      upcomingEvents: 2,
      skills: ['TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Arduino'],
      recruitmentOpen: true,
      activeMembers: 300,
      weeklyActivity: 88,
      founded: '2019',
      president: 'Priya Patel',
      socialLinks: { instagram: '@airoboticsociety', youtube: 'AIRoboticsSociety' },
      events: [3],
      benefits: ['Research Opportunities', 'Lab Access', 'Competition Sponsorships'],
      requirements: 'Interest in AI/ML',
      meetingSchedule: 'Tuesday & Friday 5 PM',
      alumniNetwork: 120,
      industryPartners: ['NVIDIA', 'OpenAI', 'Tesla']
    },
    {
      id: 3,
      name: 'Music & Harmony Club',
      category: 'Cultural',
      domain: 'Music',
      icon: Music,
      color: 'from-pink-500 to-rose-500',
      members: 280,
      reputation: 4.7,
      description: 'Celebrate music in all its forms. From classical to contemporary, join our musical journey!',
      coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      achievements: ['State Music Competition Winners', '50+ Performances', 'Released Album'],
      upcomingEvents: 4,
      skills: ['Vocals', 'Guitar', 'Piano', 'Drums', 'Music Production'],
      recruitmentOpen: true,
      activeMembers: 260,
      weeklyActivity: 85,
      founded: '2015',
      president: 'Arjun Kapoor',
      socialLinks: { instagram: '@musicharmonyclub', youtube: 'MusicHarmonyOfficial', spotify: 'musicharmonyclub' },
      events: [4, 5],
      benefits: ['Professional Training', 'Recording Studio Access', 'Performance Opportunities'],
      requirements: 'Passion for music (beginner-friendly)',
      meetingSchedule: 'Monday, Wednesday, Friday 6 PM',
      alumniNetwork: 200,
      industryPartners: ['Spotify', 'Sony Music']
    },
    {
      id: 4,
      name: 'Photography & Visual Arts',
      category: 'Arts',
      domain: 'Photography',
      icon: Camera,
      color: 'from-orange-500 to-red-500',
      members: 250,
      reputation: 4.6,
      description: 'Capturing moments, creating visual stories. Learn professional photography and editing.',
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
      achievements: ['National Photo Contest Winners', '1000+ Photos', 'Exhibition Organized'],
      upcomingEvents: 2,
      skills: ['Photography', 'Lightroom', 'Photoshop', 'Composition', 'Portrait', 'Landscape'],
      recruitmentOpen: false,
      activeMembers: 230,
      weeklyActivity: 78,
      founded: '2017',
      president: 'Sneha Reddy',
      socialLinks: { instagram: '@photovisualarts', flickr: 'photovisualarts' },
      events: [6],
      benefits: ['Equipment Access', 'Editing Software', 'Portfolio Building', 'Exhibitions'],
      requirements: 'Own camera or smartphone',
      meetingSchedule: 'Sunday 10 AM (Photo walks)',
      alumniNetwork: 180,
      industryPartners: ['Canon', 'Nikon', 'Adobe']
    },
    {
      id: 5,
      name: 'Drama & Theatre Society',
      category: 'Cultural',
      domain: 'Theatre',
      icon: Mic,
      color: 'from-indigo-500 to-purple-500',
      members: 200,
      reputation: 4.5,
      description: 'Lights, Camera, Action! Join us for theatrical performances and drama workshops.',
      coverImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      achievements: ['20+ Stage Performances', 'Inter-College Drama Fest', 'Wrote Original Plays'],
      upcomingEvents: 1,
      skills: ['Acting', 'Direction', 'Script Writing', 'Stage Management', 'Voice Modulation'],
      recruitmentOpen: true,
      activeMembers: 180,
      weeklyActivity: 90,
      founded: '2016',
      president: 'Kabir Singh',
      socialLinks: { instagram: '@dramatheatresoc', youtube: 'DramaTheatreSociety' },
      events: [7],
      benefits: ['Acting Workshops', 'Stage Experience', 'Confidence Building'],
      requirements: 'No prior experience needed',
      meetingSchedule: 'Thursday & Saturday 5 PM',
      alumniNetwork: 150,
      industryPartners: ['National School of Drama']
    },
    {
      id: 6,
      name: 'Sports & Fitness Club',
      category: 'Sports',
      domain: 'Athletics',
      icon: Dumbbell,
      color: 'from-green-500 to-teal-500',
      members: 500,
      reputation: 4.8,
      description: 'Stay fit, stay active! Multiple sports, fitness training, and wellness programs.',
      coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      achievements: ['State Champions - Basketball', 'Marathon Organized', '500+ Active Athletes'],
      upcomingEvents: 5,
      skills: ['Basketball', 'Football', 'Cricket', 'Badminton', 'Yoga', 'Gym Training'],
      recruitmentOpen: true,
      activeMembers: 480,
      weeklyActivity: 95,
      founded: '2014',
      president: 'Vikram Chauhan',
      socialLinks: { instagram: '@sportsfitnessclub', youtube: 'SportsFitnessOfficial' },
      events: [8, 9],
      benefits: ['Coach Training', 'Equipment Access', 'Tournament Participation', 'Nutrition Guidance'],
      requirements: 'Interest in sports/fitness',
      meetingSchedule: 'Daily 6 AM & 5 PM',
      alumniNetwork: 300,
      industryPartners: ['Decathlon', 'Cult.fit']
    },
    {
      id: 7,
      name: 'Debate & Literary Society',
      category: 'Cultural',
      domain: 'Literature',
      icon: Book,
      color: 'from-yellow-500 to-orange-500',
      members: 180,
      reputation: 4.7,
      description: 'Express your thoughts, debate ideas, and explore literature. Sharpen your oratory skills!',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
      achievements: ['National Debate Champions', 'Published Magazine', 'TED-style Talks'],
      upcomingEvents: 2,
      skills: ['Public Speaking', 'Critical Thinking', 'Writing', 'Research', 'Argumentation'],
      recruitmentOpen: true,
      activeMembers: 165,
      weeklyActivity: 82,
      founded: '2017',
      president: 'Ananya Joshi',
      socialLinks: { instagram: '@debateliterarysoc', medium: 'debateliterary' },
      events: [10],
      benefits: ['MUN Opportunities', 'Writing Workshops', 'Speaker Sessions'],
      requirements: 'Good communication skills',
      meetingSchedule: 'Wednesday 4 PM',
      alumniNetwork: 140,
      industryPartners: ['Oxford', 'Cambridge']
    },
    {
      id: 8,
      name: 'Design & Innovation Hub',
      category: 'Technology',
      domain: 'Design',
      icon: Palette,
      color: 'from-rose-500 to-pink-500',
      members: 220,
      reputation: 4.6,
      description: 'Where creativity meets technology. UI/UX, graphic design, and product innovation.',
      coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
      achievements: ['Design Hackathon Winners', '100+ Design Projects', 'Industry Collaborations'],
      upcomingEvents: 3,
      skills: ['Figma', 'Adobe XD', 'Illustrator', 'UI/UX', 'Product Design', '3D Modeling'],
      recruitmentOpen: true,
      activeMembers: 200,
      weeklyActivity: 87,
      founded: '2019',
      president: 'Diya Mehta',
      socialLinks: { instagram: '@designinnovationhub', behance: 'designinnovationhub', dribbble: 'designhub' },
      events: [11],
      benefits: ['Design Tools Access', 'Portfolio Reviews', 'Client Projects', 'Workshops'],
      requirements: 'Basic design interest',
      meetingSchedule: 'Tuesday & Thursday 5 PM',
      alumniNetwork: 100,
      industryPartners: ['Adobe', 'Figma', 'InVision']
    }
  ];

  // Mock data for events
  const allEvents = [
    {
      id: 1,
      title: 'TechFest 2024 - National Hackathon',
      clubId: 1,
      clubName: 'Tech Innovators Club',
      date: '2024-12-28',
      time: '10:00 AM',
      endTime: '6:00 PM',
      venue: 'Main Auditorium',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Hackathon',
      color: 'from-blue-500 to-cyan-500',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      description: 'India\'s biggest student hackathon! Build innovative solutions, win prizes worth ₹5 Lakhs!',
      registrationDeadline: '2024-12-20',
      maxParticipants: 500,
      currentParticipants: 387,
      eligibility: 'All students',
      prizes: ['₹2L First Prize', '₹1L Second Prize', '₹50K Third Prize', 'Internship Opportunities'],
      speakers: ['Sundar Pichai (Virtual)', 'Local Tech Leaders'],
      schedule: [
        { time: '10:00 AM', activity: 'Registration & Breakfast' },
        { time: '11:00 AM', activity: 'Opening Ceremony & Problem Statements' },
        { time: '12:00 PM', activity: 'Hacking Begins' },
        { time: '1:00 PM', activity: 'Lunch Break' },
        { time: '4:00 PM', activity: 'Mentorship Session' },
        { time: '5:00 PM', activity: 'Final Presentations' },
        { time: '6:00 PM', activity: 'Prize Distribution' }
      ],
      requirements: ['Laptop', 'Team of 2-4', 'Innovation Mindset'],
      benefits: ['Certificates', 'Swag', 'Networking', 'Food & Refreshments'],
      registrationStatus: 'open',
      tags: ['Coding', 'Innovation', 'Competition', 'Prizes'],
      contactPerson: 'Rahul Sharma',
      contactEmail: 'rahul@techclub.edu',
      contactPhone: '+91 98765 43210',
      socialLinks: { instagram: '@techfest2024', twitter: 'techfest2024' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 500,
      badgeReward: 'Event Champion',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: false
    },
    {
      id: 2,
      title: 'AI/ML Workshop Series - Beginners',
      clubId: 1,
      clubName: 'Tech Innovators Club',
      date: '2024-12-22',
      time: '2:00 PM',
      endTime: '5:00 PM',
      venue: 'Lab 301',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Workshop',
      color: 'from-blue-500 to-cyan-500',
      coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
      description: 'Learn AI/ML from scratch! Hands-on workshop covering basics to advanced concepts.',
      registrationDeadline: '2024-12-20',
      maxParticipants: 100,
      currentParticipants: 76,
      eligibility: 'Beginners welcome',
      prizes: [],
      speakers: ['Dr. Amit Kumar - AI Researcher', 'Industry Expert'],
      schedule: [
        { time: '2:00 PM', activity: 'Introduction to AI/ML' },
        { time: '3:00 PM', activity: 'Hands-on Python Session' },
        { time: '4:00 PM', activity: 'Building First ML Model' },
        { time: '5:00 PM', activity: 'Q&A & Networking' }
      ],
      requirements: ['Laptop', 'Python installed', 'Basic programming knowledge'],
      benefits: ['Certificates', 'Learning Resources', 'Project Ideas'],
      registrationStatus: 'open',
      tags: ['AI', 'Machine Learning', 'Workshop', 'Beginner-Friendly'],
      contactPerson: 'Priya Patel',
      contactEmail: 'priya@techclub.edu',
      contactPhone: '+91 98765 43211',
      socialLinks: {},
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 300,
      badgeReward: 'AI Enthusiast',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: true
    },
    {
      id: 3,
      title: 'Robo Wars 2024 - Battle of Bots',
      clubId: 2,
      clubName: 'AI & Robotics Society',
      date: '2024-12-25',
      time: '11:00 AM',
      endTime: '4:00 PM',
      venue: 'Open Ground',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Competition',
      color: 'from-purple-500 to-pink-500',
      coverImage: 'https://images.unsplash.com/photo-1563207153-f403bf289096',
      description: 'Watch robots battle! Build your bot and compete for glory and prizes.',
      registrationDeadline: '2024-12-18',
      maxParticipants: 50,
      currentParticipants: 42,
      eligibility: 'Teams of 3-5',
      prizes: ['₹50K Winner', '₹25K Runner-up', 'Best Design Award'],
      speakers: [],
      schedule: [
        { time: '11:00 AM', activity: 'Bot Inspection & Registration' },
        { time: '12:00 PM', activity: 'Opening Round' },
        { time: '2:00 PM', activity: 'Semi-Finals' },
        { time: '3:30 PM', activity: 'Finals' },
        { time: '4:00 PM', activity: 'Prize Distribution' }
      ],
      requirements: ['Self-built bot', 'Weight < 15kg', 'Safety compliance'],
      benefits: ['Certificates', 'Prizes', 'Media Coverage'],
      registrationStatus: 'closing-soon',
      tags: ['Robotics', 'Competition', 'Hardware', 'Exciting'],
      contactPerson: 'Arjun Singh',
      contactEmail: 'arjun@robotics.edu',
      contactPhone: '+91 98765 43212',
      socialLinks: { youtube: 'RoboWars2024Live' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 800,
      badgeReward: 'Robo Warrior',
      liveCountdown: true,
      arPreview: true,
      recordingAvailable: true
    },
    {
      id: 4,
      title: 'Euphoria - Live Music Concert',
      clubId: 3,
      clubName: 'Music & Harmony Club',
      date: '2024-12-30',
      time: '6:00 PM',
      endTime: '9:00 PM',
      venue: 'Open Air Theatre',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Concert',
      color: 'from-pink-500 to-rose-500',
      coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      description: 'Live music night featuring campus bands and special guest performances!',
      registrationDeadline: '2024-12-28',
      maxParticipants: 1000,
      currentParticipants: 756,
      eligibility: 'All students & faculty',
      prizes: [],
      speakers: ['Local Band "Echoes"', 'DJ Night after concert'],
      schedule: [
        { time: '6:00 PM', activity: 'Gates Open' },
        { time: '6:30 PM', activity: 'Opening Act' },
        { time: '7:00 PM', activity: 'Main Performances' },
        { time: '8:30 PM', activity: 'DJ Night' },
        { time: '9:00 PM', activity: 'Event Closes' }
      ],
      requirements: ['Student ID', 'Registration confirmation'],
      benefits: ['Free Entry', 'Refreshments', 'Memorable Night'],
      registrationStatus: 'open',
      tags: ['Music', 'Concert', 'Entertainment', 'DJ'],
      contactPerson: 'Arjun Kapoor',
      contactEmail: 'arjun@musicclub.edu',
      contactPhone: '+91 98765 43213',
      socialLinks: { instagram: '@euphoria2024' },
      resources: [],
      gallery: [],
      certificates: false,
      xpReward: 200,
      badgeReward: 'Music Lover',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: true
    },
    {
      id: 5,
      title: 'Battle of Bands - Season 5',
      clubId: 3,
      clubName: 'Music & Harmony Club',
      date: '2025-01-05',
      time: '5:00 PM',
      endTime: '9:00 PM',
      venue: 'Main Auditorium',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Competition',
      color: 'from-pink-500 to-rose-500',
      coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
      description: 'Campus bands compete for the ultimate title! Register your band now.',
      registrationDeadline: '2024-12-30',
      maxParticipants: 200,
      currentParticipants: 145,
      eligibility: 'Bands of 3-6 members',
      prizes: ['₹30K Cash Prize', 'Recording Studio Time', 'Music Equipment'],
      speakers: ['Celebrity Judge Panel'],
      schedule: [
        { time: '5:00 PM', activity: 'Band Registration' },
        { time: '6:00 PM', activity: 'Prelims - 10 bands' },
        { time: '7:30 PM', activity: 'Finals - Top 3' },
        { time: '8:30 PM', activity: 'Results & Prize' },
        { time: '9:00 PM', activity: 'Jam Session' }
      ],
      requirements: ['Original/Cover songs', 'Own instruments preferred', 'Audition video'],
      benefits: ['Certificates', 'Prizes', 'Exposure', 'Networking'],
      registrationStatus: 'open',
      tags: ['Music', 'Competition', 'Band', 'Live Performance'],
      contactPerson: 'Arjun Kapoor',
      contactEmail: 'battleofbands@musicclub.edu',
      contactPhone: '+91 98765 43213',
      socialLinks: { youtube: 'BattleOfBands2024' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 600,
      badgeReward: 'Band Star',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: true
    },
    {
      id: 6,
      title: 'Photo Walk & Exhibition',
      clubId: 4,
      clubName: 'Photography & Visual Arts',
      date: '2024-12-23',
      time: '7:00 AM',
      endTime: '12:00 PM',
      venue: 'City Heritage Sites',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Photo Walk',
      color: 'from-orange-500 to-red-500',
      coverImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
      description: 'Early morning photo walk followed by exhibition of best shots!',
      registrationDeadline: '2024-12-21',
      maxParticipants: 50,
      currentParticipants: 38,
      eligibility: 'All photography enthusiasts',
      prizes: ['Best Photo Award', 'Featured Exhibition'],
      speakers: ['Professional Photographer Guide'],
      schedule: [
        { time: '7:00 AM', activity: 'Assembly Point' },
        { time: '7:30 AM', activity: 'Photo Walk Begins' },
        { time: '10:00 AM', activity: 'Return & Breakfast' },
        { time: '11:00 AM', activity: 'Photo Editing Session' },
        { time: '12:00 PM', activity: 'Quick Exhibition' }
      ],
      requirements: ['Camera/Smartphone', 'Comfortable walking shoes', 'Enthusiasm'],
      benefits: ['Certificates', 'Photography Tips', 'Portfolio Building'],
      registrationStatus: 'open',
      tags: ['Photography', 'Outdoor', 'Exhibition', 'Learning'],
      contactPerson: 'Sneha Reddy',
      contactEmail: 'sneha@photoclub.edu',
      contactPhone: '+91 98765 43214',
      socialLinks: { instagram: '@photowalk2024' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 250,
      badgeReward: 'Shutterbug',
      liveCountdown: false,
      arPreview: true,
      recordingAvailable: false
    },
    {
      id: 7,
      title: 'Annual Drama Fest - "Reflections"',
      clubId: 5,
      clubName: 'Drama & Theatre Society',
      date: '2025-01-10',
      time: '5:00 PM',
      endTime: '8:00 PM',
      venue: 'College Auditorium',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Performance',
      color: 'from-indigo-500 to-purple-500',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      description: 'Original play exploring modern social issues. A theatrical masterpiece!',
      registrationDeadline: '2025-01-08',
      maxParticipants: 300,
      currentParticipants: 178,
      eligibility: 'All students',
      prizes: [],
      speakers: ['Theatre Director from NSD'],
      schedule: [
        { time: '5:00 PM', activity: 'Entry & Seating' },
        { time: '5:30 PM', activity: 'Opening Act' },
        { time: '6:00 PM', activity: 'Main Play - Act 1' },
        { time: '7:00 PM', activity: 'Intermission' },
        { time: '7:15 PM', activity: 'Main Play - Act 2' },
        { time: '8:00 PM', activity: 'Q&A with Cast' }
      ],
      requirements: ['Student ID', 'Theater etiquette'],
      benefits: ['Free Entry', 'Cultural Experience', 'Meet the Cast'],
      registrationStatus: 'open',
      tags: ['Drama', 'Theatre', 'Performance', 'Art'],
      contactPerson: 'Kabir Singh',
      contactEmail: 'kabir@dramaclub.edu',
      contactPhone: '+91 98765 43215',
      socialLinks: { instagram: '@reflectionsdrama' },
      resources: [],
      gallery: [],
      certificates: false,
      xpReward: 150,
      badgeReward: 'Drama Enthusiast',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: true
    },
    {
      id: 8,
      title: 'Inter-College Basketball Tournament',
      clubId: 6,
      clubName: 'Sports & Fitness Club',
      date: '2024-12-27',
      time: '8:00 AM',
      endTime: '5:00 PM',
      venue: 'Basketball Courts',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Tournament',
      color: 'from-green-500 to-teal-500',
      coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
      description: 'Premier basketball tournament with 12 college teams competing!',
      registrationDeadline: '2024-12-20',
      maxParticipants: 500,
      currentParticipants: 423,
      eligibility: 'All students (spectators free)',
      prizes: ['Championship Trophy', '₹40K Prize Money', 'Individual Awards'],
      speakers: [],
      schedule: [
        { time: '8:00 AM', activity: 'Registration & Warm-up' },
        { time: '9:00 AM', activity: 'Opening Ceremony' },
        { time: '10:00 AM', activity: 'Pool Matches' },
        { time: '2:00 PM', activity: 'Semi-Finals' },
        { time: '4:00 PM', activity: 'Finals' },
        { time: '5:00 PM', activity: 'Prize Distribution' }
      ],
      requirements: ['Team registration', 'Sports wear', 'Valid ID'],
      benefits: ['Certificates', 'Prizes', 'Networking', 'Competition Experience'],
      registrationStatus: 'closing-soon',
      tags: ['Sports', 'Basketball', 'Tournament', 'Competition'],
      contactPerson: 'Vikram Chauhan',
      contactEmail: 'vikram@sportsclub.edu',
      contactPhone: '+91 98765 43216',
      socialLinks: { instagram: '@basketballtourney2024', youtube: 'BasketballLive' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 700,
      badgeReward: 'Sports Champion',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: true
    },
    {
      id: 9,
      title: 'Yoga & Wellness Week',
      clubId: 6,
      clubName: 'Sports & Fitness Club',
      date: '2025-01-02',
      time: '6:00 AM',
      endTime: '7:30 AM',
      venue: 'Open Ground',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Workshop',
      color: 'from-green-500 to-teal-500',
      coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      description: '7-day yoga and wellness program. Start your year with health and peace!',
      registrationDeadline: '2024-12-30',
      maxParticipants: 200,
      currentParticipants: 156,
      eligibility: 'All students & faculty',
      prizes: [],
      speakers: ['Certified Yoga Instructor', 'Nutritionist'],
      schedule: [
        { time: '6:00 AM', activity: 'Warm-up & Breathing' },
        { time: '6:30 AM', activity: 'Yoga Session' },
        { time: '7:00 AM', activity: 'Meditation' },
        { time: '7:15 AM', activity: 'Nutrition Talk' },
        { time: '7:30 AM', activity: 'Cool Down' }
      ],
      requirements: ['Yoga mat', 'Comfortable clothing', 'Water bottle'],
      benefits: ['Certificates', 'Wellness Tips', 'Stress Relief', 'Community'],
      registrationStatus: 'open',
      tags: ['Yoga', 'Wellness', 'Health', 'Morning'],
      contactPerson: 'Vikram Chauhan',
      contactEmail: 'wellness@sportsclub.edu',
      contactPhone: '+91 98765 43216',
      socialLinks: { instagram: '@wellnessweek2025' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 300,
      badgeReward: 'Wellness Warrior',
      liveCountdown: false,
      arPreview: false,
      recordingAvailable: false
    },
    {
      id: 10,
      title: 'Model United Nations 2025',
      clubId: 7,
      clubName: 'Debate & Literary Society',
      date: '2025-01-15',
      time: '9:00 AM',
      endTime: '6:00 PM',
      venue: 'Conference Hall',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Conference',
      color: 'from-yellow-500 to-orange-500',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      description: 'Simulate UN proceedings, debate global issues, represent countries!',
      registrationDeadline: '2025-01-10',
      maxParticipants: 150,
      currentParticipants: 98,
      eligibility: 'All students',
      prizes: ['Best Delegate', 'Best Position Paper', 'Special Mentions'],
      speakers: ['Former UN Diplomat', 'MUN Experts'],
      schedule: [
        { time: '9:00 AM', activity: 'Registration & Country Allotment' },
        { time: '10:00 AM', activity: 'Opening Ceremony' },
        { time: '11:00 AM', activity: 'Committee Session 1' },
        { time: '1:00 PM', activity: 'Lunch Break' },
        { time: '2:00 PM', activity: 'Committee Session 2' },
        { time: '4:00 PM', activity: 'Crisis Committee' },
        { time: '5:30 PM', activity: 'Closing Ceremony' }
      ],
      requirements: ['Research on country', 'Formal attire', 'Position paper'],
      benefits: ['Certificates', 'Public Speaking Skills', 'Networking', 'Leadership'],
      registrationStatus: 'open',
      tags: ['MUN', 'Debate', 'Diplomacy', 'Leadership'],
      contactPerson: 'Ananya Joshi',
      contactEmail: 'ananya@debateclub.edu',
      contactPhone: '+91 98765 43217',
      socialLinks: { twitter: '@MUN2025' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 800,
      badgeReward: 'Diplomat',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: false
    },
    {
      id: 11,
      title: 'UI/UX Design Sprint - 24hrs',
      clubId: 8,
      clubName: 'Design & Innovation Hub',
      date: '2025-01-08',
      time: '10:00 AM',
      endTime: '10:00 AM (next day)',
      venue: 'Design Lab',
      venueMap: { lat: 12.9716, lng: 77.5946 },
      category: 'Hackathon',
      color: 'from-rose-500 to-pink-500',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      description: '24-hour design challenge! Create amazing UI/UX solutions and win prizes.',
      registrationDeadline: '2025-01-05',
      maxParticipants: 100,
      currentParticipants: 67,
      eligibility: 'All designers',
      prizes: ['₹30K Prize Money', 'Design Tools Subscription', 'Internship Offers'],
      speakers: ['Senior UX Designers', 'Product Managers'],
      schedule: [
        { time: '10:00 AM', activity: 'Registration & Problem Statement' },
        { time: '11:00 AM', activity: 'Design Sprint Begins' },
        { time: '1:00 PM', activity: 'Lunch' },
        { time: '4:00 PM', activity: 'Mentorship Round 1' },
        { time: '8:00 PM', activity: 'Dinner' },
        { time: '12:00 AM', activity: 'Midnight Snacks' },
        { time: '6:00 AM', activity: 'Breakfast' },
        { time: '9:00 AM', activity: 'Final Submission' },
        { time: '10:00 AM', activity: 'Presentations & Judging' }
      ],
      requirements: ['Laptop', 'Design tools (Figma/Adobe XD)', 'Team of 2-3'],
      benefits: ['Certificates', 'Prizes', 'Portfolio Project', 'Networking'],
      registrationStatus: 'open',
      tags: ['Design', 'UI/UX', 'Hackathon', '24hrs'],
      contactPerson: 'Diya Mehta',
      contactEmail: 'diya@designhub.edu',
      contactPhone: '+91 98765 43218',
      socialLinks: { instagram: '@designsprint2025', behance: 'designsprint' },
      resources: [],
      gallery: [],
      certificates: true,
      xpReward: 1000,
      badgeReward: 'Design Master',
      liveCountdown: true,
      arPreview: false,
      recordingAvailable: false
    }
  ];

  // Student's club data
  const myClubs = [
    { clubId: 1, role: 'Member', joinedDate: '2024-09-01', status: 'approved', attendance: 18, participationScore: 85 },
    { clubId: 2, role: 'Volunteer', joinedDate: '2024-09-15', status: 'approved', attendance: 12, participationScore: 78 },
    { clubId: 8, role: 'Core Team', joinedDate: '2024-08-20', status: 'approved', attendance: 22, participationScore: 95 }
  ];

  // Student achievements
  const achievements = {
    totalXP: 4200,
    level: 12,
    badges: [
      { name: 'Event Champion', icon: Trophy, color: 'from-yellow-500 to-orange-500', earned: '2024-11-15', rarity: 'Epic' },
      { name: 'Active Member', icon: Flame, color: 'from-red-500 to-orange-500', earned: '2024-10-01', rarity: 'Rare' },
      { name: 'AI Enthusiast', icon: Target, color: 'from-purple-500 to-pink-500', earned: '2024-11-20', rarity: 'Common' },
      { name: 'Design Master', icon: Palette, color: 'from-rose-500 to-pink-500', earned: '2024-12-01', rarity: 'Legendary' },
      { name: 'Volunteer Star', icon: Star, color: 'from-cyan-500 to-blue-500', earned: '2024-10-15', rarity: 'Rare' }
    ],
    certificates: [
      { id: 1, event: 'TechFest 2024', date: '2024-11-15', downloadUrl: '#' },
      { id: 2, event: 'AI Workshop', date: '2024-11-20', downloadUrl: '#' },
      { id: 3, event: 'Design Sprint', date: '2024-12-01', downloadUrl: '#' }
    ],
    streak: 15,
    eventsAttended: 12,
    eventsWon: 3,
    skillsGained: ['React', 'Python', 'UI/UX', 'Public Speaking', 'Leadership']
  };

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Clubs', icon: Users, count: allClubs.length },
    { id: 'technology', name: 'Technology', icon: Code, count: allClubs.filter(c => c.category === 'Technology').length },
    { id: 'cultural', name: 'Cultural', icon: Music, count: allClubs.filter(c => c.category === 'Cultural').length },
    { id: 'sports', name: 'Sports', icon: Dumbbell, count: allClubs.filter(c => c.category === 'Sports').length },
    { id: 'arts', name: 'Arts', icon: Palette, count: allClubs.filter(c => c.category === 'Arts').length }
  ];

  // Filter clubs based on search and filters
  const filteredClubs = allClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category.toLowerCase() === selectedCategory;
    const matchesRecruitment = selectedFilters.recruitment === 'all' || 
                               (selectedFilters.recruitment === 'open' && club.recruitmentOpen);
    return matchesSearch && matchesCategory && matchesRecruitment;
  });

  // Get recommended clubs (mock logic - in real app, use AI/ML)
  const recommendedClubs = allClubs.filter(club => 
    !myClubs.some(mc => mc.clubId === club.id)
  ).slice(0, 3);

  // Filter events
  const upcomingEvents = allEvents.filter(event => new Date(event.date) >= new Date());
  const myEvents = allEvents.filter(event => registeredEvents.includes(event.id));

  // Handle join club
  const handleJoinClub = (clubId: number) => {
    if (joinRequests.includes(clubId)) {
      setJoinRequests(joinRequests.filter(id => id !== clubId));
    } else {
      setJoinRequests([...joinRequests, clubId]);
    }
  };

  // Handle event registration
  const handleEventRegistration = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  // Get club by ID
  const getClubById = (id: number) => allClubs.find(c => c.id === id);

  // Check if user is in club
  const isInClub = (clubId: number) => myClubs.some(mc => mc.clubId === clubId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              Clubs & Events Hub
            </h1>
            <p className="text-gray-300 text-lg">
              Discover, join, and excel in campus clubs. Build your co-curricular profile!
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Zap className="w-6 h-6 text-yellow-400" />
                {achievements.totalXP} XP
              </div>
              <p className="text-sm text-gray-300">Level {achievements.level}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Flame className="w-6 h-6 text-orange-400" />
                {achievements.streak} Days
              </div>
              <p className="text-sm text-gray-300">Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-cyan-200">
          <TabsTrigger value="discover" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger value="my-clubs" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">My Clubs</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6 mt-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clubs by name, skills, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-6 py-3 bg-white/80 backdrop-blur-xl border border-cyan-200 rounded-xl text-gray-700 hover:bg-white transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilterMenu ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recruitment Status</label>
                    <select
                      value={selectedFilters.recruitment}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, recruitment: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-cyan-200 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="all">All Clubs</option>
                      <option value="open">Recruitment Open</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
                    <select
                      value={selectedFilters.activity}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, activity: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-cyan-200 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High Activity (90%+)</option>
                      <option value="medium">Medium Activity (70-90%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Focus</label>
                    <select
                      value={selectedFilters.skill}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, skill: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-cyan-200 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="all">All Skills</option>
                      <option value="technical">Technical</option>
                      <option value="creative">Creative</option>
                      <option value="leadership">Leadership</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-xl text-gray-700 border border-cyan-200 hover:bg-white'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
                <Badge variant="secondary" className="ml-1">{cat.count}</Badge>
              </motion.button>
            ))}
          </div>

          {/* Recommended Clubs */}
          {recommendedClubs.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isInClub={isInClub(club.id)}
                    joinRequested={joinRequests.includes(club.id)}
                    onJoin={() => handleJoinClub(club.id)}
                    onView={() => {
                      setSelectedClub(club);
                      setShowClubModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Clubs Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              All Clubs ({filteredClubs.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  isInClub={isInClub(club.id)}
                  joinRequested={joinRequests.includes(club.id)}
                  onJoin={() => handleJoinClub(club.id)}
                  onView={() => {
                    setSelectedClub(club);
                    setShowClubModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* My Clubs Tab */}
        <TabsContent value="my-clubs" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {myClubs.map((membership) => {
              const club = getClubById(membership.clubId);
              if (!club) return null;
              
              return (
                <motion.div
                  key={membership.clubId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-200 hover:shadow-xl transition-all"
                >
                  <div className={`h-32 bg-gradient-to-br ${club.color} p-6 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <club.icon className="w-full h-full" />
                    </div>
                    <h3 className="text-2xl font-bold text-white z-10">{club.name}</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${club.color} text-white border-0`}>
                        {membership.role}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Since {new Date(membership.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Attendance</span>
                        <span className="font-semibold text-gray-800">{membership.attendance} events</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Participation Score</span>
                          <span className="font-semibold text-gray-800">{membership.participationScore}%</span>
                        </div>
                        <Progress value={membership.participationScore} className="h-2" />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedClub(club);
                        setShowClubModal(true);
                      }}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {myClubs.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-cyan-200">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Clubs Yet</h3>
              <p className="text-gray-600 mb-4">Join clubs to start building your co-curricular profile!</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Discover Clubs
              </button>
            </div>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6 mt-6">
          {/* My Registered Events */}
          {myEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                My Registered Events ({myEvents.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {myEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={true}
                    onRegister={() => handleEventRegistration(event.id)}
                    onView={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Upcoming Events ({upcomingEvents.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredEvents.includes(event.id)}
                  onRegister={() => handleEventRegistration(event.id)}
                  onView={() => {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <DashboardView achievements={achievements} myClubs={myClubs} allClubs={allClubs} myEvents={myEvents} />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          <AchievementsView achievements={achievements} />
        </TabsContent>
      </Tabs>

      {/* Club Detail Modal */}
      {selectedClub && (
        <ClubDetailModal
          club={selectedClub}
          isOpen={showClubModal}
          onClose={() => {
            setShowClubModal(false);
            setSelectedClub(null);
          }}
          isInClub={isInClub(selectedClub.id)}
          joinRequested={joinRequests.includes(selectedClub.id)}
          onJoin={() => handleJoinClub(selectedClub.id)}
        />
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          isRegistered={registeredEvents.includes(selectedEvent.id)}
          onRegister={() => handleEventRegistration(selectedEvent.id)}
        />
      )}
    </div>
  );
}

// Club Card Component
function ClubCard({ club, isInClub, joinRequested, onJoin, onView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-200 hover:shadow-xl transition-all"
    >
      {/* Cover Image */}
      <div className="h-40 overflow-hidden relative">
        <img
          src={club.coverImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${club.color} opacity-60`} />
        {club.recruitmentOpen && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
            <UserPlus className="w-3 h-3 mr-1" />
            Recruiting
          </Badge>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{club.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {club.domain}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center flex-shrink-0`}>
            <club.icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{club.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{club.members}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700">{club.reputation}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{club.upcomingEvents} events</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 bg-white border border-cyan-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          
          {!isInClub && (
            <button
              onClick={onJoin}
              disabled={joinRequested}
              className={`flex-1 px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                joinRequested
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
              }`}
            >
              {joinRequested ? (
                <>
                  <Clock className="w-4 h-4" />
                  Pending
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Join
                </>
              )}
            </button>
          )}
          
          {isInClub && (
            <Badge className="flex-1 bg-green-100 text-green-700 border border-green-300 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Member
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Event Card Component
function EventCard({ event, isRegistered, onRegister, onView }: any) {
  const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = event.registrationStatus === 'closing-soon';
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-200 hover:shadow-xl transition-all"
    >
      {/* Cover Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${event.color} opacity-60`} />
        
        <div className="absolute top-3 left-3">
          <Badge className={`${event.color} text-white border-0`}>
            {event.category}
          </Badge>
        </div>
        
        {isClosingSoon && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1" />
            Closing Soon
          </Badge>
        )}
        
        {event.liveCountdown && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Clock className="w-4 h-4" />
              {daysUntil} days left
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{event.clubName}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            {event.time} - {event.endTime}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-500" />
            {event.venue}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="w-4 h-4 text-gray-500" />
            {event.currentParticipants}/{event.maxParticipants} registered
            {spotsLeft <= 20 && spotsLeft > 0 && (
              <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
                {spotsLeft} spots left
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <Progress 
            value={(event.currentParticipants / event.maxParticipants) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 bg-white border border-cyan-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
          
          {!isRegistered ? (
            <button
              onClick={onRegister}
              disabled={event.currentParticipants >= event.maxParticipants}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          ) : (
            <button
              onClick={onRegister}
              className="flex-1 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-xl hover:bg-red-200 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Club Detail Modal Component
function ClubDetailModal({ club, isOpen, onClose, isInClub, joinRequested, onJoin }: any) {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10">
        <DialogHeader>
          <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
            <img
              src={club.coverImage}
              alt={club.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${club.color} opacity-70`} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <DialogTitle className="text-4xl font-bold text-white mb-2">{club.name}</DialogTitle>
              <p className="text-white/90 text-lg">{club.description}</p>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-6 pr-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{club.members}</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{club.reputation}</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{club.upcomingEvents}</div>
                <div className="text-sm text-gray-400">Events</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{club.weeklyActivity}%</div>
                <div className="text-sm text-gray-400">Activity</div>
              </div>
            </div>
            
            {/* About */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-cyan-400" />
                About
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category:</span>
                  <Badge className={`${club.color} text-white border-0`}>{club.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Domain:</span>
                  <span className="text-white">{club.domain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Founded:</span>
                  <span className="text-white">{club.founded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">President:</span>
                  <span className="text-white">{club.president}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Meeting Schedule:</span>
                  <span className="text-white">{club.meetingSchedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Requirements:</span>
                  <span className="text-white">{club.requirements}</span>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Skills You'll Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {club.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-white border-white/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {club.achievements.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Benefits */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                Member Benefits
              </h3>
              <ul className="space-y-2">
                {club.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Industry Partners */}
            {club.industryPartners && club.industryPartners.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Industry Partners
                </h3>
                <div className="flex flex-wrap gap-3">
                  {club.industryPartners.map((partner: string, index: number) => (
                    <Badge key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isInClub ? (
                <button
                  onClick={onJoin}
                  disabled={joinRequested || !club.recruitmentOpen}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    joinRequested
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                      : club.recruitmentOpen
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {joinRequested ? (
                    <>
                      <Clock className="w-5 h-5" />
                      Request Pending
                    </>
                  ) : club.recruitmentOpen ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Join Club
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Recruitment Closed
                    </>
                  )}
                </button>
              ) : (
                <Badge className="flex-1 bg-green-100 text-green-700 border-2 border-green-300 py-3 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  You're a Member
                </Badge>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Event Detail Modal Component
function EventDetailModal({ event, isOpen, onClose, isRegistered, onRegister }: any) {
  if (!isOpen) return null;
  
  const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10">
        <DialogHeader>
          <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${event.color} opacity-70`} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${event.color} text-white border-0`}>
                  {event.category}
                </Badge>
                {event.liveCountdown && (
                  <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {daysUntil} days left
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-4xl font-bold text-white mb-2">{event.title}</DialogTitle>
              <p className="text-white/90 text-lg">{event.clubName}</p>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-6 pr-4">
            {/* Event Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Date</span>
                </div>
                <p className="text-white font-semibold">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Time</span>
                </div>
                <p className="text-white font-semibold">{event.time} - {event.endTime}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-gray-400">Venue</span>
                </div>
                <p className="text-white font-semibold">{event.venue}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Participants</span>
                </div>
                <p className="text-white font-semibold">
                  {event.currentParticipants}/{event.maxParticipants}
                  {spotsLeft <= 20 && spotsLeft > 0 && (
                    <span className="text-orange-400 text-sm ml-2">({spotsLeft} spots left)</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>
            
            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Event Schedule
                </h3>
                <div className="space-y-3">
                  {event.schedule.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <Badge variant="outline" className="text-white border-white/20 whitespace-nowrap">
                        {item.time}
                      </Badge>
                      <p className="text-gray-300">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Prizes */}
            {event.prizes && event.prizes.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Prizes & Rewards
                </h3>
                <ul className="space-y-2">
                  {event.prizes.map((prize: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      {prize}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {event.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Benefits */}
            {event.benefits && event.benefits.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-400" />
                  What You'll Get
                </h3>
                <ul className="space-y-2">
                  {event.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Gamification Rewards */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Gamification Rewards
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">+{event.xpReward} XP</div>
                    <div className="text-sm text-gray-400">Experience Points</div>
                  </div>
                </div>
                
                {event.badgeReward && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{event.badgeReward}</div>
                      <div className="text-sm text-gray-400">Badge</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-green-400" />
                Contact Information
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{event.contactPerson}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${event.contactEmail}`} className="text-cyan-400 hover:underline">
                    {event.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${event.contactPhone}`} className="text-cyan-400 hover:underline">
                    {event.contactPhone}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isRegistered ? (
                <button
                  onClick={onRegister}
                  disabled={event.currentParticipants >= event.maxParticipants}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-5 h-5" />
                  Register Now
                </button>
              ) : (
                <>
                  <Badge className="flex-1 bg-green-100 text-green-700 border-2 border-green-300 py-3 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    You're Registered
                  </Badge>
                  <button
                    onClick={onRegister}
                    className="px-6 py-3 bg-red-100 text-red-700 border-2 border-red-300 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel Registration
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Dashboard View Component
function DashboardView({ achievements, myClubs, allClubs, myEvents }: any) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-400" />
            <Badge className="bg-purple-500/20 text-purple-300 border-0">Active</Badge>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{myClubs.length}</h3>
          <p className="text-gray-400">Clubs Joined</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <Badge className="bg-cyan-500/20 text-cyan-300 border-0">Upcoming</Badge>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{myEvents.length}</h3>
          <p className="text-gray-400">Events Registered</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <Badge className="bg-yellow-500/20 text-yellow-300 border-0">Level {achievements.level}</Badge>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{achievements.totalXP}</h3>
          <p className="text-gray-400">Total XP Earned</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 text-orange-400" />
            <Badge className="bg-orange-500/20 text-orange-300 border-0">On Fire!</Badge>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{achievements.streak}</h3>
          <p className="text-gray-400">Day Streak</p>
        </motion.div>
      </div>
      
      {/* Participation Timeline */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-600" />
          Participation Timeline
        </h2>
        <div className="space-y-4">
          {myClubs.map((membership: any, index: number) => {
            const club = allClubs.find((c: any) => c.id === membership.clubId);
            if (!club) return null;
            
            return (
              <motion.div
                key={membership.clubId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center flex-shrink-0`}>
                  <club.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{club.name}</h3>
                  <p className="text-sm text-gray-600">
                    {membership.role} • {membership.attendance} events attended
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{membership.participationScore}%</div>
                  <p className="text-xs text-gray-600">Participation</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Skills Gained */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Skills Gained
        </h2>
        <div className="flex flex-wrap gap-3">
          {achievements.skillsGained.map((skill: string, index: number) => (
            <Badge
              key={index}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// Achievements View Component
function AchievementsView({ achievements }: any) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-500 to-orange-500';
      case 'Epic': return 'from-purple-500 to-pink-500';
      case 'Rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Level {achievements.level}</h2>
            <p className="text-gray-300">You're doing amazing! Keep it up!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{achievements.totalXP}</div>
            <p className="text-gray-300">Total XP</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Level {achievements.level}</span>
            <span>Level {achievements.level + 1}</span>
          </div>
          <Progress value={(achievements.totalXP % 500) / 5} className="h-3" />
          <p className="text-center text-sm text-gray-400">
            {500 - (achievements.totalXP % 500)} XP until next level
          </p>
        </div>
      </div>
      
      {/* Badges */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-600" />
          Badges Earned ({achievements.badges.length})
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.badges.map((badge: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="absolute top-2 right-2">
                <Badge className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white border-0`}>
                  {badge.rarity}
                </Badge>
              </div>
              
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                <badge.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 text-center">
                Earned on {new Date(badge.earned).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Certificates */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Certificates ({achievements.certificates.length})
        </h2>
        <div className="space-y-4">
          {achievements.certificates.map((cert: any) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{cert.event}</h3>
                  <p className="text-sm text-gray-600">
                    Issued on {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Trophy className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">{achievements.eventsAttended}</h3>
          <p className="text-gray-300">Events Attended</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Medal className="w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">{achievements.eventsWon}</h3>
          <p className="text-gray-300">Competitions Won</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <Flame className="w-10 h-10 text-orange-400 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-1">{achievements.streak}</h3>
          <p className="text-gray-300">Day Streak</p>
        </div>
      </div>
    </div>
  );
}
