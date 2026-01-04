import { MindMap, MindMapNode, ParsedSyllabus } from '../types/mindmap';

/**
 * Convert parsed syllabus to mind map structure
 */
export function convertToMindMap(
  parsed: ParsedSyllabus,
  fileName: string
): MindMap {
  const now = new Date().toISOString();
  const nodes: Record<string, MindMapNode> = {};
  
  // Create root node
  const rootId = 'root';
  const rootNode: MindMapNode = {
    id: rootId,
    type: 'unit',
    title: parsed.title,
    description: parsed.subject,
    level: 0,
    children: [],
    resources: [],
    progress: {
      completed: false
    },
    position: { x: 0, y: 0 }
  };
  nodes[rootId] = rootNode;
  
  // Create unit nodes
  parsed.units.forEach((unit, unitIdx) => {
    const unitId = `unit-${unitIdx}`;
    
    // Generate unit summary from topics
    const unitSummary = `This unit covers ${unit.topics.length} major topics including ${unit.topics.slice(0, 3).map(t => t.title).join(', ')}${unit.topics.length > 3 ? ' and more' : ''}.`;
    
    const unitNode: MindMapNode = {
      id: unitId,
      type: 'unit',
      title: unit.title,
      description: `Unit ${unit.unitNumber}`,
      summary: unitSummary,
      keyPoints: unit.topics.map(t => t.title).slice(0, 5),
      level: 1,
      parentId: rootId,
      children: [],
      resources: [],
      progress: {
        completed: false
      },
      position: calculateUnitPosition(unitIdx, parsed.units.length)
    };
    nodes[unitId] = unitNode;
    rootNode.children.push(unitId);
    
    // Create topic nodes
    unit.topics.forEach((topic, topicIdx) => {
      const topicId = `${unitId}-topic-${topicIdx}`;
      const topicNode: MindMapNode = {
        id: topicId,
        type: 'topic',
        title: topic.title,
        description: topic.description,
        summary: topic.summary || topic.description,
        keyPoints: topic.keyPoints || topic.subtopics.slice(0, 5),
        level: 2,
        parentId: unitId,
        children: [],
        resources: [],
        progress: {
          completed: false
        },
        position: calculateTopicPosition(unitIdx, topicIdx, parsed.units.length, unit.topics.length)
      };
      nodes[topicId] = topicNode;
      unitNode.children.push(topicId);
      
      // Create subtopic nodes
      topic.subtopics.forEach((subtopic, subtopicIdx) => {
        const subtopicId = `${topicId}-subtopic-${subtopicIdx}`;
        const subtopicNode: MindMapNode = {
          id: subtopicId,
          type: 'subtopic',
          title: subtopic,
          summary: `${subtopic} is a subtopic of ${topic.title}.`,
          level: 3,
          parentId: topicId,
          children: [],
          resources: [],
          progress: {
            completed: false
          },
          position: calculateSubtopicPosition(
            unitIdx,
            topicIdx,
            subtopicIdx,
            parsed.units.length,
            unit.topics.length,
            topic.subtopics.length
          )
        };
        nodes[subtopicId] = subtopicNode;
        topicNode.children.push(subtopicId);
      });
    });
  });
  
  return {
    id: generateId(),
    title: parsed.title,
    subject: parsed.subject || 'General',
    description: `Mind map generated from ${fileName}`,
    rootNodeId: rootId,
    nodes,
    createdAt: now,
    updatedAt: now,
    sourceFile: {
      name: fileName,
      size: 0,
      uploadedAt: now
    },
    published: false
  };
}

/**
 * Calculate position for unit nodes in a circular layout
 */
function calculateUnitPosition(index: number, total: number): { x: number; y: number } {
  const radius = 300;
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}

/**
 * Calculate position for topic nodes
 */
function calculateTopicPosition(
  unitIndex: number,
  topicIndex: number,
  totalUnits: number,
  totalTopics: number
): { x: number; y: number } {
  const unitPos = calculateUnitPosition(unitIndex, totalUnits);
  const topicRadius = 200;
  const angle = (topicIndex / totalTopics) * Math.PI - Math.PI / 2;
  
  return {
    x: unitPos.x + Math.cos(angle) * topicRadius,
    y: unitPos.y + Math.sin(angle) * topicRadius + 100
  };
}

/**
 * Calculate position for subtopic nodes
 */
function calculateSubtopicPosition(
  unitIndex: number,
  topicIndex: number,
  subtopicIndex: number,
  totalUnits: number,
  totalTopics: number,
  totalSubtopics: number
): { x: number; y: number } {
  const topicPos = calculateTopicPosition(unitIndex, topicIndex, totalUnits, totalTopics);
  const subtopicSpacing = 150;
  
  return {
    x: topicPos.x + (subtopicIndex - totalSubtopics / 2) * subtopicSpacing,
    y: topicPos.y + 120
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `mindmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export mind map to JSON
 */
export function exportMindMapToJSON(mindMap: MindMap): string {
  return JSON.stringify(mindMap, null, 2);
}

/**
 * Get all nodes as flat array
 */
export function getAllNodes(mindMap: MindMap): MindMapNode[] {
  return Object.values(mindMap.nodes);
}

/**
 * Get node by ID
 */
export function getNode(mindMap: MindMap, nodeId: string): MindMapNode | undefined {
  return mindMap.nodes[nodeId];
}

/**
 * Get children of a node
 */
export function getChildren(mindMap: MindMap, nodeId: string): MindMapNode[] {
  const node = getNode(mindMap, nodeId);
  if (!node) return [];
  return node.children.map(id => mindMap.nodes[id]).filter(Boolean);
}

/**
 * Update node progress
 */
export function updateNodeProgress(
  mindMap: MindMap,
  nodeId: string,
  completed: boolean
): MindMap {
  const node = mindMap.nodes[nodeId];
  if (!node) return mindMap;
  
  return {
    ...mindMap,
    nodes: {
      ...mindMap.nodes,
      [nodeId]: {
        ...node,
        progress: {
          ...node.progress,
          completed,
          lastRevisedAt: completed ? new Date().toISOString() : node.progress.lastRevisedAt
        }
      }
    },
    updatedAt: new Date().toISOString()
  };
}

/**
 * Calculate completion percentage
 */
export function calculateCompletion(mindMap: MindMap): number {
  const nodes = getAllNodes(mindMap);
  if (nodes.length === 0) return 0;
  
  const completed = nodes.filter(n => n.progress.completed).length;
  return Math.round((completed / nodes.length) * 100);
}