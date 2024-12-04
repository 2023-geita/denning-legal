import React from 'react';
import { Card } from '@/components/common';

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

export default function AIChatSidebar({ isOpen, onClose }: AIChatSidebarProps) {
  if (!isOpen) return null;

  const groupedMessages = chatHistory.reduce((acc, message) => {
    if (!acc[message.section]) {
      acc[message.section] = [];
    }
    acc[message.section].push(message);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-black border-r border-[#2D2D2D] z-40 transition-transform duration-300">
      <div className="h-full flex flex-col">
        {/* Ask the Jury Button */}
        <div className="p-4">
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 bg-[#2D2D2D] rounded-lg text-white hover:bg-[#3D3D3D] transition-colors"
          >
            <span className="text-yellow-400">⚖️</span>
            <span>Ask the Jury</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Today's Messages */}
          {groupedMessages.today && groupedMessages.today.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Today</h3>
              <div className="space-y-2">
                {groupedMessages.today.map((message) => (
                  <button
                    key={message.id}
                    className="w-full text-left p-2 rounded hover:bg-[#2D2D2D] text-white text-sm transition-colors"
                  >
                    {message.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Yesterday's Messages */}
          {groupedMessages.yesterday && groupedMessages.yesterday.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Yesterday</h3>
              <div className="space-y-2">
                {groupedMessages.yesterday.map((message) => (
                  <button
                    key={message.id}
                    className="w-full text-left p-2 rounded hover:bg-[#2D2D2D] text-white text-sm transition-colors"
                  >
                    {message.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Past 7 Days Messages */}
          {groupedMessages.past7days && groupedMessages.past7days.length > 0 && (
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Past 7 days</h3>
              <div className="space-y-2">
                {groupedMessages.past7days.map((message) => (
                  <button
                    key={message.id}
                    className="w-full text-left p-2 rounded hover:bg-[#2D2D2D] text-white text-sm transition-colors"
                  >
                    {message.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
} 