import { motion } from 'motion/react';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import { sampleSyllabusText, sampleWebDevSyllabus, sampleMachineLearningSyllabus } from '../utils/sampleSyllabusData';
import { extractSyllabusStructure, validateAndCleanStructure } from '../services/topicExtractor';
import { convertToMindMap } from '../services/mindMapConverter';

interface MindMapDemoProps {
  onDemoSelected: (mindMapData: any) => void;
  onClose: () => void;
}

export function MindMapDemo({ onDemoSelected, onClose }: MindMapDemoProps) {
  const demos = [
    {
      id: 'dbms',
      title: 'Database Management Systems',
      description: '6 units covering DBMS concepts, ER model, SQL, and more',
      subject: 'Computer Science',
      syllabus: sampleSyllabusText,
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🗄️'
    },
    {
      id: 'webdev',
      title: 'Web Development',
      description: '5 units covering HTML5, JavaScript, React, Node.js, and databases',
      subject: 'Web Technologies',
      syllabus: sampleWebDevSyllabus,
      gradient: 'from-purple-500 to-pink-500',
      icon: '🌐'
    },
    {
      id: 'ml',
      title: 'Machine Learning',
      description: '5 units covering ML algorithms, deep learning, and deployment',
      subject: 'Artificial Intelligence',
      syllabus: sampleMachineLearningSyllabus,
      gradient: 'from-green-500 to-teal-500',
      icon: '🤖'
    }
  ];

  const handleDemoClick = (demo: typeof demos[0]) => {
    // Parse the sample syllabus
    let parsed = extractSyllabusStructure(demo.syllabus, `${demo.title}.pdf`);
    parsed = validateAndCleanStructure(parsed);
    
    // Convert to mind map
    const mindMap = convertToMindMap(parsed, `${demo.title}.pdf`);
    
    // Pass to parent
    onDemoSelected(mindMap);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-2xl border border-cyan-500/30 w-full max-w-4xl shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Try a Demo Mind Map</h2>
              <p className="text-gray-400 text-sm">Explore sample syllabi to see how the Mind Map Helper works</p>
            </div>
          </div>
        </div>

        {/* Demo Cards */}
        <div className="p-6 space-y-4">
          {demos.map((demo) => (
            <motion.div
              key={demo.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleDemoClick(demo)}
              className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 rounded-xl border border-cyan-500/30 p-6 cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${demo.gradient} rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {demo.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {demo.title}
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">Demo</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{demo.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      {demo.subject}
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400 font-bold group-hover:gap-3 transition-all">
                      <span>Try this demo</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cyan-500/30 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              💡 These are sample syllabi. Upload your own PDF for personalized mind maps!
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}