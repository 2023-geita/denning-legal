import React from 'react';
import { Card } from '@/components/common';
import AIChatHistory from '../chat/AIChatHistory';

interface ChatMessage {
  id: string;
  text: string;
  date: string;
  section: 'today' | 'yesterday' | 'past7days';
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for chat history
const chatHistory: ChatMessage[] = [
  // Today
  { id: '1', text: 'Principles learnt in Republic v', date: 'Today', section: 'today' },
  { id: '2', text: 'Principles learnt in Republic v', date: 'Today', section: 'today' },
  { id: '3', text: 'Principles learnt in Republic v', date: 'Today', section: 'today' },
  
  // Yesterday
  { id: '4', text: 'Principles learnt in Republic v', date: 'Yesterday', section: 'yesterday' },
  { id: '5', text: 'Principles learnt in Republic v', date: 'Yesterday', section: 'yesterday' },
  { id: '6', text: 'Principles learnt in Republic v', date: 'Yesterday', section: 'yesterday' },
  { id: '7', text: 'Principles learnt in Republic v', date: 'Yesterday', section: 'yesterday' },
  
  // Past 7 days
  { id: '8', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '9', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '10', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '11', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '12', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '13', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '14', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
  { id: '15', text: 'Principles learnt in Republic v', date: 'Past 7 days', section: 'past7days' },
];

export default function AIChatFullscreen({ isOpen, onClose }: AIChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-16 bg-black z-40">
      <div className="h-full">
        <AIChatHistory />
      </div>
    </div>
  );
} 