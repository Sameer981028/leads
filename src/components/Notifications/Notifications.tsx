import React, { useState } from 'react';
import { Bell, Clock, AlertTriangle, CheckCircle, X, User, Calendar, CreditCard } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notification: Notification) => void;
  onDeleteNotification: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkAsRead, onDeleteNotification }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lead_assigned': return <User className="text-blue-500" size={20} />;
      case 'demo_expiry': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'follow_up': return <Clock className="text-yellow-500" size={20} />;
      case 'integration_deadline': return <Calendar className="text-purple-500" size={20} />;
      case 'payment_reminder': return <CreditCard className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'lead_assigned': return 'border-l-blue-500';
      case 'demo_expiry': return 'border-l-orange-500';
      case 'follow_up': return 'border-l-yellow-500';
      case 'integration_deadline': return 'border-l-purple-500';
      case 'payment_reminder': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {notifications.length} total notifications
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('lead_assigned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'lead_assigned' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lead Assigned
          </button>
          <button
            onClick={() => setFilter('demo_expiry')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'demo_expiry' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Demo Expiry
          </button>
          <button
            onClick={() => setFilter('follow_up')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'follow_up' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Follow-up
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteNotification(notification.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-blue-600">
            {notifications.filter(n => n.type === 'lead_assigned').length}
          </div>
          <div className="text-sm text-gray-500">Lead Assigned</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-orange-600">
            {notifications.filter(n => n.type === 'demo_expiry').length}
          </div>
          <div className="text-sm text-gray-500">Demo Expiry</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-yellow-600">
            {notifications.filter(n => n.type === 'follow_up').length}
          </div>
          <div className="text-sm text-gray-500">Follow-up Due</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg border border-gray-200/50">
          <div className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.type === 'payment_reminder').length}
          </div>
          <div className="text-sm text-gray-500">Payment Reminders</div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;