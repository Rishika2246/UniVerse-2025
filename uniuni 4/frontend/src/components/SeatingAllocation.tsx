import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, Shield, Navigation, Eye, AlertTriangle, Download, QrCode, Calendar, Clock, Building, Printer, ZoomIn, ZoomOut, Maximize2, ArrowRight, Info, CheckCircle, MapPinned, Compass, Star, Award } from 'lucide-react';

export function SeatingAllocation({ user }: { user: any }) {
  const [selectedHall, setSelectedHall] = useState('Hall 201');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState<{ row: number; col: number } | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const yourExamDetails = {
    examName: 'CS301 - Data Structures Mid Semester',
    date: 'December 18, 2024',
    time: '10:00 AM - 12:00 PM',
    duration: '2 hours',
    hall: 'Hall 201',
    seat: 'E-6',
    row: 4,
    col: 5,
    block: 'A',
    floor: '2nd Floor',
    reportingTime: '9:30 AM',
    entryGate: 'East Entrance',
    confirmed: true,
  };

  // Enhanced seating grid - 12 rows x 10 columns
  const seatGrid = Array(12).fill(0).map((_, row) =>
    Array(10).fill(0).map((_, col) => {
      const random = Math.random();
      const seatNumber = `${String.fromCharCode(65 + row)}-${col + 1}`;
      
      if (random > 0.85) return { type: 'empty', seat: seatNumber, student: null, subject: null };
      if (random > 0.78) return { type: 'disabled', seat: seatNumber, student: null, subject: null };
      if (row === 4 && col === 5) return { 
        type: 'user', 
        seat: 'E-6', 
        student: user?.name || 'You',
        subject: 'CS301',
        rollNo: user?.rollNo || 'CS2024001'
      };
      
      const subjects = ['CS301', 'CS302', 'CS303'];
      const subject = subjects[Math.floor(random * 3)];
      const names = ['Priya S.', 'Rohan P.', 'Vivek K.', 'Anjali M.', 'Karan T.', 'Sneha R.', 'Amit G.', 'Pooja M.'];
      
      return {
        type: 'occupied',
        seat: seatNumber,
        student: names[Math.floor(Math.random() * names.length)],
        subject: subject,
        rollNo: `CS202400${Math.floor(Math.random() * 99) + 10}`
      };
    })
  );

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  const handleLocateSeat = () => {
    setZoomLevel(1.3);
    setTimeout(() => {
      const seatElement = document.getElementById('user-seat');
      if (seatElement) {
        seatElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const getSeatColor = (seat: any) => {
    if (seat.type === 'user') return 'from-emerald-400 via-green-400 to-cyan-500';
    if (seat.type === 'empty') return 'from-gray-100 to-gray-200';
    if (seat.type === 'disabled') return 'from-gray-300 to-gray-400';
    
    switch (seat.subject) {
      case 'CS301': return 'from-blue-400 to-blue-500';
      case 'CS302': return 'from-purple-400 to-purple-500';
      case 'CS303': return 'from-pink-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Stunning Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-cyan-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Building className="w-12 h-12 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{yourExamDetails.examName}</h1>
                  <span className="px-4 py-1.5 bg-green-400/30 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center gap-8 text-white/90">
                  <span className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    {yourExamDetails.date}
                  </span>
                  <span className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5" />
                    {yourExamDetails.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-2xl transition-all flex items-center gap-2 font-semibold border border-white/30">
                <Download className="w-5 h-5" />
                Hall Ticket
              </button>
              <button className="px-6 py-3 bg-white text-cyan-600 rounded-2xl hover:shadow-xl transition-all flex items-center gap-2 font-semibold">
                <QrCode className="w-5 h-5" />
                QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-px bg-gray-200">
          <div className="bg-white p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              {yourExamDetails.seat}
            </div>
            <div className="text-gray-600 font-semibold">Your Seat</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">{yourExamDetails.hall}</div>
            <div className="text-gray-600 font-semibold">Hall Name</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">{yourExamDetails.floor}</div>
            <div className="text-gray-600 font-semibold">Floor</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">{yourExamDetails.reportingTime}</div>
            <div className="text-gray-600 font-semibold">Reporting Time</div>
          </div>
        </div>
      </motion.div>

      {/* Main Seating Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Instructions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Your Seat Highlight */}
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[22px] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Your Allocated Seat</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    {yourExamDetails.seat}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Hall:</span>
                  <span className="text-gray-800 font-bold">{yourExamDetails.hall}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Block:</span>
                  <span className="text-gray-800 font-bold">{yourExamDetails.block}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Row:</span>
                  <span className="text-gray-800 font-bold">Row E</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Position:</span>
                  <span className="text-gray-800 font-bold">Column 6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Exam Instructions</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Arrive <span className="font-bold text-blue-600">30 minutes early</span> to locate your seat</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Carry <span className="font-bold text-blue-600">ID card</span> and <span className="font-bold text-blue-600">hall ticket</span></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">No electronic devices except <span className="font-bold text-blue-600">calculator</span></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Follow <span className="font-bold text-blue-600">COVID protocols</span> at all times</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Maintain <span className="font-bold text-blue-600">complete silence</span> in exam hall</p>
              </div>
            </div>
          </div>

          {/* Navigation Help */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Navigation className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">How to Reach</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <p className="text-gray-700">Enter via <span className="font-bold">{yourExamDetails.entryGate}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <p className="text-gray-700">Head to center section</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <p className="text-gray-700">Find Row E markers</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <p className="text-gray-700">Locate seat number 6</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center - Seating Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3 bg-white rounded-3xl shadow-2xl border-2 border-cyan-100 overflow-hidden"
        >
          {/* Controls Header */}
          <div className="bg-gradient-to-r from-slate-50 to-cyan-50 p-6 border-b-2 border-cyan-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Interactive Seating Map</h2>
                <p className="text-gray-600">Hall 201 - Block A, 2nd Floor</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLocateSeat}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg shadow-emerald-500/30"
                >
                  <MapPinned className="w-5 h-5" />
                  Locate My Seat
                </button>
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-cyan-200 shadow-sm">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-cyan-50 text-gray-700 rounded-lg transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-gray-800 font-bold px-3">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-cyan-50 text-gray-700 rounded-lg transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Legend Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-100">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-800">Your Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-md"></div>
                <span className="text-gray-700 font-semibold">CS301</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl shadow-md"></div>
                <span className="text-gray-700 font-semibold">CS302</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl shadow-md"></div>
                <span className="text-gray-700 font-semibold">CS303</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-400"></div>
                <span className="text-gray-700 font-semibold">Empty</span>
              </div>
            </div>
          </div>

          {/* Seating Grid */}
          <div className="p-8 bg-gradient-to-br from-slate-50 via-white to-cyan-50 overflow-auto" style={{ maxHeight: '800px' }}>
            {/* Stage Marker */}
            <div className="mb-8 flex items-center justify-center">
              <div className="px-16 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl font-bold text-xl">
                STAGE / INVIGILATOR DESK
              </div>
            </div>

            {/* Entry/Exit Markers */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl border-2 border-cyan-300">
                <Compass className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="text-gray-800 font-bold">Entry Point</p>
                  <p className="text-sm text-gray-600">{yourExamDetails.entryGate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border-2 border-orange-300">
                <ArrowRight className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-gray-800 font-bold">Exit Point</p>
                  <p className="text-sm text-gray-600">West Entrance</p>
                </div>
              </div>
            </div>

            {/* Main Seat Grid */}
            <motion.div
              style={{ scale: zoomLevel }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="origin-center"
            >
              <div className="inline-block bg-white rounded-2xl p-8 shadow-inner border-2 border-gray-200">
                <div className="flex flex-col gap-5">
                  {seatGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-5 items-center">
                      {/* Row Label */}
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-sm">
                        {String.fromCharCode(65 + rowIndex)}
                      </div>
                      
                      {row.map((seat, colIndex) => {
                        const isHovered = hoveredSeat?.row === rowIndex && hoveredSeat?.col === colIndex;
                        const isUserSeat = seat.type === 'user';
                        
                        return (
                          <motion.div
                            key={colIndex}
                            id={isUserSeat ? 'user-seat' : undefined}
                            className="relative"
                            onMouseEnter={() => setHoveredSeat({ row: rowIndex, col: colIndex })}
                            onMouseLeave={() => setHoveredSeat(null)}
                            whileHover={{ scale: seat.type !== 'disabled' ? 1.15 : 1 }}
                          >
                            {/* Seat Card */}
                            <motion.div
                              className={`
                                w-20 h-20 rounded-2xl cursor-pointer relative shadow-lg
                                bg-gradient-to-br ${getSeatColor(seat)}
                                ${seat.type === 'disabled' ? 'opacity-40' : ''}
                                ${seat.type === 'empty' ? 'border-3 border-dashed border-gray-400' : 'border-2 border-white'}
                                ${isUserSeat ? 'ring-4 ring-emerald-400 ring-offset-2 shadow-2xl shadow-emerald-500/50' : ''}
                                transition-all duration-300
                              `}
                              animate={isUserSeat ? {
                                boxShadow: [
                                  '0 0 30px rgba(52, 211, 153, 0.5)',
                                  '0 0 50px rgba(52, 211, 153, 0.8)',
                                  '0 0 30px rgba(52, 211, 153, 0.5)',
                                ]
                              } : {}}
                              transition={isUserSeat ? {
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              } : {}}
                            >
                              {/* Seat Content */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                {seat.type !== 'empty' && seat.type !== 'disabled' && (
                                  <>
                                    <span className={`font-bold ${isUserSeat ? 'text-white text-sm' : 'text-white text-xs'}`}>
                                      {seat.seat}
                                    </span>
                                    {isUserSeat && (
                                      <span className="text-emerald-100 text-xs font-bold mt-1">YOU</span>
                                    )}
                                    {!isUserSeat && seat.type === 'occupied' && (
                                      <span className="text-white/70 text-[9px] mt-0.5">{seat.subject}</span>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Star Badge for User */}
                              {isUserSeat && (
                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                  <Award className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </motion.div>

                            {/* Enhanced Hover Tooltip */}
                            <AnimatePresence>
                              {isHovered && seat.type !== 'empty' && seat.type !== 'disabled' && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3"
                                >
                                  <div className="bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl border-2 border-gray-700 whitespace-nowrap">
                                    <div className="space-y-1">
                                      <p className="font-bold text-lg text-cyan-400">{seat.seat}</p>
                                      {seat.student && <p className="text-sm text-gray-300">{seat.student}</p>}
                                      {seat.subject && (
                                        <p className="text-xs text-purple-400 font-semibold">{seat.subject}</p>
                                      )}
                                      {seat.rollNo && (
                                        <p className="text-xs text-gray-500">{seat.rollNo}</p>
                                      )}
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                      <div className="w-3 h-3 bg-gray-900 rotate-45 border-r-2 border-b-2 border-gray-700"></div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}