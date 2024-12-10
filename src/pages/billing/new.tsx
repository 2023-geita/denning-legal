import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/common';

export default function NewBill() {
  const router = useRouter();
  const [attorneyName, setAttorneyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedMatter, setSelectedMatter] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [retainerFee, setRetainerFee] = useState('');
  const [retainerDue, setRetainerDue] = useState('');
  const [unpaidBalance, setUnpaidBalance] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');

  const handleAttorneyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttorneyName(e.target.value);
  };

  const matterOptions = [
    { value: '', label: 'Select matter' },
    { value: '1', label: 'Contract Review' },
    { value: '2', label: 'Legal Consultation' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!attorneyName.trim()) {
      alert('Please enter attorney name');
      return;
    }
    
    if (!clientName || !selectedMatter || !totalCost || !paidAmount || !retainerDue) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attorneyName: attorneyName.trim(),
          clientName,
          matterId: selectedMatter,
          totalCost: parseFloat(totalCost),
          paidAmount: parseFloat(paidAmount),
          retainerFee: parseFloat(retainerFee),
          retainerDue,
          unpaidBalance: parseFloat(unpaidBalance),
          pasteUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create bill');
      }

      router.push('/billing');
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Bill</h1>
          
          <Card className="bg-[#1A1A1A] p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Attorney Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Attorney Name *
                  </label>
                  <input
                    type="text"
                    value={attorneyName}
                    onChange={handleAttorneyNameChange}
                    placeholder="Enter attorney name"
                    className="w-full p-2 rounded bg-[#2D2D2D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Client Name Input */}
                <div>
                  <Input
                    label="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                {/* Matter Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Matter</label>
                  <select
                    value={selectedMatter}
                    onChange={(e) => setSelectedMatter(e.target.value)}
                    className="bg-[#2D2D2D] text-white w-full p-2 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    {matterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Billing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Total Cost"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="Enter total cost"
                    type="number"
                    required
                  />

                  <Input
                    label="Paid Amount"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="Enter paid amount"
                    type="number"
                    required
                  />

                  <Input
                    label="Retainer Fee"
                    value={retainerFee}
                    onChange={(e) => setRetainerFee(e.target.value)}
                    placeholder="Enter retainer fee"
                    type="number"
                  />

                  <Input
                    label="Retainer Due"
                    value={retainerDue}
                    onChange={(e) => setRetainerDue(e.target.value)}
                    placeholder="Enter retainer due date"
                    type="date"
                    required
                  />

                  <Input
                    label="Unpaid Balance"
                    value={unpaidBalance}
                    onChange={(e) => setUnpaidBalance(e.target.value)}
                    placeholder="Enter unpaid balance"
                    type="number"
                  />

                  <Input
                    label="Paste URL"
                    value={pasteUrl}
                    onChange={(e) => setPasteUrl(e.target.value)}
                    placeholder="Enter paste URL"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                  >
                    Create Bill
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}