import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Layers,
  Boxes,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { ManufacturingOrder } from '../../types/mes';
import { formatCurrencyIDR } from '../../lib/utils';

interface ManufacturingOrdersTabProps {
  orders: ManufacturingOrder[];
  onOpenNewMoModal: () => void;
  onSelectMo: (moNumber: string) => void;
}

export const ManufacturingOrdersTab: React.FC<ManufacturingOrdersTabProps> = ({
  orders,
  onOpenNewMoModal,
  onSelectMo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = orders.filter((mo) => {
    const matchesSearch =
      mo.moNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.formulaCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || mo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            Manajemen Perintah Manufaktur (Manufacturing Orders - MO)
          </h2>
          <p className="text-xs text-slate-400">
            Pencatatan Perintah Produksi Kosmetik Terintegrasi dari MPS: Formulasi R&D, Versioning BOM, Target Batch (Kg), Kemasan (Pcs), & Multi-Line Cleanroom.
          </p>
        </div>

        <button
          onClick={onOpenNewMoModal}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs shadow-lg self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Rilis MO Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari MO, Produk, Formula, atau Klien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter Status:
          </span>
          {['all', 'In Production', 'Planned', 'Approved', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* MO Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                <th className="p-3">Nomor MO & Klien Maklon</th>
                <th className="p-3">Produk & Formulasi R&D</th>
                <th className="p-3">Lini & Fabrikasi</th>
                <th className="p-3">Target Unit</th>
                <th className="p-3">Target Batch (Kg)</th>
                <th className="p-3">Jadwal Plan</th>
                <th className="p-3">Est. COGS (IDR)</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">
                    Tidak ada Perintah Manufaktur (MO) yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((mo) => (
                  <tr key={mo.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-bold text-white">
                      <div className="text-teal-300 font-extrabold">{mo.moNumber}</div>
                      <span className="text-[10px] text-slate-400 block">{mo.clientName}</span>
                      <span className="text-[9px] text-slate-500">Ref: {mo.productionPlanRef}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-white font-bold">{mo.productName}</div>
                      <span className="text-[10px] text-amber-400 block">{mo.formulaCode}</span>
                      <span className="text-[9px] text-slate-400">BOM: {mo.bomVersion}</span>
                    </td>
                    <td className="p-3 text-slate-300">
                      <span className="block font-bold text-slate-200">{mo.productionLine}</span>
                      <span className="text-[10px] text-slate-500">{mo.factoryName}</span>
                    </td>
                    <td className="p-3 font-bold text-indigo-300">{mo.targetQtyUnits.toLocaleString()} Pcs</td>
                    <td className="p-3 text-emerald-300 font-bold">{mo.targetBatchKg} Kg</td>
                    <td className="p-3 text-amber-300">
                      <div>{mo.startDatePlan}</div>
                      <span className="text-[10px] text-slate-400">s/d {mo.finishDatePlan}</span>
                    </td>
                    <td className="p-3 text-cyan-300 font-bold">
                      {mo.estimatedCogsIdr ? formatCurrencyIDR(mo.estimatedCogsIdr) : 'Rp 0'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mo.priority === 'High'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {mo.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          mo.status === 'In Production'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : mo.status === 'Approved'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                            : mo.status === 'Completed'
                            ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                            : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {mo.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onSelectMo(mo.moNumber)}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-teal-300 hover:bg-slate-800 text-[11px] font-bold flex items-center space-x-1"
                      >
                        <span>Lihat WO</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
