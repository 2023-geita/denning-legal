import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { formatDate } from '@/utils/format';

interface Task {
  id: string;
  title: string;
  matter: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

const tasksData: Task[] = [
  {
    id: '1',
    title: 'Review Contract Documents',
    matter: 'Contract Review - Company A',
    dueDate: '2024-02-20',
    status: 'todo',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Prepare Legal Brief',
    matter: 'Legal Consultation - Company B',
    dueDate: '2024-02-22',
    status: 'in_progress',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Client Meeting Notes',
    matter: 'Case Review - Individual C',
    dueDate: '2024-02-18',
    status: 'completed',
    priority: 'low'
  }
];

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasksData.filter(task => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-[#3F3F00] text-[#FCD34D]';
      case 'in_progress':
        return 'bg-[#1A4731] text-[#34D399]';
      case 'completed':
        return 'bg-[#4C0519] text-[#F87171]';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Layout>
      <div className="px-6 py-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('todo')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'todo'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'in_progress'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === 'completed'
                  ? 'bg-[#00A3B4] text-white'
                  : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
              }`}
            >
              Completed
            </button>
          </div>
          <Link 
            href="/tasks/new"
            className="flex items-center space-x-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFE44D] transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">New Task</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Link>
        </div>

        {/* Tasks Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2D2D]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Matter</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Priority</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#2D2D2D] last:border-b-0 hover:bg-[#2D2D2D] transition-colors">
                    <td className="px-6 py-4 text-white">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-white">{task.title}</td>
                    <td className="px-6 py-4 text-white">{task.matter}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status === 'in_progress'
                          ? 'In Progress'
                          : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/tasks/${task.id}`}
                        className="text-[#00A3B4] hover:text-[#008999] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
} 