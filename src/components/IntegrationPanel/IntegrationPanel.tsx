import React, { useState } from 'react';
import { CreditCard, DollarSign, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Lead } from '../../types';

interface IntegrationPanelProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  initialFilter?: { paymentStatus?: string; integrationStatus?: string };
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ leads, onUpdateLead, initialFilter }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterType, setFilterType] = useState(initialFilter?.paymentStatus || initialFilter?.integrationStatus || 'all');

  // Apply initial filter
  React.useEffect(() => {
    if (initialFilter?.paymentStatus) {
      setFilterType(initialFilter.paymentStatus);
    } else if (initialFilter?.integrationStatus) {
      setFilterType(initialFilter.integrationStatus);
    }
  }, [initialFilter]);

  const integrationLeads = leads.filter(lead => 
    lead.status === 'Integrated' || lead.integrationStatus
  );

  const filteredLeads = integrationLeads.filter(lead => {
    if (filterType === 'all') return true;
    if (filterType === 'Paid') return lead.paymentStatus === 'Paid';
    if (filterType === 'Not Paid') return lead.paymentStatus === 'Not Paid';
    if (filterType === 'Started') return lead.integrationStatus === 'Started';
    if (filterType === 'Completed') return lead.integrationStatus === 'Completed';
    return true;
  });

  const handleEditIntegration = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleUpdateIntegration = (updatedData: Partial<Lead>) => {
    if (selectedLead) {
      const updatedLead = { ...selectedLead, ...updatedData };
      onUpdateLead(updatedLead);
      setShowEditModal(false);
      setSelectedLead(null);
    }
  };

  const getIntegrationStatusColor = (status?: string) => {
    switch (status) {
      case 'Started': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Not Paid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = integrationLeads.reduce((sum, lead) => 
    sum + (lead.paymentStatus === 'Paid' ? (lead.paymentAmount || 0) : 0), 0
  );

  const pendingRevenue = integrationLeads.reduce((sum, lead) => 
    sum + (lead.paymentStatus === 'Not Paid' ? (lead.paymentAmount || 0) : 0), 0
  );
  
  const paidLeads = integrationLeads.filter(l => l.paymentStatus === 'Paid').length;
  const unpaidLeads = integrationLeads.filter(l => l.paymentStatus === 'Not Paid').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Integration & Payment Panel</h2>
        <div className="text-sm text-gray-500">
          {integrationLeads.length} integrations
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setFilterType('Started')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            filterType === 'Started' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-blue-600">
            {integrationLeads.filter(l => l.integrationStatus === 'Started').length}
          </div>
          <div className="text-sm text-gray-500">Integration Started</div>
        </div>
        <div 
          onClick={() => setFilterType('Completed')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            filterType === 'Completed' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-green-600">
            {integrationLeads.filter(l => l.integrationStatus === 'Completed').length}
          </div>
          <div className="text-sm text-gray-500">Integration Completed</div>
        </div>
        <div 
          onClick={() => setFilterType('Paid')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            filterType === 'Paid' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-emerald-600">{paidLeads}</div>
          <div className="text-sm text-gray-500">Total Paid</div>
        </div>
        <div 
          onClick={() => setFilterType('Not Paid')}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50 cursor-pointer hover:shadow-xl transition-all ${
            filterType === 'Not Paid' ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="text-2xl font-bold text-amber-600">{unpaidLeads}</div>
          <div className="text-sm text-gray-500">Total Unpaid</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500">Revenue Received</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-amber-600">
            ₹{pendingRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500">Pending Payment</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Integrations</option>
            <option value="Started">Integration Started</option>
            <option value="Completed">Integration Completed</option>
            <option value="Paid">Payment Received</option>
            <option value="Not Paid">Payment Pending</option>
          </select>
          <div className="text-sm text-gray-500">
            Showing {filteredLeads.length} of {integrationLeads.length} records
          </div>
        </div>
      </div>

      {/* Integration List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {filterType === 'all' ? 'All Integration Records' : 
           filterType === 'Paid' ? 'Paid Customers' :
           filterType === 'Not Paid' ? 'Pending Payments' :
           filterType === 'Started' ? 'Integration in Progress' :
           filterType === 'Completed' ? 'Completed Integrations' : 'Integration Status'}
        </h3>
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>
                <button
                  onClick={() => handleEditIntegration(lead)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Integration Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getIntegrationStatusColor(lead.integrationStatus)}`}>
                      {lead.integrationStatus || 'Not Started'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(lead.paymentStatus)}`}>
                      {lead.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium">₹{lead.paymentAmount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Date:</span>
                    <span className="text-sm">{lead.paymentDate ? new Date(lead.paymentDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Integration Period:</span>
                  <br />
                  {lead.integrationStartDate ? new Date(lead.integrationStartDate).toLocaleDateString() : 'N/A'} - 
                  {lead.integrationEndDate ? new Date(lead.integrationEndDate).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Feedback:</span>
                  <br />
                  {lead.feedback || 'No feedback provided'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Collection Report */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Collection Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Client</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Integration</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100">
                  <td className="py-2">{lead.name}</td>
                  <td className="py-2">₹{lead.paymentAmount || 0}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(lead.paymentStatus)}`}>
                      {lead.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="py-2">{lead.paymentDate ? new Date(lead.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getIntegrationStatusColor(lead.integrationStatus)}`}>
                      {lead.integrationStatus || 'Not Started'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedLead && (
        <IntegrationEditModal
          lead={selectedLead}
          onSave={handleUpdateIntegration}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

const IntegrationEditModal: React.FC<{
  lead: Lead;
  onSave: (data: Partial<Lead>) => void;
  onClose: () => void;
}> = ({ lead, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    integrationStatus: lead.integrationStatus || 'Started',
    paymentStatus: lead.paymentStatus || 'Not Paid',
    paymentAmount: lead.paymentAmount || 0,
    paymentDate: lead.paymentDate ? lead.paymentDate.split('T')[0] : '',
    integrationStartDate: lead.integrationStartDate ? lead.integrationStartDate.split('T')[0] : '',
    integrationEndDate: lead.integrationEndDate ? lead.integrationEndDate.split('T')[0] : '',
    feedback: lead.feedback || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Integration & Payment - {lead.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Integration Status</label>
              <select
                value={formData.integrationStatus}
                onChange={(e) => setFormData({...formData, integrationStatus: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Started">Started</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({...formData, paymentStatus: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
              <input
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({...formData, paymentAmount: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Integration Start Date</label>
              <input
                type="date"
                value={formData.integrationStartDate}
                onChange={(e) => setFormData({...formData, integrationStartDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Integration End Date</label>
              <input
                type="date"
                value={formData.integrationEndDate}
                onChange={(e) => setFormData({...formData, integrationEndDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback / Notes</label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData({...formData, feedback: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Post-integration feedback or notes..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationPanel;