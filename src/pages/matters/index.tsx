import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { formatDate } from '@/utils/format';
import type { Matter } from '@/types/matter';

export default function Matters() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Open' | 'Pending' | 'Closed'>('all');
  const [matters, setMatters] = useState<Matter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatters = async () => {
      try {
        const response = await fetch('/api/matters');
        if (!response.ok) {
          throw new Error('Failed to fetch matters');
        }
        const data = await response.json();
        setMatters(data);
      } catch (error) {
        console.error('Error fetching matters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatters();
  }, []);

  const filteredMatters = matters.filter(matter => {
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
              onClick={() => setActiveFilter('Open')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'Open'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveFilter('Pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'Pending'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('Closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'Closed'
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
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Case Number</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Practice Area</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      Loading matters...
                    </td>
                  </tr>
                ) : filteredMatters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      No matters found
                    </td>
                  </tr>
                ) : (
                  filteredMatters.map((matter) => (
                    <tr key={matter.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                      <td className="px-6 py-4 text-white">
                        {formatDate(matter.createdAt.toString())}
                      </td>
                      <td className="px-6 py-4 text-white">{matter.client}</td>
                      <td className="px-6 py-4 text-white">{matter.caseNumber}</td>
                      <td className="px-6 py-4 text-white">{matter.practiceArea}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            matter.status === 'Open'
                              ? 'bg-[#1A4731] text-[#34D399]'
                              : matter.status === 'Pending'
                              ? 'bg-[#3F3F00] text-[#FCD34D]'
                              : 'bg-[#4C0519] text-[#F87171]'
                          }`}
                        >
                          {matter.status}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
} 