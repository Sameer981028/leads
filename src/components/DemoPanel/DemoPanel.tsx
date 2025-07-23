import React, { useState } from 'react';
import { Calendar, Clock, PlayCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Lead } from '../../types';

interface DemoPanelProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  initialFilter?: { demoStatus?: string };
}

const DemoPanel: React.FC<DemoPanelProps> = ({ leads, onUpdateLead, initialFilter }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [demoFilter, setDemoFilter] = useState(initialFilter?.demoStatus || 'active');
  const [demoForm, setDemoForm] = useState({
    mobile: '',
    email: '',
    demoType: 'Video' as 'Video' | 'Live' | 'Trial',
    startDate: '',
    duration: 7
  });

  // Apply initial filter
  React.useEffect(() => {
    if (initialFilter?.demoStatus) {
      setDemoFilter(initialFilter.demoStatus);
    }
  }, [initialFilter]);

  const demoLeads = leads.filter(lead => lead.status === 'Demo');
  const expiredDemos = demoLeads.filter(lead => 
    lead.demoEndDate && new Date(lead.demoEndDate) < new Date()
  );
  const activeDemos = demoLeads.filter(lead => 
    lead.demoEndDate && new Date(lead.demoEndDate) >= new Date()
  );
  const newDemos = demoLeads.filter(lead => 
    lead.demoStartDate && new Date(lead.demoStartDate) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  const handleAssignDemo = (lead: Lead) => {
    setSelectedLead(lead);
    setDemoForm({
      mobile: lead.phone,
      email: lead.email,
      demoType: 'Video',
      startDate: new Date().toISOString().split('T')[0],
      duration: 7
    });
    setShowAssignModal(true);
  };

  const handleSubmitDemo = () => {
    if (selectedLead) {
      const startDate = new Date(demoForm.startDate);
      const endDate = new Date(startDate.getTime() + (demoForm.duration * 24 * 60 * 60 * 1000));
      
      const updatedLead = {
        ...selectedLead,
        status: 'Demo' as const,
        demoType: demoForm.demoType,
        demoStartDate: startDate.toISOString(),
        demoEndDate: endDate.toISOString()
      };
      
      onUpdateLead(updatedLead);
      setShowAssignModal(false);
      setSelectedLead(null);
    }
  };

  const handleDemoStatusUpdate = (lead: Lead, status: 'interested' | 'not_responded' | 'follow_up') => {
    const updatedLead = {
      ...lead,
      status: status === 'interested' ? 'Integrated' as const : 'Contacted' as const,
      remarks: `Demo ${status === 'interested' ? 'successful' : status.replace('_', ' ')}`,
      lastResponse: new Date().toISOString()
    };
    
    // If moving to integration, set integration details
    if (status === 'interested') {
      updatedLead.integrationStatus = 'Started';
      updatedLead.integrationStartDate = new Date().toISOString();
    }
    
    onUpdateLead(updatedLead);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining < 0) return 'bg-red-100 text-red-800';
    if (daysRemaining <= 1) return 'bg-orange-100 text-orange-800';
    if (daysRemaining <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Demo Panel</h2>
        <div className="text-sm text-gray-500">
          {demoLeads.length} active demos
        </div>
      </div>

      {/* Demo Reports Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setDemoFilter('active')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            demoFilter === 'active' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-green-600">{activeDemos.length}</div>
          <div className="text-sm text-gray-500">Active Demos</div>
        </div>
        <div 
          onClick={() => setDemoFilter('new')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            demoFilter === 'new' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-blue-600">{newDemos.length}</div>
          <div className="text-sm text-gray-500">New Demos</div>
        </div>
        <div 
          onClick={() => setDemoFilter('expired')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            demoFilter === 'expired' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-red-600">{expiredDemos.length}</div>
          <div className="text-sm text-gray-500">Trial Over</div>
        </div>
      </div>

      {/* Demo Lists based on filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {demoFilter === 'active' && 'Active Demos'}
          {demoFilter === 'new' && 'New Demos (Last 24 hours)'}
          {demoFilter === 'expired' && 'Trial Over - Follow-up Required'}
        </h3>
        <div className="space-y-4">
          {(() => {
            let leadsToShow = [];
            if (demoFilter === 'active') leadsToShow = activeDemos;
            else if (demoFilter === 'new') leadsToShow = newDemos;
            else if (demoFilter === 'expired') leadsToShow = expiredDemos;
            else leadsToShow = demoLeads;
            
            return leadsToShow.map((lead) => {
            const daysRemaining = lead.demoEndDate ? getDaysRemaining(lead.demoEndDate) : 0;
            return (
              <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(daysRemaining)}`}>
                      {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days left`}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{lead.demoType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>Start: {lead.demoStartDate ? new Date(lead.demoStartDate).toLocaleDateString() : 'N/A'}</div>
                  <div>End: {lead.demoEndDate ? new Date(lead.demoEndDate).toLocaleDateString() : 'N/A'}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDemoStatusUpdate(lead, 'interested')}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span>Interested</span>
                  </button>
                  <button
                    onClick={() => handleDemoStatusUpdate(lead, 'not_responded')}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>No Response</span>
                  </button>
                  <button
                    onClick={() => handleDemoStatusUpdate(lead, 'follow_up')}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Clock size={16} />
                    <span>Follow-up</span>
                  </button>
                </div>
              </div>
            );
          })})()}
        </div>
      </div>

      {/* Expired Demos Alert - only show when not filtering expired */}
      {expiredDemos.length > 0 && demoFilter !== 'expired' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="text-red-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-red-800">Expired Demos Alert</h3>
          </div>
          <div className="space-y-2">
            {expiredDemos.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{lead.name}</p>
                  <p className="text-sm text-gray-500">Demo expired on {lead.demoEndDate ? new Date(lead.demoEndDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <button
                  onClick={() => handleDemoStatusUpdate(lead, 'follow_up')}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Follow-up
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md m-4">
            <h3 className="text-lg font-semibold mb-4">Assign Demo to {selectedLead?.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  value={demoForm.mobile}
                  onChange={(e) => setDemoForm({...demoForm, mobile: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo Type</label>
                <select
                  value={demoForm.demoType}
                  onChange={(e) => setDemoForm({...demoForm, demoType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Video">Video</option>
                  <option value="Live">Live</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={demoForm.startDate}
                  onChange={(e) => setDemoForm({...demoForm, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                <select
                  value={demoForm.duration}
                  onChange={(e) => setDemoForm({...demoForm, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitDemo}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Assign Demo
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPanel;