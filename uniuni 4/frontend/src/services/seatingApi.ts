// Seating Management API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  message?: string;
}

interface SeatingManagerDashboard {
  stats: {
    totalStudents: number;
    totalHalls: number;
    totalExams: number;
    totalAllocations: number;
    utilizationRate: string;
  };
  recentAllocations: any[];
  upcomingExams: any[];
}

interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: string;
}

interface Hall {
  id: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
  seats: any[][];
  isActive: boolean;
  blockedSeats: string[];
}

interface Student {
  id: string;
  fullName: string;
  rollNo: string;
  email: string;
  department: string;
  semester: string;
  subject: string;
  specialNeeds: boolean;
  specialNeedsType?: string;
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

class SeatingApi {
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

  // ===== SEATING MANAGER DASHBOARD =====
  
  async getSeatingManagerDashboard(): Promise<SeatingManagerDashboard> {
    const response = await this.request<ApiResponse<SeatingManagerDashboard>>('/seating/manager/dashboard');
    return response.data;
  }

  // ===== EXAM MANAGEMENT =====
  
  async createExam(examData: Partial<Exam>): Promise<Exam> {
    const response = await this.request<ApiResponse<{ exam: Exam }>>('/seating/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
    return response.data.exam;
  }

  async updateExam(examId: string, examData: Partial<Exam>): Promise<Exam> {
    const response = await this.request<ApiResponse<{ exam: Exam }>>(`/seating/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...examData, id: examId }),
    });
    return response.data.exam;
  }

  async deleteExam(examId: string): Promise<void> {
    await this.request(`/seating/exams/${examId}`, {
      method: 'DELETE',
    });
  }

  async getExams(): Promise<Exam[]> {
    const response = await this.request<ApiResponse<{ exams: Exam[] }>>('/exams');
    return response.data.exams;
  }

  // ===== HALL MANAGEMENT =====
  
  async createHall(hallData: Partial<Hall>): Promise<Hall> {
    const response = await this.request<ApiResponse<{ hall: Hall }>>('/seating/halls', {
      method: 'POST',
      body: JSON.stringify(hallData),
    });
    return response.data.hall;
  }

  async updateHall(hallId: string, hallData: Partial<Hall>): Promise<Hall> {
    const response = await this.request<ApiResponse<{ hall: Hall }>>(`/seating/halls/${hallId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...hallData, id: hallId }),
    });
    return response.data.hall;
  }

  async getHalls(): Promise<Hall[]> {
    const response = await this.request<ApiResponse<{ rooms: Hall[] }>>('/seating/rooms');
    return response.data.rooms;
  }

  async getHall(hallId: string): Promise<Hall> {
    const response = await this.request<ApiResponse<{ room: Hall }>>(`/seating/rooms/${hallId}`);
    return response.data.room;
  }

  // ===== STUDENT MANAGEMENT =====
  
  async getStudentsForAllocation(params: {
    search?: string;
    department?: string;
    subject?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ students: Student[]; pagination: any; totalCount: number }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });

    const response = await this.request<ApiResponse<{
      students: Student[];
      pagination: any;
      totalCount: number;
    }>>(`/seating/students?${queryParams}`);
    
    return response.data;
  }

  // ===== SEATING ALLOCATION =====
  
  async generateSeatingAllocation(examId: string, config: {
    hallIds: string[];
    config: AllocationConfig;
  }): Promise<{
    allocations: any[];
    stats: any;
    config: AllocationConfig;
  }> {
    const response = await this.request<ApiResponse<{
      allocations: any[];
      stats: any;
      config: AllocationConfig;
    }>>(`/seating/exams/${examId}/advanced-allocate`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
    return response.data;
  }

  async getSeatingAllocation(examId: string): Promise<any[]> {
    const response = await this.request<ApiResponse<{ allocations: any[] }>>(`/seating/exams/${examId}/allocations`);
    return response.data.allocations;
  }

  async clearSeatingAllocation(examId: string): Promise<void> {
    await this.request(`/seating/exams/${examId}/allocations`, {
      method: 'DELETE',
    });
  }

  // ===== CONFLICTS AND ANALYTICS =====
  
  async getAllocationConflicts(examId: string): Promise<any[]> {
    const response = await this.request<ApiResponse<{ conflicts: any[] }>>(`/seating/exams/${examId}/conflicts`);
    return response.data.conflicts;
  }

  async getAllocationVersions(examId: string): Promise<any[]> {
    const response = await this.request<ApiResponse<{ versions: any[] }>>(`/seating/exams/${examId}/versions`);
    return response.data.versions;
  }

  async getAnalytics(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/seating/exams/${examId}/analytics`);
    return response.data;
  }

  // ===== PUBLISHING AND EXPORT =====
  
  async publishAllocation(examId: string): Promise<void> {
    await this.request(`/seating/exams/${examId}/publish`, {
      method: 'POST',
    });
  }

  async generateQRCodes(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/seating/exams/${examId}/qr-codes`);
    return response.data;
  }

  async exportSeatingChart(examId: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/seating/exams/${examId}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // ===== HALL LAYOUT =====
  
  async getHallLayout(hallId: string, examId?: string): Promise<any> {
    const queryParams = examId ? `?examId=${examId}` : '';
    const response = await this.request<ApiResponse<{ layout: any }>>(`/seating/halls/${hallId}/layout${queryParams}`);
    return response.data.layout;
  }

  // ===== LIVE OCCUPANCY =====
  
  async getLiveOccupancy(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/seating/exams/${examId}/live-occupancy`);
    return response.data;
  }

  async updateAttendance(examId: string, studentId: string, isPresent: boolean): Promise<void> {
    await this.request(`/seating/exams/${examId}/students/${studentId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ isPresent }),
    });
  }
}

export const seatingApi = new SeatingApi();
export default seatingApi;