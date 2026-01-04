import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, Send, Mic, MicOff, Camera, Volume2, VolumeX,
  Sparkles, BookOpen, MapPin, MessageCircle, Languages,
  Scan, Brain, Heart, Video, User, Eye, EyeClosed, Smile,
  Shield, FileText, Calendar, Award, Users, GraduationCap,
  BarChart, Bell, Bus, Clipboard, Key, Search, Upload,
  Download, QrCode, AlertTriangle, Settings, Database,
  CreditCard, FileCode, Cloud, Smartphone, Globe, Cpu,
  Code, Terminal, Server, Network, Lock, Unlock, ShieldCheck,
  Book, Calculator, Atom, Cctv, Radio, Satellite, Wifi,
  Zap, Battery, BatteryCharging, RefreshCw, Filter,
  TrendingUp, PieChart, GitBranch, GitPullRequest,
  TestTube, Beaker, FlaskConical, Microscope, Telescope,
  BookMarked, BookKey, BookOpenText, BookTemplate,
  Layers, Layout, Keyboard, Mouse, Monitor, HardDrive,
  Router, Hash, Type, Brackets, Braces, Parentheses,
  Variable, FunctionSquare, Sigma, Infinity, Pi,
  SquareRoot, Divide, Minus, Plus, X, Equal,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle,
  Clock, CalendarDays, Timer, Watch, Sun, Moon,
  CloudSun, CloudRain, Wind, Thermometer,
  Droplets, Umbrella, TreePine, Mountain,
  Factory, Construction, Wrench, Hammer, Drill,
  Ruler, Compass, Navigation, Map
} from 'lucide-react';

// Enhanced UniVerse System Data Interface
interface UniVerseSystemData {
  user: {
    name: string;
    role: 'student' | 'faculty' | 'admin' | 'seating-manager' | 'club-coordinator';
    id: string;
    profileComplete: boolean;
    email: string;
    phone: string;
    department: string;
    avatarUrl: string;
    year: number;
    cgpa: number;
  };
  
  academics: {
    courses: Array<{
      id: string;
      name: string;
      code: string;
      credits: number;
      semester: number;
      enrolled: boolean;
      syllabusUrl: string;
      instructor: string;
      schedule: string;
      room: string;
    }>;
    currentSemester: number;
    totalCredits: number;
    attendance: {
      percentage: number;
      totalClasses: number;
      attended: number;
    };
  };
  
  exams: {
    upcoming: Array<{
      id: string;
      course: string;
      date: string;
      time: string;
      duration: number;
      hallTicketGenerated: boolean;
      qrCodeVerified: boolean;
      seatAllocated: string;
      venue: string;
      maxMarks: number;
    }>;
    hallTickets: Array<{
      examId: string;
      downloadUrl: string;
      qrCode: string;
      validUntil: string;
    }>;
  };
  
  certificates: {
    total: number;
    categories: Array<{
      type: 'academic' | 'extracurricular' | 'professional' | 'competition';
      count: number;
    }>;
    recent: Array<{
      id: string;
      name: string;
      type: string;
      issuedBy: string;
      date: string;
      verified: boolean;
      pdfUrl: string;
    }>;
  };
  
  studyTools: {
    recentNotes: Array<{
      id: string;
      title: string;
      source: 'lecture' | 'pdf' | 'video' | 'text';
      format: 'structured' | 'cornell' | 'outline' | 'mindmap';
      dateCreated: string;
      tags: string[];
      wordCount: number;
    }>;
    totalSummaries: number;
    aiCredits: number;
  };
  
  clubs: Array<{
    id: string;
    name: string;
    role: 'member' | 'coordinator' | 'admin';
    upcomingEvents: number;
    members: number;
    budget: number;
  }>;
  
  security: {
    lastSOSAlert: string | null;
    fraudAlerts: number;
    lastLogin: string;
    twoFactorEnabled: boolean;
    devices: Array<{
      name: string;
      lastActive: string;
      location: string;
    }>;
  };
  
  campus: {
    nextBus: {
      route: string;
      arrivalTime: string;
      currentLocation: string;
      capacity: number;
      occupied: number;
    };
    calendarEvents: Array<{
      id: string;
      title: string;
      type: 'academic' | 'personal' | 'club';
      date: string;
      time: string;
      location: string;
    }>;
  };
  
  engineering: {
    projects: Array<{
      id: string;
      title: string;
      domain: string;
      status: 'planning' | 'in-progress' | 'completed';
      teamSize: number;
    }>;
    labs: {
      assigned: Array<{
        lab: string;
        equipment: string[];
        timings: string;
      }>;
    };
  };
}

// Mock UniVerse System Data
const mockUniVerseData: UniVerseSystemData = {
  user: {
    name: 'Alex Johnson',
    role: 'student',
    id: 'STU2024001',
    profileComplete: true,
    email: 'alex.j@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=65c9ff',
    year: 3,
    cgpa: 8.7
  },
  
  academics: {
    courses: [
      { 
        id: 'CS101', 
        name: 'Introduction to Programming', 
        code: 'CS101', 
        credits: 4, 
        semester: 1, 
        enrolled: true, 
        syllabusUrl: '/syllabus/cs101.pdf',
        instructor: 'Dr. Sarah Miller',
        schedule: 'Mon/Wed 10:00-11:30',
        room: 'CS-101'
      },
      { 
        id: 'CS201', 
        name: 'Data Structures & Algorithms', 
        code: 'CS201', 
        credits: 4, 
        semester: 2, 
        enrolled: true, 
        syllabusUrl: '/syllabus/cs201.pdf',
        instructor: 'Prof. Robert Chen',
        schedule: 'Tue/Thu 2:00-3:30',
        room: 'CS-201'
      },
      { 
        id: 'CS301', 
        name: 'Database Management Systems', 
        code: 'CS301', 
        credits: 3, 
        semester: 3, 
        enrolled: true, 
        syllabusUrl: '/syllabus/cs301.pdf',
        instructor: 'Dr. Maria Garcia',
        schedule: 'Mon/Fri 9:00-10:30',
        room: 'CS-301'
      },
      { 
        id: 'CS401', 
        name: 'Machine Learning Fundamentals', 
        code: 'CS401', 
        credits: 4, 
        semester: 4, 
        enrolled: false, 
        syllabusUrl: '/syllabus/cs401.pdf',
        instructor: 'Prof. David Wilson',
        schedule: 'Wed/Fri 11:00-12:30',
        room: 'AI-Lab'
      }
    ],
    currentSemester: 3,
    totalCredits: 24,
    attendance: {
      percentage: 87,
      totalClasses: 120,
      attended: 104
    }
  },
  
  exams: {
    upcoming: [
      { 
        id: 'EX001', 
        course: 'Data Structures & Algorithms', 
        date: '2024-12-15', 
        time: '10:00 AM', 
        duration: 180, 
        hallTicketGenerated: true, 
        qrCodeVerified: false, 
        seatAllocated: 'Room 201, Seat A12',
        venue: 'Main Examination Hall',
        maxMarks: 100
      },
      { 
        id: 'EX002', 
        course: 'Database Management Systems', 
        date: '2024-12-18', 
        time: '2:00 PM', 
        duration: 150, 
        hallTicketGenerated: false, 
        qrCodeVerified: false, 
        seatAllocated: 'Room 305, Seat B07',
        venue: 'Computer Lab Block',
        maxMarks: 80
      }
    ],
    hallTickets: [
      { 
        examId: 'EX001', 
        downloadUrl: '/hall-tickets/ex001.pdf', 
        qrCode: 'QR_CODE_12345', 
        validUntil: '2024-12-15T13:00:00' 
      }
    ]
  },
  
  certificates: {
    total: 15,
    categories: [
      { type: 'academic', count: 8 },
      { type: 'extracurricular', count: 4 },
      { type: 'professional', count: 2 },
      { type: 'competition', count: 1 }
    ],
    recent: [
      { 
        id: 'CERT001', 
        name: 'Python Programming Certificate', 
        type: 'professional', 
        issuedBy: 'University CS Dept', 
        date: '2024-11-10', 
        verified: true,
        pdfUrl: '/certificates/python.pdf'
      },
      { 
        id: 'CERT002', 
        name: 'Hackathon Winner 2024', 
        type: 'competition', 
        issuedBy: 'Tech Fest Committee', 
        date: '2024-10-25', 
        verified: true,
        pdfUrl: '/certificates/hackathon.pdf'
      },
      { 
        id: 'CERT003', 
        name: 'Dean\'s List Fall 2024', 
        type: 'academic', 
        issuedBy: 'University Administration', 
        date: '2024-09-15', 
        verified: true,
        pdfUrl: '/certificates/deans-list.pdf'
      }
    ]
  },
  
  studyTools: {
    recentNotes: [
      { 
        id: 'NOTE001', 
        title: 'Database Normalization', 
        source: 'lecture', 
        format: 'cornell', 
        dateCreated: '2024-11-28',
        tags: ['DBMS', 'SQL', 'Normalization'],
        wordCount: 1200
      },
      { 
        id: 'NOTE002', 
        title: 'Machine Learning Basics', 
        source: 'pdf', 
        format: 'structured', 
        dateCreated: '2024-11-25',
        tags: ['ML', 'AI', 'Statistics'],
        wordCount: 1800
      },
      { 
        id: 'NOTE003', 
        title: 'Operating Systems Summary', 
        source: 'video', 
        format: 'mindmap', 
        dateCreated: '2024-11-20',
        tags: ['OS', 'Kernel', 'Process'],
        wordCount: 950
      }
    ],
    totalSummaries: 12,
    aiCredits: 150
  },
  
  clubs: [
    { 
      id: 'CLUB001', 
      name: 'Computer Science Club', 
      role: 'coordinator', 
      upcomingEvents: 2,
      members: 45,
      budget: 5000
    },
    { 
      id: 'CLUB002', 
      name: 'Robotics Club', 
      role: 'member', 
      upcomingEvents: 1,
      members: 32,
      budget: 7500
    },
    { 
      id: 'CLUB003', 
      name: 'AI & ML Society', 
      role: 'member', 
      upcomingEvents: 3,
      members: 68,
      budget: 12000
    }
  ],
  
  security: {
    lastSOSAlert: null,
    fraudAlerts: 0,
    lastLogin: '2024-11-30 09:15:00',
    twoFactorEnabled: true,
    devices: [
      {
        name: 'MacBook Pro',
        lastActive: '2024-11-30 09:15:00',
        location: 'Campus Library'
      },
      {
        name: 'iPhone 14',
        lastActive: '2024-11-30 08:30:00',
        location: 'Dormitory'
      }
    ]
  },
  
  campus: {
    nextBus: {
      route: 'Campus Loop - East',
      arrivalTime: '14:30',
      currentLocation: 'Science Building',
      capacity: 40,
      occupied: 28
    },
    calendarEvents: [
      { 
        id: 'EV001', 
        title: 'Final Exam - Data Structures', 
        type: 'academic', 
        date: '2024-12-15', 
        time: '10:00 AM',
        location: 'Main Examination Hall'
      },
      { 
        id: 'EV002', 
        title: 'CS Club Meeting', 
        type: 'club', 
        date: '2024-12-10', 
        time: '4:00 PM',
        location: 'Tech Center Room 101'
      },
      { 
        id: 'EV003', 
        title: 'Project Submission Deadline', 
        type: 'academic', 
        date: '2024-12-20', 
        time: '11:59 PM',
        location: 'Online Portal'
      }
    ]
  },
  
  engineering: {
    projects: [
      {
        id: 'PROJ001',
        title: 'Smart Campus Navigation System',
        domain: 'Computer Science',
        status: 'in-progress',
        teamSize: 4
      },
      {
        id: 'PROJ002',
        title: 'AI-Based Attendance System',
        domain: 'Machine Learning',
        status: 'completed',
        teamSize: 3
      }
    ],
    labs: {
      assigned: [
        {
          lab: 'Computer Lab 3',
          equipment: ['High-end PCs', 'Arduino Kits', 'Raspberry Pi'],
          timings: 'Mon/Wed 2-5 PM'
        }
      ]
    }
  }
};

// Engineering Academic Knowledge Base
const engineeringKnowledgeBase = {
  // Computer Science Engineering
  'operating systems': {
    topics: [
      {
        name: 'Deadlock',
        definition: 'A deadlock is a situation in concurrent systems where two or more processes are unable to proceed because each is waiting for the other to release resources.',
        explanation: `
1. **Four Necessary Conditions for Deadlock**:
   - Mutual Exclusion: At least one resource must be held in non-sharable mode
   - Hold and Wait: Process holds resources while waiting for others
   - No Preemption: Resources cannot be forcibly taken away
   - Circular Wait: Circular chain of processes waiting for resources

2. **Methods for Handling Deadlocks**:
   - Prevention: Design system to avoid one of the conditions
   - Avoidance: Use algorithms like Banker's Algorithm
   - Detection & Recovery: Detect deadlock and recover
   - Ignorance: Pretend deadlocks never occur (used in most OS)

3. **Banker's Algorithm (Dijkstra, 1965)**:
   - Used for deadlock avoidance
   - Requires processes declare maximum resource needs
   - System maintains:
     • Available[m]: Available resources of type m
     • Max[n][m]: Maximum demand of process n for resource m
     • Allocation[n][m]: Current allocation
     • Need[n][m]: Remaining needs (Max - Allocation)
`,
        example: `
**Real-world Example**: 
Four processes (P1, P2, P3, P4) and three resource types (A, B, C) with available resources (3, 3, 2).

Process    Allocation    Max        Need
P1         (0,1,0)      (7,5,3)    (7,4,3)
P2         (2,0,0)      (3,2,2)    (1,2,2)
P3         (3,0,2)      (9,0,2)    (6,0,0)
P4         (2,1,1)      (2,2,2)    (0,1,1)

**Safe Sequence**: P2 → P4 → P1 → P3
`,
        keyPoints: [
          'Deadlock requires all four conditions simultaneously',
          'Banker\'s algorithm ensures safe state',
          'Resource allocation graph can detect deadlock',
          'Practical systems often use timeout mechanisms'
        ],
        commonMistakes: [
          'Confusing deadlock with starvation',
          'Forgetting that all four conditions must be present',
          'Misapplying Banker\'s algorithm without complete information'
        ],
        references: ['Operating System Concepts (Silberschatz)', 'Modern Operating Systems (Tanenbaum)']
      },
      {
        name: 'Process Scheduling',
        definition: 'Process scheduling is the activity of selecting which process runs when there are multiple runnable processes.',
        explanation: `
**Scheduling Algorithms**:

1. **First-Come, First-Served (FCFS)**:
   - Simple, non-preemptive
   - Can cause convoy effect
   - Formula: Average Waiting Time = Σ(Waiting Time)/n

2. **Shortest Job First (SJF)**:
   - Optimal for minimizing average waiting time
   - Can cause starvation
   - Formula: E[T] = Σ p_i * t_i (expected time)

3. **Round Robin (RR)**:
   - Preemptive, time quantum based
   - Good for time-sharing systems
   - Turnaround time depends on quantum size

4. **Priority Scheduling**:
   - Can be preemptive or non-preemptive
   - Priority inversion problem
   - Aging technique to prevent starvation

**Performance Metrics**:
- CPU Utilization: % of time CPU is busy
- Throughput: # of processes completed per unit time
- Turnaround Time: Completion time - Arrival time
- Waiting Time: Time spent in ready queue
- Response Time: Time from submission to first response
`,
        example: `
**Example: SJF with processes**:
Process   Arrival   Burst
P1        0         6
P2        2         8
P3        4         7
P4        6         3

**Gantt Chart**: P1(6) → P4(3) → P3(7) → P2(8)
**Average Waiting Time**: (0 + 15 + 9 + 0)/4 = 6
`,
        keyPoints: [
          'SJF is optimal for minimizing waiting time',
          'Round Robin fairness vs efficiency tradeoff',
          'Multilevel feedback queues handle varying process types',
          'Real-time schedulers use rate monotonic, EDF'
        ],
        commonMistakes: [
          'Confusing waiting time with turnaround time',
          'Not considering arrival times in SJF',
          'Choosing wrong quantum size in RR'
        ]
      }
    ]
  },

  'database systems': {
    topics: [
      {
        name: 'Normalization',
        definition: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.',
        explanation: `
**Normal Forms**:

1. **First Normal Form (1NF)**:
   - Atomic values, no repeating groups
   - Each attribute contains single value
   - All entries in a column are same type

2. **Second Normal Form (2NF)**:
   - Must be in 1NF
   - No partial dependency on candidate key
   - All non-key attributes fully functionally dependent on PK

3. **Third Normal Form (3NF)**:
   - Must be in 2NF
   - No transitive dependency
   - Every non-key attribute non-transitively dependent on PK

4. **Boyce-Codd Normal Form (BCNF)**:
   - Stricter than 3NF
   - For every functional dependency X→Y, X must be superkey
   - Eliminates all non-trivial functional dependencies

**Functional Dependencies**:
- Armstrong's Axioms:
  1. Reflexivity: If Y ⊆ X, then X → Y
  2. Augmentation: If X → Y, then XZ → YZ
  3. Transitivity: If X → Y and Y → Z, then X → Z
`,
        example: `
**Example Table (Unnormalized)**:
StudentID   Name        Courses
101         Alice       {Math, Physics}
102         Bob         {Math, Chemistry}

**1NF Conversion**:
StudentID   Name        Course
101         Alice       Math
101         Alice       Physics
102         Bob         Math
102         Bob         Chemistry

**Identifying Partial/Transitive Dependencies**:
Table: Student(StudentID, CourseID, CourseName, Instructor, InstructorDept)
FDs: StudentID, CourseID → CourseName, Instructor
      Instructor → InstructorDept (Transitive!)

**3NF Conversion**:
Students(StudentID, CourseID, CourseName, Instructor)
Instructors(Instructor, InstructorDept)
`,
        keyPoints: [
          'Normalization reduces redundancy but may increase joins',
          'Denormalization improves performance for read-heavy systems',
          'BCNF is stronger than 3NF',
          '4NF deals with multi-valued dependencies'
        ],
        commonMistakes: [
          'Over-normalizing causing performance issues',
          'Not identifying all functional dependencies',
          'Confusing partial vs transitive dependencies'
        ]
      },
      {
        name: 'Transactions and ACID',
        definition: 'A transaction is a sequence of database operations that must execute atomically, consistently, isolated, and durably.',
        explanation: `
**ACID Properties**:

1. **Atomicity**: All or nothing execution
   - Implemented via commit/rollback
   - Uses transaction log

2. **Consistency**: Database constraints preserved
   - Referential integrity
   - Domain constraints
   - Business rules

3. **Isolation**: Concurrent transactions don't interfere
   - Serializability theory
   - Locking protocols
   - Timestamp ordering

4. **Durability**: Committed changes persist
   - Write-ahead logging (WAL)
   - Checkpointing
   - Backup systems

**Concurrency Control**:
- Lock-based protocols:
  • Two-phase locking (2PL)
  • Strict 2PL
  • Deadlock detection/prevention

- Timestamp-based:
  • Thomas Write Rule
  • Multiversion concurrency control (MVCC)

- Optimistic methods:
  • Validation phase
  • Backward/forward validation
`,
        example: `
**Example Transaction**:
BEGIN TRANSACTION;
UPDATE Accounts SET balance = balance - 100 WHERE id = 1;
UPDATE Accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

**Isolation Levels (SQL Standard)**:
1. READ UNCOMMITTED: Dirty reads allowed
2. READ COMMITTED: Default in most DBMS
3. REPEATABLE READ: No phantom reads in MySQL
4. SERIALIZABLE: Strictest, ensures serial execution

**Two-Phase Locking**:
Growing Phase: Acquire locks, no releasing
Shrinking Phase: Release locks, no acquiring
`,
        keyPoints: [
          'ACID properties are fundamental to reliable databases',
          'Isolation levels trade consistency for performance',
          '2PL ensures serializability but can cause deadlocks',
          'MVCC allows readers not to block writers'
        ],
        commonMistakes: [
          'Choosing wrong isolation level',
          'Not handling deadlocks properly',
          'Forgetting about phantom reads'
        ]
      }
    ]
  },

  'computer networks': {
    topics: [
      {
        name: 'TCP vs UDP',
        definition: 'TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are transport layer protocols with different characteristics.',
        explanation: `
**TCP (Transmission Control Protocol)**:
- Connection-oriented, reliable, ordered delivery
- Flow control (sliding window)
- Congestion control (AIMD, slow start)
- Error checking and recovery
- 3-way handshake (SYN, SYN-ACK, ACK)
- 4-way termination (FIN, ACK, FIN, ACK)

**UDP (User Datagram Protocol)**:
- Connectionless, unreliable, no ordering
- No flow/congestion control
- Minimal overhead (8-byte header vs 20-byte TCP)
- Suitable for real-time applications

**Header Comparison**:
TCP Header (20-60 bytes):
  Source Port (16), Dest Port (16)
  Sequence Number (32), Ack Number (32)
  Data Offset (4), Reserved (6), Flags (6), Window (16)
  Checksum (16), Urgent Pointer (16)
  Options (0-40 bytes)

UDP Header (8 bytes):
  Source Port (16), Dest Port (16)
  Length (16), Checksum (16)

**TCP Congestion Control Algorithms**:
- Tahoe: Slow start, congestion avoidance, fast retransmit
- Reno: Adds fast recovery
- Cubic: Default in Linux, cubic function for window growth
- BBR: Model-based, measures bottleneck bandwidth
`,
        example: `
**Application Scenarios**:
Use TCP for:
• Web browsing (HTTP/HTTPS)
• Email (SMTP, IMAP)
• File transfer (FTP)
• Remote access (SSH)

Use UDP for:
• Video streaming
• VoIP
• DNS queries
• Online gaming
• DHCP

**TCP Sequence Numbers**:
Initial Sequence Number (ISN) selection:
• Based on clock, increments every 4μs
• Protects against old duplicate packets
• Formula: ISN = (clock_value * 2^24 / 100) mod 2^32
`,
        keyPoints: [
          'TCP provides reliability, UDP provides speed',
          'TCP header overhead is 20-60 bytes, UDP is 8 bytes',
          'TCP uses adaptive timeout based on RTT estimation',
          'UDP is stateless, TCP maintains connection state'
        ],
        commonMistakes: [
          'Thinking UDP has no error checking (it has checksum)',
          'Believing TCP guarantees delivery timing',
          'Using UDP for critical data transfer'
        ]
      },
      {
        name: 'OSI Model vs TCP/IP',
        definition: 'The OSI (Open Systems Interconnection) model is a 7-layer theoretical model, while TCP/IP is a 4-layer practical implementation.',
        explanation: `
**OSI Model (7 Layers)**:
1. Physical: Bits, cables, connectors, voltages
2. Data Link: Frames, MAC addresses, switches
3. Network: Packets, IP addresses, routers
4. Transport: Segments, TCP/UDP, reliability
5. Session: Dialog control, synchronization
6. Presentation: Encryption, compression, formatting
7. Application: HTTP, FTP, SMTP, end-user protocols

**TCP/IP Model (4 Layers)**:
1. Link/Network Interface: OSI 1+2
2. Internet: OSI 3
3. Transport: OSI 4
4. Application: OSI 5+6+7

**Protocol Mapping**:
Layer         OSI Protocols          TCP/IP Protocols
Application   HTTP, FTP, SMTP        HTTP, FTP, SMTP
Presentation  SSL, JPEG, MPEG        SSL/TLS
Session       NetBIOS, RPC           Sockets API
Transport     TCP, UDP               TCP, UDP
Network       IP, ICMP, OSPF         IP, ICMP
Data Link     Ethernet, PPP          Ethernet, Wi-Fi
Physical      RS-232, 100BASE-T      Physical media

**Encapsulation Process**:
Data → Segment → Packet → Frame → Bits
(Application) (Transport) (Network) (Data Link) (Physical)
`,
        example: `
**Example: HTTP Request Journey**:
1. Application: Browser creates HTTP GET request
2. Presentation: URL encoding, compression
3. Session: Establishes connection session
4. Transport: TCP breaks into segments, adds port numbers
5. Network: IP adds source/dest IP addresses
6. Data Link: Ethernet adds MAC addresses, creates frames
7. Physical: Converts to electrical/optical signals

**Real-world Devices**:
Layer      Device        Function
1          Hub, Repeater Signal amplification
2          Switch, Bridge Frame forwarding
3          Router        Packet routing
4-7        Gateway       Protocol translation
`,
        keyPoints: [
          'OSI is theoretical, TCP/IP is practical',
          'Each layer adds its own header',
          'Lower layers provide service to higher layers',
          'Encapsulation/decapsulation at each layer'
        ],
        commonMistakes: [
          'Confusing OSI layers with TCP/IP layers',
          'Not understanding layer responsibilities',
          'Thinking all protocols fit neatly into layers'
        ]
      }
    ]
  },

  'machine learning': {
    topics: [
      {
        name: 'Neural Networks & Backpropagation',
        definition: 'Neural networks are computational models inspired by biological neural networks, trained using backpropagation algorithm.',
        explanation: `
**Artificial Neuron (Perceptron)**:
- Inputs: x₁, x₂, ..., xₙ
- Weights: w₁, w₂, ..., wₙ
- Bias: b
- Activation: f(w·x + b)
- Output: y = f(Σ wᵢxᵢ + b)

**Activation Functions**:
1. Sigmoid: σ(x) = 1/(1 + e⁻ˣ)
   Range: (0,1), Smooth, Vanishing gradient issue

2. ReLU: f(x) = max(0, x)
   Range: [0,∞), Sparsity, Dead neurons issue

3. Tanh: tanh(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ)
   Range: (-1,1), Zero-centered

4. Softmax: σ(z)ᵢ = eᶻⁱ / Σⱼ eᶻʲ
   Used for multi-class output

**Backpropagation Algorithm**:
1. Forward Pass: Compute outputs
   a⁽ˡ⁾ = f(z⁽ˡ⁾) where z⁽ˡ⁾ = W⁽ˡ⁾a⁽ˡ⁻¹⁾ + b⁽ˡ⁾

2. Compute Loss: L = ½Σ(y - ŷ)² (MSE)
   or Cross-entropy for classification

3. Backward Pass (Chain Rule):
   δ⁽ˡ⁾ = (W⁽ˡ⁺¹⁾ᵀδ⁽ˡ⁺¹⁾) ⊙ f'(z⁽ˡ⁾)
   ∂L/∂W⁽ˡ⁾ = δ⁽ˡ⁾(a⁽ˡ⁻¹⁾)ᵀ
   ∂L/∂b⁽ˡ⁾ = δ⁽ˡ⁾

4. Update Weights (Gradient Descent):
   W⁽ˡ⁾ = W⁽ˡ⁾ - η ∂L/∂W⁽ˡ⁾
   b⁽ˡ⁾ = b⁽ˡ⁾ - η ∂L/∂b⁽ˡ⁾
`,
        example: `
**Example: XOR Problem Solution**:
Input    Hidden Layer (2 neurons)    Output
x1 x2    h1 = ReLU(w11*x1 + w12*x2 + b1)   y = σ(w1*h1 + w2*h2 + b)
          h2 = ReLU(w21*x1 + w22*x2 + b2)

**Learning XOR**:
Initial weights random, learning rate η=0.1
Forward: Compute predictions
Backward: Compute gradients
Update: Adjust weights
Repeat for 1000 epochs

**Numerical Example**:
Single neuron, sigmoid activation
Input: x = [1, 2], w = [0.5, -0.5], b = 0.1
z = 0.5*1 + (-0.5)*2 + 0.1 = -0.4
a = σ(-0.4) = 1/(1+e⁰⋅⁴) ≈ 0.401
`,
        keyPoints: [
          'Backpropagation efficiently computes gradients',
          'Chain rule enables deep network training',
          'Choice of activation affects learning',
          'Vanishing/exploding gradients in deep networks'
        ],
        commonMistakes: [
          'Forgetting to apply chain rule correctly',
          'Not initializing weights properly',
          'Using wrong activation for output layer',
          'Not normalizing inputs'
        ]
      },
      {
        name: 'Gradient Descent Variants',
        definition: 'Gradient descent is an optimization algorithm for minimizing the loss function in machine learning models.',
        explanation: `
**Batch Gradient Descent**:
- Uses entire dataset for each update
- Computationally expensive
- Stable convergence
- Formula: θ = θ - η ∇J(θ)

**Stochastic Gradient Descent (SGD)**:
- Uses single sample per update
- Noisy updates, faster
- May not converge to minimum
- Formula: θ = θ - η ∇J(θ; x⁽ⁱ⁾, y⁽ⁱ⁾)

**Mini-batch Gradient Descent**:
- Compromise between batch and SGD
- Uses batch of samples (e.g., 32, 64, 128)
- Most common in practice
- Formula: θ = θ - η ∇J(θ; B) where B is mini-batch

**Advanced Optimizers**:
1. Momentum:
   vₜ = βvₜ₋₁ + (1-β)∇J(θ)
   θ = θ - ηvₜ

2. RMSProp:
   E[g²]ₜ = βE[g²]ₜ₋₁ + (1-β)gₜ²
   θ = θ - η/(√E[g²]ₜ + ε) gₜ

3. Adam (Adaptive Moment Estimation):
   mₜ = β₁mₜ₋₁ + (1-β₁)gₜ    (First moment)
   vₜ = β₂vₜ₋₁ + (1-β₂)gₜ²   (Second moment)
   m̂ₜ = mₜ/(1-β₁ᵗ), v̂ₜ = vₜ/(1-β₂ᵗ)
   θ = θ - η m̂ₜ/(√v̂ₜ + ε)
`,
        example: `
**Comparison of Optimizers**:
Algorithm      Batch Size   Learning Rate   Advantages
SGD            1            High (0.1-0.01) Simple, works
Momentum       32           Medium (0.01)   Faster convergence
RMSProp        64           Low (0.001)     Adapts learning rates
Adam           128          Low (0.001)     Default choice

**Learning Rate Scheduling**:
1. Step Decay: η = η₀ * 0.1^⌊epoch/10⌋
2. Exponential: η = η₀ * e⁻ᵏᵗ
3. Cosine: η = η_min + ½(η_max-η_min)(1+cos(πt/T))

**Numerical Example**:
Loss function: J(θ) = θ²
Gradient: ∇J(θ) = 2θ
Initial: θ₀ = 5, η = 0.1
Iteration 1: θ₁ = 5 - 0.1*10 = 4
Iteration 2: θ₂ = 4 - 0.1*8 = 3.2
...
Converges to θ ≈ 0
`,
        keyPoints: [
          'Adam is generally recommended default',
          'Learning rate is most important hyperparameter',
          'Batch size affects convergence and memory',
          'Momentum helps escape local minima'
        ],
        commonMistakes: [
          'Using too high learning rate',
          'Not decaying learning rate',
          'Choosing wrong batch size',
          'Forgetting gradient clipping'
        ]
      }
    ]
  },

  'algorithms': {
    topics: [
      {
        name: 'Sorting Algorithms',
        definition: 'Sorting algorithms arrange elements of a list in a particular order (ascending or descending).',
        explanation: `
**Comparison of Sorting Algorithms**:

1. **Bubble Sort**:
   - Time: O(n²) worst/average, O(n) best
   - Space: O(1)
   - Stable: Yes
   - Method: Repeatedly swapping adjacent elements

2. **Selection Sort**:
   - Time: O(n²) all cases
   - Space: O(1)
   - Stable: No
   - Method: Find minimum, swap with first unsorted

3. **Insertion Sort**:
   - Time: O(n²) worst/average, O(n) best
   - Space: O(1)
   - Stable: Yes
   - Method: Build sorted array one element at a time

4. **Merge Sort**:
   - Time: O(n log n) all cases
   - Space: O(n)
   - Stable: Yes
   - Method: Divide and conquer, merge sorted halves

5. **Quick Sort**:
   - Time: O(n²) worst, O(n log n) average
   - Space: O(log n)
   - Stable: No
   - Method: Partition around pivot, recursive

6. **Heap Sort**:
   - Time: O(n log n) all cases
   - Space: O(1)
   - Stable: No
   - Method: Build heap, repeatedly extract max

**Time Complexity Analysis**:
Algorithm    Best       Average     Worst       Space
Bubble       O(n)       O(n²)       O(n²)       O(1)
Selection    O(n²)      O(n²)       O(n²)       O(1)
Insertion    O(n)       O(n²)       O(n²)       O(1)
Merge        O(n log n) O(n log n)  O(n log n)  O(n)
Quick        O(n log n) O(n log n)  O(n²)       O(log n)
Heap         O(n log n) O(n log n)  O(n log n)  O(1)
`,
        example: `
**Quick Sort Example**:
Array: [8, 3, 1, 7, 0, 10, 2]

Choose pivot = 8
Partition: [3, 1, 7, 0, 2] 8 [10]
Recurse left: [3, 1, 7, 0, 2]
  pivot = 3
  Partition: [1, 0, 2] 3 [7]
  Recurse: [1, 0, 2] → [0, 1, 2]
Recurse right: [10] (sorted)
Result: [0, 1, 2, 3, 7, 8, 10]

**Merge Sort Visualization**:
[8,3,1,7,0,10,2]
Divide: [8,3,1] [7,0,10,2]
Divide: [8] [3,1] | [7,0] [10,2]
Divide: [8] [3] [1] | [7] [0] [10] [2]
Merge: [3,8] [1] | [0,7] [2,10]
Merge: [1,3,8] | [0,2,7,10]
Merge: [0,1,2,3,7,8,10]
`,
        keyPoints: [
          'Merge sort guaranteed O(n log n), stable',
          'Quick sort fastest average but O(n²) worst case',
          'Insertion sort best for small/almost sorted arrays',
          'Heap sort in-place with O(n log n) guarantee'
        ],
        commonMistakes: [
          'Using bubble/selection sort for large n',
          'Not handling quicksort worst case (sorted input)',
          'Forgetting stability requirements',
          'Incorrect pivot selection'
        ]
      },
      {
        name: 'Dynamic Programming',
        definition: 'Dynamic programming solves complex problems by breaking them into simpler subproblems and storing results.',
        explanation: `
**DP Characteristics**:
1. Optimal Substructure: Optimal solution contains optimal sub-solutions
2. Overlapping Subproblems: Subproblems recur many times
3. Memoization/Tabulation: Store computed results

**Approaches**:
1. Top-down (Memoization):
   - Recursive with cache
   - Lazy evaluation
   - Easy to implement

2. Bottom-up (Tabulation):
   - Iterative, build table
   - Better space optimization
   - Systematic

**Classic Problems**:
1. Fibonacci:
   - Naive: O(2ⁿ)
   - DP: O(n) time, O(n) space
   - Formula: F(n) = F(n-1) + F(n-2)

2. 0/1 Knapsack:
   - Capacity W, n items with weights wᵢ, values vᵢ
   - DP[i][w] = max(DP[i-1][w], vᵢ + DP[i-1][w-wᵢ])

3. Longest Common Subsequence (LCS):
   - Strings X[1..m], Y[1..n]
   - LCS[i][j] = 0 if i=0 or j=0
                = 1 + LCS[i-1][j-1] if X[i]=Y[j]
                = max(LCS[i-1][j], LCS[i][j-1]) otherwise

4. Matrix Chain Multiplication:
   - Matrices A₁...Aₙ with dimensions p₀×p₁, p₁×p₂, ..., pₙ₋₁×pₙ
   - Find minimum scalar multiplications
   - m[i][j] = min(m[i][k] + m[k+1][j] + pᵢ₋₁pₖpⱼ)
`,
        example: `
**Fibonacci with DP**:
Naive recursive: F(5) = F(4) + F(3)
                   = (F(3)+F(2)) + (F(2)+F(1))
                   = ... exponential calls

Memoized:
cache = {}
def fib(n):
    if n in cache: return cache[n]
    if n <= 1: return n
    cache[n] = fib(n-1) + fib(n-2)
    return cache[n]

Tabulated:
def fib(n):
    dp = [0]*(n+1)
    dp[1] = 1
    for i in range(2, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

**Knapsack Example**:
Capacity W=5
Items: (weight, value)
1: (1, 60), 2: (2, 100), 3: (3, 120)

DP Table:
   Capacity: 0 1 2 3 4 5
Item 0:     0 0 0 0 0 0
Item 1:     0 60 60 60 60 60
Item 2:     0 60 100 160 160 160
Item 3:     0 60 100 160 180 220

Max value = 220
`,
        keyPoints: [
          'DP = Recursion + Memoization',
          'Identify state transition equation',
          'Bottom-up often more space efficient',
          'Many string problems use DP'
        ],
        commonMistakes: [
          'Not recognizing overlapping subproblems',
          'Wrong state definition',
          'Not handling base cases properly',
          'Exponential space usage'
        ]
      }
    ]
  }
};

// Enhanced Academic AI Response Generator
const generateEngineeringResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Extract topic and subtopic
  let topic = '';
  let subtopic = '';
  
  // Check for specific topics
  const topicKeywords: Record<string, string[]> = {
    'operating systems': ['os', 'operating system', 'deadlock', 'process', 'scheduling', 'memory', 'file system'],
    'database systems': ['database', 'dbms', 'sql', 'normalization', 'transaction', 'acid', 'index'],
    'computer networks': ['network', 'tcp', 'udp', 'osi', 'ip', 'routing', 'protocol'],
    'machine learning': ['ml', 'machine learning', 'neural', 'backpropagation', 'gradient', 'cnn', 'rnn'],
    'algorithms': ['algorithm', 'sort', 'search', 'dynamic programming', 'graph', 'tree', 'complexity']
  };
  
  for (const [mainTopic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      topic = mainTopic;
      break;
    }
  }
  
  if (!topic) {
    return `I understand you're asking about engineering concepts. As a specialized engineering AI assistant, I can help with:

🔹 **Computer Science Engineering**:
   • Operating Systems (deadlock, scheduling, memory management)
   • Database Systems (normalization, transactions, SQL)
   • Computer Networks (TCP/IP, OSI model, routing)
   • Algorithms & Data Structures
   • Compiler Design
   • Software Engineering

🔹 **Artificial Intelligence & Machine Learning**:
   • Neural Networks
   • Deep Learning
   • Natural Language Processing
   • Computer Vision
   • Reinforcement Learning

🔹 **Other Engineering Domains**:
   • Data Structures & Algorithms
   • Computer Architecture
   • Theory of Computation
   • Distributed Systems
   • Cybersecurity

Please ask a specific engineering academic question. For example:
• "Explain deadlock in operating systems with Banker's algorithm"
• "Derive the backpropagation algorithm mathematically"
• "Compare TCP and UDP with header structures"
• "Explain database normalization with examples"
• "Analyze time complexity of sorting algorithms"`;
  }
  
  // Find matching subtopic
  const knowledge = engineeringKnowledgeBase[topic as keyof typeof engineeringKnowledgeBase];
  if (!knowledge) {
    return `I have extensive knowledge about ${topic}. Please ask a specific question within this domain.`;
  }
  
  for (const t of knowledge.topics) {
    if (lowerQuery.includes(t.name.toLowerCase()) || 
        t.name.toLowerCase().split(' ').some(word => lowerQuery.includes(word))) {
      subtopic = t.name;
      break;
    }
  }
  
  if (!subtopic) {
    // Return general topic overview
    const topicNames = knowledge.topics.map(t => `• ${t.name}`).join('\n');
    return `**${topic.toUpperCase()} - Available Topics**:

${topicNames}

Choose a specific topic or ask:
• "Explain ${knowledge.topics[0].name} in detail"
• "Give me examples of ${knowledge.topics[1].name}"
• "What are the key points for ${knowledge.topics[2].name}?"`;
  }
  
  // Generate detailed response for specific subtopic
  const subtopicData = knowledge.topics.find(t => t.name === subtopic);
  if (!subtopicData) return `I'll explain ${subtopic} in ${topic}.`;
  
  return `📚 **${subtopic}** - ${topic.toUpperCase()}

**1. DEFINITION & CONCEPT OVERVIEW**
${subtopicData.definition}

**2. DETAILED EXPLANATION**${subtopicData.explanation}

**3. REAL-WORLD ENGINEERING EXAMPLE**${subtopicData.example}

**4. EXAM-ORIENTED KEY POINTS**
${subtopicData.keyPoints.map((point, i) => `${i+1}. ${point}`).join('\n')}

**5. COMMON MISTAKES STUDENTS MAKE**
${subtopicData.commonMistakes.map((mistake, i) => `${i+1}. ${mistake}`).join('\n')}

**6. SUMMARY**
• ${subtopic} is fundamental to understanding ${topic}
• Master both theoretical concepts and practical applications
• Practice with numerical examples and implementation

**Suggested Study Approach**:
1. Review the definition and core principles
2. Work through provided examples
3. Implement algorithm/code if applicable
4. Solve practice problems
5. Compare with related concepts

**Academic References**: ${subtopicData.references?.join(', ') || 'Standard university textbooks'}`;
};

// Realistic Human Avatar Component
const RealisticHumanAvatar = ({ 
  isSpeaking, 
  isListening, 
  emotion = 'neutral',
  textToSpeak = ''
}: { 
  isSpeaking: boolean; 
  isListening: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'listening' | 'explaining';
  textToSpeak?: string;
}) => {
  const [lipPath, setLipPath] = useState('M 40,60 Q 50,60 60,60');
  const [eyeOpen, setEyeOpen] = useState(true);
  const [headTilt, setHeadTilt] = useState(0);
  const [eyeDirection, setEyeDirection] = useState({ x: 0, y: 0 });
  const [blinkCount, setBlinkCount] = useState(0);

  // Enhanced lip sync with phoneme detection
  useEffect(() => {
    if (!isSpeaking) {
      setLipPath('M 40,60 Q 50,60 60,60');
      return;
    }

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const wideMouth = ['o', 'u'];
    const narrowMouth = ['e', 'i'];
    
    const interval = setInterval(() => {
      const randomChar = textToSpeak.length > 0 
        ? textToSpeak[Math.floor(Math.random() * textToSpeak.length)].toLowerCase()
        : 'a';
      
      if (vowels.includes(randomChar)) {
        if (wideMouth.includes(randomChar)) {
          setLipPath('M 35,58 Q 50,65 65,58');
        } else if (narrowMouth.includes(randomChar)) {
          setLipPath('M 38,61 Q 50,58 62,61');
        } else {
          setLipPath('M 40,60 Q 50,55 60,60');
        }
      } else {
        const paths = [
          'M 40,60 Q 50,60 60,60',
          'M 40,59 Q 50,61 60,59',
          'M 40,61 Q 50,59 60,61',
        ];
        setLipPath(paths[Math.floor(Math.random() * paths.length)]);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isSpeaking, textToSpeak]);

  // Natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setEyeOpen(false);
        setTimeout(() => {
          setEyeOpen(true);
          setBlinkCount(prev => prev + 1);
        }, 150);
      }
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Head movement based on emotion and listening state
  useEffect(() => {
    if (isListening) {
      setHeadTilt(5);
      // Random slight head movements while listening
      const interval = setInterval(() => {
        setHeadTilt(prev => prev + (Math.random() - 0.5) * 2);
      }, 2000);
      return () => clearInterval(interval);
    } else if (emotion === 'thinking') {
      setHeadTilt(8);
    } else if (emotion === 'explaining') {
      setHeadTilt(-3);
    } else {
      setHeadTilt(0);
    }
  }, [isListening, emotion]);

  // Eye movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSpeaking) {
        setEyeDirection({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 2
        });
      } else if (isListening) {
        setEyeDirection({
          x: 0,
          y: -2 // Looking slightly up when listening
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  return (
    <motion.div
      className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-white"
      animate={{ 
        rotateZ: `${headTilt}deg`,
        scale: isListening ? 1.02 : 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20 
      }}
    >
      {/* Professional Blazer/Shirt Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600">
        {/* Shoulders */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t-full" />
        
        {/* Shirt Collar */}
        <div className="absolute top-2/3 left-1/4 right-1/4 h-8">
          <div className="absolute left-0 w-12 h-12 bg-slate-700 -rotate-45 origin-bottom-right" />
          <div className="absolute right-0 w-12 h-12 bg-slate-700 rotate-45 origin-bottom-left" />
        </div>
      </div>

      {/* Head Container */}
      <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4">
        {/* Face Shape */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-amber-100 to-amber-50 rounded-full"
          animate={{
            scale: isSpeaking ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0
          }}
        >
          {/* Facial Features */}
          
          {/* Forehead */}
          <div className="absolute top-0 left-1/4 right-1/4 h-8 bg-gradient-to-b from-amber-200 to-amber-100 rounded-t-full" />
          
          {/* Cheeks - subtle blush when speaking */}
          <motion.div 
            className="absolute top-1/3 left-6 w-8 h-6 rounded-full bg-gradient-to-r from-pink-100 to-transparent opacity-30"
            animate={{
              opacity: isSpeaking ? 0.4 : 0.3
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-6 w-8 h-6 rounded-full bg-gradient-to-l from-pink-100 to-transparent opacity-30"
            animate={{
              opacity: isSpeaking ? 0.4 : 0.3
            }}
          />
          
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 right-1/4 flex justify-between px-8">
            {/* Left Eye */}
            <motion.div 
              className="relative w-16 h-10 bg-white rounded-full overflow-hidden border-2 border-amber-200"
              animate={{ 
                height: eyeOpen ? 10 : 2,
                translateX: `${eyeDirection.x}px`,
                translateY: `${eyeDirection.y}px`
              }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute inset-1 bg-blue-400 rounded-full" />
              <div className="absolute inset-3 bg-blue-900 rounded-full" />
              <div className="absolute inset-4 bg-black rounded-full" />
              {/* Eye shine */}
              <div className="absolute top-1 left-3 w-3 h-3 bg-white rounded-full opacity-80" />
            </motion.div>
            
            {/* Right Eye */}
            <motion.div 
              className="relative w-16 h-10 bg-white rounded-full overflow-hidden border-2 border-amber-200"
              animate={{ 
                height: eyeOpen ? 10 : 2,
                translateX: `${eyeDirection.x}px`,
                translateY: `${eyeDirection.y}px`
              }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute inset-1 bg-blue-400 rounded-full" />
              <div className="absolute inset-3 bg-blue-900 rounded-full" />
              <div className="absolute inset-4 bg-black rounded-full" />
              {/* Eye shine */}
              <div className="absolute top-1 left-3 w-3 h-3 bg-white rounded-full opacity-80" />
            </motion.div>
          </div>
          
          {/* Nose */}
          <div className="absolute top-2/5 left-1/2 transform -translate-x-1/2 w-6 h-10">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-300 rounded-full" />
          </div>
          
          {/* Mouth Area */}
          <div className="absolute bottom-1/4 left-1/4 right-1/4">
            {/* Lips */}
            <svg width="100%" height="40" viewBox="0 0 100 40" className="overflow-visible">
              <motion.path 
                d={lipPath} 
                stroke={isSpeaking ? "#c53030" : "#9d174d"} 
                strokeWidth={isSpeaking ? "3" : "2"} 
                fill="none"
                strokeLinecap="round"
                animate={{
                  strokeWidth: isSpeaking ? [2, 3, 2] : 2
                }}
                transition={{
                  duration: 0.5,
                  repeat: isSpeaking ? Infinity : 0
                }}
              />
            </svg>
            
            {/* Jawline */}
            <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-t from-amber-100 to-transparent rounded-b-full" />
          </div>
          
          {/* Professional Hair */}
          <div className="absolute -top-8 -left-4 -right-4 h-20 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-50 rounded-t-full">
            {/* Hair strands */}
            <div className="absolute top-4 left-8 w-3 h-12 bg-gray-300 rounded-full transform -rotate-12" />
            <div className="absolute top-2 left-16 w-4 h-14 bg-gray-300 rounded-full" />
            <div className="absolute top-4 right-8 w-3 h-12 bg-gray-300 rounded-full transform rotate-12" />
            <div className="absolute top-2 right-16 w-4 h-14 bg-gray-300 rounded-full" />
          </div>
          
          {/* Eyebrows - expressive based on emotion */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-16 h-4 bg-gray-300 rounded-full"
            animate={{
              translateY: emotion === 'thinking' ? -4 : 0,
              rotate: emotion === 'thinking' ? '2deg' : '0deg'
            }}
          />
          <motion.div 
            className="absolute top-1/4 right-1/4 w-16 h-4 bg-gray-300 rounded-full"
            animate={{
              translateY: emotion === 'thinking' ? -4 : 0,
              rotate: emotion === 'thinking' ? '-2deg' : '0deg'
            }}
          />
          
          {/* Glasses for professional look (optional) */}
          {emotion === 'thinking' && (
            <div className="absolute top-1/3 left-1/4 right-1/4">
              <div className="absolute left-8 w-16 h-16 rounded-full border-2 border-gray-600 opacity-30" />
              <div className="absolute right-8 w-16 h-16 rounded-full border-2 border-gray-600 opacity-30" />
              <div className="absolute left-24 right-24 top-8 h-1 bg-gray-200 opacity-40" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Indicator */}
      <div className="absolute bottom-4 right-4">
        <motion.div 
          className="w-4 h-4 rounded-full"
          animate={{
            backgroundColor: isSpeaking ? '#10b981' : isListening ? '#3b82f6' : '#6b7280',
            scale: isListening ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: isListening ? Infinity : 0
          }}
        />
      </div>
    </motion.div>
  );
};

// Enhanced UniVerse AI Assistant Component
export function UniVerseAIAssistant({ user }: { user: any }) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: `Welcome to **UniVerse Engineering AI Assistant**, ${user.name}! 🎓

I'm your specialized academic assistant trained exclusively in **ENGINEERING disciplines**. Here's what I can help you with:

🔹 **COMPUTER SCIENCE ENGINEERING**
• Operating Systems (Deadlock, Scheduling, Memory Management)
• Database Systems (Normalization, Transactions, SQL)
• Computer Networks (TCP/IP, OSI Model, Routing Protocols)
• Algorithms & Data Structures
• Compiler Design, Software Engineering

🔹 **ARTIFICIAL INTELLIGENCE & MACHINE LEARNING**
• Neural Networks & Deep Learning
• Backpropagation, Gradient Descent variants
• CNN, RNN, Transformers
• Natural Language Processing

🔹 **OTHER ENGINEERING DOMAINS**
• Computer Architecture
• Theory of Computation
• Distributed Systems
• Cybersecurity Fundamentals

📚 **ACADEMIC RESPONSE FORMAT**:
Every answer will include:
1. Definition & Concept Overview
2. Detailed Step-by-step Explanation
3. Mathematical Formulation/Algorithms
4. Real-world Engineering Examples
5. Exam-oriented Key Points
6. Common Student Mistakes
7. Summary & Study Guidance

**Ask me any engineering academic question**, for example:
• "Explain deadlock in operating systems with Banker's algorithm example"
• "Derive the backpropagation algorithm mathematically"
• "Compare TCP vs UDP with header structures"
• "Explain database normalization up to BCNF with examples"
• "Analyze time complexity of all sorting algorithms"`,
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'listening' | 'explaining'>('neutral');
  const [activeTab, setActiveTab] = useState<'chat' | 'engineering' | 'system'>('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);

  // Enhanced Engineering Quick Actions
  const engineeringQuickActions = [
    { 
      icon: Terminal, 
      label: 'Operating Systems', 
      action: 'Explain deadlock in operating systems with examples', 
      color: 'from-blue-600 to-cyan-500',
      emotion: 'thinking' as const
    },
    { 
      icon: Database, 
      label: 'Database Systems', 
      action: 'Explain database normalization with real examples', 
      color: 'from-purple-600 to-pink-500',
      emotion: 'explaining' as const
    },
    { 
      icon: Network, 
      label: 'Computer Networks', 
      action: 'Compare TCP and UDP with header structures', 
      color: 'from-green-600 to-teal-500',
      emotion: 'explaining' as const
    },
    { 
      icon: Brain, 
      label: 'Machine Learning', 
      action: 'Derive the backpropagation algorithm step by step', 
      color: 'from-orange-600 to-red-500',
      emotion: 'thinking' as const
    },
    { 
      icon: Cpu, 
      label: 'Algorithms', 
      action: 'Analyze time complexity of sorting algorithms', 
      color: 'from-indigo-600 to-purple-500',
      emotion: 'thinking' as const
    },
    { 
      icon: Code, 
      label: 'Data Structures', 
      action: 'Explain dynamic programming with examples', 
      color: 'from-rose-600 to-pink-500',
      emotion: 'explaining' as const
    },
    { 
      icon: Server, 
      label: 'System Design', 
      action: 'Explain ACID properties in database transactions', 
      color: 'from-yellow-600 to-orange-500',
      emotion: 'explaining' as const
    },
    { 
      icon: Lock, 
      label: 'Cybersecurity', 
      action: 'Explain RSA encryption algorithm mathematically', 
      color: 'from-gray-700 to-gray-900',
      emotion: 'thinking' as const
    }
  ];

  // System Languages
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸', icon: 'EN' },
    { code: 'es', label: 'Español', flag: '🇪🇸', icon: 'ES' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', icon: 'FR' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪', icon: 'DE' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', icon: 'HI' },
    { code: 'zh', label: '中文', flag: '🇨🇳', icon: '中文' },
  ];

  // Speech Synthesis with enhanced academic tone
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Extract main content (remove markdown formatting)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/[\[\]]/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
    utterance.rate = 0.9; // Slower for academic content
    utterance.pitch = 1.0;
    utterance.volume = 1;
    
    // Use a more professional voice if available
    const voices = window.speechSynthesis.getVoices();
    const professionalVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      v.name.includes('English')
    );
    
    if (professionalVoice) {
      utterance.voice = professionalVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingText(cleanText);
      setAvatarEmotion('explaining');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingText('');
      setAvatarEmotion('neutral');
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingText('');
      setAvatarEmotion('neutral');
    };
    
    window.speechSynthesis.speak(utterance);
    speechSynthesisRef.current = utterance;
  };

  // Voice Recognition
  const toggleVoiceListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAvatarEmotion('neutral');
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setTimeout(() => handleSendMessage(transcript), 100);
      };
      
      recognition.onstart = () => {
        setIsListening(true);
        setAvatarEmotion('listening');
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setAvatarEmotion('neutral');
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setAvatarEmotion('neutral');
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  // Check if query is engineering-related
  const isEngineeringQuery = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    
    const engineeringKeywords = [
      // Computer Science
      'operating system', 'os', 'deadlock', 'process', 'scheduling', 'memory',
      'database', 'dbms', 'sql', 'normalization', 'transaction', 'acid',
      'network', 'tcp', 'udp', 'osi', 'ip', 'protocol', 'routing',
      'algorithm', 'sort', 'search', 'complexity', 'dynamic programming',
      'data structure', 'tree', 'graph', 'linked list', 'hash',
      'compiler', 'parser', 'lexer', 'syntax', 'semantic',
      'software engineering', 'sdlc', 'agile', 'testing',
      
      // AI & ML
      'machine learning', 'ml', 'ai', 'neural network', 'backpropagation',
      'gradient', 'descent', 'cnn', 'rnn', 'transformer', 'nlp',
      'computer vision', 'deep learning', 'reinforcement',
      
      // Other Engineering
      'computer architecture', 'pipeline', 'cache', 'memory hierarchy',
      'theory of computation', 'automata', 'turing', 'complexity theory',
      'distributed system', 'consensus', 'replication',
      'cybersecurity', 'encryption', 'rsa', 'aes', 'ssl', 'tls',
      
      // Math & Foundations
      'discrete math', 'graph theory', 'probability', 'statistics',
      'linear algebra', 'calculus', 'derivative', 'integral',
      
      // Exam/Study terms
      'explain', 'derive', 'prove', 'calculate', 'analyze',
      'compare', 'contrast', 'define', 'what is', 'how does',
      'viva', 'exam', 'interview', 'question', 'problem'
    ];
    
    return engineeringKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Generate academic response with proper formatting
  const generateAcademicResponse = (query: string): string => {
    setIsProcessing(true);
    
    // Check if it's an engineering query
    if (!isEngineeringQuery(query)) {
      setIsProcessing(false);
      return `🔍 **Query Analysis**: "${query}"

I'm a specialized **Engineering Academic AI Assistant**, trained exclusively in engineering disciplines including:

• Computer Science Engineering
• Artificial Intelligence & Machine Learning  
• Database Systems
• Computer Networks
• Algorithms & Data Structures
• Operating Systems
• Software Engineering
• Computer Architecture
• Theory of Computation
• Distributed Systems
• Cybersecurity

Your query doesn't appear to be engineering-related. Please ask about:

📚 **Example Engineering Questions**:
• "Explain deadlock in operating systems with Banker's algorithm"
• "Derive the backpropagation algorithm mathematically"
• "Compare TCP and UDP protocols"
• "Explain database normalization with examples"
• "What is time complexity of quicksort algorithm?"

💡 **Tip**: Frame your question in an engineering academic context for detailed, structured explanations.`;
    }
    
    // Generate engineering response
    const response = generateEngineeringResponse(query);
    setIsProcessing(false);
    return response;
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setAvatarEmotion('thinking');

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAcademicResponse(textToSend);
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date(),
        type: 'engineering'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      // Speak the response
      speakText(aiResponse);
    }, 800);
  };

  const handleQuickAction = (action: string, emotion: any) => {
    setAvatarEmotion(emotion);
    setInputText(action);
    setTimeout(() => handleSendMessage(action), 100);
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAvatarEmotion('neutral');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 text-gray-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
          
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .scrollbar-thin { scrollbar-width: thin; }
          .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: #f3f4f6; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          
          .typing-indicator {
            display: inline-block;
            width: 60px;
            height: 20px;
            position: relative;
          }
          .typing-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
            position: absolute;
            animation: typing 1.5s infinite ease-in-out;
          }
          .typing-dot:nth-child(1) { left: 0; animation-delay: 0s; }
          .typing-dot:nth-child(2) { left: 20px; animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { left: 40px; animation-delay: 0.4s; }
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
          
          .pulse-ring {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .code-block {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
            background: #1a1a1a;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 0.5rem 0;
            overflow-x: auto;
          }
          .code-comment { color: #6a9955; }
          .code-keyword { color: #569cd6; }
          .code-string { color: #ce9178; }
          .code-function { color: #dcdcaa; }
          .code-number { color: #b5cea8; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  UniVerse Engineering AI Assistant
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Specialized academic assistant for engineering students | B.Tech/B.E Level
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-xl">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300">Engineering Mode</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Avatar & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Avatar Card */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="relative">
                {/* Realistic Human Avatar */}
                <div className="relative w-full aspect-square mb-6 bg-white/50 rounded-lg">
                  <RealisticHumanAvatar
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    emotion={avatarEmotion}
                    textToSpeak={currentSpeakingText}
                  />
                </div>

                {/* Avatar Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Professor AI</h3>
                  <p className="text-gray-600 text-sm">Engineering Academic Specialist</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500' : isListening ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                    <p className="text-gray-600 text-sm">
                      {isSpeaking ? 'Explaining...' : isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}
                    </p>
                  </div>
                </div>

                {/* System Status */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-600">AI Engine</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-1">Active</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-600">Knowledge</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-1">2.4TB</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleVoiceListening}
                    className={`relative p-4 rounded-xl transition-all transform hover:scale-105 ${
                      isListening
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isListening && <div className="absolute -inset-1 rounded-xl pulse-ring"></div>}
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={stopSpeaking}
                    disabled={!isSpeaking}
                    className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                      isSpeaking
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    }`}
                  >
                    <VolumeX className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setAvatarEmotion(prev => prev === 'thinking' ? 'neutral' : 'thinking')}
                    className="p-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all transform hover:scale-105"
                  >
                    <Brain className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-gray-900">Academic Language</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedLanguage === lang.code
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/50 text-gray-700 hover:bg-gray-100/50'
                    }`}
                  >
                    <span className="text-xl mb-1">{lang.flag}</span>
                    <span className="text-xs font-medium text-gray-700">{lang.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Engineering Domains */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-gray-900">Engineering Domains</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-600">Computer Science</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-600">AI & Machine Learning</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <Database className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-600">Database Systems</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <Network className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-600">Computer Networks</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 flex flex-col"
          >
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/30 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Academic Chat
                </div>
              </button>
              <button
                onClick={() => setActiveTab('engineering')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'engineering'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Engineering Q/A
                </div>
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'system'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4" />
                  System Info
                </div>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Quick Engineering Questions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {engineeringQuickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.action, action.emotion)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white flex flex-col items-center gap-2 hover:shadow-xl transition-all`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="text-xs text-center font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-white/30 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin max-h-[500px]">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[90%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'ai' 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                            : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg'
                        }`}> 
                          {message.sender === 'ai' ? (
                            <Cpu className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`p-4 rounded-2xl max-w-full ${
                          message.sender === 'ai'
                            ? 'bg-gray-100 text-gray-900 rounded-tl-none border-l-4 border-blue-500'
                            : 'bg-gradient-to-r from-blue-700/30 to-purple-700/30 text-gray-900 rounded-tr-none border-r-4 border-purple-500'
                        }`}> 
                          {message.sender === 'ai' && isProcessing && message.id === messages.length ? (
                            <div className="flex items-center gap-3">
                              <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                              </div>
                              <span className="text-sm text-gray-600">Processing engineering query...</span>
                            </div>
                          ) : (
                            <>
                              <div className="prose max-w-none">
                                <div className="whitespace-pre-line text-sm leading-relaxed">
                                  {message.text.split('\n').map((line, i) => {
                                    // Format code blocks
                                    if (line.includes('```')) {
                                      return (
                                        <div key={i} className="code-block my-2">
                                          <pre className="text-xs">{line.replace(/```/g, '')}</pre>
                                        </div>
                                      );
                                    }
                                    // Format lists
                                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                                      return (
                                        <div key={i} className="flex items-start gap-2 ml-4 my-1">
                                          <span className="text-blue-400 mt-1">•</span>
                                          <span>{line.replace(/^[•\-]\s*/, '')}</span>
                                        </div>
                                      );
                                    }
                                    // Format headers
                                    if (line.includes('**') && line.split('**').length >= 3) {
                                      return (
                                        <div key={i} className="font-bold text-lg text-blue-300 my-3">
                                          {line.replace(/\*\*/g, '')}
                                        </div>
                                      );
                                    }
                                    return <div key={i} className="my-2">{line}</div>;
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  {message.sender === 'ai' && (
                                    <>
                                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                      <span className="text-xs text-gray-600">Engineering AI</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-200/50 bg-white/30">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask any engineering academic question (OS, DBMS, Networks, AI, Algorithms...)"
                      className="w-full bg-white/50 border border-gray-200/50 rounded-xl py-4 px-6 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={toggleVoiceListening}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100/70 transition-colors"
                    >
                      <Mic className={`w-5 h-5 ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || !inputText.trim()}
                    className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                
                {/* Quick Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Try asking:</span>
                  <button 
                    onClick={() => handleSendMessage('Explain deadlock with Banker\'s algorithm example')}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Deadlock in OS
                  </button>
                  <span className="text-gray-600">•</span>
                  <button 
                    onClick={() => handleSendMessage('Compare TCP and UDP protocols')}
                    className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    TCP vs UDP
                  </button>
                  <span className="text-gray-600">•</span>
                  <button 
                    onClick={() => handleSendMessage('Explain database normalization with examples')}
                    className="text-xs text-green-400 hover:text-green-300 hover:underline"
                  >
                    DB Normalization
                  </button>
                  <span className="text-gray-600">•</span>
                  <button 
                    onClick={() => handleSendMessage('Derive backpropagation algorithm step by step')}
                    className="text-xs text-orange-400 hover:text-orange-300 hover:underline"
                  >
                    Backpropagation
                  </button>
                </div>
              </div>
            </div>

            {/* System Info Panel */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50"
              >
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  UniVerse Engineering AI System
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 rounded-xl">
                      <h4 className="text-gray-900 font-medium mb-2">System Capabilities</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Engineering academic explanations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Mathematical derivations & proofs
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Algorithm analysis & complexity
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Real-world engineering examples
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white/50 rounded-xl">
                      <h4 className="text-gray-900 font-medium mb-2">Response Format</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>1. Definition & Concept Overview</div>
                        <div>2. Detailed Explanation</div>
                        <div>3. Mathematical Formulation</div>
                        <div>4. Real-world Examples</div>
                        <div>5. Exam Key Points</div>
                        <div>6. Common Mistakes</div>
                        <div>7. Study Summary</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 rounded-xl">
                      <h4 className="text-gray-900 font-medium mb-2">Engineering Domains Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {['OS', 'DBMS', 'Networks', 'AI/ML', 'Algorithms', 'Architecture', 'Security', 'Theory'].map((domain) => (
                          <span key={domain} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/50 rounded-xl">
                      <h4 className="text-gray-900 font-medium mb-2">System Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">AI Model</span>
                          <span className="text-sm text-green-400">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Knowledge Base</span>
                          <span className="text-sm text-blue-600">2.4 TB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Response Time</span>
                          <span className="text-sm text-purple-600">&lt; 800ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Academic Level</span>
                          <span className="text-sm text-orange-400">B.Tech/B.E</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Export the assistant hook for integration
export const useUniVerseAssistant = () => {
  const [assistantData, setAssistantData] = useState<UniVerseSystemData>(mockUniVerseData);

  const updateUserData = (newData: Partial<UniVerseSystemData['user']>) => {
    setAssistantData(prev => ({
      ...prev,
      user: { ...prev.user, ...newData }
    }));
  };

  const addCertificate = (certificate: any) => {
    setAssistantData(prev => ({
      ...prev,
      certificates: {
        ...prev.certificates,
        total: prev.certificates.total + 1,
        recent: [certificate, ...prev.certificates.recent.slice(0, 4)]
      }
    }));
  };

  const generateHallTicket = (examId: string) => {
    setAssistantData(prev => ({
      ...prev,
      exams: {
        ...prev.exams,
        upcoming: prev.exams.upcoming.map(exam => 
          exam.id === examId ? { ...exam, hallTicketGenerated: true } : exam
        ),
        hallTickets: [
          ...prev.exams.hallTickets,
          {
            examId,
            downloadUrl: `/hall-tickets/${examId}.pdf`,
            qrCode: `QR_CODE_${Math.random().toString(36).substr(2, 9)}`,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    }));
  };

  const askEngineeringQuestion = async (question: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateEngineeringResponse(question));
      }, 800);
    });
  };

  return {
    assistantData,
    updateUserData,
    addCertificate,
    generateHallTicket,
    askEngineeringQuestion,
    // Engineering specific methods
    getEngineeringTopics: () => Object.keys(engineeringKnowledgeBase),
    getTopicDetails: (topic: string) => engineeringKnowledgeBase[topic as keyof typeof engineeringKnowledgeBase],
  };
};

// Provide a named export alias for compatibility with existing imports
export { UniVerseAIAssistant as AIAvatarAssistant };

// Export default component
export default UniVerseAIAssistant;