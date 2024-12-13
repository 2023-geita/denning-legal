import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiZap, FiPlay } from 'react-icons/fi';

export default function NewSession() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Status Pills & New Session Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-[#00A3B4] text-white rounded-full text-sm">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Ongoing
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Completed
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Planned
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Session</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0 space-y-6">
            <Card className="bg-[#1E1E1E]">
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]">
                    <FiZap className="w-4 h-4" />
                    <span>Session Details</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E1E1E]">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Sessions</h3>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 max-w-3xl">
            <Card className="bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-white mb-6">Session Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="1h 30m"
                      className="bg-[#2D2D2D] pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <FiPlay className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter</label>
                  <Select
                    options={[]}
                    placeholder="Select Matter"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Matter Notes</label>
                <textarea
                  placeholder="Enter Matter description"
                  className="w-full h-48 bg-[#2D2D2D] text-white rounded-lg px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#3D3D3D]"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <Input
                    type="date"
                    placeholder="Select Date"
                    className="bg-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Attorney</label>
                  <Select
                    options={[]}
                    placeholder="Select Attorney"
                    className="bg-[#2D2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Billing rate</label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="text"
                      placeholder="0.00"
                      className="bg-[#2D2D2D] w-32"
                    />
                    <span className="text-gray-400">per hr</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <span className="w-4 h-4 rounded-full bg-[#FFD700]"></span>
                      <span className="text-white text-sm">Billable</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <span className="w-4 h-4 rounded-full border border-gray-600"></span>
                      <span className="text-gray-400 text-sm">Non-billable</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
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