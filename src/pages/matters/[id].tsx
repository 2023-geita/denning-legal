import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiCalendar, FiUsers, FiDollarSign, FiFile, FiZap } from 'react-icons/fi';

export default function MatterDetails() {
  const router = useRouter();
  const { id } = router.query;

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
          <button 
            onClick={() => router.push('/matters/new')}
            className="inline-flex items-center px-4 py-2 bg-[#1E1E1E] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
          >
            <span className="text-[#FFD700] mr-2">⬧</span>
            <span className="text-sm">New Matter</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0">
            <Card className="bg-[#1E1E1E]">
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]">
                    <FiZap className="w-4 h-4" />
                    <span>Matter Details</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2D2D2D]">
                    <FiCalendar className="w-4 h-4" />
                    <span>Deadlines</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2D2D2D]">
                    <FiUsers className="w-4 h-4" />
                    <span>Subscribed attorneys</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2D2D2D]">
                    <FiDollarSign className="w-4 h-4" />
                    <span>Billing details</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2D2D2D]">
                    <FiFile className="w-4 h-4" />
                    <span>Related documents</span>
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1">
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
                    placeholder="Open"
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

            {/* Deadlines Card */}
            <Card className="bg-[#1E1E1E] mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter opens</label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter closes</label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter due</label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Statute of limitations date</label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
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