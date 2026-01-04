import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Download, Eye, RefreshCw } from 'lucide-react';

interface ValidationError {
  rowNumber: number;
  data: any;
  errors: string[];
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
}

interface ProcessingLog {
  rowNumber: number;
  studentId: string;
  examId: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
}

const BulkHallTicketUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [examSession, setExamSession] = useState('Mid-Term 2025');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [currentJob, setCurrentJob] = useState<JobStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<ProcessingLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setValidationResult(null);
      } else {
        alert('Please select a CSV file');
      }
    }
  }, []);

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

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationResult(null);
    }
  };

  // Preview and validate CSV
  const previewCSV = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/admin/advanced/api/hall-tickets/preview-csv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setValidationResult(result);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview CSV file');
    }
  };

  // Start bulk processing
  const startBulkProcessing = async (forceProcess = false) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);
    formData.append('examSession', examSession);
    formData.append('uploadedBy', 'admin'); // TODO: Get from auth context

    setIsProcessing(true);

    try {
      const endpoint = forceProcess 
        ? '/admin/advanced/api/hall-tickets/bulk-upload-force'
        : '/admin/advanced/api/hall-tickets/bulk-upload';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setCurrentJob({
          id: result.jobId,
          filename: file.name,
          status: 'PROCESSING',
          totalRows: result.totalRows,
          processedRows: 0,
          successRows: 0,
          failedRows: 0,
          progress: 0
        });

        // Start monitoring progress
        startProgressMonitoring(result.jobId);
      } else if (result.requiresConfirmation) {
        setValidationResult(result);
        setIsProcessing(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert('Failed to start processing');
      setIsProcessing(false);
    }
  };

  // Monitor job progress
  const startProgressMonitoring = (jobId: string) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/admin/advanced/api/hall-tickets/job-status/${jobId}`);
        const result = await response.json();

        if (result.success) {
          setCurrentJob(result.job);
          setRecentLogs(result.recentLogs || []);

          // Stop monitoring if job is complete
          if (result.job.status === 'COMPLETED' || result.job.status === 'FAILED') {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error('Progress monitoring error:', error);
      }
    }, 2000);
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csvContent = `student_id,student_name,exam_id,exam_name,department,hall_name,seat_number,exam_date,exam_time,qr_code_id
CBIT001,Ananya Reddy,EX101,DBMS Mid Sem,CSE,HALL-A,A-1-1,2025-01-15,09:30,QR-CBIT001
CBIT002,Rahul Sharma,EX101,DBMS Mid Sem,CSE,HALL-A,A-1-3,2025-01-15,09:30,QR-CBIT002
CBIT003,Sneha Patel,EX101,DBMS Mid Sem,CSE,HALL-A,A-1-5,2025-01-15,09:30,QR-CBIT003`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_hall_tickets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);

    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.round(duration / 60)}m ${duration % 60}s`;
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🎫 High-Scale Bulk Hall Ticket Upload
          </h2>
          <div className="flex gap-2">
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Download size={16} />
              Sample CSV
            </button>
          </div>
        </div>

        {/* Step 1: File Upload */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📄 Step 1: Upload CSV File
          </h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="text-green-600" size={32} />
                <div>
                  <p className="text-lg font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">
                    {(file.size / 1024).toFixed(2)} KB • Ready for processing
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports large files (1000+ rows) • Max size: 10MB
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Session
            </label>
            <select
              value={examSession}
              onChange={(e) => setExamSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Mid-Term 2025</option>
              <option>End-Term 2025</option>
              <option>Supplementary 2025</option>
              <option>Special Exam 2025</option>
            </select>
          </div>
        </div>

        {/* Step 2: Preview & Validation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🔍 Step 2: Preview & Validate
          </h3>
          
          {!validationResult ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Eye className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600 mb-4">Upload a CSV file to see preview and validation</p>
              <button
                onClick={previewCSV}
                disabled={!file}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Preview & Validate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                validationResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {validationResult.success ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-600" size={20} />
                  )}
                  <span className="font-medium">
                    {validationResult.success ? 'Validation Passed' : 'Validation Issues Found'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Rows:</span>
                    <span className="ml-2 font-medium">{validationResult.totalRows}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Valid Rows:</span>
                    <span className="ml-2 font-medium text-green-600">{validationResult.validRows}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Invalid Rows:</span>
                    <span className="ml-2 font-medium text-red-600">{validationResult.invalidRows}</span>
                  </div>
                </div>
              </div>

              {validationResult.errors && validationResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validationResult.errors.slice(0, 10).map((error: ValidationError, index: number) => (
                      <div key={index} className="text-sm text-red-700">
                        Row {error.rowNumber}: {error.errors.join(', ')}
                      </div>
                    ))}
                    {validationResult.errors.length > 10 && (
                      <div className="text-sm text-red-600 italic">
                        ... and {validationResult.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Processing */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚀 Step 3: High-Scale Processing
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => startBulkProcessing(false)}
                disabled={!file || isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : null}
                🎯 Start Bulk Processing
              </button>
              
              {validationResult && validationResult.invalidRows > 0 && (
                <button
                  onClick={() => startBulkProcessing(true)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  ⚠️ Force Process (Skip Errors)
                </button>
              )}
            </div>

            {/* Live Progress */}
            {currentJob && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">📊 Live Processing Progress</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentJob.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    currentJob.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    currentJob.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentJob.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{currentJob.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentJob.status === 'COMPLETED' ? 'bg-green-500' :
                        currentJob.status === 'FAILED' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${currentJob.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{currentJob.processedRows}</div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentJob.successRows}</div>
                    <div className="text-sm text-gray-600">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{currentJob.failedRows}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentJob.startedAt && currentJob.status === 'PROCESSING' ? (
                        Math.round((Date.now() - new Date(currentJob.startedAt).getTime()) / 1000 / 60)
                      ) : (
                        currentJob.completedAt && currentJob.startedAt ? (
                          calculateDuration(currentJob.startedAt, currentJob.completedAt)
                        ) : '--'
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentJob.status === 'PROCESSING' ? 'Minutes' : 'Duration'}
                    </div>
                  </div>
                </div>

                {/* Recent Logs */}
                {recentLogs.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Recent Activity:</h5>
                    <div className="bg-white rounded border max-h-40 overflow-y-auto p-3 font-mono text-sm">
                      {recentLogs.map((log, index) => (
                        <div key={index} className="flex items-center gap-2 py-1">
                          {log.status === 'SUCCESS' ? (
                            <CheckCircle className="text-green-500" size={12} />
                          ) : (
                            <XCircle className="text-red-500" size={12} />
                          )}
                          <span className="text-gray-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                          <span>Row {log.rowNumber}: {log.studentId}</span>
                          {log.errorMessage && (
                            <span className="text-red-600">- {log.errorMessage}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Failed Rows */}
                {currentJob.status === 'COMPLETED' && currentJob.failedRows > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-yellow-800">Failed Rows Available</h5>
                        <p className="text-sm text-yellow-700">
                          {currentJob.failedRows} rows failed processing. Download error report for details.
                        </p>
                      </div>
                      <a
                        href={`/admin/advanced/api/hall-tickets/download-failed/${currentJob.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} />
                        Download Failed Rows
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkHallTicketUpload;