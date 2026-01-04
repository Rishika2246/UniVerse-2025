import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2,
  X, Sparkles, Brain, ArrowRight, FileCheck
} from 'lucide-react';
import { extractTextFromPDF } from '../services/pdfParser';
import { extractSyllabusStructure, validateAndCleanStructure } from '../services/topicExtractor';
import { convertToMindMap } from '../services/mindMapConverter';
import { MindMap, ParsedSyllabus } from '../types/mindmap';

interface MindMapUploaderProps {
  onMindMapCreated: (mindMap: MindMap) => void;
  onClose: () => void;
}

export function MindMapUploader({ onMindMapCreated, onClose }: MindMapUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'parsing' | 'creating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedSyllabus | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const processPDF = async () => {
    if (!file) return;

    setProcessing(true);
    setStatus('extracting');
    setProgress(10);
    setError(null);

    try {
      // Step 1: Extract text from PDF
      setStatus('extracting');
      const { text, numPages } = await extractTextFromPDF(file);
      setProgress(40);

      if (text.length < 50) {
        throw new Error('Unable to extract sufficient text from PDF. The file might be scanned or image-based.');
      }

      // Step 2: Parse and structure the content
      setStatus('parsing');
      let parsed = extractSyllabusStructure(text, file.name);
      parsed = validateAndCleanStructure(parsed);
      setParsedData(parsed);
      setProgress(70);

      if (parsed.units.length === 0) {
        throw new Error('Unable to detect syllabus structure. Please ensure the PDF contains a structured syllabus.');
      }

      // Step 3: Convert to mind map
      setStatus('creating');
      const mindMap = convertToMindMap(parsed, file.name);
      setProgress(100);
      setStatus('success');

      // Wait a moment to show success state
      setTimeout(() => {
        onMindMapCreated(mindMap);
      }, 1000);

    } catch (err: any) {
      console.error('Error processing PDF:', err);
      setError(err.message || 'Failed to process PDF');
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'extracting':
        return 'Extracting text from PDF...';
      case 'parsing':
        return 'Analyzing syllabus structure...';
      case 'creating':
        return 'Generating mind map...';
      case 'success':
        return 'Mind map created successfully!';
      case 'error':
        return 'Error processing PDF';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-2xl border border-cyan-500/30 w-full max-w-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upload Syllabus PDF</h2>
              <p className="text-gray-400 text-sm">Generate an interactive mind map from your syllabus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-gray-600 hover:border-cyan-500 hover:bg-white/5'
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-xl font-bold text-white mb-2">
                Drop your syllabus PDF here
              </h3>
              <p className="text-gray-400 mb-4">or click to browse</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Choose PDF File
              </label>
            </div>
          )}

          {/* File Selected */}
          {file && !processing && status !== 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate">{file.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
                    setParsedData(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {parsedData && (
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <h5 className="text-cyan-400 font-bold mb-2">Preview:</h5>
                  <div className="space-y-2">
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Subject:</span> {parsedData.subject}
                    </p>
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Units Found:</span> {parsedData.units.length}
                    </p>
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Topics:</span>{' '}
                      {parsedData.units.reduce((sum, unit) => sum + unit.topics.length, 0)}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={processPDF}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Mind Map
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Processing */}
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                <div className="flex-1">
                  <h4 className="text-white font-bold">{getStatusMessage()}</h4>
                  <p className="text-gray-400 text-sm">This may take a few moments...</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-gray-400 text-sm text-right">{progress}%</p>
            </motion.div>
          )}

          {/* Success */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-400">Your mind map has been created and is ready to explore</p>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/30 flex items-start gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-400 font-bold mb-1">Error</h4>
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Info */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Tips for best results:
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Upload text-based PDFs (not scanned images)</li>
              <li>• Ensure the syllabus has clear unit/module structure</li>
              <li>• Works best with organized, bullet-pointed syllabi</li>
              <li>• Supports multiple subjects and courses</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
