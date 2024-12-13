import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiZap } from 'react-icons/fi';

export default function NewTask() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Status Pills & New Task Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-[#00A3B4] text-white rounded-full text-sm">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Pending
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Completed
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Task</span>
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
                    <span>Task Details</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E1E1E]">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Tasks</h3>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 max-w-3xl">
            <Card className="bg-[#1E1E1E]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Task Name</label>
                  <Input
                    placeholder="Enter Task Name"
                    className="bg-[#2D2D2D]"
                  />
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
                <label className="block text-sm text-gray-400 mb-2">To-Do List</label>
                <textarea
                  placeholder="What to do"
                  className="w-full h-32 bg-[#2D2D2D] text-white rounded-lg px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#3D3D3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Task Due</label>
                  <Input
                    type="date"
                    placeholder="Select Date"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Attorney Assigned</label>
                  <Select
                    options={[]}
                    placeholder="Select Attorney"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Task Status</label>
                <div className="flex items-center space-x-6">
                  <Select
                    options={[{ value: 'pending', label: 'Pending' }]}
                    placeholder="Pending"
                    className="bg-[#2D2D2D] w-40"
                  />
                  <label className="inline-flex items-center space-x-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-[#FFD700] bg-[#2D2D2D] border-gray-600 rounded"
                    />
                    <span>Remind Me?</span>
                  </label>
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