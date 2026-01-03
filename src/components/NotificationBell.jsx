import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import clsx from 'clsx';
import NotificationItem from './NotificationItem';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../slices/apiSlice/notificationApiSlice';

export default function NotificationBell({ isCollapsed = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread count with polling
  const { data: unreadCount = 0 } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Fetch recent notifications for dropdown
  const { data: notificationsData } = useGetNotificationsQuery(
    { limit: 5, offset: 0 },
    {
      skip: !isOpen, // Only fetch when dropdown is open
      refetchOnFocus: true,
    }
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.notifications || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Navigate based on notification type
    // This can be extended to handle different notification types
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative flex items-center justify-center rounded-lg hover:bg-[#262626] transition-colors',
          isCollapsed ? 'w-full h-9' : 'w-9 h-9'
        )}
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-white/60" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-semibold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 w-80 bg-[#1a1a1d] border border-[#303030] rounded-lg shadow-lg overflow-hidden',
            isCollapsed ? 'left-full ml-2 top-0' : 'right-0'
          )}
        >
          {/* Header */}
          <div className="p-3 border-b border-[#303030] flex items-center justify-between">
            <span className="text-sm font-medium text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                {isMarkingAll ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                  onClick={handleNotificationClick}
                  compact
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-[#303030]">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm text-white/60 hover:text-white py-1.5 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
