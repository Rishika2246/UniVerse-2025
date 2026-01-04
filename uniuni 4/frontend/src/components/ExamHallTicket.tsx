import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, Calendar, MapPin, Clock, Download, CheckCircle, AlertCircle, TrendingUp, 
  Target, Printer, User, Hash, Building2, Mail, Phone, Eye, Share2, Flag, 
  CheckSquare, X, MapPinned, Navigation, Info, RefreshCw, ExternalLink,
  FileText, Shield, Zap, Bell, ChevronDown, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Exam {
  subject: string;
  code: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  hall: string;
  block: string;
  seat: string;
  row: string;
  entryGate: string;
  floor: string;
  status: 'active' | 'upcoming' | 'locked';
  hallTicket: string;
  reportingTime: string;
  isToday?: boolean;
}

export function ExamHallTicket({ user }: { user: any }) {
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [acknowledgedInstructions, setAcknowledgedInstructions] = useState<Set<string>>(new Set());
  const [examReadiness, setExamReadiness] = useState<{ [key: string]: { downloaded: boolean; seatViewed: boolean; instructionsRead: boolean } }>({});
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [issueExam, setIssueExam] = useState<Exam | null>(null);
  
  const upcomingExams: Exam[] = [
    {
      subject: 'Data Structures & Algorithms',
      code: 'CS301',
      date: '2024-12-20',
      time: '09:00 AM - 12:00 PM',
      duration: '3 hours',
      venue: 'Main Campus',
      hall: 'Exam Hall 201',
      block: 'Block A',
      seat: 'A-45',
      row: 'Row 5',
      entryGate: 'Gate B (East Entrance)',
      floor: '2nd Floor',
      status: 'active',
      hallTicket: 'HT2024CS301045',
      reportingTime: '08:30 AM',
      isToday: true
    },
    {
      subject: 'Web Development',
      code: 'CS302',
      date: '2024-12-22',
      time: '02:00 PM - 05:00 PM',
      duration: '3 hours',
      venue: 'Main Campus',
      hall: 'Exam Hall 305',
      block: 'Block B',
      seat: 'B-32',
      row: 'Row 4',
      entryGate: 'Gate A (Main Entrance)',
      floor: '3rd Floor',
      status: 'upcoming',
      hallTicket: 'HT2024CS302032',
      reportingTime: '01:30 PM'
    },
    {
      subject: 'Database Management Systems',
      code: 'CS303',
      date: '2024-12-25',
      time: '09:00 AM - 12:00 PM',
      duration: '3 hours',
      venue: 'Main Campus',
      hall: 'Exam Hall 203',
      block: 'Block A',
      seat: 'A-67',
      row: 'Row 7',
      entryGate: 'Gate B (East Entrance)',
      floor: '2nd Floor',
      status: 'upcoming',
      hallTicket: 'HT2024CS303067',
      reportingTime: '08:30 AM'
    },
  ];

  const allowedItems = [
    'Valid Student ID Card',
    'Hall Ticket (Printed or Digital)',
    'Blue/Black Pen',
    'Pencil & Eraser',
    'Geometry Box (for relevant exams)',
    'Transparent Water Bottle',
    'Scientific Calculator (if permitted for the exam)'
  ];

  const prohibitedItems = [
    'Mobile Phones & Smart Watches',
    'Electronic Devices (except permitted calculators)',
    'Books, Notes & Study Materials',
    'Bags & Pouches',
    'Food Items',
    'Any Communication Device'
  ];

  const examGuidelines = [
    {
      title: 'Reporting Time',
      items: [
        'Report 30 minutes before exam start time',
        'Entry gates close 15 minutes after exam begins',
        'Late entry may not be permitted'
      ]
    },
    {
      title: 'Identification',
      items: [
        'Carry original Student ID card',
        'Hall ticket (printed or on phone)',
        'Additional photo ID if requested'
      ]
    },
    {
      title: 'Exam Hall Rules',
      items: [
        'Follow seating arrangement strictly',
        'No talking or communication during exam',
        'Raise hand to call invigilator',
        'Do not leave hall without permission'
      ]
    },
    {
      title: 'Answer Sheet Protocol',
      items: [
        'Fill all details carefully',
        'Do not tear or damage answer sheets',
        'Submit all sheets before leaving',
        'Verify count with invigilator'
      ]
    }
  ];
  
  // Generate QR codes for each exam
  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: { [key: string]: string } = {};
      
      for (const exam of upcomingExams) {
        try {
          const qrData = JSON.stringify({
            hallTicket: exam.hallTicket,
            studentId: user?.id || 'ST2024001',
            studentName: user?.name || 'Student Name',
            subject: exam.subject,
            code: exam.code,
            date: exam.date,
            time: exam.time,
            venue: exam.venue,
            hall: exam.hall,
            seat: exam.seat,
            status: exam.status,
            generatedAt: new Date().toISOString(),
            expiresAt: new Date(exam.date).toISOString()
          });
          
          const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'H'
          });
          
          codes[exam.hallTicket] = qrCodeDataUrl;
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      }
      
      setQrCodes(codes);
    }
;    
    generateQRCodes();

    // Initialize exam readiness
    const readiness: typeof examReadiness = {};
    upcomingExams.forEach(exam => {
      readiness[exam.hallTicket] = {
        downloaded: false,
        seatViewed: false,
        instructionsRead: false
      };
    });
    setExamReadiness(readiness);
  }, []);

  const downloadTicket = (exam: Exam) => {
    const ticketElement = document.getElementById(`ticket-${exam.hallTicket}`);
    if (!ticketElement) return;

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(ticketElement, {
        backgroundColor: '#0f172a',
        scale: 2
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `HallTicket_${exam.hallTicket}.png`;
        link.href = canvas.toDataURL();
        link.click();

        // Update readiness
        setExamReadiness(prev => ({
          ...prev,
          [exam.hallTicket]: { ...prev[exam.hallTicket], downloaded: true }
        }));
      });
    });
  };

  const downloadAllTickets = async () => {
    for (const exam of upcomingExams) {
      await new Promise(resolve => setTimeout(resolve, 500));
      downloadTicket(exam);
    }
  };

  const viewSeatMap = (exam: Exam) => {
    setExamReadiness(prev => ({
      ...prev,
      [exam.hallTicket]: { ...prev[exam.hallTicket], seatViewed: true }
    }));
    // In real app, navigate to seating plan
    console.log('Viewing seat map for', exam.hallTicket);
  };

  const acknowledgeInstructions = (hallTicket: string) => {
    setAcknowledgedInstructions(prev => new Set(prev).add(hallTicket));
    setExamReadiness(prev => ({
      ...prev,
      [hallTicket]: { ...prev[hallTicket], instructionsRead: true }
    }));
  };

  const calculateReadinessPercentage = (hallTicket: string) => {
    const readiness = examReadiness[hallTicket];
    if (!readiness) return 0;
    const total = 3;
    const completed = [readiness.downloaded, readiness.seatViewed, readiness.instructionsRead].filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const getTimeUntilExam = (examDate: string, examTime: string) => {
    const examDateTime = new Date(`${examDate} ${examTime.split('-')[0].trim()}`);
    const now = new Date();
    const diff = examDateTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Exam started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
    return `${hours} hours`;
  };

  const regenerateQR = async (exam: Exam) => {
    try {
      const qrData = JSON.stringify({
        hallTicket: exam.hallTicket,
        studentId: user?.id || 'ST2024001',
        studentName: user?.name || 'Student Name',
        subject: exam.subject,
        code: exam.code,
        date: exam.date,
        time: exam.time,
        venue: exam.venue,
        hall: exam.hall,
        seat: exam.seat,
        status: exam.status,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(exam.date).toISOString()
      });
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      
      setQrCodes(prev => ({ ...prev, [exam.hallTicket]: qrCodeDataUrl }));
    } catch (err) {
      console.error('Error regenerating QR code:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white mb-2">Exam Hall Tickets & Information Hub</h2>
            <p className="text-gray-400">Mid-Semester Examinations - December 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors">
              <Bell className="w-5 h-5 text-cyan-400" />
            </button>
            <button 
              onClick={downloadAllTickets}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
        </div>

        {/* Exam Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Exams</p>
            <p className="text-white">{upcomingExams.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Next Exam</p>
            <p className="text-white">{getTimeUntilExam(upcomingExams[0].date, upcomingExams[0].time)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Active Tickets</p>
            <p className="text-white">{upcomingExams.filter(e => e.status === 'active').length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Avg. Readiness</p>
            <p className="text-white">
              {Math.round(upcomingExams.reduce((acc, exam) => acc + calculateReadinessPercentage(exam.hallTicket), 0) / upcomingExams.length)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Exam Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-white mb-4">Exam Schedule Timeline</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {upcomingExams.map((exam, index) => (
            <div key={exam.hallTicket} className="flex-shrink-0">
              <div className={`relative flex items-center ${index < upcomingExams.length - 1 ? 'pr-8' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  exam.status === 'active' ? 'bg-green-500/20 border-2 border-green-500' :
                  exam.status === 'upcoming' ? 'bg-blue-500/20 border-2 border-blue-500' :
                  'bg-gray-500/20 border-2 border-gray-500'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    exam.status === 'active' ? 'text-green-400' :
                    exam.status === 'upcoming' ? 'text-blue-400' :
                    'text-gray-400'
                  }`} />
                </div>
                {index < upcomingExams.length - 1 && (
                  <div className="absolute left-12 top-1/2 w-8 h-0.5 bg-white/20"></div>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">{exam.code}</p>
                <p className="text-white text-sm">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hall Tickets */}
      <div className="space-y-6">
        {upcomingExams.map((exam, index) => (
          <motion.div
            key={exam.hallTicket}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            id={`ticket-${exam.hallTicket}`}
            className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl relative"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <p className="text-white transform rotate-[-45deg] text-6xl font-bold">OFFICIAL</p>
            </div>

            {/* Status Badge - Top Right Corner */}
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm ${
                exam.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse' 
                  : exam.status === 'upcoming'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {exam.status === 'active' && <><Zap className="w-4 h-4 inline mr-1" />Active</>}
                {exam.status === 'upcoming' && <><Clock className="w-4 h-4 inline mr-1" />Upcoming</>}
                {exam.status === 'locked' && <><Shield className="w-4 h-4 inline mr-1" />Locked</>}
              </div>
            </div>

            {/* Today's Exam Banner */}
            {exam.isToday && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 py-2 px-6">
                <p className="text-white text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">TODAY'S EXAM - Report by {exam.reportingTime}</span>
                </p>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white mb-1">UniVerse University</h3>
                  <p className="text-cyan-300 text-sm">Examination Hall Ticket - Mid Semester {exam.date.split('-')[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Hall Ticket No.</p>
                  <p className="text-white font-mono tracking-wider">{exam.hallTicket}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 1. Student Information Card */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Student Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Student Name</p>
                        <p className="text-white">{user?.name || 'Student Name'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Roll Number</p>
                        <p className="text-white">{user?.id || 'ST2024001'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Program</p>
                        <p className="text-white">B.Tech Computer Science</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Semester</p>
                        <p className="text-white">5th Semester</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">Verified Student • Eligible for Examination</span>
                  </div>
                </div>

                {/* QR & Verification Section */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
                  <div className="text-center mb-3">
                    <p className="text-xs text-cyan-400 mb-2">Scan for Entry & Verification</p>
                    <div className="flex items-center justify-center bg-white rounded-lg p-3 mb-2">
                      {qrCodes[exam.hallTicket] ? (
                        <img 
                          src={qrCodes[exam.hallTicket]} 
                          alt="QR Code"
                          className="w-32 h-32"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-gray-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">QR for Attendance & Verification</p>
                    <button
                      onClick={() => regenerateQR(exam)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white">{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Exam Schedule Details */}
              <div>
                <h4 className="text-white flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Exam Details
                </h4>
                
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white mb-1">{exam.subject}</h4>
                      <p className="text-cyan-400 text-sm">Course Code: {exam.code}</p>
                    </div>
                    <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                      {exam.duration}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Exam Date</p>
                        <p className="text-white text-sm">
                          {new Date(exam.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Exam Time</p>
                        <p className="text-white text-sm">{exam.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Reporting Time</p>
                        <p className="text-white text-sm font-semibold">{exam.reportingTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Add to Calendar */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Seating & Hall Details */}
              <div>
                <h4 className="text-white flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Seating & Hall Information
                </h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Hall Name</p>
                        <p className="text-white">{exam.hall}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Block</p>
                        <p className="text-white">{exam.block}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Floor</p>
                        <p className="text-white">{exam.floor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Entry Gate</p>
                        <p className="text-white text-sm">{exam.entryGate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/30">
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-400 mb-2">Your Assigned Seat</p>
                      <div className="bg-white/10 rounded-lg p-4 mb-2">
                        <p className="text-white text-4xl font-bold">{exam.seat}</p>
                        <p className="text-gray-400 text-sm mt-1">{exam.row}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => viewSeatMap(exam)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <MapPinned className="w-4 h-4" />
                      Locate My Seat
                    </button>
                  </div>
                </div>

                {/* Navigation Help */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-400 text-sm mb-1">How to reach:</p>
                      <p className="text-gray-300 text-xs">
                        Enter through {exam.entryGate} → Take stairs/elevator to {exam.floor} → {exam.hall} → Find {exam.row} → Seat {exam.seat}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Exam Readiness Checklist */}
              <div>
                <h4 className="text-white flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-cyan-400" />
                  Exam Readiness Checklist
                </h4>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white">Overall Readiness</span>
                    <span className={`text-sm font-semibold ${
                      calculateReadinessPercentage(exam.hallTicket) === 100 ? 'text-green-400' :
                      calculateReadinessPercentage(exam.hallTicket) >= 66 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {calculateReadinessPercentage(exam.hallTicket)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateReadinessPercentage(exam.hallTicket)}%` }}
                      className={`h-full ${
                        calculateReadinessPercentage(exam.hallTicket) === 100 ? 'bg-green-500' :
                        calculateReadinessPercentage(exam.hallTicket) >= 66 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    examReadiness[exam.hallTicket]?.downloaded 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {examReadiness[exam.hallTicket]?.downloaded ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                      )}
                      <span className="text-white text-sm">Hall ticket downloaded</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    examReadiness[exam.hallTicket]?.seatViewed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {examReadiness[exam.hallTicket]?.seatViewed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                      )}
                      <span className="text-white text-sm">Seat location viewed</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    examReadiness[exam.hallTicket]?.instructionsRead 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {examReadiness[exam.hallTicket]?.instructionsRead ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                      )}
                      <span className="text-white text-sm">Instructions acknowledged</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Important Instructions */}
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400">Exam Instructions & Guidelines</span>
                  </div>
                  {showInstructions ? (
                    <ChevronDown className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4">
                        {/* Do's and Don'ts */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <h5 className="text-green-400 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Allowed Items
                            </h5>
                            <ul className="space-y-2">
                              {allowedItems.map((item, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <h5 className="text-red-400 mb-3 flex items-center gap-2">
                              <X className="w-4 h-4" />
                              Prohibited Items
                            </h5>
                            <ul className="space-y-2">
                              {prohibitedItems.map((item, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                  <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Detailed Guidelines */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {examGuidelines.map((guideline, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4">
                              <h5 className="text-white mb-2">{guideline.title}</h5>
                              <ul className="space-y-1">
                                {guideline.items.map((item, j) => (
                                  <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Acknowledgment */}
                        {!acknowledgedInstructions.has(exam.hallTicket) && (
                          <button
                            onClick={() => acknowledgeInstructions(exam.hallTicket)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <CheckSquare className="w-5 h-5" />
                            I have read and understood all instructions
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 6. Actions & Utilities */}
              <div className="space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <button 
                    onClick={() => downloadTicket(exam)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  
                  <button 
                    onClick={() => viewSeatMap(exam)}
                    className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors border border-purple-500/30 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Seat Plan
                  </button>

                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share to Email
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setIssueExam(exam);
                      setShowReportIssueModal(true);
                    }}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors border border-orange-500/30 flex items-center justify-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    Report Issue
                  </button>

                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30 flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Exam Cell
                  </button>
                </div>
              </div>

              {/* Countdown Timer for Today's Exam */}
              {exam.isToday && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-400 animate-pulse" />
                      <div>
                        <p className="text-orange-400 font-semibold">Time to Report</p>
                        <p className="text-gray-300 text-sm">Reporting time: {exam.reportingTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{getTimeUntilExam(exam.date, exam.time)}</p>
                      <p className="text-xs text-gray-400">remaining</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/30"
      >
        <h3 className="text-white mb-4">Quick Access</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center">
            <FileText className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-white text-sm">Syllabus</p>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center">
            <MapPinned className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm">Campus Map</p>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center">
            <Phone className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white text-sm">Helpline</p>
          </button>
          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center">
            <Info className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-white text-sm">FAQs</p>
          </button>
        </div>
      </motion.div>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showReportIssueModal && issueExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowReportIssueModal(false);
              setIssueExam(null);
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
                <h3 className="text-white">Report Issue</h3>
                <button
                  onClick={() => {
                    setShowReportIssueModal(false);
                    setIssueExam(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Issue Type</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none">
                    <option>Wrong exam details</option>
                    <option>Incorrect seat number</option>
                    <option>Missing exam</option>
                    <option>QR code not working</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    placeholder="Describe the issue..."
                    className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all">
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
