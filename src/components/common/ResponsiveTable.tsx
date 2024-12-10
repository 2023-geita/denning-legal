import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  className?: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function renderCellContent<T>(item: T, column: Column<T>): ReactNode {
  const value = item[column.accessor];
  if (column.render) {
    return column.render(value, item);
  }
  return value as ReactNode;
}

export function ResponsiveTable<T>({ data, columns, onRowClick }: ResponsiveTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column) => (
                <td
                  key={String(column.accessor)}
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
  );
} 