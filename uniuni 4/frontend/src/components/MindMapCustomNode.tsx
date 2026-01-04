import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle, Circle, Sparkles } from 'lucide-react';
import { MindMapNode } from '../types/mindmap';

interface CustomNodeData {
  node: MindMapNode;
  onToggleComplete: (nodeId: string) => void;
  onSelect: (node: MindMapNode) => void;
  isSelected: boolean;
}

export const MindMapCustomNode = memo(({ data }: { data: CustomNodeData }) => {
  const { node, onToggleComplete, onSelect, isSelected } = data;

  const getNodeStyle = () => {
    switch (node.type) {
      case 'unit':
        return {
          bg: 'from-cyan-100 to-blue-100',
          border: 'border-cyan-400',
          text: 'text-cyan-700',
          glow: 'shadow-cyan-400/50',
          icon: 'text-cyan-600',
        };
      case 'topic':
        return {
          bg: 'from-purple-100 to-pink-100',
          border: 'border-purple-400',
          text: 'text-purple-700',
          glow: 'shadow-purple-400/50',
          icon: 'text-purple-600',
        };
      case 'subtopic':
        return {
          bg: 'from-green-100 to-emerald-100',
          border: 'border-green-400',
          text: 'text-green-700',
          glow: 'shadow-green-400/50',
          icon: 'text-green-600',
        };
      default:
        return {
          bg: 'from-blue-100 to-indigo-100',
          border: 'border-blue-400',
          text: 'text-blue-700',
          glow: 'shadow-blue-400/50',
          icon: 'text-blue-600',
        };
    }
  };

  const style = getNodeStyle();
  const isCompleted = node.progress.completed;

  const getSize = () => {
    switch (node.type) {
      case 'unit':
        return { width: 'w-72', padding: 'p-5', text: 'text-base' };
      case 'topic':
        return { width: 'w-60', padding: 'p-4', text: 'text-sm' };
      case 'subtopic':
        return { width: 'w-48', padding: 'p-3', text: 'text-xs' };
      default:
        return { width: 'w-60', padding: 'p-4', text: 'text-sm' };
    }
  };

  const size = getSize();

  return (
    <div className="relative group">
      {/* Handles for connections */}
      {node.parentId && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-cyan-500 border-2 border-white shadow-md"
        />
      )}
      
      <div
        onClick={() => onSelect(node)}
        className={`
          ${size.width} ${size.padding}
          bg-gradient-to-br ${style.bg}
          backdrop-blur-sm
          border-2 ${style.border}
          rounded-2xl
          cursor-pointer
          transition-all duration-300
          hover:scale-105
          ${isSelected ? `shadow-2xl ${style.glow} scale-105 ring-2 ring-offset-2 ${style.border.replace('border-', 'ring-')}` : 'shadow-lg'}
          ${isCompleted ? 'opacity-90' : ''}
        `}
      >
        {/* Completion Indicator */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            {node.type === 'unit' && (
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-4 h-4 ${style.icon}`} />
                <span className={`text-xs ${style.text} font-bold uppercase tracking-wider`}>Unit</span>
              </div>
            )}
            <h3 className={`${size.text} font-bold text-gray-800 line-clamp-3 leading-snug`}>
              {node.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(node.id);
            }}
            className="flex-shrink-0 ml-3 p-1.5 hover:bg-white/60 rounded-full transition-colors"
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>

        {/* Description */}
        {node.description && node.type !== 'subtopic' && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {node.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {node.children.length > 0 && (
            <span className={`${style.text} flex items-center gap-1.5 font-semibold`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {node.children.length} {node.type === 'unit' ? 'topics' : 'subtopics'}
            </span>
          )}
          {node.resources.length > 0 && (
            <span className="text-amber-700 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-current" />
              {node.resources.length} resources
            </span>
          )}
          {node.keyPoints && node.keyPoints.length > 0 && (
            <span className="text-green-700 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-current" />
              {node.keyPoints.length} points
            </span>
          )}
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-3 border-white rounded-2xl pointer-events-none shadow-inner" />
        )}
      </div>

      {/* Handles for children */}
      {node.children.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-cyan-500 border-2 border-white shadow-md"
        />
      )}
    </div>
  );
});

MindMapCustomNode.displayName = 'MindMapCustomNode';