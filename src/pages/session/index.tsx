import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/components/common';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'planned', label: 'Planned' }
] as const;

type FilterTab = typeof filterTabs[number]['id'];

// Mock data
const sessionsData = [
  {
    id: '1',
    date: '2024-02-15',
    duration: '1h 30m',
    matter: 'Contract Review - Company A',
    attorney: 'John Doe',
    billingRate: '$350.00',
    status: 'ongoing',
    billable: true
  },
  {
    id: '2',
    date: '2024-02-14',
    duration: '2h 15m',
    matter: 'Legal Consultation - Company B',
    attorney: 'Jane Smith',
    billingRate: '$400.00',
    status: 'completed',
    billable: true
  },
  {
    id: '3',
    date: '2024-02-13',
    duration: '45m',
    matter: 'Case Review - Individual C',
    attorney: 'Robert Johnson',
    billingRate: '$300.00',
    status: 'planned',
    billable: false
  }
];

export default function SessionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredSessions = sessionsData.filter(session => {
    if (activeTab === 'all') return true;
    return session.status === activeTab;
  });

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#00A3B4] text-white'
                    : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Link
            href="/session/new"
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors"
          >
            <span className="text-sm font-medium">New Session</span>
            <span>⚡</span>
          </Link>
        </div>

        {/* Sessions Table */}
        <Card className="bg-[#1A1A1A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2D2D]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Matter</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Attorney</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Billing Rate</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                    <td className="px-6 py-4 text-white">
                      {formatDate(session.date)}
                    </td>
                    <td className="px-6 py-4 text-white">{session.duration}</td>
                    <td className="px-6 py-4 text-white">{session.matter}</td>
                    <td className="px-6 py-4 text-white">{session.attorney}</td>
                    <td className="px-6 py-4 text-white">{session.billingRate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.status === 'ongoing'
                            ? 'bg-[#1A4731] text-[#34D399]'
                            : session.status === 'planned'
                            ? 'bg-[#3F3F00] text-[#FCD34D]'
                            : 'bg-[#4C0519] text-[#F87171]'
                        }`}
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/session/${session.id}`}
                        className="text-[#00A3B4] hover:text-[#008999] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 