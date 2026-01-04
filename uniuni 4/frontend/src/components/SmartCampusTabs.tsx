import { motion } from 'motion/react';
import {
  Car, BookOpen, Microscope, Coffee, Map, Bell, TrendingUp,
  Navigation, Star, Phone, Mail, Building, Route, Timer,
  CheckCircle, XCircle, Volume2, Thermometer, Eye, Target,
  Filter, Search, ChevronDown, ArrowRight, ExternalLink,
  AlertCircle, Info, Clock, Zap, Heart, Download,
  UtensilsCrossed, DoorOpen, BookMarked, Armchair, Send
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Parking Tab Component
export function ParkingTab({ 
  parkingAreas, 
  parkingFilter, 
  setParkingFilter, 
  handleViewDetails, 
  handleNavigate, 
  toggleFavorite, 
  isFavorite 
}: any) {
  const filteredAreas = parkingFilter === 'all' 
    ? parkingAreas 
    : parkingAreas.filter((area: any) => area.type === parkingFilter);

  return (
    <motion.div
      key="parking"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Filter Bar */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-cyan-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-800">Filter by vehicle type:</span>
            <div className="flex gap-2">
              {(['all', 'two-wheeler', 'four-wheeler'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setParkingFilter(filter)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    parkingFilter === filter
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'two-wheeler' ? 'Two Wheeler' : 'Four Wheeler'}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Total: {filteredAreas.reduce((sum: number, area: any) => sum + area.available, 0)} spots available
          </div>
        </div>
      </div>

      {/* Parking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area: any) => {
          const occupancyRate = ((area.total - area.available - area.reserved) / area.total) * 100;
          
          return (
            <motion.div
              key={area.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{area.name}</h3>
                  <p className="text-sm text-slate-600">{area.location}</p>
                </div>
                <button
                  onClick={() => toggleFavorite('parking', area.id, area.name)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(area.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-slate-800">{area.available}</span>
                  <span className="text-sm text-slate-600">/ {area.total} spots</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      area.status === 'low' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      area.status === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                  <span>{occupancyRate.toFixed(0)}% occupied</span>
                  <span className="capitalize">{area.type.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {area.amenities.map((amenity: string) => (
                    <span key={amenity} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-semibold">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700">{area.distance} km away</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700">{area.averageStayTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700 text-xs">Peak: {area.peakHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700 text-xs">{area.contact.slice(0, 10)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(area, 'parking')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
                <button
                  onClick={() => handleNavigate(area)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-4 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  area.status === 'low' ? 'bg-green-100 text-green-700' :
                  area.status === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    area.status === 'low' ? 'bg-green-500' :
                    area.status === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } animate-pulse`}></div>
                  {area.status === 'low' ? 'Plenty Available' : area.status === 'medium' ? 'Moderate' : 'Almost Full'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Library Tab Component
export function LibraryTab({ libraryZones, handleViewDetails, toggleFavorite, isFavorite }: any) {
  return (
    <motion.div
      key="library"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {libraryZones.map((zone: any) => {
          const occupancyRate = ((zone.total - zone.available) / zone.total) * 100;
          
          return (
            <motion.div
              key={zone.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{zone.name}</h3>
                  <p className="text-sm text-slate-600">Floor {zone.floor} • {zone.type === 'silent' ? '🤫 Silent Zone' : zone.type === 'reading' ? '📖 Reading Zone' : '👥 Group Study'}</p>
                </div>
                <button
                  onClick={() => toggleFavorite('library', zone.id, zone.name)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(zone.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-slate-800">{zone.available}</span>
                  <span className="text-sm text-slate-600">/ {zone.total} seats</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      zone.crowdLevel === 'low' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      zone.crowdLevel === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Environment Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center">
                  <Thermometer className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Temperature</p>
                  <p className="font-bold text-slate-800">{zone.temperature}°C</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center">
                  <Volume2 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Noise Level</p>
                  <p className="font-bold text-slate-800">{zone.noise} dB</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Status</p>
                  <p className="font-bold text-green-600 capitalize text-xs">{zone.crowdLevel}</p>
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-4">
                <p className="text-xs text-slate-600 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-2">
                  {zone.facilities.map((facility: string) => (
                    <span key={facility} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{zone.openingTime} - {zone.closingTime}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleViewDetails(zone, 'library')}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Labs Tab Component  
export function LabsTab({ labs, handleViewDetails, handleBookLab, toggleFavorite, isFavorite }: any) {
  return (
    <motion.div
      key="labs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab: any) => {
          const occupancyRate = (lab.currentOccupancy / lab.capacity) * 100;
          
          return (
            <motion.div
              key={lab.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{lab.name}</h3>
                  <p className="text-sm text-slate-600">{lab.building}</p>
                </div>
                <button
                  onClick={() => toggleFavorite('lab', lab.id, lab.name)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(lab.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  lab.status === 'free' ? 'bg-green-100 text-green-700' :
                  lab.status === 'in-use' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    lab.status === 'free' ? 'bg-green-500' :
                    lab.status === 'in-use' ? 'bg-red-500' :
                    'bg-slate-500'
                  } animate-pulse`}></div>
                  {lab.status === 'free' ? 'Available Now' : lab.status === 'in-use' ? 'In Use' : 'Closed'}
                </div>
              </div>

              {/* Occupancy */}
              {lab.status === 'in-use' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Occupancy:</span>
                    <span className="font-bold text-slate-800">{lab.currentOccupancy} / {lab.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  {lab.nextFreeSlot && (
                    <p className="text-xs text-slate-600 mt-2">Next free: {lab.nextFreeSlot}</p>
                  )}
                </div>
              )}

              {/* Equipment */}
              <div className="mb-4">
                <p className="text-xs text-slate-600 mb-2">Equipment:</p>
                <div className="flex flex-wrap gap-2">
                  {lab.equipment.map((item: string) => (
                    <span key={item} className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supervisor Info */}
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Supervisor:</p>
                <p className="font-semibold text-slate-800 text-sm">{lab.supervisor}</p>
                <p className="text-xs text-slate-600">{lab.contact}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(lab, 'lab')}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
                {lab.bookable && lab.status === 'free' && (
                  <button
                    onClick={() => handleBookLab(lab)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Book Now
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Common Areas Tab Component
export function CommonAreasTab({ commonAreas, handleViewDetails }: any) {
  return (
    <motion.div
      key="common"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commonAreas.map((area: any) => {
          const crowdRate = (area.currentCount / area.capacity) * 100;
          
          return (
            <motion.div
              key={area.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200 shadow-lg"
            >
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {area.type === 'cafeteria' && <UtensilsCrossed className="w-6 h-6 text-orange-600" />}
                  {area.type === 'washroom' && <DoorOpen className="w-6 h-6 text-blue-600" />}
                  {area.type === 'study-hall' && <BookMarked className="w-6 h-6 text-purple-600" />}
                  {area.type === 'common-room' && <Armchair className="w-6 h-6 text-green-600" />}
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{area.name}</h3>
                    <p className="text-sm text-slate-600 capitalize">{area.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Crowd Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Current crowd:</span>
                  <span className="font-bold text-slate-800">{area.currentCount} / {area.capacity}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      area.crowdLevel === 'low' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      area.crowdLevel === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${crowdRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  area.crowdLevel === 'low' ? 'bg-green-100 text-green-700' :
                  area.crowdLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    area.crowdLevel === 'low' ? 'bg-green-500' :
                    area.crowdLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } animate-pulse`}></div>
                  {area.crowdLevel === 'low' ? 'Low Crowd' : area.crowdLevel === 'medium' ? 'Moderate Crowd' : 'High Crowd'}
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{area.openTime} - {area.closeTime}</span>
              </div>

              {/* Specialties */}
              {area.specialties && area.specialties.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-600 mb-2">Available:</p>
                  <div className="flex flex-wrap gap-2">
                    {area.specialties.map((specialty: string) => (
                      <span key={specialty} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleViewDetails(area, 'common')}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Map Tab Component
export function MapTab({ campusMapAreas, setSelectedMapArea, selectedMapArea }: any) {
  return (
    <motion.div
      key="map"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
          <Map className="w-6 h-6 text-cyan-600" />
          Interactive Campus Map
        </h3>
        
        {/* Map Canvas */}
        <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden border-2 border-slate-300">
          <svg width="100%" height="100%" viewBox="0 0 400 250">
            {campusMapAreas.map((area: any) => (
              <g key={area.id} onClick={() => setSelectedMapArea(area)} className="cursor-pointer">
                <rect
                  x={area.x}
                  y={area.y}
                  width={area.width}
                  height={area.height}
                  className={`transition-all ${
                    area.status === 'available' ? 'fill-green-400 hover:fill-green-500' :
                    area.status === 'moderate' ? 'fill-yellow-400 hover:fill-yellow-500' :
                    'fill-red-400 hover:fill-red-500'
                  }`}
                  opacity="0.7"
                  rx="5"
                />
                <text
                  x={area.x + area.width / 2}
                  y={area.y + area.height / 2}
                  textAnchor="middle"
                  className="fill-slate-800 text-xs font-bold pointer-events-none"
                >
                  {area.name}
                </text>
                <text
                  x={area.x + area.width / 2}
                  y={area.y + area.height / 2 + 15}
                  textAnchor="middle"
                  className="fill-slate-700 text-[10px] pointer-events-none"
                >
                  {area.details}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl rounded-lg p-3 border border-slate-300">
            <p className="font-bold text-slate-800 text-sm mb-2">Legend:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>Full</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Area Info */}
        {selectedMapArea && (
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <h4 className="font-bold text-slate-800 mb-2">{selectedMapArea.name}</h4>
            <p className="text-sm text-slate-700 mb-2">{selectedMapArea.details}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              selectedMapArea.status === 'available' ? 'bg-green-100 text-green-700' :
              selectedMapArea.status === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              Status: {selectedMapArea.status.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Alerts Tab Component
export function AlertsTab({ alerts, handleAlertAction, setAlerts }: any) {
  const unreadCount = alerts.filter((a: any) => !a.read).length;

  return (
    <motion.div
      key="alerts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-600" />
            Smart Alerts & Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="space-y-3">
          {alerts.map((alert: any) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                alert.read ? 'bg-slate-50 border-slate-200' : 'bg-white border-cyan-200 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {alert.priority === 'critical' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {alert.priority === 'high' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                    {alert.priority === 'medium' && <Info className="w-5 h-5 text-yellow-600" />}
                    {alert.priority === 'low' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      alert.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>

                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold capitalize">
                      {alert.type}
                    </span>
                  </div>

                  <p className="text-slate-800 font-semibold mb-2">{alert.message}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {alert.action && (
                  <button
                    onClick={() => handleAlertAction(alert)}
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center gap-2"
                  >
                    {alert.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}yan-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center gap-2"
                  >
                    {alert.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No alerts at the moment</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Analytics Tab Component
export function AnalyticsTab({ parkingTrendData, libraryTrendData, weeklyData, resourceDistribution, COLORS }: any) {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-600" />
          Smart Campus Analytics & Insights
        </h3>
        <p className="text-sm text-slate-600 mt-2">Real-time data visualization and usage patterns</p>
      </div>

      {/* Parking Trend */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h4 className="font-bold text-slate-800 mb-4">Parking Occupancy Trend (Today)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={parkingTrendData}>
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="occupancy" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOccupancy)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Library Trend */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h4 className="font-bold text-slate-800 mb-4">Library Occupancy Trend (Today)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={libraryTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="seats" stroke="#8b5cf6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h4 className="font-bold text-slate-800 mb-4">Weekly Usage Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="parking" fill="#06b6d4" />
            <Bar dataKey="library" fill="#8b5cf6" />
            <Bar dataKey="labs" fill="#10b981" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Resource Distribution */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200">
        <h4 className="font-bold text-slate-800 mb-4">Current Resource Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={resourceDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {resourceDistribution.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
