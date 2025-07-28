'use client';

import React, { useRef, KeyboardEvent } from 'react';
import { Send, Smile } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  isSending = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedMessage = value.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">

      {/* Input area */}
      <div className="p-4">
        <div className="flex items-center space-x-3">

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm max-h-[120px] overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px' }}
            />
            
            {/* Emoji button */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
              title="Add emoji"
            >
              <Smile size={16} />
            </button>
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || isSending || !value.trim()}
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10"
            title="Send message (Enter)"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="text-green-500 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}; 