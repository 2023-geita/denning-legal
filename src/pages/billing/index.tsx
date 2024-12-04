import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FilterTabs from '@/components/common/FilterTabs';

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'overdue', label: 'Overdue' }
];

interface Bill {
  id: string;
  matterId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceNumber: string;
}

export default function Billing() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [bills] = useState<Bill[]>([
    {
      id: 'BILL-2024-001',
      matterId: 'MAT-2024-001',
      clientName: 'John Doe',
      description: 'Legal Consultation and Document Review',
      amount: 1500.00,
      dueDate: '2024-02-28',
      status: 'Pending',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 'BILL-2024-002',
      matterId: 'MAT-2024-002',
      clientName: 'ABC Corporation',
      description: 'Corporate Restructuring Services',
      amount: 3500.00,
      dueDate: '2024-02-15',
      status: 'Paid',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 'BILL-2024-003',
      matterId: 'MAT-2024-003',
      clientName: 'XYZ Ltd',
      description: 'Contract Negotiation',
      amount: 2500.00,
      dueDate: '2024-01-30',
      status: 'Overdue',
      invoiceNumber: 'INV-2024-003'
    }
  ]);

  const handleNewBill = () => {
    router.push('/billing/new');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBills(bills.map(b => b.id));
    } else {
      setSelectedBills([]);
    }
  };

  const handleSelectBill = (billId: string) => {
    setSelectedBills(prev =>
      prev.includes(billId)
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
      .replace('KES', 'KSh');
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/10 text-green-500';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Overdue':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const calculateTotalAmount = (status?: Bill['status']) => {
    return bills
      .filter(bill => !status || bill.status === status)
      .reduce((sum, bill) => sum + bill.amount, 0);
  };

  return (
    <Layout>
      <div className="px-6 py-6">
        {/* Top Section with Filters and New Bill Button */}
        <div className="flex justify-between items-center mb-6">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <button
            onClick={handleNewBill}
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">New Bill</span>
            <FiDollarSign className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Billed</p>
                <p className="text-xl font-semibold text-white">
                  {formatAmount(calculateTotalAmount())}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Paid</p>
                <p className="text-xl font-semibold text-white">
                  {formatAmount(calculateTotalAmount('Paid'))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <FiClock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl font-semibold text-white">
                  {formatAmount(calculateTotalAmount('Pending'))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Overdue</p>
                <p className="text-xl font-semibold text-white">
                  {formatAmount(calculateTotalAmount('Overdue'))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {selectedBills.length > 0 && (
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg flex items-center space-x-1 text-sm hover:bg-green-500/20 transition-colors">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Mark as Paid</span>
                </button>
                <button className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg flex items-center space-x-1 text-sm hover:bg-blue-500/20 transition-colors">
                  <FiDollarSign className="w-4 h-4" />
                  <span>Generate Invoice</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bills..."
                className="pl-10 pr-4 py-2 bg-[#2D2D2D] rounded-lg text-white placeholder-gray-400 w-64"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="px-4 py-2 bg-[#2D2D2D] rounded-lg text-white flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Billing Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="border-b border-[#2D2D2D]">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full p-4 flex items-center justify-between text-white hover:bg-[#2D2D2D] transition-colors"
            >
              <div className="flex items-center space-x-2">
                {isCollapsed ? <FiChevronDown className="w-5 h-5" /> : <FiChevronUp className="w-5 h-5" />}
                <span className="font-medium">Billing List</span>
              </div>
            </button>
            
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#2D2D2D] text-gray-400 text-sm">
                    <tr>
                      <th className="w-8 p-4">
                        <input
                          type="checkbox"
                          className="rounded bg-[#1A1A1A] border-gray-600"
                          checked={selectedBills.length === bills.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4">Invoice #</th>
                      <th className="text-left p-4">Matter</th>
                      <th className="text-left p-4">Client</th>
                      <th className="text-left p-4">Description</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-white text-sm">
                    {bills.map((bill) => (
                      <tr
                        key={bill.id}
                        className="border-t border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="rounded bg-[#1A1A1A] border-gray-600"
                            checked={selectedBills.includes(bill.id)}
                            onChange={() => handleSelectBill(bill.id)}
                          />
                        </td>
                        <td className="p-4">{bill.invoiceNumber}</td>
                        <td className="p-4">
                          <a
                            href={`/matters/${bill.matterId}`}
                            className="text-blue-400 hover:underline"
                          >
                            {bill.matterId}
                          </a>
                        </td>
                        <td className="p-4">{bill.clientName}</td>
                        <td className="p-4">{bill.description}</td>
                        <td className="p-4 font-mono">{formatAmount(bill.amount)}</td>
                        <td className="p-4">{bill.dueDate}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                              title="View Invoice"
                            >
                              <FiDollarSign className="w-4 h-4 text-blue-500" />
                            </button>
                            {bill.status !== 'Paid' && (
                              <button
                                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                title="Mark as Paid"
                              >
                                <FiCheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 