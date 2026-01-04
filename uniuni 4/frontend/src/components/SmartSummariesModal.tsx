import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X, Brain, Sparkles, Upload, FileText, Download, Share2, Zap,
  CheckCircle, TrendingUp, Clock, Target, Copy, ArrowLeft, AlertCircle, Loader
} from 'lucide-react';

export function SmartSummariesModal({ onClose }: { onClose: () => void }) {
  const [summaryLength, setSummaryLength] = useState('medium');
  const [focusArea, setFocusArea] = useState('balanced');
  const [generating, setGenerating] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, DOCX, or TXT files.');
        return;
      }
      
      setUploadedFile(file);
      setError('');
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    
    try {
      let response;
      
      if (uploadedFile) {
        // Upload file and generate summary
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('length', summaryLength);
        formData.append('focusArea', focusArea);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        response = await fetch(`${API_BASE_URL}/ai-notes/upload-summary`, {
          method: 'POST',
          body: formData,
        });
      } else if (textInput.trim()) {
        // Generate summary from text
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        response = await fetch(`${API_BASE_URL}/ai-notes/generate-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textInput,
            length: summaryLength,
            focusArea: focusArea,
          }),
        });
      } else {
        throw new Error('Please provide input content');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedSummary(data.summary);
        setSummaryGenerated(true);
      } else {
        throw new Error(data.message || 'Failed to generate summary');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedSummary) {
      const textToCopy = `# ${generatedSummary.title}\n\n${generatedSummary.summary}\n\n## Key Points:\n${generatedSummary.keyPoints.map((point: string) => `- ${point}`).join('\n')}`;
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const handleDownload = () => {
    if (generatedSummary) {
      const content = `# ${generatedSummary.title}\n\n${generatedSummary.summary}\n\n## Key Points:\n${generatedSummary.keyPoints.map((point: string) => `- ${point}`).join('\n')}\n\n## Related Concepts:\n${generatedSummary.concepts.join(', ')}`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smart-summary.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 rounded-2xl border border-purple-200 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-purple-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-purple-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Smart Summaries</h2>
              <p className="text-sm text-purple-700">AI-powered intelligent text condensation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-purple-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-purple-900" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-purple-200 p-6 overflow-y-auto">
            <h3 className="text-purple-900 font-bold mb-4">Source Material</h3>
            
            {/* Upload Area */}
            <div 
              className="bg-white border-2 border-dashed border-purple-300 rounded-xl p-8 mb-6 hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-center text-purple-900 mb-2">
                {uploadedFile ? uploadedFile.name : 'Upload document to summarize'}
              </p>
              <p className="text-center text-xs text-purple-600">
                PDF, DOCX, TXT, or paste text directly
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />

            {/* Or paste text */}
            <div className="mb-6">
              <label className="text-purple-900 text-sm mb-2 block font-semibold">Or paste text here</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-white border border-purple-200 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Paste your text, lecture notes, or article here..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Summary Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-purple-900 text-sm mb-2 block font-semibold">Summary Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'detailed'].map((length) => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={`py-2 px-4 rounded-lg capitalize transition-all ${
                        summaryLength === length
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  {summaryLength === 'short' && '~100 words - Key points only'}
                  {summaryLength === 'medium' && '~250 words - Balanced overview'}
                  {summaryLength === 'detailed' && '~500 words - Comprehensive summary'}
                </p>
              </div>

              <div>
                <label className="text-purple-900 text-sm mb-2 block font-semibold">Focus Area</label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl text-purple-900 focus:outline-none focus:border-purple-400"
                >
                  <option value="balanced">Balanced Overview</option>
                  <option value="concepts">Key Concepts Only</option>
                  <option value="practical">Practical Applications</option>
                  <option value="theory">Theoretical Foundation</option>
                  <option value="examples">Examples & Use Cases</option>
                </select>
              </div>

              {/* AI Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-purple-900 text-sm">Extract Key Points</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-purple-900 text-sm">Highlight Important Terms</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-purple-900 text-sm">Difficulty Assessment</span>
                  </div>
                  <label className="relative inline-block w-10 h-5">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || (!uploadedFile && !textInput.trim())}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Smart Summary
                </>
              )}
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white/50">
            {!summaryGenerated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Brain className="w-20 h-20 text-purple-400 mb-4" />
                <h3 className="text-xl text-purple-900 font-bold mb-2">Your Summary Will Appear Here</h3>
                <p className="text-purple-700 text-sm">Upload or paste content to generate an intelligent summary</p>
              </div>
            ) : (
                <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900 mb-1">{generatedSummary.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-purple-700">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {generatedSummary.readTime}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${
                        generatedSummary.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                        generatedSummary.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {generatedSummary.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4 text-purple-900" />
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                      title="Download as Markdown"
                    >
                      <Download className="w-4 h-4 text-purple-900" />
                    </button>
                    <button className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-purple-900" />
                    </button>
                  </div>
                </div>

                {/* Key Points */}
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {generatedSummary.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-blue-900 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary Text */}
                <div className="bg-white p-5 rounded-xl border border-purple-200">
                  <h4 className="text-purple-900 font-bold mb-3">Summary</h4>
                  <p className="text-purple-900 text-sm leading-relaxed whitespace-pre-line">
                    {generatedSummary.summary}
                  </p>
                </div>

                {/* Concepts */}
                <div className="bg-pink-50 p-5 rounded-xl border border-pink-200">
                  <h4 className="text-pink-900 font-bold mb-3">Related Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedSummary.concepts.map((concept: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white hover:bg-pink-100 text-pink-900 text-sm rounded-lg cursor-pointer transition-colors border border-pink-200"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coverage */}
                <div className="bg-white p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-purple-900 font-bold">Content Coverage</h4>
                    <span className="text-purple-600 font-bold">{generatedSummary.coverage}%</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${generatedSummary.coverage}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    Summary captures {generatedSummary.coverage}% of the original content's key information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
