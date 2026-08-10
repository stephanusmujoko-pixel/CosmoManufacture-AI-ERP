import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  XCircle,
  Boxes,
  ShieldCheck,
  Tag,
  Building2,
  Lock,
} from 'lucide-react';
import { InventoryItem } from '../../types/inventory';
import { formatCurrencyIDR } from '../../lib/utils';

interface StockBalanceTabProps {
  items: InventoryItem[];
  onAddNewSku: (newItem: InventoryItem) => void;
  onOpenStockCard: (item: InventoryItem) => void;
  onOpenTransferModal: (item: InventoryItem) => void;
}

export const StockBalanceTab: React.FC<StockBalanceTabProps> = ({
  items,
  onAddNewSku,
  onOpenStockCard,
  onOpenTransferModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddSkuModal, setShowAddSkuModal] = useState(false);

  // New SKU Form state
  const [skuCode, setSkuCode] = useState('');
  const [skuBarcode, setSkuBarcode] = useState('');
  const [skuName, setSkuName] = useState('');
  const [skuInci, setSkuInci] = useState('');
  const [skuCategory, setSkuCategory] = useState<InventoryItem['category']>('Active Ingredient');
  const [skuUom, setSkuUom] = useState<InventoryItem['primaryUom']>('Kg');
  const [skuQty, setSkuQty] = useState<number>(100);
  const [skuMin, setSkuMin] = useState<number>(50);
  const [skuRop, setSkuRop] = useState<number>(100);
  const [skuEoq, setSkuEoq] = useState<number>(200);
  const [skuUnitCost, setSkuUnitCost] = useState<number>(500000);
  const [skuValuation, setSkuValuation] = useState<InventoryItem['valuationMethod']>('FEFO');
  const [skuSupplier, setSkuSupplier] = useState('BASF Chemical Indonesia');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.inciName && item.inciName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuName || !skuCode) return;

    const newItem: InventoryItem = {
      id: `INV-${Date.now()}`,
      sku: skuCode,
      barcode: skuBarcode || `899100238${Math.floor(100 + Math.random() * 900)}`,
      name: skuName,
      inciName: skuInci || undefined,
      category: skuCategory,
      primaryUom: skuUom,
      totalStockQty: skuQty,
      availableStockQty: skuQty,
      reservedStockQty: 0,
      onOrderQty: 0,
      qcHoldQty: 0,
      quarantineQty: 0,
      safetyStock: skuMin,
      minStock: skuMin,
      maxStock: skuMin * 5,
      reorderPoint: skuRop,
      eoqKg: skuEoq,
      abcClass: 'A',
      xyzClass: 'X',
      valuationMethod: skuValuation,
      unitCostIDR: skuUnitCost,
      totalAssetValueIDR: skuQty * skuUnitCost,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      supplierName: skuSupplier,
      status: skuQty <= skuRop ? 'Low Stock' : 'In Stock',
      warehouseBin: 'WH-RM-01 / Zone A / Bin B-01',
      storageTemp: 'Cool Room (15-25°C)',
      halalCertNo: 'ID0041000099000122',
    };

    onAddNewSku(newItem);
    setShowAddSkuModal(false);
    // Reset
    setSkuCode('');
    setSkuName('');
    setSkuInci('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari SKU, Nama Bahan, INCI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Semua Kategori Persediaan</option>
            <option value="Active Ingredient">Active Ingredient</option>
            <option value="Raw Material">Raw Material Base</option>
            <option value="Packaging Material">Packaging Material</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Work In Process (WIP)">Work In Process (WIP)</option>
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Semua Status Stok</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="QC Hold">QC Hold / Quarantine</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => {
              setSkuCode(`RM-NEW-${Math.floor(100 + Math.random() * 900)}`);
              setShowAddSkuModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black hover:brightness-110 shadow transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Master SKU Baru</span>
          </button>

          <button
            onClick={() => alert('Exporting Master Stock Balance Excel...')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Master Stock Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            Daftar Master Inventory ({filteredItems.length} SKU Ditemukan)
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            HPP Cost Valuation Engine Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase">
                <th className="p-3.5 font-bold">SKU & Barcode</th>
                <th className="p-3.5 font-bold">Nama Material / INCI</th>
                <th className="p-3.5 font-bold">Kategori</th>
                <th className="p-3.5 font-bold">Total Stok</th>
                <th className="p-3.5 font-bold">Tersedia</th>
                <th className="p-3.5 font-bold">Reservasi WO</th>
                <th className="p-3.5 font-bold">Valuasi (IDR)</th>
                <th className="p-3.5 font-bold">Suhu & Halal</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-indigo-300 block">{item.sku}</span>
                    <span className="text-slate-500 text-[10px]">{item.barcode}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{item.name}</span>
                    {item.inciName && <span className="text-slate-400 text-[10px]">INCI: {item.inciName}</span>}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    {item.totalStockQty.toLocaleString()} {item.primaryUom}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-300">
                    {item.availableStockQty.toLocaleString()} {item.primaryUom}
                  </td>
                  <td className="p-3.5 font-bold text-amber-300">
                    {item.reservedStockQty.toLocaleString()} {item.primaryUom}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-300">
                    {formatCurrencyIDR(item.totalAssetValueIDR)}
                  </td>
                  <td className="p-3.5 text-[10px]">
                    <span className="text-cyan-300 block font-bold">{item.storageTemp || 'Room Temp'}</span>
                    <span className="text-emerald-400 block font-semibold">{item.halalCertNo ? '✓ Halal' : 'Non Halal'}</span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => onOpenTransferModal(item)}
                      title="Transfer Antar Gudang"
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] inline-flex items-center gap-1"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                      Transfer
                    </button>
                    <button
                      onClick={() => onOpenStockCard(item)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                    >
                      Kartu Stok →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add New SKU */}
      {showAddSkuModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="h-5 w-5 text-emerald-400" />
                Registrasi Master Material SKU Baru
              </h3>
              <button
                onClick={() => setShowAddSkuModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSku} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kode SKU:</label>
                  <input
                    type="text"
                    required
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Barcode (EAN-13):</label>
                  <input
                    type="text"
                    value={skuBarcode}
                    onChange={(e) => setSkuBarcode(e.target.value)}
                    placeholder="899..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Material / Bahan:</label>
                <input
                  type="text"
                  required
                  value={skuName}
                  onChange={(e) => setSkuName(e.target.value)}
                  placeholder="e.g. Salicylic Acid USP Grade 99%"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama INCI (Cosmetic Standard):</label>
                  <input
                    type="text"
                    value={skuInci}
                    onChange={(e) => setSkuInci(e.target.value)}
                    placeholder="e.g. Salicylic Acid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Kategori Material:</label>
                  <select
                    value={skuCategory}
                    onChange={(e) => setSkuCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  >
                    <option value="Active Ingredient">Active Ingredient</option>
                    <option value="Raw Material">Raw Material Base</option>
                    <option value="Packaging Material">Packaging Material</option>
                    <option value="Finished Goods">Finished Goods</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Satuan UOM:</label>
                  <select
                    value={skuUom}
                    onChange={(e) => setSkuUom(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Gram">Gram</option>
                    <option value="Liter">Liter</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Bottle">Bottle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stok Awal (Qty):</label>
                  <input
                    type="number"
                    value={skuQty}
                    onChange={(e) => setSkuQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga per Unit (IDR):</label>
                  <input
                    type="number"
                    value={skuUnitCost}
                    onChange={(e) => setSkuUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-emerald-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min / Safety Stock:</label>
                  <input
                    type="number"
                    value={skuMin}
                    onChange={(e) => setSkuMin(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Point (ROP):</label>
                  <input
                    type="number"
                    value={skuRop}
                    onChange={(e) => setSkuRop(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Economic Order Qty (EOQ):</label>
                  <input
                    type="number"
                    value={skuEoq}
                    onChange={(e) => setSkuEoq(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSkuModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow hover:brightness-110"
                >
                  Simpan Master SKU Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
