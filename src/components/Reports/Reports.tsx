import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { Lead } from '../../types';

interface ReportsProps {
  leads: Lead[];
}

const Reports: React.FC<ReportsProps> = ({ leads }) => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('funnel');

  const filteredLeads = leads.filter(lead => {
    const leadDate = new Date(lead.dateAdded);
    const daysAgo = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    return leadDate >= daysAgo;
  });

  const funnelData = {
    contacted: filteredLeads.filter(l => l.status !== 'New').length,
    demo: filteredLeads.filter(l => l.status === 'Demo' || l.demoType).length,
    integration: filteredLeads.filter(l => l.status === 'Integrated' || l.integrationStatus).length,
    paid: filteredLeads.filter(l => l.paymentStatus === 'Paid').length
  };

  const conversionRates = {
    leadToDemo: filteredLeads.length > 0 ? (funnelData.demo / filteredLeads.length * 100) : 0,
    demoToIntegration: funnelData.demo > 0 ? (funnelData.integration / funnelData.demo * 100) : 0,
    integrationToPayment: funnelData.integration > 0 ? (funnelData.paid / funnelData.integration * 100) : 0
  };

  const sourceAnalysis = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const generateReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Leads', filteredLeads.length],
      ['Contacted', funnelData.contacted],
      ['Demos', funnelData.demo],
      ['Integrations', funnelData.integration],
      ['Paid', funnelData.paid],
      ['Lead to Demo Rate', `${conversionRates.leadToDemo.toFixed(1)}%`],
      ['Demo to Integration Rate', `${conversionRates.demoToIntegration.toFixed(1)}%`],
      ['Integration to Payment Rate', `${conversionRates.integrationToPayment.toFixed(1)}%`]
    ];

    const csv = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports & Analytics</h2>
        <button
          onClick={generateReport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="funnel">Lead Funnel</option>
              <option value="source">Source Analysis</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lead Funnel Report */}
      {reportType === 'funnel' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Lead Funnel Analysis</h3>
          
          {/* Funnel Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-blue-500 h-32 rounded-lg flex items-center justify-center mb-3 relative">
                <span className="text-2xl font-bold text-white">{filteredLeads.length}</span>
              </div>
              <p className="font-medium text-gray-700">Total Leads</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 h-24 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">{funnelData.demo}</span>
              </div>
              <p className="font-medium text-gray-700">Demos</p>
              <p className="text-sm text-gray-500">{conversionRates.leadToDemo.toFixed(1)}% conversion</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 h-20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">{funnelData.integration}</span>
              </div>
              <p className="font-medium text-gray-700">Integrations</p>
              <p className="text-sm text-gray-500">{conversionRates.demoToIntegration.toFixed(1)}% conversion</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-500 h-16 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">{funnelData.paid}</span>
              </div>
              <p className="font-medium text-gray-700">Payments</p>
              <p className="text-sm text-gray-500">{conversionRates.integrationToPayment.toFixed(1)}% conversion</p>
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lead to Demo</p>
                  <p className="text-2xl font-bold text-blue-600">{conversionRates.leadToDemo.toFixed(1)}%</p>
                </div>
                <TrendingUp className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Demo to Integration</p>
                  <p className="text-2xl font-bold text-purple-600">{conversionRates.demoToIntegration.toFixed(1)}%</p>
                </div>
                <BarChart3 className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Integration to Payment</p>
                  <p className="text-2xl font-bold text-green-600">{conversionRates.integrationToPayment.toFixed(1)}%</p>
                </div>
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Analysis */}
      {reportType === 'source' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Lead Source Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Source Distribution</h4>
              <div className="space-y-3">
                {Object.entries(sourceAnalysis).map(([source, count]) => {
                  const percentage = (count / leads.length * 100).toFixed(1);
                  return (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Source Performance</h4>
              <div className="space-y-3">
                {Object.entries(sourceAnalysis).map(([source, count]) => {
                  const sourceLeads = leads.filter(l => l.source === source);
                  const conversions = sourceLeads.filter(l => l.status === 'Integrated').length;
                  const conversionRate = count > 0 ? (conversions / count * 100).toFixed(1) : '0.0';
                  
                  return (
                    <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{source}</p>
                        <p className="text-sm text-gray-500">{count} leads</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{conversionRate}%</p>
                        <p className="text-sm text-gray-500">{conversions} conversions</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Report */}
      {reportType === 'performance' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Demos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leads.filter(l => l.demoType && l.demoEndDate && new Date(l.demoEndDate) > new Date()).length}
                  </p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired Demos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {leads.filter(l => l.demoEndDate && new Date(l.demoEndDate) < new Date()).length}
                  </p>
                </div>
                <Calendar className="text-red-500" size={24} />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{leads.reduce((sum, l) => sum + (l.paymentStatus === 'Paid' ? (l.paymentAmount || 0) : 0), 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drop-off Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Drop-off Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Lead Status Distribution</h4>
            <div className="space-y-2">
              {['New', 'Contacted', 'Demo', 'Integrated', 'Rejected'].map(status => {
                const count = leads.filter(l => l.status === status).length;
                const percentage = leads.length > 0 ? (count / leads.length * 100).toFixed(1) : '0';
                return (
                  <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{status}</span>
                    <span className="text-sm font-medium">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Common Drop-off Points</h4>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800">Demo Expiry</p>
                <p className="text-sm text-yellow-600">
                  {leads.filter(l => l.demoEndDate && new Date(l.demoEndDate) < new Date()).length} leads
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-medium text-red-800">Rejected Leads</p>
                <p className="text-sm text-red-600">
                  {leads.filter(l => l.status === 'Rejected').length} leads
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">No Response</p>
                <p className="text-sm text-blue-600">
                  {leads.filter(l => l.status === 'New').length} leads not contacted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;