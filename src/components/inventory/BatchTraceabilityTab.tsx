import React, { useState } from 'react';
import {
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ShieldCheck,
  Building2,
  Clock,
  Printer,
  XCircle,
} from 'lucide-react';
import { BatchLotRecord } from '../../types/inventory';

interface BatchTraceabilityTabProps {
  batches: BatchLotRecord[];
  onToggleQcStatus: (batchId: string, newStatus: BatchLotRecord['inspectionStatus']) => void;
}

export const BatchTraceabilityTab: React.FC<BatchTraceabilityTabProps> = ({
  batches,
  onToggleQcStatus,
}) => {
  const [selectedLot, setSelectedLot] = useState<BatchLotRecord>(batches[0] || null);
  const [lotSearchTerm, setLotSearchTerm] = useState('');

  const filteredBatches = batches.filter(
    (b) =>
      b.internalLotNumber.toLowerCase().includes(lotSearchTerm.toLowerCase()) ||
      b.itemName.toLowerCase().includes(lotSearchTerm.toLowerCase()) ||
      b.batchSupplier.toLowerCase().includes(lotSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 shadow-lg">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="h-4 w-4 text-cyan-400" />
          Penelusuran Silsilah Batch & Lot (Full Genealogic Traceability System)
        </h2>
        <p className="text-xs text-slate-400">
          Lacak alur silsilah dari PO Supplier → Goods Receipt (GRN) → Bin Gudang → Dispensing MES → Kemasan Barang Jadi → Surat Jalan Buyer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Active Batches */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari Lot, Material, Supplier..."
              value={lotSearchTerm}
              onChange={(e) => setLotSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {filteredBatches.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedLot(b)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                  selectedLot?.id === b.id
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-mono font-black text-cyan-300">{b.internalLotNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.inspectionStatus === 'QC Released'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : b.inspectionStatus === 'Quarantine'
                        ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {b.inspectionStatus}
                  </span>
                </div>

                <div className="space-y-1 font-mono">
                  <p className="font-bold text-white line-clamp-1">{b.itemName}</p>
                  <p className="text-slate-400 text-[11px]">Supplier Lot: {b.batchSupplier}</p>
                  <p className="text-slate-400 text-[11px]">COA: {b.coaRef}</p>
                  <div className="flex justify-between items-center text-slate-300 pt-1">
                    <span>Sisa Stok: <strong>{b.currentStockQty} Kg</strong></span>
                    <span className="text-amber-400 text-[10px] font-bold">Exp: {b.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Genealogic Trace Tree Diagram */}
        {selectedLot ? (
          <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Detail Silsilah Genealogy:</span>
                <h3 className="text-base font-black text-white font-mono">{selectedLot.internalLotNumber}</h3>
                <p className="text-xs text-slate-400">{selectedLot.itemName}</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* QC Release toggle */}
                <button
                  onClick={() =>
                    onToggleQcStatus(
                      selectedLot.id,
                      selectedLot.inspectionStatus === 'QC Released' ? 'Quarantine' : 'QC Released'
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow transition-all ${
                    selectedLot.inspectionStatus === 'QC Released'
                      ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-500/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                  }`}
                >
                  {selectedLot.inspectionStatus === 'QC Released' ? 'Ubah ke Karantina' : 'Release Lot QC ✓'}
                </button>

                <button
                  onClick={() => alert(`Mencetak Laporan Certified Traceability PDF untuk ${selectedLot.internalLotNumber}...`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Traceability Report</span>
                </button>
              </div>
            </div>

            {/* Genealogic Flow Cards */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    STEP 1: INBOUND PO & SUPPLIER CERTIFICATION
                  </span>
                  <p className="font-bold text-white text-sm">PO-2026-0881 • {selectedLot.batchSupplier}</p>
                  <p className="text-slate-400 text-[11px]">
                    Sertifikat COA Ref: <strong>{selectedLot.coaRef}</strong> | MSDS: <strong>{selectedLot.msdsRef}</strong>
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
              </div>

              <div className="flex justify-center text-slate-600">↓</div>

              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    STEP 2: WAREHOUSE RECEIVING & BIN STORAGE
                  </span>
                  <p className="font-bold text-white text-sm">GRN-202608-0112 • Inbound Qty: {selectedLot.currentStockQty} Kg</p>
                  <p className="text-slate-400 text-[11px]">Lokasi Gudang: <strong>{selectedLot.warehouseLocation}</strong></p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-indigo-400 flex-shrink-0" />
              </div>

              <div className="flex justify-center text-slate-600">↓</div>

              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    STEP 3: MES BATCH PRODUCTION DISPENSING
                  </span>
                  <p className="font-bold text-white text-sm">WO-BATCH-9901 (CosmoGlow Serum 1000L)</p>
                  <p className="text-slate-400 text-[11px]">
                    Di-dispense oleh: Operator MES (Timbangan Digital Scalemate Verified)
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-amber-400 flex-shrink-0" />
              </div>

              <div className="flex justify-center text-slate-600">↓</div>

              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    STEP 4: FINISHED GOOD DISPATCH & SHIPMENT
                  </span>
                  <p className="font-bold text-white text-sm">FG-SRM-2026-12 (12,400 Bottles)</p>
                  <p className="text-slate-400 text-[11px]">
                    Dispatched to: PT GlowSkin Beauty Indonesia (Delivery Order DO-MAKLON-0811)
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-8 text-center text-slate-500">
            Pilih Lot dari daftar di sebelah kiri untuk melihat diagram genealogy.
          </div>
        )}
      </div>
    </div>
  );
};
