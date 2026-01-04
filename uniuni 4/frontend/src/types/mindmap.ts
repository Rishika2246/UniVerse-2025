export interface MindMapNode {
  id: string;
  type: 'unit' | 'topic' | 'subtopic';
  title: string;
  description?: string;
  summary?: string;  // AI-generated or extracted explanation
  keyPoints?: string[];  // Key learning points
  level: number;
  parentId?: string;
  children: string[];
  resources: MindMapResource[];
  progress: {
    completed: boolean;
    lastRevisedAt?: string;
    timeSpent?: number;
  };
  position?: { x: number; y: number };
}

export interface MindMapResource {
  id: string;
  type: 'pdf' | 'video' | 'notes' | 'pyq' | 'link';
  title: string;
  url?: string;
  description?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface MindMap {
  id: string;
  title: string;
  subject: string;
  description?: string;
  rootNodeId: string;
  nodes: Record<string, MindMapNode>;
  createdAt: string;
  updatedAt: string;
  sourceFile?: {
    name: string;
    size: number;
    uploadedAt: string;
  };
  department?: string;
  semester?: string;
  published: boolean;
}

export interface ParsedSyllabus {
  title: string;
  subject?: string;
  units: SyllabusUnit[];
  rawText: string;
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  topics: SyllabusTopic[];
}

export interface SyllabusTopic {
  title: string;
  subtopics: string[];
  description?: string;
  summary?: string;
  keyPoints?: string[];
}