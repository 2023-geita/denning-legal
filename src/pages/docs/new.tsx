import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiZap } from 'react-icons/fi';

export default function NewDocument() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Document</span>
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
                    <span>Document Details</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E1E1E]">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Documents</h3>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 max-w-3xl">
            <Card className="bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-white mb-6">Document Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Document Name</label>
                  <Input
                    type="text"
                    placeholder="Enter Document Name"
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

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Document Type</label>
                  <Select
                    options={[
                      { value: 'contract', label: 'Contract' },
                      { value: 'agreement', label: 'Agreement' },
                      { value: 'letter', label: 'Letter' },
                      { value: 'memo', label: 'Memo' },
                      { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select Document Type"
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
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  placeholder="Enter document description"
                  className="w-full h-32 bg-[#2D2D2D] text-white rounded-lg px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-[#3D3D3D]"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Upload Document</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-[#2D2D2D] hover:bg-[#3D3D3D] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, or TXT (MAX. 10MB)</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Document Status</label>
                <div className="flex items-center space-x-6">
                  <Select
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'final', label: 'Final' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                    placeholder="Select Status"
                    className="bg-[#2D2D2D] w-40"
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