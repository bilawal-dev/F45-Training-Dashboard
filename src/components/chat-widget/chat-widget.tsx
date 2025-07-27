'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Users, Minimize2, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLoader } from './auth/AuthLoader';
import { AuthContainer } from './auth/AuthContainer';
import { ChatSidebar } from './chat-sidebar';
import { ChatThread } from './chat-thread';
import { ChatInput } from './chat-input';
import type { Location, Thread, Message, ChatWidgetProps } from './types';


const DEMO_MESSAGES: Record<string, Message[]> = {
    'thread-1': [
        { id: 'msg-1', content: 'Treadmill #3 is down.', sender: 'Mike', senderType: 'user', timestamp: '10:30 AM', avatar: '👨‍💼' },
        { id: 'msg-2', content: 'Maintenance is on the way.', sender: 'Sarah (Support)', senderType: 'agent', timestamp: '10:32 AM', avatar: '👩‍💻' },
    ]
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
    const { user, loading: authLoading, logout } = useAuth();
    const searchParams = useSearchParams();
    const [isMinimized, setIsMinimized] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [threadsLoading, setThreadsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedThread, setSelectedThread] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const token = localStorage.getItem('silicon-sign-chat-access-token');

    useEffect(() => {
      const folderId = searchParams.get('folderId');

      console.log('User:', user);
      console.log('Folder ID:', folderId);

      if (user && folderId) {
        const fetchLocations = async () => {
          try {
            setLocationsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_BACKEND_URL}/api/chat/locations/${folderId}`, {
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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_BACKEND_URL}/api/chat/threads/${listId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
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

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
        setNewMessage('');
    };

    const handleCreateThread = async (name: string) => {
        if (!selectedLocation || !token) return;
        const folderId = searchParams.get('folderId');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_BACKEND_URL}/api/chat/threads`, {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_BACKEND_URL}/api/chat/threads/${threadId}`, {
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_BACKEND_URL}/api/chat/threads/${threadId}`, {
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
                            <ChatThread
                                messages={DEMO_MESSAGES[selectedThread] || []}
                                threadTitle={threads.find(t => t.id === selectedThread)?.title || 'Chat'}
                            />
                            <ChatInput
                                value={newMessage}
                                onChange={setNewMessage}
                                onSend={handleSendMessage}
                                placeholder="Type your message..."
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