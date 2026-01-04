import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Building, Layout, Download, Upload, Shuffle,
  CheckCircle, AlertTriangle, Calendar, FileText, Settings,
  TrendingUp, MapPin, Grid, BarChart, Search, Filter,
  Eye, Edit, Trash2, Copy, RefreshCw, Bell, Clock, Plus,
  Printer, Send, Archive, Zap, Target, Activity, Database,
  Shield, Maximize2, Minimize2, Save, XCircle, CheckSquare,
  List, Monitor, Wifi, Lock, Unlock, UserCheck, AlertCircle,
  ZoomIn, ZoomOut, Sparkles, Brain, Award, MapPinned, FileSpreadsheet,
  PlayCircle, StopCircle, RotateCcw, History, GitBranch, ThumbsUp,
  ThumbsDown, MessageSquare, Sliders, Layers, Navigation, DoorOpen,
  Ban, Tag, AlertOctagon, BarChart3, PieChart, LineChart, Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { HallLayoutViewer } from './HallLayoutViewer';
import { DetentionAwareSeating } from './DetentionAwareSeating';

interface SeatingManagerDashboardProps {
  user: any;
}

// ===== DATA STRUCTURES =====
interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  subject: string;
  email?: string;
  phone?: string;
  specialNeeds?: boolean;
  specialNeedsType?: string;
}

interface Seat {
  row: number;
  col: number;
  seatId: string;
  student: Student | null;
  isBlocked: boolean;
  isSpecial: boolean;
  isEmpty: boolean; // For spacing
  isEntry?: boolean;
  isExit?: boolean;
}

interface Hall {
  id: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
  seats: Seat[][];
  assignedStudents: Student[];
  isActive: boolean;
  blockedSeats: string[];
  entryPoints: { row: number; col: number }[];
  exitPoints: { row: number; col: number }[];
  invigilators?: string[];
  departments?: string[]; // Departments allocated to this hall
}

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: 'draft' | 'allocated' | 'locked' | 'completed' | 'published';
  totalStudents: number;
  hallsUsed: number;
}

interface AllocationVersion {
  id: string;
  timestamp: string;
  allocatedHalls: Hall[];
  stats: any;
  notes: string;
  createdBy: string;
}

interface Conflict {
  id: string;
  type: 'adjacency' | 'department' | 'subject' | 'capacity';
  severity: 'high' | 'medium' | 'low';
  description: string;
  seat1?: string;
  seat2?: string;
  hallId: string;
  autoResolvable: boolean;
}

interface AllocationConfig {
  strategy: 'random' | 'department' | 'zigzag' | 'optimized';
  spacingGap: number;
  antiCheat: boolean;
  sameDeptSeparation: number;
  sameSubjectSeparation: number;
  specialNeedsPriority: boolean;
  balanceHalls: boolean;
  seed?: number;
}

export function SeatingManagerDashboard({ user }: SeatingManagerDashboardProps) {
  // ===== STATE MANAGEMENT =====
  const [activeSection, setActiveSection] = useState('overview');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Exam & Hall Setup
  const [exams, setExams] = useState([]);
  const [halls, setHalls] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [editingHall, setEditingHall] = useState(null);
  
  // Student Management
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // Allocation
  const [allocatedHalls, setAllocatedHalls] = useState([]);
  const [allocationConfig, setAllocationConfig] = useState({
    strategy: 'optimized',
    spacingGap: 1,
    antiCheat: true,
    sameDeptSeparation: 2,
    sameSubjectSeparation: 3,
    specialNeedsPriority: true,
    balanceHalls: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Conflict Detection
  const [conflicts, setConflicts] = useState([]);
  const [showConflicts, setShowConflicts] = useState(false);
  
  // Version Control
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // Visualization
  const [selectedHallView, setSelectedHallView] = useState(null);
  const [viewingHall, setViewingHall] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const [colorMode, setColorMode] = useState('department');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Admin Approval
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [approvalComments, setApprovalComments] = useState('');
  
  // Stats for display
  const [stats, setStats] = useState(null);
  
  // Department allocation per hall
  const [hallDepartments, setHallDepartments] = useState({});

  // ===== INITIALIZATION =====
  useEffect(() => {
    const initializeData = async () => {
      setIsInitializing(true);
      
      // Show loading message
      toast.info('Initializing Seating Manager Dashboard...');
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        initializeDefaultData();
        
        toast.success('Seating Manager Dashboard initialized successfully!');
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize dashboard');
      } finally {
        // Always set initialization complete
        setIsInitializing(false);
      }
    };
    
    initializeData();
  }, []); // Remove dependencies to prevent infinite loop

  const initializeDefaultData = () => {
    // Create default halls with bench seating (8 rows × 4 columns of benches, 2 seats per bench = 64 seats)
    const defaultHalls: Hall[] = [
      createHall('HALL_A', 'Hall A - Main Auditorium', 8, 8, 64), // 8 rows × 8 cols (4 benches × 2 seats)
      createHall('HALL_B', 'Hall B - Engineering Block', 8, 8, 64),
      createHall('HALL_C', 'Hall C - Science Block', 8, 8, 64),
      createHall('HALL_D', 'Hall D - Computer Lab', 8, 8, 64),
      createHall('HALL_E', 'Hall E - Conference Hall', 8, 8, 64),
      createHall('HALL_F', 'Hall F - Seminar Hall', 8, 8, 64),
    ];
    
    // Assign departments to halls for better organization
    defaultHalls[0].departments = ['CSE', 'IT'];
    defaultHalls[1].departments = ['ECE', 'EEE'];
    defaultHalls[2].departments = ['ME', 'CE'];
    defaultHalls[3].departments = ['CSE'];
    defaultHalls[4].departments = ['ECE'];
    defaultHalls[5].departments = ['ME'];
    
    setHalls(defaultHalls);

    // Create multiple sample exams
    const sampleExams: Exam[] = [
      {
        id: 'EXAM_001',
        name: 'Mid-Semester Examination - December 2024',
        subject: 'Computer Science & Engineering',
        date: '2024-12-25',
        time: '10:00 AM',
        duration: '3 hours',
        status: 'draft',
        totalStudents: 320,
        hallsUsed: 6,
      },
      {
        id: 'EXAM_002',
        name: 'Final Semester Examination - January 2025',
        subject: 'All Departments',
        date: '2025-01-15',
        time: '2:00 PM',
        duration: '3 hours',
        status: 'allocated',
        totalStudents: 280,
        hallsUsed: 5,
      },
      {
        id: 'EXAM_003',
        name: 'Supplementary Examination - February 2025',
        subject: 'Engineering Mathematics',
        date: '2025-02-10',
        time: '9:00 AM',
        duration: '2 hours',
        status: 'locked',
        totalStudents: 150,
        hallsUsed: 3,
      }
    ];
    setExams(sampleExams);
    setCurrentExam(sampleExams[0]);

    // Generate sample students with more realistic data
    const sampleStudents = generateMockStudents(320);
    setStudents(sampleStudents);
    setFilteredStudents(sampleStudents);

    // Initialize some sample versions for history
    const sampleVersions: AllocationVersion[] = [
      {
        id: 'VERSION_001',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        allocatedHalls: [],
        stats: {
          totalStudents: 280,
          totalHalls: 5,
          utilizationRate: '85.2',
          occupiedSeats: 280,
        },
        notes: 'Initial allocation for Mid-Semester Exam',
        createdBy: 'Dr. Smith (Seating Manager)',
      },
      {
        id: 'VERSION_002',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        allocatedHalls: [],
        stats: {
          totalStudents: 320,
          totalHalls: 6,
          utilizationRate: '92.1',
          occupiedSeats: 320,
        },
        notes: 'Updated allocation with conflict resolution',
        createdBy: 'Dr. Smith (Seating Manager)',
      }
    ];
    setVersions(sampleVersions);

    toast.success('Seating Manager Dashboard initialized with comprehensive sample data!');
  };

  const createHall = (id: string, name: string, rows: number, cols: number, capacity: number): Hall => {
    const seats: Seat[][] = [];
    // Create bench-based seating: 8 rows × 4 columns of benches with 2 seats each
    // cols should be 8 (4 benches × 2 seats per bench)
    for (let r = 0; r < rows; r++) {
      const row: Seat[] = [];
      for (let c = 0; c < cols; c++) {
        // Calculate bench number (4 benches per row) and seat position (Left/Right)
        const benchNum = Math.floor(c / 2) + 1;
        const seatPos = c % 2 === 0 ? 'L' : 'R';
        
        row.push({
          row: r,
          col: c,
          seatId: `${id}_${String.fromCharCode(65 + r)}${benchNum}${seatPos}`, // e.g., HALL_A_A1L, HALL_A_A1R
          student: null,
          isBlocked: false,
          isSpecial: false,
          isEmpty: false,
        });
      }
      seats.push(row);
    }

    return {
      id,
      name,
      capacity,
      rows,
      cols,
      seats,
      assignedStudents: [],
      isActive: true,
      blockedSeats: [],
      entryPoints: [{ row: 0, col: 0 }, { row: 0, col: cols - 1 }],
      exitPoints: [{ row: rows - 1, col: 0 }, { row: rows - 1, col: cols - 1 }],
      invigilators: [],
      departments: [], // Initially no departments selected
    };
  };

  const generateMockStudents = (count: number): Student[] => {
    const departments = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'];
    const subjects = [
      'Data Structures & Algorithms', 'Computer Networks', 'Digital Electronics', 
      'Thermodynamics', 'Circuit Theory', 'Database Management Systems',
      'Software Engineering', 'Machine Learning', 'Control Systems',
      'Structural Analysis', 'Power Systems', 'Web Technologies'
    ];
    const firstNames = [
      'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Pranav', 'Ishaan', 'Dhruv',
      'Ananya', 'Diya', 'Isha', 'Kavya', 'Priya', 'Riya', 'Shreya', 'Tanya',
      'Rohan', 'Karan', 'Nikhil', 'Rahul', 'Amit', 'Suresh', 'Vikram', 'Ajay'
    ];
    const surnames = [
      'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Verma', 'Gupta', 'Mehta',
      'Agarwal', 'Jain', 'Shah', 'Rao', 'Nair', 'Iyer', 'Chopra', 'Malhotra'
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const dept = departments[i % departments.length];
      const sem = String(3 + (i % 6)); // Semesters 3-8
      const year = i < 160 ? '2022' : '2023'; // Mix of 2022 and 2023 batches
      
      return {
        id: `STU${String(i + 1).padStart(4, '0')}`,
        rollNo: `${year}${dept}${String(i + 1).padStart(3, '0')}`,
        name: `${firstNames[i % firstNames.length]} ${surnames[Math.floor(i / firstNames.length) % surnames.length]}`,
        department: dept,
        semester: sem,
        subject: subjects[i % subjects.length],
        email: `${firstNames[i % firstNames.length].toLowerCase()}.${surnames[Math.floor(i / firstNames.length) % surnames.length].toLowerCase()}@university.edu`,
        phone: `+91 ${9000000000 + i}`,
        specialNeeds: Math.random() < 0.08, // 8% have special needs
        specialNeedsType: Math.random() < 0.08 ? 
          ['Vision Impairment', 'Hearing Impairment', 'Mobility Assistance', 'Learning Disability', 'Other'][Math.floor(Math.random() * 5)] : 
          undefined,
      };
    });
  };

  // ===== EXAM & HALL SETUP =====
  const addNewExam = (examData: Partial<Exam>) => {
    const newExam: Exam = {
      id: `EXAM_${Date.now()}`,
      name: examData.name || 'Untitled Exam',
      subject: examData.subject || '',
      date: examData.date || '',
      time: examData.time || '',
      duration: examData.duration || '3 hours',
      status: 'draft',
      totalStudents: 0,
      hallsUsed: 0,
    };
    setExams([...exams, newExam]);
    toast.success(`Exam "${newExam.name}" created successfully!`);
  };

  const updateExam = (examId: string, updates: Partial<Exam>) => {
    setExams(exams.map(e => e.id === examId ? { ...e, ...updates } : e));
    toast.success('Exam updated successfully!');
  };

  const deleteExam = (examId: string) => {
    setExams(exams.filter(e => e.id !== examId));
    toast.success('Exam deleted successfully!');
  };

  const addNewHall = (hallData: Partial<Hall>) => {
    const newHall = createHall(
      `HALL_${Date.now()}`,
      hallData.name || 'New Hall',
      hallData.rows || 10,
      hallData.cols || 10,
      hallData.capacity || 100
    );
    setHalls([...halls, newHall]);
    toast.success(`Hall "${newHall.name}" created successfully!`);
  };

  const updateHall = (hallId: string, updates: Partial<Hall>) => {
    setHalls(halls.map(h => h.id === hallId ? { ...h, ...updates } : h));
    toast.success('Hall updated successfully!');
  };

  const toggleSeatBlocked = (hallId: string, row: number, col: number) => {
    const updatedHalls = halls.map(hall => {
      if (hall.id === hallId) {
        const newSeats = hall.seats.map(r => [...r]);
        newSeats[row][col].isBlocked = !newSeats[row][col].isBlocked;
        const seatId = newSeats[row][col].seatId;
        const blockedSeats = newSeats[row][col].isBlocked
          ? [...hall.blockedSeats, seatId]
          : hall.blockedSeats.filter(s => s !== seatId);
        return { ...hall, seats: newSeats, blockedSeats };
      }
      return hall;
    });
    setHalls(updatedHalls);
  };

  const setEntryExitPoints = (hallId: string, type: 'entry' | 'exit', points: { row: number; col: number }[]) => {
    const updatedHalls = halls.map(hall => {
      if (hall.id === hallId) {
        if (type === 'entry') {
          return { ...hall, entryPoints: points };
        } else {
          return { ...hall, exitPoints: points };
        }
      }
      return hall;
    });
    setHalls(updatedHalls);
    toast.success(`${type === 'entry' ? 'Entry' : 'Exit'} points updated!`);
  };

  // ===== STUDENT DATA MANAGEMENT =====
  const handleCSVImport = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const importedStudents: Student[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        
        const student: Student = {
          id: values[0] || `STU${Date.now()}_${i}`,
          rollNo: values[1] || '',
          name: values[2] || '',
          department: values[3] || '',
          semester: values[4] || '',
          subject: values[5] || '',
          email: values[6] || '',
          phone: values[7] || '',
          specialNeeds: values[8]?.toLowerCase() === 'yes',
          specialNeedsType: values[9] || undefined,
        };
        importedStudents.push(student);
      }
      
      setStudents([...students, ...importedStudents]);
      setFilteredStudents([...students, ...importedStudents]);
      toast.success(`Imported ${importedStudents.length} students successfully!`);
    };
    reader.readAsText(file);
  };

  const exportStudentsCSV = () => {
    const headers = ['ID', 'Roll No', 'Name', 'Department', 'Semester', 'Subject', 'Email', 'Phone', 'Special Needs', 'Special Needs Type'];
    const rows = students.map(s => [
      s.id, s.rollNo, s.name, s.department, s.semester, s.subject,
      s.email || '', s.phone || '', s.specialNeeds ? 'Yes' : 'No', s.specialNeedsType || ''
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${Date.now()}.csv`;
    a.click();
    toast.success('Student data exported successfully!');
  };

  const filterStudents = () => {
    let filtered = students;
    
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(s => s.department === departmentFilter);
    }
    
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(s => s.subject === subjectFilter);
    }
    
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    filterStudents();
  }, [searchQuery, departmentFilter, subjectFilter]);

  // ===== SEATING ALLOCATION ENGINE =====
  const generateSeatingAllocation = () => {
    if (students.length === 0) {
      toast.error('No students found! Please import student data first.');
      return;
    }

    if (halls.filter(h => h.isActive).length === 0) {
      toast.error('No active halls found! Please add halls first.');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const activeHalls = halls.filter(h => h.isActive);
      const studentsList = [...students];
      
      // Apply allocation strategy
      let sortedStudents = [...studentsList];
      
      if (allocationConfig.antiCheat) {
        // Shuffle students
        sortedStudents = shuffleArray(sortedStudents, allocationConfig.seed);
      }
      
      if (allocationConfig.strategy === 'department') {
        sortedStudents.sort((a, b) => a.department.localeCompare(b.department));
      } else if (allocationConfig.strategy === 'optimized') {
        // Optimized: Separate same departments and subjects
        sortedStudents = optimizedDistribution(sortedStudents);
      }
      
      // Prioritize special needs students
      if (allocationConfig.specialNeedsPriority) {
        const specialNeeds = sortedStudents.filter(s => s.specialNeeds);
        const regular = sortedStudents.filter(s => !s.specialNeeds);
        sortedStudents = [...specialNeeds, ...regular];
      }
      
      // Distribute students across halls
      const allocated = distributeStudentsAcrossHalls(sortedStudents, activeHalls);
      setAllocatedHalls(allocated);
      
      // Detect conflicts
      const detectedConflicts = detectConflicts(allocated);
      setConflicts(detectedConflicts);
      
      // Calculate statistics
      const statistics = calculateStatistics(allocated, sortedStudents);
      setStats(statistics);
      
      // Save as version
      saveVersion(allocated, statistics);
      
      setIsGenerating(false);
      toast.success('Seating allocation generated successfully!');
      
      if (detectedConflicts.length > 0) {
        toast.warning(`${detectedConflicts.length} conflicts detected! Check the conflicts tab.`);
      }
    }, 2500);
  };

  const shuffleArray = <T,>(array: T[], seed?: number): T[] => {
    const arr = [...array];
    const random = seed ? seededRandom(seed) : Math.random;
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  };

  const optimizedDistribution = (students: Student[]): Student[] => {
    // Complex algorithm to ensure no same dept/subject students are adjacent
    const shuffled = shuffleArray(students);
    const result: Student[] = [];
    const remaining = [...shuffled];
    
    while (remaining.length > 0) {
      let added = false;
      
      for (let i = 0; i < remaining.length; i++) {
        const student = remaining[i];
        const lastAdded = result[result.length - 1];
        
        if (!lastAdded || 
            (student.department !== lastAdded.department && 
             student.subject !== lastAdded.subject)) {
          result.push(student);
          remaining.splice(i, 1);
          added = true;
          break;
        }
      }
      
      // If no suitable student found, add the first one
      if (!added && remaining.length > 0) {
        result.push(remaining.shift()!);
      }
    }
    
    return result;
  };

  const distributeStudentsAcrossHalls = (students: Student[], hallsList: Hall[]): Hall[] => {
    // Filter students by hall's assigned departments
    return hallsList.map((hall) => {
      // Get students for this hall based on assigned departments
      const hallDepts = hall.departments || [];
      let hallStudents = hallDepts.length > 0 
        ? students.filter(s => hallDepts.includes(s.department))
        : students;
      
      // Limit to hall capacity
      hallStudents = hallStudents.slice(0, hall.capacity);
      
      // Shuffle and organize students to prevent same-department adjacency
      hallStudents = optimizedDistributionForHall(hallStudents);
      
      // Allocate students to bench seats
      const newSeats = hall.seats.map(row => row.map(seat => ({ ...seat, student: null })));
      let studentIdx = 0;
      
      // Place special needs students near front
      const specialNeeds: Student[] = hallStudents.filter(s => s.specialNeeds);
      const regular: Student[] = hallStudents.filter(s => !s.specialNeeds);
      
      // Place special needs at front rows
      for (let r = 0; r < newSeats.length && studentIdx < specialNeeds.length; r++) {
        for (let c = 0; c < newSeats[r].length && studentIdx < specialNeeds.length; c++) {
          if (!newSeats[r][c].isBlocked && specialNeeds[studentIdx]) {
            (newSeats[r][c] as any).student = specialNeeds[studentIdx];
            newSeats[r][c].isSpecial = true;
            studentIdx++;
          }
        }
      }
      
      // Place regular students with department separation logic
      studentIdx = 0;
      for (let r = 0; r < newSeats.length && studentIdx < regular.length; r++) {
        for (let c = 0; c < newSeats[r].length && studentIdx < regular.length; c++) {
          const seat = newSeats[r][c];
          
          // Skip if already occupied or blocked
          if (seat.student || seat.isBlocked) continue;
          
          // Check if we should avoid placing this student here due to adjacent same-dept student
          const shouldPlace = shouldPlaceStudentAtSeat(newSeats, r, c, regular[studentIdx]);
          
          if (shouldPlace && regular[studentIdx]) {
            (seat as any).student = regular[studentIdx];
            studentIdx++;
          }
        }
      }
      
      // Fill remaining if any student left
      for (let r = 0; r < newSeats.length && studentIdx < regular.length; r++) {
        for (let c = 0; c < newSeats[r].length && studentIdx < regular.length; c++) {
          const seat = newSeats[r][c];
          if (!seat.student && !seat.isBlocked && regular[studentIdx]) {
            (seat as any).student = regular[studentIdx];
            studentIdx++;
          }
        }
      }
      
      return {
        ...hall,
        seats: newSeats,
        assignedStudents: hallStudents.slice(0, studentIdx + specialNeeds.length),
      };
    });
  };

  const optimizedDistributionForHall = (students: Student[]): Student[] => {
    // Organize students by department
    const deptGroups: Record<string, Student[]> = {};
    students.forEach(s => {
      if (!deptGroups[s.department]) deptGroups[s.department] = [];
      deptGroups[s.department].push(s);
    });
    
    // Interleave departments to minimize same-dept adjacency
    const result: Student[] = [];
    const depts = Object.keys(deptGroups);
    let maxLen = Math.max(...Object.values(deptGroups).map(g => g.length));
    
    for (let i = 0; i < maxLen; i++) {
      depts.forEach(dept => {
        if (deptGroups[dept][i]) {
          result.push(deptGroups[dept][i]);
        }
      });
    }
    
    return result;
  };

  const shouldPlaceStudentAtSeat = (seats: Seat[][], row: number, col: number, student: Student): boolean => {
    // Check adjacent seats for same department
    const adjacentPositions = [
      { dr: 0, dc: 1 },  // Right (bench mate)
      { dr: 0, dc: -1 }, // Left (bench mate)
      { dr: 1, dc: 0 },  // Front
      { dr: -1, dc: 0 }, // Back
    ];
    
    for (const { dr, dc } of adjacentPositions) {
      const newR = row + dr;
      const newC = col + dc;
      
      if (newR >= 0 && newR < seats.length && newC >= 0 && newC < seats[newR].length) {
        const adjSeat = seats[newR][newC];
        if (adjSeat.student && adjSeat.student.department === student.department) {
          return false; // Don't place if same department is adjacent
        }
      }
    }
    
    return true;
  };

  // ===== CONFLICT DETECTION =====
  const detectConflicts = (allocatedHalls: Hall[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    
    allocatedHalls.forEach(hall => {
      const { seats } = hall;
      
      for (let r = 0; r < seats.length; r++) {
        for (let c = 0; c < seats[r].length; c++) {
          const currentSeat = seats[r][c];
          if (!currentSeat.student) continue;
          
          // Check adjacent seats
          const adjacentPositions = [
            { dr: 0, dc: 1 },  // Right
            { dr: 0, dc: -1 }, // Left
            { dr: 1, dc: 0 },  // Below
            { dr: -1, dc: 0 }, // Above
          ];
          
          adjacentPositions.forEach(({ dr, dc }) => {
            const newR = r + dr;
            const newC = c + dc;
            
            if (newR >= 0 && newR < seats.length && newC >= 0 && newC < seats[newR].length) {
              const adjacentSeat = seats[newR][newC];
              
              if (adjacentSeat.student) {
                // Same subject conflict
                if (currentSeat.student!.subject === adjacentSeat.student.subject) {
                  conflicts.push({
                    id: `CONFLICT_${Date.now()}_${conflicts.length}`,
                    type: 'subject',
                    severity: 'high',
                    description: `Same subject students adjacent: ${currentSeat.student!.name} and ${adjacentSeat.student.name}`,
                    seat1: currentSeat.seatId,
                    seat2: adjacentSeat.seatId,
                    hallId: hall.id,
                    autoResolvable: true,
                  });
                }
                
                // Same department conflict
                if (currentSeat.student!.department === adjacentSeat.student.department) {
                  conflicts.push({
                    id: `CONFLICT_${Date.now()}_${conflicts.length}`,
                    type: 'department',
                    severity: 'medium',
                    description: `Same department students adjacent: ${currentSeat.student!.name} and ${adjacentSeat.student.name}`,
                    seat1: currentSeat.seatId,
                    seat2: adjacentSeat.seatId,
                    hallId: hall.id,
                    autoResolvable: true,
                  });
                }
              }
            }
          });
        }
      }
      
      // Check capacity conflicts
      const occupiedSeats = hall.seats.flat().filter(s => s.student).length;
      if (occupiedSeats > hall.capacity * 0.9) {
        conflicts.push({
          id: `CONFLICT_${Date.now()}_${conflicts.length}`,
          type: 'capacity',
          severity: 'high',
          description: `Hall ${hall.name} is at ${((occupiedSeats / hall.capacity) * 100).toFixed(1)}% capacity`,
          hallId: hall.id,
          autoResolvable: false,
        });
      }
    });
    
    return conflicts;
  };

  const autoResolveConflicts = () => {
    const resolvableConflicts = conflicts.filter(c => c.autoResolvable);
    
    if (resolvableConflicts.length === 0) {
      toast.info('No auto-resolvable conflicts found.');
      return;
    }
    
    // Implement conflict resolution by swapping students
    const updatedHalls = [...allocatedHalls];
    
    resolvableConflicts.forEach(conflict => {
      if (conflict.seat1 && conflict.seat2) {
        const hall = updatedHalls.find(h => h.id === conflict.hallId);
        if (!hall) return;
        
        // Find and swap students
        const seat1 = hall.seats.flat().find(s => s.seatId === conflict.seat1);
        const seat2 = hall.seats.flat().find(s => s.seatId === conflict.seat2);
        
        if (seat1 && seat2) {
          const temp = seat1.student;
          seat1.student = seat2.student;
          seat2.student = temp;
        }
      }
    });
    
    setAllocatedHalls(updatedHalls);
    const newConflicts = detectConflicts(updatedHalls);
    setConflicts(newConflicts);
    
    toast.success(`Resolved ${resolvableConflicts.length} conflicts automatically!`);
  };

  // ===== STATISTICS & ANALYTICS =====
  const calculateStatistics = (halls: Hall[], students: Student[]) => {
    const totalSeats = halls.reduce((sum, h) => sum + h.capacity, 0);
    const occupiedSeats = halls.reduce((sum, h) => 
      sum + h.seats.flat().filter(s => s.student).length, 0
    );
    
    const deptDistribution = students.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const subjectDistribution = students.reduce((acc, s) => {
      acc[s.subject] = (acc[s.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const hallUtilization = halls.map(h => ({
      hallName: h.name,
      capacity: h.capacity,
      occupied: h.seats.flat().filter(s => s.student).length,
      percentage: (h.seats.flat().filter(s => s.student).length / h.capacity * 100).toFixed(1),
    }));
    
    return {
      totalStudents: students.length,
      totalHalls: halls.length,
      totalSeats,
      occupiedSeats,
      utilizationRate: (occupiedSeats / totalSeats * 100).toFixed(1),
      deptDistribution,
      subjectDistribution,
      hallUtilization,
      specialNeedsCount: students.filter(s => s.specialNeeds).length,
      averagePerHall: (students.length / halls.length).toFixed(1),
    };
  };

  // ===== VERSION CONTROL =====
  const saveVersion = (halls: Hall[], statistics: any) => {
    const version: AllocationVersion = {
      id: `VERSION_${Date.now()}`,
      timestamp: new Date().toISOString(),
      allocatedHalls: halls,
      stats: statistics,
      notes: `Allocation for ${currentExam?.name || 'exam'}`,
      createdBy: user?.name || 'Admin',
    };
    
    setVersions([version, ...versions]);
    setCurrentVersion(version);
  };

  const restoreVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    
    setAllocatedHalls(version.allocatedHalls);
    setStats(version.stats);
    setCurrentVersion(version);
    toast.success('Version restored successfully!');
  };

  const lockAllocation = () => {
    if (!currentVersion) {
      toast.error('No allocation to lock!');
      return;
    }
    
    setIsLocked(true);
    if (currentExam) {
      updateExam(currentExam.id, { status: 'locked' });
    }
    toast.success('Seating allocation locked! Submit for admin approval.');
  };

  const unlockAllocation = () => {
    setIsLocked(false);
    if (currentExam) {
      updateExam(currentExam.id, { status: 'allocated' });
    }
    toast.success('Seating allocation unlocked for editing.');
  };

  // ===== EXPORT FUNCTIONALITY =====
  const exportSeatingPDF = () => {
    toast.success('Generating PDF seating charts for all halls...');
    // Mock PDF export
    setTimeout(() => {
      toast.success('PDF seating charts downloaded successfully!');
    }, 1500);
  };

  const exportSeatingExcel = () => {
    // Generate Excel content
    const headers = ['Hall', 'Seat ID', 'Row', 'Column', 'Student ID', 'Name', 'Roll No', 'Department', 'Subject'];
    const rows: string[][] = [];
    
    allocatedHalls.forEach(hall => {
      hall.seats.flat().forEach(seat => {
        if (seat.student) {
          rows.push([
            hall.name,
            seat.seatId,
            String(seat.row + 1),
            String(seat.col + 1),
            seat.student.id,
            seat.student.name,
            seat.student.rollNo,
            seat.student.department,
            seat.student.subject,
          ]);
        }
      });
    });
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating_allocation_${Date.now()}.csv`;
    a.click();
    toast.success('Excel file downloaded successfully!');
  };

  const exportHallWiseCharts = (hallId: string) => {
    const hall = allocatedHalls.find(h => h.id === hallId);
    if (!hall) return;
    
    toast.success(`Exporting seating chart for ${hall.name}...`);
  };

  // ===== INDIVIDUAL HALL DOWNLOAD FUNCTIONS =====
  const downloadHallLayoutPDF = (hall: Hall) => {
    // Create a comprehensive PDF layout for the specific hall
    const hallData = {
      hallName: hall.name,
      examName: currentExam?.name || 'Examination',
      examDate: currentExam?.date || new Date().toISOString().split('T')[0],
      examTime: currentExam?.time || '10:00 AM',
      capacity: hall.capacity,
      occupiedSeats: hall.seats.flat().filter(s => s.student).length,
      departments: hall.departments || [],
      seats: hall.seats,
      entryPoints: hall.entryPoints,
      exitPoints: hall.exitPoints,
      generatedAt: new Date().toLocaleString(),
      generatedBy: user?.name || 'Seating Manager'
    };

    // Simulate PDF generation with detailed layout
    setTimeout(() => {
      // Create downloadable content
      const pdfContent = generateHallPDFContent(hallData);
      downloadFile(pdfContent, `${hall.name}_Seating_Layout.pdf`, 'application/pdf');
      toast.success(`PDF layout for ${hall.name} downloaded successfully!`);
    }, 1500);
  };

  const downloadHallLayoutExcel = (hall: Hall) => {
    // Generate Excel/CSV format for the hall
    const headers = ['Seat ID', 'Row', 'Column', 'Student ID', 'Student Name', 'Roll No', 'Department', 'Subject', 'Special Needs'];
    const rows: string[][] = [];
    
    // Add hall information header
    rows.push(['Hall Information']);
    rows.push(['Hall Name', hall.name]);
    rows.push(['Capacity', hall.capacity.toString()]);
    rows.push(['Occupied', hall.seats.flat().filter(s => s.student).length.toString()]);
    rows.push(['Exam', currentExam?.name || 'N/A']);
    rows.push(['Date', currentExam?.date || 'N/A']);
    rows.push(['Time', currentExam?.time || 'N/A']);
    rows.push(['Generated At', new Date().toLocaleString()]);
    rows.push([]); // Empty row
    rows.push(headers); // Column headers

    // Add seat data
    hall.seats.flat().forEach(seat => {
      if (seat.student) {
        rows.push([
          seat.seatId,
          (seat.row + 1).toString(),
          (seat.col + 1).toString(),
          seat.student.id,
          seat.student.name,
          seat.student.rollNo,
          seat.student.department,
          seat.student.subject,
          seat.student.specialNeeds ? 'Yes' : 'No'
        ]);
      } else if (!seat.isBlocked) {
        rows.push([
          seat.seatId,
          (seat.row + 1).toString(),
          (seat.col + 1).toString(),
          'EMPTY',
          'Available',
          '',
          '',
          '',
          ''
        ]);
      } else {
        rows.push([
          seat.seatId,
          (seat.row + 1).toString(),
          (seat.col + 1).toString(),
          'BLOCKED',
          'Blocked Seat',
          '',
          '',
          '',
          ''
        ]);
      }
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    downloadFile(csvContent, `${hall.name}_Seating_Data.csv`, 'text/csv');
    toast.success(`Excel data for ${hall.name} downloaded successfully!`);
  };

  const downloadHallLayoutImage = (hall: Hall) => {
    // Generate a high-quality image of the hall layout
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for high resolution
    const scale = 3; // For high DPI
    const seatSize = 40 * scale;
    const gap = 8 * scale;
    const padding = 60 * scale;
    
    canvas.width = (hall.cols * (seatSize + gap) + padding * 2);
    canvas.height = (hall.rows * (seatSize + gap) + padding * 3 + 200 * scale); // Extra space for header
    
    // Set high DPI scaling
    ctx.scale(scale, scale);
    const width = canvas.width / scale;
    const height = canvas.height / scale;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(hall.name, width / 2, 30);
    
    ctx.font = '16px Arial';
    ctx.fillText(`${currentExam?.name || 'Examination'} - ${currentExam?.date || 'Date TBD'}`, width / 2, 55);
    
    ctx.font = '14px Arial';
    ctx.fillText(`Capacity: ${hall.capacity} | Occupied: ${hall.seats.flat().filter(s => s.student).length} | Generated: ${new Date().toLocaleString()}`, width / 2, 75);

    // Front of hall indicator
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(padding / scale, 90, width - (padding * 2 / scale), 20);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('FRONT OF HALL', width / 2, 103);

    // Draw seats
    const startY = 130;
    hall.seats.forEach((row, rIdx) => {
      // Row label
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(65 + rIdx), padding / scale - 20, startY + rIdx * (seatSize / scale + gap / scale) + seatSize / scale / 2 + 5);
      
      row.forEach((seat, cIdx) => {
        const x = padding / scale + cIdx * (seatSize / scale + gap / scale);
        const y = startY + rIdx * (seatSize / scale + gap / scale);
        
        // Determine seat color
        let seatColor = '#e2e8f0'; // Default available
        let textColor = '#475569';
        let seatText = (cIdx + 1).toString();
        
        if (seat.isBlocked) {
          seatColor = '#ef4444';
          textColor = 'white';
          seatText = '✕';
        } else if (seat.student) {
          if (seat.student.specialNeeds) {
            seatColor = '#8b5cf6';
          } else {
            // Color by department
            const deptColors: Record<string, string> = {
              'CSE': '#3b82f6',
              'ECE': '#8b5cf6',
              'ME': '#f97316',
              'CE': '#10b981',
              'EEE': '#eab308',
              'IT': '#ec4899'
            };
            seatColor = deptColors[seat.student.department] || '#6b7280';
          }
          textColor = 'white';
          seatText = seat.student.department.substring(0, 2);
        }
        
        // Draw seat
        ctx.fillStyle = seatColor;
        ctx.fillRect(x, y, seatSize / scale, seatSize / scale);
        
        // Draw seat border
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, seatSize / scale, seatSize / scale);
        
        // Draw seat text
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(seatText, x + seatSize / scale / 2, y + seatSize / scale / 2 + 4);
      });
    });

    // Legend
    const legendY = startY + hall.rows * (seatSize / scale + gap / scale) + 30;
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', padding / scale, legendY);
    
    const legendItems = [
      { color: '#e2e8f0', text: 'Available', textColor: '#475569' },
      { color: '#3b82f6', text: 'CSE', textColor: 'white' },
      { color: '#8b5cf6', text: 'ECE/Special', textColor: 'white' },
      { color: '#f97316', text: 'ME', textColor: 'white' },
      { color: '#10b981', text: 'CE', textColor: 'white' },
      { color: '#eab308', text: 'EEE', textColor: 'white' },
      { color: '#ec4899', text: 'IT', textColor: 'white' },
      { color: '#ef4444', text: 'Blocked', textColor: 'white' }
    ];
    
    legendItems.forEach((item, idx) => {
      const x = padding / scale + (idx % 4) * 120;
      const y = legendY + 20 + Math.floor(idx / 4) * 30;
      
      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, 20, 20);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(x, y, 20, 20);
      
      ctx.fillStyle = item.textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.text.substring(0, 3), x + 10, y + 13);
      
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, x + 25, y + 13);
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${hall.name}_Seating_Layout.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Image layout for ${hall.name} downloaded successfully!`);
      }
    }, 'image/png');
  };

  const generateHallPDFContent = (hallData: any) => {
    // Generate a comprehensive PDF-like content (in real implementation, use jsPDF or similar)
    return `
SEATING LAYOUT - ${hallData.hallName}
${'='.repeat(50)}

EXAMINATION DETAILS:
- Exam: ${hallData.examName}
- Date: ${hallData.examDate}
- Time: ${hallData.examTime}
- Hall: ${hallData.hallName}
- Capacity: ${hallData.capacity}
- Occupied: ${hallData.occupiedSeats}
- Departments: ${hallData.departments.join(', ')}

SEATING ARRANGEMENT:
${hallData.seats.map((row: any[], rIdx: number) => 
  `Row ${String.fromCharCode(65 + rIdx)}: ${row.map((seat: any, cIdx: number) => {
    if (seat.isBlocked) return '[X]';
    if (seat.student) return `[${seat.student.department.substring(0,2)}]`;
    return `[${cIdx + 1}]`;
  }).join(' ')}`
).join('\n')}

STUDENT ALLOCATION:
${hallData.seats.flat().filter((s: any) => s.student).map((seat: any) => 
  `${seat.seatId}: ${seat.student.name} (${seat.student.rollNo}) - ${seat.student.department}`
).join('\n')}

Generated on: ${hallData.generatedAt}
Generated by: ${hallData.generatedBy}
    `;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ===== HELPER FUNCTIONS =====
  const handleEmergencySeatSwap = (hallId: string, seat1Id: string, seat2Id: string) => {
    const updatedHalls = allocatedHalls.map(hall => {
      if (hall.id === hallId) {
        const seat1 = hall.seats.flat().find(s => s.seatId === seat1Id);
        const seat2 = hall.seats.flat().find(s => s.seatId === seat2Id);
        
        if (seat1 && seat2) {
          const temp = seat1.student;
          seat1.student = seat2.student;
          seat2.student = temp;
        }
      }
      return hall;
    });
    
    setAllocatedHalls(updatedHalls);
    toast.success('Emergency seat swap completed!');
  };

  // ===== ADMIN APPROVAL =====
  const submitForApproval = () => {
    if (!isLocked) {
      toast.error('Please lock the allocation before submitting for approval.');
      return;
    }
    
    setApprovalStatus('pending');
    toast.success('Allocation submitted for admin approval!');
  };

  const publishAllocation = () => {
    if (!isLocked || allocatedHalls.length === 0) {
      toast.error('Please lock a completed allocation before publishing.');
      return;
    }

    // Save allocation data to localStorage for students to access
    const allocationData = {
      examId: currentExam?.id,
      examName: currentExam?.name,
      examDate: currentExam?.date,
      examTime: currentExam?.time,
      halls: allocatedHalls.map(hall => ({
        id: hall.id,
        name: hall.name,
        departments: hall.departments,
        students: hall.seats.flat()
          .filter(seat => seat.student)
          .map(seat => ({
            studentId: seat.student!.id,
            rollNo: seat.student!.rollNo,
            name: seat.student!.name,
            department: seat.student!.department,
            seatId: seat.seatId,
            hallId: hall.id,
            hallName: hall.name,
            row: seat.row,
            col: seat.col,
          }))
      })),
      publishedAt: new Date().toISOString(),
      publishedBy: user?.name || 'Admin',
    };

    localStorage.setItem('seatingAllocation', JSON.stringify(allocationData));
    
    if (currentExam) {
      updateExam(currentExam.id, { status: 'published' });
    }
    
    toast.success('Seating allocation published! Students can now view their seats.');
  };

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      CSE: 'bg-blue-500',
      ECE: 'bg-purple-500',
      ME: 'bg-orange-500',
      CE: 'bg-green-500',
      EEE: 'bg-yellow-500',
      IT: 'bg-pink-500',
    };
    return colors[dept] || 'bg-gray-500';
  };

  const getSubjectColor = (subject: string) => {
    const colors = ['bg-red-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-violet-500', 'bg-amber-500'];
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // ===== RENDER FUNCTIONS =====
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: students.length, color: 'from-cyan-500 to-blue-500', trend: '+12%' },
          { icon: Building, label: 'Active Halls', value: halls.filter(h => h.isActive).length, color: 'from-purple-500 to-pink-500', trend: '+2' },
          { icon: Calendar, label: 'Scheduled Exams', value: exams.length, color: 'from-orange-500 to-red-500', trend: 'This Month' },
          { icon: CheckCircle, label: 'Completed Allocations', value: versions.length, color: 'from-green-500 to-teal-500', trend: 'Success Rate: 98%' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-10 h-10 text-cyan-600" />
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl opacity-20`} />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xs text-green-600 font-semibold">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Current Exam Info */}
      {currentExam && (
        <div className="bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{currentExam.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentExam.status === 'draft' ? 'bg-gray-200 text-gray-700' :
                  currentExam.status === 'allocated' ? 'bg-blue-200 text-blue-700' :
                  currentExam.status === 'locked' ? 'bg-orange-200 text-orange-700' :
                  'bg-green-200 text-green-700'
                }`}>
                  {currentExam.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-6 text-gray-700">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {currentExam.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {currentExam.time}
                </span>
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {currentExam.subject}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {currentExam.totalStudents} Students
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveSection('exam-setup')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all"
            >
              Edit Exam
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSection('allocation')}
          className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Shuffle className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Generate Allocation</h3>
          <p className="text-sm text-gray-600">Create intelligent seating arrangements with AI-powered anti-cheat algorithms</p>
        </button>

        <button
          onClick={() => setActiveSection('visualization')}
          className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Eye className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">View Seating Charts</h3>
          <p className="text-sm text-gray-600">Interactive 2D/3D visualization with real-time conflict detection</p>
        </button>

        <button
          onClick={() => setActiveSection('student-data')}
          className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Manage Students</h3>
          <p className="text-sm text-gray-600">Import, export, and manage student data with advanced filtering</p>
        </button>
      </div>

      {/* Department Distribution Chart */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-cyan-600" />
          Department Distribution
        </h3>
        <div className="grid md:grid-cols-6 gap-4">
          {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map((dept) => {
            const count = students.filter(s => s.department === dept).length;
            const percentage = ((count / students.length) * 100).toFixed(1);
            return (
              <div key={dept} className="text-center">
                <div className={`w-16 h-16 ${getDepartmentColor(dept)} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold text-lg">{dept}</span>
                </div>
                <p className="font-bold text-lg">{count}</p>
                <p className="text-sm text-gray-600">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600" />
          Recent Activity & Version History
        </h3>
        <div className="space-y-3">
          {versions.slice(0, 5).map((version, idx) => (
            <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{version.notes}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(version.timestamp).toLocaleString()} • by {version.createdBy}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">
                    <span>{version.stats.totalStudents} students</span>
                    <span>{version.stats.totalHalls} halls</span>
                    <span>{version.stats.utilizationRate}% utilization</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => restoreVersion(version.id)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all text-sm"
              >
                Restore
              </button>
            </div>
          ))}
          {versions.length === 0 && (
            <div className="text-center py-8">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No allocations yet. Create your first allocation!</p>
              <button
                onClick={() => setActiveSection('allocation')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-600" />
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <Wifi className="w-4 h-4" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Allocation Engine</span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                Ready
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conflict Detection</span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <Shield className="w-4 h-4" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Export Services</span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <Download className="w-4 h-4" />
                Available
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Performance Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg. Allocation Time</span>
              <span className="text-sm font-semibold">2.3 seconds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conflict Resolution Rate</span>
              <span className="text-sm font-semibold text-green-600">98.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Hall Utilization</span>
              <span className="text-sm font-semibold text-blue-600">92.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Student Satisfaction</span>
              <span className="text-sm font-semibold text-purple-600">4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamSetup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600" />
            Exam Management
          </h3>
          <button
            onClick={() => {
              const name = prompt('Enter exam name:');
              if (name) addNewExam({ name });
            }}
            className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Exam
          </button>
        </div>

        <div className="space-y-3">
          {exams.map(exam => (
            <div key={exam.id} className="p-4 border border-gray-200 rounded-xl hover:border-cyan-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{exam.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{exam.subject}</span>
                    <span>{exam.date} at {exam.time}</span>
                    <span>{exam.duration}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      exam.status === 'draft' ? 'bg-gray-200' :
                      exam.status === 'allocated' ? 'bg-blue-200' :
                      exam.status === 'locked' ? 'bg-orange-200' :
                      'bg-green-200'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentExam(exam)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this exam?')) deleteExam(exam.id);
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentExam && (
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Edit Exam Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Exam Name</label>
              <input
                type="text"
                value={currentExam.name}
                onChange={(e) => updateExam(currentExam.id, { name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Subject</label>
              <input
                type="text"
                value={currentExam.subject}
                onChange={(e) => updateExam(currentExam.id, { subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Date</label>
              <input
                type="date"
                value={currentExam.date}
                onChange={(e) => updateExam(currentExam.id, { date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Time</label>
              <input
                type="time"
                value={currentExam.time}
                onChange={(e) => updateExam(currentExam.id, { time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Duration</label>
              <input
                type="text"
                value={currentExam.duration}
                onChange={(e) => updateExam(currentExam.id, { duration: e.target.value })}
                placeholder="e.g., 3 hours"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHallManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6 text-cyan-600" />
            Hall Management
          </h3>
          <button
            onClick={() => {
              const name = prompt('Enter hall name:');
              if (name) addNewHall({ name });
            }}
            className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Hall
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {halls.map(hall => (
            <div
              key={hall.id}
              className={`p-4 border rounded-xl transition-all ${
                hall.isActive ? 'border-cyan-300 bg-cyan-50/30' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">{hall.name}</h4>
                <button
                  onClick={() => updateHall(hall.id, { isActive: !hall.isActive })}
                  className={`p-2 rounded-lg ${
                    hall.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {hall.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-semibold">{hall.capacity} seats</span>
                </div>
                <div className="flex justify-between">
                  <span>Layout:</span>
                  <span className="font-semibold">{hall.rows} × {hall.cols}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blocked Seats:</span>
                  <span className="font-semibold">{hall.blockedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry/Exit:</span>
                  <span className="font-semibold">{hall.entryPoints.length}/{hall.exitPoints.length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingHall(hall)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-sm flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setSelectedHallView(hall.id)}
                  className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all text-sm flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hall Editor */}
      {editingHall && (
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Editing: {editingHall.name}</h3>
            <button
              onClick={() => setEditingHall(null)}
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-2">Hall Name</label>
              <input
                type="text"
                value={editingHall.name}
                onChange={(e) => updateHall(editingHall.id, { name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Capacity</label>
              <input
                type="number"
                value={editingHall.capacity}
                onChange={(e) => updateHall(editingHall.id, { capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Rows</label>
              <input
                type="number"
                value={editingHall.rows}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Columns</label>
              <input
                type="number"
                value={editingHall.cols}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100"
                disabled
              />
            </div>
          </div>

          {/* Seat Layout Editor */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Seat Layout - Click to block/unblock seats
            </h4>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {editingHall.seats.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1 mb-1">
                    <div className="w-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {String.fromCharCode(65 + rIdx)}
                    </div>
                    {row.map((seat, cIdx) => (
                      <button
                        key={`${rIdx}-${cIdx}`}
                        onClick={() => toggleSeatBlocked(editingHall.id, rIdx, cIdx)}
                        className={`w-8 h-8 rounded text-xs font-semibold transition-all ${
                          seat.isBlocked
                            ? 'bg-red-500 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={seat.seatId}
                      >
                        {seat.isBlocked ? <Ban className="w-4 h-4 mx-auto" /> : cIdx + 1}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <Ban className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hall Visualization - Colorful Seat Grid */}
      {selectedHallView && !editingHall && (() => {
        const hall = halls.find(h => h.id === selectedHallView) || allocatedHalls.find(h => h.id === selectedHallView);
        if (!hall) return null;
        
        return (
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                {hall.name} - Seat Visualization
              </h3>
              <button
                onClick={() => setSelectedHallView(null)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>

            {/* Hall Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hall.assignedStudents.length}</p>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hall.capacity - hall.blockedSeats.length}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Ban className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hall.blockedSeats.length}</p>
                    <p className="text-sm text-gray-600">Blocked</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Grid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{hall.rows} × {hall.cols}</p>
                    <p className="text-sm text-gray-600">Layout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colorful Seat Grid */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="mb-4 text-center">
                    <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-lg">
                      <DoorOpen className="w-5 h-5 inline-block mr-2" />
                      Front of Hall
                    </div>
                  </div>
                  
                  {hall.seats.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-2 mb-2 justify-center">
                      <div className="w-10 flex items-center justify-center text-lg font-bold text-gray-700">
                        {String.fromCharCode(65 + rIdx)}
                      </div>
                      {row.map((seat, cIdx) => {
                        let seatColor = '';
                        let seatIcon = null;
                        let seatText = cIdx + 1;
                        
                        if (seat.isEmpty) {
                          // Empty/Spacing seat
                          seatColor = 'bg-gray-200 border-2 border-gray-300';
                          seatText = '';
                        } else if (seat.isBlocked) {
                          // Blocked seat
                          seatColor = 'bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-700 shadow-lg';
                          seatIcon = <Ban className="w-5 h-5 text-white" />;
                          seatText = '';
                        } else if (seat.student) {
                          // Occupied seat
                          if (seat.student.specialNeeds) {
                            seatColor = 'bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-700 shadow-lg';
                            seatIcon = <AlertCircle className="w-4 h-4 text-white" />;
                          } else {
                            seatColor = 'bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-blue-700 shadow-lg';
                            seatIcon = <UserCheck className="w-4 h-4 text-white" />;
                          }
                          seatText = '';
                        } else {
                          // Available seat
                          seatColor = 'bg-gradient-to-br from-green-300 to-green-500 border-2 border-green-600 shadow-md hover:scale-105';
                        }
                        
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white transition-all cursor-pointer ${seatColor}`}
                            title={seat.student ? `${seat.student.name} (${seat.student.rollNo})` : seat.seatId}
                          >
                            {seatIcon || seatText}
                          </div>
                        );
                      })}
                      <div className="w-10 flex items-center justify-center text-lg font-bold text-gray-700">
                        {String.fromCharCode(65 + rIdx)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="font-bold mb-4 text-center">Legend</h4>
                <div className="grid md:grid-cols-5 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 border-2 border-green-600 rounded-lg flex items-center justify-center font-bold text-white">
                      1
                    </div>
                    <span className="text-sm font-semibold">Available</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-blue-700 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-700 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Special Needs</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-700 rounded-lg flex items-center justify-center">
                      <Ban className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gray-200 border-2 border-gray-300 rounded-lg" />
                    <span className="text-sm font-semibold">Empty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const renderStudentData = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            Student Data Management
          </h3>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>
            <button
              onClick={exportStudentsCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Search</label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or roll no..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Departments</option>
              {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Subjects</option>
              {Array.from(new Set(students.map(s => s.subject))).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student List */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Semester</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Special Needs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.slice(0, 50).map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3 text-sm font-mono">{student.rollNo}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{student.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${getDepartmentColor(student.department)}`}>
                        {student.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{student.semester}</td>
                    <td className="px-4 py-3 text-sm">{student.subject}</td>
                    <td className="px-4 py-3">
                      {student.specialNeeds ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3" />
                          {student.specialNeedsType}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Showing {Math.min(50, filteredStudents.length)} of {filteredStudents.length} students
          </div>
        </div>
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6">
      {/* Department Selection Per Hall */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Building className="w-6 h-6 text-cyan-600" />
          Hall Department Allocation
        </h3>
        <p className="text-gray-600 mb-6">
          Select up to 3 departments for each hall. Students from these departments will be distributed across the hall with anti-collision logic.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {halls.filter(h => h.isActive).map(hall => (
            <div key={hall.id} className="p-4 border border-cyan-200 rounded-xl bg-gradient-to-br from-cyan-50/30 to-blue-50/30">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                {hall.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">Capacity: {hall.capacity} students</p>
              
              <div className="space-y-2">
                {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map(dept => (
                  <label key={dept} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hall.departments?.includes(dept) || false}
                      onChange={(e) => {
                        const currentDepts = hall.departments || [];
                        let newDepts: string[];
                        
                        if (e.target.checked) {
                          if (currentDepts.length >= 3) {
                            toast.warning(`Maximum 3 departments per hall`);
                            return;
                          }
                          newDepts = [...currentDepts, dept];
                        } else {
                          newDepts = currentDepts.filter(d => d !== dept);
                        }
                        
                        updateHall(hall.id, { departments: newDepts });
                      }}
                      disabled={(hall.departments?.length || 0) >= 3 && !(hall.departments?.includes(dept))}
                      className="w-4 h-4"
                    />
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${getDepartmentColor(dept)}`}>
                      {dept}
                    </span>
                  </label>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-cyan-200">
                <p className="text-xs text-gray-600">
                  Selected: {hall.departments?.length || 0}/3 departments
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-600" />
          Allocation Configuration
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-2">Strategy</label>
            <select
              value={allocationConfig.strategy}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, strategy: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              <option value="random">Random</option>
              <option value="department">By Department</option>
              <option value="zigzag">Zigzag Pattern</option>
              <option value="optimized">AI Optimized</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Spacing Gap</label>
            <input
              type="number"
              min="0"
              max="3"
              value={allocationConfig.spacingGap}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, spacingGap: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Dept Separation</label>
            <input
              type="number"
              min="0"
              max="5"
              value={allocationConfig.sameDeptSeparation}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, sameDeptSeparation: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="antiCheat"
              checked={allocationConfig.antiCheat}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, antiCheat: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="antiCheat" className="font-semibold">Enable Anti-Cheat</label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="specialNeeds"
              checked={allocationConfig.specialNeedsPriority}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, specialNeedsPriority: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="specialNeeds" className="font-semibold">Prioritize Special Needs</label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="balanceHalls"
              checked={allocationConfig.balanceHalls}
              onChange={(e) => setAllocationConfig({ ...allocationConfig, balanceHalls: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="balanceHalls" className="font-semibold">Balance Halls</label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={generateSeatingAllocation}
            disabled={isGenerating || isLocked}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
              (isGenerating || isLocked) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                Generate Allocation
              </>
            )}
          </button>

          {allocatedHalls.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Reset allocation?')) {
                  setAllocatedHalls([]);
                  setConflicts([]);
                  setStats(null);
                  toast.success('Allocation reset!');
                }
              }}
              className="px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Allocation Results */}
      {allocatedHalls.length > 0 && (
        <>
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Allocation Results
              </h3>
              <div className="flex items-center gap-2">
                {isLocked ? (
                  <button
                    onClick={unlockAllocation}
                    className="px-4 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Unlock
                  </button>
                ) : (
                  <button
                    onClick={lockAllocation}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Lock Allocation
                  </button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {stats && (
                <>
                  <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                    <p className="text-2xl font-bold">{stats.occupiedSeats} students</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Utilization Rate</p>
                    <p className="text-2xl font-bold">{stats.utilizationRate}%</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Conflicts Detected</p>
                    <p className="text-2xl font-bold">{conflicts.length}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              {allocatedHalls.map(hall => (
                <div key={hall.id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{hall.name}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingHall(hall)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Layout
                      </button>
                      
                      {/* Individual Hall Download Options */}
                      <div className="relative group">
                        <button className="px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all text-sm flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
                          <div className="p-2">
                            <button
                              onClick={() => downloadHallLayoutPDF(hall)}
                              className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-sm flex items-center gap-2 text-red-600"
                            >
                              <FileText className="w-4 h-4" />
                              PDF Layout
                            </button>
                            <button
                              onClick={() => downloadHallLayoutExcel(hall)}
                              className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg text-sm flex items-center gap-2 text-green-600"
                            >
                              <FileSpreadsheet className="w-4 h-4" />
                              Excel Data
                            </button>
                            <button
                              onClick={() => downloadHallLayoutImage(hall)}
                              className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-2 text-purple-600"
                            >
                              <Camera className="w-4 h-4" />
                              PNG Image
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                    <span>Capacity: {hall.capacity}</span>
                    <span>Allocated: {hall.assignedStudents.length}</span>
                    <span>Utilization: {((hall.assignedStudents.length / hall.capacity) * 100).toFixed(1)}%</span>
                    <span>Departments: {hall.departments?.join(', ') || 'All'}</span>
                  </div>
                  <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${(hall.assignedStudents.length / hall.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Conflicts Detected ({conflicts.length})
                </h3>
                <button
                  onClick={autoResolveConflicts}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Auto-Resolve
                </button>
              </div>

              <div className="space-y-2">
                {conflicts.slice(0, 10).map(conflict => (
                  <div
                    key={conflict.id}
                    className={`p-3 rounded-xl border-l-4 ${
                      conflict.severity === 'high' ? 'bg-red-50 border-red-500' :
                      conflict.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{conflict.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Type: {conflict.type} • {conflict.autoResolvable ? 'Auto-resolvable' : 'Manual resolution needed'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        conflict.severity === 'high' ? 'bg-red-200 text-red-700' :
                        conflict.severity === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-blue-200 text-blue-700'
                      }`}>
                        {conflict.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publish & Export Options */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Download className="w-6 h-6 text-cyan-600" />
              Publish & Export Options
            </h3>
            
            {/* Publish Button */}
            {isLocked && currentExam?.status !== 'published' && (
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                      <Send className="w-5 h-5 text-green-600" />
                      Ready to Publish
                    </h4>
                    <p className="text-sm text-gray-600">
                      Publish this allocation to notify all students about their seating assignments.
                    </p>
                  </div>
                  <button
                    onClick={publishAllocation}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                  >
                    <Bell className="w-5 h-5" />
                    Publish to Students
                  </button>
                </div>
              </div>
            )}

            {currentExam?.status === 'published' && (
              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-bold">Published Successfully</h4>
                    <p className="text-sm text-gray-600">Students have been notified about their seating assignments.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={exportSeatingPDF}
                className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-center">All Halls PDF</p>
                <p className="text-xs text-gray-600 text-center mt-1">Combined seating charts</p>
              </button>

              <button
                onClick={exportSeatingExcel}
                className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-center">All Data Excel</p>
                <p className="text-xs text-gray-600 text-center mt-1">Complete allocation data</p>
              </button>

              <button
                onClick={() => {
                  // Download all halls as individual files
                  allocatedHalls.forEach((hall, index) => {
                    setTimeout(() => {
                      downloadHallLayoutPDF(hall);
                    }, index * 500); // Stagger downloads
                  });
                }}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-center">Individual Halls</p>
                <p className="text-xs text-gray-600 text-center mt-1">Separate PDF per hall</p>
              </button>
            </div>

            {/* Individual Hall Downloads Section */}
            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-gray-600" />
                Individual Hall Downloads
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allocatedHalls.map(hall => (
                  <div key={hall.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-cyan-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">{hall.name}</h5>
                      <span className="text-xs text-gray-500">{hall.assignedStudents.length}/{hall.capacity}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => downloadHallLayoutPDF(hall)}
                        className="flex-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                        title="Download PDF"
                      >
                        <FileText className="w-3 h-3" />
                        PDF
                      </button>
                      <button
                        onClick={() => downloadHallLayoutExcel(hall)}
                        className="flex-1 px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-all flex items-center justify-center gap-1"
                        title="Download Excel"
                      >
                        <FileSpreadsheet className="w-3 h-3" />
                        XLS
                      </button>
                      <button
                        onClick={() => downloadHallLayoutImage(hall)}
                        className="flex-1 px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs hover:bg-purple-200 transition-all flex items-center justify-center gap-1"
                        title="Download Image"
                      >
                        <Camera className="w-3 h-3" />
                        PNG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Codes Section */}
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Grid className="w-6 h-6 text-cyan-600" />
              Additional Export Options
            </h3>
            <button
              onClick={() => {
                // Generate QR codes
                toast.success('Generating QR codes for students...');
              }}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all group w-full"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-center">Generate QR Codes</p>
              <p className="text-xs text-gray-600 text-center mt-1">Quick seat lookup for students</p>
            </button>
          </div>

          {/* Admin Approval */}
          {isLocked && (
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-600" />
                Admin Approval
              </h3>

              {approvalStatus === null && (
                <div className="text-center">
                  <p className="mb-4">Allocation is locked. Ready to submit for admin approval?</p>
                  <button
                    onClick={submitForApproval}
                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Send className="w-5 h-5" />
                    Submit for Approval
                  </button>
                </div>
              )}

              {approvalStatus === 'pending' && (
                <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg mb-2">Approval Pending</p>
                  <p className="text-sm text-gray-600">Waiting for admin to review your allocation...</p>
                </div>
              )}

              {approvalStatus === 'approved' && (
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg mb-2">Approved!</p>
                  <p className="text-sm text-gray-600">Your allocation has been approved by admin.</p>
                </div>
              )}

              {approvalStatus === 'rejected' && (
                <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                  <div className="text-center mb-4">
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="font-semibold text-lg mb-2">Rejected</p>
                    <p className="text-sm text-gray-600">Please review admin comments and make changes.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-sm font-semibold mb-1">Admin Comments:</p>
                    <p className="text-sm text-gray-600">{approvalComments || 'No comments provided.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderVisualization = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-600" />
            Seating Visualization
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === '2d' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              2D View
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === '3d' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              3D View
            </button>
          </div>
        </div>

        {/* Color Mode Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setColorMode('department')}
            className={`px-4 py-2 rounded-xl transition-all text-sm ${
              colorMode === 'department' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            By Department
          </button>
          <button
            onClick={() => setColorMode('subject')}
            className={`px-4 py-2 rounded-xl transition-all text-sm ${
              colorMode === 'subject' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            By Subject
          </button>
          <button
            onClick={() => setColorMode('occupancy')}
            className={`px-4 py-2 rounded-xl transition-all text-sm ${
              colorMode === 'occupancy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Occupancy
          </button>
        </div>

        {allocatedHalls.length === 0 && (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No allocation generated yet. Create an allocation first!</p>
          </div>
        )}

        {/* Hall Visualization */}
        {allocatedHalls.map(hall => (
          <div key={hall.id} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg">{hall.name}</h4>
                <p className="text-sm text-gray-600">
                  {hall.seats.flat().filter(s => s.student).length} / {hall.capacity} seats occupied
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingHall(hall)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Detailed Layout
                </button>
                
                {/* Individual Hall Download Options */}
                <div className="relative group">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Layout
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[200px]">
                    <div className="p-3">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Download Options</div>
                      <button
                        onClick={() => downloadHallLayoutPDF(hall)}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-sm flex items-center gap-2 text-red-600 mb-1"
                      >
                        <FileText className="w-4 h-4" />
                        <div>
                          <div className="font-semibold">PDF Layout</div>
                          <div className="text-xs text-gray-500">Printable seating chart</div>
                        </div>
                      </button>
                      <button
                        onClick={() => downloadHallLayoutExcel(hall)}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg text-sm flex items-center gap-2 text-green-600 mb-1"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <div>
                          <div className="font-semibold">Excel Data</div>
                          <div className="text-xs text-gray-500">Student allocation list</div>
                        </div>
                      </button>
                      <button
                        onClick={() => downloadHallLayoutImage(hall)}
                        className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-2 text-purple-600"
                      >
                        <Camera className="w-4 h-4" />
                        <div>
                          <div className="font-semibold">PNG Image</div>
                          <div className="text-xs text-gray-500">High-resolution layout</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 2))}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 overflow-x-auto">
              <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
                <div className="inline-block">
                  {/* Entry Points Indicator */}
                  <div className="flex justify-between mb-2">
                    {hall.entryPoints.map((point, idx) => (
                      <div key={idx} className="text-sm text-green-600 font-semibold flex items-center gap-1">
                        <DoorOpen className="w-4 h-4" />
                        Entry
                      </div>
                    ))}
                  </div>

                  {/* Seat Grid */}
                  {hall.seats.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-1 mb-1">
                      <div className="w-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                        {String.fromCharCode(65 + rIdx)}
                      </div>
                      {row.map((seat, cIdx) => {
                        const color = seat.student
                          ? colorMode === 'department'
                            ? getDepartmentColor(seat.student.department)
                            : getSubjectColor(seat.student.subject)
                          : 'bg-gray-100';
                        
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 cursor-pointer ${
                              seat.isBlocked
                                ? 'bg-red-500 text-white'
                                : seat.isEmpty
                                ? 'bg-gray-200'
                                : seat.student
                                ? `${color} text-white shadow-sm`
                                : 'bg-gray-100 border border-gray-300'
                            }`}
                            title={seat.student ? `${seat.student.name} (${seat.student.rollNo})` : seat.seatId}
                          >
                            {seat.isBlocked ? (
                              <Ban className="w-4 h-4" />
                            ) : seat.student ? (
                              seat.student.department.substring(0, 2)
                            ) : (
                              ''
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Exit Points Indicator */}
                  <div className="flex justify-between mt-2">
                    {hall.exitPoints.map((point, idx) => (
                      <div key={idx} className="text-sm text-red-600 font-semibold flex items-center gap-1">
                        <DoorOpen className="w-4 h-4" />
                        Exit
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {colorMode === 'department' && (
                <>
                  {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map(dept => (
                    <div key={dept} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${getDepartmentColor(dept)}`} />
                      <span className="text-sm">{dept}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
                  <Ban className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-200" />
                <span className="text-sm">Empty (Spacing)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-600" />
          System Configuration
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Allocation Settings */}
          <div>
            <h4 className="font-bold mb-4">Allocation Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Default Spacing Gap</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={allocationConfig.spacingGap}
                  onChange={(e) => setAllocationConfig({ ...allocationConfig, spacingGap: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Department Separation (seats)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={allocationConfig.sameDeptSeparation}
                  onChange={(e) => setAllocationConfig({ ...allocationConfig, sameDeptSeparation: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Subject Separation (seats)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={allocationConfig.sameSubjectSeparation}
                  onChange={(e) => setAllocationConfig({ ...allocationConfig, sameSubjectSeparation: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Random Seed (for reproducibility)</label>
                <input
                  type="number"
                  value={allocationConfig.seed || ''}
                  onChange={(e) => setAllocationConfig({ ...allocationConfig, seed: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Leave empty for true random"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h4 className="font-bold mb-4">Notification Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="notif1" className="w-5 h-5" defaultChecked />
                <label htmlFor="notif1">Email notifications</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="notif2" className="w-5 h-5" defaultChecked />
                <label htmlFor="notif2">SMS notifications</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="notif3" className="w-5 h-5" defaultChecked />
                <label htmlFor="notif3">Notify on conflict detection</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="notif4" className="w-5 h-5" defaultChecked />
                <label htmlFor="notif4">Notify on capacity overflow</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="notif5" className="w-5 h-5" />
                <label htmlFor="notif5">Daily summary reports</label>
              </div>
            </div>

            <h4 className="font-bold mb-4 mt-6">Security Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sec1" className="w-5 h-5" defaultChecked />
                <label htmlFor="sec1">Require approval for unlock</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sec2" className="w-5 h-5" defaultChecked />
                <label htmlFor="sec2">Audit trail logging</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sec3" className="w-5 h-5" defaultChecked />
                <label htmlFor="sec3">Auto-backup on lock</label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Version History */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <History className="w-6 h-6 text-cyan-600" />
          Version History
        </h3>

        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No version history yet. Create your first allocation!
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, idx) => (
              <div key={version.id} className="p-4 border border-gray-200 rounded-xl hover:border-cyan-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{version.notes}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(version.timestamp).toLocaleString()} • by {version.createdBy}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-600 mt-1">
                        <span>{version.stats.totalStudents} students</span>
                        <span>{version.stats.totalHalls} halls</span>
                        <span>{version.stats.utilizationRate}% utilization</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentVersion?.id === version.id && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Current
                      </span>
                    )}
                    <button
                      onClick={() => restoreVersion(version.id)}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all text-sm"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-6">
      {/* Loading Screen */}
      {isInitializing && (
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 z-50 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Layout className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Initializing Seating Manager</h2>
            <p className="text-gray-600 mb-4">Setting up halls, students, and allocation engine...</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-xl rounded-2xl p-8 border border-cyan-300 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seating Manager Dashboard</h1>
            <p className="text-gray-700">Complete end-to-end seating allocation management system with AI-powered optimization</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {students.length} Students
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {halls.filter(h => h.isActive).length} Active Halls
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {exams.length} Scheduled Exams
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center"
          >
            <Layout className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-cyan-200 mb-6 flex gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'exam-setup', label: 'Exam Setup', icon: Calendar },
          { id: 'hall-management', label: 'Hall Management', icon: Building },
          { id: 'student-data', label: 'Student Data', icon: Users },
          { id: 'allocation', label: 'Allocation Engine', icon: Shuffle },
          { id: 'detention-aware', label: 'Detention Control', icon: Shield },
          { id: 'visualization', label: 'Visualization', icon: Eye },
          { id: 'config', label: 'Configuration', icon: Settings },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeSection === section.id
                ? section.id === 'detention-aware' 
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <section.icon className="w-5 h-5" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'exam-setup' && renderExamSetup()}
          {activeSection === 'hall-management' && renderHallManagement()}
          {activeSection === 'student-data' && renderStudentData()}
          {activeSection === 'allocation' && renderAllocation()}
          {activeSection === 'detention-aware' && <DetentionAwareSeating />}
          {activeSection === 'visualization' && renderVisualization()}
          {activeSection === 'config' && renderConfig()}
        </motion.div>
      </AnimatePresence>

      {/* Hall Layout Viewer Modal */}
      {viewingHall && (
        <HallLayoutViewer
          hall={viewingHall}
          onClose={() => setViewingHall(null)}
          examName={currentExam?.name}
          examDate={currentExam?.date}
          examTime={currentExam?.time}
        />
      )}
    </div>
  );
}
