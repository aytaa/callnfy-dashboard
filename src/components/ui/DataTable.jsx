import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Card from './Card';

/**
 * DataTable Component
 *
 * Props:
 * @param {Array} columns - Array of column definitions: [{key, label, sortable}]
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Show loading skeleton
 * @param {ReactNode} emptyState - Content to show when no data
 * @param {number} itemsPerPage - Items per page (default: 10)
 * @param {string} className - Additional CSS classes
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  itemsPerPage = 10,
  className,
  ...props
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-gray-900 dark:text-white" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-900 dark:text-white" />
    );
  };

  if (loading) {
    return (
      <Card noPadding className={className}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#111114] border-b border-gray-200 dark:border-[#303030]">
              <tr>
                {columns.map((column, idx) => (
                  <th key={idx} className="px-4 py-3 text-left">
                    <div className="h-4 bg-gray-200 dark:bg-[#262626] rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#303030]">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-[#262626] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (data.length === 0 && emptyState) {
    return <Card className={className}>{emptyState}</Card>;
  }

  return (
    <Card noPadding className={className} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-[#111114] border-b border-gray-200 dark:border-[#303030]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-[#1a1a1d] transition-colors'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#303030]">
            {paginatedData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-white"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#303030]">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-[#404040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-[#404040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
