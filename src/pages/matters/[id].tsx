import React, { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [matterData, setMatterData] = useState<Partial<Matter>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const fetchMatterData = async () => {
        try {
          setIsLoading(true);
          console.log('Fetching matter data for ID:', id);
          const response = await fetch(`/api/matters/${id}`);
          const data = await response.json();
          console.log('Fetched matter data:', data);
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch matter data');
          }
          
          setMatterData(data);
        } catch (error) {
          console.error('Error fetching matter:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch matter');
        } finally {
          setIsLoading(false);
        }
      };

      fetchMatterData();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid matter ID');
      return;
    }

    try {
      setError('');
      setIsSaving(true);
      console.log('Starting save operation...');
      console.log('Matter ID:', id);
      console.log('Matter data to save:', matterData);

      const requestBody = {
        client: matterData.client || '',
        status: matterData.status || 'Open',
        notes: matterData.notes || '',
        originatingAttorney: matterData.originatingAttorney || '',
        responsibleAttorney: matterData.responsibleAttorney || '',
        courtLocation: matterData.courtLocation || '',
        practiceArea: matterData.practiceArea || '',
        caseNumber: matterData.caseNumber || '',
      };

      console.log('Request body:', requestBody);
      console.log('Making PUT request to:', `/api/matters/${id}`);

      const response = await fetch(`/api/matters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Update local state with server response
      console.log('Updating local state with:', data);
      setMatterData(data);
      setIsEditing(false);
      alert('Matter updated successfully');

      // Refresh the page data
      console.log('Refreshing page data...');
      router.replace(router.asPath);
    } catch (error) {
      console.error('Error in handleSave:', error);
      setError(error instanceof Error ? error.message : 'Failed to update matter');
      alert('Failed to update matter: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading matter details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="filter-tab filter-tab-active">All</button>
            <button className="filter-tab filter-tab-inactive">Open</button>
            <button className="filter-tab filter-tab-inactive">Pending</button>
            <button className="filter-tab filter-tab-inactive">Closed</button>
          </div>
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-[#1A4731] text-[#34D399] rounded-lg hover:bg-[#1A4731]/80 transition-colors disabled:opacity-50"
                >
                  <span className="text-sm font-medium">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-[#4C0519] text-[#F87171] rounded-lg hover:bg-[#4C0519]/80 transition-colors disabled:opacity-50"
                >
                  <span className="text-sm font-medium">Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
              >
                <span className="text-[#FFD700] mr-2">✎</span>
                <span className="text-sm font-medium">Edit Matter</span>
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
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
          </div>
        </div>
      </div>
    </Layout>
  );
} 