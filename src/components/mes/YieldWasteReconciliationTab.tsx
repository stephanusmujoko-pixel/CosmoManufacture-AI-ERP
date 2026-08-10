import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Boxes,
  DollarSign,
  PieChart,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { YieldWasteRecord } from '../../types/mes';
import { formatCurrencyIDR } from '../../lib/utils';

interface YieldWasteReconciliationTabProps {
  records: YieldWasteRecord[];
}

export const YieldWasteReconciliationTab: React.FC<YieldWasteReconciliationTabProps> = ({ records }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-400" />
            Rekonsiliasi Yield Produksi & Scrap Waste Loss Kosmetik
          </h2>
          <p className="text-xs text-slate-400">
            Kalkulasi Rasio Perolehan Bulk (Bulk Yield %) vs Target Kemasan (Filled Units Yield %), Rekam Sisa Purging Vessel & Nilai Kerugian COGS Waste (IDR).
          </p>
        </div>

        <button
          onClick={() => alert('Mengekspor laporan Rekonsiliasi Yield & Waste Harian ke Excel/CSV...')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>Export Yield Report CSV</span>
        </button>
      </div>

      {/* Yield Cards List */}
      <div className="space-y-6">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-teal-300">MO: {rec.moNumber} • Batch: {rec.batchNumber}</span>
                <h3 className="text-base font-extrabold text-white">{rec.productName}</h3>
              </div>

              <div className="flex items-center space-x-3 font-mono text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Rasio Perolehan Bulk:</span>
                  <span className="text-lg font-black text-emerald-400">{rec.bulkYieldPercent}%</span>
                </div>
                <div className="text-right border-l border-slate-800 pl-3">
                  <span className="text-slate-400 block text-[10px]">Rasio Kemasan Terisi:</span>
                  <span className="text-lg font-black text-cyan-300">{rec.filledYieldPercent}%</span>
                </div>
              </div>
            </div>

            {/* Target vs Actual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Target Bulk Vs Realisasi:</span>
                <p className="text-sm font-bold text-slate-200">
                  {rec.actualBulkKg} / {rec.targetBulkKg} Kg
                </p>
                <span className="text-[10px] text-rose-400 block">Sisa Bulk: {rec.scrapKg} Kg</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Target Unit Vs Hasil Filling:</span>
                <p className="text-sm font-bold text-slate-200">
                  {rec.actualUnits.toLocaleString()} / {rec.targetUnits.toLocaleString()} Pcs
                </p>
                <span className="text-[10px] text-rose-400 block">Reject Botol: {rec.scrapUnits} Pcs</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Kategori Scrap Utama:</span>
                <p className="text-xs font-bold text-amber-300">{rec.primaryScrapReason}</p>
                <span className="text-[10px] text-slate-400">Dalam Toleransi Standards</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Perkiraan Nilai Waste Loss:</span>
                <p className="text-sm font-black text-rose-400">{formatCurrencyIDR(rec.scrapCostIdr)}</p>
                <span className="text-[10px] text-slate-400">Termasuk COGS Bahan Baku</span>
              </div>
            </div>

            {/* Operator Notes */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-300">
              <span className="text-slate-400 font-bold block mb-1">Catatan Analisis Rekonsiliasi Supervisor Produksi:</span>
              <p>{rec.operatorNotes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
