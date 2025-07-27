'use client';

import React from 'react';
import { MapPin, Plus, Circle, Clock, AlertCircle } from 'lucide-react';
import { Location, Thread, ChatSidebarProps } from './types';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  locations,
  threads,
  selectedLocation,
  selectedThread,
  onLocationSelect,
  onThreadSelect,
  onStartNewThread
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="w-64 max-h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Locations Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
          <MapPin size={14} className="mr-2" />
          Locations
        </h3>
      </div>

      {/* Locations List */}
      <div className="flex-shrink-0">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location.id)}
            className={`w-full p-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${
              selectedLocation === location.id
                ? 'bg-blue-50 border-l-blue-500 text-blue-700'
                : 'border-l-transparent text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Circle size={8} className={`fill-current ${getStatusColor(location.status)}`} />
                <span className="text-sm font-medium truncate">{location.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {location.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {location.unreadCount}
                  </span>
                )}
                <span className="text-xs text-gray-500">{location.threadCount}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Threads Section */}
      {selectedLocation && (
        <>
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Threads</h4>
              <button
                onClick={onStartNewThread}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md transition-colors"
                title="Start new thread"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">No threads yet</div>
                <button
                  onClick={onStartNewThread}
                  className="text-blue-600 hover:text-blue-700 text-xs mt-1"
                >
                  Start the first conversation
                </button>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onThreadSelect(thread.id)}
                  className={`w-full p-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${
                    selectedThread === thread.id
                      ? 'bg-blue-50 border-l-blue-500'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h5 className={`text-sm font-medium truncate pr-2 ${
                        thread.unread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {thread.title}
                      </h5>
                      <div className="flex items-center space-x-1">
                        {thread.priority === 'high' && (
                          <AlertCircle size={12} className="text-red-500" />
                        )}
                        {thread.unread && (
                          <Circle size={8} className="fill-current text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-xs truncate ${
                      thread.unread ? 'text-gray-700 font-medium' : 'text-gray-500'
                    }`}>
                      {thread.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock size={10} />
                        <span className="text-xs">{thread.timestamp}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full border ${getPriorityColor(thread.priority)}`} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}; 