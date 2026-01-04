// Student API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  message?: string;
}

interface StudentDashboard {
  student: {
    id: string;
    fullName: string;
    rollNo: string;
    email: string;
  };
  courses: any[];
  upcomingExams: any[];
  recentGrades: any[];
  seatingAllocations: any[];
  attendanceStats: {
    totalClasses: number;
    attendedClasses: number;
    attendancePercentage: number;
  };
  achievements: any[];
  stats: {
    totalCourses: number;
    upcomingExams: number;
    currentGPA: number;
    creditsCompleted: number;
  };
}

interface SeatingAllocation {
  allocation: any;
  hallLayout: any;
  examDetails: {
    name: string;
    date: string;
    time: string;
    hall: string;
    seat: string;
    reportingTime: string;
    entryGate: string;
  };
}

interface AttendanceData {
  records: any[];
  stats: {
    totalClasses: number;
    attendedClasses: number;
    absentClasses: number;
    attendancePercentage: number;
    monthlyStats: any[];
  };
}

interface StudyMaterials {
  courses: any[];
  mindMaps: any[];
  studyResources: any[];
  stats: {
    totalCourses: number;
    totalMindMaps: number;
    totalResources: number;
  };
}

interface ExamSchedule {
  upcomingExams: any[];
  pastResults: any[];
  stats: {
    upcomingCount: number;
    completedCount: number;
    averageGrade: string;
    averageMarks: number;
  };
}

interface ClubsAndEvents {
  clubs: any[];
  upcomingEvents: any[];
  myEvents: any[];
  stats: {
    totalClubs: number;
    upcomingEvents: number;
    myEventsCount: number;
  };
}

interface StudentAnalytics {
  academicPerformance: any;
  attendanceAnalytics: any;
  examPerformance: any;
  studyPatterns: any;
  achievements: any;
}

class StudentApi {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ===== DASHBOARD =====
  
  async getStudentDashboard(): Promise<StudentDashboard> {
    const response = await this.request<ApiResponse<StudentDashboard>>('/students/dashboard');
    return response.data;
  }

  // ===== SEATING AND EXAMS =====
  
  async getStudentSeatingAllocation(examId: string): Promise<SeatingAllocation> {
    const response = await this.request<ApiResponse<SeatingAllocation>>(`/students/exams/${examId}/seating`);
    return response.data;
  }

  async getExamSchedule(): Promise<ExamSchedule> {
    const response = await this.request<ApiResponse<ExamSchedule>>('/students/exams/schedule');
    return response.data;
  }

  // ===== ATTENDANCE =====
  
  async getStudentAttendance(): Promise<AttendanceData> {
    const response = await this.request<ApiResponse<AttendanceData>>('/students/attendance');
    return response.data;
  }

  // ===== STUDY MATERIALS =====
  
  async getStudyMaterials(): Promise<StudyMaterials> {
    const response = await this.request<ApiResponse<StudyMaterials>>('/students/study-materials');
    return response.data;
  }

  // ===== CLUBS AND EVENTS =====
  
  async getStudentClubsAndEvents(): Promise<ClubsAndEvents> {
    const response = await this.request<ApiResponse<ClubsAndEvents>>('/students/clubs-events');
    return response.data;
  }

  async toggleEventAttendance(eventId: string): Promise<{ attending: boolean }> {
    const response = await this.request<ApiResponse<{ attending: boolean }>>(`/students/events/${eventId}/toggle-attendance`, {
      method: 'POST',
    });
    return response.data;
  }

  // ===== ANALYTICS =====
  
  async getStudentAnalytics(): Promise<StudentAnalytics> {
    const response = await this.request<ApiResponse<StudentAnalytics>>('/students/analytics');
    return response.data;
  }

  // ===== LEGACY ENDPOINTS =====
  
  async getStudentSummary(): Promise<any> {
    const response = await this.request<any>('/students/me/summary');
    return response;
  }

  // ===== SEATING SPECIFIC (for student view) =====
  
  async getMySeatingAllocation(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ allocation: any }>>(`/seating/exams/${examId}/my-seat`);
    return response.data.allocation;
  }

  // ===== HALL TICKETS =====
  
  async getHallTickets(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ hallTickets: any[] }>>('/hall-tickets');
    return response.data.hallTickets;
  }

  async getHallTicket(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ hallTicket: any }>>(`/hall-tickets/exam/${examId}`);
    return response.data.hallTicket;
  }

  // ===== COURSES =====
  
  async getEnrolledCourses(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ courses: any[] }>>('/courses/enrolled');
    return response.data.courses;
  }

  async getCourseDetails(courseId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ course: any }>>(`/courses/${courseId}`);
    return response.data.course;
  }

  // ===== MIND MAPS =====
  
  async getMindMaps(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ mindMaps: any[] }>>('/mindmaps');
    return response.data.mindMaps;
  }

  async createMindMap(mindMapData: any): Promise<any> {
    const response = await this.request<ApiResponse<{ mindMap: any }>>('/mindmaps', {
      method: 'POST',
      body: JSON.stringify(mindMapData),
    });
    return response.data.mindMap;
  }

  async updateMindMap(mindMapId: string, mindMapData: any): Promise<any> {
    const response = await this.request<ApiResponse<{ mindMap: any }>>(`/mindmaps/${mindMapId}`, {
      method: 'PUT',
      body: JSON.stringify(mindMapData),
    });
    return response.data.mindMap;
  }

  async deleteMindMap(mindMapId: string): Promise<void> {
    await this.request(`/mindmaps/${mindMapId}`, {
      method: 'DELETE',
    });
  }

  // ===== PROFILE =====
  
  async getProfile(): Promise<any> {
    const response = await this.request<ApiResponse<{ user: any }>>('/users/profile');
    return response.data.user;
  }

  async updateProfile(profileData: any): Promise<any> {
    const response = await this.request<ApiResponse<{ user: any }>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data.user;
  }

  // ===== NOTIFICATIONS =====
  
  async getNotifications(): Promise<any[]> {
    // Mock notifications for now
    return [
      {
        id: '1',
        title: 'Exam Seating Published',
        message: 'Your seating allocation for Database Systems exam has been published.',
        type: 'exam',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'New Study Material',
        message: 'New study material uploaded for Computer Networks.',
        type: 'study',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        title: 'Event Reminder',
        message: 'Tech Talk event starts in 2 hours.',
        type: 'event',
        read: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    // Mock implementation
    console.log(`Marking notification ${notificationId} as read`);
  }

  // ===== CALENDAR =====
  
  async getCalendarEvents(): Promise<any[]> {
    // Mock calendar events
    return [
      {
        id: '1',
        title: 'Database Systems Exam',
        date: '2024-12-20',
        time: '10:00 AM',
        type: 'exam',
        location: 'Hall A',
      },
      {
        id: '2',
        title: 'Computer Networks Lab',
        date: '2024-12-21',
        time: '2:00 PM',
        type: 'class',
        location: 'Lab 1',
      },
      {
        id: '3',
        title: 'Tech Club Meeting',
        date: '2024-12-22',
        time: '4:00 PM',
        type: 'event',
        location: 'Conference Room',
      },
    ];
  }
}

export const studentApi = new StudentApi();
export default studentApi;