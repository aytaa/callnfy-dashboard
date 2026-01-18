import { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import NotificationItem from '../components/NotificationItem';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '../slices/apiSlice/notificationApiSlice';

export default function Notifications() {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    limit,
    offset: (page - 1) * limit,
    unreadOnly: filter === 'unread',
  }, {
    refetchOnMountOrArgChange: true,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.notifications || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

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

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Handle navigation based on notification type and data
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
              Stay updated with your calls, appointments, and more
            </p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || notifications.length === 0}
            className="text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            {isMarkingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black font-medium'
                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter('unread');
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'unread'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black font-medium'
                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            Unread
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-[#303030]">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-white/20 mb-3" />
              <p className="text-gray-500 dark:text-white/60 font-medium">No notifications yet</p>
              <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'Notifications will appear here when you receive them'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400 dark:text-white/40">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
