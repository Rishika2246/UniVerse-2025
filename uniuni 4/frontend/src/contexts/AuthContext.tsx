import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  rollNo?: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { fullName: string; email: string; password: string; rollNo?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // Verify token is still valid
          const currentUser = await api.getCurrentUser();
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: currentUser, token } 
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const result = await api.login({ email, password });
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: { fullName: string; email: string; password: string; rollNo?: string }) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const result = await api.register(userData);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
  };

  const hasRole = (role: string): boolean => {
    return state.user?.roles.includes(role) || false;
  };

  const hasAnyRole = (...roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    if (requiredRoles && !hasAnyRole(...requiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for role-based rendering
export function useRoleBasedAccess() {
  const { hasRole, hasAnyRole, user } = useAuth();

  const isStudent = hasRole('STUDENT');
  const isFaculty = hasRole('FACULTY');
  const isAdmin = hasRole('ADMIN');
  const isSeatingManager = hasRole('SEATING_MANAGER');
  const isClubCoordinator = hasRole('CLUB_COORDINATOR');

  const canAccessSeatingManager = hasAnyRole('ADMIN', 'SEATING_MANAGER');
  const canAccessAdminPanel = hasRole('ADMIN');
  const canManageClubs = hasAnyRole('ADMIN', 'CLUB_COORDINATOR');
  const canManageFaculty = hasAnyRole('ADMIN', 'FACULTY');

  return {
    user,
    hasRole,
    hasAnyRole,
    isStudent,
    isFaculty,
    isAdmin,
    isSeatingManager,
    isClubCoordinator,
    canAccessSeatingManager,
    canAccessAdminPanel,
    canManageClubs,
    canManageFaculty,
  };
}

export default AuthContext;