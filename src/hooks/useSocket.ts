import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SocketMessage, SocketConnectionState } from '@/components/chat-widget/types';

interface UseSocketProps {
  token: string | null;
  onNewMessage: (message: SocketMessage) => void;
  onError?: (error: string) => void;
}

export const useSocket = ({ token, onNewMessage, onError }: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    currentThread: null,
  });

  // Initialize socket connection
  const connect = useCallback(() => {
    if (!token || socketRef.current?.connected) return;

    setConnectionState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        retries: 3,
      });

      // Connection event handlers
      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
        setConnectionState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          currentThread: null,
        }));
      });

      socket.on('connect_error', (error) => {
        console.error('🔥 Socket connection error:', error.message);
        const errorMessage = error.message.includes('Authentication error') 
          ? 'Authentication failed. Please login again.' 
          : 'Connection failed. Retrying...';
        
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: errorMessage,
        }));

        if (onError) {
          onError(errorMessage);
        }
      });

      // Message event handlers
      socket.on('newMessage', (messageData: SocketMessage) => {
        console.log('📩 New message received:', messageData);
        onNewMessage(messageData);
      });

      socket.on('threadJoined', ({ threadId }) => {
        console.log(`✅ Successfully joined thread: ${threadId}`);
        setConnectionState(prev => ({ ...prev, currentThread: threadId }));
      });

      socket.on('threadLeft', ({ threadId }) => {
        console.log(`✅ Successfully left thread: ${threadId}`);
        setConnectionState(prev => ({ 
          ...prev, 
          currentThread: prev.currentThread === threadId ? null : prev.currentThread 
        }));
      });

      socket.on('error', ({ message }) => {
        console.error('🔥 Socket error:', message);
        if (onError) {
          onError(message);
        }
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to initialize connection',
      }));
    }
  }, [token, onNewMessage, onError]);

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null,
      currentThread: null,
    });
  }, []);

  // Join a thread room
  const joinThread = useCallback((threadId: string) => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected, cannot join thread');
      return;
    }

    console.log(`🔄 Joining thread: ${threadId}`);
    socketRef.current.emit('joinThread', threadId);
  }, []);

  // Leave a thread room
  const leaveThread = useCallback((threadId: string) => {
    if (!socketRef.current?.connected) {
      console.warn('Socket not connected, cannot leave thread');
      return;
    }

    console.log(`🔄 Leaving thread: ${threadId}`);
    socketRef.current.emit('leaveThread', threadId);
  }, []);

  // Auto-connect when token is available
  useEffect(() => {
    if (token && !socketRef.current) {
      connect();
    } else if (!token && socketRef.current) {
      disconnect();
    }

    return () => {
      if (socketRef.current) {
        disconnect();
      }
    };
  }, [token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    ...connectionState,
    connect,
    disconnect,
    joinThread,
    leaveThread,
  };
}; 