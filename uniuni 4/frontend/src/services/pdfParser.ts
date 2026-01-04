import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFParseResult {
  text: string;
  numPages: number;
  metadata?: any;
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<PDFParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const numPages = pdf.numPages;
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    // Get metadata
    const metadata = await pdf.getMetadata();
    
    return {
      text: cleanText(fullText),
      numPages,
      metadata: metadata.info
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF.');
  }
}

/**
 * Clean extracted text by removing noise, extra whitespace, etc.
 */
function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove common PDF artifacts
    .replace(/\f/g, '\n') // Form feed
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
    // Normalize line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove page numbers (simple pattern: standalone numbers)
    .replace(/^\s*\d+\s*$/gm, '')
    // Remove common headers/footers patterns
    .replace(/^(page|pg\.?)\s*\d+/gim, '')
    .trim();
}

/**
 * Detect if PDF is scanned (image-based) vs text-based
 */
export async function isPDFScanned(file: File): Promise<boolean> {
  try {
    const result = await extractTextFromPDF(file);
    // If very little text extracted, likely a scanned PDF
    return result.text.length < 100;
  } catch {
    return false;
  }
}
