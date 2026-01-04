import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw, FileSpreadsheet, Users, Building, Star } from 'lucide-react';

interface Exam {
  id: string;
  examType: string;
  examDate: string;
  course: {
    name: string;
    code: string;
    department: string;
  };
}

interface JobStatus {
  id: string;
  filename: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  processedRows: number;
  successRows: number;
  failedRows: number;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errorSummary?: string;
  branch?: string;
  currentBatch?: number;
  totalBatches?: number;
  recentErrors?: Array<{
    rowNumber: number;
    rollNumber: string;
    error: string;
  }>;
}

const HallTicketBulkUploadMock: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [currentJob, setCurrentJob] = useState<JobStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/hall-tickets-mock';

  // Load exams and branches
  useEffect(() => {
    loadExams();
    loadBranches();
  }, []);

  const loadExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/exams`, {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        setExams(result.data);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
      setError('Failed to load exams. Please refresh the page.');
    }
  };

  const loadBranches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/branches`, {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        setBranches(result.data);
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
      setError('Failed to load branches.');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const csvFile = droppedFiles.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv')
    );
    
    if (csvFile) {
      setCsvFile(csvFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const csvFile = selectedFiles.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv')
    );
    
    if (csvFile) {
      setCsvFile(csvFile);
      setError(null);
    } else {
      setError('Please select a CSV file');
    }
  };

  // Mock bulk processing
  const startBulkProcessing = async () => {
    if (!selectedExam || !selectedBranch || !csvFile) {
      setError('Please select exam, branch, and upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setCurrentJob(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('examId', selectedExam);
      formData.append('branch', selectedBranch);

      console.log('Starting mock bulk upload:', {
        filename: csvFile.name,
        examId: selectedExam,
        branch: selectedBranch
      });

      const response = await fetch(`${API_BASE_URL}/bulk-upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      console.log('Mock upload response:', result);

      if (result.success) {
        // Start monitoring the job
        setCurrentJob({
          id: result.data.jobId,
          filename: result.data.filename,
          status: 'PROCESSING',
          totalRows: result.data.totalRows,
          processedRows: 0,
          successRows: 0,
          failedRows: 0,
          progress: 0,
          branch: result.data.branch
        });

        startProgressPolling(result.data.jobId);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Poll for job progress
  const startProgressPolling = (jobId: string) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/job-status/${jobId}`, {
          credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
          setCurrentJob(result.data);

          if (result.data.status === 'COMPLETED' || result.data.status === 'FAILED') {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch job status:', error);
      }
    }, 500); // Poll every 500ms for smooth animation
  };

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const clearAllData = () => {
    setCsvFile(null);
    setSelectedExam('');
    setSelectedBranch('');
    setError(null);
    setCurrentJob(null);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'FAILED': return 'text-red-600';
      case 'PROCESSING': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PROCESSING': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const selectedExamName = exams.find(e => e.id === selectedExam)?.course?.code + ' - ' + 
                         exams.find(e => e.id === selectedExam)?.examType;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header with Mock Badge */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Hall Ticket Bulk Upload
            </h2>
            <p className="text-gray-600">Upload CSV file and start processing immediately</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            <Star className="w-4 h-4" />
            DEMO MODE
          </div>
        </div>
      </div>

      {/* Step 1: Upload CSV File */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">1</span>
          Upload CSV File
        </h3>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => csvInputRef.current?.click()}
        >
          <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop CSV file here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Upload CSV with student hall ticket data (max 10MB)
          </p>
          <p className="text-xs text-yellow-600 bg-yellow-50 rounded px-3 py-1 inline-block">
            📋 Try uploading the 350-row sample CSV for best demo experience!
          </p>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {csvFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{csvFile.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {(csvFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={clearAllData}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Select Exam & Branch */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">2</span>
          Select Exam & Branch
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Session
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an exam...</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.course.code} - {exam.examType} ({new Date(exam.examDate).toLocaleDateString()})
                </option>
              ))}
            </select>
            {selectedExam && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedExamName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a branch...</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 3: Start Processing */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">3</span>
          Start Processing
        </h3>

        <button
          onClick={startBulkProcessing}
          disabled={isUploading || !selectedExam || !selectedBranch || !csvFile}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg transition-colors"
        >
          {isUploading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Starting Mock Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Process CSV (Demo)
            </>
          )}
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          🎭 This is a demonstration - no real database operations will be performed
        </p>
      </div>

      {/* Job Progress */}
      {currentJob && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {getStatusIcon(currentJob.status)}
            Mock Processing Status
          </h3>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{currentJob.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentJob.status === 'COMPLETED' ? 'bg-green-500' :
                    currentJob.status === 'FAILED' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(currentJob.progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{currentJob.totalRows}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{currentJob.processedRows}</div>
                <div className="text-sm text-blue-600">Processed</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-600">{currentJob.successRows}</div>
                <div className="text-sm text-green-600">Success</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-red-600">{currentJob.failedRows}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Batch Info */}
            {currentJob.currentBatch && currentJob.totalBatches && (
              <div className="text-center text-sm text-gray-600">
                Processing batch {currentJob.currentBatch} of {currentJob.totalBatches}
              </div>
            )}

            {/* Status Message */}
            <div className={`text-center font-medium ${getStatusColor(currentJob.status)}`}>
              {currentJob.status === 'PROCESSING' && '🔄 Processing your CSV file...'}
              {currentJob.status === 'COMPLETED' && `✅ Mock processing completed! ${currentJob.successRows} successful, ${currentJob.failedRows} failed`}
              {currentJob.status === 'FAILED' && `❌ Processing failed: ${currentJob.errorSummary}`}
            </div>

            {/* Recent Errors (if any) */}
            {currentJob.recentErrors && currentJob.recentErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Sample Errors (Demo):</h4>
                <div className="space-y-1">
                  {currentJob.recentErrors.map((error, index) => (
                    <div key={index} className="text-xs text-red-700">
                      Row {error.rowNumber} ({error.rollNumber}): {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <AlertTriangle className="w-5 h-5" />
            Error
          </div>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      )}

      {/* Demo Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
          <Star className="w-5 h-5" />
          Demo Information
        </div>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• This is a demonstration system that simulates bulk processing</p>
          <p>• No real database operations are performed</p>
          <p>• Results are randomly generated for demonstration purposes</p>
          <p>• Try uploading the 350-row sample CSV for the best experience!</p>
        </div>
      </div>
    </div>
  );
};

export default HallTicketBulkUploadMock;