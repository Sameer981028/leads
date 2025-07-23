import React from 'react';
import { X, Calendar, Clock, CheckCircle, DollarSign, User, Phone } from 'lucide-react';
import { Lead } from '../../types';

interface LeadHistoryCardProps {
  lead: Lead;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const LeadHistoryCard: React.FC<LeadHistoryCardProps> = ({ 
  lead, 
  onClose, 
  showCloseButton = false 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Demo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Integrated': return 'bg-green-100 text-green-800 border-green-200';
      case 'Paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Unpaid': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 relative">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      )}
      
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <User className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{lead.email}</span>
          <span className="flex items-center">
            <Phone size={14} className="mr-1" />
            {lead.phone}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
        </div>

        {/* Lead Created */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Lead Created:</span>
          </div>
          <span className="text-sm text-gray-600">{formatDate(lead.dateAdded)}</span>
        </div>

        {/* Last Response / Follow-up */}
        {(lead.status === 'Contacted' || lead.lastResponse) && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Last Contact:</span>
            </div>
            <span className="text-sm text-gray-600">{formatDate(lead.lastResponse)}</span>
          </div>
        )}

        {/* Demo Information */}
        {(lead.status === 'Demo' || lead.demoType) && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-purple-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Demo Details:</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{lead.demoType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{formatDate(lead.demoStartDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span>{formatDate(lead.demoEndDate)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Integration Information */}
        {(lead.status === 'Integrated' || lead.integrationStatus) && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Integration Details:</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">{lead.integrationStatus || 'Not started'}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{formatDate(lead.integrationStartDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span>{formatDate(lead.integrationEndDate)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        {(lead.paymentStatus || lead.paymentAmount) && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-emerald-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Payment Details:</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${lead.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {lead.paymentStatus || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">₹{lead.paymentAmount?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Date:</span>
                <span>{formatDate(lead.paymentDate)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Remarks */}
        {lead.remarks && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Remarks:</span>
            </div>
            <p className="text-sm text-gray-600">{lead.remarks}</p>
          </div>
        )}

        {/* Feedback */}
        {lead.feedback && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Feedback:</span>
            </div>
            <p className="text-sm text-gray-600">{lead.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadHistoryCard;