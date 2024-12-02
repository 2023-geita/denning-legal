import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Input, Button } from '@/components/common';
import type { Client, ClientType } from '@/types/client';

export default function NewClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Individual' as ClientType,
    email: '',
    phone: '',
    location: '',
    responsibleAttorney: '',
    status: 'Active' as Client['status'],
  });

  const handleInputChange = (field: string, value: string) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Client name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.type) {
      setError('Client type is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Get the base URL
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/clients`;

      console.log('Sending request to:', apiUrl);
      console.log('Request data:', formData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          type: formData.type,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          responsibleAttorney: formData.responsibleAttorney.trim(),
          status: formData.status,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Try to get the error text
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create client');
      }

      // Redirect on success
      await router.push('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      setError(error instanceof Error ? error.message : 'Failed to create client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="sticky top-16 z-10 bg-black px-6 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">New Client</h1>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium">
                {isSubmitting ? 'Saving...' : 'Save Client'}
              </span>
              <span>⚡</span>
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        <form className="px-6 pb-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-xl bg-[#1A1A1A]/50 p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter client name"
                  className="bg-[#2D2D2D] text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ClientType)}
                  className="w-full bg-[#2D2D2D] text-white rounded-lg p-3"
                  required
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="bg-[#2D2D2D] text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-[#2D2D2D] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter client location"
                className="bg-[#2D2D2D] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Responsible Attorney</label>
                <Input
                  value={formData.responsibleAttorney}
                  onChange={(e) => handleInputChange('responsibleAttorney', e.target.value)}
                  placeholder="Search attorney by name"
                  className="bg-[#2D2D2D] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as Client['status'])}
                  className="w-full bg-[#2D2D2D] text-white rounded-lg p-3"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 