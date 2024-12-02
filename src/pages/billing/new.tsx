import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function NewBill() {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMatter, setSelectedMatter] = useState('');

  return (
    <Layout>
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-white mb-8">Billing Details</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-3">
            {/* Progress Section */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">PROGRESS</h3>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">1</span>
                </div>
                <span className="text-white">Billing Details</span>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">RECENT INVOICES</h3>
            </div>
          </div>

          {/* Right Column - Billing Details Form */}
          <div className="col-span-9">
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Side */}
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full bg-[#2D2D2D] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#3D3D3D] appearance-none"
                    >
                      <option value="">Select client to bill</option>
                      <option value="1">John Doe</option>
                      <option value="2">Jane Smith</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Total cost</label>
                    <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                      780,000
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Retainer fee</label>
                    <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                      100,000
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Unpaid Balance</label>
                    <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                      584,000
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter</label>
                    <select
                      value={selectedMatter}
                      onChange={(e) => setSelectedMatter(e.target.value)}
                      className="w-full bg-[#2D2D2D] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#3D3D3D] appearance-none"
                    >
                      <option value="">Select matter</option>
                      <option value="1">Contract Review</option>
                      <option value="2">Legal Consultation</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Paid amount</label>
                    <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                      116,000
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Retainer due</label>
                    <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                      25/11/2024
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment History</label>
                    <div className="bg-[#2D2D2D] rounded-lg p-4 space-y-2">
                      <div className="text-sm text-white">KSh. 300,000 on 28/11/2024</div>
                      <div className="text-sm text-white">KSh. 300,000 on 28/11/2024</div>
                      <div className="text-sm text-white">KSh. 300,000 on 28/11/2024</div>
                      <div className="text-sm text-white">KSh. 300,000 on 28/11/2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-8">
                <button className="bg-[#FFD700] text-black px-8 py-2 rounded-full hover:bg-[#FFE44D] transition-colors font-medium">
                  INVOICE
                </button>
                <button className="bg-red-600 text-white px-8 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
                  EMPTY
                </button>
                <button className="bg-[#2D2D2D] text-white px-8 py-2 rounded-full hover:bg-[#3D3D3D] transition-colors font-medium">
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 