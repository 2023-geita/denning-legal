import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

interface Matter {
  id: string;
  title: string;
  client: string;
  date: string;
  status: 'active' | 'pending' | 'closed';
}

const mattersData: Matter[] = [
  {
    id: '1',
    title: 'Contract Review - Company A',
    client: 'John Doe',
    date: '2024-02-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Legal Consultation - Company B',
    client: 'Jane Smith',
    date: '2024-02-14',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Case Review - Individual C',
    client: 'Robert Johnson',
    date: '2024-02-13',
    status: 'closed'
  }
];

export default function Matters() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');

  const filteredMatters = mattersData.filter(matter => {
    if (activeFilter === 'all') return true;
    return matter.status === activeFilter;
  });

  return (
    <Layout>
      <div className="px-6 py-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'active'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'pending'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'closed'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Closed
            </button>
          </div>
          <Link 
            href="/matters/new"
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">New Matter</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Link>
        </div>

        {/* Matters Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2D2D]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatters.map((matter) => (
                  <tr key={matter.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                    <td className="px-6 py-4 text-white">
                      {formatDate(matter.date)}
                    </td>
                    <td className="px-6 py-4 text-white">{matter.title}</td>
                    <td className="px-6 py-4 text-white">{matter.client}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          matter.status === 'active'
                            ? 'bg-[#1A4731] text-[#34D399]'
                            : matter.status === 'pending'
                            ? 'bg-[#3F3F00] text-[#FCD34D]'
                            : 'bg-[#4C0519] text-[#F87171]'
                        }`}
                      >
                        {matter.status.charAt(0).toUpperCase() + matter.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/matters/${matter.id}`}
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
        </div>
      </div>
    </Layout>
  );
} 