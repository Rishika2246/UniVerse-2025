import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw, FileSpreadsheet, ChevronDown, ChevronUp, Users, Building } from 'lucide-react';

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
  deliveredCount: number;
  failedCount: number;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errorSummary?: string;
  branch?: string;
  uploadType?: string;
}

interface CSVPreview {
  totalRows: number;
  headers: string[];
  preview: any[];
  sampleRow: any;
  errors?: string[];
}

const HallTicketBulkUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [uploadType, setUploadType] = useState<'FILES' | 'CSV'>('CSV');
  const [csvData, setCSVData] = useState<CSVPreview | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [currentJob, setCurrentJob] = useState<JobStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  // Debug useEffect
  useEffect(() => {
    console.log('Component state:', {
      selectedExam,
      selectedBranch,
      uploadType,
      filesCount: files.length,
      csvFile: csvFile?.name,
      csvDataRows: csvData?.totalRows,
      error
    });
  }, [selectedExam, selectedBranch, uploadType, files, csvFile, csvData, error]);

  // Load exams and branches
  useEffect(() => {
    loadExams();
    loadBranches();
  }, []);

  const loadExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hall-tickets/exams`, {
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
      const response = await fetch(`${API_BASE_URL}/hall-tickets/branches`, {
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

  // Helper function to parse CSV lines correctly
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        // Handle escaped quotes ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // Parse hall ticket CSV with specific column mapping
  const parseHallTicketCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          console.log('CSV content preview (first 500 chars):', text.substring(0, 500));
          
          // Handle different line endings
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
          
          // Parse headers with proper CSV handling
          const headers = parseCSVLine(lines[0]).map((h: string) => h.trim());
          console.log('CSV Headers:', headers);
          
          const data = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            try {
              const values = parseCSVLine(lines[i]).map((v: string) => v.trim());
              const obj: any = { __rowNumber: i + 1 };
              
              headers.forEach((header: string, idx: number) => {
                const value = values[idx] || '';
                const lowerHeader = header.toLowerCase();
                
                // Comprehensive column mapping
                if (lowerHeader === 'student_id' || lowerHeader === 'rollno' || lowerHeader === 'roll_number') {
                  obj.rollNumber = value;
                } else if (lowerHeader === 'student_name' || lowerHeader === 'name' || lowerHeader === 'full_name') {
                  obj.studentName = value;
                } else if (lowerHeader === 'exam_id') {
                  obj.examId = value;
                } else if (lowerHeader === 'exam_name') {
                  obj.examName = value;
                } else if (lowerHeader === 'department') {
                  obj.department = value;
                } else if (lowerHeader === 'hall_name' || lowerHeader === 'hall') {
                  obj.hallName = value;
                } else if (lowerHeader === 'seat_number' || lowerHeader === 'seat') {
                  obj.seatNumber = value;
                } else if (lowerHeader === 'exam_date' || lowerHeader === 'date') {
                  obj.examDate = value;
                } else if (lowerHeader === 'exam_time' || lowerHeader === 'time') {
                  obj.examTime = value;
                } else if (lowerHeader === 'qr_code_id' || lowerHeader === 'qr_code') {
                  obj.qrCode = value;
                } else if (lowerHeader === 'email') {
                  obj.email = value;
                } else {
                  // Keep original header for unknown columns
                  obj[header] = value;
                }
              });
              
              // Ensure required fields
              if (!obj.rollNumber && values[0]) {
                obj.rollNumber = values[0];
              }
              if (!obj.studentName && values[1]) {
                obj.studentName = values[1];
              }
              if (!obj.email) {
                obj.email = `${obj.rollNumber || 'student'}@college.edu`;
              }
              
              data.push(obj);
              
            } catch (rowError) {
              console.warn(`Error parsing row ${i + 1}:`, rowError);
            }
          }
          
          console.log('Parsed data sample (first 3 rows):', data.slice(0, 3));
          resolve(data);
          
        } catch (error: any) {
          console.error('CSV parsing error details:', error);
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  // Test CSV parsing directly
  const testCSVParsing = async (file: File) => {
    const text = await file.text();
    console.log('=== CSV DEBUG INFO ===');
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('First 1000 chars:', text.substring(0, 1000));
    console.log('Line count:', text.split('\n').length);
    
    const lines = text.split('\n');
    console.log('Headers:', lines[0]);
    console.log('Headers split:', lines[0].split(','));
    console.log('First data row:', lines[1]);
    
    // Try manual parsing
    const manualParse = lines.slice(0, 5).map((line, i) => {
      const parts = line.split(',');
      return { line: i + 1, parts, partCount: parts.length };
    });
    
    console.log('Manual parse preview:', manualParse);
  };

  // Handle CSV file upload and preview
  const handleCSVUpload = async (file: File) => {
    setIsPreviewing(true);
    setError(null);
    setCsvFile(file);
    setValidationResult(null);
    
    try {
      // Debug: Test parsing
      await testCSVParsing(file);
      
      const parsedData = await parseHallTicketCSV(file);
      
      if (parsedData.length === 0) {
        throw new Error('No data found in CSV file');
      }
      
      // Validate we have required fields
      const firstRow = parsedData[0];
      const missingFields = [];
      if (!firstRow.rollNumber) missingFields.push('rollNumber');
      if (!firstRow.studentName) missingFields.push('studentName');
      
      if (missingFields.length > 0) {
        console.warn('Missing fields in first row:', missingFields, firstRow);
      }
      
      setCSVData({
        totalRows: parsedData.length,
        headers: Object.keys(firstRow).filter(k => !k.startsWith('__')),
        preview: parsedData.slice(0, 10),
        sampleRow: firstRow
      });
      
      // Don't auto-validate - let user manually validate
      console.log('CSV parsed successfully, ready for validation');
      
    } catch (error: any) {
      console.error('CSV processing error:', error);
      setError(`Failed to process CSV file: ${error.message}`);
      setCSVData(null);
    } finally {
      setIsPreviewing(false);
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

  // Handle file drop
  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (uploadType === 'FILES') {
      const validFiles = droppedFiles.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
      });
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      const csvFile = droppedFiles.find(file => 
        file.type === 'text/csv' || 
        file.name.endsWith('.csv')
      );
      
      if (csvFile) {
        handleCSVUpload(csvFile);
      }
    }
  }, [uploadType]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (uploadType === 'FILES') {
      const validFiles = selectedFiles.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
      });
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      const csvFile = selectedFiles.find(file => 
        file.type === 'text/csv' || 
        file.name.endsWith('.csv')
      );
      
      if (csvFile) {
        handleCSVUpload(csvFile);
      }
    }
  };

  // Validate CSV data
  const validateCSVData = async () => {
    console.log('validateCSVData called with:', { csvData: !!csvData, csvFile: !!csvFile });
    
    if (!csvData || !csvFile) {
      setError('No CSV data to validate');
      return false;
    }

    console.log('Validating CSV:', {
      filename: csvFile.name,
      size: csvFile.size,
      previewRows: csvData?.preview?.length,
      sampleRow: csvData?.sampleRow
    });

    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      
      console.log('Sending validation request to:', `${API_BASE_URL}/hall-tickets/preview-csv`);
      
      const response = await fetch(`${API_BASE_URL}/hall-tickets/preview-csv`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const result = await response.json();
      console.log('Validation response:', result);
      
      if (result.success && result.data) {
        setValidationResult(result.data);
        setError(null);
        console.log('Validation successful:', result.data);
        return true;
      } else {
        const errorMsg = result.message || 'CSV validation failed';
        const validRows = result.data?.validRows || 0;
        const invalidRows = result.data?.invalidRows || 0;
        console.error('Validation failed:', errorMsg, result.data);
        setError(`${errorMsg}. Valid rows: ${validRows}, Invalid rows: ${invalidRows}`);
        setValidationResult(result.data || null);
        return false;
      }
    } catch (error: any) {
      console.error('Validation error details:', error);
      setError(`Failed to validate CSV: ${error.message}`);
      setValidationResult(null);
      return false;
    }
  };

  // Start bulk processing
  const startBulkProcessing = async () => {
    // Double-check all conditions
    if (!selectedExam || !selectedBranch) {
      setError('Please select exam and branch');
      return;
    }

    if (uploadType === 'FILES' && (!files || files.length === 0)) {
      setError('Please select files to upload');
      return;
    }

    if (uploadType === 'CSV' && !csvFile) {
      setError('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // First validate if CSV
      if (uploadType === 'CSV') {
        console.log('Validating CSV before processing...');
        const isValid = await validateCSVData();
        if (!isValid) {
          console.warn('CSV validation failed, but continuing anyway');
          // Continue even if validation fails for now
        }
      }

      const formData = new FormData();
      formData.append('examId', selectedExam);
      formData.append('branch', selectedBranch);
      formData.append('uploadType', uploadType);
      
      if (uploadType === 'FILES') {
        files.forEach(file => {
          formData.append('hallTickets', file);
        });
      } else if (csvFile) {
        formData.append('hallTickets', csvFile);
      }

      console.log('Starting bulk upload with:', {
        examId: selectedExam,
        branch: selectedBranch,
        uploadType,
        fileCount: uploadType === 'FILES' ? files.length : 1
      });

      const response = await fetch(`${API_BASE_URL}/hall-tickets/bulk-upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (result.success) {
        handleUploadSuccess(result.data.jobId);
        setProcessingResult(result.data);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadSuccess = (jobId: string) => {
    const totalItems = uploadType === 'FILES' ? (files?.length || 0) : (csvData?.totalRows || 0);
    
    setCurrentJob({
      id: jobId,
      filename: uploadType === 'FILES' ? 'bulk-hall-tickets' : (csvFile?.name || 'bulk-upload'),
      status: 'PROCESSING',
      totalRows: totalItems,
      processedRows: 0,
      successRows: 0,
      failedRows: 0,
      deliveredCount: 0,
      failedCount: 0,
      progress: 0,
      branch: selectedBranch,
      uploadType
    });

    // Start polling for progress
    startProgressPolling(jobId);
  };

  // Poll for job progress
  const startProgressPolling = (jobId: string) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/hall-tickets/job-status/${jobId}`, {
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
            
            // Update processing result
            if (result.data.status === 'COMPLETED') {
              setProcessingResult({
                success: true,
                message: `Processing completed: ${result.data.successRows} succeeded, ${result.data.failedRows} failed`,
                details: result.data
              });
            } else {
              setError(`Processing failed: ${result.data.errorSummary || 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch job status:', error);
      }
    }, 2000);
  };

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Clear all data
  const clearAllData = () => {
    setFiles([]);
    setCsvFile(null);
    setCSVData(null);
    setSelectedExam('');
    setSelectedBranch('');
    setError(null);
    setValidationResult(null);
    setProcessingResult(null);
    setCurrentJob(null);
    if (csvInputRef.current) csvInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  // Find selected exam name
  const selectedExamName = exams.find(e => e.id === selectedExam)?.course?.code + ' - ' + 
                         exams.find(e => e.id === selectedExam)?.examType;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Hall Ticket Bulk Upload & Management
        </h2>
        <p className="text-gray-600">Upload hall tickets for students in bulk via CSV or individual files</p>
      </div>

      {/* Step 1: Upload CSV File */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">1</span>
          Upload CSV or Files
        </h3>

        {/* Upload Type Selector */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setUploadType('CSV');
                setFiles([]);
              }}
              className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 flex-1 ${
                uploadType === 'CSV'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              Upload CSV File
            </button>
            <button
              onClick={() => {
                setUploadType('FILES');
                setCSVData(null);
                setCsvFile(null);
              }}
              className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 flex-1 ${
                uploadType === 'FILES'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Upload Individual Files
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => uploadType === 'FILES' ? fileInputRef.current?.click() : csvInputRef.current?.click()}
        >
          {uploadType === 'FILES' ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop hall ticket files here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, JPG, PNG files (max 10MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop CSV file here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Upload CSV with student hall ticket data
              </p>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* File Info */}
        {(uploadType === 'FILES' && files.length > 0) || (uploadType === 'CSV' && csvFile) ? (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  {uploadType === 'FILES' ? `${files.length} files selected` : csvFile?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {uploadType === 'FILES' 
                    ? `Total size: ${(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)} KB`
                    : `Size: ${((csvFile?.size || 0) / 1024).toFixed(2)} KB, Rows: ${csvData?.totalRows || 'Calculating...'}`
                  }
                </p>
              </div>
              <button
                onClick={clearAllData}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear
              </button>
            </div>
            
            {/* CSV Validation Button */}
            {uploadType === 'CSV' && csvFile && !validationResult && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={validateCSVData}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Validate CSV Data
                </button>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Click to validate your CSV file before processing
                </p>
              </div>
            )}
          </div>
        ) : null}
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
              onChange={(e) => {
                console.log('Selected exam:', e.target.value);
                setSelectedExam(e.target.value);
              }}
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
              onChange={(e) => {
                console.log('Selected branch:', e.target.value);
                setSelectedBranch(e.target.value);
              }}
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

      {/* Step 3: Preview & Validate */}
      {uploadType === 'CSV' && csvData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">3</span>
            Preview & Validate
          </h3>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium">
                <XCircle className="w-5 h-5" />
                Validation Issues Found
              </div>
              <p className="mt-1 text-red-700 text-sm">{error}</p>
            </div>
          )}

          {validationResult && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 font-medium">
                <AlertTriangle className="w-5 h-5" />
                Validation Results
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Rows:</span> {validationResult.totalRows || 0}
                </div>
                <div className="text-green-600">
                  <span className="font-medium">Valid Rows:</span> {validationResult.validRows || 0}
                </div>
                <div className="text-red-600">
                  <span className="font-medium">Invalid Rows:</span> {validationResult.invalidRows || 0}
                </div>
              </div>
              {validationResult.invalidRows > 0 && (
                <p className="mt-2 text-sm text-yellow-700">
                  Found {validationResult.invalidRows} invalid rows. Please review and confirm to proceed with {validationResult.validRows} valid rows.
                </p>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">CSV Preview ({csvData.totalRows} rows):</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {csvData.headers.map((header, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {header}
                  </span>
                ))}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                      {csvData.headers.map((header, index) => (
                        <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvData.preview.slice(0, expandedPreview ? 10 : 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-4 py-2 text-sm text-gray-500">{row.__rowNumber}</td>
                        {csvData.headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 text-sm text-gray-900">
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {csvData.totalRows > 5 && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setExpandedPreview(!expandedPreview)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                  >
                    {expandedPreview ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show More ({csvData.totalRows - 5} more rows)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={validateCSVData}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Validate Again
            </button>
            <button
              onClick={() => {
                if (validationResult?.validRows === 0) {
                  if (window.confirm('No valid rows found. Do you want to force process anyway?')) {
                    startBulkProcessing();
                  }
                } else {
                  startBulkProcessing();
                }
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm & Proceed
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Start Processing */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">4</span>
          Start Bulk Processing
        </h3>

        {currentJob?.status === 'FAILED' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-medium">
              <XCircle className="w-5 h-5" />
              Bulk Processing Failed
            </div>
            <p className="mt-1 text-red-700 text-sm">{currentJob.errorSummary}</p>
          </div>
        )}

        <button
          onClick={startBulkProcessing}
          disabled={
            isProcessing || 
            isPreviewing ||
            !selectedExam || 
            !selectedBranch || 
            (uploadType === 'FILES' && (!files || files.length === 0)) ||
            (uploadType === 'CSV' && !csvFile)
          }
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg transition-colors"
          id="process-button"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Start Bulk Processing
            </>
          )}
        </button>

        {validationResult?.validRows === 0 && validationResult?.totalRows > 0 && (
          <div className="mt-3">
            <button
              onClick={() => {
                if (window.confirm('Warning: No valid rows found. Do you want to force process anyway? This may fail.')) {
                  startBulkProcessing();
                }
              }}
              className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-600 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Force Process (Skip Errors)
            </button>
          </div>
        )}

        {isProcessing && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we process your upload...
          </p>
        )}
      </div>

      {/* Processing Results */}
      {processingResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Processing Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {processingResult.deliveredCount || processingResult.successRows || 0}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {processingResult.failedCount || processingResult.failedRows || 0}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {processingResult.totalRows || 0}
              </div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {processingResult.progress || 100}%
              </div>
              <div className="text-sm text-gray-700">Completed</div>
            </div>
          </div>

          {processingResult.message && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{processingResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && !currentJob && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <AlertTriangle className="w-5 h-5" />
            Error
          </div>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default HallTicketBulkUpload;