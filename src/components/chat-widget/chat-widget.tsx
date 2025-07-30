'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Users, Minimize2, LogOut, Wifi, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { AuthLoader } from './auth/AuthLoader';
import { AuthContainer } from './auth/AuthContainer';
import { ChatSidebar } from './chat-sidebar';
import { ChatThread } from './chat-thread';
import { ChatInput } from './chat-input';
import { MessagesSkeleton } from './messages-skeleton';
import type { Location, Thread, Message, ChatWidgetProps, SocketMessage } from './types';




export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
    const { user, loading: authLoading, logout } = useAuth();
    const searchParams = useSearchParams();
    const [isMinimized, setIsMinimized] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [threadsLoading, setThreadsLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedThread, setSelectedThread] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const token = localStorage.getItem('silicon-sign-chat-access-token');

    // Handle incoming socket messages
    const handleNewMessage = useCallback((socketMessage: SocketMessage) => {
        // Only process messages for the currently selected thread
        if (socketMessage.threadId !== selectedThread) {
            return;
        }

        const newMessage: Message = {
            id: socketMessage.id,
            content: socketMessage.text,
            sender: socketMessage.sender === 'USER' ? (user?.name || 'User') : 'Support',
            senderType: socketMessage.sender === 'USER' ? 'user' : 'agent',
            timestamp: new Date(socketMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: socketMessage.sender === 'USER' ? '👨‍💼' : '👩‍💻',
        };

        setMessages(prevMessages => {
            // Check if message already exists to prevent duplicates
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
                return prevMessages;
            }
            
            // Show a subtle toast for agent messages (from Slack)
            if (socketMessage.sender === 'AGENT') {
                toast.success('New message from support', {
                    duration: 2000,
                    position: 'top-right',
                });
            }
            
            return [...prevMessages, newMessage];
        });
    }, [selectedThread, user?.name]);

    // Handle socket errors
    const handleSocketError = useCallback((error: string) => {
        console.error('Socket error:', error);
        if (error.includes('Authentication')) {
            toast.error('Authentication failed. Please refresh and login again.');
        } else {
            toast.error(`Connection error: ${error}`);
        }
    }, []);

    // Initialize socket connection
    const {
        isConnected,
        isConnecting,
        error: socketError,
        currentThread,
        joinThread,
        leaveThread,
    } = useSocket({
        token,
        onNewMessage: handleNewMessage,
        onError: handleSocketError,
    });

    useEffect(() => {
      const folderId = searchParams.get('folderId');

      console.log('User:', user);
      console.log('Folder ID:', folderId);

      if (user && folderId) {
        const fetchLocations = async () => {
          try {
            setLocationsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/locations/${folderId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (data.success) {
              setLocations(data.data);
              if (data.data.length > 0) {
                setSelectedLocation(data.data[0].listId);
              }
            }
          } catch (error) {
            console.error('Failed to fetch locations:', error);
          } finally {
            setLocationsLoading(false);
          }
        };

        fetchLocations();
      }
    }, [user, searchParams, token]);

    const fetchThreads = async (listId: string) => {
        if (!token) return;
        setThreadsLoading(true);
        setThreads([]);
        setSelectedThread(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/threads/${listId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                const transformedThreads = data.data.map((thread: any) => ({
                    id: thread.id,
                    title: thread.name,
                    lastMessage: 'No messages yet', // Placeholder
                    timestamp: new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    userId: thread.userId,
                    listId: thread.listId,
                    folderId: thread.folderId,
                    slackThreadTs: thread.slackThreadTs,
                    createdAt: thread.createdAt,
                    updatedAt: thread.updatedAt,
                }));
                setThreads(transformedThreads);
                setSelectedThread(transformedThreads[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch threads:', error);
        } finally {
            setThreadsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedLocation) {
            fetchThreads(selectedLocation);
        }
    }, [selectedLocation, token]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedThread || !token) return;
            setMessagesLoading(true);
            setMessages([]);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages/${selectedThread}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    const fetchedMessages: Message[] = data.data.map((msg: any) => ({
                        id: msg.id,
                        content: msg.text,
                        sender: msg.sender === 'USER' ? (user?.name || 'User') : 'Support',
                        senderType: msg.sender === 'USER' ? 'user' : 'agent',
                        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        avatar: msg.sender === 'USER' ? '👨‍💼' : '👩‍💻',
                    }));
                    setMessages(fetchedMessages);
                } else {
                    console.error('Failed to fetch messages:', data.message);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        };

        if (selectedThread) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedThread, token, user?.name]);

    // Handle thread room management
    useEffect(() => {
        if (!isConnected) return;

        // Leave previous thread if we were in one
        if (currentThread && currentThread !== selectedThread) {
            leaveThread(currentThread);
        }

        // Join new thread if one is selected
        if (selectedThread && selectedThread !== currentThread) {
            joinThread(selectedThread);
        }
    }, [selectedThread, isConnected, currentThread, joinThread, leaveThread]);

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || !selectedThread || !token) {
            return;
        }

        setIsSending(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    threadId: selectedThread,
                    text: message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Message will be added via socket, so we just clear the input
                setNewMessage('');
                console.log('✅ Message sent successfully, waiting for socket update');
            } else {
                console.error('Failed to send message:', data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateThread = async (name: string) => {
        if (!selectedLocation || !token) return;
        const folderId = searchParams.get('folderId');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/threads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, listId: selectedLocation, folderId }),
            });
            const data = await response.json();
            if (data.success) {
                fetchThreads(selectedLocation); // Refresh threads
            } else {
                console.error('Failed to create thread:', data.message);
            }
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const handleUpdateThread = async (threadId: string, name: string) => {
        if (!selectedLocation || !token) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/threads/${threadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (data.success) {
                fetchThreads(selectedLocation); // Refresh threads
            } else {
                console.error('Failed to update thread:', data.message);
            }
        } catch (error) {
            console.error('Error updating thread:', error);
        }
    };

    const handleDeleteThread = async (threadId: string) => {
        if (!selectedLocation || !token) return;
        if (window.confirm('Are you sure you want to delete this thread?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/threads/${threadId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success) {
                    fetchThreads(selectedLocation); // Refresh threads
                    if (selectedThread === threadId) {
                        setSelectedThread(null);
                    }
                } else {
                    console.error('Failed to delete thread:', data.message);
                }
            } catch (error) {
                console.error('Error deleting thread:', error);
            }
        }
    };

    const renderContent = () => {
        if (authLoading) {
            return <AuthLoader />;
        }

        if (!user) {
            return <AuthContainer />;
        }

        return (
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar
                    locations={locations}
                    threads={threads}
                    threadsLoading={threadsLoading}
                    selectedLocation={selectedLocation}
                    selectedThread={selectedThread}
                    onLocationSelect={setSelectedLocation}
                    onThreadSelect={setSelectedThread}
                    onStartNewThread={handleCreateThread}
                    onUpdateThread={handleUpdateThread}
                    onDeleteThread={handleDeleteThread}
                />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {selectedThread ? (
                        <>
                            {messagesLoading ? (
                                <MessagesSkeleton />
                            ) : (
                                <ChatThread
                                    messages={messages}
                                    threadTitle={threads.find(t => t.id === selectedThread)?.title || 'Chat'}
                                />
                            )}
                            <ChatInput
                                value={newMessage}
                                onChange={setNewMessage}
                                onSend={handleSendMessage}
                                placeholder="Type your message..."
                                disabled={messagesLoading}
                                isSending={isSending}
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">Select a thread to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isMinimized) {
        return (
            <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
                >
                    <MessageSquare size={24} />
                </button>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[60vw] h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <MessageSquare size={20} />
                        <span className="font-semibold">Team Chat</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <div className="flex items-center space-x-1 text-blue-100">
                                    <Users size={14} />
                                    <span className="text-xs">{user.name}</span>
                                </div>
                                {/* Connection Status Indicator */}
                                <div className="flex items-center space-x-1 text-blue-100" title={
                                    isConnected ? 'Connected' : 
                                    isConnecting ? 'Connecting...' : 
                                    socketError ? `Error: ${socketError}` : 'Disconnected'
                                }>
                                    {isConnected ? (
                                        <Wifi size={14} className="text-green-300" />
                                    ) : (
                                        <WifiOff size={14} className="text-red-300" />
                                    )}
                                    <span className="text-xs">
                                        {isConnecting ? 'Connecting...' : isConnected ? 'Live' : 'Offline'}
                                    </span>
                                </div>
                                <button onClick={logout} className="cursor-pointer text-blue-100 hover:text-white transition-colors" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="cursor-pointer text-blue-100 hover:text-white transition-colors"
                        >
                            <Minimize2 size={16} />
                        </button>
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};