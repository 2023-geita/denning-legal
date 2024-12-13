import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { FiPlay } from 'react-icons/fi';
import { BillableSession } from '@/types/session';

export default function SessionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [session, setSession] = useState<BillableSession>({
    id: '',
    matterId: '',
    matterName: '',
    startTime: new Date(),
    duration: 0,
    notes: '',
    attorney: '',
    billingRate: 0,
    date: new Date(),
    status: 'Planned',
    billable: true
  });

  return (
    <Layout>
      <div className="min-h-screen p-6">
        {/* Filter Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#3D3D3D] transition-colors">
              Ongoing
            </button>
            <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors">
              Completed
            </button>
            <button className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors">
              Planned
            </button>
          </div>
          <button 
            onClick={() => router.push('/session/new')}
            className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
          >
            <span className="text-[#FFD700] mr-2">⚡</span>
            <span className="text-sm font-medium">New Session</span>
          </button>
        </div>

        <div className="text-2xl font-medium text-white mb-6">Session Details</div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Progress</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]">
                    <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                    <span>Session Details</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Sessions</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-[#2D2D2D] rounded-lg hover:bg-[#3D3D3D] transition-colors cursor-pointer">
                      <div className="space-y-1">
                        <h4 className="text-sm text-white font-medium truncate">Matter {i}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">1h 30m</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-green-900/50 text-green-400">
                              Billable
                            </span>
                          </div>
                          <span className="text-gray-400">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="flex-1 bg-[#1A1A1A]">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#2D2D2D] rounded-lg px-4 py-2 text-white flex-1">
                      1h 30m
                    </div>
                    <button className="p-2 bg-[#2D2D2D] rounded-lg text-white hover:bg-[#3D3D3D] transition-colors">
                      <FiPlay className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Matter</label>
                  <Select
                    options={[
                      { value: 'matter1', label: 'Matter 1' },
                      { value: 'matter2', label: 'Matter 2' },
                      { value: 'matter3', label: 'Matter 3' }
                    ]}
                    value={session.matterId || ''}
                    onChange={(e) => setSession({ ...session, matterId: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Matter Notes</label>
                <textarea
                  placeholder="Enter Matter description"
                  className="w-full h-40 bg-[#2D2D2D] border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  value={session.notes || ''}
                  onChange={(e) => setSession({ ...session, notes: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <Input
                    type="date"
                    value={session.date ? new Date(session.date).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setSession({ ...session, date: new Date(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Attorney</label>
                  <Select
                    options={[
                      { value: 'attorney1', label: 'Attorney 1' },
                      { value: 'attorney2', label: 'Attorney 2' },
                      { value: 'attorney3', label: 'Attorney 3' }
                    ]}
                    value={session.attorney || ''}
                    onChange={(e) => setSession({ ...session, attorney: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Billing rate</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={session.billingRate || '0.00'}
                    onChange={(e) => setSession({ ...session, billingRate: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                  />
                  <span className="text-sm text-gray-400">per hr</span>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                    <span className="text-sm text-white">Billable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-sm text-white">Non-billable</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="danger">
            EMPTY
          </Button>
          <Button variant="secondary">
            SAVE
          </Button>
        </div>
      </div>
    </Layout>
  );
} 