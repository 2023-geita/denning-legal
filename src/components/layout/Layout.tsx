import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AIChatSidebar from './AIChatSidebar';
import { useSession } from 'next-auth/react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { data: session } = useSession();

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleAIChatClose = () => {
    setIsAIChatOpen(false);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsAIChatOpen(false); // Close AI chat when menu is clicked
  };

  const handleChatClick = () => {
    setIsAIChatOpen(!isAIChatOpen);
    setIsSidebarOpen(false); // Close menu when chat is clicked
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onMenuClick={handleMenuClick} 
        onChatClick={handleChatClick}
        isMobile={false}
        user={session?.user || { id: '', name: null, email: null, image: null, role: undefined }}
      />
      
      {/* Navigation Sidebar */}
      <div className="fixed top-16 left-0 bottom-0 w-72 z-40">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </div>

      {/* AI Chat Sidebar */}
      <AIChatSidebar isOpen={isAIChatOpen} onClose={handleAIChatClose} />
      
      <main 
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen || isAIChatOpen ? 'ml-72' : 'ml-0'
        }`}
      >
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 