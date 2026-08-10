import React from 'react';
import { Calculator, DollarSign, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { InventoryItem } from '../../types/inventory';
import { formatCurrencyIDR } from '../../lib/utils';

interface ValuationClosingTabProps {
  items: InventoryItem[];
  onExecuteMonthlyClosing: () => void;
}

export const ValuationClosingTab: React.FC<ValuationClosingTabProps> = ({
  items,
  onExecuteMonthlyClosing,
}) => {
  const totalAssetValue = items.reduce((sum, item) => sum + item.totalAssetValueIDR, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="h-4 w-4 text-emerald-400" />
            Valuasi Persediaan & Penutupan Akun COGS HPP Bulanan
          </h2>
          <p className="text-xs text-slate-400">
            Laporan Layer Costing FEFO/FIFO, HPP Pemakaian Bahan Baku MES, & Penutupan Jurnal Otomatis ke Modul General Ledger Finance
          </p>
        </div>

        <button
          onClick={onExecuteMonthlyClosing}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow hover:brightness-110 whitespace-nowrap"
        >
          Jalankan Inventory Monthly Closing →
        </button>
      </div>

      {/* Rincian Layer Costing Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Rincian Layer Costing FEFO Active Per Material</h3>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30">
            Total Nilai Aset: {formatCurrencyIDR(totalAssetValue)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px] uppercase">
                <th className="p-3">Metode Valuation</th>
                <th className="p-3">Kode SKU & Material</th>
                <th className="p-3">Tgl Pembelian Terakhir</th>
                <th className="p-3">Sisa Qty Stok</th>
                <th className="p-3">Unit Cost Layer (IDR)</th>
                <th className="p-3">Total Asset Valuation (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-indigo-300">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-[10px]">
                      {it.valuationMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{it.name}</span>
                    <span className="text-slate-500 text-[10px]">{it.sku}</span>
                  </td>
                  <td className="p-3 text-slate-400">{it.lastPurchaseDate}</td>
                  <td className="p-3 font-bold text-slate-200">
                    {it.totalStockQty.toLocaleString()} {it.primaryUom}
                  </td>
                  <td className="p-3 font-bold text-emerald-300">{formatCurrencyIDR(it.unitCostIDR)}</td>
                  <td className="p-3 font-bold text-emerald-300">{formatCurrencyIDR(it.totalAssetValueIDR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
