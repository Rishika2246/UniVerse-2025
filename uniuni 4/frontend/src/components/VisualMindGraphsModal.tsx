import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Network, Sparkles, Brain, GitBranch, Download, Share2, Maximize2, Info, Lightbulb } from 'lucide-react';

interface VisualMindGraphsModalProps {
  onClose: () => void;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number;
  color: string;
  explanation: string;
}

interface Edge {
  from: string;
  to: string;
}

export function VisualMindGraphsModal({ onClose }: VisualMindGraphsModalProps) {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'hierarchical' | 'radial' | 'network'>('radial');
  const [generatedGraph, setGeneratedGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const templates = [
    {
      id: 'radial' as const,
      name: 'Radial Layout',
      description: 'Central topic with branches radiating outward',
      icon: GitBranch,
      color: 'from-blue-300 to-cyan-300'
    },
    {
      id: 'hierarchical' as const,
      name: 'Hierarchical Tree',
      description: 'Top-down structured organization',
      icon: Network,
      color: 'from-purple-300 to-pink-300'
    },
    {
      id: 'network' as const,
      name: 'Network Graph',
      description: 'Interconnected web of concepts',
      icon: Brain,
      color: 'from-green-300 to-teal-300'
    }
  ];

  const handleGenerate = () => {
    setStep('generating');
    
    // Simulate generation
    setTimeout(() => {
      // Generate sample graph data with pastel colors and explanations
      const nodes: Node[] = [
        { 
          id: '1', 
          label: topic || 'Main Topic', 
          x: 400, 
          y: 300, 
          level: 0, 
          color: '#93c5fd',
          explanation: 'This is the central concept that connects all related ideas. Understanding this foundation is crucial for grasping the entire subject matter.'
        },
        { 
          id: '2', 
          label: 'Concept A', 
          x: 250, 
          y: 150, 
          level: 1, 
          color: '#c4b5fd',
          explanation: 'This concept represents a key fundamental principle that builds upon the main topic. It serves as a primary branch of understanding.'
        },
        { 
          id: '3', 
          label: 'Concept B', 
          x: 550, 
          y: 150, 
          level: 1, 
          color: '#c4b5fd',
          explanation: 'An alternative approach or perspective on the main topic. This provides a different lens through which to understand the subject.'
        },
        { 
          id: '4', 
          label: 'Concept C', 
          x: 250, 
          y: 450, 
          level: 1, 
          color: '#c4b5fd',
          explanation: 'A practical application of the main topic. This shows how theoretical knowledge translates into real-world scenarios.'
        },
        { 
          id: '5', 
          label: 'Concept D', 
          x: 550, 
          y: 450, 
          level: 1, 
          color: '#c4b5fd',
          explanation: 'Advanced considerations that extend beyond basic understanding. This represents deeper exploration of the topic.'
        },
        { 
          id: '6', 
          label: 'Detail 1', 
          x: 150, 
          y: 100, 
          level: 2, 
          color: '#fda4af',
          explanation: 'Specific detail that supports Concept A. These granular elements help cement understanding of the broader concept.'
        },
        { 
          id: '7', 
          label: 'Detail 2', 
          x: 350, 
          y: 100, 
          level: 2, 
          color: '#fda4af',
          explanation: 'Additional supporting information for Concept A. Multiple details provide comprehensive coverage of the concept.'
        },
        { 
          id: '8', 
          label: 'Detail 3', 
          x: 450, 
          y: 100, 
          level: 2, 
          color: '#fda4af',
          explanation: 'Key supporting point for Concept B. This detail illustrates specific aspects of the broader principle.'
        },
        { 
          id: '9', 
          label: 'Detail 4', 
          x: 650, 
          y: 100, 
          level: 2, 
          color: '#fda4af',
          explanation: 'Further elaboration on Concept B. These details provide depth and nuance to the understanding.'
        },
      ];

      const edges: Edge[] = [
        { from: '1', to: '2' },
        { from: '1', to: '3' },
        { from: '1', to: '4' },
        { from: '1', to: '5' },
        { from: '2', to: '6' },
        { from: '2', to: '7' },
        { from: '3', to: '8' },
        { from: '3', to: '9' },
      ];

      setGeneratedGraph({ nodes, edges });
      setStep('result');
    }, 2500);
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowExplanation(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-2xl border border-purple-200 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step !== 'input' && (
                <button
                  onClick={() => setStep(step === 'result' ? 'generating' : 'input')}
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-purple-700" />
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Visual Mind Graphs</h2>
                <p className="text-sm text-gray-600">Interactive network visualization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {/* Input Step */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                {/* Topic Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Computer Science, Biology, History"
                    className="w-full px-6 py-4 bg-white border-2 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Main Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Data Structures, Photosynthesis, World War II"
                    className="w-full px-6 py-4 bg-white border-2 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
                  />
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Graph Layout
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          selectedTemplate === template.id
                            ? 'border-purple-400 bg-purple-100 shadow-lg'
                            : 'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center shadow-md`}>
                          <template.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!subject || !topic}
                  className="w-full py-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-300/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Mind Graph
                </button>
              </motion.div>
            )}

            {/* Generating Step */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Network className="w-16 h-16 text-white animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Generating Your Mind Graph</h3>
                <p className="text-gray-600 mb-8">Analyzing connections and relationships...</p>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            {/* Result Step */}
            {step === 'result' && generatedGraph && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    {topic} - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Layout
                  </h3>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-xl text-gray-700 transition-colors flex items-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      Fullscreen
                    </button>
                    <button className="px-4 py-2 bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-xl text-gray-700 transition-colors flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl text-white transition-all hover:shadow-lg flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Click on any node to see a detailed AI-generated explanation!
                  </p>
                </div>

                {/* Graph Visualization */}
                <div className="bg-white backdrop-blur-xl border-2 border-purple-200 rounded-2xl p-8 relative overflow-hidden shadow-lg">
                  <svg width="800" height="600" className="mx-auto">
                    {/* Draw edges */}
                    <g>
                      {generatedGraph.edges.map((edge, index) => {
                        const fromNode = generatedGraph.nodes.find(n => n.id === edge.from);
                        const toNode = generatedGraph.nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;
                        
                        return (
                          <motion.line
                            key={index}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke="#c4b5fd"
                            strokeWidth="3"
                          />
                        );
                      })}
                    </g>

                    {/* Draw nodes */}
                    <g>
                      {generatedGraph.nodes.map((node, index) => (
                        <motion.g
                          key={node.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          onClick={() => handleNodeClick(node)}
                          className="cursor-pointer"
                        >
                          {/* Node circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.level === 0 ? 40 : node.level === 1 ? 32 : 26}
                            fill={node.color}
                            className="hover:opacity-90 transition-opacity"
                            stroke="white"
                            strokeWidth="3"
                          />
                          {/* Info icon overlay */}
                          <circle
                            cx={node.x + (node.level === 0 ? 28 : node.level === 1 ? 22 : 18)}
                            cy={node.y - (node.level === 0 ? 28 : node.level === 1 ? 22 : 18)}
                            r="12"
                            fill="white"
                            className="hover:fill-purple-100"
                          />
                          <text
                            x={node.x + (node.level === 0 ? 28 : node.level === 1 ? 22 : 18)}
                            y={node.y - (node.level === 0 ? 28 : node.level === 1 ? 22 : 18)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-purple-600 text-xs font-bold pointer-events-none"
                          >
                            i
                          </text>
                          {/* Node label */}
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-white text-xs font-bold pointer-events-none"
                          >
                            {node.label}
                          </text>
                        </motion.g>
                      ))}
                    </g>
                  </svg>
                </div>

                {/* Explanation Panel */}
                <AnimatePresence>
                  {showExplanation && selectedNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: selectedNode.color }}
                          >
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{selectedNode.label}</h4>
                            <p className="text-sm text-gray-600">AI-Generated Explanation</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowExplanation(false)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedNode.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Graph Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white backdrop-blur-xl border-2 border-blue-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Nodes</p>
                    <p className="text-2xl font-bold text-blue-600">{generatedGraph.nodes.length}</p>
                  </div>
                  <div className="bg-white backdrop-blur-xl border-2 border-purple-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Connections</p>
                    <p className="text-2xl font-bold text-purple-600">{generatedGraph.edges.length}</p>
                  </div>
                  <div className="bg-white backdrop-blur-xl border-2 border-pink-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Depth Levels</p>
                    <p className="text-2xl font-bold text-pink-600">3</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
