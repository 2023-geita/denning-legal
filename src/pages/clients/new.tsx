import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import type { Client, ClientType } from '@/types/client';

interface FormData {
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  location: string;
  responsibleAttorney: string;
  status: Client['status'];
}

export default function NewClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'Individual',
    email: '',
    phone: '',
    location: '',
    responsibleAttorney: '',
    status: 'Active'
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement form submission
      router.push('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6">
        {/* Header with Save Button */}
        <div className="sticky top-0 bg-black z-10 pb-4 border-b border-[#2D2D2D]">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="filter-tab filter-tab-active">All</button>
              <button className="filter-tab filter-tab-inactive">Active</button>
              <button className="filter-tab filter-tab-inactive">Inactive</button>
            </div>
            <Button variant="primary" onClick={handleSubmit}>
              SAVE
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 max-w-4xl mx-auto">
          <Card className="bg-[#1A1A1A]">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Client Name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <Select
                  label="Client Type"
                  options={[
                    { value: 'Individual', label: 'Individual' },
                    { value: 'Company', label: 'Company' }
                  ]}
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ClientType)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <Input
                label="Location"
                placeholder="Enter client location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Responsible Attorney"
                  placeholder="Search attorney by name"
                  value={formData.responsibleAttorney}
                  onChange={(e) => handleInputChange('responsibleAttorney', e.target.value)}
                />
                <Select
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' }
                  ]}
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as Client['status'])}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 