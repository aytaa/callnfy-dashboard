import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentToken } from '../slices/authSlice';

const SocketContext = createContext(null);

// WebSocket ready states
const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

// Configuration
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 10;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export function SocketProvider({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);

  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const listenersRef = useRef(new Map());

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Get WebSocket URL from environment
  const wsUrl = import.meta.env.VITE_NOTIFICATION_WS_URL;

  // Send message to WebSocket
  const send = useCallback((type, payload = {}) => {
    if (wsRef.current?.readyState === OPEN) {
      const message = JSON.stringify({ type, ...payload });
      wsRef.current.send(message);
      return true;
    }
    return false;
  }, []);

  // Add event listener
  const addEventListener = useCallback((type, callback) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    listenersRef.current.get(type).add(callback);

    // Return cleanup function
    return () => {
      listenersRef.current.get(type)?.delete(callback);
    };
  }, []);

  // Emit event to listeners
  const emitToListeners = useCallback((type, data) => {
    const callbacks = listenersRef.current.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for "${type}":`, error);
        }
      });
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatIntervalRef.current = setInterval(() => {
      send('ping');
    }, HEARTBEAT_INTERVAL);
  }, [send]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!wsUrl) {
      console.warn('WebSocket URL not configured (VITE_NOTIFICATION_WS_URL)');
      return;
    }

    if (!token) {
      console.warn('No auth token available for WebSocket');
      return;
    }

    // Don't create new connection if one exists and is connecting/open
    if (wsRef.current?.readyState === CONNECTING || wsRef.current?.readyState === OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        setConnectionError(null);

        // Authenticate immediately after connection
        send('auth', { token });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, ...data } = message;

          // Handle specific message types
          switch (type) {
            case 'connected':
              console.log('WebSocket authenticated:', data.userId);
              setIsConnected(true);
              startHeartbeat();
              emitToListeners('connected', data);
              break;

            case 'notification':
              emitToListeners('notification', data.data || data);
              break;

            case 'unreadCount':
              emitToListeners('unreadCount', data.count);
              break;

            case 'error':
              console.error('WebSocket error from server:', data.message);
              setConnectionError(data.message);
              emitToListeners('error', data);
              break;

            case 'pong':
              // Heartbeat response, no action needed
              break;

            default:
              // Emit any other message types to listeners
              emitToListeners(type, data);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
        emitToListeners('error', { message: 'Connection error' });
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        stopHeartbeat();
        emitToListeners('disconnected', { code: event.code, reason: event.reason });

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionError('Failed to connect');
    }
  }, [wsUrl, token, send, startHeartbeat, stopHeartbeat, emitToListeners]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, [stopHeartbeat]);

  // Connect when authenticated, disconnect when not
  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      listenersRef.current.clear();
    };
  }, [disconnect]);

  const value = {
    isConnected,
    connectionError,
    send,
    addEventListener,
    disconnect,
    reconnect: connect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;
