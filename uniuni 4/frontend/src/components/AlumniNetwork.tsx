import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, MessageCircle, Star, TrendingUp, Award, Users, MapPin, Building, 
  Search, Filter, Globe, GraduationCap, Heart, Share2, Mail, Phone, Linkedin,
  Calendar, Clock, DollarSign, BookOpen, Trophy, Target, Zap, Video, Send,
  UserPlus, CheckCircle, Gift, BarChart3, PieChart, Flame,
  Network, MessageSquare, Bell, Download, Upload, Eye, ThumbsUp, Sparkles,
  X, ExternalLink, FileText, Bookmark, AlertCircle, Info,
  Settings, ChevronRight, Plus, Briefcase as BriefcaseIcon, History,
  Edit, Save, Ban, Flag, Tag, Layers, TrendingDown, Code, Rocket
} from 'lucide-react';

interface Alumni {
  id: string;
  name: string;
  batch: string;
  company: string;
  position: string;
  location: string;
  skills: string[];
  avatar: string;
  mentorAvailable: boolean;
  rating: number;
  connections: number;
  degree: string;
  isConnected: boolean;
  isHiring?: boolean;
  isFounder?: boolean;
  careerTimeline?: { year: string; role: string; company: string }[];
  achievements?: string[];
  bio?: string;
  email?: string;
  linkedin?: string;
  mentorshipTypes?: string[];
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Part-time';
  duration: string;
  stipend: string;
  postedBy: string;
  applicants: number;
  deadline: string;
  color: string;
  skills: string[];
  description?: string;
  referralAvailable?: boolean;
  applicationStatus?: 'not-applied' | 'applied' | 'reviewing' | 'accepted' | 'rejected';
}

interface MentorshipSession {
  id: string;
  mentor: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  participants: number;
  type: 'career' | 'interview' | 'higher-studies' | 'general';
  rating?: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
  organizer: string;
  image: string;
  registered?: boolean;
  description?: string;
  speakers?: string[];
}

interface AlumniGroup {
  id: string;
  name: string;
  members: number;
  category: string;
  description: string;
  isJoined: boolean;
  activity: string;
  announcements?: number;
}

interface Message {
  id: string;
  from: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

export function AlumniNetwork({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'directory' | 'connections' | 'jobs' | 'mentorship' | 'events' | 'stories' | 'groups' | 'giving'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<Alumni | null>(null);
  const [showMentorshipRequestModal, setShowMentorshipRequestModal] = useState(false);
  const [mentorshipRequestFor, setMentorshipRequestFor] = useState<Alumni | null>(null);
  const [notifications, setNotifications] = useState(3);

  // Mock data with comprehensive details
  const alumni: Alumni[] = [
    {
      id: '1',
      name: 'Dr. Ananya Sharma',
      batch: '2015',
      company: 'Google',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      skills: ['Machine Learning', 'Cloud Computing', 'Python', 'TensorFlow', 'Leadership'],
      avatar: 'AS',
      mentorAvailable: true,
      rating: 4.9,
      connections: 234,
      degree: 'B.Tech Computer Science',
      isConnected: false,
      isHiring: true,
      bio: 'Passionate about AI/ML and helping students break into tech. 8+ years at Google working on cutting-edge ML systems.',
      email: 'ananya.sharma@alumni.universe.edu',
      linkedin: 'linkedin.com/in/ananyasharma',
      mentorshipTypes: ['Career guidance', 'Interview prep', 'ML/AI mentorship'],
      careerTimeline: [
        { year: '2015', role: 'Software Engineer', company: 'Startup Inc' },
        { year: '2017', role: 'ML Engineer', company: 'TechCorp' },
        { year: '2019', role: 'Senior SWE', company: 'Google' }
      ],
      achievements: [
        'Published 5 papers in top ML conferences',
        'Led team of 12 engineers',
        'Google Star Performer Award 2022'
      ]
    },
    {
      id: '2',
      name: 'Rajesh Patel',
      batch: '2017',
      company: 'Microsoft',
      position: 'Product Manager',
      location: 'Seattle, WA',
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership', 'UX'],
      avatar: 'RP',
      mentorAvailable: true,
      rating: 4.8,
      connections: 456,
      degree: 'B.Tech Electronics',
      isConnected: true,
      bio: 'Product leader focused on building products that matter. Love mentoring aspiring PMs!',
      email: 'rajesh.patel@alumni.universe.edu',
      linkedin: 'linkedin.com/in/rajeshpatel',
      mentorshipTypes: ['Product management', 'Career transition', 'Leadership'],
      careerTimeline: [
        { year: '2017', role: 'Associate PM', company: 'Amazon' },
        { year: '2019', role: 'PM', company: 'Microsoft' },
        { year: '2022', role: 'Senior PM', company: 'Microsoft' }
      ],
      achievements: [
        'Launched 3 major products',
        'PM of the Year 2021'
      ]
    },
    {
      id: '3',
      name: 'Priya Iyer',
      batch: '2016',
      company: 'Amazon',
      position: 'Tech Lead',
      location: 'Austin, TX',
      skills: ['AWS', 'DevOps', 'System Design', 'Kubernetes', 'Python'],
      avatar: 'PI',
      mentorAvailable: false,
      rating: 4.7,
      connections: 189,
      degree: 'M.Tech AI',
      isConnected: false,
      bio: 'Building scalable cloud infrastructure. Currently not available for mentorship.',
      email: 'priya.iyer@alumni.universe.edu',
      careerTimeline: [
        { year: '2016', role: 'DevOps Engineer', company: 'Startup' },
        { year: '2018', role: 'Senior DevOps', company: 'Amazon' },
        { year: '2021', role: 'Tech Lead', company: 'Amazon' }
      ]
    },
    {
      id: '4',
      name: 'Vikram Malhotra',
      batch: '2018',
      company: 'Meta',
      position: 'Data Scientist',
      location: 'Menlo Park, CA',
      skills: ['Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Statistics'],
      avatar: 'VM',
      mentorAvailable: true,
      rating: 4.9,
      connections: 312,
      degree: 'B.Tech CS',
      isConnected: true,
      isFounder: true,
      bio: 'Data Scientist at Meta. Founded my own AI startup on weekends. Happy to help with DS/ML careers!',
      email: 'vikram.m@alumni.universe.edu',
      linkedin: 'linkedin.com/in/vikramm',
      mentorshipTypes: ['Data science', 'Startups', 'ML/AI'],
      careerTimeline: [
        { year: '2018', role: 'Data Analyst', company: 'Analytics Co' },
        { year: '2020', role: 'Data Scientist', company: 'Meta' }
      ],
      achievements: [
        'Founded AI startup valued at $2M',
        'Published research at NeurIPS'
      ]
    },
    {
      id: '5',
      name: 'Sneha Reddy',
      batch: '2019',
      company: 'Tesla',
      position: 'Robotics Engineer',
      location: 'Palo Alto, CA',
      skills: ['Robotics', 'Computer Vision', 'ROS', 'C++', 'Python'],
      avatar: 'SR',
      mentorAvailable: true,
      rating: 4.8,
      connections: 167,
      degree: 'B.Tech Mechanical',
      isConnected: false,
      bio: 'Working on autonomous robotics at Tesla. Passionate about getting more women into robotics!',
      email: 'sneha.reddy@alumni.universe.edu',
      mentorshipTypes: ['Robotics', 'Career guidance', 'Women in tech'],
      careerTimeline: [
        { year: '2019', role: 'Robotics Intern', company: 'Boston Dynamics' },
        { year: '2020', role: 'Robotics Engineer', company: 'Tesla' }
      ]
    },
    {
      id: '6',
      name: 'Arjun Nair',
      batch: '2014',
      company: 'Apple',
      position: 'Engineering Manager',
      location: 'Cupertino, CA',
      skills: ['iOS', 'Swift', 'Team Leadership', 'Architecture', 'Product'],
      avatar: 'AN',
      mentorAvailable: true,
      rating: 5.0,
      connections: 523,
      degree: 'B.Tech CS',
      isConnected: true,
      isHiring: true,
      bio: '10+ years in tech. Leading iOS teams at Apple. Always looking for talented engineers!',
      email: 'arjun.nair@alumni.universe.edu',
      linkedin: 'linkedin.com/in/arjunnair',
      mentorshipTypes: ['iOS development', 'Leadership', 'Career growth'],
      careerTimeline: [
        { year: '2014', role: 'iOS Developer', company: 'Startup' },
        { year: '2016', role: 'Senior iOS Dev', company: 'Facebook' },
        { year: '2019', role: 'Engineering Manager', company: 'Apple' }
      ],
      achievements: [
        'Shipped 10+ iOS apps',
        'Manager of the Year 2023',
        'Mentored 50+ engineers'
      ]
    },
  ];

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Full Stack Developer Internship',
      company: 'Tech Startup Inc.',
      location: 'Remote',
      type: 'Internship',
      duration: '3 months',
      stipend: '$2000/month',
      postedBy: 'Ananya Sharma',
      applicants: 45,
      deadline: '2025-01-15',
      color: 'from-blue-500 to-cyan-500',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      description: 'Join our fast-growing startup building the next-gen SaaS platform. Work with cutting-edge tech and learn from experienced engineers.',
      referralAvailable: true,
      applicationStatus: 'not-applied'
    },
    {
      id: '2',
      title: 'ML Engineer - Entry Level',
      company: 'AI Solutions Corp',
      location: 'New York, NY',
      type: 'Full-time',
      duration: 'Permanent',
      stipend: '$95k/year',
      postedBy: 'Rajesh Patel',
      applicants: 78,
      deadline: '2025-01-20',
      color: 'from-purple-500 to-pink-500',
      skills: ['Python', 'PyTorch', 'ML Ops', 'AWS'],
      description: 'Build ML models that power our AI products. Great mentorship and growth opportunities.',
      referralAvailable: true,
      applicationStatus: 'not-applied'
    },
    {
      id: '3',
      title: 'Research Assistant',
      company: 'University Research Lab',
      location: 'Boston, MA',
      type: 'Part-time',
      duration: '6 months',
      stipend: '$25/hour',
      postedBy: 'Priya Iyer',
      applicants: 23,
      deadline: '2024-12-30',
      color: 'from-green-500 to-teal-500',
      skills: ['Research', 'Python', 'Data Analysis'],
      description: 'Work on cutting-edge research in computer vision and deep learning.',
      referralAvailable: false,
      applicationStatus: 'not-applied'
    },
    {
      id: '4',
      title: 'Product Designer',
      company: 'Design Studio XYZ',
      location: 'San Francisco, CA',
      type: 'Full-time',
      duration: 'Permanent',
      stipend: '$105k/year',
      postedBy: 'Vikram Malhotra',
      applicants: 34,
      deadline: '2025-01-25',
      color: 'from-orange-500 to-red-500',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
      description: 'Create beautiful and functional designs for our growing product suite.',
      referralAvailable: true,
      applicationStatus: 'not-applied'
    },
    {
      id: '5',
      title: 'iOS Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Full-time',
      duration: 'Permanent',
      stipend: '$120k/year',
      postedBy: 'Arjun Nair',
      applicants: 156,
      deadline: '2025-02-01',
      color: 'from-indigo-500 to-purple-500',
      skills: ['Swift', 'SwiftUI', 'iOS SDK', 'Architecture'],
      description: 'Join the team building the future of iOS. Work on products used by billions.',
      referralAvailable: true,
      applicationStatus: 'not-applied'
    },
  ];

  const mentorshipSessions: MentorshipSession[] = [
    {
      id: '1',
      mentor: 'Dr. Ananya Sharma',
      topic: 'Career Path in AI/ML',
      date: '2025-01-15',
      time: '6:00 PM',
      duration: '1 hour',
      status: 'upcoming',
      participants: 12,
      type: 'career'
    },
    {
      id: '2',
      mentor: 'Rajesh Patel',
      topic: 'Product Management 101',
      date: '2024-12-20',
      time: '7:00 PM',
      duration: '1 hour',
      status: 'completed',
      participants: 15,
      type: 'career',
      rating: 4.9
    },
    {
      id: '3',
      mentor: 'Arjun Nair',
      topic: 'Building Your Tech Career',
      date: '2025-01-10',
      time: '5:30 PM',
      duration: '1.5 hours',
      status: 'upcoming',
      participants: 20,
      type: 'career'
    },
    {
      id: '4',
      mentor: 'Vikram Malhotra',
      topic: 'Breaking into Data Science',
      date: '2025-01-12',
      time: '4:00 PM',
      duration: '1 hour',
      status: 'upcoming',
      participants: 18,
      type: 'career'
    },
  ];

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Annual Alumni Reunion 2025',
      date: '2025-03-15',
      time: '10:00 AM',
      location: 'University Campus, Main Auditorium',
      attendees: 450,
      type: 'Reunion',
      organizer: 'Alumni Association',
      image: '🎓',
      registered: false,
      description: 'Reconnect with your batchmates, network with alumni across batches, and relive your college memories!',
      speakers: ['Dr. Ananya Sharma', 'Arjun Nair']
    },
    {
      id: '2',
      title: 'Tech Talk: Future of AI',
      date: '2025-01-20',
      time: '4:00 PM',
      location: 'Virtual Event',
      attendees: 234,
      type: 'Webinar',
      organizer: 'Tech Alumni Group',
      image: '💻',
      registered: true,
      description: 'Expert panel discussion on the latest trends in AI and ML with industry leaders.',
      speakers: ['Dr. Ananya Sharma', 'Vikram Malhotra']
    },
    {
      id: '3',
      title: 'Networking Mixer - Bay Area',
      date: '2025-01-25',
      time: '6:00 PM',
      location: 'San Francisco, CA',
      attendees: 89,
      type: 'Networking',
      organizer: 'Bay Area Chapter',
      image: '🤝',
      registered: false,
      description: 'Casual networking event for alumni in the Bay Area. Great food, drinks, and conversations!'
    },
    {
      id: '4',
      title: 'Career Fair 2025',
      date: '2025-02-10',
      time: '9:00 AM',
      location: 'University Campus',
      attendees: 678,
      type: 'Career',
      organizer: 'Placement Cell',
      image: '💼',
      registered: true,
      description: 'Meet recruiters from top companies. Exclusive opportunities for UniVerse students!'
    },
  ];

  const successStories = [
    {
      id: '1',
      alumni: 'Ananya Sharma',
      batch: '2015',
      title: 'From Campus to Google: My Journey',
      excerpt: 'Starting from a small town, I never imagined I would be working at Google. Here\'s how UniVerse prepared me for success in Silicon Valley...',
      likes: 234,
      comments: 45,
      image: 'AS',
      category: 'Career Success',
      readTime: '5 min read',
      publishedDate: '2024-12-01'
    },
    {
      id: '2',
      alumni: 'Vikram Malhotra',
      batch: '2018',
      title: 'Building My Own Startup',
      excerpt: 'After 3 years at Meta, I took the leap to start my own AI company. The entrepreneurship lessons from university helped me navigate this journey...',
      likes: 189,
      comments: 67,
      image: 'VM',
      category: 'Entrepreneurship',
      readTime: '7 min read',
      publishedDate: '2024-11-20'
    },
    {
      id: '3',
      alumni: 'Sneha Reddy',
      batch: '2019',
      title: 'Breaking into Robotics at Tesla',
      excerpt: 'As one of the few women in robotics, my journey was challenging but rewarding. Here\'s my story of perseverance and passion...',
      likes: 312,
      comments: 89,
      image: 'SR',
      category: 'Inspiration',
      readTime: '6 min read',
      publishedDate: '2024-12-10'
    },
    {
      id: '4',
      alumni: 'Arjun Nair',
      batch: '2014',
      title: 'Leading Teams at Apple',
      excerpt: 'From individual contributor to engineering manager - lessons I learned about leadership, growth, and building great products...',
      likes: 267,
      comments: 52,
      image: 'AN',
      category: 'Leadership',
      readTime: '8 min read',
      publishedDate: '2024-11-15'
    },
  ];

  const alumniGroups: AlumniGroup[] = [
    {
      id: '1',
      name: 'Tech Alumni Network',
      members: 456,
      category: 'Industry',
      description: 'Connect with alumni working in tech industry - FAANG, startups, and everything in between',
      isJoined: true,
      activity: 'Very Active',
      announcements: 5
    },
    {
      id: '2',
      name: 'Bay Area Chapter',
      members: 234,
      category: 'Location',
      description: 'Alumni based in San Francisco Bay Area - monthly meetups and networking events',
      isJoined: false,
      activity: 'Active',
      announcements: 2
    },
    {
      id: '3',
      name: 'Entrepreneurs Club',
      members: 178,
      category: 'Interest',
      description: 'For alumni running their own businesses or aspiring to start one',
      isJoined: true,
      activity: 'Moderate',
      announcements: 3
    },
    {
      id: '4',
      name: 'Class of 2015',
      members: 345,
      category: 'Batch',
      description: 'Reconnect with your batchmates from Class of 2015',
      isJoined: false,
      activity: 'Active',
      announcements: 1
    },
    {
      id: '5',
      name: 'AI/ML Professionals',
      members: 289,
      category: 'Domain',
      description: 'Share insights, job opportunities, and collaborate on AI/ML projects',
      isJoined: true,
      activity: 'Very Active',
      announcements: 7
    },
    {
      id: '6',
      name: 'Product Managers',
      members: 156,
      category: 'Role',
      description: 'PM-specific discussions, resources, and job opportunities',
      isJoined: false,
      activity: 'Moderate',
      announcements: 2
    },
  ];

  const givingOpportunities = [
    {
      id: '1',
      title: 'Scholarship Fund',
      description: 'Support underprivileged students pursue their dreams through education',
      raised: 125000,
      goal: 200000,
      contributors: 89,
      category: 'Education',
      impact: '45 students supported this year'
    },
    {
      id: '2',
      title: 'Infrastructure Development',
      description: 'New library and state-of-the-art lab construction',
      raised: 450000,
      goal: 1000000,
      contributors: 234,
      category: 'Infrastructure',
      impact: 'New library wing opening soon'
    },
    {
      id: '3',
      title: 'Research Grants',
      description: 'Fund innovative student research projects across departments',
      raised: 75000,
      goal: 150000,
      contributors: 45,
      category: 'Research',
      impact: '12 projects funded'
    },
    {
      id: '4',
      title: 'Entrepreneurship Fund',
      description: 'Seed funding for student startups and innovation projects',
      raised: 180000,
      goal: 300000,
      contributors: 67,
      category: 'Innovation',
      impact: '8 startups launched'
    },
  ];

  const messages: Message[] = [
    { id: '1', from: 'Rajesh Patel', message: 'Hey! Would love to chat about PM opportunities...', timestamp: '2 hours ago', unread: true },
    { id: '2', from: 'Arjun Nair', message: 'Thanks for connecting! Happy to help with your career questions.', timestamp: '1 day ago', unread: false },
    { id: '3', from: 'Vikram Malhotra', message: 'The mentorship session was great. Let me know if you need more guidance!', timestamp: '3 days ago', unread: true },
  ];

  // Filtered alumni based on search and filters
  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = searchQuery === '' || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'mentors' && person.mentorAvailable) ||
      (selectedFilter === 'connected' && person.isConnected) ||
      (selectedFilter === 'hiring' && person.isHiring);
    
    const matchesBatch = selectedBatch === 'all' || person.batch === selectedBatch;
    const matchesCompany = selectedCompany === 'all' || person.company === selectedCompany;
    const matchesLocation = selectedLocation === 'all' || person.location.includes(selectedLocation);
    const matchesSkill = selectedSkill === 'all' || person.skills.includes(selectedSkill);

    return matchesSearch && matchesFilter && matchesBatch && matchesCompany && matchesLocation && matchesSkill;
  });

  const myConnections = alumni.filter(a => a.isConnected);

  // Get unique values for filters
  const batches = ['all', ...Array.from(new Set(alumni.map(a => a.batch)))];
  const companies = ['all', ...Array.from(new Set(alumni.map(a => a.company)))];
  const locations = ['all', ...Array.from(new Set(alumni.map(a => a.location.split(',')[0].trim())))];
  const allSkills = ['all', ...Array.from(new Set(alumni.flatMap(a => a.skills)))];

  const handleConnect = (alumniId: string) => {
    // In real app, this would call an API
    console.log('Connecting with alumni:', alumniId);
  };

  const handleMessage = (alumni: Alumni) => {
    setMessageRecipient(alumni);
    setShowMessageModal(true);
  };

  const handleRequestMentorship = (alumni: Alumni) => {
    setMentorshipRequestFor(alumni);
    setShowMentorshipRequestModal(true);
  };

  const handleApplyJob = (jobId: string) => {
    console.log('Applying to job:', jobId);
  };

  const handleRegisterEvent = (eventId: string) => {
    console.log('Registering for event:', eventId);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
  };

  const handleDonate = (fundId: string, amount: number) => {
    console.log('Donating to fund:', fundId, 'Amount:', amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2">Alumni Network</h2>
            <p className="text-cyan-200">Connect, Learn, and Grow Together</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border border-cyan-200/20 transition-colors relative"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5 text-cyan-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{notifications}</span>
                </span>
              )}
            </button>
            <button 
              className="p-2 rounded-xl bg-cyan-100/10 hover:bg-cyan-100/20 border border-cyan-200/20 transition-colors relative"
              onClick={() => setShowMessageModal(true)}
            >
              <MessageSquare className="w-5 h-5 text-cyan-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-400/30 transition-all flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Alumni
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-100/10 to-cyan-100/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200/20"
        >
          <Users className="w-8 h-8 text-cyan-300 mb-4" />
          <h3 className="text-white mb-1">2,340</h3>
          <p className="text-cyan-200 text-sm">Total Alumni</p>
          <div className="mt-2 flex items-center gap-1 text-green-300 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+12% this year</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-100/10 to-pink-100/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/20"
        >
          <Network className="w-8 h-8 text-purple-300 mb-4" />
          <h3 className="text-white mb-1">{myConnections.length}</h3>
          <p className="text-purple-200 text-sm">Your Connections</p>
          <div className="mt-2 flex items-center gap-1 text-cyan-300 text-xs">
            <UserPlus className="w-3 h-3" />
            <span>3 new this week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-100/10 to-teal-100/10 backdrop-blur-xl rounded-2xl p-6 border border-green-200/20"
        >
          <Briefcase className="w-8 h-8 text-green-300 mb-4" />
          <h3 className="text-white mb-1">{jobs.length}</h3>
          <p className="text-green-200 text-sm">Job Openings</p>
          <div className="mt-2 flex items-center gap-1 text-orange-300 text-xs">
            <Zap className="w-3 h-3" />
            <span>3 new today</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-100/10 to-amber-100/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-200/20"
        >
          <Star className="w-8 h-8 text-orange-300 mb-4" />
          <h3 className="text-white mb-1">{alumni.filter(a => a.mentorAvailable).length}</h3>
          <p className="text-orange-200 text-sm">Active Mentors</p>
          <div className="mt-2 flex items-center gap-1 text-purple-300 text-xs">
            <Trophy className="w-3 h-3" />
            <span>Top rated</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-pink-100/10 to-rose-100/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20"
        >
          <Calendar className="w-8 h-8 text-pink-300 mb-4" />
          <h3 className="text-white mb-1">{upcomingEvents.length}</h3>
          <p className="text-pink-200 text-sm">Upcoming Events</p>
          <div className="mt-2 flex items-center gap-1 text-yellow-300 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>Reunion soon</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-100/10 to-blue-100/10 backdrop-blur-xl rounded-2xl p-6 border border-indigo-200/20"
        >
          <Heart className="w-8 h-8 text-red-300 mb-4" />
          <h3 className="text-white mb-1">$820K</h3>
          <p className="text-indigo-200 text-sm">Total Giving</p>
          <div className="mt-2 flex items-center gap-1 text-green-300 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+15% YoY</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 backdrop-blur-xl rounded-3xl border border-cyan-200/20 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-cyan-200/20 scrollbar-hide">
          {[
            { id: 'directory', label: 'Alumni Directory', icon: Users },
            { id: 'connections', label: 'My Connections', icon: Network },
            { id: 'mentorship', label: 'Mentorship', icon: Star },
            { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase },
            { id: 'events', label: 'Events & Talks', icon: Calendar },
            { id: 'groups', label: 'Groups & Chapters', icon: Users },
            { id: 'stories', label: 'Success Stories', icon: Trophy },
            { id: 'giving', label: 'Give Back', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 py-4 px-6 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg shadow-cyan-400/20'
                  : 'text-cyan-200 hover:text-white hover:bg-cyan-100/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Alumni Directory Tab */}
          {activeTab === 'directory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, company, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-3 bg-cyan-100/10 border border-cyan-200/20 rounded-xl text-white focus:border-cyan-400/60 focus:outline-none"
                    >
                      <option value="all">All Alumni</option>
                      <option value="mentors">Available Mentors</option>
                      <option value="connected">My Connections</option>
                      <option value="hiring">Currently Hiring</option>
                    </select>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-3 border rounded-xl transition-colors ${
                        showFilters ? 'bg-cyan-400 text-white border-cyan-300/40' : 'bg-cyan-100/10 hover:bg-cyan-100/20 text-cyan-300 border-cyan-200/20'
                      }`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-cyan-100/10 rounded-xl border border-cyan-200/20"
                    >
                      <div>
                        <label className="block text-sm text-cyan-200 mb-2">Batch</label>
                        <select
                          value={selectedBatch}
                          onChange={(e) => setSelectedBatch(e.target.value)}
                          className="w-full px-3 py-2 bg-cyan-100/10 border border-cyan-200/20 rounded-lg text-white text-sm focus:border-cyan-400/60 focus:outline-none"
                        >
                          {batches.map(batch => (
                            <option key={batch} value={batch}>{batch === 'all' ? 'All Batches' : `Batch ${batch}`}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Company</label>
                        <select
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                        >
                          {companies.map(company => (
                            <option key={company} value={company}>{company === 'all' ? 'All Companies' : company}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Location</label>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                        >
                          {locations.map(location => (
                            <option key={location} value={location}>{location === 'all' ? 'All Locations' : location}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Skills</label>
                        <select
                          value={selectedSkill}
                          onChange={(e) => setSelectedSkill(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                        >
                          {allSkills.slice(0, 20).map(skill => (
                            <option key={skill} value={skill}>{skill === 'all' ? 'All Skills' : skill}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick skill chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400">Popular skills:</span>
                  {['Machine Learning', 'Product Strategy', 'DevOps', 'iOS', 'Robotics'].map(skill => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        selectedSkill === skill
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                  {selectedSkill !== 'all' && (
                    <button
                      onClick={() => setSelectedSkill('all')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs hover:bg-red-500/30 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  Showing {filteredAlumni.length} {filteredAlumni.length === 1 ? 'alumni' : 'alumni'}
                </p>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  Save search
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Alumni Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAlumni.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 hover:from-cyan-100/15 hover:to-blue-100/15 rounded-2xl p-6 border border-cyan-200/20 hover:border-cyan-300/40 transition-all group cursor-pointer backdrop-blur-xl"
                    onClick={() => setSelectedAlumni(person)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {person.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white mb-1 truncate flex items-center gap-2">
                              {person.name}
                              {person.isHiring && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                  Hiring
                                </span>
                              )}
                              {person.isFounder && (
                                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                  Founder
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-400">Batch of {person.batch} • {person.degree}</p>
                          </div>
                          {person.mentorAvailable && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold whitespace-nowrap ml-2">
                              <Star className="w-3 h-3 inline mr-1" />
                              Mentor
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-white font-semibold truncate">{person.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span className="text-gray-300 truncate">{person.position}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <span className="text-gray-300 truncate">{person.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {person.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {person.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{person.skills.length - 3} more</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {person.isConnected ? (
                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 text-green-400 rounded-xl transition-all flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Connected
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(person.id);
                              }}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              Connect
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessage(person);
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-1 px-3 py-2 bg-white/5 rounded-xl">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm font-semibold">{person.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredAlumni.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white mb-2">No alumni found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}

          {/* My Connections Tab */}
          {activeTab === 'connections' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">My Connections</h3>
                  <p className="text-sm text-gray-400">You're connected with {myConnections.length} alumni</p>
                </div>
                <button 
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Find More Alumni
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {myConnections.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 text-center hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setSelectedAlumni(person)}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                      {person.avatar}
                    </div>
                    <h4 className="text-white mb-1">{person.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{person.position}</p>
                    <p className="text-xs text-purple-400 mb-4">{person.company}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessage(person);
                        }}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlumni(person);
                        }}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent messages */}
              <div className="bg-gradient-to-br from-cyan-50/10 to-blue-50/10 rounded-2xl p-6 border border-cyan-200/20 backdrop-blur-xl">
                <h4 className="text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-300" />
                  Recent Messages
                </h4>
                <div className="space-y-3">
                  {messages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        msg.unread 
                          ? 'bg-purple-500/10 border-purple-500/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{msg.from}</h5>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Mentorship Tab */}
          {activeTab === 'mentorship' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Mentorship Program</h3>
                  <p className="text-sm text-gray-400">Learn from experienced alumni in your field</p>
                </div>
                <button 
                  onClick={() => setShowMentorshipRequestModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Request Mentorship
                </button>
              </div>

              {/* Mentorship types */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: Briefcase, label: 'Career Guidance', count: 34, color: 'from-blue-500/20 to-cyan-500/20' },
                  { icon: Code, label: 'Interview Prep', count: 28, color: 'from-purple-500/20 to-pink-500/20' },
                  { icon: GraduationCap, label: 'Higher Studies', count: 19, color: 'from-green-500/20 to-teal-500/20' },
                  { icon: Rocket, label: 'Startup Guidance', count: 15, color: 'from-orange-500/20 to-red-500/20' },
                ].map((type, index) => (
                  <motion.div
                    key={type.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${type.color} backdrop-blur-xl rounded-2xl p-6 border border-cyan-200/20 cursor-pointer hover:scale-105 transition-transform`}
                  >
                    <type.icon className="w-8 h-8 text-white mb-3" />
                    <h4 className="text-white mb-1">{type.label}</h4>
                    <p className="text-cyan-200 text-sm">{type.count} mentors</p>
                  </motion.div>
                ))}
              </div>

              {/* Available mentors */}
              <div>
                <h4 className="text-white mb-4">Available Mentors</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {alumni.filter(a => a.mentorAvailable).map((mentor, index) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {mentor.avatar}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-semibold mb-1">{mentor.name}</h5>
                          <p className="text-sm text-gray-400 mb-1">{mentor.position}</p>
                          <p className="text-xs text-purple-400">{mentor.company}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-sm">{mentor.rating}</span>
                        </div>
                      </div>
                      
                      {mentor.mentorshipTypes && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 mb-2">Specializes in:</p>
                          <div className="flex flex-wrap gap-2">
                            {mentor.mentorshipTypes.map((type, i) => (
                              <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleRequestMentorship(mentor)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Request Mentorship
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Upcoming sessions */}
              <div>
                <h4 className="text-white mb-4">Mentorship Sessions</h4>
                <div className="space-y-4">
                  {mentorshipSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border ${
                        session.status === 'upcoming'
                          ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white">{session.topic}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              session.status === 'upcoming'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <p className="text-gray-400">with {session.mentor}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-white text-sm">{session.participants}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-300 mb-4">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-400" />
                          {session.duration}
                        </span>
                      </div>

                      {session.status === 'upcoming' ? (
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Video className="w-4 h-4" />
                            Join Session
                          </button>
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                            Reschedule
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Recording
                          </button>
                          {session.rating && (
                            <div className="flex items-center gap-1 px-4 py-2 bg-white/10 rounded-xl">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-white text-sm">{session.rating}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Jobs & Internships Tab */}
          {activeTab === 'jobs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Job Opportunities</h3>
                  <p className="text-sm text-gray-400">Exclusive opportunities from alumni • {jobs.length} active postings</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Post a Job
                </button>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {['All', 'Internship', 'Full-time', 'Part-time', 'Referral Available'].map(filter => (
                  <button
                    key={filter}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden bg-gradient-to-br ${job.color} bg-opacity-10 rounded-2xl p-6 border border-white/10 hover:scale-[1.02] transition-transform cursor-pointer`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-white">{job.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.type === 'Internship' ? 'bg-blue-500/20 text-blue-400' :
                            job.type === 'Full-time' ? 'bg-green-500/20 text-green-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {job.type}
                          </span>
                          {job.referralAvailable && (
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
                              Referral Available
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 font-semibold mb-1">{job.company}</p>
                        <p className="text-sm text-gray-400">Posted by {job.postedBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="text-white font-semibold text-sm">{job.location}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                        <p className="text-white font-semibold text-sm">{job.duration}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Compensation</p>
                        <p className="text-white font-semibold text-sm">{job.stipend}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Applicants</p>
                        <p className="text-white font-semibold text-sm">{job.applicants}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        {job.referralAvailable && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Request referral');
                            }}
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl transition-colors"
                          >
                            Request Referral
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyJob(job.id);
                          }}
                          className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Events & Talks Tab */}
          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Events & Talks</h3>
                  <p className="text-sm text-gray-400">Connect and learn from alumni through various events</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{event.image}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-white mb-1">{event.title}</h4>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                              {event.type}
                            </span>
                          </div>
                          {event.registered && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">by {event.organizer}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-300">{event.attendees} attendees</span>
                      </div>
                    </div>

                    {event.speakers && event.speakers.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Speakers:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.speakers.map((speaker, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {event.registered ? (
                        <button className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl transition-all flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Registered
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegisterEvent(event.id);
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          Register Now
                        </button>
                      )}
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Groups & Chapters Tab */}
          {activeTab === 'groups' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Groups & Chapters</h3>
                  <p className="text-sm text-gray-400">Join communities of like-minded alumni</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group
                </button>
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {['All', 'Industry', 'Location', 'Batch', 'Domain', 'Role'].map(category => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {alumniGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-white mb-1">{group.name}</h4>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                          {group.category}
                        </span>
                      </div>
                      {group.isJoined && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{group.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Members</p>
                        <p className="text-white font-semibold">{group.members}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Activity</p>
                        <p className="text-white font-semibold text-sm">{group.activity}</p>
                      </div>
                    </div>

                    {group.announcements && group.announcements > 0 && (
                      <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-400">
                          <Bell className="w-3 h-3 inline mr-1" />
                          {group.announcements} new announcement{group.announcements > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className={`w-full px-4 py-2 rounded-xl transition-all ${
                        group.isJoined
                          ? 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {group.isJoined ? 'View Group' : 'Join Group'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Success Stories Tab */}
          {activeTab === 'stories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Success Stories</h3>
                  <p className="text-sm text-gray-400">Get inspired by alumni achievements and journeys</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Share Your Story
                </button>
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {['All Stories', 'Career Success', 'Entrepreneurship', 'Leadership', 'Inspiration'].map(category => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {successStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {story.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{story.alumni}</h4>
                        <p className="text-sm text-gray-400">Class of {story.batch}</p>
                      </div>
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                        {story.category}
                      </span>
                    </div>

                    <h3 className="text-white mb-3">{story.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{story.excerpt}</p>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500">{story.readTime}</span>
                      <span className="text-gray-500">{story.publishedDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{story.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{story.comments}</span>
                        </button>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm">
                        Read Story
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Give Back Tab */}
          {activeTab === 'giving' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white">Give Back to UniVerse</h3>
                  <p className="text-sm text-gray-400">Support the next generation of students</p>
                </div>
              </div>

              {/* Impact summary */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30 mb-6">
                <h4 className="text-white mb-4">Your Impact This Year</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <h3 className="text-white mb-1">$5,000</h3>
                    <p className="text-sm text-gray-400">Total Contributed</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white mb-1">3</h3>
                    <p className="text-sm text-gray-400">Projects Funded</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white mb-1">12</h3>
                    <p className="text-sm text-gray-400">Students Helped</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {givingOpportunities.map((fund, index) => (
                  <motion.div
                    key={fund.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-white mb-2">{fund.title}</h4>
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                          {fund.category}
                        </span>
                      </div>
                      <Heart className="w-6 h-6 text-red-400" />
                    </div>

                    <p className="text-sm text-gray-400 mb-4">{fund.description}</p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white font-semibold">${(fund.raised / 1000).toFixed(0)}K raised</span>
                        <span className="text-gray-400">${(fund.goal / 1000).toFixed(0)}K goal</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(fund.raised / fund.goal) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((fund.raised / fund.goal) * 100).toFixed(0)}% funded
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Impact</p>
                      <p className="text-sm text-white">{fund.impact}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-400">{fund.contributors} contributors</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDonate(fund.id, 100)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        Contribute Now
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Other ways to give back */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-white mb-4">Other Ways to Give Back</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: Users, title: 'Mentor Students', desc: 'Share your expertise' },
                    { icon: Briefcase, title: 'Offer Internships', desc: 'Hire from campus' },
                    { icon: Video, title: 'Guest Lectures', desc: 'Speak at events' },
                  ].map((option, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                      <option.icon className="w-8 h-8 text-cyan-400 mb-2" />
                      <h5 className="text-white mb-1">{option.title}</h5>
                      <p className="text-sm text-gray-400">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Alumni Profile Modal */}
      <AnimatePresence>
        {selectedAlumni && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAlumni(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedAlumni.avatar}
                  </div>
                  <div>
                    <h3 className="text-white mb-1">{selectedAlumni.name}</h3>
                    <p className="text-gray-400">{selectedAlumni.position}</p>
                    <p className="text-purple-400">{selectedAlumni.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {selectedAlumni.bio && (
                <div className="mb-6">
                  <h4 className="text-white mb-2">About</h4>
                  <p className="text-gray-400 text-sm">{selectedAlumni.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Batch</p>
                  <p className="text-white">{selectedAlumni.batch}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Degree</p>
                  <p className="text-white">{selectedAlumni.degree}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="text-white">{selectedAlumni.location}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  <p className="text-white flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {selectedAlumni.rating}
                  </p>
                </div>
              </div>

              {selectedAlumni.skills && selectedAlumni.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAlumni.careerTimeline && selectedAlumni.careerTimeline.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white mb-3">Career Timeline</h4>
                  <div className="space-y-3">
                    {selectedAlumni.careerTimeline.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                          {i < selectedAlumni.careerTimeline!.length - 1 && (
                            <div className="w-0.5 h-full bg-cyan-400/30 mt-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-white font-semibold">{item.role}</p>
                          <p className="text-gray-400 text-sm">{item.company}</p>
                          <p className="text-xs text-gray-500">{item.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAlumni.achievements && selectedAlumni.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white mb-3">Achievements</h4>
                  <ul className="space-y-2">
                    {selectedAlumni.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <Trophy className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                {!selectedAlumni.isConnected ? (
                  <button
                    onClick={() => handleConnect(selectedAlumni.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Connect
                  </button>
                ) : (
                  <button className="flex-1 px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Connected
                  </button>
                )}
                <button
                  onClick={() => {
                    setMessageRecipient(selectedAlumni);
                    setShowMessageModal(true);
                    setSelectedAlumni(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
                {selectedAlumni.mentorAvailable && (
                  <button
                    onClick={() => {
                      setMentorshipRequestFor(selectedAlumni);
                      setShowMentorshipRequestModal(true);
                      setSelectedAlumni(null);
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Request Mentorship
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowMessageModal(false);
              setMessageRecipient(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 border border-white/20 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">
                  {messageRecipient ? `Message ${messageRecipient.name}` : 'Messages'}
                </h3>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageRecipient(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {messageRecipient ? (
                <div className="space-y-4">
                  <textarea
                    placeholder="Type your message..."
                    className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        msg.unread
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{msg.from}</h5>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentorship Request Modal */}
      <AnimatePresence>
        {showMentorshipRequestModal && mentorshipRequestFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowMentorshipRequestModal(false);
              setMentorshipRequestFor(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 border border-white/20 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Request Mentorship</h3>
                <button
                  onClick={() => {
                    setShowMentorshipRequestModal(false);
                    setMentorshipRequestFor(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {mentorshipRequestFor.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{mentorshipRequestFor.name}</h4>
                  <p className="text-sm text-gray-400">{mentorshipRequestFor.position}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mentorship Type</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none">
                    <option>Career guidance</option>
                    <option>Interview preparation</option>
                    <option>Higher studies</option>
                    <option>Technical mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="Briefly describe what you'd like to discuss..."
                    className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
