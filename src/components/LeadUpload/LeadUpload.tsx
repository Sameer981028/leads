import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Plus, User } from 'lucide-react';
import { parseExcelFile, generateExcelTemplate } from '../../utils/excelParser';
import { Lead } from '../../types';

interface LeadUploadProps {
  onUpload: (leads: Lead[]) => void;
  onAddSingleLead: (lead: Lead) => void;
}

const LeadUpload: React.FC<LeadUploadProps> = ({ onUpload, onAddSingleLead }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualLead, setManualLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    campaign: '',
    company: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage('Please upload an Excel file (.xlsx or .xls)');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');
    
    // Parse Excel file
    parseExcelFile(file)
      .then((leads) => {
        if (leads.length === 0) {
          setErrorMessage('No valid leads found in the file. Please check the format.');
          setUploadStatus('error');
          return;
        }
        
        onUpload(leads);
        setUploadedCount(leads.length);
        setUploadStatus('success');
        
        setTimeout(() => setUploadStatus('idle'), 3000);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 5000);
      });
  };

  const downloadTemplate = () => {
    generateExcelTemplate();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualLead.name.trim() || !manualLead.phone.trim()) {
      setErrorMessage('Name and Phone are required fields');
      return;
    }

    const newLead: Lead = {
      id: `manual-${Date.now()}`,
      name: manualLead.name.trim(),
      email: manualLead.email.trim() || `lead${Date.now()}@placeholder.com`,
      phone: manualLead.phone.trim(),
      source: manualLead.source.trim() || 'Manual Entry',
      campaign: manualLead.campaign.trim() || 'Default Campaign',
      status: 'New',
      dateAdded: new Date().toISOString(),
      remarks: manualLead.company ? `Company: ${manualLead.company}` : undefined
    };

    onAddSingleLead(newLead);
    
    // Reset form
    setManualLead({
      name: '',
      email: '',
      phone: '',
      source: '',
      campaign: '',
      company: ''
    });
    
    setShowManualForm(false);
    setUploadStatus('success');
    setUploadedCount(1);
    setTimeout(() => setUploadStatus('idle'), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Lead Upload</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowManualForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Single Lead</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
            <span>Download Template</span>
          </button>
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Upload Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Download and use the Excel template format</li>
          <li>• Supported formats: .xlsx, .xls</li>
          <li>• Required columns: Name, Phone (Email is optional)</li>
          <li>• Optional columns: Email, Source, Campaign</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Empty email fields will be auto-generated</li>
        </ul>
      </div>

      {/* Manual Lead Entry Form */}
      {showManualForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="mr-2" size={20} />
              Add Single Lead
            </h3>
            <button
              onClick={() => setShowManualForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={manualLead.name}
                  onChange={(e) => setManualLead({...manualLead, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={manualLead.phone}
                  onChange={(e) => setManualLead({...manualLead, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={manualLead.email}
                  onChange={(e) => setManualLead({...manualLead, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={manualLead.company}
                  onChange={(e) => setManualLead({...manualLead, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={manualLead.source}
                  onChange={(e) => setManualLead({...manualLead, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Manual Entry">Manual Entry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                <input
                  type="text"
                  value={manualLead.campaign}
                  onChange={(e) => setManualLead({...manualLead, campaign: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Campaign name (optional)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Lead
              </button>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {uploadStatus === 'uploading' ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="space-y-4">
            <CheckCircle size={48} className="text-green-500 mx-auto" />
            <div>
              <p className="text-green-600 font-semibold">Upload successful!</p>
              <p className="text-gray-600">{uploadedCount} leads imported</p>
            </div>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="space-y-4">
            <AlertCircle size={48} className="text-red-500 mx-auto" />
            <div>
              <p className="text-red-600 font-semibold">Upload failed</p>
              <p className="text-gray-600 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload size={48} className="text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-700">Drop your Excel file here</p>
              <p className="text-gray-500">or click to browse</p>
              <p className="text-sm text-gray-400 mt-2">Supports .xlsx and .xls files</p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 cursor-pointer"
            >
              <FileText size={20} />
              <span>Choose File</span>
            </label>
          </div>
        )}
      </div>

      {/* Recent Uploads */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {uploadStatus === 'success' ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <div>
                  <p className="font-medium text-gray-800">Latest Upload</p>
                  <p className="text-sm text-gray-500">
                    {uploadedCount} lead{uploadedCount !== 1 ? 's' : ''} imported successfully
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <FileText size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No recent uploads</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadUpload;