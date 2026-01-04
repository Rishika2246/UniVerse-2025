const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/ai-notes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/avi',
      'video/quicktime'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PDF, PPT, DOCX, TXT, MP3, WAV, MP4, AVI, or MOV files.'));
    }
  }
});

// AI Note Generation Functions
function generateAINotesFromText(text, style = 'detailed', format = 'structured') {
  // Simulate AI processing - in real implementation, this would call OpenAI/Claude API
  const topics = extractTopics(text);
  const keyPoints = extractKeyPoints(text);
  
  let notes = '';
  
  switch (format) {
    case 'structured':
      notes = generateStructuredNotes(text, topics, keyPoints, style);
      break;
    case 'cornell':
      notes = generateCornellNotes(text, topics, keyPoints, style);
      break;
    case 'outline':
      notes = generateOutlineNotes(text, topics, keyPoints, style);
      break;
    case 'mindmap':
      notes = generateMindMapNotes(text, topics, keyPoints, style);
      break;
    default:
      notes = generateStructuredNotes(text, topics, keyPoints, style);
  }
  
  return notes;
}

function extractTopics(text) {
  // Simple topic extraction - in real implementation, use NLP
  const sentences = text.split(/[.!?]+/);
  const topics = [];
  
  sentences.forEach(sentence => {
    if (sentence.length > 20) {
      const words = sentence.split(' ').filter(word => word.length > 4);
      if (words.length > 0) {
        topics.push(words[0]);
      }
    }
  });
  
  return [...new Set(topics)].slice(0, 5);
}

function extractKeyPoints(text) {
  // Simple key point extraction
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 8).map(s => s.trim());
}

function generateStructuredNotes(text, topics, keyPoints, style) {
  const title = topics[0] || 'Study Notes';
  
  let notes = `# ${title}\n\n`;
  
  if (style === 'detailed') {
    notes += `## Overview\n`;
    notes += `${text.substring(0, 200)}...\n\n`;
    
    notes += `## Key Concepts\n\n`;
    topics.forEach((topic, index) => {
      notes += `### ${index + 1}. ${topic}\n`;
      notes += `${keyPoints[index] || 'Important concept related to ' + topic}\n\n`;
    });
    
    notes += `## Important Points\n\n`;
    keyPoints.forEach((point, index) => {
      notes += `- **Point ${index + 1}**: ${point}\n`;
    });
    
    notes += `\n## Summary\n`;
    notes += `This material covers ${topics.join(', ')} and provides comprehensive understanding of the subject matter.\n\n`;
    
    notes += `## Study Tips\n`;
    notes += `- Review key concepts regularly\n`;
    notes += `- Practice with examples\n`;
    notes += `- Create flashcards for important terms\n`;
    notes += `- Discuss topics with peers\n`;
    
  } else if (style === 'concise') {
    notes += `## Key Points\n\n`;
    keyPoints.slice(0, 5).forEach((point, index) => {
      notes += `${index + 1}. ${point}\n`;
    });
    
    notes += `\n## Main Topics\n`;
    topics.forEach(topic => {
      notes += `- ${topic}\n`;
    });
    
  } else if (style === 'bullet') {
    notes += `## Main Points\n\n`;
    keyPoints.forEach(point => {
      notes += `• ${point}\n`;
    });
    
    notes += `\n## Topics Covered\n`;
    topics.forEach(topic => {
      notes += `• ${topic}\n`;
    });
  }
  
  return notes;
}

function generateCornellNotes(text, topics, keyPoints, style) {
  let notes = `# Cornell Notes\n\n`;
  notes += `| Cue Column | Note-Taking Area |\n`;
  notes += `|------------|------------------|\n`;
  
  keyPoints.forEach((point, index) => {
    const cue = topics[index] || `Key ${index + 1}`;
    notes += `| ${cue} | ${point} |\n`;
  });
  
  notes += `\n## Summary\n`;
  notes += `${text.substring(0, 150)}...\n`;
  
  return notes;
}

function generateOutlineNotes(text, topics, keyPoints, style) {
  let notes = `# Outline Notes\n\n`;
  
  topics.forEach((topic, index) => {
    notes += `## ${String.fromCharCode(65 + index)}. ${topic}\n`;
    notes += `   1. ${keyPoints[index * 2] || 'Main point'}\n`;
    notes += `   2. ${keyPoints[index * 2 + 1] || 'Supporting detail'}\n\n`;
  });
  
  return notes;
}

function generateMindMapNotes(text, topics, keyPoints, style) {
  let notes = `# Mind Map Structure\n\n`;
  notes += `## Central Topic: ${topics[0] || 'Main Subject'}\n\n`;
  
  topics.forEach((topic, index) => {
    notes += `### Branch ${index + 1}: ${topic}\n`;
    notes += `- ${keyPoints[index] || 'Related concept'}\n`;
    notes += `- Supporting details\n`;
    notes += `- Examples and applications\n\n`;
  });
  
  return notes;
}

function generateSmartSummary(text, length = 'medium', focusArea = 'balanced') {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const keyPoints = extractKeyPoints(text);
  const topics = extractTopics(text);
  
  let wordLimit;
  switch (length) {
    case 'short': wordLimit = 100; break;
    case 'medium': wordLimit = 250; break;
    case 'detailed': wordLimit = 500; break;
    default: wordLimit = 250;
  }
  
  let summary = '';
  let currentWords = 0;
  
  // Generate summary based on focus area
  switch (focusArea) {
    case 'concepts':
      summary = `Key concepts include: ${topics.join(', ')}. `;
      break;
    case 'practical':
      summary = `Practical applications: `;
      break;
    case 'theory':
      summary = `Theoretical foundation: `;
      break;
    case 'examples':
      summary = `Examples and use cases: `;
      break;
    default:
      summary = `Overview: `;
  }
  
  // Add content until word limit
  for (const sentence of sentences) {
    const words = sentence.split(' ').length;
    if (currentWords + words <= wordLimit) {
      summary += sentence.trim() + '. ';
      currentWords += words;
    } else {
      break;
    }
  }
  
  return {
    title: topics[0] || 'Summary',
    summary: summary.trim(),
    keyPoints: keyPoints.slice(0, 4),
    concepts: topics,
    readTime: Math.ceil(currentWords / 200) + ' min read',
    difficulty: currentWords > 300 ? 'Medium' : 'Easy',
    coverage: Math.min(95, Math.floor((currentWords / text.split(' ').length) * 100))
  };
}

// Routes

// Upload and process file for notes
router.post('/upload-notes', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { style = 'detailed', format = 'structured' } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    
    // Extract text based on file type
    let extractedText = '';
    
    if (fileType === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else if (fileType === 'application/pdf') {
      // For demo purposes, using placeholder text
      extractedText = `This is extracted text from PDF file: ${req.file.originalname}. 
      
      Binary trees are hierarchical data structures where each node has at most two children, referred to as left child and right child. The structure includes key terminology like root (topmost node), leaves (nodes without children), and height (longest path from root to leaf).

      Tree traversals provide different ways to visit nodes: Inorder gives sorted order for BSTs, Preorder helps create copies, Postorder enables deletion, and Level-order performs breadth-first exploration.

      Performance varies with tree balance - balanced trees achieve O(log n) operations while worst-case scenarios may degrade to O(n). Applications span file systems, database indexing, and expression parsing, making binary trees essential for efficient data organization.

      Time complexity analysis shows that search, insertion, and deletion operations in balanced binary trees have O(log n) complexity, while unbalanced trees can degrade to O(n) in worst-case scenarios.

      Common applications include file system hierarchies, database indexing structures, expression parsing in compilers, and Huffman coding for data compression.`;
    } else if (fileType.includes('audio')) {
      // For demo purposes, using placeholder text for audio transcription
      extractedText = `Transcribed audio content from: ${req.file.originalname}. 
      
      Welcome to today's lecture on data structures. We'll be covering binary trees, which are fundamental structures in computer science. A binary tree is a hierarchical data structure where each node has at most two children.

      The key concepts we need to understand include the root node, which is the topmost element, leaf nodes that have no children, and the height of the tree which represents the longest path from root to leaf.

      There are several types of traversals we can perform on binary trees. Inorder traversal visits left subtree, root, then right subtree. Preorder visits root first, then left and right subtrees. Postorder visits left and right subtrees before the root.

      The time complexity for operations on balanced binary trees is O(log n), but this can degrade to O(n) for unbalanced trees. This is why maintaining balance is crucial for performance.`;
    } else if (fileType.includes('video')) {
      // For demo purposes, using placeholder text for video transcription
      extractedText = `Video transcript from: ${req.file.originalname}. 
      
      In this video, we explore advanced concepts in data structures and algorithms. The main focus is on understanding how binary trees work and their practical applications in software development.

      We start with the basic definition: a binary tree is a tree data structure where each node has at most two children, commonly referred to as the left child and right child.

      The video demonstrates various tree traversal methods including depth-first traversals (inorder, preorder, postorder) and breadth-first traversal (level order). Each method has specific use cases and applications.

      Performance characteristics are discussed in detail, showing how balanced trees maintain O(log n) complexity for search, insertion, and deletion operations, while unbalanced trees can degrade to linear time complexity.

      Real-world applications covered include file systems, database indexes, expression trees in compilers, and decision trees in machine learning algorithms.`;
    } else {
      // For other document types, use placeholder text
      extractedText = `Content extracted from document: ${req.file.originalname}. 
      
      This document contains important information about the subject matter. The content has been processed and is ready for AI-powered note generation.

      Key topics covered in this document include fundamental concepts, practical applications, theoretical foundations, and real-world examples that help in understanding the subject matter comprehensively.

      The material provides detailed explanations, step-by-step procedures, and comprehensive coverage of the topic to ensure thorough understanding and effective learning outcomes.`;
    }
    
    // Generate AI notes
    const aiNotes = generateAINotesFromText(extractedText, style, format);
    
    // Save to database (optional) - only if valid IDs are provided
    let noteRecord = null;
    try {
      if (req.body.userId && req.body.syllabusId) {
        noteRecord = await prisma.mindMap.create({
          data: {
            title: `AI Notes - ${req.file.originalname}`,
            studentId: req.body.userId,
            syllabusId: req.body.syllabusId,
          }
        });
      }
    } catch (error) {
      console.log('Note: Could not save to database (demo mode)');
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      notes: aiNotes,
      metadata: {
        originalFile: req.file.originalname,
        fileType: fileType,
        processedAt: new Date().toISOString(),
        noteId: noteRecord?.id || 'demo-note-' + Date.now()
      }
    });
    
  } catch (error) {
    console.error('Error processing file for notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing file: ' + error.message 
    });
  }
});

// Process text for notes
router.post('/generate-notes', async (req, res) => {
  try {
    const { text, style = 'detailed', format = 'structured' } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'No text provided' });
    }
    
    const aiNotes = generateAINotesFromText(text, style, format);
    
    res.json({
      success: true,
      notes: aiNotes,
      metadata: {
        processedAt: new Date().toISOString(),
        wordCount: text.split(' ').length,
        style: style,
        format: format
      }
    });
    
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating notes: ' + error.message 
    });
  }
});

// Upload and process file for summary
router.post('/upload-summary', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { length = 'medium', focusArea = 'balanced' } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    
    // Extract text based on file type (similar to notes processing)
    let extractedText = '';
    
    if (fileType === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      // Use appropriate placeholder based on file type
      extractedText = `Content from ${req.file.originalname}. Binary trees are hierarchical data structures where each node has at most two children. Tree traversals include inorder, preorder, postorder, and level-order methods. Performance characteristics show O(log n) complexity for balanced trees. Applications include file systems, databases, and expression parsing. Understanding these concepts is crucial for efficient algorithm design and data organization in computer science applications.`;
    }
    
    // Generate smart summary
    const summary = generateSmartSummary(extractedText, length, focusArea);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      summary: summary,
      metadata: {
        originalFile: req.file.originalname,
        fileType: fileType,
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error processing file for summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing file: ' + error.message 
    });
  }
});

// Process text for summary
router.post('/generate-summary', async (req, res) => {
  try {
    const { text, length = 'medium', focusArea = 'balanced' } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'No text provided' });
    }
    
    const summary = generateSmartSummary(text, length, focusArea);
    
    res.json({
      success: true,
      summary: summary,
      metadata: {
        processedAt: new Date().toISOString(),
        originalWordCount: text.split(' ').length,
        length: length,
        focusArea: focusArea
      }
    });
    
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating summary: ' + error.message 
    });
  }
});

// Process video URL
router.post('/process-video', async (req, res) => {
  try {
    const { videoUrl, type = 'notes', style = 'detailed', format = 'structured' } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'No video URL provided' });
    }
    
    // For demo purposes, simulate video processing
    const simulatedTranscript = `Video transcript from ${videoUrl}. 
    
    This educational video covers important concepts in computer science and data structures. The presenter explains binary trees as hierarchical data structures where each node contains at most two children.

    The video demonstrates practical examples of tree traversal algorithms including inorder, preorder, and postorder traversals. Each method is explained with visual representations and code examples.

    Performance analysis shows that balanced binary trees provide O(log n) time complexity for search, insertion, and deletion operations. The video emphasizes the importance of maintaining tree balance for optimal performance.

    Real-world applications discussed include file system organization, database indexing, expression parsing in compilers, and decision tree algorithms in machine learning.

    The video concludes with best practices for implementing binary trees in various programming languages and common pitfalls to avoid during implementation.`;
    
    if (type === 'notes') {
      const aiNotes = generateAINotesFromText(simulatedTranscript, style, format);
      res.json({
        success: true,
        notes: aiNotes,
        metadata: {
          videoUrl: videoUrl,
          processedAt: new Date().toISOString(),
          type: 'video_notes'
        }
      });
    } else {
      const summary = generateSmartSummary(simulatedTranscript, style, format);
      res.json({
        success: true,
        summary: summary,
        metadata: {
          videoUrl: videoUrl,
          processedAt: new Date().toISOString(),
          type: 'video_summary'
        }
      });
    }
    
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing video: ' + error.message 
    });
  }
});

module.exports = router;