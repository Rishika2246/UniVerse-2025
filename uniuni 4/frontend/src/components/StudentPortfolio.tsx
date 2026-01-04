import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CertificateVault from './CertificateVault';
import CertificateUploadModal from './CertificateUploadModal';
import {
  User, Award, Code, Calendar, GraduationCap, Briefcase,
  Share2, Download, Eye, Edit3, Save, X, Plus, Star,
  CheckCircle, Clock, TrendingUp, Target, Sparkles,
  BookOpen, Trophy, Zap, Shield, Mail, Phone, MapPin,
  Linkedin, Github, Globe, FileText, ChevronRight, Lock,
  Unlock, Settings, BarChart3, Link as LinkIcon, Copy,
  Check, ExternalLink, Upload, Image as ImageIcon,
  AlertCircle, Info, Heart, MessageSquare, Trash2, Camera,
  RefreshCw, Filter, Search, ArrowUpCircle, FileDown,
  FolderDown, Pencil, UserPlus, Code2, Laptop, Brain,
  Users, Mic, Palette, Dumbbell
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  source: string;
  validatedBy?: string;
  dateAcquired: string;
  usedIn: string[];
}

interface Badge {
  id: number;
  name: string;
  category: 'Academic' | 'Technical' | 'Cultural' | 'Leadership' | 'Sports';
  icon: any;
  description: string;
  issuedBy: string;
  dateEarned: string;
  verified: boolean;
}

interface Activity {
  id: number;
  title: string;
  type: 'Event' | 'Workshop' | 'Competition' | 'Club';
  role: 'Participant' | 'Volunteer' | 'Organizer' | 'Winner';
  organization: string;
  date: string;
  duration: string;
  skillsGained: string[];
  verified: boolean;
  description: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  role: string;
  status: 'Featured' | 'Ongoing' | 'Completed';
  startDate: string;
  endDate?: string;
  links: {
    github?: string;
    demo?: string;
    documentation?: string;
  };
  skills: string[];
  achievements?: string[];
}

interface AcademicRecord {
  semester: number;
  year: string;
  subjects: { name: string; grade: string; credits: number }[];
  sgpa: number;
  cgpa: number;
  achievements: string[];
}

export function StudentPortfolio({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'badges' | 'activities' | 'academics' | 'projects' | 'certificates' | 'resume' | 'share'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'campus' | 'private'>('campus');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showUploadResumeModal, setShowUploadResumeModal] = useState(false);
  const [portfolioUrl] = useState(`universe.edu/portfolio/${user?.name?.toLowerCase().replace(/\s+/g, '-')}`);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [resumeTemplate, setResumeTemplate] = useState<'tech' | 'management' | 'design'>('tech');
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Data
  const [profile, setProfile] = useState({
    name: user?.name || 'Amit Kumar',
    email: 'amit.kumar@uni.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    batch: '2022-2026',
    rollNumber: 'CSE22001',
    about: 'Passionate computer science student with strong interests in AI/ML, web development, and competitive programming. Active member of Tech Club and Coding Society.',
    interests: ['Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Competitive Programming'],
    careerGoals: 'Aspiring to become a Machine Learning Engineer at a top tech company, contributing to cutting-edge AI solutions.',
    location: 'Mumbai, India',
    profileImage: '',
    socialLinks: {
      linkedin: 'linkedin.com/in/amitkumar',
      github: 'github.com/amitkumar',
      portfolio: 'amitkumar.dev'
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Skills Data - Auto-populated from activities
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'Python', level: 'Advanced', category: 'Programming', source: 'Tech Hackathon 2024', validatedBy: 'Tech Club', dateAcquired: '2023-09-15', usedIn: ['Hackathon Project', 'AI Workshop'] },
    { id: 2, name: 'Machine Learning', level: 'Intermediate', category: 'Technical', source: 'AI & ML Workshop', validatedBy: 'Dr. Sharma', dateAcquired: '2024-01-10', usedIn: ['Final Year Project', 'Research Paper'] },
    { id: 3, name: 'React.js', level: 'Advanced', category: 'Web Development', source: 'Web Dev Bootcamp', validatedBy: 'Tech Club', dateAcquired: '2023-08-20', usedIn: ['Campus Portal', 'Personal Website'] },
    { id: 4, name: 'Public Speaking', level: 'Intermediate', category: 'Soft Skills', source: 'Debate Competition', validatedBy: 'Literary Society', dateAcquired: '2024-02-05', usedIn: ['TEDx Event', 'Workshops'] },
    { id: 5, name: 'Leadership', level: 'Advanced', category: 'Soft Skills', source: 'Club Coordinator', validatedBy: 'Faculty Advisor', dateAcquired: '2023-07-01', usedIn: ['Tech Club', 'Event Management'] },
    { id: 6, name: 'Data Analysis', level: 'Intermediate', category: 'Technical', source: 'Data Science Workshop', validatedBy: 'Tech Club', dateAcquired: '2023-11-12', usedIn: ['Research Project', 'Internship'] },
    { id: 7, name: 'Node.js', level: 'Advanced', category: 'Web Development', source: 'Backend Development Course', validatedBy: 'Self-certified', dateAcquired: '2023-10-05', usedIn: ['Campus API', 'Personal Projects'] },
    { id: 8, name: 'Team Collaboration', level: 'Advanced', category: 'Soft Skills', source: 'Multiple Projects', validatedBy: 'Faculty', dateAcquired: '2023-06-15', usedIn: ['All Team Projects'] },
  ]);

  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    level: 'Beginner',
    category: 'Programming',
    source: '',
    validatedBy: '',
    dateAcquired: new Date().toISOString().split('T')[0],
    usedIn: []
  });

  // Badges Data - Auto-earned
  const [badges] = useState<Badge[]>([
    { id: 1, name: 'Hackathon Winner', category: 'Technical', icon: Trophy, description: 'Won 1st place in Tech Hackathon 2024', issuedBy: 'Tech Club', dateEarned: '2024-04-15', verified: true },
    { id: 2, name: 'Event Organizer', category: 'Leadership', icon: Users, description: 'Successfully organized 5+ major events', issuedBy: 'Student Council', dateEarned: '2024-03-20', verified: true },
    { id: 3, name: 'Academic Excellence', category: 'Academic', icon: GraduationCap, description: 'CGPA above 9.0 for 4 consecutive semesters', issuedBy: 'Academic Department', dateEarned: '2024-05-10', verified: true },
    { id: 4, name: 'Workshop Champion', category: 'Technical', icon: Brain, description: 'Attended 10+ technical workshops', issuedBy: 'Tech Club', dateEarned: '2024-02-28', verified: true },
    { id: 5, name: 'Cultural Ambassador', category: 'Cultural', icon: Palette, description: 'Active participation in 8+ cultural events', issuedBy: 'Cultural Society', dateEarned: '2024-01-15', verified: true },
    { id: 6, name: 'Code Contributor', category: 'Technical', icon: Code2, description: 'Open source contributions', issuedBy: 'GitHub', dateEarned: '2024-03-05', verified: false },
    { id: 7, name: 'Debate Champion', category: 'Leadership', icon: Mic, description: 'Won inter-college debate competition', issuedBy: 'Literary Society', dateEarned: '2024-04-12', verified: true },
    { id: 8, name: 'Sports Star', category: 'Sports', icon: Dumbbell, description: 'Outstanding performance in sports meet', issuedBy: 'Sports Club', dateEarned: '2024-04-25', verified: true },
  ]);

  // Activities Data - Auto-logged
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, title: 'Tech Hackathon 2024', type: 'Competition', role: 'Winner', organization: 'Tech Club', date: '2024-04-15', duration: '24 hours', skillsGained: ['Python', 'AI', 'Teamwork'], verified: true, description: 'Developed an AI-powered study assistant' },
    { id: 2, title: 'AI & ML Workshop', type: 'Workshop', role: 'Participant', organization: 'Tech Club', date: '2024-04-18', duration: '3 days', skillsGained: ['Machine Learning', 'Data Analysis'], verified: true, description: 'Hands-on workshop on ML fundamentals' },
    { id: 3, title: 'Annual Cultural Fest', type: 'Event', role: 'Organizer', organization: 'Cultural Society', date: '2024-03-10', duration: '5 days', skillsGained: ['Event Management', 'Leadership'], verified: true, description: 'Coordinated logistics for 500+ participants' },
    { id: 4, title: 'Debate Competition', type: 'Competition', role: 'Winner', organization: 'Literary Society', date: '2024-04-12', duration: '1 day', skillsGained: ['Public Speaking', 'Critical Thinking'], verified: true, description: 'Won first place in inter-college debate' },
    { id: 5, title: 'Blood Donation Camp', type: 'Event', role: 'Volunteer', organization: 'Social Service Club', date: '2024-04-08', duration: '1 day', skillsGained: ['Social Service', 'Team Collaboration'], verified: true, description: 'Helped organize camp for 200+ donors' },
    { id: 6, title: 'Tech Club Leadership', type: 'Club', role: 'Organizer', organization: 'Tech Club', date: '2023-07-01', duration: 'Ongoing', skillsGained: ['Leadership', 'Management', 'Communication'], verified: true, description: 'Serving as Tech Club Coordinator' },
  ]);

  // Academic Records - Auto-synced
  const [academics] = useState<AcademicRecord[]>([
    { semester: 1, year: '2022-23', subjects: [{ name: 'Programming in C', grade: 'A+', credits: 4 }, { name: 'Mathematics I', grade: 'A', credits: 4 }, { name: 'Physics', grade: 'A', credits: 3 }], sgpa: 9.2, cgpa: 9.2, achievements: ['Dean\'s List'] },
    { semester: 2, year: '2022-23', subjects: [{ name: 'Data Structures', grade: 'A+', credits: 4 }, { name: 'Mathematics II', grade: 'A+', credits: 4 }, { name: 'Chemistry', grade: 'A', credits: 3 }], sgpa: 9.4, cgpa: 9.3, achievements: ['Top 5%'] },
    { semester: 3, year: '2023-24', subjects: [{ name: 'OOP with Java', grade: 'A+', credits: 4 }, { name: 'DBMS', grade: 'A', credits: 4 }, { name: 'Computer Networks', grade: 'A+', credits: 4 }], sgpa: 9.5, cgpa: 9.37, achievements: ['Best Project Award'] },
    { semester: 4, year: '2023-24', subjects: [{ name: 'Operating Systems', grade: 'A+', credits: 4 }, { name: 'Web Technologies', grade: 'A+', credits: 4 }, { name: 'Software Engineering', grade: 'A', credits: 3 }], sgpa: 9.3, cgpa: 9.35, achievements: ['Dean\'s List'] },
    { semester: 5, year: '2024-25', subjects: [{ name: 'Machine Learning', grade: 'A+', credits: 4 }, { name: 'Cloud Computing', grade: 'A', credits: 4 }, { name: 'AI', grade: 'A+', credits: 4 }], sgpa: 9.6, cgpa: 9.4, achievements: ['Top of Class', 'Research Paper Published'] },
  ]);

  // Projects Data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'AI-Powered Study Assistant',
      description: 'An intelligent chatbot that helps students with their studies using natural language processing and machine learning.',
      techStack: ['Python', 'TensorFlow', 'Flask', 'React', 'MongoDB'],
      role: 'Lead Developer',
      status: 'Featured',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      links: { github: 'github.com/amitkumar/study-assistant', demo: 'study-assistant.vercel.app' },
      skills: ['Python', 'Machine Learning', 'NLP', 'React'],
      achievements: ['Won Hackathon', 'Featured in College Magazine']
    },
    {
      id: 2,
      title: 'Campus Event Management System',
      description: 'Complete event management platform for college with registration, ticketing, and analytics features.',
      techStack: ['Node.js', 'Express', 'PostgreSQL', 'React', 'TypeScript'],
      role: 'Full Stack Developer',
      status: 'Completed',
      startDate: '2023-09-01',
      endDate: '2023-12-15',
      links: { github: 'github.com/amitkumar/campus-events', demo: 'campus-events.netlify.app' },
      skills: ['Node.js', 'React', 'PostgreSQL', 'TypeScript'],
      achievements: ['Used by 5000+ students', 'Reduced event registration time by 70%']
    },
    {
      id: 3,
      title: 'Real-time Collaborative Code Editor',
      description: 'Web-based code editor with real-time collaboration features, syntax highlighting, and code execution.',
      techStack: ['Next.js', 'Socket.io', 'Monaco Editor', 'Docker'],
      role: 'Frontend Developer',
      status: 'Ongoing',
      startDate: '2024-03-01',
      links: { github: 'github.com/amitkumar/collab-editor' },
      skills: ['Next.js', 'WebSockets', 'Docker'],
      achievements: []
    },
  ]);

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    techStack: [],
    role: '',
    status: 'Ongoing',
    startDate: new Date().toISOString().split('T')[0],
    links: {},
    skills: [],
    achievements: []
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://${portfolioUrl}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const generateResume = () => {
    const resumeData = {
      profile,
      skills,
      projects,
      activities,
      academics,
      template: resumeTemplate
    };
    
    // Create a blob with resume data
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Resume_${resumeTemplate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPortfolio = () => {
    const portfolioData = {
      profile,
      skills,
      badges,
      activities,
      academics,
      projects,
      visibility: profileVisibility,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Portfolio.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setProfile(editedProfile);
    setShowEditProfileModal(false);
  };

  const addSkill = () => {
    if (newSkill.name && newSkill.category && newSkill.source) {
      const skill: Skill = {
        id: skills.length + 1,
        name: newSkill.name!,
        level: newSkill.level!,
        category: newSkill.category!,
        source: newSkill.source!,
        validatedBy: newSkill.validatedBy,
        dateAcquired: newSkill.dateAcquired!,
        usedIn: newSkill.usedIn || []
      };
      setSkills([...skills, skill]);
      setNewSkill({
        name: '',
        level: 'Beginner',
        category: 'Programming',
        source: '',
        validatedBy: '',
        dateAcquired: new Date().toISOString().split('T')[0],
        usedIn: []
      });
      setShowAddSkillModal(false);
    }
  };

  const deleteSkill = (id: number) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: projects.length + 1,
        title: newProject.title!,
        description: newProject.description!,
        techStack: newProject.techStack || [],
        role: newProject.role || '',
        status: newProject.status || 'Ongoing',
        startDate: newProject.startDate!,
        endDate: newProject.endDate,
        links: newProject.links || {},
        skills: newProject.skills || [],
        achievements: newProject.achievements || []
      };
      setProjects([...projects, project]);
      setNewProject({
        title: '',
        description: '',
        techStack: [],
        role: '',
        status: 'Ongoing',
        startDate: new Date().toISOString().split('T')[0],
        links: {},
        skills: [],
        achievements: []
      });
      setShowAddProjectModal(false);
    }
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const deleteActivity = (id: number) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const filteredSkills = skills.filter(skill => {
    const matchesFilter = skillFilter === 'All' || skill.category === skillFilter;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const skillCategories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-100/80 via-blue-100/80 to-purple-100/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">My Portfolio</h2>
            <p className="text-slate-600">Your comprehensive professional profile, auto-built from your campus journey</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={downloadPortfolio}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <FolderDown className="w-5 h-5" />
              Download
            </button>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'CGPA', value: '9.4', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
            { label: 'Skills', value: skills.length, icon: Code, color: 'from-cyan-500 to-blue-500' },
            { label: 'Badges', value: badges.length, icon: Award, color: 'from-purple-500 to-pink-500' },
            { label: 'Projects', value: projects.length, icon: Briefcase, color: 'from-orange-500 to-red-500' },
            { label: 'Activities', value: activities.length, icon: Calendar, color: 'from-yellow-500 to-amber-500' },
          ].map((stat, index) => (
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

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 border border-cyan-200">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'skills', label: 'Skills', icon: Code },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'activities', label: 'Activities', icon: Calendar },
            { id: 'academics', label: 'Academics', icon: GraduationCap },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'certificates', label: 'Certificates', icon: Shield },
            { id: 'resume', label: 'Resume', icon: FileText },
            { id: 'share', label: 'Share', icon: Share2 },
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
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Visibility Control */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    {profileVisibility === 'public' && <Globe className="w-5 h-5 text-green-600" />}
                    {profileVisibility === 'campus' && <User className="w-5 h-5 text-blue-600" />}
                    {profileVisibility === 'private' && <Lock className="w-5 h-5 text-red-600" />}
                    Profile Visibility
                  </h3>
                  <p className="text-sm text-slate-600">Control who can see your portfolio</p>
                </div>
                <div className="flex gap-2">
                  {(['public', 'campus', 'private'] as const).map((visibility) => (
                    <button
                      key={visibility}
                      onClick={() => setProfileVisibility(visibility)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        profileVisibility === visibility
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-cyan-200" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all">
                      <Camera className="w-5 h-5 text-white" />
                      <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                    </label>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{profile.name}</h3>
                  <p className="text-cyan-600 font-semibold mb-2">{profile.department}</p>
                  <p className="text-sm text-slate-600">{profile.year} • {profile.batch}</p>
                  <p className="text-sm text-slate-600">Roll No: {profile.rollNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-cyan-600" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span>{profile.location}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cyan-200">
                  <h4 className="font-bold text-slate-800 mb-3">Social Links</h4>
                  <div className="space-y-2">
                    <a href={`https://${profile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                    <a href={`https://${profile.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                    <a href={`https://${profile.socialLinks.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
                      <Globe className="w-4 h-4" />
                      Portfolio
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditedProfile(profile);
                    setShowEditProfileModal(true);
                  }}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Me */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">About Me</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{profile.about}</p>
                </div>

                {/* Interests */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-slate-700 rounded-full text-sm font-semibold"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Goals */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Career Goals</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{profile.careerGoals}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters and Search */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <Filter className="w-5 h-5 text-slate-600" />
                  {skillCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSkillFilter(category)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        skillFilter === category
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-cyan-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddSkillModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* Skill Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-800 mb-1">{skill.name}</h4>
                      <p className="text-sm text-slate-600">{skill.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        skill.level === 'Advanced' ? 'bg-green-100 text-green-600' :
                        skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {skill.level}
                      </span>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-1 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Source</p>
                      <p className="text-sm text-slate-700">{skill.source}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="w-3 h-3 text-green-600" />
                      <span className="text-slate-600">Validated by: {skill.validatedBy}</span>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Acquired</p>
                      <p className="text-sm text-slate-700">{new Date(skill.dateAcquired).toLocaleDateString()}</p>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: skill.level === 'Advanced' ? '100%' : skill.level === 'Intermediate' ? '66%' : '33%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          skill.level === 'Advanced' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          skill.level === 'Intermediate' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          'bg-gradient-to-r from-orange-400 to-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 text-center hover:shadow-lg transition-all"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <badge.icon className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{badge.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {badge.verified && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      badge.category === 'Academic' ? 'bg-blue-100 text-blue-600' :
                      badge.category === 'Technical' ? 'bg-purple-100 text-purple-600' :
                      badge.category === 'Cultural' ? 'bg-pink-100 text-pink-600' :
                      badge.category === 'Leadership' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Issued by {badge.issuedBy}</p>
                  <p className="text-xs text-slate-500">{new Date(badge.dateEarned).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-slate-800">{activity.title}</h4>
                        {activity.verified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        activity.role === 'Winner' ? 'bg-yellow-100 text-yellow-700' :
                        activity.role === 'Organizer' ? 'bg-purple-100 text-purple-600' :
                        activity.role === 'Volunteer' ? 'bg-blue-100 text-blue-600' :
                        'bg-cyan-100 text-cyan-600'
                      }`}>
                        {activity.role}
                      </span>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Type</p>
                      <p className="font-semibold text-slate-700">{activity.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Organization</p>
                      <p className="font-semibold text-slate-700">{activity.organization}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="font-semibold text-slate-700">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Duration</p>
                      <p className="font-semibold text-slate-700">{activity.duration}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-2">Skills Gained</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.skillsGained.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-slate-700 rounded-full text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <motion.div
            key="academics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Performance */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Academic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">9.4</div>
                  <p className="text-slate-600">Current CGPA</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-green-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Improving</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">{academics.length}</div>
                  <p className="text-slate-600">Semesters Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">4</div>
                  <p className="text-slate-600">Dean's List</p>
                </div>
              </div>
            </div>

            {/* Semester-wise Timeline */}
            <div className="space-y-4">
              {academics.map((record) => (
                <div key={record.semester} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">Semester {record.semester}</h4>
                      <p className="text-sm text-slate-600">{record.year}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">SGPA: {record.sgpa}</div>
                      <div className="text-sm text-slate-600">CGPA: {record.cgpa}</div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {record.subjects.map((subject, index) => (
                      <div key={index} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-700 text-sm">{subject.name}</p>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            subject.grade === 'A+' ? 'bg-green-100 text-green-700' :
                            subject.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {subject.grade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{subject.credits} credits</p>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  {record.achievements.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      {record.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-800 mb-1">{project.title}</h4>
                      <p className="text-sm text-cyan-600 font-semibold">{project.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Featured' ? 'bg-yellow-100 text-yellow-700' :
                        project.status === 'Ongoing' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {project.status}
                      </span>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-slate-700 rounded-full text-xs font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    {project.endDate && (
                      <>
                        <span>→</span>
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 mb-4">
                    {project.links.github && (
                      <a
                        href={`https://${project.links.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-all"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={`https://${project.links.demo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm hover:bg-cyan-200 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>

                  {/* Achievements */}
                  {project.achievements && project.achievements.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Achievements</p>
                      <div className="space-y-1">
                        {project.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                            <Star className="w-3 h-3 fill-green-600" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certificate Vault Tab */}
        {activeTab === 'certificates' && (
          <motion.div
            key="certificates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <CertificateVault />
          </motion.div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Upload Resume Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Upload Existing Resume</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowUploadResumeModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
                <p className="text-sm text-slate-600">Upload your existing resume (PDF, DOCX)</p>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Choose Resume Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['tech', 'management', 'design'] as const).map((template) => (
                  <button
                    key={template}
                    onClick={() => setResumeTemplate(template)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      resumeTemplate === template
                        ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50'
                        : 'border-slate-200 hover:border-cyan-300'
                    }`}
                  >
                    <FileText className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 mb-1 capitalize">{template}</h4>
                    <p className="text-xs text-slate-600">
                      {template === 'tech' && 'Clean and technical'}
                      {template === 'management' && 'Professional and formal'}
                      {template === 'design' && 'Creative and modern'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Preview */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-cyan-200">
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {/* Resume Header */}
                <div className="text-center mb-6 pb-6 border-b-2 border-slate-200">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.name}</h1>
                  <p className="text-slate-600 mb-2">{profile.department}</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                    <span>{profile.email}</span>
                    <span>•</span>
                    <span>{profile.phone}</span>
                    <span>•</span>
                    <span>{profile.location}</span>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">EDUCATION</h2>
                  <div>
                    <h3 className="font-bold text-slate-700">Bachelor of Technology in Computer Science</h3>
                    <p className="text-slate-600">UniVerse Institute of Technology • {profile.batch}</p>
                    <p className="text-slate-600">CGPA: 9.4 / 10.0</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">SKILLS</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.slice(0, 6).map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span className="text-slate-700">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">PROJECTS</h2>
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="mb-4">
                      <h3 className="font-bold text-slate-700">{project.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                      <p className="text-xs text-slate-500">
                        Tech: {project.techStack.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Activities */}
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">ACTIVITIES & ACHIEVEMENTS</h2>
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span className="text-slate-700">{activity.title} - {activity.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={generateResume}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FileDown className="w-5 h-5" />
                Download as PDF
              </button>
              <button
                onClick={generateResume}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                Download as DOCX
              </button>
            </div>
          </motion.div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Portfolio Link */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Your Portfolio Link</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-mono">
                  https://{portfolioUrl}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {copiedUrl ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copiedUrl ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-3">Share this link with recruiters, alumni, or on social media</p>
            </div>

            {/* QR Code */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-4">QR Code</h3>
              <div className="w-48 h-48 bg-white border-4 border-cyan-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="text-slate-400">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-white'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all mx-auto">
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>

            {/* Analytics */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Portfolio Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl">
                  <Eye className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800 mb-1">247</div>
                  <p className="text-sm text-slate-600">Profile Views</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800 mb-1">89</div>
                  <p className="text-sm text-slate-600">Resume Downloads</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <LinkIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800 mb-1">34</div>
                  <p className="text-sm text-slate-600">Link Shares</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Share Modal */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
            >
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Share Your Portfolio</h3>
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-slate-600 mb-3">Your Portfolio Link</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-mono text-sm">
                      https://{portfolioUrl}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      {copiedUrl ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">
                    <Linkedin className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">LinkedIn</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700">Email</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-all">
                    <MessageSquare className="w-6 h-6 text-cyan-600" />
                    <span className="text-sm font-semibold text-slate-700">Message</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowEditProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8"
            >
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Edit Profile</h3>
                  </div>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">About Me</label>
                  <textarea
                    value={editedProfile.about}
                    onChange={(e) => setEditedProfile({ ...editedProfile, about: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone</label>
                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Location</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Career Goals</label>
                  <textarea
                    value={editedProfile.careerGoals}
                    onChange={(e) => setEditedProfile({ ...editedProfile, careerGoals: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">LinkedIn</label>
                  <input
                    type="text"
                    value={editedProfile.socialLinks.linkedin}
                    onChange={(e) => setEditedProfile({ ...editedProfile, socialLinks: { ...editedProfile.socialLinks, linkedin: e.target.value }})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">GitHub</label>
                  <input
                    type="text"
                    value={editedProfile.socialLinks.github}
                    onChange={(e) => setEditedProfile({ ...editedProfile, socialLinks: { ...editedProfile.socialLinks, github: e.target.value }})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Skill Modal */}
        {showAddSkillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSkillModal(false)}
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
                    <Plus className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Add New Skill</h3>
                  </div>
                  <button
                    onClick={() => setShowAddSkillModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Skill Name *</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g., Python, Public Speaking"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Category *</label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Source *</label>
                  <input
                    type="text"
                    value={newSkill.source}
                    onChange={(e) => setNewSkill({ ...newSkill, source: e.target.value })}
                    placeholder="Where did you learn this?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Validated By</label>
                  <input
                    type="text"
                    value={newSkill.validatedBy}
                    onChange={(e) => setNewSkill({ ...newSkill, validatedBy: e.target.value })}
                    placeholder="e.g., Tech Club, Faculty"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowAddSkillModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addSkill}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Skill
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Project Modal */}
        {showAddProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowAddProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8"
            >
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Plus className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Add New Project</h3>
                  </div>
                  <button
                    onClick={() => setShowAddProjectModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Project Title *</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g., AI Study Assistant"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Description *</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                    placeholder="Describe your project..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Your Role</label>
                    <input
                      type="text"
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                      placeholder="e.g., Lead Developer"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Featured">Featured</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">GitHub Link</label>
                  <input
                    type="text"
                    value={newProject.links?.github || ''}
                    onChange={(e) => setNewProject({ ...newProject, links: { ...newProject.links, github: e.target.value }})}
                    placeholder="github.com/username/repo"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Demo Link</label>
                  <input
                    type="text"
                    value={newProject.links?.demo || ''}
                    onChange={(e) => setNewProject({ ...newProject, links: { ...newProject.links, demo: e.target.value }})}
                    placeholder="project.vercel.app"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowAddProjectModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addProject}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Upload Resume Modal */}
        {showUploadResumeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadResumeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Upload className="w-6 h-6" />
                    <h3 className="text-2xl font-bold">Upload Resume</h3>
                  </div>
                  <button
                    onClick={() => setShowUploadResumeModal(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-8 text-center hover:border-cyan-400 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 mb-2">Drop your resume here</h4>
                  <p className="text-sm text-slate-600 mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Resume "${file.name}" uploaded successfully!`);
                        setShowUploadResumeModal(false);
                      }
                    }}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-slate-500 mt-3">Supported: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
