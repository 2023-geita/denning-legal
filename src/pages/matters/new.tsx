import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/common';
import type { Matter, MatterDeadline, SubscribedAttorney } from '@/types/matter';

const sections = [
  { id: 'details', label: 'Matter Details' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'attorneys', label: 'Subscribed attorneys' },
  { id: 'billing', label: 'Billing details' },
  { id: 'documents', label: 'Related documents' }
];

export default function NewMatter() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Form state
  const [formData, setFormData] = useState({
    client: '',
    status: 'Open',
    notes: '',
    originatingAttorney: '',
    responsibleAttorney: '',
    courtLocation: '',
    practiceArea: '',
    caseNumber: '',
    deadlines: {
      matterOpens: '',
      matterCloses: '',
      matterDue: '',
      statuteOfLimitations: ''
    },
    subscribedAttorneys: [] as string[],
    billingDetails: {
      rate: '',
      billingType: '',
      retainer: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeadlineChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      deadlines: {
        ...prev.deadlines,
        [field]: value
      }
    }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('Starting matter creation...');
      console.log('Form data:', formData);

      // Validate required fields
      if (!formData.client.trim()) {
        setError('Client name is required');
        return;
      }

      const requestData = {
        client: formData.client,
        status: formData.status,
        notes: formData.notes,
        originatingAttorney: formData.originatingAttorney,
        responsibleAttorney: formData.responsibleAttorney,
        courtLocation: formData.courtLocation,
        practiceArea: formData.practiceArea,
        caseNumber: formData.caseNumber,
      };

      console.log('Sending request with data:', requestData);

      const response = await fetch('/api/matters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create matter');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to create matter');
      }

      console.log('Matter created successfully:', data.data);
      await router.push('/matters');
    } catch (error) {
      console.error('Error creating matter:', error);
      setError(error instanceof Error ? error.message : 'Failed to create matter');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better highlighting

      // Find the current section
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = element.offsetTop - 100; // Adjust offset as needed
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Top Filter Tabs */}
        <div className="sticky top-16 z-10 bg-black px-6 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#00A3B4] text-white">All</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Open</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Pending</button>
              <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]">Closed</button>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium">{isSubmitting ? 'Saving...' : 'Save Matter'}</span>
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 pb-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Static */}
            <div className="w-64 shrink-0">
              <div className="sticky top-48">
                <div className="rounded-xl bg-[#1A1A1A]/50 p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            activeSection === section.id ? 'bg-[#FFD700]' : 'bg-gray-400'
                          }`} />
                          <span className={`transition-colors duration-200 ${
                            activeSection === section.id ? 'text-[#FFD700]' : 'text-gray-400'
                          }`}>
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Updates</h3>
                    {/* Recent updates content */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-6">
              {/* Matter Details Section */}
              <div 
                ref={el => sectionRefs.current['details'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Matter Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
                      <Input
                        value={formData.client}
                        onChange={(e) => handleInputChange('client', e.target.value)}
                        placeholder="Select Client"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Matter Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full bg-[#2D2D2D] text-white rounded-lg p-3"
                      >
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Enter Matter description"
                      className="w-full h-32 bg-[#2D2D2D] text-white rounded-lg p-3 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Originating attorney</label>
                      <Input
                        value={formData.originatingAttorney}
                        onChange={(e) => handleInputChange('originatingAttorney', e.target.value)}
                        placeholder="Search attorney by name"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Responsible attorney</label>
                      <Input
                        value={formData.responsibleAttorney}
                        onChange={(e) => handleInputChange('responsibleAttorney', e.target.value)}
                        placeholder="Search attorney by name"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Court Location</label>
                      <Input
                        value={formData.courtLocation}
                        onChange={(e) => handleInputChange('courtLocation', e.target.value)}
                        placeholder="Search court"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Practice Area</label>
                      <Input
                        value={formData.practiceArea}
                        onChange={(e) => handleInputChange('practiceArea', e.target.value)}
                        placeholder="Select Practice Area"
                        className="bg-[#2D2D2D] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Case Number</label>
                    <Input
                      value={formData.caseNumber}
                      onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                      placeholder="As provided by the judiciary"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Deadlines Section */}
              <div 
                ref={el => sectionRefs.current['deadlines'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Deadlines</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter opens</label>
                    <Input
                      type="date"
                      value={formData.deadlines.matterOpens}
                      onChange={(e) => handleDeadlineChange('matterOpens', e.target.value)}
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter closes</label>
                    <Input
                      type="date"
                      value={formData.deadlines.matterCloses}
                      onChange={(e) => handleDeadlineChange('matterCloses', e.target.value)}
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Matter due</label>
                    <Input
                      type="date"
                      value={formData.deadlines.matterDue}
                      onChange={(e) => handleDeadlineChange('matterDue', e.target.value)}
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Statute of limitations date</label>
                    <Input
                      type="date"
                      value={formData.deadlines.statuteOfLimitations}
                      onChange={(e) => handleDeadlineChange('statuteOfLimitations', e.target.value)}
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Details Section */}
              <div 
                ref={el => sectionRefs.current['billing'] = el}
                className="rounded-xl bg-[#1A1A1A]/50 p-6"
              >
                <h2 className="text-xl font-medium text-white mb-6">Billing Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Billing Rate</label>
                    <Input
                      type="number"
                      value={formData.billingDetails.rate}
                      onChange={(e) => handleBillingChange('rate', e.target.value)}
                      placeholder="Enter hourly rate"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Billing Type</label>
                    <select
                      value={formData.billingDetails.billingType}
                      onChange={(e) => handleBillingChange('billingType', e.target.value)}
                      className="w-full bg-[#2D2D2D] text-white rounded-lg p-3"
                    >
                      <option value="">Select billing type</option>
                      <option value="hourly">Hourly</option>
                      <option value="fixed">Fixed Fee</option>
                      <option value="contingency">Contingency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Retainer Amount</label>
                    <Input
                      type="number"
                      value={formData.billingDetails.retainer}
                      onChange={(e) => handleBillingChange('retainer', e.target.value)}
                      placeholder="Enter retainer amount"
                      className="bg-[#2D2D2D] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 