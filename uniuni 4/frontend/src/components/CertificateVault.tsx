import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FolderPlus, 
  Search, 
  Filter, 
  Star, 
  Share2, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Award,
  Calendar,
  Building,
  Tag,
  Plus,
  X,
  Edit3,
  ExternalLink,
  Archive
} from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  organization?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateType: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  isImportant: boolean;
  isResumeVisible: boolean;
  isPortfolioVisible: boolean;
  isVerified: boolean;
  shareToken?: string;
  folder?: CertificateFolder;
  tags: CertificateTag[];
  createdAt: string;
}

interface CertificateFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  certificates: Certificate[];
}

interface CertificateTag {
  id: string;
  tag: string;
  tagType: string;
}
const CertificateVault: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [folders, setFolders] = useState<CertificateFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  useEffect(() => {
    loadCertificates();
    loadFolders();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates`);
      const result = await response.json();
      if (result.success) {
        setCertificates(result.data.certificates);
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificate-folders`);
      const result = await response.json();
      if (result.success) {
        setFolders(result.data.folders);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = !searchQuery || 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.tags.some(tag => tag.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !filterType || cert.certificateType === filterType;
    const matchesCategory = !filterCategory || cert.category === filterCategory;
    const matchesFolder = selectedFolder === null || cert.folder?.id === selectedFolder;
    
    return matchesSearch && matchesType && matchesCategory && matchesFolder;
  });

  const toggleCertificateSelection = (certId: string) => {
    setSelectedCertificates(prev => 
      prev.includes(certId) 
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
    );
  };

  const toggleImportant = async (certId: string) => {
    try {
      const cert = certificates.find(c => c.id === certId);
      if (!cert) return;

      const response = await fetch(`${API_BASE_URL}/certificates/${certId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cert, isImportant: !cert.isImportant })
      });

      if (response.ok) {
        setCertificates(prev => prev.map(c => 
          c.id === certId ? { ...c, isImportant: !c.isImportant } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling important:', error);
    }
  };

  const toggleResumeVisible = async (certId: string) => {
    try {
      const cert = certificates.find(c => c.id === certId);
      if (!cert) return;

      const response = await fetch(`${API_BASE_URL}/certificates/${certId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cert, isResumeVisible: !cert.isResumeVisible })
      });

      if (response.ok) {
        setCertificates(prev => prev.map(c => 
          c.id === certId ? { ...c, isResumeVisible: !c.isResumeVisible } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling resume visibility:', error);
    }
  };
  const deleteCertificate = async (certId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/certificates/${certId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCertificates(prev => prev.filter(c => c.id !== certId));
        setSelectedCertificates(prev => prev.filter(id => id !== certId));
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const generateShareLink = (cert: Certificate) => {
    if (cert.shareToken) {
      const shareUrl = `${window.location.origin}/certificates/share/${cert.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'COURSE': return <FileText className="w-5 h-5" />;
      case 'INTERNSHIP': return <Building className="w-5 h-5" />;
      case 'HACKATHON': return <Award className="w-5 h-5" />;
      case 'WORKSHOP': return <FileText className="w-5 h-5" />;
      case 'EXAM': return <Award className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ACADEMIC': return 'bg-blue-100 text-blue-800';
      case 'TECHNICAL': return 'bg-green-100 text-green-800';
      case 'CO_CURRICULAR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Certificate Vault
            </h1>
            <p className="text-gray-600 mt-1">
              Secure repository for your achievements and credentials
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Certificate
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.isVerified).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resume Ready</p>
                <p className="text-2xl font-bold text-purple-600">
                  {certificates.filter(c => c.isResumeVisible).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Folders</p>
                <p className="text-2xl font-bold text-orange-600">{folders.length}</p>
              </div>
              <FolderPlus className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search certificates, organizations, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="COURSE">Course</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="HACKATHON">Hackathon</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="EXAM">Exam</option>
            <option value="ACHIEVEMENT">Achievement</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="ACADEMIC">Academic</option>
            <option value="TECHNICAL">Technical</option>
            <option value="CO_CURRICULAR">Co-curricular</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Folders */}
        <div className="w-64 bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Folders</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === null 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>All Certificates</span>
                <span className="text-sm text-gray-500">{certificates.length}</span>
              </div>
            </button>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === folder.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: folder.color }}
                    ></div>
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {folder.certificates.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          {/* Action Bar */}
          {selectedCertificates.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">
                  {selectedCertificates.length} certificate(s) selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    <Download className="w-4 h-4 inline mr-1" />
                    Download ZIP
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                  <button 
                    onClick={() => setSelectedCertificates([])}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Grid */}
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterType || filterCategory 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first certificate to get started'
                }
              </p>
              {!searchQuery && !filterType && !filterCategory && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload Certificate
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map(certificate => (
                <div
                  key={certificate.id}
                  className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                    selectedCertificates.includes(certificate.id) 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : ''
                  }`}
                >
                  {/* Certificate Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCertificates.includes(certificate.id)}
                        onChange={() => toggleCertificateSelection(certificate.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {getCertificateIcon(certificate.certificateType)}
                      {certificate.isImportant && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {certificate.isVerified && (
                        <Award className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleImportant(certificate.id)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          certificate.isImportant ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generateShareLink(certificate)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCertificate(certificate.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Certificate Content */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCertificate(certificate);
                      setShowCertificateModal(true);
                    }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {certificate.title}
                    </h3>
                    
                    {certificate.organization && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Building className="w-4 h-4" />
                        <span className="truncate">{certificate.organization}</span>
                      </div>
                    )}
                    
                    {certificate.issueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {certificate.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {certificate.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag.tag}
                          </span>
                        ))}
                        {certificate.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{certificate.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Certificate Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(certificate.category)}`}>
                        {certificate.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {certificate.certificateType}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleResumeVisible(certificate.id);
                        }}
                        className={`p-1 rounded text-xs ${
                          certificate.isResumeVisible 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                        title={certificate.isResumeVisible ? 'Visible on resume' : 'Hidden from resume'}
                      >
                        {certificate.isResumeVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <a
                        href={`${API_BASE_URL.replace('/api', '')}${certificate.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-blue-100 text-blue-700 text-xs hover:bg-blue-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateVault;