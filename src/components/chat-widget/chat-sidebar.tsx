'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Clock, MoreVertical, Edit, Trash } from 'lucide-react';
import { Thread, ChatSidebarProps } from './types';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  locations,
  threads,
  threadsLoading,
  selectedLocation,
  selectedThread,
  onLocationSelect,
  onThreadSelect,
  onStartNewThread,
  onUpdateThread,
  onDeleteThread,
}) => {
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadName, setNewThreadName] = useState('');
  
  // State for popover menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // State for inline editing
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingThreadName, setEditingThreadName] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateThread = () => {
    if (newThreadName.trim()) {
      onStartNewThread(newThreadName.trim());
      setNewThreadName('');
      setIsCreatingThread(false);
    }
  };

  const handleUpdateThread = (threadId: string) => {
    if (editingThreadName.trim()) {
      onUpdateThread(threadId, editingThreadName.trim());
      setEditingThreadId(null);
      setEditingThreadName('');
    }
  };

  const startEditing = (thread: Thread) => {
    setEditingThreadId(thread.id);
    setEditingThreadName(thread.title);
    setOpenMenuId(null); // Close the menu
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
            key={location.listId}
            onClick={() => onLocationSelect(location.listId)}
            className={`w-full p-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${selectedLocation === location.listId
              ? 'bg-blue-50 border-l-blue-500 text-blue-700'
              : 'border-l-transparent text-gray-700'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{location.name}</span>
              <span className="text-xs text-gray-500">{location.threadCount}</span>
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
                onClick={() => setIsCreatingThread(true)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md transition-colors"
                title="Start new thread"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isCreatingThread && (
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  value={newThreadName}
                  onChange={(e) => setNewThreadName(e.target.value)}
                  placeholder="New thread name..."
                  className="w-full px-2 py-1 border rounded"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateThread()}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button onClick={() => setIsCreatingThread(false)} className="cursor-pointer text-xs text-gray-600">Cancel</button>
                  <button onClick={handleCreateThread} className="cursor-pointer text-xs text-blue-600 font-semibold">Create</button>
                </div>
              </div>
            )}

            {threadsLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : threads.length === 0 && !isCreatingThread ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">No threads yet</div>
                <button
                  onClick={() => setIsCreatingThread(true)}
                  className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs mt-1"
                >
                  Start the first conversation
                </button>
              </div>
            ) : (
              threads.map((thread) => (
                <div key={thread.id} className="relative group">
                  {editingThreadId === thread.id ? (
                    <div className="p-3">
                      <input
                        type="text"
                        value={editingThreadName}
                        onChange={(e) => setEditingThreadName(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateThread(thread.id)}
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button onClick={() => setEditingThreadId(null)} className="cursor-pointer text-xs text-gray-600">Cancel</button>
                        <button onClick={() => handleUpdateThread(thread.id)} className="cursor-pointer text-xs text-blue-600 font-semibold">Save</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onThreadSelect(thread.id)}
                      className={`w-full p-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${selectedThread === thread.id
                        ? 'bg-blue-50 border-l-blue-500'
                        : 'border-l-transparent'
                        }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h5 className="text-sm font-medium truncate pr-2">
                            {thread.title}
                          </h5>
                        </div>
                        <p className="text-xs truncate">
                          {thread.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Clock size={10} />
                            <span className="text-xs">{thread.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {editingThreadId !== thread.id && (
                    <div className="absolute top-2 right-2">
                      <div className="relative" ref={openMenuId === thread.id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === thread.id ? null : thread.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === thread.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                            <button onClick={() => startEditing(thread)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              <Edit size={14} className="mr-2" /> Edit
                            </button>
                            <button onClick={() => { setOpenMenuId(null); onDeleteThread(thread.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                              <Trash size={14} className="mr-2" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}; 