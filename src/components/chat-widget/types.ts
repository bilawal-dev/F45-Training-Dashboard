// Location-related types
export interface Location {
  listId: string;
  name: string;
  threadCount: number;
}
  
  // Thread-related types
  export interface Thread {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    userId: string;
    listId: string;
    folderId: string;
    name: string;
    slackThreadTs?: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  // Message-related types
  export interface Message {
    id: string;
    content: string;
    sender: string;
    senderType: 'user' | 'agent';
    timestamp: string;
    avatar: string;
  }
  
  // Chat Widget State types
  export interface ChatWidgetState {
    isMinimized: boolean;
    selectedLocation: string | null;
    selectedThread: string | null;
    newMessage: string;
    isTyping: boolean;
  }
  
  // API Response types (for future Chatwoot integration)
  export interface ChatwootContact {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    identifier?: string;
    custom_attributes?: Record<string, any>;
  }
  
  export interface ChatwootConversation {
    id: number;
    account_id: number;
    inbox_id: number;
    status: 'open' | 'resolved' | 'pending';
    timestamp: number;
    contact_last_seen_at: number;
    agent_last_seen_at: number;
    unread_count: number;
    custom_attributes?: Record<string, any>;
    messages?: ChatwootMessage[];
  }
  
  export interface ChatwootMessage {
    id: number;
    content: string;
    account_id: number;
    inbox_id: number;
    conversation_id: number;
    message_type: 'incoming' | 'outgoing';
    created_at: string;
    private: boolean;
    sender_type: 'User' | 'Agent';
    sender_id: number;
  }
  
  // Component Props types
  export interface ChatWidgetProps {
    className?: string;
    defaultLocation?: string;
    onLocationChange?: (locationId: string) => void;
    onThreadChange?: (threadId: string) => void;
    onMessageSend?: (message: string, threadId: string, locationId: string) => void;
  }
  
  export interface ChatSidebarProps {
    locations: Location[];
    threads: Thread[];
    threadsLoading: boolean;
    selectedLocation: string | null;
    selectedThread: string | null;
    onLocationSelect: (locationId: string) => void;
    onThreadSelect: (threadId: string) => void;
    onStartNewThread: (name: string) => void;
    onUpdateThread: (threadId: string, name: string) => void;
    onDeleteThread: (threadId: string) => void;
  }
  
  export interface ChatThreadProps {
    messages: Message[];
    threadTitle: string;
    isLoading?: boolean;
  }
  
  export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isSending?: boolean;
  }
  
  // Socket.IO related types
  export interface SocketMessage {
    id: string;
    text: string;
    sender: 'USER' | 'AGENT';
    threadId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SocketEvent {
    threadJoined: { threadId: string };
    threadLeft: { threadId: string };
    newMessage: SocketMessage;
    error: { message: string };
  }
  
  // Connection state types
  export interface SocketConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    currentThread: string | null;
  }
  
  // Event handler types
  export type MessageHandler = (message: string) => void;
  export type LocationSelectHandler = (locationId: string) => void;
  export type ThreadSelectHandler = (threadId: string) => void;
  export type NewThreadHandler = () => void; 