import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  X, ArrowLeft, Download, Share2,
  CheckCircle, Circle, BookOpen,
  FileText, Video, FileQuestion, ExternalLink, Plus, Image as ImageIcon
} from 'lucide-react';
import { MindMap, MindMapNode, MindMapResource } from '../types/mindmap';
import { updateNodeProgress, calculateCompletion, exportMindMapToJSON } from '../services/mindMapConverter';
import { MindMapCustomNode } from './MindMapCustomNode';

interface MindMapViewerProps {
  mindMap: MindMap;
  onClose: () => void;
  onUpdate?: (mindMap: MindMap) => void;
}

export function MindMapViewer({ mindMap: initialMindMap, onClose, onUpdate }: MindMapViewerProps) {
  const [mindMap, setMindMap] = useState(initialMindMap);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Convert mindMap nodes to ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    return Object.values(mindMap.nodes).map((node) => ({
      id: node.id,
      type: 'custom',
      position: node.position || { x: 0, y: 0 },
      data: {
        node,
        onToggleComplete: handleToggleComplete,
        onSelect: handleNodeSelect,
        isSelected: selectedNode?.id === node.id
      },
    }));
  }, [mindMap.nodes, selectedNode]);

  // Convert mindMap structure to ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    Object.values(mindMap.nodes).forEach((node) => {
      node.children.forEach((childId) => {
        edges.push({
          id: `${node.id}-${childId}`,
          source: node.id,
          target: childId,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: getEdgeColor(node.type),
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: getEdgeColor(node.type),
          },
        });
      });
    });
    return edges;
  }, [mindMap.nodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Node types
  const nodeTypes = useMemo(() => ({ custom: MindMapCustomNode }), []);

  function getEdgeColor(nodeType: string): string {
    switch (nodeType) {
      case 'unit': return '#22d3ee'; // cyan
      case 'topic': return '#a78bfa'; // purple
      case 'subtopic': return '#34d399'; // green
      default: return '#60a5fa'; // blue
    }
  }

  function handleToggleComplete(nodeId: string) {
    const node = mindMap.nodes[nodeId];
    if (!node) return;

    const updatedMindMap = updateNodeProgress(mindMap, nodeId, !node.progress.completed);
    setMindMap(updatedMindMap);
    onUpdate?.(updatedMindMap);

    // Save to localStorage
    saveMindMap(updatedMindMap);
  }

  function handleNodeSelect(node: MindMapNode) {
    setSelectedNode(node);
    setShowResourcePanel(true);
  }

  function saveMindMap(map: MindMap) {
    const saved = localStorage.getItem('mindMaps') || '[]';
    const mindMaps: MindMap[] = JSON.parse(saved);
    const index = mindMaps.findIndex(m => m.id === map.id);
    
    if (index >= 0) {
      mindMaps[index] = map;
    } else {
      mindMaps.push(map);
    }
    
    localStorage.setItem('mindMaps', JSON.stringify(mindMaps));
  }

  function handleExportJSON() {
    const json = exportMindMapToJSON(mindMap);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mindMap.title.replace(/\s+/g, '-')}-mindmap.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportPNG() {
    if (!reactFlowWrapper.current) return;
    
    try {
      // Import html-to-image dynamically
      const { toPng } = await import('html-to-image');
      
      const dataUrl = await toPng(reactFlowWrapper.current, {
        backgroundColor: '#0f172a',
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${mindMap.title.replace(/\s+/g, '-')}-mindmap.png`;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG:', err);
      alert('PNG export feature requires additional setup. Use JSON export instead.');
    }
  }

  const completionPercentage = calculateCompletion(mindMap);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b-2 border-cyan-200 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-3 hover:bg-cyan-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{mindMap.title}</h1>
              <p className="text-gray-600 font-medium">{mindMap.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-6 py-3 border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-gray-800 font-bold text-xl">{completionPercentage}%</span>
                <span className="text-gray-600 font-medium">Complete</span>
              </div>
            </div>

            {/* Export Options */}
            <button
              onClick={handleExportJSON}
              className="p-3 hover:bg-cyan-100 rounded-xl transition-colors"
              title="Export as JSON"
            >
              <Download className="w-6 h-6 text-cyan-600" />
            </button>
            <button
              onClick={handleExportPNG}
              className="p-3 hover:bg-purple-100 rounded-xl transition-colors"
              title="Export as PNG"
            >
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-red-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          className="bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={2} 
            color="#93c5fd" 
            className="opacity-40"
          />
          <Controls className="bg-white/90 backdrop-blur-sm border-2 border-cyan-200 rounded-xl shadow-lg" />
          
          <Panel position="top-right" className="bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-cyan-200 p-5 m-6 shadow-xl">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-md" />
                <span className="text-gray-700 font-medium">Units</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-md" />
                <span className="text-gray-700 font-medium">Topics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-md" />
                <span className="text-gray-700 font-medium">Subtopics</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Resource Panel */}
      <AnimatePresence>
        {showResourcePanel && selectedNode && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 w-[420px] h-full bg-white/95 backdrop-blur-xl border-l-2 border-cyan-200 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-4 h-4 rounded-full shadow-md ${
                      selectedNode.type === 'unit' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' :
                      selectedNode.type === 'topic' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 
                      'bg-gradient-to-br from-green-400 to-emerald-600'
                    }`} />
                    <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">
                      {selectedNode.type}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedNode.title}</h2>
                  {selectedNode.description && (
                    <p className="text-gray-600 mb-2">{selectedNode.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowResourcePanel(false)}
                  className="p-2 hover:bg-cyan-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Summary Section */}
              {selectedNode.summary && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
                  <h3 className="text-cyan-700 font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedNode.summary}</p>
                </div>
              )}

              {/* Key Points */}
              {selectedNode.keyPoints && selectedNode.keyPoints.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-sm">
                  <h3 className="text-purple-700 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Key Points
                  </h3>
                  <ul className="space-y-3">
                    {selectedNode.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Toggle */}
              <button
                onClick={() => handleToggleComplete(selectedNode.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all shadow-md ${
                  selectedNode.progress.completed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:shadow-lg'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {selectedNode.progress.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500" />
                  )}
                  <span className="text-gray-800 font-bold text-lg">
                    {selectedNode.progress.completed ? 'Completed ✓' : 'Mark as Revised'}
                  </span>
                </div>
                {selectedNode.progress.lastRevisedAt && (
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    Last revised: {new Date(selectedNode.progress.lastRevisedAt).toLocaleDateString()}
                  </p>
                )}
              </button>

              {/* Resources */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-800 font-bold text-lg">Study Resources</h3>
                  <button className="p-2 hover:bg-cyan-100 rounded-xl transition-colors">
                    <Plus className="w-5 h-5 text-cyan-600" />
                  </button>
                </div>

                {selectedNode.resources.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border-2 border-gray-200">
                    <BookOpen className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-medium">No resources added yet</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                      Add Resource
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedNode.resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Resources */}
              <div className="space-y-4">
                <h3 className="text-gray-800 font-bold text-lg">Suggested Resources</h3>
                <div className="space-y-3">
                  <SuggestedResourceCard
                    title="Video Tutorial"
                    description={`Learn about ${selectedNode.title}`}
                    type="video"
                  />
                  <SuggestedResourceCard
                    title="Practice Questions"
                    description="Test your knowledge"
                    type="pyq"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResourceCard({ resource }: { resource: MindMapResource }) {
  const icons = {
    pdf: FileText,
    video: Video,
    notes: FileText,
    pyq: FileQuestion,
    link: ExternalLink,
  };

  const Icon = icons[resource.type];

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-cyan-200 hover:border-cyan-300 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl group-hover:from-cyan-200 group-hover:to-cyan-300 transition-colors">
          <Icon className="w-5 h-5 text-cyan-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-800 font-bold truncate">{resource.title}</h4>
          {resource.description && (
            <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SuggestedResourceCard({ title, description, type }: { title: string; description: string; type: string }) {
  const icons = {
    pdf: FileText,
    video: Video,
    notes: FileText,
    pyq: FileQuestion,
    link: ExternalLink,
  };

  const Icon = icons[type as keyof typeof icons] || FileText;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl group-hover:from-purple-300 group-hover:to-pink-300 transition-colors">
          <Icon className="w-5 h-5 text-purple-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-800 font-bold">{title}</h4>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <Plus className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}