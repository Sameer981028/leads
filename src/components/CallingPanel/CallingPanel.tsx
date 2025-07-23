import React, { useState } from 'react';
import { Phone, MessageCircle, Share2, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Lead } from '../../types';
import LeadHistoryCard from '../LeadHistoryCard/LeadHistoryCard';

interface CallingPanelProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  initialFilter?: { status?: string };
}

const CallingPanel: React.FC<CallingPanelProps> = ({ leads, onUpdateLead, initialFilter }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [callStatus, setCallStatus] = useState<'Need Followup' | 'Demo' | 'Rejected' | 'Integrated' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter?.status || 'New');

  // Apply initial filter
  React.useEffect(() => {
    if (initialFilter?.status) {
      setStatusFilter(initialFilter.status);
    }
  }, [initialFilter]);

  const leadsToCall = leads.filter(lead => {
    if (statusFilter === 'All') return true;
    return lead.status === statusFilter;
  });

  const handleCall = (lead: Lead, method: 'phone' | 'whatsapp') => {
    if (method === 'phone') {
      window.open(`tel:${lead.phone}`);
    } else {
      window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`);
    }
    setSelectedLead(lead);
  };

  const handleShareDemo = (lead: Lead) => {
    const message = `Hi ${lead.name}! Thanks for your interest. Here's our demo: https://demo.example.com and our YouTube channel: https://youtube.com/example`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  const handleStatusUpdate = () => {
    if (selectedLead && callStatus) {
      let newStatus: Lead['status'];
      switch (callStatus) {
        case 'Need Followup':
          newStatus = 'Contacted';
          break;
        case 'Demo':
          newStatus = 'Demo';
          break;
        case 'Rejected':
          newStatus = 'Rejected';
          break;
        case 'Integrated':
          newStatus = 'Integrated';
          break;
        default:
          newStatus = 'Contacted';
      }
      
      const updatedLead = {
        ...selectedLead,
        status: newStatus,
        lastResponse: new Date().toISOString(),
        remarks: remarks
      };
      onUpdateLead(updatedLead);
      setSelectedLead(null);
      setCallStatus(null);
      setRemarks('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Calling Panel</h2>
        <div className="text-sm text-gray-500">
          {leadsToCall.length} leads to call
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter leads to call:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New Leads</option>
            <option value="Contacted">Contacted Leads</option>
            <option value="Rejected">Rejected Leads</option>
            <option value="Demo">Demo Leads</option>
            <option value="Integrated">Integrated Leads</option>
            <option value="All">All Leads</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {statusFilter === 'All' ? 'All Leads' : `${statusFilter} Leads`} ({leadsToCall.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leadsToCall.map((lead) => (
              <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Source: {lead.source}</p>
                    <p>Campaign: {lead.campaign}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCall(lead, 'phone')}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Call"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={() => handleCall(lead, 'whatsapp')}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleShareDemo(lead)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Share Demo"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Update Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Call Status</h3>
          
          {selectedLead ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800">{selectedLead.name}</h4>
                <p className="text-sm text-gray-600">{selectedLead.email}</p>
                <p className="text-sm text-gray-600">{selectedLead.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Result</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="callStatus"
                      value="Need Followup"
                      checked={callStatus === 'Need Followup'}
                      onChange={() => setCallStatus('Need Followup')}
                      className="mr-2"
                    />
                    <Clock size={16} className="text-yellow-500 mr-2" />
                    <span>Need Followup</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="callStatus"
                      value="Demo"
                      checked={callStatus === 'Demo'}
                      onChange={() => setCallStatus('Demo')}
                      className="mr-2"
                    />
                    <CheckCircle size={16} className="text-purple-500 mr-2" />
                    <span>Demo</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="callStatus"
                      value="Rejected"
                      checked={callStatus === 'Rejected'}
                      onChange={() => setCallStatus('Rejected')}
                      className="mr-2"
                    />
                    <XCircle size={16} className="text-red-500 mr-2" />
                    <span>Rejected</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="callStatus"
                      value="Integrated"
                      checked={callStatus === 'Integrated'}
                      onChange={() => setCallStatus('Integrated')}
                      className="mr-2"
                    />
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span>Integration</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any notes about the call..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={!callStatus}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
              
              {/* Lead History Card */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Lead History</h4>
                <LeadHistoryCard lead={selectedLead} />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Clock size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Select a lead to update call status</p>
            </div>
          )}
        </div>
      </div>

      {/* Call Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-blue-600">{leadsToCall.length}</div>
          <div className="text-sm text-gray-500">Pending Calls</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-green-600">
            {leads.filter(l => l.status === 'Demo').length}
          </div>
          <div className="text-sm text-gray-500">Interested</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-red-600">
            {leads.filter(l => l.status === 'Rejected').length}
          </div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-yellow-600">
            {leads.filter(l => l.lastResponse && new Date(l.lastResponse) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-sm text-gray-500">Today's Calls</div>
        </div>
      </div>
    </div>
  );
};

export default CallingPanel;