import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertTriangle, Plus, Calculator, Download } from 'lucide-react';
import { StockOpnameItem } from '../../types/inventory';
import { formatCurrencyIDR } from '../../lib/utils';

interface StockOpnameTabProps {
  opnameItems: StockOpnameItem[];
  onUpdateOpnameItem: (id: string, physicalQty: number, cause: StockOpnameItem['varianceCause']) => void;
  onApproveOpnameAdjustment: (item: StockOpnameItem) => void;
}

export const StockOpnameTab: React.FC<StockOpnameTabProps> = ({
  opnameItems,
  onUpdateOpnameItem,
  onApproveOpnameAdjustment,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPhysicalQty, setTempPhysicalQty] = useState<number>(0);
  const [tempCause, setTempCause] = useState<StockOpnameItem['varianceCause']>('Susut Saluran/Moisture');

  const totalVarianceValue = opnameItems.reduce((sum, item) => sum + item.varianceValueIDR, 0);

  const startEdit = (item: StockOpnameItem) => {
    setEditingId(item.id);
    setTempPhysicalQty(item.physicalQty);
    setTempCause(item.varianceCause);
  };

  const saveEdit = (id: string) => {
    onUpdateOpnameItem(id, tempPhysicalQty, tempCause);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-400" />
            Rekonsiliasi Physical Count (Stock Opname Periodic & Cycle Counting)
          </h2>
          <p className="text-xs text-slate-400">
            Perbandingan Stok Sistem vs Hasil Timbang Fisik Gudang, Penghitungan Variansi (IDR), & Otorisasi Penyesuaian
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block">Total Nilai Selisih Opname:</span>
            <span className={`font-black text-sm ${totalVarianceValue < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrencyIDR(totalVarianceValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Stock Opname Execution Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-white">Lembar Kerja Stock Opname Aktif (Agustus 2026)</span>
          <span className="text-emerald-400 font-bold">✓ Audit Trail Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px] uppercase">
                <th className="p-3.5">SKU / Nama Material</th>
                <th className="p-3.5">Stok Sistem</th>
                <th className="p-3.5">Fisik Opname</th>
                <th className="p-3.5">Selisih Qty</th>
                <th className="p-3.5">Selisih Nilai (IDR)</th>
                <th className="p-3.5">Penyebab Selisih</th>
                <th className="p-3.5">Status Audit</th>
                <th className="p-3.5 text-right">Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {opnameItems.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-indigo-300 block">{item.sku}</span>
                      <span className="font-bold text-white">{item.itemName}</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-300">
                      {item.systemQty} {item.uom}
                    </td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempPhysicalQty}
                          onChange={(e) => setTempPhysicalQty(Number(e.target.value))}
                          className="w-24 bg-slate-900 border border-emerald-500 rounded p-1 text-white font-bold"
                        />
                      ) : (
                        <span className="font-bold text-emerald-300">
                          {item.physicalQty} {item.uom}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className={item.varianceQty < 0 ? 'text-rose-400' : item.varianceQty > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                        {item.varianceQty > 0 ? `+${item.varianceQty}` : item.varianceQty} {item.uom}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className={item.varianceValueIDR < 0 ? 'text-rose-400' : 'text-slate-300'}>
                        {formatCurrencyIDR(item.varianceValueIDR)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={tempCause}
                          onChange={(e) => setTempCause(e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white"
                        >
                          <option value="Susut Saluran/Moisture">Susut Saluran / Moisture</option>
                          <option value="Spillage/Bocor">Spillage / Bocor</option>
                          <option value="Sampling QC">Sampling QC</option>
                          <option value="Salah Catat System">Salah Catat System</option>
                        </select>
                      ) : (
                        <span className="text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.varianceCause}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.auditStatus === 'Verified Match'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : item.auditStatus === 'Variance Approved'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {item.auditStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black text-[11px]"
                        >
                          Simpan
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
                          >
                            Edit Qty
                          </button>
                          {item.varianceQty !== 0 && item.auditStatus !== 'Variance Approved' && (
                            <button
                              onClick={() => onApproveOpnameAdjustment(item)}
                              className="px-2.5 py-1 rounded bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] shadow"
                            >
                              Approve Adjustment →
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
