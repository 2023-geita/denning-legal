import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Logo from '../common/Logo';
import { User } from 'next-auth';
import { UserRole } from '@prisma/client';

interface HeaderProps {
  onMenuClick: () => void;
  onChatClick?: () => void;
  isMobile?: boolean;
  user?: User & {
    role?: UserRole | null;
  };
}

export default function Header({ onMenuClick, onChatClick, isMobile, user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#2D2D2D] z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-[#2D2D2D] rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8 text-[#00A3B4]" />
            <span className="text-xl font-bold text-white">Denning</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {onChatClick && (
            <button
              onClick={onChatClick}
              className="p-2 hover:bg-[#2D2D2D] rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          )}

          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 hover:bg-[#2D2D2D] rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#00A3B4] flex items-center justify-center text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-white">{user.name || 'User'}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden invisible group-hover:visible">
                <div className="p-4 border-b border-[#3D3D3D]">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-sm mt-1">{user.role || 'No role'}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full p-3 text-left text-white hover:bg-[#3D3D3D] transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-[#00A3B4] text-white rounded-lg hover:bg-[#008999] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 