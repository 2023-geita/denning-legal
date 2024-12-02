import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Input, Select, Button, Card } from '@/components/common';

const matterOptions = [
  { value: 'matter1', label: 'Matter 1' },
  { value: 'matter2', label: 'Matter 2' },
];

export default function DocumentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-[#1A1A1A] p-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Document Details</h1>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="space-y-6">
            <Input
              label="Document Name"
              disabled={!isEditing}
              placeholder="Enter document name"
            />

            <Select
              label="Related Matter"
              options={matterOptions}
              disabled={!isEditing}
            />
          </div>
        </Card>
      </div>
    </Layout>
  );
} 