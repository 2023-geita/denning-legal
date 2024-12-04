import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';

// Mock recent sessions data
const recentSessions = [
  {
    id: '1',
    matterName: 'Contract Review - ABC Corp',
    duration: '2h 30m',
    billable: true,
    date: '2 days ago'
  },
  {
    id: '2',
    matterName: 'Legal Consultation - XYZ Ltd',
    duration: '1h 45m',
    billable: true,
    date: '3 days ago'
  },
  {
    id: '3',
    matterName: 'Document Review - Smith Case',
    duration: '3h 15m',
    billable: false,
    date: '5 days ago'
  }
];

export default function NewSession() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('details');
  const [duration, setDuration] = useState('1h 30m');
  const [matterNotes, setMatterNotes] = useState('');
  const [billingRate, setBillingRate] = useState('0.00');
  const [isBillable, setIsBillable] = useState(true);

  const sections = [
    { id: 'details', label: 'Session Details', icon: '⚡' }
  ];

  const handleSubmit = async () => {
    try {
      router.push('/session');
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6">
        {/* Header with Save Button */}
        <div className="sticky top-0 bg-black z-10 pb-4 border-b border-[#2D2D2D]">
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSubmit}>
              Save Session
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          {/* Left Sidebar - Fixed */}
          <div className="w-64 shrink-0 space-y-6">
            {/* Progress Section */}
            <Card className="bg-[#1A1A1A] sticky top-[100px]">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-[#2D2D2D] text-[#FFD700]'
                          : 'hover:bg-[#2D2D2D] text-white'
                      }`}
                    >
                      <span className={activeSection === section.id ? 'text-[#FFD700]' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span>
                        {section.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </Card>

            {/* Recent Sessions Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Recent Sessions</h3>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="p-3 bg-[#2D2D2D] rounded-lg hover:bg-[#3D3D3D] transition-colors cursor-pointer"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm text-white font-medium truncate">{session.matterName}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">{session.duration}</span>
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              session.billable 
                                ? 'bg-green-900/50 text-green-400' 
                                : 'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {session.billable ? 'Billable' : 'Non-billable'}
                            </span>
                          </div>
                          <span className="text-gray-400">{session.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl flex-1">
            <div className="space-y-6">
              <div id="details" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="bg-[#2D2D2D] text-white"
                            />
                            <button className="p-2 bg-[#2D2D2D] rounded-lg text-white hover:bg-[#3D3D3D] transition-colors">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Matter Notes</label>
                          <textarea
                            value={matterNotes}
                            onChange={(e) => setMatterNotes(e.target.value)}
                            placeholder="Enter Matter description"
                            className="w-full h-40 bg-[#2D2D2D] text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <Select
                          label="Matter"
                          options={[{ value: '', label: 'Select Matter' }]}
                          className="bg-[#2D2D2D] text-white"
                        />

                        <Input
                          type="date"
                          label="Date"
                          className="bg-[#2D2D2D] text-white"
                        />

                        <Select
                          label="Attorney"
                          options={[{ value: '', label: 'Select Attorney' }]}
                          className="bg-[#2D2D2D] text-white"
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Billing rate</label>
                          <div className="flex items-center">
                            <Input
                              value={billingRate}
                              onChange={(e) => setBillingRate(e.target.value)}
                              className="bg-[#2D2D2D] text-white"
                            />
                            <span className="ml-2 text-gray-400">per hr</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={isBillable}
                              onChange={() => setIsBillable(true)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border ${isBillable ? 'border-[#FFD700] bg-[#FFD700]' : 'border-gray-400'}`} />
                            <span className="text-white">Billable</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={!isBillable}
                              onChange={() => setIsBillable(false)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border ${!isBillable ? 'border-[#FFD700] bg-[#FFD700]' : 'border-gray-400'}`} />
                            <span className="text-white">Non-billable</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 