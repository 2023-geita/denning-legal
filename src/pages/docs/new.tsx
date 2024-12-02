import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Select } from '@/components/common';
import type { Document, DocumentType } from '@/types/document';

const documentTypes = [
  { value: 'Agreement', label: 'Agreement' },
  { value: 'Brief', label: 'Brief' },
  { value: 'Affidavit', label: 'Affidavit' },
  { value: 'Appeal', label: 'Appeal' },
  { value: 'Complaint', label: 'Complaint' },
  { value: 'Deed', label: 'Deed' }
];

export default function NewDocument() {
  const router = useRouter();
  const [document, setDocument] = useState<Partial<Document>>({});
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Filter Tabs - Row 1 */}
        <div className="flex space-x-2 mb-2">
          <button className="filter-tab filter-tab-active">All</button>
          <button className="filter-tab filter-tab-inactive">Uploaded</button>
          <button className="filter-tab filter-tab-inactive">Drafted</button>
        </div>

        {/* Filter Tabs - Row 2 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="filter-tab filter-tab-active">All</button>
            <button className="filter-tab filter-tab-inactive">Agreements</button>
            <button className="filter-tab filter-tab-inactive">Briefs</button>
            <button className="filter-tab filter-tab-inactive">Affidavits</button>
            <button className="filter-tab filter-tab-inactive">Appeals</button>
            <button className="filter-tab filter-tab-inactive">Complaints</button>
            <button className="filter-tab filter-tab-inactive">Deeds</button>
          </div>
          <button 
            onClick={() => router.push('/docs/new')}
            className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
          >
            <span className="text-[#FFD700] mr-2">⚡</span>
            <span className="text-sm font-medium">Upload document</span>
          </button>
        </div>

        <div className="text-2xl font-medium text-white mb-6">Upload Documents</div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <span>Upload Documents</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Invoices</h3>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="flex-1 bg-[#1A1A1A]">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Doc Name</label>
                  <Select
                    options={[{ value: '', label: 'Select client to bill' }]}
                    value={document.name || ''}
                    onChange={(e) => setDocument({ ...document, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter</label>
                  <Select
                    options={[{ value: '', label: 'Select matter' }]}
                    value={document.matterId || ''}
                    onChange={(e) => setDocument({ ...document, matterId: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tag</label>
                <Select
                  options={[{ value: '', label: 'Select Tag' }]}
                  value={document.type || ''}
                  onChange={(e) => {
                    const type = e.target.value as DocumentType;
                    setDocument({ ...document, type });
                  }}
                />
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors">
                  <span className="mr-2">📎</span>
                  <span>ADD FILE</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 