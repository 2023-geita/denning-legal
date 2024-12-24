import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
}

// Mock data for chat history sections
const chatHistory = {
  today: [
    { id: '1', text: 'Principles learnt in Republic v' },
    { id: '2', text: 'Principles learnt in Republic v' },
    { id: '3', text: 'Principles learnt in Republic v' },
  ],
  yesterday: [
    { id: '4', text: 'Principles learnt in Republic v' },
    { id: '5', text: 'Principles learnt in Republic v' },
    { id: '6', text: 'Principles learnt in Republic v' },
    { id: '7', text: 'Principles learnt in Republic v' },
  ],
  past7days: [
    { id: '8', text: 'Principles learnt in Republic v' },
    { id: '9', text: 'Principles learnt in Republic v' },
    { id: '10', text: 'Principles learnt in Republic v' },
    { id: '11', text: 'Principles learnt in Republic v' },
    { id: '12', text: 'Principles learnt in Republic v' },
    { id: '13', text: 'Principles learnt in Republic v' },
    { id: '14', text: 'Principles learnt in Republic v' },
    { id: '15', text: 'Principles learnt in Republic v' },
  ],
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  const renderChatSection = (title: string, messages: ChatMessage[]) => (
    <div className="space-y-2">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <div className="space-y-1">
        {messages.map((message) => (
          <button
            key={message.id}
            className="w-full text-left p-2 rounded text-white text-sm hover:bg-[#2D2D2D] transition-colors"
          >
            {message.text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <nav className="h-full bg-black overflow-y-auto">
      {/* Sidebar content */}
    </nav>
  );
} 