import React, { useState } from 'react';
import {
  Microscope,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Search,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { QualityControlCheck } from '../types';
import { MOCK_QC_CHECKS } from '../data/mockErpData';

export const QualityControlModule: React.FC = () => {
  const [qcList, setQcList] = useState<QualityControlCheck[]>(MOCK_QC_CHECKS);
  const [selectedQc, setSelectedQc] = useState<QualityControlCheck>(qcList[0]);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-violet-950 text-violet-400 border border-violet-500/30">
              <Microscope className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Quality Control & Microbiology Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pengujian sampel batch (pH, Viskositas, Specific Gravity, Angka Lempeng Total Mikrobiologi ALT &lt;100 CFU/g), dan penerbitan rilis lulus mutu.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-violet-950 px-3 py-1 text-xs font-bold text-violet-300 border border-violet-500/30">
            Lab Mikrobiologi Steril
          </span>
        </div>
      </div>

      {/* Grid: QC List & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: QC Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Daftar Inspeksi Mutu Batch
          </h3>

          <div className="space-y-2">
            {qcList.map((qc) => (
              <div
                key={qc.id}
                onClick={() => setSelectedQc(qc)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selectedQc.id === qc.id
                    ? 'border-violet-500 bg-gradient-to-r from-slate-900 to-violet-950/60 shadow-lg ring-1 ring-violet-500/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{qc.batchNumber}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      qc.overallStatus === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {qc.overallStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2">Inspektur: {qc.inspectedBy}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">Uji: {qc.testDate.split('T')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inspection Inspector Detail */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs font-bold text-amber-400">
                Batch: {selectedQc.batchNumber}
              </span>
              <h3 className="text-lg font-extrabold text-white">Inspeksi Pengawasan Mutu QC</h3>
              <p className="text-xs text-slate-400">Penguji: {selectedQc.inspectedBy}</p>
            </div>

            <span
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold uppercase ${
                selectedQc.overallStatus === 'approved'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              Status: {selectedQc.overallStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Pengujian pH</span>
              <p className="text-lg font-bold text-emerald-300 font-mono">{selectedQc.pHValue}</p>
              <p className="text-[10px] text-slate-400">
                Spesifikasi: {selectedQc.pHStandardMin} - {selectedQc.pHStandardMax}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Pengujian Viskositas</span>
              <p className="text-lg font-bold text-teal-300 font-mono">{selectedQc.viscosityCps} cPs</p>
              <p className="text-[10px] text-slate-400">
                Spesifikasi: {selectedQc.viscosityStandardMin} - {selectedQc.viscosityStandardMax} cPs
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Uji Cemaran Mikrobiologi ALT</span>
              <p className="text-lg font-bold text-amber-300 font-mono">
                {selectedQc.microbiologyColoniesCfu} CFU/g
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold">
                Batas Aman BPOM &lt; 100 CFU/g
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Specific Gravity</span>
              <p className="text-lg font-bold text-slate-200 font-mono">{selectedQc.specificGravity}</p>
              <p className="text-[10px] text-slate-400">Target: 1.020 - 1.050</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1 text-xs">
            <span className="font-bold text-amber-300 block">Catatan Inspektur Laboratorium:</span>
            <p className="text-slate-300">{selectedQc.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
