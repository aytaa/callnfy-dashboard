import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../slices/authSlice';

const SocketContext = createContext(null);

// WebSocket ready states
const CONNECTING = 0;
const OPEN = 1;

// Configuration
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 10;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Debug logging - only in development
const DEBUG = import.meta.env.DEV && import.meta.env.VITE_WS_DEBUG === 'true';
const log = (...args) => DEBUG && console.log('[WebSocket]', ...args);
const logError = (...args) => console.error('[WebSocket]', ...args);

export function SocketProvider({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

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
          logError(`Error in listener for "${type}":`, error);
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
      logError('WebSocket URL not configured (VITE_NOTIFICATION_WS_URL)');
      return;
    }

    // Don't create new connection if one exists and is connecting/open
    if (wsRef.current?.readyState === CONNECTING || wsRef.current?.readyState === OPEN) {
      return;
    }

    try {
      log('Connecting to:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        log('Connected');
        reconnectAttemptsRef.current = 0;
        setConnectionError(null);

        // Auth is handled via httpOnly cookies sent with the WebSocket handshake
        send('auth', {});
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, ...data } = message;

          // Handle specific message types
          switch (type) {
            case 'auth_success':
            case 'connected':
              log('Authenticated');
              setIsConnected(true);
              startHeartbeat();
              emitToListeners('connected', data.payload || data);
              break;

            case 'notification':
              emitToListeners('notification', data.payload || data);
              break;

            case 'unreadCount':
              emitToListeners('unreadCount', data.payload?.count ?? data.count);
              break;

            case 'auth_error':
              logError('Auth failed:', data.payload?.message || data.message);
              setConnectionError(data.payload?.message || data.message || 'Authentication failed');
              emitToListeners('auth_error', data.payload || data);
              break;

            case 'error':
              logError('Server error:', data.payload?.message || data.message);
              setConnectionError(data.payload?.message || data.message);
              emitToListeners('error', data.payload || data);
              break;

            case 'pong':
              // Heartbeat response, no action needed
              break;

            default:
              // Emit any other message types to listeners
              emitToListeners(type, data);
          }
        } catch (error) {
          logError('Failed to parse message:', error);
        }
      };

      ws.onerror = () => {
        setConnectionError('Connection error');
        emitToListeners('error', { message: 'Connection error' });
      };

      ws.onclose = (event) => {
        log('Closed - code:', event.code);
        setIsConnected(false);
        stopHeartbeat();
        emitToListeners('disconnected', { code: event.code, reason: event.reason });

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          log(`Reconnecting (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        }
      };
    } catch (error) {
      logError('Failed to create WebSocket:', error);
      setConnectionError('Failed to connect');
    }
  }, [wsUrl, send, startHeartbeat, stopHeartbeat, emitToListeners]);

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
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

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
