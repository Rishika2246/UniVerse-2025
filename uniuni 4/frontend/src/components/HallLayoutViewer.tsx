import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Users, MapPin, Building, ZoomIn, ZoomOut, Download, Printer,
  Search, Filter, DoorOpen, Navigation, Eye, User, Award, AlertCircle,
  Grid, List, BarChart3, Maximize2, Minimize2, Ban, CheckCircle,
  Calendar, Clock, FileText, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';

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
  isEmpty: boolean;
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
}

interface HallLayoutViewerProps {
  hall: Hall;
  onClose: () => void;
  examName?: string;
  examDate?: string;
  examTime?: string;
}

export function HallLayoutViewer({ hall, onClose, examName, examDate, examTime }: HallLayoutViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const occupiedSeats = hall.seats.flat().filter(s => s.student).length;
  const occupancyRate = ((occupiedSeats / hall.capacity) * 100).toFixed(1);

  const departments = Array.from(
    new Set(hall.assignedStudents.map(s => s.department))
  ).filter(Boolean);

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

  const getDepartmentGradient = (dept: string) => {
    const gradients: Record<string, string> = {
      CSE: 'from-blue-400 to-blue-600',
      ECE: 'from-purple-400 to-purple-600',
      ME: 'from-orange-400 to-orange-600',
      CE: 'from-green-400 to-green-600',
      EEE: 'from-yellow-400 to-yellow-600',
      IT: 'from-pink-400 to-pink-600',
    };
    return gradients[dept] || 'from-gray-400 to-gray-600';
  };

  const filteredSeats = hall.seats.map(row =>
    row.map(seat => {
      if (!seat.student) return seat;
      
      const matchesDept = filterDept === 'all' || seat.student.department === filterDept;
      const matchesSearch = !searchQuery || 
        seat.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seat.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      return { ...seat, visible: matchesDept && matchesSearch };
    })
  );

  const handleDownloadLayout = () => {
    // Mock download functionality
    console.log('Downloading hall layout...');
  };

  const handlePrintLayout = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 rounded-3xl shadow-2xl border border-cyan-200 ${
            isFullscreen ? 'w-full h-full' : 'max-w-7xl w-full max-h-[90vh]'
          } flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 rounded-t-3xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">{hall.name} - Seating Layout</h2>
                </div>
                {examName && (
                  <div className="flex items-center gap-6 text-cyan-100">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {examName}
                    </span>
                    {examDate && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {examDate}
                      </span>
                    )}
                    {examTime && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {examTime}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-cyan-100 text-sm mb-1">Total Capacity</p>
                <p className="text-2xl font-bold">{hall.capacity}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-cyan-100 text-sm mb-1">Occupied Seats</p>
                <p className="text-2xl font-bold">{occupiedSeats}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-cyan-100 text-sm mb-1">Occupancy Rate</p>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-cyan-100 text-sm mb-1">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-white/60 backdrop-blur-sm border-b border-cyan-200">
            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List View
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 bg-white"
                />
              </div>

              {/* Department Filter */}
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Zoom Controls */}
              {viewMode === 'grid' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                    className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                    className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleDownloadLayout}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handlePrintLayout}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Legend */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-cyan-200">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-600" />
                    Department Legend
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {departments.map(dept => (
                      <div key={dept} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${getDepartmentColor(dept)} shadow-sm`} />
                        <span className="font-semibold text-sm">{dept}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 ml-4">
                      <div className="w-6 h-6 rounded-lg bg-red-500 shadow-sm flex items-center justify-center">
                        <Ban className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">Blocked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-200 border-2 border-gray-300" />
                      <span className="text-sm">Empty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500 shadow-sm flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">Special Needs</span>
                    </div>
                  </div>
                </div>

                {/* Seating Grid */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-cyan-200">
                  {/* Stage/Invigilator Area */}
                  <div className="mb-6 text-center">
                    <div className="inline-block px-16 py-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl border-2 border-cyan-300 backdrop-blur-sm">
                      <p className="font-bold text-lg">STAGE / INVIGILATOR DESK</p>
                      {hall.invigilators && hall.invigilators.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Invigilators: {hall.invigilators.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Entry Points */}
                  <div className="flex justify-between mb-4">
                    {hall.entryPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-green-600 font-semibold">
                        <DoorOpen className="w-5 h-5" />
                        <span>Entry {idx + 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* Seats Grid */}
                  <div className="overflow-x-auto">
                    <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
                      <div className="inline-block">
                        <div className="flex flex-col gap-2">
                          {/* Column Numbers */}
                          <div className="flex gap-2 mb-2">
                            <div className="w-10" /> {/* Row label spacer */}
                            {Array.from({ length: hall.cols }).map((_, idx) => (
                              <div key={idx} className="w-14 text-center text-sm font-semibold text-gray-600">
                                {idx + 1}
                              </div>
                            ))}
                          </div>

                          {/* Rows */}
                          {filteredSeats.map((row, rIdx) => (
                            <div key={rIdx} className="flex gap-2">
                              {/* Row Label */}
                              <div className="w-10 flex items-center justify-center font-bold text-gray-700">
                                {String.fromCharCode(65 + rIdx)}
                              </div>
                              
                              {/* Benches (grouped seats) */}
                              <div className="flex gap-4">
                                {row.map((seat, cIdx) => {
                                  const isBenchStart = cIdx % 2 === 0;
                                  const isFiltered = seat.student && !(seat as any).visible;
                                  
                                  return (
                                    <div key={`bench-${rIdx}-${cIdx}`} className={isBenchStart && cIdx > 0 ? 'ml-2' : ''}>
                                      <motion.div
                                        whileHover={{ scale: seat.student ? 1.05 : 1 }}
                                        onClick={() => seat.student && setSelectedSeat(seat)}
                                        className={`
                                          w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold
                                          transition-all cursor-pointer border-2 relative group
                                          ${
                                            seat.isBlocked
                                              ? 'bg-red-500 border-red-600 text-white'
                                              : seat.isEmpty
                                              ? 'bg-gray-200 border-gray-300 text-gray-400'
                                              : seat.student
                                              ? `bg-gradient-to-br ${getDepartmentGradient(seat.student.department)} border-white text-white shadow-lg ${
                                                  seat.isSpecial ? 'ring-4 ring-orange-400' : ''
                                                } ${isFiltered ? 'opacity-20' : ''}`
                                              : 'bg-white border-gray-300 text-gray-400'
                                          }
                                        `}
                                      >
                                    {seat.isBlocked ? (
                                      <Ban className="w-5 h-5" />
                                    ) : seat.student ? (
                                      <div className="flex flex-col items-center">
                                        <User className="w-5 h-5 mb-0.5" />
                                        <span className="text-[10px] leading-none">
                                          {seat.student.department.substring(0, 2)}
                                        </span>
                                      </div>
                                    ) : seat.isEmpty ? (
                                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                    ) : (
                                      <div className="text-gray-400">-</div>
                                    )}

                                        {/* Tooltip on hover */}
                                        {seat.student && !isFiltered && (
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap">
                                              <p className="font-bold">{seat.seatId}</p>
                                              <p>{seat.student.name}</p>
                                              <p className="text-gray-300">{seat.student.rollNo}</p>
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exit Points */}
                  <div className="flex justify-between mt-4">
                    {hall.exitPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-red-600 font-semibold">
                        <DoorOpen className="w-5 h-5" />
                        <span>Exit {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-2xl border border-cyan-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Seat ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                        <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                        <th className="px-4 py-3 text-left font-semibold">Department</th>
                        <th className="px-4 py-3 text-left font-semibold">Subject</th>
                        <th className="px-4 py-3 text-left font-semibold">Special Needs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {hall.seats.flat()
                        .filter(seat => seat.student)
                        .filter(seat => {
                          if (!seat.student) return false;
                          const matchesDept = filterDept === 'all' || seat.student.department === filterDept;
                          const matchesSearch = !searchQuery ||
                            seat.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            seat.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
                          return matchesDept && matchesSearch;
                        })
                        .sort((a, b) => a.seatId.localeCompare(b.seatId))
                        .map((seat, idx) => (
                          <motion.tr
                            key={seat.seatId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="hover:bg-cyan-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedSeat(seat)}
                          >
                            <td className="px-4 py-3 font-mono font-bold text-cyan-700">
                              {seat.seatId}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {seat.student!.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-sm">
                              {seat.student!.rollNo}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getDepartmentColor(seat.student!.department)}`}>
                                {seat.student!.department}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {seat.student!.subject}
                            </td>
                            <td className="px-4 py-3">
                              {seat.student!.specialNeeds ? (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-1 w-fit">
                                  <AlertCircle className="w-3 h-3" />
                                  {seat.student!.specialNeedsType}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">None</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Student Detail Modal */}
      {selectedSeat && selectedSeat.student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedSeat(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-cyan-200 max-w-md w-full p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getDepartmentGradient(selectedSeat.student.department)} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <User className="w-8 h-8" />
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-2xl font-bold mb-1">{selectedSeat.student.name}</h3>
            <p className="text-gray-600 mb-4">{selectedSeat.student.rollNo}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Seat Number</span>
                <span className="font-bold text-cyan-700">{selectedSeat.seatId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Department</span>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getDepartmentColor(selectedSeat.student.department)}`}>
                  {selectedSeat.student.department}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Semester</span>
                <span className="font-semibold">{selectedSeat.student.semester}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subject</span>
                <span className="font-semibold">{selectedSeat.student.subject}</span>
              </div>
              {selectedSeat.student.email && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="text-sm text-blue-600">{selectedSeat.student.email}</span>
                </div>
              )}
              {selectedSeat.student.specialNeeds && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Special Needs</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {selectedSeat.student.specialNeedsType}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                View Profile
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                Contact
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
