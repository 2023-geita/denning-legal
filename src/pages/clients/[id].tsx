import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { Client, ClientMatter, ClientBilling } from '@/types/client';
import { FiFileText, FiDollarSign } from 'react-icons/fi';

const sections = [
  { id: 'details', label: 'Client Details' },
  { id: 'matters', label: 'Related Matters' },
  { id: 'billing', label: 'Billing History' },
];

const clientTypeOptions = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Company', label: 'Company' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [activeSection, setActiveSection] = useState('details');
  const [client, setClient] = useState<Client | null>(null);
  const [matters, setMatters] = useState<ClientMatter[]>([]);
  const [billing, setBilling] = useState<ClientBilling | null>(null);
  const [isEditing, setIsEditing] = useState(!id);

  const handleSave = () => {
    // Save client logic here
    router.push('/clients');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-white">
            {id ? 'Client Details' : 'New Client'}
          </h1>
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Client</Button>
          </div>
        </div>

        <Card>
          <div className="flex space-x-6">
            <div className="w-64 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:bg-surface-light'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="flex-1">
              {activeSection === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Client Name"
                      placeholder="Enter client name"
                      value={client?.name}
                      disabled={!isEditing}
                    />
                    <Select
                      label="Client Type"
                      options={clientTypeOptions}
                      value={client?.type}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter email address"
                      value={client?.email}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Phone Number"
                      placeholder="+254 700 000 000"
                      value={client?.phone}
                      disabled={!isEditing}
                    />
                  </div>

                  <Input
                    label="Location"
                    placeholder="Enter client location"
                    value={client?.location}
                    disabled={!isEditing}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Responsible Attorney"
                      placeholder="Search attorney by name"
                      value={client?.responsibleAttorney}
                      disabled={!isEditing}
                    />
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={client?.status}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'matters' && (
                <div className="space-y-4">
                  {matters.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-3 bg-surface-dark inline-block rounded-lg mb-4">
                        <FiFileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400">No matters found</p>
                      <Link href="/matters/new" className="mt-4 inline-block">
                        <Button variant="primary">Create Matter</Button>
                      </Link>
                    </div>
                  ) : (
                    matters.map((matter) => (
                      <Card key={matter.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {matter.matterName}
                            </h3>
                            <p className="text-gray-400 mt-1">
                              Started {new Date(matter.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              matter.status === 'Active'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }`}
                          >
                            {matter.status}
                          </span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeSection === 'billing' && (
                <div className="space-y-6">
                  {billing ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <FiDollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Total Billed</p>
                              <p className="text-2xl font-bold text-white">
                                ${billing.totalBilled.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card>
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                              <FiDollarSign className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Total Paid</p>
                              <p className="text-2xl font-bold text-white">
                                ${billing.totalPaid.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card>
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-red-500/10 rounded-lg">
                              <FiDollarSign className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Outstanding</p>
                              <p className="text-2xl font-bold text-white">
                                ${billing.outstandingAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <Card>
                        <h3 className="text-lg font-medium text-white mb-4">
                          Payment History
                        </h3>
                        {billing.lastPaymentDate ? (
                          <p className="text-gray-400">
                            Last payment received on{' '}
                            {new Date(billing.lastPaymentDate).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-gray-400">No payments recorded</p>
                        )}
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-3 bg-surface-dark inline-block rounded-lg mb-4">
                        <FiDollarSign className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400">No billing information found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {id && (
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel Edit
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit Client
                </Button>
                <Button variant="danger">Delete Client</Button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 