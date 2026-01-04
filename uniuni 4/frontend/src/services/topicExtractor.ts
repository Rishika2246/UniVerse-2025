import { ParsedSyllabus, SyllabusUnit, SyllabusTopic } from '../types/mindmap';

/**
 * Extract structured syllabus data from raw text
 */
export function extractSyllabusStructure(text: string, fileName: string): ParsedSyllabus {
  // Detect subject from filename or content
  const subject = detectSubject(text, fileName);
  
  // Extract units
  const units = extractUnits(text);
  
  return {
    title: extractTitle(text) || fileName.replace('.pdf', ''),
    subject,
    units,
    rawText: text
  };
}

/**
 * Detect subject from text or filename
 */
function detectSubject(text: string, fileName: string): string {
  const subjectPatterns = [
    /subject\s*:?\s*([^\n]+)/i,
    /course\s*:?\s*([^\n]+)/i,
    /paper\s*:?\s*([^\n]+)/i,
  ];
  
  for (const pattern of subjectPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Try to extract from filename
  const cleanName = fileName
    .replace('.pdf', '')
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '')
    .trim();
  
  return cleanName || 'Unknown Subject';
}

/**
 * Extract title from syllabus text
 */
function extractTitle(text: string): string | null {
  const titlePatterns = [
    /syllabus\s*[-:]?\s*([^\n]+)/i,
    /course\s+title\s*:?\s*([^\n]+)/i,
    /^([A-Z][A-Za-z\s]+)\s*syllabus/im,
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Extract units from text
 */
function extractUnits(text: string): SyllabusUnit[] {
  const units: SyllabusUnit[] = [];
  
  // Split text into potential unit sections
  const unitPatterns = [
    /(?:unit|module|chapter)\s*[-:]?\s*(\d+|[IVX]+)\s*[-:]?\s*([^\n]+)/gi,
    /(\d+)\.\s+([A-Z][^\n]+)/g,
  ];
  
  let unitMatches: RegExpMatchArray[] = [];
  
  for (const pattern of unitPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      unitMatches = matches;
      break;
    }
  }
  
  if (unitMatches.length === 0) {
    // Fallback: try to split by major headings
    unitMatches = extractByHeadings(text);
  }
  
  // Process each unit
  for (let i = 0; i < unitMatches.length; i++) {
    const match = unitMatches[i];
    const unitNumber = i + 1;
    const unitTitle = extractUnitTitle(match);
    
    // Find the text content for this unit
    const startIndex = match.index || 0;
    const endIndex = i < unitMatches.length - 1 
      ? (unitMatches[i + 1].index || text.length)
      : text.length;
    
    const unitText = text.substring(startIndex, endIndex);
    
    // Extract topics from unit text
    const topics = extractTopics(unitText);
    
    units.push({
      unitNumber,
      title: unitTitle,
      topics
    });
  }
  
  return units.length > 0 ? units : createFallbackStructure(text);
}

/**
 * Extract unit title from match
 */
function extractUnitTitle(match: RegExpMatchArray): string {
  // Try to get the title from the match groups
  if (match.length > 2) {
    return match[2].trim();
  } else if (match.length > 1) {
    return match[1].trim();
  }
  return match[0].trim();
}

/**
 * Extract by major headings (fallback method)
 */
function extractByHeadings(text: string): RegExpMatchArray[] {
  const headingPattern = /^([A-Z][A-Z\s]{10,})/gm;
  return Array.from(text.matchAll(headingPattern));
}

/**
 * Extract topics from unit text with semantic content
 */
function extractTopics(unitText: string): SyllabusTopic[] {
  const topics: SyllabusTopic[] = [];
  
  // Look for numbered or bulleted lists
  const topicPatterns = [
    /(?:^|\n)\s*(?:\d+\.|•|–|-|\*)\s+([A-Z][^\n]+)/g,
    /(?:^|\n)\s*([A-Z][A-Za-z\s&,'-]+)(?=\s*[-:]?\s*[A-Z])/g,
  ];
  
  let topicMatches: RegExpMatchArray[] = [];
  
  for (const pattern of topicPatterns) {
    const matches = Array.from(unitText.matchAll(pattern));
    if (matches.length > 2) { // Need at least a few topics
      topicMatches = matches;
      break;
    }
  }
  
  // Process each topic
  for (let i = 0; i < topicMatches.length; i++) {
    const match = topicMatches[i];
    const topicTitle = match[1].trim();
    
    // Skip if it looks like a unit header
    if (/^(?:unit|module|chapter)/i.test(topicTitle)) {
      continue;
    }
    
    // Skip if too short or too long
    if (topicTitle.length < 5 || topicTitle.length > 150) {
      continue;
    }
    
    // Find the text content for this topic (from this match to next match)
    const startIndex = match.index || 0;
    const endIndex = i < topicMatches.length - 1 
      ? (topicMatches[i + 1].index || unitText.length)
      : unitText.length;
    
    const topicContent = unitText.substring(startIndex, endIndex);
    
    // Extract subtopics (look for nested items)
    const subtopics = extractSubtopics(topicContent, 0);
    
    // Extract description/summary from the content
    const description = extractTopicDescription(topicContent, 0);
    
    // Generate summary from the topic content
    const summary = generateTopicSummary(topicTitle, topicContent, description);
    
    // Extract key points from the content
    const keyPoints = extractKeyPoints(topicContent, subtopics);
    
    topics.push({
      title: topicTitle,
      subtopics,
      description,
      summary,
      keyPoints
    });
  }
  
  return topics;
}

/**
 * Extract subtopics for a given topic
 */
function extractSubtopics(text: string, startIndex: number): string[] {
  const subtopics: string[] = [];
  
  // Look for indented or nested items after the topic
  const nextSection = text.substring(startIndex, startIndex + 500);
  
  const subtopicPatterns = [
    /(?:\n|\s{2,})(?:[-•·◦○]|\([a-z]\)|\d+\))\s+([A-Z][^\n]+)/g,
    /(?:\n|\s{2,})([a-z][a-z\s]+(?:,|;|and|&))/gi,
  ];
  
  for (const pattern of subtopicPatterns) {
    const matches = Array.from(nextSection.matchAll(pattern));
    if (matches.length > 0) {
      for (const match of matches) {
        const subtopic = match[1].trim();
        if (subtopic.length > 3 && subtopic.length < 100) {
          subtopics.push(subtopic);
        }
      }
      break;
    }
  }
  
  // If we found subtopics as comma-separated list
  if (subtopics.length === 0) {
    const commaList = nextSection.match(/:\s*([^.\n]+(?:,\s*[^.\n]+){2,})/);
    if (commaList) {
      const items = commaList[1].split(/,|;/).map(s => s.trim());
      subtopics.push(...items.filter(s => s.length > 3 && s.length < 100));
    }
  }
  
  return subtopics.slice(0, 8); // Limit to 8 subtopics
}

/**
 * Extract topic description
 */
function extractTopicDescription(text: string, startIndex: number): string | undefined {
  const nextText = text.substring(startIndex, startIndex + 300);
  const descPattern = /[-:]\s*([A-Z][^.\n]+\.)/;
  const match = nextText.match(descPattern);
  return match ? match[1].trim() : undefined;
}

/**
 * Generate summary from topic content
 */
function generateTopicSummary(title: string, content: string, description?: string): string {
  // Extract meaningful sentences that explain the topic
  const cleanContent = content
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,;:()-]/g, '')
    .trim();
  
  const sentences = cleanContent
    .split(/[.!?]+/)
    .filter(s => {
      const trimmed = s.trim();
      // Filter out short sentences and likely non-descriptive ones
      return trimmed.length > 30 && 
             trimmed.length < 300 &&
             !trimmed.match(/^(?:unit|module|chapter|topic|page|reference)/i);
    })
    .slice(0, 2);
  
  if (description && description.length > 20) {
    return description;
  }
  
  if (sentences.length > 0) {
    return sentences.join('. ').trim() + '.';
  }
  
  // Fallback: generate a basic summary from the title
  return `${title} is a key concept in this unit covering various aspects and applications in the subject domain.`;
}

/**
 * Extract key points from topic content
 */
function extractKeyPoints(content: string, subtopics: string[]): string[] {
  const keyPoints: string[] = [];
  
  // First, try to find explicitly bulleted/numbered points
  const bulletPatterns = [
    /(?:^|\n)\s*[•●○◦▪▫-]\s*([A-Z][^\n]{10,150})/g,
    /(?:^|\n)\s*\d+[.)]\s*([A-Z][^\n]{10,150})/g,
    /(?:^|\n)\s*[a-z][.)]\s*([A-Z][^\n]{10,150})/g,
  ];
  
  for (const pattern of bulletPatterns) {
    const matches = Array.from(content.matchAll(pattern));
    for (const match of matches) {
      const point = match[1].trim();
      if (point.length >= 10 && point.length <= 150 && !keyPoints.includes(point)) {
        keyPoints.push(point);
      }
    }
  }
  
  // If we found bullet points, use them
  if (keyPoints.length >= 3) {
    return keyPoints.slice(0, 5);
  }
  
  // Otherwise, extract from subtopics and sentences
  if (subtopics.length > 0) {
    subtopics.forEach(st => {
      if (st.length >= 10 && st.length <= 150) {
        keyPoints.push(st);
      }
    });
  }
  
  // Extract key phrases using common educational patterns
  const keyPhrasePatterns = [
    /(?:covers?|includes?|involves?|deals? with|focuses? on|explains?|describes?)\s+([^.,;]{15,100})/gi,
    /(?:understanding|learning|studying|exploring)\s+([^.,;]{15,100})/gi,
  ];
  
  for (const pattern of keyPhrasePatterns) {
    const matches = Array.from(content.matchAll(pattern));
    for (const match of matches) {
      const phrase = match[1].trim();
      if (phrase.length >= 15 && phrase.length <= 100 && !keyPoints.includes(phrase)) {
        keyPoints.push(phrase);
      }
    }
  }
  
  // If still not enough, extract well-formed sentences
  if (keyPoints.length < 3) {
    const sentences = content
      .split(/[.!?]+/)
      .filter(s => {
        const trimmed = s.trim();
        return trimmed.length >= 20 && 
               trimmed.length <= 150 &&
               trimmed.match(/^[A-Z]/);
      })
      .slice(0, 5);
    
    sentences.forEach(s => {
      const trimmed = s.trim();
      if (!keyPoints.includes(trimmed)) {
        keyPoints.push(trimmed);
      }
    });
  }
  
  return keyPoints.slice(0, 5);
}

/**
 * Create fallback structure when parsing fails
 */
function createFallbackStructure(text: string): SyllabusUnit[] {
  // Split text into paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .filter(p => p.trim().length > 50)
    .slice(0, 10);
  
  const units: SyllabusUnit[] = [];
  
  for (let i = 0; i < Math.min(paragraphs.length, 5); i++) {
    const para = paragraphs[i];
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    const topics: SyllabusTopic[] = sentences.slice(0, 5).map((sentence, idx) => ({
      title: sentence.trim().substring(0, 100),
      subtopics: [],
      description: sentences[idx + 1]?.trim().substring(0, 200)
    }));
    
    units.push({
      unitNumber: i + 1,
      title: `Section ${i + 1}`,
      topics
    });
  }
  
  return units;
}

/**
 * Validate and clean extracted structure
 */
export function validateAndCleanStructure(parsed: ParsedSyllabus): ParsedSyllabus {
  // Remove duplicate topics
  const seenTitles = new Set<string>();
  
  parsed.units = parsed.units.map(unit => {
    unit.topics = unit.topics.filter(topic => {
      const key = topic.title.toLowerCase();
      if (seenTitles.has(key)) {
        return false;
      }
      seenTitles.add(key);
      return true;
    });
    return unit;
  });
  
  // Filter out units with no topics
  parsed.units = parsed.units.filter(unit => unit.topics.length > 0);
  
  return parsed;
}