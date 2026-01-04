// General API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  rollNo?: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  rollNo?: string;
  roles: string[];
}

class ApiService {
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

  // ===== AUTHENTICATION =====
  
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await this.request<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.user;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.request<ApiResponse<{ token: string }>>('/auth/refresh');
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  // ===== USER MANAGEMENT =====
  
  async getProfile(): Promise<User> {
    const response = await this.request<ApiResponse<{ user: User }>>('/users/profile');
    return response.data.user;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await this.request<ApiResponse<{ user: User }>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data.user;
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // ===== COURSES =====
  
  async getCourses(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ courses: any[] }>>('/courses');
    return response.data.courses;
  }

  async getCourse(courseId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ course: any }>>(`/courses/${courseId}`);
    return response.data.course;
  }

  async enrollInCourse(courseId: string): Promise<void> {
    await this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async unenrollFromCourse(courseId: string): Promise<void> {
    await this.request(`/courses/${courseId}/unenroll`, {
      method: 'DELETE',
    });
  }

  // ===== EXAMS =====
  
  async getExams(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ exams: any[] }>>('/exams');
    return response.data.exams;
  }

  async getExam(examId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ exam: any }>>(`/exams/${examId}`);
    return response.data.exam;
  }

  // ===== CLUBS =====
  
  async getClubs(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ clubs: any[] }>>('/clubs');
    return response.data.clubs;
  }

  async getClub(clubId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ club: any }>>(`/clubs/${clubId}`);
    return response.data.club;
  }

  async joinClub(clubId: string): Promise<void> {
    await this.request(`/clubs/${clubId}/join`, {
      method: 'POST',
    });
  }

  async leaveClub(clubId: string): Promise<void> {
    await this.request(`/clubs/${clubId}/leave`, {
      method: 'DELETE',
    });
  }

  // ===== EVENTS =====
  
  async getEvents(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ events: any[] }>>('/events');
    return response.data.events;
  }

  async getEvent(eventId: string): Promise<any> {
    const response = await this.request<ApiResponse<{ event: any }>>(`/events/${eventId}`);
    return response.data.event;
  }

  async createEvent(eventData: any): Promise<any> {
    const response = await this.request<ApiResponse<{ event: any }>>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return response.data.event;
  }

  async updateEvent(eventId: string, eventData: any): Promise<any> {
    const response = await this.request<ApiResponse<{ event: any }>>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return response.data.event;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // ===== ADMIN APIS =====
  
  async getAdminStats(): Promise<any> {
    const response = await this.request<ApiResponse<any>>('/admin/stats');
    return response.data;
  }

  async getAdminDashboard(): Promise<any> {
    const response = await this.request<ApiResponse<any>>('/admin/dashboard');
    return response.data;
  }

  async searchUsers(query: string): Promise<any[]> {
    const response = await this.request<ApiResponse<{ users: any[] }>>(`/admin/users/search?q=${encodeURIComponent(query)}`);
    return response.data.users;
  }

  // ===== FACULTY APIS =====
  
  async getFacultyDashboard(): Promise<any> {
    const response = await this.request<ApiResponse<any>>('/faculty/dashboard');
    return response.data;
  }

  async getFacultyCourses(): Promise<any[]> {
    const response = await this.request<ApiResponse<{ courses: any[] }>>('/faculty/courses');
    return response.data.courses;
  }

  async getFacultyStudents(courseId?: string): Promise<any[]> {
    const endpoint = courseId ? `/faculty/students?courseId=${courseId}` : '/faculty/students';
    const response = await this.request<ApiResponse<{ students: any[] }>>(endpoint);
    return response.data.students;
  }

  // ===== UTILITY METHODS =====
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ===== FILE UPLOAD =====
  
  async uploadFile(file: File, endpoint: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // ===== HEALTH CHECK =====
  
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/status/health`);
    return response.json();
  }
}

export const api = new ApiService();
export default api;