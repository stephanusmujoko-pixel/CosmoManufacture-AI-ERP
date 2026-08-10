import React from 'react';
import { BarChart3, Calculator, HelpCircle, ShieldCheck } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';

interface AbcSafetyTabProps {
  items: InventoryItem[];
}

export const AbcSafetyTab: React.FC<AbcSafetyTabProps> = ({ items }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 shadow-lg">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-400" />
          Analisis Klasifikasi ABC / XYZ & Kalkulasi EOQ / Safety Stock
        </h2>
        <p className="text-xs text-slate-400">
          Klasifikasi ABC (Berdasarkan Nilai Aset IDR) & XYZ (Berdasarkan Variabilitas Fluktuasi Permintaan MES) untuk Efisiensi Working Capital
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3x3 Matrix Diagram */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Matriks 3x3 Klasifikasi ABC / XYZ
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500/40 space-y-1">
              <span className="font-black text-indigo-300 text-sm">AX</span>
              <span className="text-[10px] text-slate-400 block">High Value, Stable</span>
              <span className="text-[10px] font-bold text-emerald-400">Niacinamide, FG Serum</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-amber-300 text-sm">AY</span>
              <span className="text-[10px] text-slate-400 block">High Value, Moderate</span>
              <span className="text-[10px] font-bold text-slate-300">Centella Extract</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1">
              <span className="font-black text-rose-300 text-sm">AZ</span>
              <span className="text-[10px] text-slate-400 block">High Value, Unstable</span>
              <span className="text-[10px] font-bold text-rose-300">Ceramide NP</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-300 text-sm">BX</span>
              <span className="text-[10px] text-slate-400 block">Med Value, Stable</span>
              <span className="text-[10px] font-bold text-slate-400">Airless Bottles</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-300 text-sm">BY</span>
              <span className="text-[10px] text-slate-400 block">Med Value, Moderate</span>
              <span className="text-[10px] font-bold text-slate-400">Jojoba Oil</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-400 text-sm">BZ</span>
              <span className="text-[10px] text-slate-400 block">Med Value, Unstable</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-500 text-sm">CX</span>
              <span className="text-[10px] text-slate-400 block">Low Value, Stable</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-500 text-sm">CY</span>
              <span className="text-[10px] text-slate-400 block">Low Value, Moderate</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-black text-slate-500 text-sm">CZ</span>
              <span className="text-[10px] text-slate-400 block">Low Value, Unstable</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 font-mono">
            <span className="font-bold text-amber-400 block">💡 Panduan Kebijakan Stok:</span>
            <p>• <strong>Kelas AX / AY:</strong> Kontrol ketat harian, siklus EOQ diperbarui tiap bulan.</p>
            <p>• <strong>Kelas AZ:</strong> Memerlukan Safety Stock lebih tinggi (+50%) untuk mengantisipasi gejolak pesanan.</p>
          </div>
        </div>

        {/* EOQ & Safety Stock Parameters Table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Kalkulasi Economic Order Quantity (EOQ) & Reorder Point (ROP)</span>
            <span className="text-[10px] font-mono text-emerald-400">EOQ = √((2 • D • S) / H)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px] uppercase">
                  <th className="p-3">Nama Material</th>
                  <th className="p-3">Kelas ABC/XYZ</th>
                  <th className="p-3">Safety Stock</th>
                  <th className="p-3">Min - Max</th>
                  <th className="p-3">Reorder Point (ROP)</th>
                  <th className="p-3">Rekomendasi EOQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{it.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold text-[10px]">
                        {it.abcClass}{it.xyzClass}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-300">
                      {it.safetyStock} {it.primaryUom}
                    </td>
                    <td className="p-3 text-slate-400">
                      {it.minStock} - {it.maxStock} {it.primaryUom}
                    </td>
                    <td className="p-3 font-bold text-amber-300">
                      {it.reorderPoint} {it.primaryUom}
                    </td>
                    <td className="p-3 font-bold text-emerald-300">
                      {it.eoqKg} {it.primaryUom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
