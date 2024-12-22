"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import Logo from '../common/Logo';
import { Chat } from '@/lib/models/Chat';
import { Session } from 'next-auth';

interface HeaderProps {
  onMenuClick: () => void;
  onChatClick: () => void;
  isMobile: boolean;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id: string;
    role?: string;
  };
}

const navigation: { name: string; href: string }[] = [
  // { name: 'MATTERS', href: '/matters' },
  // { name: 'TASKS', href: '/tasks' },
  // { name: 'BILLING', href: '/billing' },
  // { name: 'SESSION', href: '/session' },
  // { name: 'CLIENTS', href: '/clients' },
  // { name: 'DOCS', href: '/docs' }
];



export default function Header({ onMenuClick, onChatClick, isMobile, user }: HeaderProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([])


  useEffect(() => {
    const handleSession = async (session: Session) => {

      const response = await fetch(`/api/user/user?email=${session.user.email}`, { method: 'GET'  });
      const user = await response.json();

      if (!user) {
        const response = await fetch('/api/user/user', {
          method: 'POST',
          body: JSON.stringify({ 
            user: session.user.name,
            email: session.user.email,
            image: session.user.image,
            chats: []
          }),
        });
        const savedUser = await response.json();
        console.log("saved user", savedUser)
      } else {
        
        console.log("existing user", user)
      }


    };

    if (session) {
      handleSession(session)
    }
    
  }, [session])
  
  

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

  const handleAuth = async () => {
    if (session) {
      await signOut();
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#2D2D2D] z-50">
      <nav className="h-full px-8 flex items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          {session && (
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
          )}
          <Link href="/" className="flex items-center space-x-3">
            <Logo className="w-24 h-8" />
          </Link>
        </div>

        {/* Center Navigation - Only show when logged in */}
        {session && (
          <div className="flex-1 flex items-center justify-center space-x-1">
            {navigation?.map((item) => (
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
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-6 ml-auto">
          {session ? (
            <div 
              onClick={handleAuth}
              className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <span className="text-white text-sm font-medium">
                {getInitials(session?.user?.name)}
              </span>
            </div>
          ) : (
            <button
              onClick={handleAuth}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}