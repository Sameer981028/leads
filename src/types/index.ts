export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  campaign: string;
  status: 'New' | 'Contacted' | 'Rejected' | 'Demo' | 'Integrated' | 'Paid' | 'Unpaid';
  dateAdded: string;
  lastResponse?: string;
  remarks?: string;
  demoType?: 'Video' | 'Live' | 'Trial';
  demoStartDate?: string;
  demoEndDate?: string;
  integrationStatus?: 'Started' | 'Completed';
  paymentStatus?: 'Paid' | 'Not Paid';
  paymentAmount?: number;
  paymentDate?: string;
  integrationStartDate?: string;
  integrationEndDate?: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  type: 'lead_assigned' | 'demo_expiry' | 'follow_up' | 'integration_deadline' | 'payment_reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  lead_id?: string;
  user_id?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  integrationStarted: number;
  integrationCompleted: number;
  paymentsReceived: number;
  paymentsPending: number;
  activedemos: number;
  funnelData: {
    leads: number;
    demos: number;
    integrations: number;
    payments: number;
  };
}