import React from 'react';
import {
  DollarSign,
  AlertTriangle,
  Calendar,
  Lock,
  TrendingUp,
  ShieldCheck,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import { InventoryItem, BatchLotRecord, InventoryTransaction } from '../../types/inventory';
import { formatCurrencyIDR } from '../../lib/utils';

interface InventoryDashboardTabProps {
  items: InventoryItem[];
  batches: BatchLotRecord[];
  transactions: InventoryTransaction[];
  onNavigateSubTab: (subTab: string) => void;
  onOpenNewPoDraft: (item: InventoryItem) => void;
}

export const InventoryDashboardTab: React.FC<InventoryDashboardTabProps> = ({
  items,
  batches,
  transactions,
  onNavigateSubTab,
  onOpenNewPoDraft,
}) => {
  const totalInventoryAssetValuation = items.reduce((sum, item) => sum + item.totalAssetValueIDR, 0);
  const lowStockItems = items.filter((i) => i.status === 'Low Stock' || i.availableStockQty <= i.reorderPoint);
  const nearExpiryBatches = batches.filter((b) => b.daysToExpiry <= 60);

  return (
    <div className="space-y-6">
      {/* Visual Asset Breakdown & Reorder Point Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Breakdown by Category Progress */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-emerald-400" />
                Komposisi Nilai Aset Persediaan berdasarkan Kategori
              </h2>
              <p className="text-xs text-slate-400">Proporsi Aset Bahan Aktif, Kemasan, & Finished Goods</p>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
              Total {formatCurrencyIDR(totalInventoryAssetValuation)}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Active Ingredients (Bahan Aktif Skincare)</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {formatCurrencyIDR(1630500000)} (47.4%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[47.4%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Packaging Materials (Kemasan Airless Pump, Botol)</span>
                <span className="font-mono text-indigo-300 font-bold">
                  {formatCurrencyIDR(562500000)} (16.3%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full w-[16.3%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Finished Goods (Produk Jadi Skincare & Serum)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {formatCurrencyIDR(477400000)} (13.9%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full w-[13.9%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-bold">Base Oils & Emulsifiers (Bahan Baku Emulsi)</span>
                <span className="font-mono text-amber-300 font-bold">
                  {formatCurrencyIDR(256000000)} (7.4%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[7.4%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reorder Point Widget */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Peringatan Reorder Point (ROP)</h2>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
              {lowStockItems.length} SKU Alert
            </span>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Semua stok di atas Reorder Point.</p>
            ) : (
              lowStockItems.map((lowItem) => (
                <div
                  key={lowItem.id}
                  className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white line-clamp-1">{lowItem.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{lowItem.sku}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">
                      Sisa: <strong className="text-rose-400">{lowItem.availableStockQty} {lowItem.primaryUom}</strong>
                    </span>
                    <span className="text-slate-400">
                      ROP: <strong className="text-slate-200">{lowItem.reorderPoint} {lowItem.primaryUom}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenNewPoDraft(lowItem)}
                    className="w-full mt-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 text-[11px] shadow transition-all"
                  >
                    Auto-Generate PR (EOQ: {lowItem.eoqKg} {lowItem.primaryUom}) →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Inventory Transactions Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Mutasi & Transaksi Stok Terakhir</h2>
            <p className="text-xs text-slate-400">Penerimaan GRN, Material Issue MES, & Pengiriman Barang Jadi</p>
          </div>
          <button
            onClick={() => onNavigateSubTab('stock_balance')}
            className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            Lihat Master SKU & Balance <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px] uppercase">
                <th className="p-3">No. Transaksi</th>
                <th className="p-3">Tipe Mutasi</th>
                <th className="p-3">Nama Material / SKU</th>
                <th className="p-3">Batch / Lot</th>
                <th className="p-3">Qty Mutasi</th>
                <th className="p-3">Lokasi Asal → Tujuan</th>
                <th className="p-3">Waktu & User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-indigo-300">{t.txnNumber}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800 text-[10px] font-bold">
                      {t.txnType}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">{t.itemName}</td>
                  <td className="p-3 text-amber-300">{t.batchLot}</td>
                  <td className="p-3 font-bold text-emerald-300">
                    {t.qty} {t.uom}
                  </td>
                  <td className="p-3 text-slate-300">
                    {t.sourceLocation} → {t.targetLocation}
                  </td>
                  <td className="p-3 text-slate-400 text-[10px]">
                    {t.timestamp} ({t.user})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
