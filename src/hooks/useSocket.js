import { useEffect, useCallback } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

/**
 * Hook to access WebSocket functionality
 * @returns {Object} WebSocket methods and state
 */
export function useSocket() {
  const context = useSocketContext();
  return context;
}

/**
 * Hook to subscribe to WebSocket events
 * @param {string} eventType - Event type to listen for
 * @param {Function} callback - Callback function when event is received
 * @param {Array} deps - Dependencies array for callback
 */
export function useSocketEvent(eventType, callback, deps = []) {
  const { addEventListener } = useSocketContext();

  useEffect(() => {
    const cleanup = addEventListener(eventType, callback);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, addEventListener, ...deps]);
}

/**
 * Hook for notification-specific WebSocket events
 * @param {Function} onNotification - Callback when new notification arrives
 * @param {Function} onUnreadCount - Callback when unread count updates
 */
export function useNotificationSocket(onNotification, onUnreadCount) {
  const { addEventListener, send, isConnected } = useSocketContext();

  // Subscribe to notification events
  useEffect(() => {
    if (!onNotification) return;
    const cleanup = addEventListener('notification', onNotification);
    return cleanup;
  }, [addEventListener, onNotification]);

  // Subscribe to unread count events
  useEffect(() => {
    if (!onUnreadCount) return;
    const cleanup = addEventListener('unreadCount', onUnreadCount);
    return cleanup;
  }, [addEventListener, onUnreadCount]);

  // Request unread count when connected
  useEffect(() => {
    if (isConnected) {
      send('getUnreadCount');
    }
  }, [isConnected, send]);

  // Helper to mark notification as read via WebSocket
  const markAsRead = useCallback((notificationId) => {
    return send('markAsRead', { notificationId });
  }, [send]);

  // Helper to mark all as read via WebSocket
  const markAllAsRead = useCallback(() => {
    return send('markAllAsRead');
  }, [send]);

  return {
    isConnected,
    markAsRead,
    markAllAsRead,
  };
}

export default useSocket;
