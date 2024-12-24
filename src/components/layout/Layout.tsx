import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AIChatSidebar from './AIChatSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleAIChatClose = () => {
    setIsAIChatOpen(false);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatClick = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onMenuClick={handleMenuClick} 
        onChatClick={handleChatClick}
      />
      
      {/* Floating Navigation Sidebar with Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleSidebarClose}
          />
          <div className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-black border-r border-[#2D2D2D] z-50 shadow-lg">
            <Sidebar isOpen={true} onClose={handleSidebarClose} />
          </div>
        </>
      )}

      {/* AI Chat Fullscreen */}
      <AIChatSidebar isOpen={isAIChatOpen} onClose={handleAIChatClose} />
      
      {/* Main Content - With smooth transition */}
      <main 
        className={`pt-16 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-36' : 'ml-0'  // Push content half the sidebar width
        }`}
      >
        {children}
      </main>
    </div>
  );
} 