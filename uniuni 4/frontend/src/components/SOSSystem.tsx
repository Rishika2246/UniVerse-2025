import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Phone, MapPin, Users, Shield, Clock, MessageCircle, Bell, CheckCircle, X, Send } from 'lucide-react';

interface SOSSystemProps {
  user: any;
}

export function SOSSystem({ user }: SOSSystemProps) {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [sosType, setSosType] = useState<'medical' | 'security' | 'fire' | 'other' | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'from-red-500 to-orange-500', border: 'border-red-300' },
    { id: 'security', label: 'Security Threat', icon: '🚨', color: 'from-purple-500 to-pink-500', border: 'border-purple-300' },
    { id: 'fire', label: 'Fire Emergency', icon: '🔥', color: 'from-orange-500 to-yellow-500', border: 'border-orange-300' },
    { id: 'other', label: 'Other Emergency', icon: '⚠️', color: 'from-blue-500 to-cyan-500', border: 'border-blue-300' },
  ];

  const emergencyContacts = [
    { name: 'Campus Security', number: '911', available: true, responseTime: '2 min' },
    { name: 'Medical Center', number: '112', available: true, responseTime: '3 min' },
    { name: 'Fire Department', number: '101', available: true, responseTime: '5 min' },
    { name: 'Student Counselor', number: '1800-XXX-XXXX', available: true, responseTime: '10 min' },
  ];

  const recentAlerts = [
    { id: 1, type: 'Medical', location: 'Library Block A', time: '10 mins ago', status: 'resolved', reporter: 'Anonymous' },
    { id: 2, type: 'Security', location: 'Parking Lot B', time: '1 hour ago', status: 'active', reporter: 'Security Guard' },
    { id: 3, type: 'Other', location: 'Cafeteria', time: '2 hours ago', status: 'resolved', reporter: 'Student' },
  ];

  const handleSendSOS = () => {
    if (sosType && location) {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setSosType(null);
        setLocation('');
        setDescription('');
      }, 3000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 border border-red-300">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Emergency SOS System</h2>
            <p className="text-gray-800">Quick access to emergency services and campus safety</p>
          </div>
        </div>
      </div>

      {/* Emergency Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {emergencyTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSosType(type.id as any)}
            className={`relative bg-white rounded-2xl p-6 border-2 ${type.border} hover:shadow-xl transition-all ${
              sosType === type.id ? 'ring-4 ring-offset-2' : ''
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-10 rounded-2xl`} />
            <div className="relative text-center">
              <div className="text-5xl mb-3">{type.icon}</div>
              <h3 className="text-black font-bold mb-2">{type.label}</h3>
              <p className="text-sm text-gray-600">Tap to report</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* SOS Form */}
      <AnimatePresence>
        {sosType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Report {emergencyTypes.find(t => t.id === sosType)?.label}</h3>
              <button onClick={() => setSosType(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-black font-semibold mb-2">Your Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Library Block A, Room 301"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-cyan-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <button className="mt-2 text-sm text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Use GPS Location
                </button>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional details about the emergency..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-cyan-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-black">
                  <strong>Note:</strong> False emergency reports may result in disciplinary action.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendSOS}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Emergency Alert
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Alert Sent Successfully!</h3>
              <p className="text-gray-600 mb-4">Emergency services have been notified and are on their way.</p>
              <p className="text-sm text-black font-semibold">Estimated Response Time: 2-3 minutes</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-black font-semibold">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Available
                  </div>
                  <p className="text-xs text-gray-600">ETA: {contact.responseTime}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">Recent Campus Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      alert.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {alert.status}
                    </span>
                    <span className="font-semibold text-black">{alert.type}</span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {alert.location}
                </div>
                <p className="text-xs text-gray-500 mt-1">Reported by: {alert.reporter}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 border border-blue-300">
        <h3 className="text-xl font-bold text-black mb-4">Safety Tips</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-black mb-1">Stay Calm</h4>
              <p className="text-sm text-gray-700">Keep calm and assess the situation before taking action</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-black mb-1">Know Your Location</h4>
              <p className="text-sm text-gray-700">Always be aware of your current building and room number</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-black mb-1">Help Others</h4>
              <p className="text-sm text-gray-700">Assist those around you if it's safe to do so</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
