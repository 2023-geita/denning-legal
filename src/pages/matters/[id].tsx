import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { Matter } from '@/types/matter';

const sections = [
  { id: 'details', label: 'Matter Details' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'attorneys', label: 'Subscribed attorneys' },
  { id: 'billing', label: 'Billing details' },
  { id: 'documents', label: 'Related documents' }
];

export default function MatterDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState('details');
  const [isEditing, setIsEditing] = useState(!id);
  const [matterData, setMatterData] = useState<Partial<Matter>>({});

  const handleSave = async () => {
    // Save implementation
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Filter Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="filter-tab filter-tab-active">All</button>
            <button className="filter-tab filter-tab-inactive">Open</button>
            <button className="filter-tab filter-tab-inactive">Pending</button>
            <button className="filter-tab filter-tab-inactive">Closed</button>
          </div>
          <button 
            onClick={() => router.push('/matters/new')}
            className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
          >
            <span className="text-[#FFD700] mr-2">⚡</span>
            <span className="text-sm font-medium">New Matter</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'text-[#FFD700]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activeSection === section.id ? 'bg-[#FFD700]' : 'bg-gray-400'
                    }`} />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Updates</h3>
              {/* Recent updates would go here */}
            </div>
          </Card>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Matter Details Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Client"
                    placeholder="Select Client"
                    value={matterData?.client || ''}
                    onChange={(e) => setMatterData({ ...matterData, client: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Select
                    label="Matter Status"
                    options={[
                      { value: 'Open', label: 'Open' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Closed', label: 'Closed' }
                    ]}
                    value={matterData?.status || ''}
                    onChange={(e) => setMatterData({ ...matterData, status: e.target.value as Matter['status'] })}
                    disabled={!isEditing}
                  />
                </div>

                <Input
                  label="Matter Notes"
                  placeholder="Enter Matter description"
                  value={matterData?.notes || ''}
                  onChange={(e) => setMatterData({ ...matterData, notes: e.target.value })}
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Originating attorney"
                    placeholder="Search attorney by name"
                    value={matterData?.originatingAttorney || ''}
                    onChange={(e) => setMatterData({ ...matterData, originatingAttorney: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Responsible attorney"
                    placeholder="Search attorney by name"
                    value={matterData?.responsibleAttorney || ''}
                    onChange={(e) => setMatterData({ ...matterData, responsibleAttorney: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Court Location"
                    placeholder="Search court"
                    value={matterData?.courtLocation || ''}
                    onChange={(e) => setMatterData({ ...matterData, courtLocation: e.target.value })}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Practice Area"
                    placeholder="Select Practice Area"
                    value={matterData?.practiceArea || ''}
                    onChange={(e) => setMatterData({ ...matterData, practiceArea: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <Input
                  label="Case Number"
                  placeholder="As provided by the judiciary"
                  value={matterData?.caseNumber || ''}
                  onChange={(e) => setMatterData({ ...matterData, caseNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </Card>

            {/* Deadlines Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Matter opens"
                    type="date"
                    placeholder="Select date"
                    disabled={!isEditing}
                  />
                  <Input
                    label="Matter closes"
                    type="date"
                    placeholder="Select date"
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Matter due"
                    type="date"
                    placeholder="Select date"
                    disabled={!isEditing}
                  />
                  <Input
                    label="Statute of limitations date"
                    type="date"
                    placeholder="Select date"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Subscribed Attorneys Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-4">
                <Input
                  label="Attorney Name"
                  placeholder="Search attorney by name"
                  disabled={!isEditing}
                />
                <div className="flex items-center space-x-2 bg-surface-dark rounded-lg px-3 py-2">
                  <span className="text-primary">Kevin Dela</span>
                  <button className="text-gray-400 hover:text-white">×</button>
                </div>
              </div>
            </Card>

            {/* Billing Details Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Client"
                    placeholder="Select client to bill"
                    disabled={!isEditing}
                  />
                  <Input
                    label="Total cost"
                    type="number"
                    placeholder="750,000"
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Retainer fee"
                    type="number"
                    placeholder="150,000"
                    disabled={!isEditing}
                  />
                  <Input
                    label="Retainer due"
                    type="date"
                    placeholder="25/12/2024"
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Unpaid Balance"
                    type="number"
                    placeholder="584,000"
                    disabled
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment History
                    </label>
                    <div className="bg-surface-dark rounded-lg p-3 space-y-1">
                      <p className="text-sm text-gray-400">KSh. 100,000 on 28/11/2023</p>
                      <p className="text-sm text-gray-400">KSh. 200,000 on 28/11/2023</p>
                      <p className="text-sm text-gray-400">KSh. 300,000 on 28/11/2023</p>
                      <p className="text-sm text-gray-400">KSh. 200,000 on 28/11/2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents Section */}
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Add doc from online source</p>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Paste url"
                        className="flex-1"
                      />
                      <Button variant="secondary">Import</Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-400">or add from</span>
                    <Button variant="secondary">Local files</Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="danger">Empty</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
} 