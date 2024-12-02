import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/common';

const sections = [
  { id: 'details', label: 'Matter Details' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'attorneys', label: 'Subscribed attorneys' },
  { id: 'billing', label: 'Billing details' },
  { id: 'documents', label: 'Related documents' }
];

export default function NewMatter() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('details');
  const [selectedAttorney, setSelectedAttorney] = useState('Kevin Deitz');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better highlighting

      // Find the current section
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = element.offsetTop - 100; // Adjust offset as needed
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Top Filter Tabs */}
        <div className="sticky top-16 z-10 bg-black px-6 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#00A3B4] text-white">All</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Open</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Pending</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Closed</button>
            </div>
            <button className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D]">
              <span className="text-sm font-medium">New Matter</span>
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 pb-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Static */}
            <div className="w-64 shrink-0">
              <div className="sticky top-48">
                <div className="rounded-xl bg-[#1A1A1A]/50 p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            activeSection === section.id ? 'bg-[#FFD700]' : 'bg-gray-400'
                          }`} />
                          <span className={`transition-colors duration-200 ${
                            activeSection === section.id ? 'text-[#FFD700]' : 'text-gray-400'
                          }`}>
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Updates</h3>
                    {/* Recent updates content */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-6">
              {/* Matter Details Section */}
              <div 
                ref={el => sectionRefs.current['details'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Matter Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                      <Input
                        placeholder="Select Client"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Matter Status</label>
                      <Input
                        placeholder="Status of the matter"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter Notes</label>
                    <textarea
                      placeholder="Enter Matter description"
                      className="w-full h-32 bg-[#2D2D2D] text-white rounded-lg p-3 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Originating attorney</label>
                      <Input
                        placeholder="Search attorney by name"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Responsible attorney</label>
                      <Input
                        placeholder="Search attorney by name"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Court Location</label>
                      <Input
                        placeholder="Search court"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Practice Area</label>
                      <Input
                        placeholder="Select Practice Area"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Case Number</label>
                    <Input
                      placeholder="As provided by the judiciary"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Deadlines Section */}
              <div 
                ref={el => sectionRefs.current['deadlines'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Deadlines</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter opens</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter closes</label>
                    <Input
                      placeholder="Search attorney by name"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter due</label>
                    <Input
                      placeholder="Search court"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Statute of limitations date</label>
                    <Input
                      placeholder="Select Practice Area"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Subscribed attorneys Section */}
              <div 
                ref={el => sectionRefs.current['attorneys'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Subscribed attorneys</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Attorney Name</label>
                  <Input
                    placeholder="Search attorney by name"
                    className="bg-[#2D2D2D] text-white mb-4"
                  />
                  {selectedAttorney && (
                    <div className="inline-flex items-center bg-[#2D2D2D] px-3 py-1 rounded-full">
                      <span className="text-white mr-2">{selectedAttorney}</span>
                      <button className="text-gray-400 hover:text-white">×</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Details Section */}
              <div 
                ref={el => sectionRefs.current['billing'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Billing Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                    <Input
                      placeholder="Select client to bill"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Total cost</label>
                      <Input
                        value="750,000"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Paid amount</label>
                      <Input
                        value="150,000"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Retainer fee</label>
                      <Input
                        value="100,000"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Retainer due</label>
                      <Input
                        value="25/12/2024"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Unpaid Balance</label>
                    <Input
                      value="584,000"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment History</label>
                    <div className="space-y-2 text-gray-400">
                      <div>ksh. 100,000 on 26/11/2023</div>
                      <div>ksh. 200,000 on 25/11/2023</div>
                      <div>ksh. 300,000 on 24/11/2023</div>
                      <div>ksh. 200,000 on 26/11/2023</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div 
                ref={el => sectionRefs.current['documents'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Documents</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Paste url"
                      className="bg-[#2D2D2D] text-white flex-1 mr-4"
                    />
                    <span className="text-gray-400">or add from Local files</span>
                  </div>
                  <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors">
                    ADD FILE
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button variant="danger">EMPTY</Button>
                <Button variant="primary">SAVE</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 