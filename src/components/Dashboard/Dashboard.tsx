import React from 'react';
import { TrendingUp, Users, PlayCircle, CreditCard, DollarSign, Target } from 'lucide-react';
import { DashboardMetrics } from '../../types';

interface DashboardProps {
  metrics: DashboardMetrics;
  onCardClick: (cardType: string, filter?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, onCardClick }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      clickAction: () => onCardClick('master', { status: 'All' })
    },
    {
      title: 'Integration Started',
      value: metrics.integrationStarted,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      clickAction: () => onCardClick('integration', { integrationStatus: 'Started' })
    },
    {
      title: 'Integration Completed',
      value: metrics.integrationCompleted,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      clickAction: () => onCardClick('integration', { integrationStatus: 'Completed' })
    },
    {
      title: 'Payments Received',
      value: metrics.paymentsReceived,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600',
      clickAction: () => onCardClick('integration', { paymentStatus: 'Paid' })
    },
    {
      title: 'Payments Pending',
      value: metrics.paymentsPending,
      icon: CreditCard,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      clickAction: () => onCardClick('integration', { paymentStatus: 'Not Paid' })
    },
    {
      title: 'Active Demos',
      value: metrics.activedemos,
      icon: PlayCircle,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      clickAction: () => onCardClick('demo', { demoStatus: 'active' })
    },
  ];

  const funnelSteps = [
    { label: 'Leads', value: metrics.funnelData.leads, color: 'bg-blue-500' },
    { label: 'Demos', value: metrics.funnelData.demos, color: 'bg-purple-500' },
    { label: 'Integrations', value: metrics.funnelData.integrations, color: 'bg-green-500' },
    { label: 'Payments', value: metrics.funnelData.payments, color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              onClick={card.clickAction}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${card.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Funnel Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {funnelSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`${step.color} h-24 rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                <span className="text-2xl font-bold text-white">{step.value}</span>
              </div>
              <p className="font-medium text-gray-700">{step.label}</p>
              {index < funnelSteps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Conversion Rates */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Lead to Demo</p>
            <p className="text-xl font-bold text-blue-600">
              {metrics.funnelData.leads > 0 ? Math.round((metrics.funnelData.demos / metrics.funnelData.leads) * 100) : 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Demo to Integration</p>
            <p className="text-xl font-bold text-purple-600">
              {metrics.funnelData.demos > 0 ? Math.round((metrics.funnelData.integrations / metrics.funnelData.demos) * 100) : 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Integration to Payment</p>
            <p className="text-xl font-bold text-green-600">
              {metrics.funnelData.integrations > 0 ? Math.round((metrics.funnelData.payments / metrics.funnelData.integrations) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;