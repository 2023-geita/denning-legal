import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Select, Input } from '@/components/common';

export default function NewBill() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMatter, setSelectedMatter] = useState('');

  const clientOptions = [
    { value: '', label: 'Select client to bill' },
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' }
  ];

  const matterOptions = [
    { value: '', label: 'Select matter' },
    { value: '1', label: 'Contract Review' },
    { value: '2', label: 'Legal Consultation' }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">New Bill</h1>
            <p className="mt-2 text-sm text-gray-400">Create a new bill for client matter</p>
          </div>

          {/* Main Card */}
          <Card className="bg-[#1A1A1A] p-6">
            <div className="space-y-6">
              {/* Client and Matter Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                  <Select
                    options={clientOptions}
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Matter</label>
                  <Select
                    options={matterOptions}
                    value={selectedMatter}
                    onChange={(e) => setSelectedMatter(e.target.value)}
                  />
                </div>
              </div>

              {/* Billing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Total Cost</label>
                  <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                    KSh 780,000
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Paid Amount</label>
                  <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                    KSh 116,000
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Retainer Fee</label>
                  <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                    KSh 100,000
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Retainer Due</label>
                  <Input
                    type="date"
                    className="bg-[#2D2D2D] text-white w-full"
                  />
                </div>
              </div>

              {/* Unpaid Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Unpaid Balance</label>
                <div className="bg-[#2D2D2D] text-white rounded-lg px-4 py-3">
                  KSh 584,000
                </div>
              </div>

              {/* Payment History */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Payment History</label>
                <div className="bg-[#2D2D2D] rounded-lg p-4 space-y-2">
                  <div className="text-sm text-white">KSh 300,000 on 28/11/2024</div>
                  <div className="text-sm text-white">KSh 300,000 on 28/11/2024</div>
                  <div className="text-sm text-white">KSh 300,000 on 28/11/2024</div>
                  <div className="text-sm text-white">KSh 300,000 on 28/11/2024</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
                <Button variant="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button variant="danger">
                  Empty
                </Button>
                <Button variant="primary">
                  Create Bill
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 