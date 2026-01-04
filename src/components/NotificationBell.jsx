import { useState, useRef, useEffect } from 'react';
import { Bell, Phone, Calendar, AlertTriangle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
} from '../slices/apiSlice/notificationApiSlice';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'call':
    case 'call_summary':
    case 'missed_call':
      return Phone;
    case 'appointment':
    case 'appointment_reminder':
    case 'new_appointment':
      return Calendar;
    case 'low_minutes':
    case 'usage_warning':
      return AlertTriangle;
    case 'billing':
    case 'payment':
      return CreditCard;
    default:
      return Bell;
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get unread count for badge (no polling - will use WebSocket later)
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();

  // Get recent notifications for dropdown (limit to 5)
  const { data: notificationsData } = useGetNotificationsQuery(
    { limit: 5, offset: 0 },
    { skip: !isOpen }
  );
  const notifications = notificationsData?.notifications || [];

  const [markAsRead] = useMarkAsReadMutation();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read && !notification.readAt) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#262626] transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-white/60" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1d] border border-[#303030] rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#303030]">
            <h3 className="font-medium text-white">Notifications</h3>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-white/20" />
                <p className="text-sm text-white/40">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = !notification.read && !notification.readAt;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 border-b border-[#303030] last:border-b-0 ${
                      isUnread ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm line-clamp-2 ${isUnread ? 'text-white font-medium' : 'text-white/70'}`}>
                        {notification.message || notification.title}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer - View All Link */}
          <div className="border-t border-[#303030]">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
