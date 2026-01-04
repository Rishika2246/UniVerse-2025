import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Plus, Trash2, Eye, Calendar, BookOpen,
  FileText, TrendingUp, Download, Search, Filter, Sparkles
} from 'lucide-react';
import { MindMapUploader } from './MindMapUploader';
import { MindMapViewer } from './MindMapViewer';
import { MindMapDemo } from './MindMapDemo';
import { MindMap } from '../types/mindmap';
import { calculateCompletion } from '../services/mindMapConverter';

interface MindMapHelperProps {
  onClose: () => void;
}

export function MindMapHelper({ onClose }: MindMapHelperProps) {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'incomplete'>('all');

  useEffect(() => {
    loadMindMaps();
  }, []);

  function loadMindMaps() {
    const saved = localStorage.getItem('mindMaps');
    if (saved) {
      try {
        const maps: MindMap[] = JSON.parse(saved);
        setMindMaps(maps);
      } catch (error) {
        console.error('Error loading mind maps:', error);
      }
    }
  }

  function handleMindMapCreated(mindMap: MindMap) {
    const updated = [...mindMaps, mindMap];
    setMindMaps(updated);
    localStorage.setItem('mindMaps', JSON.stringify(updated));
    setShowUploader(false);
    setSelectedMindMap(mindMap);
  }

  function handleMindMapUpdate(updatedMap: MindMap) {
    const updated = mindMaps.map(m => m.id === updatedMap.id ? updatedMap : m);
    setMindMaps(updated);
    localStorage.setItem('mindMaps', JSON.stringify(updated));
  }

  function handleDeleteMindMap(id: string) {
    if (!confirm('Are you sure you want to delete this mind map?')) return;
    
    const updated = mindMaps.filter(m => m.id !== id);
    setMindMaps(updated);
    localStorage.setItem('mindMaps', JSON.stringify(updated));
  }

  const filteredMindMaps = mindMaps
    .filter(map => {
      const matchesSearch = map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           map.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (filterBy) {
        case 'recent':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(map.createdAt) > weekAgo;
        case 'incomplete':
          return calculateCompletion(map) < 100;
        default:
          return true;
      }
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (selectedMindMap) {
    return (
      <MindMapViewer
        mindMap={selectedMindMap}
        onClose={() => setSelectedMindMap(null)}
        onUpdate={handleMindMapUpdate}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-cyan-200/60 w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-cyan-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Mind Map Helper</h2>
                <p className="text-gray-600 text-sm">Transform syllabus PDFs into interactive learning maps</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-100 rounded-xl transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-500 rotate-45" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-6 p-6 border-b-2 border-cyan-100 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
            <div className="text-center bg-white/60 rounded-2xl p-4 border border-cyan-200/40 shadow-sm">
              <div className="text-4xl font-bold bg-gradient-to-br from-cyan-500 to-cyan-600 bg-clip-text text-transparent">{mindMaps.length}</div>
              <div className="text-sm text-gray-600 font-medium mt-1">Mind Maps</div>
            </div>
            <div className="text-center bg-white/60 rounded-2xl p-4 border border-purple-200/40 shadow-sm">
              <div className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent">
                {mindMaps.reduce((sum, m) => sum + Object.keys(m.nodes).length, 0)}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-1">Total Topics</div>
            </div>
            <div className="text-center bg-white/60 rounded-2xl p-4 border border-green-200/40 shadow-sm">
              <div className="text-4xl font-bold bg-gradient-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {Math.round(mindMaps.reduce((sum, m) => sum + calculateCompletion(m), 0) / (mindMaps.length || 1))}%
              </div>
              <div className="text-sm text-gray-600 font-medium mt-1">Avg. Progress</div>
            </div>
            <div className="text-center bg-white/60 rounded-2xl p-4 border border-amber-200/40 shadow-sm">
              <div className="text-4xl font-bold bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {mindMaps.reduce((sum, m) => {
                  return sum + Object.values(m.nodes).reduce((s, n) => s + n.resources.length, 0);
                }, 0)}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-1">Resources</div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 border-b-2 border-cyan-100 bg-gradient-to-r from-cyan-50/20 to-blue-50/20">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="text"
                  placeholder="Search mind maps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-cyan-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-cyan-400 shadow-sm"
                />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-5 py-3 bg-white/80 border-2 border-cyan-200 rounded-xl text-gray-700 focus:outline-none focus:border-cyan-400 shadow-sm font-medium"
              >
                <option value="all">All Maps</option>
                <option value="recent">Recent</option>
                <option value="incomplete">In Progress</option>
              </select>
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/40 transition-all flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Upload Syllabus
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/40 transition-all flex items-center gap-2 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Try Demo
              </button>
            </div>
          </div>

          {/* Mind Maps Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-cyan-50/20 via-blue-50/20 to-purple-50/20">
            {filteredMindMaps.length === 0 ? (
              <div className="text-center py-20">
                {mindMaps.length === 0 ? (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Brain className="w-12 h-12 text-cyan-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">No Mind Maps Yet</h3>
                    <p className="text-gray-600 mb-8 text-lg">Upload a syllabus PDF to create your first interactive mind map</p>
                    <button
                      onClick={() => setShowUploader(true)}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/40 transition-all font-medium text-lg"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMindMaps.map((mindMap) => (
                  <MindMapCard
                    key={mindMap.id}
                    mindMap={mindMap}
                    onView={() => setSelectedMindMap(mindMap)}
                    onDelete={() => handleDeleteMindMap(mindMap.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <MindMapUploader
            onMindMapCreated={handleMindMapCreated}
            onClose={() => setShowUploader(false)}
          />
        )}
        {showDemo && (
          <MindMapDemo
            onDemoSelected={(mindMap) => {
              setShowDemo(false);
              setSelectedMindMap(mindMap);
            }}
            onClose={() => setShowDemo(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MindMapCard({ mindMap, onView, onDelete }: {
  mindMap: MindMap;
  onView: () => void;
  onDelete: () => void;
}) {
  const completion = calculateCompletion(mindMap);
  const totalNodes = Object.keys(mindMap.nodes).length;
  const totalResources = Object.values(mindMap.nodes).reduce((sum, n) => sum + n.resources.length, 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-cyan-200/50 p-6 cursor-pointer group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-800 truncate mb-2">{mindMap.title}</h3>
          <p className="text-sm text-gray-600 truncate font-medium">{mindMap.subject}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2.5 hover:bg-red-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 font-semibold">Progress</span>
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{completion}%</span>
        </div>
        <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 overflow-hidden border border-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-3 text-center border border-cyan-200/50">
          <div className="text-xl font-bold text-cyan-700">{totalNodes}</div>
          <div className="text-xs text-cyan-600 font-medium">Topics</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 text-center border border-amber-200/50">
          <div className="text-xl font-bold text-amber-700">{totalResources}</div>
          <div className="text-xs text-amber-600 font-medium">Resources</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-xl p-3 text-center border border-green-200/50">
          <div className="text-xl font-bold text-green-700">
            {Object.values(mindMap.nodes).filter(n => n.progress.completed).length}
          </div>
          <div className="text-xs text-green-600 font-medium">Done</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t-2 border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{new Date(mindMap.createdAt).toLocaleDateString()}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors font-semibold"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </div>
    </motion.div>
  );
}