import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Building, Download, Shuffle, CheckCircle, AlertTriangle,
  TrendingUp, Target, Shield, Sparkles, Brain, Award, MapPinned,
  ZoomIn, ZoomOut, Printer, Send, FileText, Edit, XCircle, Grid
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  specialNeeds?: boolean;
}

interface Seat {
  row: number;
  col: number;
  seatNumber: string;
  student: Student | null;
  isBlocked: boolean;
  isSpecial: boolean;
}

interface Hall {
  id: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
  seats: Seat[][];
  assignedStudents: Student[];
}

interface AllocationStats {
  totalStudents: number;
  totalHalls: number;
  totalCapacity: number;
  utilizationRate: string;
  departmentDistribution: Record<string, number>;
  averageStudentsPerHall: string;
}

interface SeatingChartPreviewProps {
  allocatedHalls: Hall[];
  allocationStats: AllocationStats;
  antiCheat: boolean;
  specialAccommodations: boolean;
  onClose: () => void;
}

export function SeatingChartPreview({
  allocatedHalls,
  allocationStats,
  antiCheat,
  specialAccommodations,
  onClose
}: SeatingChartPreviewProps) {
  const [selectedHallPreview, setSelectedHallPreview] = React.useState(0);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const exportSeatingCharts = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting seating charts in ${format.toUpperCase()} format for all ${allocatedHalls.length} halls...`);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Allocation Statistics Dashboard */}
      <div className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Smart Allocation Complete</h3>
              <p className="text-sm text-gray-600">AI-optimized seating arrangement generated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-600" />
              <span className="text-xs text-gray-600">Total Students</span>
            </div>
            <p className="text-2xl font-bold text-cyan-900">{allocationStats.totalStudents}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600">Halls Used</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{allocationStats.totalHalls}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Utilization</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{allocationStats.utilizationRate}%</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-gray-600">Avg/Hall</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{allocationStats.averageStudentsPerHall}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pink-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-pink-600" />
              <span className="text-xs text-gray-600">Anti-Cheat</span>
            </div>
            <p className="text-2xl font-bold text-pink-900">{antiCheat ? 'ON' : 'OFF'}</p>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-cyan-200">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Grid className="w-4 h-4 text-cyan-600" />
            Department Distribution
          </h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(allocationStats.departmentDistribution).map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${getDepartmentColor(dept)}`} />
                <span className="font-semibold text-sm">{dept}</span>
                <span className="text-sm text-gray-600">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hall Navigation & Seating Charts */}
      <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPinned className="w-6 h-6 text-cyan-600" />
            Visual Seating Charts
          </h3>
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700 px-2">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {/* Export Options */}
            <button
              onClick={() => exportSeatingCharts('pdf')}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportSeatingCharts('excel')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Hall Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {allocatedHalls.map((hall, idx) => (
            <button
              key={hall.id}
              onClick={() => setSelectedHallPreview(idx)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                selectedHallPreview === idx
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="font-semibold">{hall.name}</span>
                <span className="text-xs opacity-75">({hall.assignedStudents.length})</span>
              </div>
            </button>
          ))}
        </div>

        {/* Seating Chart Display */}
        {allocatedHalls[selectedHallPreview] && (
          <div className="space-y-4">
            {/* Hall Info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
              <div>
                <h4 className="font-bold text-lg">{allocatedHalls[selectedHallPreview].name}</h4>
                <p className="text-sm text-gray-600">
                  Capacity: {allocatedHalls[selectedHallPreview].capacity} | 
                  Occupied: {allocatedHalls[selectedHallPreview].assignedStudents.length} | 
                  Available: {allocatedHalls[selectedHallPreview].capacity - allocatedHalls[selectedHallPreview].assignedStudents.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-white border border-cyan-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  Student List
                </button>
                <button className="px-4 py-2 bg-white border border-cyan-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-600" />
                  Notify Invigilators
                </button>
              </div>
            </div>

            {/* Seating Grid */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 overflow-auto">
              {/* Stage/Invigilator Area */}
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg mb-6 text-center font-bold">
                🎓 STAGE / INVIGILATOR DESK
              </div>

              {/* Seats Grid */}
              <div 
                className="space-y-3"
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s'
                }}
              >
                {allocatedHalls[selectedHallPreview].seats.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-center gap-2">
                    {/* Row Label */}
                    <div className="w-8 h-12 flex items-center justify-center font-bold text-gray-600">
                      {String.fromCharCode(65 + rowIdx)}
                    </div>
                    
                    {row.map((seat, colIdx) => (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className="relative group"
                      >
                        {seat.isBlocked ? (
                          // Spacing/Empty Seat
                          <div className="w-12 h-12" />
                        ) : seat.student ? (
                          // Occupied Seat
                          <div
                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                              seat.isSpecial
                                ? 'bg-yellow-200 border-yellow-500'
                                : `${getDepartmentColor(seat.student.department)} border-gray-300 text-white`
                            }`}
                            title={`${seat.student.name} (${seat.student.rollNo})`}
                          >
                            <span className="text-xs font-bold">{seat.seatNumber}</span>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                              <div className="text-xs">
                                <div className="font-bold">{seat.student.name}</div>
                                <div className="text-gray-300">{seat.student.rollNo}</div>
                                <div className="text-gray-300">{seat.student.department} - Sem {seat.student.semester}</div>
                                {seat.isSpecial && <div className="text-yellow-300">⭐ Special Needs</div>}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                            </div>
                          </div>
                        ) : (
                          // Empty Available Seat
                          <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center text-xs text-gray-400">
                            {seat.seatNumber}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h5 className="font-semibold mb-3 text-sm text-gray-700">Legend:</h5>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(allocationStats.departmentDistribution).map((dept) => (
                    <div key={dept} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${getDepartmentColor(dept)}`} />
                      <span className="text-sm text-gray-700">{dept}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-200 border-2 border-yellow-500" />
                    <span className="text-sm text-gray-700">Special Needs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-dashed border-gray-300 bg-white" />
                    <span className="text-sm text-gray-700">Empty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions for this Hall */}
            <div className="grid md:grid-cols-4 gap-3">
              <button className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Printer className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-semibold">Print Chart</span>
              </button>
              <button className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">Download CSV</span>
              </button>
              <button className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold">Email Chart</span>
              </button>
              <button className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Edit className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold">Modify</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Optimal Distribution</h4>
                <p className="text-sm text-gray-600">Students are evenly distributed across all halls with proper spacing.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Anti-Cheat Active</h4>
                <p className="text-sm text-gray-600">Students from same departments are strategically separated.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Special Accommodations</h4>
                <p className="text-sm text-gray-600">{specialAccommodations ? 'Special needs students have priority seating' : 'Enable for priority seating'}.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">High Utilization</h4>
                <p className="text-sm text-gray-600">{allocationStats.utilizationRate}% of available capacity is being used efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
