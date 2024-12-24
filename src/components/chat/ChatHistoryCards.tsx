import React from 'react';
import { ThreadMetadata } from '@/services/ai.service';

interface ChatHistoryCardsProps {
  threads: ThreadMetadata[];
  currentThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
}

export default function ChatHistoryCards({ 
  threads, 
  currentThreadId, 
  onSelectThread,
  onNewChat 
}: ChatHistoryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* New Chat Card */}
      <button
        onClick={onNewChat}
        className="p-4 bg-[#2D2D2D] rounded-lg hover:bg-[#3D3D3D] transition-colors flex items-center justify-center gap-2 h-24"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="text-gray-400">New Chat</span>
      </button>

      {/* Chat History Cards */}
      {threads.map((thread) => (
        <button
          key={thread.thread_id}
          onClick={() => onSelectThread(thread.thread_id)}
          className={`p-4 rounded-lg transition-colors h-24 flex flex-col justify-between ${
            currentThreadId === thread.thread_id
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-[#2D2D2D] hover:bg-[#3D3D3D]'
          }`}
        >
          <h3 className="font-medium text-left truncate">{thread.title}</h3>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
            <span>{new Date(thread.last_message_at).toLocaleTimeString()}</span>
          </div>
        </button>
      ))}
    </div>
  );
} 