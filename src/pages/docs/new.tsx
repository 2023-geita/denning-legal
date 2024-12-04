import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import type { Document, DocumentType } from '@/types/document';

interface FormData {
  name: string;
  type: DocumentType;
  matterId: string;
  matterName: string;
  uploadedBy: string;
  tags: string[];
}

export default function NewDocument() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('upload');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'Agreement',
    matterId: '',
    matterName: '',
    uploadedBy: '',
    tags: []
  });

  const documentTypes = [
    { value: 'Agreement', label: 'Agreement' },
    { value: 'Brief', label: 'Brief' },
    { value: 'Affidavit', label: 'Affidavit' },
    { value: 'Appeal', label: 'Appeal' },
    { value: 'Complaint', label: 'Complaint' },
    { value: 'Deed', label: 'Deed' }
  ];

  const sections = [
    { id: 'upload', label: 'Upload Document', icon: '📄' },
    { id: 'draft', label: 'Draft Document', icon: '✏️' }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'uploaded', label: 'Uploaded' },
    { id: 'drafted', label: 'Drafted' },
    { id: 'generated', label: 'Generated' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement form submission
      router.push('/docs');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === 'draft') {
      router.push('/docs/draft/new');
    } else {
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100; // Offset for header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    router.push({
      pathname: '/docs',
      query: { filter: filterId }
    });
  };

  return (
    <Layout>
      <div className="min-h-screen p-6">
        {/* Header with Save Button */}
        <div className="sticky top-0 bg-black z-10 pb-4 border-b border-[#2D2D2D]">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`filter-tab ${
                    activeFilter === filter.id ? 'filter-tab-active' : 'filter-tab-inactive'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <Button variant="primary" onClick={handleSubmit}>
              SAVE
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          {/* Left Sidebar - Fixed */}
          <div className="w-64 shrink-0">
            <Card className="bg-[#1A1A1A] sticky top-[100px]">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-[#2D2D2D] text-[#FFD700]'
                          : 'hover:bg-[#2D2D2D] text-white'
                      }`}
                    >
                      <span className={activeSection === section.id ? 'text-[#FFD700]' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span>
                        {section.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl flex-1">
            <Card className="bg-[#1A1A1A]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Document Name"
                    placeholder="Enter document name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <Select
                    label="Document Type"
                    options={documentTypes}
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as DocumentType)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Matter ID"
                    placeholder="Select matter"
                    value={formData.matterId}
                    onChange={(e) => handleInputChange('matterId', e.target.value)}
                  />
                  <Input
                    label="Matter Name"
                    placeholder="Matter name will appear here"
                    value={formData.matterName}
                    onChange={(e) => handleInputChange('matterName', e.target.value)}
                    disabled
                  />
                </div>

                <Input
                  label="Uploaded By"
                  placeholder="Search attorney by name"
                  value={formData.uploadedBy}
                  onChange={(e) => handleInputChange('uploadedBy', e.target.value)}
                />

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-[#2D2D2D] rounded-lg px-3 py-1"
                      >
                        <span className="text-white mr-2">{tag}</span>
                        <button
                          onClick={() => {
                            const newTags = formData.tags.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, tags: newTags }));
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <Input
                      placeholder="Add tag"
                      value=""
                      onChange={(e) => {
                        if (e.target.value.endsWith(',')) {
                          const newTag = e.target.value.slice(0, -1).trim();
                          if (newTag && !formData.tags.includes(newTag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, newTag]
                            }));
                          }
                          e.target.value = '';
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Press comma (,) to add a tag
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
} 