import React, { useState } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  CheckSquare,
  Square,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onExportCsv?: () => void;
  onAddNew?: () => void;
  addNewLabel?: string;
}

export function DataTable<T extends { id: string }>({
  title,
  subtitle,
  data,
  columns,
  searchPlaceholder = 'Cari data...',
  onExportCsv,
  onAddNew,
  addNewLabel = 'Tambah Data Baru',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter by search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination math
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV/Excel</span>
            </button>
          )}

          {onAddNew && (
            <button
              onClick={onAddNew}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-3 py-2 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md ring-1 ring-amber-400/40"
            >
              <span>+ {addNewLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search & Actions */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          {selectedIds.size > 0 && (
            <span className="rounded-lg bg-emerald-950 px-2.5 py-1 font-bold text-emerald-300 border border-emerald-500/30">
              {selectedIds.size} item terpilih
            </span>
          )}
          <span>Total {filteredData.length} Data</span>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3.5 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                  {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              {columns.map((col) => (
                <th key={col.key} className="p-3.5">
                  <div className="flex items-center space-x-1 cursor-pointer select-none">
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="h-3 w-3 text-slate-500" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-800/50 ${
                      isSelected ? 'bg-emerald-950/30' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleSelectRow(item.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-3.5">
                        {col.accessor(item)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">
                  Tidak ada data yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60">
        <span>
          Menampilkan {(currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, filteredData.length)} dari {filteredData.length} data
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold text-slate-200">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
