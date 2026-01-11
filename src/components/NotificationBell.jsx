import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Phone, Calendar, AlertTriangle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  notificationApiSlice,
} from '../slices/apiSlice/notificationApiSlice';
import { useNotificationSocket } from '../hooks/useSocket';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  // Get unread count for badge
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();

  // Get recent notifications for dropdown (limit to 5)
  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery(
    { limit: 5, offset: 0 },
    { skip: !isOpen }
  );
  const notifications = notificationsData?.notifications || [];

  const [markAsRead] = useMarkAsReadMutation();

  // Handle new notification from WebSocket
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 NotificationBell: handleNewNotification called', notification);

    // Show toast for new notification
    const message = notification.message || notification.title || 'New notification';
    console.log('🔔 Showing toast:', message);
    toast(message, {
      icon: '🔔',
      duration: 4000,
    });

    // Optimistically update the unread count immediately
    console.log('🔔 Optimistically updating unread count');
    dispatch(
      notificationApiSlice.util.updateQueryData('getUnreadCount', undefined, (draft) => {
        console.log('🔔 Previous count:', draft);
        return (draft || 0) + 1;
      })
    );

    // Also invalidate to trigger refetch for accurate data
    console.log('🔔 Invalidating cache tags');
    dispatch(notificationApiSlice.util.invalidateTags([
      { type: 'Notification', id: 'LIST' },
      { type: 'Notification', id: 'COUNT' },
    ]));

    // Refetch notifications if dropdown is open
    if (isOpen) {
      console.log('🔔 Dropdown open, refetching notifications');
      refetchNotifications();
    }
  }, [dispatch, isOpen, refetchNotifications]);

  // Handle unread count update from WebSocket
  const handleUnreadCountUpdate = useCallback(() => {
    // Invalidate the count cache to trigger a refetch
    dispatch(notificationApiSlice.util.invalidateTags([
      { type: 'Notification', id: 'COUNT' },
    ]));
  }, [dispatch]);

  // Subscribe to WebSocket notification events
  useNotificationSocket(handleNewNotification, handleUnreadCountUpdate);

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
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-[#303030]">
            <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-white/20" />
                <p className="text-sm text-gray-400 dark:text-white/40">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = !notification.read && !notification.readAt;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-[#303030] last:border-b-0 ${
                      isUnread ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#262626] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gray-500 dark:text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm line-clamp-2 ${isUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-white/70'}`}>
                        {notification.message || notification.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
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
          <div className="border-t border-gray-200 dark:border-[#303030]">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
