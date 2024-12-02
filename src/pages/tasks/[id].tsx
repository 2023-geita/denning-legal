import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input, Select } from '@/components/common';
import { Task } from '@/types/task';

export default function TaskDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Partial<Task>>({});
  const [isEditing, setIsEditing] = useState(!id);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Filter Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className="filter-tab filter-tab-active">All</button>
            <button className="filter-tab filter-tab-inactive">Pending</button>
            <button className="filter-tab filter-tab-inactive">Completed</button>
          </div>
          <button 
            onClick={() => router.push('/tasks/new')}
            className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
          >
            <span className="text-[#FFD700] mr-2">⚡</span>
            <span className="text-sm font-medium">New Task</span>
          </button>
        </div>

        <div className="text-2xl font-medium text-white">Task Details</div>

        <div className="flex gap-6 mt-6">
          {/* Left Sidebar */}
          <Card className="w-64 shrink-0 bg-[#1A1A1A]">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase">Progress</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#FFD700]">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <span>Task Details</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Recent Tasks</h3>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="flex-1 bg-[#1A1A1A]">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Task Name</label>
                <Input
                  placeholder="Enter Task Name"
                  value={task.name || ''}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Matter</label>
                <Select
                  options={[
                    { value: 'matter1', label: 'Matter 1' },
                    { value: 'matter2', label: 'Matter 2' },
                    { value: 'matter3', label: 'Matter 3' }
                  ]}
                  value={task.matterId || ''}
                  onChange={(e) => setTask({ ...task, matterId: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-gray-400 mb-2">To-Do List</label>
              <textarea
                placeholder="What to do"
                className="w-full h-40 bg-[#2D2D2D] border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 resize-none"
                value={task.description || ''}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Task Due</label>
                <Input
                  type="date"
                  value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ''}
                  onChange={(e) => setTask({ ...task, dueDate: new Date(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Attorney Assigned</label>
                <Select
                  options={[
                    { value: 'attorney1', label: 'Attorney 1' },
                    { value: 'attorney2', label: 'Attorney 2' },
                    { value: 'attorney3', label: 'Attorney 3' }
                  ]}
                  value={task.assignedAttorney || ''}
                  onChange={(e) => setTask({ ...task, assignedAttorney: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-gray-400 mb-2">Task Status</label>
              <div className="flex items-center justify-between">
                <div className="bg-[#2D2D2D] rounded-lg px-4 py-2 text-white">
                  Pending
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.reminder || false}
                    onChange={(e) => setTask({ ...task, reminder: e.target.checked })}
                    disabled={!isEditing}
                    className="form-checkbox h-4 w-4 text-[#FFD700] bg-[#2D2D2D] border-gray-600 rounded focus:ring-[#FFD700]"
                  />
                  <span className="text-sm text-gray-400">Remind Me?</span>
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