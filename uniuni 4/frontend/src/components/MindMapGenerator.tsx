import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronDown, ChevronRight, Info, Lightbulb, Link as LinkIcon,
  Sparkles, Download, Share2, ZoomIn, ZoomOut, Maximize2, RefreshCw, ArrowLeft
} from 'lucide-react';

interface ConceptNode {
  id: string;
  title: string;
  description: string;
  children: ConceptNode[];
  relatedTopics: string[];
  expanded: boolean;
  level: number;
}

export function MindMapGenerator({ onClose }: { onClose: () => void }) {
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Sample mind map data structure
  const mindMapData: ConceptNode = {
    id: 'root',
    title: 'Data Structures & Algorithms',
    description: 'Complete overview of DSA concepts',
    level: 0,
    expanded: true,
    relatedTopics: ['Algorithms', 'Time Complexity', 'Space Complexity'],
    children: [
      {
        id: 'arrays',
        title: 'Arrays & Strings',
        description: 'Linear data structures with contiguous memory',
        level: 1,
        expanded: false,
        relatedTopics: ['Memory Management', 'Pointers', 'Dynamic Arrays'],
        children: [
          {
            id: 'array-ops',
            title: 'Array Operations',
            description: 'Insertion, deletion, searching, sorting',
            level: 2,
            expanded: false,
            relatedTopics: ['Binary Search', 'Linear Search', 'Sorting Algorithms'],
            children: []
          },
          {
            id: 'string-ops',
            title: 'String Manipulation',
            description: 'Pattern matching, string algorithms',
            level: 2,
            expanded: false,
            relatedTopics: ['KMP Algorithm', 'Rabin-Karp', 'String Hashing'],
            children: []
          }
        ]
      },
      {
        id: 'linkedlist',
        title: 'Linked Lists',
        description: 'Dynamic data structure with nodes and pointers',
        level: 1,
        expanded: false,
        relatedTopics: ['Pointers', 'Memory Allocation', 'Recursion'],
        children: [
          {
            id: 'll-types',
            title: 'Types of Linked Lists',
            description: 'Singly, Doubly, Circular',
            level: 2,
            expanded: false,
            relatedTopics: ['Traversal', 'Node Structure'],
            children: []
          },
          {
            id: 'll-ops',
            title: 'Operations',
            description: 'Insertion, deletion, reversal',
            level: 2,
            expanded: false,
            relatedTopics: ['Two Pointer', 'Fast & Slow Pointer'],
            children: []
          }
        ]
      },
      {
        id: 'trees',
        title: 'Trees',
        description: 'Hierarchical non-linear data structure',
        level: 1,
        expanded: false,
        relatedTopics: ['Graphs', 'Recursion', 'DFS', 'BFS'],
        children: [
          {
            id: 'binary-trees',
            title: 'Binary Trees',
            description: 'Each node has at most 2 children',
            level: 2,
            expanded: false,
            relatedTopics: ['BST', 'AVL', 'Complete Binary Tree'],
            children: []
          },
          {
            id: 'tree-traversal',
            title: 'Tree Traversals',
            description: 'Inorder, Preorder, Postorder, Level Order',
            level: 2,
            expanded: false,
            relatedTopics: ['Recursion', 'Stack', 'Queue'],
            children: []
          }
        ]
      },
      {
        id: 'graphs',
        title: 'Graphs',
        description: 'Network of nodes connected by edges',
        level: 1,
        expanded: false,
        relatedTopics: ['Trees', 'Network Theory', 'Shortest Path'],
        children: [
          {
            id: 'graph-rep',
            title: 'Graph Representation',
            description: 'Adjacency Matrix, Adjacency List',
            level: 2,
            expanded: false,
            relatedTopics: ['Space Complexity', 'Time Complexity'],
            children: []
          },
          {
            id: 'graph-algo',
            title: 'Graph Algorithms',
            description: 'DFS, BFS, Dijkstra, Bellman-Ford',
            level: 2,
            expanded: false,
            relatedTopics: ['Shortest Path', 'MST', 'Topological Sort'],
            children: []
          }
        ]
      }
    ]
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const explainNode = (node: ConceptNode) => {
    setSelectedNode(node.id);
  };

  const renderNode = (node: ConceptNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedNode === node.id;

    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];

    return (
      <div key={node.id} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-2 mb-2"
        >
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="mt-1 p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-purple-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-purple-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <div
            className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-br ' + colors[node.level % colors.length] + ' border-white/40 shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => explainNode(node)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-white'}`}>
                {node.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  explainNode(node);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSelected ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Info className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className={`text-sm mb-3 ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
              {node.description}
            </p>
            {node.relatedTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {node.relatedTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded-lg ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {isExpanded && hasChildren && (
          <div className="ml-8 mt-2 space-y-2 border-l-2 border-purple-500/30 pl-4">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-50 rounded-2xl border border-indigo-200 w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-indigo-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">Concept Map Generator</h2>
              <p className="text-sm text-indigo-700">AI-powered multi-level concept breakdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <ZoomOut className="w-5 h-5 text-indigo-900" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} />
            </button>
            <span className="text-indigo-900 text-sm px-3">{zoomLevel}%</span>
            <button className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <ZoomIn className="w-5 h-5 text-indigo-900" onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} />
            </button>
            <button className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <Maximize2 className="w-5 h-5 text-indigo-900" />
            </button>
            <button className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-indigo-900" />
            </button>
            <button className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-indigo-900" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-indigo-200/50 rounded-lg transition-colors">
              <X className="w-5 h-5 text-indigo-900" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 p-4 border-b border-indigo-200 bg-white/50">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-white border border-indigo-200 rounded-xl text-indigo-900 focus:outline-none focus:border-indigo-400"
          >
            <option value="Data Structures">Data Structures</option>
            <option value="Web Development">Web Development</option>
            <option value="Database Systems">Database Systems</option>
            <option value="Computer Networks">Computer Networks</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate from Syllabus
          </button>
          <button className="px-4 py-2 bg-white hover:bg-indigo-100 text-indigo-900 rounded-xl transition-colors flex items-center gap-2 border border-indigo-200">
            <Sparkles className="w-4 h-4" />
            Auto-Expand All
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Mind Map */}
          <div className="flex-1 overflow-y-auto p-6 bg-white/30" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
            {renderNode(mindMapData)}
          </div>

          {/* Explanation Panel */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 border-l border-indigo-200 bg-white/50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-indigo-900 font-bold">AI Explanation</h3>
                    <p className="text-xs text-indigo-700">Click any node to learn more</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-100 rounded-xl border border-blue-200">
                    <h4 className="text-blue-900 font-semibold mb-2">📚 Detailed Explanation</h4>
                    <p className="text-blue-900 text-sm leading-relaxed">
                      This concept is fundamental to understanding computer science. It involves organizing
                      and storing data efficiently to enable quick access and modifications.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-100 rounded-xl border border-purple-200">
                    <h4 className="text-purple-900 font-semibold mb-2">💡 Key Points</h4>
                    <ul className="text-purple-900 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Time complexity: O(n) for traversal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Space complexity: O(1) auxiliary</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Best for sequential access</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-100 rounded-xl border border-green-200">
                    <h4 className="text-green-900 font-semibold mb-2">🔗 Related Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-white hover:bg-green-200 text-green-900 text-sm rounded-lg transition-colors border border-green-200">
                        Arrays
                      </button>
                      <button className="px-3 py-1.5 bg-white hover:bg-green-200 text-green-900 text-sm rounded-lg transition-colors border border-green-200">
                        Pointers
                      </button>
                      <button className="px-3 py-1.5 bg-white hover:bg-green-200 text-green-900 text-sm rounded-lg transition-colors border border-green-200">
                        Memory
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-100 rounded-xl border border-orange-200">
                    <h4 className="text-orange-900 font-semibold mb-2">📝 Practice Problems</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 bg-white hover:bg-orange-200 rounded-lg transition-colors text-sm text-orange-900 border border-orange-200">
                        1. Reverse a linked list
                      </button>
                      <button className="w-full text-left p-2 bg-white hover:bg-orange-200 rounded-lg transition-colors text-sm text-orange-900 border border-orange-200">
                        2. Detect cycle in linked list
                      </button>
                      <button className="w-full text-left p-2 bg-white hover:bg-orange-200 rounded-lg transition-colors text-sm text-orange-900 border border-orange-200">
                        3. Merge two sorted lists
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}