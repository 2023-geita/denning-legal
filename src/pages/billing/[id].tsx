import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { Bill } from '@/types/billing';
import { FiCircle, FiCheckCircle } from 'react-icons/fi';

const sections = [
  { id: 'billing', label: 'Billing Details', icon: FiCheckCircle },
];

export default function BillDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [bill, setBill] = useState<Bill | null>(null);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Filter Tabs and New Bill Button */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 rounded-full text-sm bg-[#00A3B4] text-white">
              All
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm bg-[#1A1A1A] text-white border border-gray-700">
              Pending
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm bg-[#1A1A1A] text-white border border-gray-700">
              Paid
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-surface-light transition-colors">
            <span className="text-[#FFD700] mr-2">⚡</span>
            <span className="text-sm font-medium">New Bill</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="flex-1 bg-[#1A1A1A]">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client</label>
                  <div className="bg-[#2D2D2D] rounded-lg px-4 py-2 text-white">
                    Select client to bill
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter</label>
                  <div className="bg-[#2D2D2D] rounded-lg px-4 py-2 text-white">
                    Select matter
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total cost</label>
                  <Input
                    value="780,000"
                    className="bg-[#2D2D2D] border-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Paid amount</label>
                  <Input
                    value="116,000"
                    className="bg-[#2D2D2D] border-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retainer fee</label>
                  <Input
                    value="100,000"
                    className="bg-[#2D2D2D] border-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retainer due</label>
                  <Input
                    type="date"
                    value="2024-11-25"
                    className="bg-[#2D2D2D] border-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Unpaid Balance</label>
                  <Input
                    value="584,000"
                    className="bg-[#2D2D2D] border-0"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Payment History</label>
                  <div className="bg-[#2D2D2D] rounded-lg p-3 space-y-1">
                    <p className="text-sm text-gray-400">RM. 300,000 on 28/11/2024</p>
                    <p className="text-sm text-gray-400">RM. 300,000 on 28/11/2024</p>
                    <p className="text-sm text-gray-400">RM. 300,000 on 28/11/2024</p>
                    <p className="text-sm text-gray-400">RM. 200,000 on 28/11/2024</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button 
            variant="danger" 
            className="bg-red-600 hover:bg-red-700"
          >
            EMPTY
          </Button>
          <Button className="bg-[#2D2D2D] hover:bg-[#3D3D3D]">
            SAVE
          </Button>
          <Button className="bg-[#FFD700] hover:bg-[#FFE033] text-black">
            INVOICE
          </Button>
        </div>
      </div>
    </Layout>
  );
} 