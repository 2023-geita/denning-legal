import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/common';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiPlay, FiPause, FiClock, FiTrash2 } from 'react-icons/fi';

interface Session {
  id: string;
  matterId: string;
  description: string;
  startTime: Date;
  duration: number; // in seconds
  status: 'Running' | 'Paused' | 'Completed';
  attorney: string;
}

export default function Sessions() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'SES-2024-001',
      matterId: 'MAT-2024-001',
      description: 'Document Review',
      startTime: new Date(),
      duration: 8130, // 2:15:30
      status: 'Running',
      attorney: 'Kevin Gallo'
    },
    {
      id: 'SES-2024-002',
      matterId: 'MAT-2024-002',
      description: 'Client Meeting',
      startTime: new Date(),
      duration: 2700, // 0:45:00
      status: 'Paused',
      attorney: 'Kevin Gallo'
    }
  ]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNewSession = () => {
    router.push('/sessions/new');
  };

  const handleSessionAction = (sessionId: string, action: 'play' | 'pause' | 'stop') => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              status:
                action === 'play'
                  ? 'Running'
                  : action === 'pause'
                  ? 'Paused'
                  : 'Completed'
            }
          : session
      )
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSessions(sessions.map(s => s.id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'Running':
        return 'bg-green-500/10 text-green-500';
      case 'Paused':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FiClock className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Running Sessions</p>
                <p className="text-xl font-semibold text-white">
                  {sessions.filter(s => s.status === 'Running').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <FiPause className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Paused Sessions</p>
                <p className="text-xl font-semibold text-white">
                  {sessions.filter(s => s.status === 'Paused').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiClock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed Sessions</p>
                <p className="text-xl font-semibold text-white">
                  {sessions.filter(s => s.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                <FiClock className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Time Today</p>
                <p className="text-xl font-semibold text-white">
                  {formatDuration(sessions.reduce((acc, s) => acc + s.duration, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {['all', 'running', 'paused', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`filter-tab ${
                  activeTab === tab ? 'filter-tab-active' : 'filter-tab-inactive'
                } whitespace-nowrap`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {selectedSessions.length > 0 && (
              <button className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg flex items-center space-x-1 text-sm hover:bg-red-500/20 transition-colors">
                <FiTrash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sessions..."
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

        {/* Sessions Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
          <div className="border-b border-[#2D2D2D]">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full p-4 flex items-center justify-between text-white hover:bg-[#2D2D2D] transition-colors"
            >
              <div className="flex items-center space-x-2">
                {isCollapsed ? <FiChevronDown className="w-5 h-5" /> : <FiChevronUp className="w-5 h-5" />}
                <span className="font-medium">Session List</span>
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
                          checked={selectedSessions.length === sessions.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4">Session ID</th>
                      <th className="text-left p-4">Matter</th>
                      <th className="text-left p-4">Description</th>
                      <th className="text-left p-4">Duration</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Attorney</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-white text-sm">
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-t border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="rounded bg-[#1A1A1A] border-gray-600"
                            checked={selectedSessions.includes(session.id)}
                            onChange={() => handleSelectSession(session.id)}
                          />
                        </td>
                        <td className="p-4">{session.id}</td>
                        <td className="p-4">
                          <a
                            href={`/matters/${session.matterId}`}
                            className="text-blue-400 hover:underline"
                          >
                            {session.matterId}
                          </a>
                        </td>
                        <td className="p-4">{session.description}</td>
                        <td className="p-4 font-mono">{formatDuration(session.duration)}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="p-4">{session.attorney}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {session.status !== 'Completed' && (
                              <>
                                {session.status === 'Running' ? (
                                  <button
                                    onClick={() => handleSessionAction(session.id, 'pause')}
                                    className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                    title="Pause Session"
                                  >
                                    <FiPause className="w-4 h-4 text-yellow-500" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSessionAction(session.id, 'play')}
                                    className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                    title="Resume Session"
                                  >
                                    <FiPlay className="w-4 h-4 text-green-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleSessionAction(session.id, 'stop')}
                                  className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                  title="Complete Session"
                                >
                                  <FiClock className="w-4 h-4 text-blue-500" />
                                </button>
                              </>
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

        {/* New Session Button */}
        <button
          onClick={handleNewSession}
          className="fixed bottom-8 right-8 inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors"
        >
          <span className="text-[#FFD700] mr-2">⚡</span>
          <span className="text-sm font-medium">New Session</span>
        </button>
      </div>
    </Layout>
  );
} 