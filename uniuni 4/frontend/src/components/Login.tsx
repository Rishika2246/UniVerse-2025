import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Lock, Fingerprint, Smartphone, QrCode, 
  Globe, Shield, Eye, EyeOff, Scan, GraduationCap,
  Users, Settings, CalendarCheck, UserCheck
} from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [step, setStep] = useState<'role' | 'auth'>('role');
  const [loginMethod, setLoginMethod] = useState<'password' | 'face' | 'qr' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin' | 'seating-manager' | 'club-coordinator'>('student');

  const roles = [
    {
      id: 'student' as const,
      label: 'Student',
      icon: GraduationCap,
      description: 'Access your courses, attendance & grades',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'faculty' as const,
      label: 'Faculty',
      icon: UserCheck,
      description: 'Manage classes & student assessments',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'admin' as const,
      label: 'Administrator',
      icon: Settings,
      description: 'System administration & management',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'seating-manager' as const,
      label: 'Seating Manager',
      icon: CalendarCheck,
      description: 'Manage exam seating allocations',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'club-coordinator' as const,
      label: 'Club Coordinator',
      icon: Users,
      description: 'Coordinate club activities & events',
      color: 'from-indigo-500 to-violet-500'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For admin role, redirect directly to advanced backend admin
    if (role === 'admin') {
      window.location.href = 'http://localhost:3001/admin/advanced';
      return;
    }

    // Mock authentication with role-specific Indian names for other roles
    const userData: any = {
      email: email || 'user@campus.edu',
      role,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + role
    };

    // Role-specific user data with Indian names
    if (role === 'student') {
      userData.id = 'STU2024001';
      userData.name = 'Arjun Sharma';
      userData.department = 'Computer Science';
      userData.semester = '6th Semester';
    } else if (role === 'faculty') {
      userData.id = 'FAC2020045';
      userData.name = 'Dr. Priya Deshmukh';
      userData.department = 'Computer Science';
    } else if (role === 'seating-manager') {
      userData.id = 'SM2021010';
      userData.name = 'Vikram Patel';
      userData.department = 'Exam Cell';
    } else if (role === 'club-coordinator') {
      userData.id = 'CC2022005';
      userData.name = 'Ananya Iyer';
      userData.department = 'Student Activities';
    }

    onLogin(userData);
  };

  const handleRoleSelect = (roleId: typeof role) => {
    setRole(roleId);
    setStep('auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-200">
          {/* Header */}
          <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 border-b border-cyan-200">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                UniVerse
              </h1>
              <p className="text-xl text-gray-600">
                Next-Generation University Management Platform
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {step === 'role' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your Role</h2>
                  <p className="text-gray-600">Choose your account type to continue</p>
                </div>

                {/* Role Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {roles.map((r, index) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRoleSelect(r.id)}
                      className="group relative p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-cyan-400 hover:shadow-xl transition-all duration-300 text-left"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <r.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{r.label}</h3>
                      <p className="text-sm text-gray-600">{r.description}</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center pt-4">
                  <Shield className="w-4 h-4" />
                  <span>Protected by SSO, MFA & Geo-fencing</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => setStep('role')}
                    className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Change Role
                  </button>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome Back, {roles.find(r => r.id === role)?.label}
                  </h2>
                  <p className="text-gray-600">Sign in to access your campus portal</p>
                </div>

                {/* Selected Role Display */}
                <div className={`p-4 bg-gradient-to-br ${roles.find(r => r.id === role)?.color} rounded-xl flex items-center gap-4`}>
                  {(() => {
                    const RoleIcon = roles.find(r => r.id === role)?.icon || User;
                    return <RoleIcon className="w-8 h-8 text-white" />;
                  })()}
                  <div>
                    <p className="text-white font-semibold">{roles.find(r => r.id === role)?.label}</p>
                    <p className="text-white/80 text-sm">{roles.find(r => r.id === role)?.description}</p>
                  </div>
                </div>

                {/* Login Method Selection */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { method: 'password', icon: Lock, label: 'Password' },
                    { method: 'face', icon: Scan, label: 'Face ID' },
                    { method: 'qr', icon: QrCode, label: 'QR Code' },
                    { method: 'otp', icon: Smartphone, label: 'OTP' },
                  ].map(({ method, icon: Icon, label }) => (
                    <button
                      key={method}
                      onClick={() => setLoginMethod(method as any)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        loginMethod === method
                          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${loginMethod === method ? 'text-cyan-600' : 'text-gray-500'}`} />
                      <span className={`text-xs ${loginMethod === method ? 'text-cyan-600 font-semibold' : 'text-gray-600'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {loginMethod === 'password' && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">Email or Student ID</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            placeholder="Enter your email or ID"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2 font-medium">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-10 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {loginMethod === 'face' && (
                    <div className="py-8">
                      <div className="relative w-48 h-48 mx-auto">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-blue-500 rounded-full"
                        />
                        <div className="absolute inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                          <Scan className="w-16 h-16 text-cyan-600" />
                        </div>
                      </div>
                      <p className="text-center text-gray-600 mt-4">Position your face in the camera</p>
                    </div>
                  )}

                  {loginMethod === 'qr' && (
                    <div className="py-8">
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-800" />
                      </div>
                      <p className="text-center text-gray-600 mt-4">Scan QR code with your mobile app</p>
                    </div>
                  )}

                  {loginMethod === 'otp' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">Phone Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          className="w-full bg-white border border-gray-300 rounded-xl py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                      >
                        Send OTP
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-600 cursor-pointer">
                      <input type="checkbox" className="mr-2 rounded" />
                      Remember me
                    </label>
                    <button type="button" className="text-cyan-600 hover:text-cyan-700 font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/30"
                  >
                    Sign In Securely
                  </motion.button>
                </form>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}