import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { clientSchema } from '@/lib/validations/form';

type FormData = z.infer<typeof clientSchema>;

export default function NewClient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create client');
      }

      reset();
      // Handle success (e.g., show notification, redirect)
    } catch (error) {
      // Handle error (e.g., show error notification)
      console.error('Error creating client:', error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#1A1A1A] p-4 sm:p-6">
        {/* Left Section - Progress */}
        <div className="w-full lg:w-1/4 lg:pr-8 mb-6 lg:mb-0">
          <div className="bg-[#2D2D2D] rounded-2xl p-6">
            <h2 className="text-gray-400 uppercase text-sm font-medium mb-4">Progress</h2>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-2 h-2 bg-[#FFB800] rounded-full"></div>
              <span>Client Details</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-gray-400 uppercase text-sm font-medium mb-4">Recent Sessions</h2>
            {/* Recent sessions content would go here */}
          </div>
        </div>

        {/* Right Section - Client Details Form */}
        <div className="w-full lg:w-3/4">
          <h1 className="text-white text-xl font-medium mb-6">Client Details</h1>
          
          <div className="bg-[#2D2D2D] rounded-2xl p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Client Name"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Enter client name"
                />

                <Select
                  label="Client Status"
                  {...register('type')}
                  error={errors.type?.message}
                  options={[
                    { value: 'Individual', label: 'Individual' },
                    { value: 'Company', label: 'Company' }
                  ]}
                />

                <Input
                  label="Phone Number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="+254 700 000 000"
                  type="tel"
                />

                <Input
                  label="Email Address"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="Enter email address"
                  type="email"
                />

                <Input
                  label="Location"
                  {...register('location')}
                  error={errors.location?.message}
                  placeholder="Enter client location"
                />

                <Select
                  label="Responsible Attorney"
                  {...register('responsibleAttorney')}
                  error={errors.responsibleAttorney?.message}
                  options={[
                    { value: 'attorney1', label: 'Jane Smith' },
                    { value: 'attorney2', label: 'John Doe' }
                  ]}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="bg-[#FF0000] text-white px-6 py-2.5 rounded-lg hover:bg-[#CC0000] transition-colors"
                >
                  EMPTY
                </button>
                <button
                  type="submit"
                  className="bg-[#2D2D2D] text-white px-6 py-2.5 rounded-lg hover:bg-[#3D3D3D] transition-colors"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 