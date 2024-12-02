import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

interface Document {
  id: string;
  title: string;
  matter: string;
  uploadDate: string;
  type: string;
  status: 'uploaded' | 'drafted' | 'generated';
  category: 'agreements' | 'briefs' | 'affidavits' | 'appeals' | 'complaints' | 'deeds';
}

const documentsData: Document[] = [
  {
    id: '1',
    title: 'Contract Agreement v1',
    matter: 'Contract Review - Company A',
    uploadDate: '2024-02-15',
    type: 'PDF',
    status: 'uploaded',
    category: 'agreements'
  },
  {
    id: '2',
    title: 'Legal Brief Draft',
    matter: 'Legal Consultation - Company B',
    uploadDate: '2024-02-14',
    type: 'DOCX',
    status: 'drafted',
    category: 'briefs'
  },
  {
    id: '3',
    title: 'AI Generated Legal Summary',
    matter: 'Case Review - Individual C',
    uploadDate: '2024-02-13',
    type: 'PDF',
    status: 'generated',
    category: 'affidavits'
  }
];

const documentCategories = [
  'all',
  'agreements',
  'briefs',
  'affidavits',
  'appeals',
  'complaints',
  'deeds'
] as const;

export default function Documents() {
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'uploaded' | 'drafted' | 'generated'>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<typeof documentCategories[number]>('all');

  const filteredDocuments = documentsData.filter(doc => {
    const matchesStatus = activeStatusFilter === 'all' || doc.status === activeStatusFilter;
    const matchesCategory = activeCategoryFilter === 'all' || doc.category === activeCategoryFilter;
    return matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploaded':
        return 'bg-[#1A4731] text-[#34D399]';
      case 'drafted':
        return 'bg-[#3F3F00] text-[#FCD34D]';
      case 'generated':
        return 'bg-[#4C0519] text-[#F87171]';
    }
  };

  return (
    <Layout>
      <div className="px-6 py-6">
        {/* Status Filters and New Document Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeStatusFilter === 'all'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveStatusFilter('uploaded')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeStatusFilter === 'uploaded'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Uploaded
            </button>
            <button
              onClick={() => setActiveStatusFilter('drafted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeStatusFilter === 'drafted'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Drafted
            </button>
            <button
              onClick={() => setActiveStatusFilter('generated')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeStatusFilter === 'generated'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Generated
            </button>
          </div>
          <Link 
            href="/docs/new"
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">New Document</span>
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

        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center space-x-3 pb-2">
            {documentCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategoryFilter === category
                    ? 'bg-[#00A3B4] text-white'
                    : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2D2D]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Upload Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Matter</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                    <td className="px-6 py-4 text-white">
                      {formatDate(doc.uploadDate)}
                    </td>
                    <td className="px-6 py-4 text-white">{doc.title}</td>
                    <td className="px-6 py-4 text-white">{doc.matter}</td>
                    <td className="px-6 py-4 text-white">{doc.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/docs/${doc.id}`}
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