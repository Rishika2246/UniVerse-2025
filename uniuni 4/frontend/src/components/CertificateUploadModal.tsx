import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Calendar, Building, Tag, Star, Eye, EyeOff } from 'lucide-react';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (certificate: any) => void;
  folders: any[];
}

const CertificateUploadModal: React.FC<CertificateUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  folders
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [certificateType, setCertificateType] = useState('COURSE');
  const [category, setCategory] = useState('ACADEMIC');
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState<string>('');
  const [isImportant, setIsImportant] = useState(false);
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const validFiles = Array.from(selectedFiles).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024; // 50MB
    });
    
    setFiles(validFiles);
    
    // Auto-fill title for single file
    if (validFiles.length === 1 && !title) {
      setTitle(validFiles[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSingleUpload = async () => {
    if (files.length === 0) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('certificate', files[0]);
      formData.append('title', title);
      formData.append('organization', organization);
      formData.append('issueDate', issueDate);
      formData.append('expiryDate', expiryDate);
      formData.append('certificateType', certificateType);
      formData.append('category', category);
      formData.append('folderId', folderId);
      formData.append('isImportant', isImportant.toString());
      formData.append('isResumeVisible', isResumeVisible.toString());
      formData.append('isPortfolioVisible', isPortfolioVisible.toString());
      
      if (tags) {
        const tagList = tags.split(',').map(tag => ({
          name: tag.trim(),
          type: 'SKILL'
        }));
        formData.append('tags', JSON.stringify(tagList));
      }

      const response = await fetch(`${API_BASE_URL}/certificates/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        onUpload(result.data.certificate);
        resetForm();
        onClose();
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (files.length === 0) {
      alert('Please select files');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('certificates', file);
      });

      const response = await fetch(`${API_BASE_URL}/certificates/bulk-upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Upload completed: ${result.data.success.length} uploaded, ${result.data.failed.length} failed, ${result.data.duplicates.length} duplicates`);
        onUpload(null); // Trigger refresh
        resetForm();
        onClose();
      } else {
        alert(result.message || 'Bulk upload failed');
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Bulk upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setTitle('');
    setOrganization('');
    setIssueDate('');
    setExpiryDate('');
    setCertificateType('COURSE');
    setCategory('ACADEMIC');
    setFolderId('');
    setTags('');
    setIsImportant(false);
    setIsResumeVisible(false);
    setIsPortfolioVisible(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Certificate</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUploadMode('single')}
              className={`px-4 py-2 rounded-lg ${
                uploadMode === 'single' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Single Upload
            </button>
            <button
              onClick={() => setUploadMode('bulk')}
              className={`px-4 py-2 rounded-lg ${
                uploadMode === 'bulk' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Bulk Upload
            </button>
          </div>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploadMode === 'single' ? 'Upload Certificate' : 'Upload Multiple Certificates'}
            </p>
            <p className="text-gray-500 mb-4">
              Drag and drop or click to select files
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF, JPG, PNG, WebP (Max 50MB each)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple={uploadMode === 'bulk'}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Selected Files:</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Single Upload Form */}
          {uploadMode === 'single' && files.length > 0 && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter certificate title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Issuing organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder
                  </label>
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No Folder</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Type
                  </label>
                  <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="COURSE">Course</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="EXAM">Exam</option>
                    <option value="ACHIEVEMENT">Achievement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="CO_CURRICULAR">Co-curricular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Frontend"
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">Mark as important</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isResumeVisible}
                    onChange={(e) => setIsResumeVisible(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Eye className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Show on resume</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isPortfolioVisible}
                    onChange={(e) => setIsPortfolioVisible(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Show on portfolio</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={uploadMode === 'single' ? handleSingleUpload : handleBulkUpload}
              disabled={files.length === 0 || uploading || (uploadMode === 'single' && !title)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {uploadMode === 'single' ? 'Upload Certificate' : `Upload ${files.length} Certificates`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadModal;