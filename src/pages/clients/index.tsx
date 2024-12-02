import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

const clientsData: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    joinDate: '2024-02-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+254 723 456 789',
    joinDate: '2024-02-14',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '+254 734 567 890',
    joinDate: '2024-02-13',
    status: 'inactive'
  }
];

export default function Clients() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const filteredClients = clientsData.filter(client => {
    if (activeFilter === 'all') return true;
    return client.status === activeFilter;
  });

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#1A4731] text-[#34D399]';
      case 'pending':
        return 'bg-[#3F3F00] text-[#FCD34D]';
      case 'inactive':
        return 'bg-[#4C0519] text-[#F87171]';
    }
  };

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
              onClick={() => setActiveFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'inactive'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Inactive
            </button>
          </div>
          <Link 
            href="/clients/new"
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">New Client</span>
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

        {/* Clients Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2D2D]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Join Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                    <td className="px-6 py-4 text-white">
                      {formatDate(client.joinDate)}
                    </td>
                    <td className="px-6 py-4 text-white">{client.name}</td>
                    <td className="px-6 py-4 text-white">{client.email}</td>
                    <td className="px-6 py-4 text-white">{client.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/clients/${client.id}`}
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