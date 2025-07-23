import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import LeadUpload from './components/LeadUpload/LeadUpload';
import LeadMaster from './components/LeadMaster/LeadMaster';
import CallingPanel from './components/CallingPanel/CallingPanel';
import DemoPanel from './components/DemoPanel/DemoPanel';
import IntegrationPanel from './components/IntegrationPanel/IntegrationPanel';
import Reports from './components/Reports/Reports';
import Notifications from './components/Notifications/Notifications';
import { Lead, Notification, DashboardMetrics } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabFilters, setTabFilters] = useState<Record<string, any>>({});
  
  // Local state management - data will be handled by PHP backend
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      source: 'Website',
      campaign: 'Summer Sale',
      status: 'New',
      dateAdded: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      source: 'Social Media',
      campaign: 'Winter Campaign',
      status: 'Demo',
      dateAdded: '2024-01-14T14:30:00Z',
      demoType: 'Video',
      demoStartDate: '2024-01-16T09:00:00Z',
      demoEndDate: '2024-01-23T09:00:00Z'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      source: 'Referral',
      campaign: 'Spring Launch',
      status: 'Integrated',
      dateAdded: '2024-01-13T11:15:00Z',
      integrationStatus: 'Completed',
      paymentStatus: 'Paid',
      paymentAmount: 5000,
      paymentDate: '2024-01-20T12:00:00Z'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'lead_assigned',
      title: 'New Lead Assigned',
      message: 'John Doe has been assigned to you for follow-up',
      timestamp: '2024-01-15T10:00:00Z',
      read: false
    },
    {
      id: '2',
      type: 'demo_expiry',
      title: 'Demo Expiring Soon',
      message: 'Jane Smith\'s demo expires in 2 days',
      timestamp: '2024-01-14T15:00:00Z',
      read: false
    },
    {
      id: '3',
      type: 'payment_reminder',
      title: 'Payment Received',
      message: 'Bob Johnson has completed payment of ₹5,000',
      timestamp: '2024-01-13T16:00:00Z',
      read: true
    }
  ]);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    integrationStarted: 0,
    integrationCompleted: 0,
    paymentsReceived: 0,
    paymentsPending: 0,
    activedemos: 0,
    funnelData: {
      leads: 0,
      demos: 0,
      integrations: 0,
      payments: 0,
    },
  });

  // Calculate metrics from current leads data
  useEffect(() => {
    const totalLeads = leads.length;
    const integrationStarted = leads.filter(l => l.integrationStatus === 'Started').length;
    const integrationCompleted = leads.filter(l => l.integrationStatus === 'Completed').length;
    const paymentsReceived = leads.filter(l => l.paymentStatus === 'Paid').length;
    const paymentsPending = leads.filter(l => l.paymentStatus === 'Not Paid').length;
    const activedemos = leads.filter(l => l.demoType && l.demoEndDate && new Date(l.demoEndDate) > new Date()).length;

    setMetrics({
      totalLeads,
      integrationStarted,
      integrationCompleted,
      paymentsReceived,
      paymentsPending,
      activedemos,
      funnelData: {
        leads: totalLeads,
        demos: leads.filter(l => l.status === 'Demo' || l.demoType).length,
        integrations: leads.filter(l => l.status === 'Integrated' || l.integrationStatus).length,
        payments: paymentsReceived
      }
    });
  }, [leads]);

  const handleUpload = (uploadedLeads: Lead[]) => {
    // Check for duplicates based on phone
    const existingPhones = new Set(leads.map(lead => lead.phone));
    const newLeads = uploadedLeads.filter(lead => !existingPhones.has(lead.phone));
    
    if (newLeads.length > 0) {
      setLeads(prev => [...prev, ...newLeads]);
      
      // Add notification for new leads
      const newNotification: Notification = {
        id: `upload-${Date.now()}`,
        type: 'lead_assigned',
        title: 'New Leads Uploaded',
        message: `${newLeads.length} new leads have been imported successfully`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleAddSingleLead = (newLead: Lead) => {
    // Check for duplicate phone number
    const existingLead = leads.find(lead => lead.phone === newLead.phone);
    
    if (!existingLead) {
      setLeads(prev => [...prev, newLead]);
      
      // Add notification for new lead
      const newNotification: Notification = {
        id: `single-lead-${Date.now()}`,
        type: 'lead_assigned',
        title: 'New Lead Added',
        message: `${newLead.name} has been added manually`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    
    // Add notification for significant status changes
    const statusChangeNotifications = ['Demo', 'Integrated', 'Rejected', 'Paid'];
    if (statusChangeNotifications.includes(updatedLead.status)) {
      const newNotification: Notification = {
        id: `status-${Date.now()}`,
        type: updatedLead.status === 'Demo' ? 'demo_expiry' : 
              updatedLead.status === 'Integrated' ? 'integration_deadline' :
              updatedLead.status === 'Paid' ? 'payment_reminder' : 'follow_up',
        title: `Lead Status Updated`,
        message: `${updatedLead.name} status changed to ${updatedLead.status}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const handleMarkAsRead = (notification: Notification) => {
    setNotifications(prev => prev.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Auto-generate demo expiry notifications
  useEffect(() => {
    const checkDemoExpiry = () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      leads.forEach(lead => {
        if (lead.demoEndDate && lead.status === 'Demo') {
          const demoEnd = new Date(lead.demoEndDate);
          
          // Check if demo expires tomorrow and no notification exists
          if (demoEnd <= tomorrow && demoEnd > now) {
            const existingNotification = notifications.find(n => 
              n.type === 'demo_expiry' && n.message.includes(lead.name) && !n.read
            );
            
            if (!existingNotification) {
              const newNotification: Notification = {
                id: `demo-expiry-${lead.id}-${Date.now()}`,
                type: 'demo_expiry',
                title: 'Demo Expiring Soon',
                message: `${lead.name}'s demo expires on ${demoEnd.toLocaleDateString()}`,
                timestamp: new Date().toISOString(),
                read: false
              };
              
              setNotifications(prev => [newNotification, ...prev]);
            }
          }
        }
      });
    };
    
    // Check on component mount and every hour
    checkDemoExpiry();
    const interval = setInterval(checkDemoExpiry, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [leads, notifications]);

  const handleCardClick = (targetTab: string, filter: any) => {
    setTabFilters({ [targetTab]: filter });
    setActiveTab(targetTab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard metrics={metrics} onCardClick={handleCardClick} />;
      case 'upload':
        return <LeadUpload onUpload={handleUpload} onAddSingleLead={handleAddSingleLead} />;
      case 'master':
        return <LeadMaster 
          leads={leads} 
          onUpdateLead={handleUpdateLead} 
          onDeleteLead={handleDeleteLead}
          initialFilter={tabFilters.master}
        />;
      case 'calling':
        return <CallingPanel 
          leads={leads} 
          onUpdateLead={handleUpdateLead}
          initialFilter={tabFilters.calling}
        />;
      case 'demo':
        return <DemoPanel 
          leads={leads} 
          onUpdateLead={handleUpdateLead}
          initialFilter={tabFilters.demo}
        />;
      case 'integration':
        return <IntegrationPanel 
          leads={leads} 
          onUpdateLead={handleUpdateLead}
          initialFilter={tabFilters.integration}
        />;
      case 'reports':
        return <Reports leads={leads} />;
      case 'notifications':
        return <Notifications 
          notifications={notifications} 
          onMarkAsRead={handleMarkAsRead} 
          onDeleteNotification={handleDeleteNotification} 
        />;
      default:
        return <Dashboard metrics={metrics} onCardClick={handleCardClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="lg:ml-64 transition-all duration-300">
        <main className="min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;