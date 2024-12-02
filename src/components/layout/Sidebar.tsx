import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

const groupedChats = {
  today: [
    { id: '1', title: 'Principles learnt in Republic v', timestamp: '2024-02-15' },
    { id: '2', title: 'Principles learnt in Republic v', timestamp: '2024-02-15' },
    { id: '3', title: 'Principles learnt in Republic v', timestamp: '2024-02-15' }
  ],
  yesterday: [
    { id: '4', title: 'Principles learnt in Republic v', timestamp: '2024-02-14' },
    { id: '5', title: 'Principles learnt in Republic v', timestamp: '2024-02-14' },
    { id: '6', title: 'Principles learnt in Republic v', timestamp: '2024-02-14' }
  ],
  'past 7 days': [
    { id: '7', title: 'Principles learnt in Republic v', timestamp: '2024-02-10' },
    { id: '8', title: 'Principles learnt in Republic v', timestamp: '2024-02-09' },
    { id: '9', title: 'Principles learnt in Republic v', timestamp: '2024-02-08' }
  ]
};

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <aside
      className={`fixed top-16 left-0 w-72 bg-[#1A1A1A] h-[calc(100vh-4rem)] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-30`}
    >
      <div className="flex flex-col h-full">
        {/* Ask the Jury Button */}
        <div className="p-4 border-b border-[#2D2D2D]">
          <Link 
            href="/"
            className="flex items-center space-x-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] transition-colors rounded-lg px-4 py-3 w-full"
          >
            <div className="w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center">
              <span className="text-black text-sm">⚡</span>
            </div>
            <span className="text-white font-medium">Ask the Jury</span>
          </Link>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedChats).map(([timeframe, chats]) => (
            <div key={timeframe} className="py-2">
              <h3 className="px-4 text-sm font-medium text-gray-400 mb-2 capitalize">
                {timeframe}
              </h3>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className={`block px-4 py-2 text-gray-300 hover:bg-[#2D2D2D] transition-colors ${
                      router.query.id === chat.id ? 'bg-[#2D2D2D]' : ''
                    }`}
                  >
                    <span className="line-clamp-1">{chat.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
} 