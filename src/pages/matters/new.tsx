import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiCalendar, FiUsers, FiDollarSign, FiFile, FiZap } from 'react-icons/fi';

export default function NewMatter() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('matter-details');
  
  // Create refs for each section
  const sectionRefs = {
    'matter-details': useRef<HTMLDivElement>(null),
    'deadlines': useRef<HTMLDivElement>(null),
    'subscribed-attorneys': useRef<HTMLDivElement>(null),
    'billing-details': useRef<HTMLDivElement>(null),
    'related-documents': useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight * 0.4; // 40% of viewport height

      let currentSection = 'matter-details';
      let minDistance = Infinity;

      // Find the section closest to the viewport center
      Object.entries(sectionRefs).forEach(([id, ref]) => {
        const element = ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - threshold);
          
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Add scroll event listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', scrollListener, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId]?.current;
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Status Pills & New Matter Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-[#00A3B4] text-white rounded-full text-sm">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Open
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Pending
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Closed
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Matter</span>
          </div>
        </div>

        <div className="text-xl text-white mb-6">Matter Details</div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0 space-y-6 sticky top-6 self-start h-fit">
            <Card className="bg-[#1E1E1E]">
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => scrollToSection('matter-details')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === 'matter-details' ? 'text-[#FFD700] bg-[#2D2D2D]' : 'text-gray-400 hover:bg-[#2D2D2D]'
                    }`}
                  >
                    <FiZap className="w-4 h-4" />
                    <span>Matter Details</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('deadlines')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === 'deadlines' ? 'text-[#FFD700] bg-[#2D2D2D]' : 'text-gray-400 hover:bg-[#2D2D2D]'
                    }`}
                  >
                    <FiCalendar className="w-4 h-4" />
                    <span>Deadlines</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('subscribed-attorneys')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === 'subscribed-attorneys' ? 'text-[#FFD700] bg-[#2D2D2D]' : 'text-gray-400 hover:bg-[#2D2D2D]'
                    }`}
                  >
                    <FiUsers className="w-4 h-4" />
                    <span>Subscribed attorneys</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('billing-details')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === 'billing-details' ? 'text-[#FFD700] bg-[#2D2D2D]' : 'text-gray-400 hover:bg-[#2D2D2D]'
                    }`}
                  >
                    <FiDollarSign className="w-4 h-4" />
                    <span>Billing details</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('related-documents')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeSection === 'related-documents' ? 'text-[#FFD700] bg-[#2D2D2D]' : 'text-gray-400 hover:bg-[#2D2D2D]'
                    }`}
                  >
                    <FiFile className="w-4 h-4" />
                    <span>Related documents</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E1E1E]">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Updates</h3>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 max-w-3xl space-y-6">
            {/* Matter Details Card */}
            <div ref={sectionRefs['matter-details']}>
              <Card className="bg-[#1E1E1E]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client</label>
                    <Input
                      placeholder="Select Client"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Matter Status</label>
                    <Select
                      options={[{ value: 'open', label: 'Open' }]}
                      placeholder="Status of the matter"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">Matter Notes</label>
                  <textarea
                    placeholder="Enter Matter description"
                    className="w-full h-32 bg-[#2D2D2D] text-white rounded-lg px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#3D3D3D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Originating attorney</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Responsible attorney</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Court Location</label>
                    <Input
                      placeholder="Search court"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Practice Area</label>
                    <Input
                      placeholder="Select Practice Area"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">Case Number</label>
                  <Input
                    placeholder="As provided by the judiciary"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </Card>
            </div>

            {/* Deadlines Card */}
            <div ref={sectionRefs['deadlines']}>
              <Card className="bg-[#1E1E1E]">
                <h3 className="text-lg text-white mb-6">Deadlines</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Matter opens</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Matter closes</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Matter due</label>
                    <Input
                      placeholder="Search court"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Statute of limitations date</label>
                    <Input
                      placeholder="Select Practice Area"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Subscribed Attorneys Card */}
            <div ref={sectionRefs['subscribed-attorneys']}>
              <Card className="bg-[#1E1E1E]">
                <h3 className="text-lg text-white mb-6">Subscribed attorneys</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Attorney Name</label>
                  <Input
                    placeholder="Search attorney by name"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div className="mt-4">
                  <div className="inline-flex items-center space-x-1 bg-[#00A3B4] bg-opacity-20 text-[#00A3B4] px-2 py-1 rounded">
                    <span className="text-sm">Kevin Gallo</span>
                    <button className="hover:text-white">×</button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Billing Details Card */}
            <div ref={sectionRefs['billing-details']}>
              <Card className="bg-[#1E1E1E]">
                <h3 className="text-lg text-white mb-6">Billing Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client</label>
                    <Input
                      placeholder="Select client to bill"
                      className="bg-[#2D2D2D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Total cost</label>
                      <Input
                        value="700,000"
                        className="bg-[#2D2D2D]"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Paid amount</label>
                      <Input
                        value="136,000"
                        className="bg-[#2D2D2D]"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Retainer fee</label>
                      <Input
                        value="100,000"
                        className="bg-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Retainer due</label>
                      <Input
                        value="25/11/2024"
                        className="bg-[#2D2D2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Unpaid Balance</label>
                    <Input
                      value="564,000"
                      className="bg-[#2D2D2D]"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Payment History</label>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>ksh. 200,000 on 18/11/2024</div>
                      <div>ksh. 200,000 on 18/11/2024</div>
                      <div>ksh. 200,000 on 18/11/2024</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Related Documents Card */}
            <div ref={sectionRefs['related-documents']}>
              <Card className="bg-[#1E1E1E]">
                <h3 className="text-lg text-white mb-6">Related Documents</h3>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">Add doc from online source</label>
                    <Input
                      placeholder="Paste url"
                      className="bg-[#2D2D2D]"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">or add from Local files</div>
                    <Button variant="secondary" size="sm">
                      ADD FILE
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="danger">
            EMPTY
          </Button>
          <Button variant="secondary">
            SAVE
          </Button>
        </div>
      </div>
    </Layout>
  );
}