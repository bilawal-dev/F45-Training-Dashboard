'use client';

import React, { useState } from 'react';
import { MessageSquare, Plus, Users, Clock, Send, Minimize2, Maximize2 } from 'lucide-react';
import { ChatThread } from './chat-thread';
import type { Location, Thread, Message, ChatWidgetProps } from './types';
import { ChatSidebar } from './chat-sidebar';
import { ChatInput } from './chat-input';

// Static demo data
const DEMO_LOCATIONS: Location[] = [
  {
    id: 'miami-beach',
    name: 'Miami Beach',
    threadCount: 3,
    unreadCount: 2,
    status: 'online'
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles', 
    threadCount: 5,
    unreadCount: 1,
    status: 'online'
  },
  {
    id: 'forest-hills',
    name: 'Forest Hills',
    threadCount: 2,
    unreadCount: 0,
    status: 'away'
  },
];

const DEMO_THREADS: Record<string, Thread[]> = {
  'miami-beach': [
    {
      id: 'thread-1',
      title: 'Equipment Issue - Treadmill #3',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '2 min ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 'thread-2', 
      title: 'Staff Scheduling Question',
      lastMessage: 'Got it, will update the schedule.',
      timestamp: '1 hour ago',
      unread: true,
      priority: 'medium'
    },
    {
      id: 'thread-3',
      title: 'New Member Orientation',
      lastMessage: 'All set for tomorrow.',
      timestamp: '3 hours ago',
      unread: false,
      priority: 'low'
    }
  ],
  'los-angeles': [
    {
      id: 'thread-4',
      title: 'HVAC System Check',
      lastMessage: 'Technician will arrive at 2 PM.',
      timestamp: '30 min ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 'thread-5',
      title: 'Marketing Campaign Review',
      lastMessage: 'Looks good, approved!',
      timestamp: '2 hours ago',
      unread: false,
      priority: 'medium'
    }
  ],
  'forest-hills': [
    {
      id: 'thread-6',
      title: 'Monthly Report Submission',
      lastMessage: 'Report uploaded successfully.',
      timestamp: '1 day ago',
      unread: false,
      priority: 'low'
    }
  ]
};

const DEMO_MESSAGES: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 'msg-1',
      content: 'Hi team, we have an issue with Treadmill #3. It keeps stopping mid-workout.',
      sender: 'Mike Johnson',
      senderType: 'user' as const,
      timestamp: '10:30 AM',
      avatar: '👨‍💼'
    },
    {
      id: 'msg-2',
      content: 'Hi Mike! I see the issue. Let me check with our maintenance team right away.',
      sender: 'Sarah (Support)',
      senderType: 'agent' as const,
      timestamp: '10:32 AM',
      avatar: '👩‍💻'
    },
    {
      id: 'msg-3',
      content: 'Our maintenance team will be there within the hour to fix the treadmill. We apologize for the inconvenience!',
      sender: 'Sarah (Support)',
      senderType: 'agent' as const,
      timestamp: '10:35 AM',
      avatar: '👩‍💻'
    },
    {
      id: 'msg-4',
      content: 'Thanks for the quick response!',
      sender: 'Mike Johnson',
      senderType: 'user' as const,
      timestamp: '10:37 AM',
      avatar: '👨‍💼'
    }
  ]
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>('miami-beach');
  const [selectedThread, setSelectedThread] = useState<string | null>('thread-1');
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // In the real implementation, this would send to Chatwoot API
    setNewMessage('');
  };

  const handleStartNewThread = () => {
    console.log('Starting new thread for location:', selectedLocation);
    // In the real implementation, this would create a new conversation via Chatwoot API
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <MessageSquare size={24} />
          <span className="bg-red-500 text-xs rounded-full px-2 py-1 ml-2">3</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[60vw] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare size={20} />
            <span className="font-semibold">Team Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-blue-100">
              <Users size={14} />
              <span className="text-xs">
                {selectedLocation ? DEMO_LOCATIONS.find(l => l.id === selectedLocation)?.name : 'Select Location'}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <ChatSidebar
            locations={DEMO_LOCATIONS}
            threads={selectedLocation ? DEMO_THREADS[selectedLocation] || [] : []}
            selectedLocation={selectedLocation}
            selectedThread={selectedThread}
            onLocationSelect={setSelectedLocation}
            onThreadSelect={setSelectedThread}
            onStartNewThread={handleStartNewThread}
          />

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {selectedThread ? (
              <>
                <ChatThread
                  messages={DEMO_MESSAGES[selectedThread] || []}
                  threadTitle={DEMO_THREADS[selectedLocation as string]?.find(t => t.id === selectedThread)?.title || 'Chat'}
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
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Select a location and thread to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 