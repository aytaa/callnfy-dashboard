import React from 'react';

export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No data available' }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#171717] border border-[#303030] rounded-lg p-12 text-center">
        <p className="text-white opacity-60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#171717] border border-[#303030] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#121212]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#303030]">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'hover:bg-[#262626] cursor-pointer transition-colors' : ''}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-white">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
