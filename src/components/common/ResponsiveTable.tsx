import React from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  className?: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export default function ResponsiveTable<T>({ data, columns, className = '' }: Props<T>) {
  const renderCellContent = (item: T, column: Column<T>): React.ReactNode => {
    const value = item[column.key];
    return column.render ? column.render(value, item) : value as React.ReactNode;
  };

  return (
    <div className={className}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className={`table-header ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="table-row">
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
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
        {data.map((item, index) => (
          <div key={index} className="bg-[#1A1A1A] rounded-lg p-4 space-y-3">
            {columns.map((column) => (
              <div key={column.key.toString()} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {column.label}
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