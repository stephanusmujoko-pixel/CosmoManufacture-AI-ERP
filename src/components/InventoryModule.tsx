import React, { useState } from 'react';
import {
  Boxes,
  Search,
  AlertCircle,
  Calendar,
  Thermometer,
  ShieldCheck,
  Tag,
  Plus,
} from 'lucide-react';
import { RawMaterialStock } from '../types';
import { MOCK_RAW_MATERIALS } from '../data/mockErpData';
import { formatCurrencyIDR, formatNumber } from '../lib/utils';

export const InventoryModule: React.FC = () => {
  const [stockList, setStockList] = useState<RawMaterialStock[]>(MOCK_RAW_MATERIALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStock = stockList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inciName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Boxes className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Warehouse Raw Material & Packaging Inventory (FEFO Control)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Kontrol stok bahan baku aktif, emulsi, pengawet, botol/kemasan, kontrol tanggal kadaluarsa FEFO, dan verifikasi Sertifikasi Halal MUI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            Gudang Ruang Dingin (Cold Room 15°C) Active
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['all', 'active', 'emulsifier', 'preservative', 'packaging'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 font-bold uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-amber-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari bahan baku atau INCI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4">Kode / Material Name</th>
              <th className="p-4">INCI Name & CAS</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Stok Fisik</th>
              <th className="p-4">Biaya / Unit</th>
              <th className="p-4">Suhu Simpan</th>
              <th className="p-4">Kadaluarsa FEFO</th>
              <th className="p-4">Sertifikat Halal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {filteredStock.map((item) => (
              <tr key={item.id} className="hover:bg-slate-950/50">
                <td className="p-4">
                  <span className="font-mono text-[11px] font-bold text-amber-400 block">{item.code}</span>
                  <span className="font-bold text-slate-100">{item.name}</span>
                </td>
                <td className="p-4">
                  <p className="font-mono text-[11px] text-slate-300">{item.inciName}</p>
                  <p className="text-[10px] text-slate-500">CAS: {item.casNumber}</p>
                </td>
                <td className="p-4">
                  <span className="rounded bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-300">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-emerald-300">
                  {formatNumber(item.stockQuantityKg)} {item.category === 'packaging' ? 'pcs' : 'Kg'}
                </td>
                <td className="p-4 font-mono text-slate-200">
                  {formatCurrencyIDR(item.unitCostIdr)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                      item.storageCondition === 'cold_room'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Thermometer className="h-3 w-3 text-cyan-400" />
                    {item.storageCondition === 'cold_room' ? 'Cold Room (15°C)' : 'Suhu Ruang'}
                  </span>
                </td>
                <td className="p-4 font-mono text-amber-300 font-bold">
                  {item.expiryDate}
                </td>
                <td className="p-4">
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {item.halalCertNumber}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
