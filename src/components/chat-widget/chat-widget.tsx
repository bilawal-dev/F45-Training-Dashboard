'use client';

import React, { useState } from 'react';
import { MessageSquare, Users, Minimize2, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLoader } from './auth/AuthLoader';
import { AuthContainer } from './auth/AuthContainer';
import { ChatSidebar } from './chat-sidebar';
import { ChatThread } from './chat-thread';
import { ChatInput } from './chat-input';
import type { Location, Thread, Message, ChatWidgetProps } from './types';

// Static demo data (will be replaced by API calls)
const DEMO_LOCATIONS: Location[] = [
    { id: 'miami-beach', name: 'Miami Beach', threadCount: 3  },
    { id: 'los-angeles', name: 'Los Angeles', threadCount: 5  },
    { id: 'forest-hills', name: 'Forest Hills', threadCount: 2  },
];

const DEMO_THREADS: Record<string, Thread[]> = {
    'miami-beach': [
        { id: 'thread-1', title: 'Equipment Issue - Treadmill #3', lastMessage: 'Thanks for the quick response!', timestamp: '2 min ago', unread: true, priority: 'high' },
        { id: 'thread-2', title: 'Staff Scheduling Question', lastMessage: 'Got it, will update the schedule.', timestamp: '1 hour ago', unread: true, priority: 'medium' },
    ],
    'los-angeles': [
        { id: 'thread-4', title: 'HVAC System Check', lastMessage: 'Technician will arrive at 2 PM.', timestamp: '30 min ago', unread: true, priority: 'high' },
    ]
};

const DEMO_MESSAGES: Record<string, Message[]> = {
    'thread-1': [
        { id: 'msg-1', content: 'Treadmill #3 is down.', sender: 'Mike', senderType: 'user', timestamp: '10:30 AM', avatar: '👨‍💼' },
        { id: 'msg-2', content: 'Maintenance is on the way.', sender: 'Sarah (Support)', senderType: 'agent', timestamp: '10:32 AM', avatar: '👩‍💻' },
    ]
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
    const { user, loading, logout } = useAuth();
    const [isMinimized, setIsMinimized] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<string | null>('miami-beach');
    const [selectedThread, setSelectedThread] = useState<string | null>('thread-1');
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
        setNewMessage('');
    };

    const handleStartNewThread = () => {
        console.log('Starting new thread for location:', selectedLocation);
    };

    const renderContent = () => {
        if (loading) {
            return <AuthLoader />;
        }

        if (!user) {
            return <AuthContainer />;
        }

        return (
            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar
                    locations={DEMO_LOCATIONS}
                    threads={selectedLocation ? DEMO_THREADS[selectedLocation] || [] : []}
                    selectedLocation={selectedLocation}
                    selectedThread={selectedThread}
                    onLocationSelect={setSelectedLocation}
                    onThreadSelect={setSelectedThread}
                    onStartNewThread={handleStartNewThread}
                />
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {selectedThread ? (
                        <>
                            <ChatThread
                                messages={DEMO_MESSAGES[selectedThread] || []}
                                threadTitle={DEMO_THREADS[selectedLocation!]?.find(t => t.id === selectedThread)?.title || 'Chat'}
                            />
                            <ChatInput
                                value={newMessage}
                                onChange={setNewMessage}
                                onSend={handleSendMessage}
                                placeholder="Type your message..."
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
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
                                <button onClick={logout} className="text-blue-100 hover:text-white transition-colors" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="text-blue-100 hover:text-white transition-colors"
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