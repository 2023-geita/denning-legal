import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Logo from '../common/Logo';

interface HeaderProps {
  onMenuClick: () => void;
  onChatClick: () => void;
}

const navigation = [
  { name: 'MATTERS', href: '/matters' },
  { name: 'TASKS', href: '/tasks' },
  { name: 'BILLING', href: '/billing' },
  { name: 'SESSION', href: '/session' },
  { name: 'CLIENTS', href: '/clients' },
  { name: 'DOCS', href: '/docs' }
];

export default function Header({ onMenuClick, onChatClick }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#2D2D2D] z-50">
      <nav className="h-full px-8 flex items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <button
            onClick={onMenuClick}
            className="p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-[#2D2D2D]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <span className="text-white font-medium">DENNING</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="flex-1 flex items-center justify-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-[#2D2D2D]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <button className="p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-[#2D2D2D]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-[#2D2D2D]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
            <span className="text-white text-sm font-medium">{getInitials(session?.user?.name)}</span>
          </div>
        </div>
      </nav>
    </header>
  );
} 