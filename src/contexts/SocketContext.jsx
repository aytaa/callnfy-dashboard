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

  // DEBUG: Log on every render to see state
  console.log('=== SocketContext Debug ===');
  console.log('SocketContext - wsUrl:', import.meta.env.VITE_NOTIFICATION_WS_URL);
  console.log('SocketContext - isAuthenticated:', isAuthenticated);
  console.log('SocketContext - token:', token ? 'exists (' + token.substring(0, 20) + '...)' : 'MISSING');

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
    console.log('=== WebSocket connect() called ===');
    console.log('connect() - wsUrl:', wsUrl);
    console.log('connect() - token:', token ? 'exists' : 'MISSING');
    console.log('connect() - current readyState:', wsRef.current?.readyState);

    if (!wsUrl) {
      console.error('❌ WebSocket URL not configured (VITE_NOTIFICATION_WS_URL)');
      return;
    }

    if (!token) {
      console.error('❌ No auth token available for WebSocket');
      return;
    }

    // Don't create new connection if one exists and is connecting/open
    if (wsRef.current?.readyState === CONNECTING || wsRef.current?.readyState === OPEN) {
      console.log('⏳ WebSocket already connecting or open, skipping');
      return;
    }

    try {
      console.log('🔌 Creating new WebSocket connection to:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully!');
        reconnectAttemptsRef.current = 0;
        setConnectionError(null);

        // Authenticate immediately after connection
        console.log('🔐 Sending auth message with token');
        send('auth', { token });
      };

      ws.onmessage = (event) => {
        try {
          console.log('📨 WebSocket message received:', event.data);
          const message = JSON.parse(event.data);
          const { type, ...data } = message;
          console.log('📨 Parsed message - type:', type, 'data:', data);

          // Handle specific message types
          switch (type) {
            case 'auth_success':
            case 'connected':
              console.log('WebSocket authenticated:', data.payload?.userId || data.userId);
              setIsConnected(true);
              startHeartbeat();
              emitToListeners('connected', data.payload || data);
              break;

            case 'notification':
              emitToListeners('notification', data.data || data);
              break;

            case 'unreadCount':
              emitToListeners('unreadCount', data.count);
              break;

            case 'auth_error':
              console.error('WebSocket auth failed:', data.payload?.message || data.message);
              setConnectionError(data.payload?.message || data.message || 'Authentication failed');
              emitToListeners('auth_error', data.payload || data);
              break;

            case 'error':
              console.error('WebSocket error from server:', data.payload?.message || data.message);
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
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        console.error('❌ Error details:', {
          type: error.type,
          target: error.target?.url,
          readyState: error.target?.readyState
        });
        setConnectionError('Connection error');
        emitToListeners('error', { message: 'Connection error' });
      };

      ws.onclose = (event) => {
        console.log('🔴 WebSocket closed');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason || '(no reason)');
        console.log('Was clean:', event.wasClean);
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
    console.log('=== SocketContext useEffect triggered ===');
    console.log('useEffect - isAuthenticated:', isAuthenticated);
    console.log('useEffect - token:', token ? 'exists' : 'MISSING');

    if (isAuthenticated && token) {
      console.log('✅ Conditions met, calling connect()');
      connect();
    } else {
      console.log('❌ Conditions not met, calling disconnect()');
      console.log('  - isAuthenticated:', isAuthenticated);
      console.log('  - token:', token ? 'exists' : 'MISSING');
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
