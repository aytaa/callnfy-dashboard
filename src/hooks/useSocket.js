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
    console.log('🔔 useNotificationSocket: Setting up notification listener');
    if (!onNotification) {
      console.log('🔔 useNotificationSocket: No onNotification callback provided');
      return;
    }

    // Wrap callback with debug logging
    const wrappedCallback = (data) => {
      console.log('🔔 useNotificationSocket: notification event received!', data);
      onNotification(data);
    };

    const cleanup = addEventListener('notification', wrappedCallback);
    console.log('🔔 useNotificationSocket: Listener registered');
    return () => {
      console.log('🔔 useNotificationSocket: Cleaning up notification listener');
      cleanup();
    };
  }, [addEventListener, onNotification]);

  // Subscribe to unread count events
  useEffect(() => {
    console.log('🔔 useNotificationSocket: Setting up unreadCount listener');
    if (!onUnreadCount) return;

    const wrappedCallback = (data) => {
      console.log('🔔 useNotificationSocket: unreadCount event received!', data);
      onUnreadCount(data);
    };

    const cleanup = addEventListener('unreadCount', wrappedCallback);
    return cleanup;
  }, [addEventListener, onUnreadCount]);

  // Request unread count when connected
  useEffect(() => {
    if (isConnected) {
      console.log('🔔 useNotificationSocket: Connected, requesting unread count');
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
