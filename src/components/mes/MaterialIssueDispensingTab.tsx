import React, { useState } from 'react';
import {
  Boxes,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Check,
  Search,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { MaterialDispensingItem } from '../../types/mes';

interface MaterialIssueDispensingTabProps {
  dispensingList: MaterialDispensingItem[];
  onVerifyDispensing?: (id: string) => void;
}

export const MaterialIssueDispensingTab: React.FC<MaterialIssueDispensingTabProps> = ({
  dispensingList,
  onVerifyDispensing,
}) => {
  const [activeItems, setActiveItems] = useState<MaterialDispensingItem[]>(dispensingList);
  const [searchTerm, setSearchTerm] = useState('');

  const handleConfirmWeighing = (id: string) => {
    setActiveItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Issued', scannedQr: true } : item
      )
    );
    if (onVerifyDispensing) onVerifyDispensing(id);
  };

  const filteredItems = activeItems.filter(
    (item) =>
      item.rawMaterialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawMaterialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Boxes className="h-4 w-4 text-indigo-400" />
            Penimbangan & Dispensing Bahan Baku (Material Issue & FEFO Scan)
          </h2>
          <p className="text-xs text-slate-400">
            Kamar Penimbangan Cleanroom Class D: Scan QR Barcode Lot FEFO, Kalibrasi Timbangan Analitis, & Verifikasi Toleransi Akurasi Weight (±0.1%).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-xs font-bold font-mono">
            Cleanroom Booth #1 Active
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari Bahan Baku, Kode RM, atau Nomor Lot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.value || e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Dispensing Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const weightDiff = Math.abs(item.actualQtyKg - item.targetQtyKg);
          const isWithinTolerance = weightDiff <= item.targetQtyKg * (item.tolerancePercent / 100);

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                    Phase: {item.phase}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{item.rawMaterialName}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Issued'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40 animate-pulse'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Kode Raw Material:</span>
                  <span className="text-teal-300 font-bold">{item.rawMaterialCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Lot Barcode FEFO:</span>
                  <span className="text-amber-300 font-bold">{item.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Scale ID:</span>
                  <span className="text-indigo-300 font-bold">{item.scaleId}</span>
                </div>
              </div>

              {/* Weight Target vs Actual */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Target Standar Formula:</span>
                  <p className="text-lg font-black text-slate-200">{item.targetQtyKg} Kg</p>
                  <span className="text-[10px] text-slate-400">Toleransi ±{item.tolerancePercent}%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Hasil Timbangan Realtime:</span>
                  <p className={`text-lg font-black ${isWithinTolerance ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {item.actualQtyKg} Kg
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {isWithinTolerance ? '✓ Presisi Dalam Limit' : '⚠ Diluar Toleransi'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Dispenser: {item.operatorName}</span>
                {item.status !== 'Issued' ? (
                  <button
                    onClick={() => handleConfirmWeighing(item.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>Scan QR & Verifikasi</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Scanned & Verified</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
