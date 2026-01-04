import { motion } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, AlertCircle, Eye } from 'lucide-react';
import { useState } from 'react';

export function ClubCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2)); // March 2024
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Events data with clash detection
  const events = [
    { id: 1, date: 5, club: 'Sports Club', event: 'Sports Day', time: '09:00 AM', venue: 'Sports Ground', participants: 289, color: 'from-green-400 to-emerald-500', status: 'confirmed' },
    { id: 2, date: 10, club: 'Drama Club', event: 'Theatre Workshop', time: '02:00 PM', venue: 'Drama Hall', participants: 50, color: 'from-purple-400 to-pink-500', status: 'confirmed' },
    { id: 3, date: 15, club: 'Tech Club', event: 'Hackathon 2024', time: '09:00 AM', venue: 'Main Auditorium', participants: 200, color: 'from-cyan-400 to-blue-500', status: 'confirmed' },
    { id: 4, date: 15, club: 'Music Society', event: 'Band Practice', time: '03:00 PM', venue: 'Music Room', participants: 25, color: 'from-yellow-400 to-orange-500', status: 'confirmed' },
    { id: 5, date: 20, club: 'Music Society', event: 'Spring Concert', time: '06:00 PM', venue: 'Open Air Theatre', participants: 500, color: 'from-yellow-400 to-orange-500', status: 'confirmed' },
    { id: 6, date: 22, club: 'Cultural Society', event: 'Cultural Fest', time: '10:00 AM', venue: 'Main Campus', participants: 456, color: 'from-pink-400 to-rose-500', status: 'confirmed' },
    { id: 7, date: 25, club: 'Photography Club', event: 'Photo Walk', time: '08:00 AM', venue: 'City Tour', participants: 30, color: 'from-indigo-400 to-purple-500', status: 'confirmed' },
    { id: 8, date: 28, club: 'Art Club', event: 'Art Exhibition', time: '11:00 AM', venue: 'Art Gallery', participants: 178, color: 'from-amber-400 to-orange-500', status: 'confirmed' },
    { id: 9, date: 30, club: 'Tech Club', event: 'AI Workshop', time: '02:00 PM', venue: 'Lab 3', participants: 80, color: 'from-cyan-400 to-blue-500', status: 'pending' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const getEventsForDay = (day: number) => {
    return events.filter(event => event.date === day);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDay(null);
  };

  const hasClash = (day: number) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length <= 1) return false;
    
    // Check for time/venue clashes
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        if (dayEvents[i].venue === dayEvents[j].venue) {
          return true;
        }
      }
    }
    return false;
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 rounded-2xl p-6 border border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Campus Event Calendar</h3>
            <p className="text-slate-600 mt-1">Track all club events and avoid scheduling conflicts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={previousMonth}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-cyan-50 transition-colors border border-cyan-200"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="px-6 py-3 bg-white rounded-xl border border-cyan-200">
              <p className="font-bold text-slate-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</p>
            </div>
            <button
              onClick={nextMonth}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-cyan-50 transition-colors border border-cyan-200"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-2xl p-5">
          <Calendar className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="text-3xl font-bold mb-1">{events.length}</h3>
          <p className="text-sm opacity-90">Events This Month</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-5">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="text-3xl font-bold mb-1">{events.reduce((sum, e) => sum + e.participants, 0)}</h3>
          <p className="text-sm opacity-90">Total Participants</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-2xl p-5">
          <MapPin className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="text-3xl font-bold mb-1">{[...new Set(events.map(e => e.venue))].length}</h3>
          <p className="text-sm opacity-90">Venues Booked</p>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-5">
          <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="text-3xl font-bold mb-1">{[...Array(daysInMonth)].filter((_, i) => hasClash(i + 1)).length}</h3>
          <p className="text-sm opacity-90">Days with Multiple Events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="text-center py-3 font-semibold text-slate-600 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {[...Array(firstDay)].map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const clash = hasClash(day);

              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square p-2 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedDay === day
                      ? 'bg-gradient-to-br from-cyan-100 to-blue-100 border-cyan-400 shadow-lg'
                      : dayEvents.length > 0
                      ? clash
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 hover:shadow-md'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${
                        selectedDay === day ? 'text-cyan-700' : 'text-slate-700'
                      }`}>
                        {day}
                      </span>
                      {clash && (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      )}
                    </div>
                    
                    {dayEvents.length > 0 && (
                      <div className="mt-1 flex-1 flex flex-col gap-0.5 overflow-hidden">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${event.color} text-white font-semibold truncate`}
                          >
                            {event.event}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-slate-600 font-semibold px-1">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-cyan-200">
            <h4 className="font-semibold text-slate-700 mb-3">Legend:</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200" />
                <span className="text-sm text-slate-600">Has Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300" />
                <span className="text-sm text-slate-600">Multiple Events</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-slate-600">Potential Clash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-4">
            {selectedDay ? `Events on ${monthNames[currentMonth.getMonth()]} ${selectedDay}` : 'Select a date'}
          </h3>

          {selectedDay && selectedDayEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    event.status === 'confirmed' ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                  }`}
                >
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold mb-2 bg-gradient-to-r ${event.color} text-white`}>
                    {event.club}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{event.event}</h4>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-cyan-200">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <button className="w-full mt-3 py-2 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </motion.div>
              ))}

              {selectedDayEvents.length > 1 && hasClash(selectedDay) && (
                <div className="p-4 bg-amber-100 border border-amber-300 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm mb-1">Potential Clash Detected</p>
                      <p className="text-xs text-amber-700">Multiple events scheduled. Verify venue and time availability.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : selectedDay ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No events scheduled for this day</p>
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Add Event
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Click on a date to see events</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white/70 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Upcoming Events Timeline</h3>
        <div className="space-y-3">
          {events.slice(0, 5).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                <span className="text-2xl font-bold">{event.date}</span>
                <span className="text-xs">{monthNames[currentMonth.getMonth()].slice(0, 3)}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{event.event}</h4>
                <p className="text-sm text-slate-600">{event.club}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {event.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {event.participants}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {event.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
