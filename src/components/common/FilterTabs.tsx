import React from 'react';

interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: FilterTabsProps) {
  return (
    <div className={`flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-[#00A3B4] text-white'
              : 'bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 