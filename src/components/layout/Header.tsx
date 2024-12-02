import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../common/Logo';

interface HeaderProps {
  onMenuClick: () => void;
}

const navigation = [
  { name: 'MATTERS', href: '/matters' },
  { name: 'SESSION', href: '/session' },
  { name: 'TASKS', href: '/tasks' },
  { name: 'CLIENTS', href: '/clients' },
  { name: 'DOCS', href: '/docs' },
  { name: 'BILLING', href: '/billing' }
];

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#2D2D2D] z-50">
      <nav className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuClick}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-white font-medium">DENNING</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-[#00A3B4]'
                  : 'text-white hover:text-[#00A3B4]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-gray-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <button className="text-white hover:text-gray-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">KP</span>
          </div>
        </div>
      </nav>
    </header>
  );
} 