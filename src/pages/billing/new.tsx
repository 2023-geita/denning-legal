import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiZap } from 'react-icons/fi';

export default function NewBilling() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6">
        {/* Status Pills & New Bill Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-[#00A3B4] text-white rounded-full text-sm">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Pending
            </button>
            <button className="px-4 py-1.5 bg-[#1E1E1E] text-gray-400 rounded-full text-sm hover:bg-[#2D2D2D]">
              Paid
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#FFD700]">⬧</span>
            <span className="text-white">New Bill</span>
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
                    <span>Billing Details</span>
                  </button>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E1E1E]">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent Invoices</h3>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 max-w-3xl">
            <Card className="bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-white mb-6">Billing Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client</label>
                  <Select
                    options={[]}
                    placeholder="Select client to bill"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter</label>
                  <Select
                    options={[]}
                    placeholder="Select matter"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total cost</label>
                  <Input
                    type="text"
                    placeholder="750,000"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Paid amount</label>
                  <Input
                    type="text"
                    placeholder="186,000"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retainer fee</label>
                  <Input
                    type="text"
                    placeholder="500,000"
                    className="bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retainer due</label>
                  <Input
                    type="date"
                    placeholder="25/10/2024"
                    className="bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Unpaid balance</label>
                <Input
                  type="text"
                  placeholder="564,000"
                  className="bg-[#2D2D2D]"
                  disabled
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Payment History</label>
                <div className="space-y-2 bg-[#2D2D2D] rounded-lg p-4">
                  {[
                    { amount: '500,000.00', date: '28/11/2024' },
                    { amount: '500,000.00', date: '28/10/2024' },
                    { amount: '500,000.00', date: '28/09/2024' },
                    { amount: '500,000.00', date: '28/08/2024' },
                  ].map((payment, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. {payment.amount}</span>
                      <span className="text-gray-500">on {payment.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="primary"
            className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
          >
            INVOICE
          </Button>
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