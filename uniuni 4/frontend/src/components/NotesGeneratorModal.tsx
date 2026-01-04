import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X, Upload, Mic, Video, FileText, Sparkles, Download, Share2,
  BookOpen, Save, Copy, CheckCircle, ArrowLeft, AlertCircle, Loader
} from 'lucide-react';

export function NotesGeneratorModal({ onClose }: { onClose: () => void }) {
  const [inputMethod, setInputMethod] = useState<'upload' | 'record' | 'link' | 'text'>('upload');
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesGenerated, setNotesGenerated] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('detailed');
  const [selectedFormat, setSelectedFormat] = useState('structured');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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
      
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, PPT, DOCX, TXT, MP3, WAV, MP4, AVI, or MOV files.');
        return;
      }
      
      setUploadedFile(file);
      setError('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setUploadedFile(audioFile);
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks(chunks);
    } catch (error) {
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerate = async () => {
    setGeneratingNotes(true);
    setError('');
    
    try {
      let response;
      
      if (inputMethod === 'upload' && uploadedFile) {
        // Upload file and generate notes
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('style', selectedStyle);
        formData.append('format', selectedFormat);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        response = await fetch(`${API_BASE_URL}/ai-notes/upload-notes`, {
          method: 'POST',
          body: formData,
        });
      } else if (inputMethod === 'text' && textInput.trim()) {
        // Generate notes from text
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        response = await fetch(`${API_BASE_URL}/ai-notes/generate-notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textInput,
            style: selectedStyle,
            format: selectedFormat,
          }),
        });
      } else if (inputMethod === 'link' && videoUrl.trim()) {
        // Process video URL
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        response = await fetch(`${API_BASE_URL}/ai-notes/process-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoUrl: videoUrl,
            type: 'notes',
            style: selectedStyle,
            format: selectedFormat,
          }),
        });
      } else {
        throw new Error('Please provide input content');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedNotes(data.notes);
        setNotesGenerated(true);
      } else {
        throw new Error(data.message || 'Failed to generate notes');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotes);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedNotes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 rounded-2xl border border-blue-200 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-blue-200/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-blue-900" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">AI Notes Generator</h2>
              <p className="text-sm text-blue-700">Transform lectures into comprehensive study notes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-200/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-blue-900" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Input */}
          <div className="w-1/2 border-r border-blue-200 p-6 overflow-y-auto">
            <h3 className="text-blue-900 font-bold mb-4">Input Source</h3>
            
            {/* Input Method Selection */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                onClick={() => setInputMethod('upload')}
                className={`p-4 rounded-xl border transition-all ${
                  inputMethod === 'upload'
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-300 text-white'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs">Upload File</p>
              </button>
              <button
                onClick={() => setInputMethod('text')}
                className={`p-4 rounded-xl border transition-all ${
                  inputMethod === 'text'
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-300 text-white'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs">Paste Text</p>
              </button>
              <button
                onClick={() => setInputMethod('record')}
                className={`p-4 rounded-xl border transition-all ${
                  inputMethod === 'record'
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-300 text-white'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Mic className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs">Record Audio</p>
              </button>
              <button
                onClick={() => setInputMethod('link')}
                className={`p-4 rounded-xl border transition-all ${
                  inputMethod === 'link'
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-300 text-white'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Video className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs">Video Link</p>
              </button>
            </div>

            {/* Input Area */}
            {inputMethod === 'upload' && (
              <div>
                <div 
                  className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-8 mb-4 hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-center text-blue-900 mb-2">
                    {uploadedFile ? uploadedFile.name : 'Drop files here or click to browse'}
                  </p>
                  <p className="text-center text-xs text-blue-600">
                    Supports PDF, PPT, DOCX, MP3, MP4 (Max 100MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp3,.wav,.mp4,.avi,.mov"
                />
              </div>
            )}

            {inputMethod === 'text' && (
              <div className="mb-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-40 px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-400 resize-none"
                  placeholder="Paste your lecture notes, article, or any text content here..."
                />
              </div>
            )}

            {inputMethod === 'record' && (
              <div className="mb-4">
                <div className="bg-white border border-blue-200 rounded-xl p-6 text-center">
                  <Mic className={`w-16 h-16 mx-auto mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                  <p className="text-blue-900 mb-4">
                    {isRecording ? 'Recording in progress...' : 'Click to start recording'}
                  </p>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  {uploadedFile && uploadedFile.type.includes('audio') && (
                    <p className="text-green-600 text-sm mt-2">✓ Audio recorded successfully</p>
                  )}
                </div>
              </div>
            )}

            {inputMethod === 'link' && (
              <div className="mb-4">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter YouTube, Vimeo, or any video URL..."
                />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-blue-900 text-sm mb-2 block font-semibold">Notes Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-blue-900 focus:outline-none focus:border-blue-400"
                >
                  <option value="detailed">Detailed & Comprehensive</option>
                  <option value="concise">Concise & Brief</option>
                  <option value="bullet">Bullet Points</option>
                  <option value="visual">Visual with Diagrams</option>
                </select>
              </div>

              <div>
                <label className="text-blue-900 text-sm mb-2 block font-semibold">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-blue-900 focus:outline-none focus:border-blue-400"
                >
                  <option value="structured">Structured Headings</option>
                  <option value="cornell">Cornell Notes</option>
                  <option value="outline">Outline Format</option>
                  <option value="mindmap">Mind Map Style</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-100 rounded-xl border border-purple-200">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-purple-900 text-sm font-semibold">AI Enhancement</p>
                  <p className="text-xs text-purple-700">Add examples, analogies & key points</p>
                </div>
                <label className="ml-auto relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-full h-full bg-purple-200 peer-checked:bg-purple-500 rounded-full transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generatingNotes || (!uploadedFile && !textInput.trim() && !videoUrl.trim())}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generatingNotes ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Notes
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Output */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white/50">
            {!notesGenerated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BookOpen className="w-20 h-20 text-blue-400 mb-4" />
                <h3 className="text-xl text-blue-900 font-bold mb-2">Your Notes Will Appear Here</h3>
                <p className="text-blue-700 text-sm">Upload content and click Generate to create AI-powered notes</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-blue-900 font-bold">Generated Notes</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4 text-blue-900" />
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Download as Markdown"
                    >
                      <Download className="w-4 h-4 text-blue-900" />
                    </button>
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-blue-900" />
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-blue-200">
                  <pre className="whitespace-pre-wrap text-blue-900 text-sm leading-relaxed font-sans">
                    {generatedNotes}
                  </pre>
                </div>

                <div className="mt-6 p-4 bg-green-100 rounded-xl border border-green-300 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-900 font-semibold text-sm">Notes Generated Successfully!</p>
                    <p className="text-xs text-green-700">Ready to save and study</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}