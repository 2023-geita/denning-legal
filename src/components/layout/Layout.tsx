import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Automatically open sidebar on home/chat page
  useEffect(() => {
    if (router.pathname === '/') {
      setIsSidebarOpen(true);
    }
  }, [router.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header onMenuClick={toggleSidebar} />
      <div className="pt-16 min-h-screen">
        <div className="flex relative h-[calc(100vh-4rem)]">
          <Sidebar isOpen={isSidebarOpen} />
          <main 
            className={`flex-1 transition-all duration-300 ${
              isSidebarOpen ? 'ml-72' : 'ml-0'
            }`}
          >
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 