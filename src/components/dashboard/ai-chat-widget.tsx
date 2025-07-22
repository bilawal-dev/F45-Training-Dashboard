'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, ArrowLeft, User } from 'lucide-react';
import { AI_RESPONSES } from '@/constants/dashboard-data';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'actions' | 'conversation'>('actions');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const actionButtons = [
    { id: 'project-status', text: '📊 Get project status summary' },
    { id: 'southeast-update', text: '🎯 Southeast region update' },
    { id: 'upcoming-deadlines', text: '⏰ Show upcoming deadlines' },
    { id: 'resource-allocation', text: '👥 Resource allocation analysis' },
    { id: 'issue-resolution', text: '🚨 Help resolve current issues' },
    { id: 'leave-message', text: '💬 Leave message with team' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleActionClick = (actionId: string) => {
    const response = AI_RESPONSES[actionId];
    if (!response) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: response.user,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([userMessage]);
    setCurrentView('conversation');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.ai,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleBackToActions = () => {
    setCurrentView('actions');
    setMessages([]);
    setIsTyping(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset to actions view when opening
      setCurrentView('actions');
      setMessages([]);
      setIsTyping(false);
    }
  };

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatWidget = document.querySelector('.ai-chat-widget');
      if (isOpen && chatWidget && !chatWidget.contains(event.target as Node)) {
        setIsOpen(false);
        setCurrentView('actions');
        setMessages([]);
        setIsTyping(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatMessage = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 ai-chat-widget">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="w-15 h-15 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl relative overflow-hidden"
        style={{
          background: '#0033a0',
          boxShadow: isOpen 
            ? '0 12px 32px rgba(0, 51, 160, 0.4)' 
            : '0 8px 24px rgba(0, 51, 160, 0.18)',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          version="1.1" 
          width="50" 
          height="50" 
          x="0" 
          y="0" 
          viewBox="0 0 60 60" 
          className="text-white"
        >
          <g>
            {/* Main circle with integrated chat bubble tail */}
            <path 
              fill="#153e5f" 
              d="M30 1c-16.02 0-29 12.98-29 29 0 6.94 2.43 13.3 6.5 18.29-.82 2.81-2.21 5.49-4 7.57-.37.42-.07 1.09.5 1.11 3.7.19 7.43-.64 10.78-2.28C19.2 57.43 24.42 59 30 59c16.02 0 29-12.98 29-29S46.02 1 30 1zm-17.5 44.5c0-1 .8-1.8 1.8-1.8h.01c.99 0 1.79.8 1.79 1.8 0 .99-.8 1.79-1.79 1.79-.99 0-1.8-.8-1.8-1.79zm7.5 13.5c-2.5-.5-4.9-1.3-7.2-2.4 1.2-1.5 2.2-3.2 2.8-5.1 1.2.3 2.5.5 3.8.5 1.2 0 2.4-.1 3.6-.3-.7 2.1-1.7 4-3 5.3zm-7.5-13.5c0-1 .8-1.8 1.8-1.8h.01c.99 0 1.79.8 1.79 1.8 0 .99-.8 1.79-1.79 1.79-.99 0-1.8-.8-1.8-1.79z"
            />
            {/* Larger, smooth chat bubble tail overlay */}
            <path d="M8 44 Q2 58, 22 54 Q12 50, 16 44" fill="#153e5f" />
            <path 
              fill="#da5726" 
              d="M36 20.02v2H24v-2c0-2.21 2.69-4 6-4s6 1.79 6 4zM13.34 39.02H12c-2.21 0-4-1.79-4-4v-6c0-2.21 1.79-4 4-4h1.34zM46.66 25.02H48c2.21 0 4 1.79 4 4v6c0 2.21-1.79 4-4 4h-1.34z" 
            />
            <rect width="36" height="24" x="12" y="20.02" fill="#da5726" rx="10" />
            <rect width="28" height="14" x="16" y="25.02" fill="#fbfeff" rx="7" />
            <g fill="#3e9ddd">
              <circle cx="22" cy="32.02" r="2" fill="#153e5f" />
              <circle cx="38" cy="32.02" r="2" fill="#153e5f" />
              <path 
                d="M30 36.02c-1.475 0-2.474-.908-2.832-1.445a1 1 0 0 1 1.656-1.122c.03.042.432.567 1.176.567.764 0 1.164-.55 1.168-.555a1 1 0 1 1 1.664 1.11c-.358.537-1.357 1.445-2.832 1.445z" 
                fill="#153e5f" 
              />
            </g>
          </g>
        </svg>
      </button>

      {/* Chat Panel - Conditional Rendering */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="px-5 py-5 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-t-2xl text-white">
            <div className="text-base font-semibold mb-1">
              🤖 F45 AI Assistant
            </div>
            <div className="text-xs opacity-90">
              Get instant insights and updates
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 overflow-y-auto">
            {currentView === 'actions' ? (
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">
                  How can I help you today?
                </div>
                
                <div className="space-y-2">
                  {actionButtons.map((button) => (
                    <button
                      key={button.id}
                      onClick={() => handleActionClick(button.id)}
                      className="block w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-brand-secondary hover:-translate-y-0.5"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleBackToActions}
                  className="flex items-center gap-2 text-secondary text-xs cursor-pointer py-2 mb-3 transition-colors duration-200 hover:text-gray-700"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to menu
                </button>

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-secondary text-xs">AI is typing</div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot"
                          style={{ animationDelay: `${i * 0.16}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'ai'
                            ? 'bg-gradient-to-br from-brand-secondary to-brand-primary'
                            : 'bg-gray-200'
                        }`}
                      >
                        {message.sender === 'ai' ? (
                          <MessageCircle className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-secondary" />
                        )}
                      </div>
                      
                      <div
                        className={`flex-1 p-3 rounded-xl text-sm leading-relaxed max-w-72 ${
                          message.sender === 'ai'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-brand-primary text-white'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.text)
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 