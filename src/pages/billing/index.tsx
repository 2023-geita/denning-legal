import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/components/common';

export default function Billing() {
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
          <Button 
            variant="primary"
            onClick={() => router.push('/billing/new')}
            className="flex items-center space-x-2"
          >
            <span className="text-[#FFD700]">⬧</span>
            <span>New Bill</span>
          </Button>
        </div>

        {/* Billing Table */}
        <Card className="bg-[#1E1E1E]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Matter</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Total Cost</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {/* Empty state message */}
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No bills available. Create a new bill to get started.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 