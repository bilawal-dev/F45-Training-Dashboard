'use client';

import React, { useEffect, useRef } from 'react';
import { Clock, User, Headphones } from 'lucide-react';
import { Message, ChatThreadProps } from './types';

export const ChatThread: React.FC<ChatThreadProps> = ({ messages, threadTitle }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{threadTitle}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">Start the conversation below</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isAgent = message.senderType === 'agent';
            const isFirstInGroup = index === 0 || messages[index - 1].senderType !== message.senderType;
            const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderType !== message.senderType;

            return (
              <div key={message.id} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex max-w-[75%] ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar - only show for first message in group */}
                  {isFirstInGroup && (
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isAgent 
                        ? 'bg-blue-100 text-blue-600 mr-3' 
                        : 'bg-gray-200 text-gray-600 ml-3'
                    }`}>
                      {isAgent ? <Headphones size={14} /> : <User size={14} />}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex flex-col ${!isFirstInGroup ? (isAgent ? 'ml-11' : 'mr-11') : ''}`}>
                    {/* Sender name - only show for first message in group */}
                    {isFirstInGroup && (
                      <div className={`text-xs text-gray-600 mb-1 ${isAgent ? 'text-left' : 'text-right'}`}>
                        {message.sender}
                      </div>
                    )}

                    {/* Message content */}
                    <div className={`px-4 py-2 rounded-lg ${
                      isAgent
                        ? 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-blue-600 text-white'
                    } ${
                      isFirstInGroup && isLastInGroup
                        ? 'rounded-lg'
                        : isFirstInGroup
                        ? isAgent ? 'rounded-tr-lg rounded-b-lg rounded-tl-sm' : 'rounded-tl-lg rounded-b-lg rounded-tr-sm'
                        : isLastInGroup
                        ? isAgent ? 'rounded-r-lg rounded-bl-lg rounded-tl-sm' : 'rounded-l-lg rounded-br-lg rounded-tr-sm'
                        : isAgent ? 'rounded-r-lg rounded-tl-sm' : 'rounded-l-lg rounded-tr-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {/* Timestamp - only show for last message in group */}
                    {isLastInGroup && (
                      <div className={`flex items-center mt-1 text-xs text-gray-400 ${
                        isAgent ? 'justify-start' : 'justify-end'
                      }`}>
                        <Clock size={10} className="mr-1" />
                        {message.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}; 