// Location-related types
export interface Location {
  id: string;
  name: string;
  threadCount: number;
  unreadCount: number;
  status: 'online' | 'away' | 'offline';
}

// Thread-related types
export interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  priority: 'high' | 'medium' | 'low';
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
  selectedLocation: string | null;
  selectedThread: string | null;
  onLocationSelect: (locationId: string) => void;
  onThreadSelect: (threadId: string) => void;
  onStartNewThread: () => void;
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
}

// Event handler types
export type MessageHandler = (message: string) => void;
export type LocationSelectHandler = (locationId: string) => void;
export type ThreadSelectHandler = (threadId: string) => void;
export type NewThreadHandler = () => void; 