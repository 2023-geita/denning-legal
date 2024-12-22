import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [router.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <Header 
        onMenuClick={toggleSidebar}
        onChatClick={() => {}}
        user={session.user}
        isMobile={isMobile}
      />
      
      <div className="pt-16 min-h-[calc(100vh-4rem)]">
        <div className="flex relative h-full">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => isMobile && setIsSidebarOpen(false)}
          />
          
          <main 
            className={`flex-1 transition-all duration-300 ${
              isSidebarOpen && !isMobile ? 'ml-72' : 'ml-0'
            }`}
          >
            <div className="p-4 md:p-6 space-y-6">
              {/* Breadcrumb */}
              <nav className="text-sm text-text-secondary">
                {router.pathname
                  .split('/')
                  .filter(Boolean)
                  .map((segment, index, array) => (
                    <span key={segment}>
                      <span className="capitalize">{segment}</span>
                      {index < array.length - 1 && (
                        <span className="mx-2">/</span>
                      )}
                    </span>
                  ))}
              </nav>

              {/* Main Content */}
              <div className="bg-surface-darker rounded-xl p-4 md:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 