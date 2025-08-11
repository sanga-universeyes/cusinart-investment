import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface Action {
  label: string;
  icon: React.ComponentType<any>;
  onClick: (row: any) => void;
  variant?: 'default' | 'danger' | 'primary';
}

interface AdminDataTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  title?: string;
  loading?: boolean;
}

export function AdminDataTable({
  data,
  columns,
  actions = [],
  searchable = true,
  filterable = false,
  exportable = false,
  pageSize = 10,
  title,
  loading = false
}: AdminDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActions, setShowActions] = useState<number | null>(null);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column =>
          String(row[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...processedData.map(row =>
        columns.map(col => `"${row[col.key]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'danger': return 'text-red-600 hover:bg-red-50';
      case 'primary': return 'text-[#006B76] hover:bg-[#006B76]/10';
      default: return 'text-gray-600 hover:bg-gray-50';
    }
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          <p className="text-sm text-gray-500 mt-1">
            {processedData.length} élément{processedData.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006B76]/50 text-sm"
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          )}
          
          {exportable && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-medium text-gray-900 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                  } ${column.width || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortColumn === column.key && sortDirection === 'asc' 
                              ? 'text-[#006B76]' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortColumn === column.key && sortDirection === 'desc' 
                              ? 'text-[#006B76]' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#006B76]"></div>
                    <span className="ml-2 text-gray-500">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-gray-500">
                  Aucune donnée trouvée
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4 text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="py-3 px-4 text-sm relative">
                      <button
                        onClick={() => setShowActions(showActions === index ? null : index)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {showActions === index && (
                        <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => {
                                action.onClick(row);
                                setShowActions(null);
                              }}
                              className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${getActionButtonVariant(action.variant)}`}
                            >
                              <action.icon className="h-4 w-4" />
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de {startIndex + 1} à {Math.min(startIndex + pageSize, processedData.length)} sur {processedData.length} résultats
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        currentPage === page
                          ? 'bg-[#006B76] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))
              }
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActions !== null && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(null)}
        />
      )}
    </Card>
  );
}