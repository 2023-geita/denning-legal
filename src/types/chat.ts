export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isStreaming?: boolean;
} 