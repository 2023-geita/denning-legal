import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import type { Matter } from '@/types/matter';

interface FormData {
  client: string;
  status: Matter['status'];
  notes: string;
  originatingAttorney: string;
  responsibleAttorney: string;
  courtLocation: string;
  practiceArea: string;
  caseNumber: string;
  matterOpens: string;
  matterCloses: string;
  matterDue: string;
  statuteOfLimitations: string;
  subscribedAttorneys: string[];
}

export default function NewMatter() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('details');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState<FormData>({
    client: '',
    status: 'Open',
    notes: '',
    originatingAttorney: '',
    responsibleAttorney: '',
    courtLocation: '',
    practiceArea: '',
    caseNumber: '',
    matterOpens: '',
    matterCloses: '',
    matterDue: '',
    statuteOfLimitations: '',
    subscribedAttorneys: []
  });

  const sections = [
    { id: 'details', label: 'Matter Details', icon: '⚡' },
    { id: 'deadlines', label: 'Deadlines', icon: '📅' },
    { id: 'attorneys', label: 'Subscribed attorneys', icon: '👥' },
    { id: 'billing', label: 'Billing details', icon: '💰' },
    { id: 'documents', label: 'Related documents', icon: '📄' }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'closed', label: 'Closed' }
  ];

  // Handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      const currentSection = sectionElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement form submission
      router.push('/matters');
    } catch (error) {
      console.error('Error creating matter:', error);
    }
  };

  const handleSectionChange = (sectionId: string) => {
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
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    router.push({
      pathname: '/matters',
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
            <div className="space-y-6">
              <div id="details" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Client"
                        placeholder="Select Client"
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                      />
                      <Select
                        label="Matter Status"
                        options={[
                          { value: 'Open', label: 'Open' },
                          { value: 'Pending', label: 'Pending' },
                          { value: 'Closed', label: 'Closed' }
                        ]}
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as Matter['status'])}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Matter Notes</label>
                      <textarea
                        placeholder="Enter Matter description"
                        className="w-full h-32 bg-[#2D2D2D] border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 resize-none"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Originating attorney"
                        placeholder="Search attorney by name"
                        value={formData.originatingAttorney}
                        onChange={(e) => handleInputChange('originatingAttorney', e.target.value)}
                      />
                      <Input
                        label="Responsible attorney"
                        placeholder="Search attorney by name"
                        value={formData.responsibleAttorney}
                        onChange={(e) => handleInputChange('responsibleAttorney', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Court Location"
                        placeholder="Search court"
                        value={formData.courtLocation}
                        onChange={(e) => handleInputChange('courtLocation', e.target.value)}
                      />
                      <Input
                        label="Practice Area"
                        placeholder="Select Practice Area"
                        value={formData.practiceArea}
                        onChange={(e) => handleInputChange('practiceArea', e.target.value)}
                      />
                    </div>

                    <Input
                      label="Case Number"
                      placeholder="As provided by the judiciary"
                      value={formData.caseNumber}
                      onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                    />
                  </div>
                </Card>
              </div>

              <div id="deadlines" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Matter opens"
                        type="date"
                        value={formData.matterOpens}
                        onChange={(e) => handleInputChange('matterOpens', e.target.value)}
                      />
                      <Input
                        label="Matter closes"
                        type="date"
                        value={formData.matterCloses}
                        onChange={(e) => handleInputChange('matterCloses', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Matter due"
                        type="date"
                        value={formData.matterDue}
                        onChange={(e) => handleInputChange('matterDue', e.target.value)}
                      />
                      <Input
                        label="Statute of limitations date"
                        type="date"
                        value={formData.statuteOfLimitations}
                        onChange={(e) => handleInputChange('statuteOfLimitations', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <div id="attorneys" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Attorney Name</label>
                      <Input
                        placeholder="Search attorney by name"
                        value=""
                        onChange={() => {}}
                      />
                      <div className="mt-4">
                        {formData.subscribedAttorneys.map((attorney, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-[#2D2D2D] rounded-lg px-3 py-1 mr-2 mb-2"
                          >
                            <span className="text-white mr-2">{attorney}</span>
                            <button
                              onClick={() => {
                                const newAttorneys = formData.subscribedAttorneys.filter((_, i) => i !== index);
                                handleInputChange('subscribedAttorneys', newAttorneys);
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div id="billing" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Client"
                        placeholder="Select client to bill"
                        value=""
                        onChange={() => {}}
                      />
                      <Input
                        label="Total cost"
                        type="number"
                        placeholder="Enter amount"
                        value=""
                        onChange={() => {}}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Retainer fee"
                        type="number"
                        placeholder="Enter amount"
                        value=""
                        onChange={() => {}}
                      />
                      <Input
                        label="Retainer due"
                        type="date"
                        value=""
                        onChange={() => {}}
                      />
                    </div>

                    <Input
                      label="Unpaid Balance"
                      type="number"
                      placeholder="Enter amount"
                      value=""
                      onChange={() => {}}
                      disabled
                    />

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Payment History</label>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div>ksh. 200,000 on 28/11/2023</div>
                        <div>ksh. 200,000 on 28/11/2023</div>
                        <div>ksh. 200,000 on 28/11/2023</div>
                        <div>ksh. 200,000 on 28/11/2023</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div id="documents" className="scroll-mt-[100px]">
                <Card className="bg-[#1A1A1A]">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Paste url"
                          value=""
                          onChange={() => {}}
                        />
                      </div>
                      <span className="text-gray-400">or add from Local files</span>
                      <Button variant="secondary">ADD FILE</Button>
                    </div>
                    <div>
                      <Button variant="primary">Upload</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 