import { motion } from 'motion/react';
import { Scan, MapPin, Navigation, Maximize, Camera, Eye, Map, Building } from 'lucide-react';

export function ARMaps({ user }: { user: any }) {
  const buildings = [
    { name: 'Academic Block A', occupancy: 75, capacity: 500, type: 'academic', color: 'from-blue-500 to-cyan-500' },
    { name: 'Library', occupancy: 45, capacity: 200, type: 'facility', color: 'from-purple-500 to-pink-500' },
    { name: 'Lab Block', occupancy: 60, capacity: 300, type: 'lab', color: 'from-green-500 to-teal-500' },
    { name: 'Cafeteria', occupancy: 90, capacity: 400, type: 'facility', color: 'from-orange-500 to-red-500' },
  ];

  const arFeatures = [
    { icon: Scan, title: 'AR Building Info', desc: 'Point camera to see building details', color: 'from-blue-500 to-cyan-500' },
    { icon: Navigation, title: 'AR Navigation', desc: 'Real-time path guidance', color: 'from-purple-500 to-pink-500' },
    { icon: Eye, title: 'AR Event Posters', desc: 'Scan posters for event details', color: 'from-green-500 to-teal-500' },
    { icon: MapPin, title: 'AR Seat Locator', desc: 'Find your exam seat easily', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* AR Camera View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-white/10 h-[500px]"
      >
        {/* Mock Camera View */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-24 h-24 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 mb-4">AR Camera View</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
              Activate AR Mode
            </button>
          </div>
        </div>

        {/* AR Overlay Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 bg-blue-500/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm"
        >
          📍 Academic Block A
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/3 right-1/4 bg-purple-500/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm"
        >
          📚 Library - 45% Full
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/3 left-1/3 bg-green-500/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm"
        >
          ⚗️ Lab Block
        </motion.div>

        {/* Control Buttons */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          <button className="p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors">
            <Navigation className="w-6 h-6 text-white" />
          </button>
          <button className="p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors">
            <Scan className="w-6 h-6 text-white" />
          </button>
          <button className="p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors">
            <Maximize className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Compass */}
        <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Navigation className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* AR Features Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {arFeatures.map((feature, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`relative overflow-hidden bg-gradient-to-br ${feature.color} p-6 rounded-2xl text-white group`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
            <feature.icon className="w-10 h-10 mb-3 relative z-10" />
            <h4 className="font-bold mb-1 relative z-10">{feature.title}</h4>
            <p className="text-xs text-white/80 relative z-10">{feature.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Live Building Occupancy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Live Campus Occupancy</h3>
            <p className="text-sm text-gray-400">Real-time building status</p>
          </div>
          <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
            View Heatmap
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buildings.map((building, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <Building className={`w-8 h-8 bg-gradient-to-br ${building.color} bg-clip-text text-transparent`} />
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  building.occupancy < 50 ? 'bg-green-500/20 text-green-400' :
                  building.occupancy < 80 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {building.occupancy}%
                </span>
              </div>

              <h4 className="text-white font-bold mb-1">{building.name}</h4>
              <p className="text-sm text-gray-400 mb-3">{building.type}</p>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-white font-semibold">
                    {Math.round((building.occupancy / 100) * building.capacity)}/{building.capacity}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${building.color} rounded-full`}
                    style={{ width: `${building.occupancy}%` }}
                  />
                </div>
              </div>

              <button className="w-full mt-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors">
                Navigate Here
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3D Campus Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">3D Campus Map</h3>
            <p className="text-sm text-gray-400">Interactive campus navigation</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-colors">
              2D View
            </button>
            <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-colors">
              3D View
            </button>
            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl transition-colors">
              VR Mode
            </button>
          </div>
        </div>

        {/* Mock 3D Map */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          
          <div className="relative grid grid-cols-3 gap-8">
            {[
              { name: 'Block A', color: 'from-blue-500 to-cyan-500', size: 'w-32 h-32' },
              { name: 'Block B', color: 'from-purple-500 to-pink-500', size: 'w-28 h-28' },
              { name: 'Block C', color: 'from-green-500 to-teal-500', size: 'w-36 h-36' },
              { name: 'Library', color: 'from-orange-500 to-red-500', size: 'w-28 h-28' },
              { name: 'Main Hall', color: 'from-indigo-500 to-purple-500', size: 'w-40 h-32' },
              { name: 'Cafeteria', color: 'from-yellow-500 to-orange-500', size: 'w-32 h-24' },
            ].map((building, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className={`${building.size} bg-gradient-to-br ${building.color} rounded-lg shadow-2xl cursor-pointer flex items-center justify-center relative`}
              >
                <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
                <p className="text-white font-bold text-xs text-center relative z-10">{building.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
