import React from 'react';
import { Calendar, AlertTriangle, CheckCircle2, Lock, Sparkles, Clock } from 'lucide-react';
import { BatchLotRecord } from '../../types/inventory';

interface ExpiryFefoTabProps {
  batches: BatchLotRecord[];
  onToggleFefoLock: (batchId: string) => void;
}

export const ExpiryFefoTab: React.FC<ExpiryFefoTabProps> = ({ batches, onToggleFefoLock }) => {
  const sortedBatches = [...batches].sort((a, b) => a.daysToExpiry - b.daysToExpiry);

  return (
    <div className="space-y-6">
      {/* FEFO Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">
              Monitoring Tanggal Expired & FEFO Priority Engine (First Expired, First Out)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Sistem otomatis menandai dan mengunci lot dengan sisa umur terpendek untuk diprioritaskan pada Work Order MES terdekat.
          </p>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-950 px-3 py-1.5 rounded-xl border border-amber-500/40 font-bold whitespace-nowrap">
          Automated FEFO Priority Active
        </span>
      </div>

      {/* Expiry Cards List */}
      <div className="space-y-4">
        {sortedBatches.map((b) => {
          const isCritical = b.daysToExpiry <= 30;
          const isWarning = b.daysToExpiry <= 90;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border space-y-4 transition-all shadow-xl ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-500/50'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                    {b.internalLotNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{b.itemName}</h3>
                    <p className="text-slate-400 text-[11px] font-mono">SKU: {b.itemSku} • Supplier: {b.batchSupplier}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 font-mono">
                  <span className="text-slate-400">Kadaluarsa: <strong className="text-white">{b.expiryDate}</strong></span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      isCritical
                        ? 'bg-rose-500 text-slate-950 animate-pulse'
                        : isWarning
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {b.daysToExpiry} Hari Lagi!
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Sisa Stok Lot:</span>
                  <span className="font-bold text-white text-sm">{b.currentStockQty} Kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Lokasi Gudang:</span>
                  <span className="font-bold text-slate-200 text-xs">{b.warehouseLocation}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Jadwal Retest Micro:</span>
                  <span className="font-bold text-cyan-300 text-xs">{b.retestDate}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Status Inspec/QC:</span>
                  <span className="font-bold text-emerald-300 text-xs">{b.inspectionStatus}</span>
                </div>
              </div>

              {/* Recommendation & FEFO Lock Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px]">
                    <strong>FEFO Recommendation:</strong> {isCritical ? 'Prioritaskan dispensing lot ini pada Work Order aktif terdekat untuk menghindari waste.' : 'Stok dalam batas aman. Siap di-alokasikan sesuai urutan FEFO.'}
                  </span>
                </div>

                <button
                  onClick={() => onToggleFefoLock(b.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow ${
                    b.isFefoLocked
                      ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{b.isFefoLocked ? 'FEFO Locked (Pick Priority)' : 'Kunci Priority FEFO'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
