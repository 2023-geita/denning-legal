import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiZap } from 'react-icons/fi';

export default function NewClient() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Status Pills & New Client Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-[#00A3B4] text-white rounded-full text-sm">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Individual
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Company
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Client</span>
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
                    <span>Client Details</span>
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
              <h2 className="text-lg font-medium text-white mb-6">Client Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client Name</label>
                  <Input
                    type="text"
                    placeholder="Enter Task Name"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client Status</label>
                  <Select
                    options={[
                      { value: 'individual', label: 'Individual' },
                      { value: 'company', label: 'Company' }
                    ]}
                    placeholder="Individual or company"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+256 700 000 000"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Select Email"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  <Input
                    type="text"
                    placeholder="Enter Client Location"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Responsible Attorney</label>
                  <Select
                    options={[]}
                    placeholder="Select Attorney"
                    className="bg-[#2D2D2D]"
                  />
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