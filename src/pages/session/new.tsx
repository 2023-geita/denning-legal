import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';

export default function NewSession() {
  const router = useRouter();
  const [duration, setDuration] = useState('1h 30m');
  const [matterNotes, setMatterNotes] = useState('');
  const [billingRate, setBillingRate] = useState('0.00');
  const [isBillable, setIsBillable] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#2D2D2D]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
              <nav className="space-y-1">
                <button
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <span>Session Details</span>
                </button>
              </nav>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Sessions</h3>
              {/* Recent sessions would go here */}
            </div>
          </Card>

          {/* Main Form */}
          <Card className="flex-1 bg-[#1A1A1A]">
            <h2 className="text-xl font-medium text-white mb-8">Session Details</h2>
            
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
                    <button className="p-2 bg-[#2D2D2D] rounded-lg text-white">
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
                    className="w-full h-40 bg-[#2D2D2D] text-white rounded-lg p-3 resize-none"
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

            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="secondary">Empty</Button>
              <Button variant="primary">Save</Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 