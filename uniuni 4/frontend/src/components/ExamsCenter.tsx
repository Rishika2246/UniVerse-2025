import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Calendar, MapPin, Download, FileText, Award, Clock, CheckCircle, AlertCircle, BookOpen, TrendingUp, Brain, Target, Calculator, Bell, BookMarked, BarChart3, Lightbulb, Timer, ClipboardList, Flag, Eye, PieChart, QrCode, Navigation, Radio, Info, Boxes, X } from 'lucide-react';
import { SeatingAllocation } from './SeatingAllocation';
import { toast } from 'sonner';

interface ExamsCenterProps {
  user: any;
}

export function ExamsCenter({ user }: ExamsCenterProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'hallticket' | 'seating' | 'results' | 'map' | 'updates' | 'guidelines'>('schedule');
  const [showQRModal, setShowQRModal] = useState(false);

  // Generate unique QR code data for the student
  const generateQRData = () => {
    return {
      studentId: user.id || '2024CS001',
      name: user.name,
      rollNumber: '2024CS001',
      hallTicketNumber: `HT-2024-${user.name.split(' ')[0].toUpperCase()}`,
      examSession: 'December 2024',
      timestamp: new Date().toISOString(),
      verificationCode: Math.random().toString(36).substring(2, 15)
    };
  };

  // Get QR code image path based on user
  const getQRCodePath = () => {
    // In a real application, this would be dynamically generated
    // For demo, we'll use the static QR code
    return '/assets/qr-codes/hall-ticket-qr.svg';
  };

  const handleShowQRCode = () => {
    setShowQRModal(true);
    toast.success('QR Code displayed for verification');
  };

  const handleDownloadHallTicket = () => {
    // Create a link to download the QR code image
    const qrImagePath = getQRCodePath();
    const link = document.createElement('a');
    link.href = qrImagePath;
    link.download = `hall-ticket-qr-${user.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Hall ticket QR code downloaded successfully!');
  };

  const handleDownloadFullHallTicket = () => {
    // In a real application, this would generate a PDF
    toast.success('Generating hall ticket PDF... Download will start shortly.');
    
    // Simulate PDF generation delay
    setTimeout(() => {
      toast.success('Hall ticket PDF downloaded successfully!');
    }, 2000);
  };

  const upcomingExams = [
    { subject: 'Data Structures', code: 'CS301', date: 'Dec 10, 2024', time: '10:00 AM - 1:00 PM', room: 'Hall A', seat: 'A-42', status: 'upcoming' },
    { subject: 'Web Development', code: 'CS302', date: 'Dec 12, 2024', time: '2:00 PM - 5:00 PM', room: 'Hall B', seat: 'B-28', status: 'upcoming' },
    { subject: 'Algorithms', code: 'CS401', date: 'Dec 15, 2024', time: '10:00 AM - 1:00 PM', room: 'Hall C', seat: 'C-15', status: 'upcoming' },
  ];

  const results = [
    { subject: 'Database Systems', code: 'CS201', grade: 'A', marks: 92, total: 100, percentage: 92, status: 'published' },
    { subject: 'Operating Systems', code: 'CS202', grade: 'A+', marks: 96, total: 100, percentage: 96, status: 'published' },
    { subject: 'Computer Networks', code: 'CS203', grade: 'B+', marks: 85, total: 100, percentage: 85, status: 'published' },
    { subject: 'Software Engineering', code: 'CS204', grade: null, marks: null, total: 100, percentage: null, status: 'pending' },
  ];

  const seatingLayout = [
    ['A-1', 'A-2', 'A-3', 'A-4', 'A-5', 'A-6', 'A-7', 'A-8'],
    ['A-9', 'A-10', 'A-11', 'A-12', 'A-13', 'A-14', 'A-15', 'A-16'],
    ['', '', '', '', '', '', '', ''],
    ['B-1', 'B-2', 'B-3', 'B-4', 'B-5', 'B-6', 'B-7', 'B-8'],
    ['B-9', 'B-10', 'B-11', 'B-12', 'B-13', 'B-14', 'B-15', 'B-16'],
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-300">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Examination Center</h2>
            <p className="text-gray-800">Schedules, hall tickets, seating, and results - all in one place</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { id: 'schedule', label: 'Exam Schedule', icon: Calendar },
          { id: 'hallticket', label: 'Hall Ticket', icon: FileText },
          { id: 'seating', label: 'Seating Plan', icon: MapPin },
          { id: 'results', label: 'Results', icon: Award },
          { id: 'map', label: 'Map', icon: Navigation },
          { id: 'updates', label: 'Updates', icon: Info },
          { id: 'guidelines', label: 'Guidelines', icon: Radio },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-cyan-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {upcomingExams.map((exam, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-1">{exam.subject}</h3>
                    <p className="text-sm text-gray-600 mb-3">Course Code: {exam.code}</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm">{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm">{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm">{exam.room} - Seat {exam.seat}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Hall Ticket Tab */}
      {activeTab === 'hallticket' && (
        <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">UniVerse University</h2>
                <p className="text-cyan-100">End Semester Examination - December 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-cyan-100">Hall Ticket</p>
                <p className="text-xl font-bold">HT-2024-{user.name.split(' ')[0].toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="text-lg font-bold text-black">{user.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Roll Number</p>
                      <p className="font-semibold text-black">2024CS001</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Program</p>
                      <p className="font-semibold text-black">B.Tech Computer Science</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Semester</p>
                      <p className="font-semibold text-black">5th Semester</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Section</p>
                      <p className="font-semibold text-black">Section A</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-40 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center border-2 border-cyan-300">
                  <span className="text-4xl font-bold text-cyan-600">{user.name.split(' ').map((n: string) => n[0]).join('')}</span>
                </div>
                
                {/* QR Code */}
                <div className="bg-white p-3 rounded-xl border-2 border-cyan-300 shadow-md">
                  <div className="w-24 h-24 bg-white rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={getQRCodePath()} 
                      alt="Hall Ticket QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <QrCode className="w-16 h-16 text-gray-600 hidden" />
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2">Scan QR Code</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-cyan-200 pt-6">
              <h3 className="font-bold text-black mb-4 text-lg">Examination Details</h3>
              <div className="space-y-2">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-black">{exam.code}</p>
                    <p className="text-black col-span-2">{exam.subject}</p>
                    <p className="text-gray-600">{exam.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Instructions:</p>
                  <ul className="text-xs text-black space-y-1">
                    <li>• Report 30 minutes before exam time</li>
                    <li>• Bring valid ID card and hall ticket</li>
                    <li>• Mobile phones not allowed in exam hall</li>
                    <li>• Present QR code for verification</li>
                  </ul>
                </div>
                <div className="text-right">
                  <div className="inline-block border-t-2 border-black pt-2">
                    <p className="text-sm font-semibold text-black">Controller of Examinations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-t border-cyan-200 flex justify-end gap-3">
            <button 
              onClick={handleShowQRCode}
              className="px-6 py-3 bg-white border border-cyan-300 text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all flex items-center gap-2 font-semibold"
            >
              <QrCode className="w-5 h-5" />
              Show QR Code
            </button>
            <button 
              onClick={handleDownloadFullHallTicket}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download Hall Ticket
            </button>
          </div>
        </div>
      )}

      {/* Seating Tab */}
      {activeTab === 'seating' && (
        <SeatingAllocation user={user} />
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-3xl font-bold text-black mb-1">8.7</h3>
              <p className="text-gray-600">Current CGPA</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <Award className="w-8 h-8 text-cyan-600 mb-3" />
              <h3 className="text-3xl font-bold text-black mb-1">3/4</h3>
              <p className="text-gray-600">Results Published</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
              <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-3xl font-bold text-black mb-1">100%</h3>
              <p className="text-gray-600">Pass Rate</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <th className="text-left p-4 text-black font-semibold">Course Code</th>
                    <th className="text-left p-4 text-black font-semibold">Subject</th>
                    <th className="text-center p-4 text-black font-semibold">Marks</th>
                    <th className="text-center p-4 text-black font-semibold">Grade</th>
                    <th className="text-center p-4 text-black font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                    >
                      <td className="p-4 text-black font-semibold">{result.code}</td>
                      <td className="p-4 text-black">{result.subject}</td>
                      <td className="p-4 text-center text-black">
                        {result.marks !== null ? `${result.marks}/${result.total}` : '-'}
                      </td>
                      <td className="p-4 text-center">
                        {result.grade ? (
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-700' :
                            result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {result.grade}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          result.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <Navigation className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-3xl font-bold text-black mb-1">Campus Map</h3>
            <p className="text-gray-600">Find your way around the campus</p>
          </div>

          <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <th className="text-left p-4 text-black font-semibold">Building</th>
                    <th className="text-left p-4 text-black font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">Main Building</td>
                    <td className="p-4 text-black">Central Campus</td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">Science Building</td>
                    <td className="p-4 text-black">North Campus</td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">Library</td>
                    <td className="p-4 text-black">East Campus</td>
                  </motion.tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <Info className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-3xl font-bold text-black mb-1">Exam Updates</h3>
            <p className="text-gray-600">Stay informed about exam changes</p>
          </div>

          <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <th className="text-left p-4 text-black font-semibold">Subject</th>
                    <th className="text-left p-4 text-black font-semibold">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingExams.map((exam, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                    >
                      <td className="p-4 text-black font-semibold">{exam.subject}</td>
                      <td className="p-4 text-black">
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Exam scheduled on {exam.date}</li>
                          <li>• Time: {exam.time}</li>
                          <li>• Room: {exam.room}</li>
                          <li>• Seat: {exam.seat}</li>
                        </ul>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
            <Radio className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-3xl font-bold text-black mb-1">Exam Guidelines</h3>
            <p className="text-gray-600">Follow these rules for a smooth exam experience</p>
          </div>

          <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <th className="text-left p-4 text-black font-semibold">Guideline</th>
                    <th className="text-left p-4 text-black font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">Report Early</td>
                    <td className="p-4 text-black">Report 30 minutes before exam time</td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">Bring ID</td>
                    <td className="p-4 text-black">Bring valid ID card and hall ticket</td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="border-b border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="p-4 text-black font-semibold">No Mobile Phones</td>
                    <td className="p-4 text-black">Mobile phones not allowed in exam hall</td>
                  </motion.tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Hall Ticket QR Code</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* QR Code Display */}
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl border-2 border-cyan-300 shadow-lg inline-block mb-6">
                  <img 
                    src={getQRCodePath()} 
                    alt="Hall Ticket QR Code"
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center hidden">
                    <QrCode className="w-32 h-32 text-gray-600" />
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">QR Code Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Student:</strong> {user.name}</p>
                    <p><strong>Roll Number:</strong> 2024CS001</p>
                    <p><strong>Hall Ticket:</strong> HT-2024-{user.name.split(' ')[0].toUpperCase()}</p>
                    <p><strong>Session:</strong> December 2024</p>
                    <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Verification Code:</strong> {generateQRData().verificationCode.toUpperCase()}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownloadHallTicket}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* Instructions */}
                <div className="mt-6 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="font-semibold text-yellow-800 mb-1">📱 Instructions:</p>
                  <p>Present this QR code at the exam hall entrance for quick verification. Make sure your phone screen is clean and bright for easy scanning.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}