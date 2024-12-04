import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  isSortable?: boolean;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyMessage?: string;
}

export default function ResponsiveTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No data available'
}: ResponsiveTableProps<T>) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-surface-dark rounded-lg mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-surface-dark rounded-lg mb-2"></div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {emptyMessage}
      </div>
    );
  }

  const renderSortIcon = (column: Column<T>) => {
    if (!column.isSortable) return null;
    
    const isActive = sortColumn === column.accessor;
    return (
      <span className={`ml-1 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
        {isActive && sortDirection === 'desc' ? '↓' : '↑'}
      </span>
    );
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    const value = typeof column.accessor === 'function'
      ? column.accessor(item)
      : item[column.accessor];
    
    return value;
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-dark">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-sm font-medium text-text-secondary ${
                    column.className || ''
                  } ${column.isSortable ? 'cursor-pointer hover:text-text-primary' : ''}`}
                  onClick={() => column.isSortable && onSort?.(column.accessor as string)}
                >
                  <span className="flex items-center">
                    {column.header}
                    {renderSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-surface-dark hover:bg-surface-dark transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-4 text-sm ${column.className || ''}`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            className={`bg-surface-dark p-4 rounded-lg space-y-3 ${
              onRowClick ? 'cursor-pointer' : ''
            }`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column, index) => (
              <div key={index} className="flex justify-between items-start">
                <span className="text-sm text-text-secondary">
                  {column.header}
                </span>
                <span className={`text-sm text-right ${column.className || ''}`}>
                  {renderCellContent(item, column)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 