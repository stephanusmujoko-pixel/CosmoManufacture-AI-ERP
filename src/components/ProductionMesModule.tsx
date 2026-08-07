import React, { useState } from 'react';
import {
  Factory,
  Flame,
  Gauge,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { BatchProduction } from '../types';
import { formatNumber } from '../lib/utils';

interface ProductionMesModuleProps {
  batches: BatchProduction[];
  onUpdateBatchStatus?: (batchId: string, status: BatchProduction['status']) => void;
}

export const ProductionMesModule: React.FC<ProductionMesModuleProps> = ({ batches }) => {
  const [activeBatch, setActiveBatch] = useState<BatchProduction>(batches[0]);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Factory className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Manufacturing Execution System (MES) — Batch Control
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Eksekusi real-time penimbangan bahan baku, kontrol suhu tanki mixing, RPM homogenizer, dan rekonsiliasi yield.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Lini Cleanroom Class A Online
          </span>
        </div>
      </div>

      {/* Grid: Batch Control Dashboard & Live Mixer Sensor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Batch Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Daftar Batch Produksi
          </h3>

          <div className="space-y-3">
            {batches.map((batch) => {
              const isSelected = activeBatch.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setActiveBatch(batch)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/60 shadow-lg ring-1 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{batch.batchNumber}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        batch.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : batch.status === 'mixing'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-slate-100">{batch.formulaName}</h4>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>Target: <strong className="text-slate-200">{batch.targetQuantityKg} Kg</strong></span>
                    <span>Operator: <strong className="text-cyan-300">{batch.operatorName.split(' ')[0]}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Realtime Homogenizer Tank Monitor & Controls */}
        <div className="lg:col-span-2 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs font-bold text-amber-400">
                {activeBatch.batchNumber} • Lot: {activeBatch.lotNumber}
              </span>
              <h3 className="text-lg font-extrabold text-white">{activeBatch.formulaName}</h3>
              <p className="text-xs text-slate-400">Operator Penanggung Jawab: {activeBatch.operatorName}</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-emerald-400 border border-slate-800">
                Yield: {activeBatch.yieldPercentage > 0 ? `${activeBatch.yieldPercentage}%` : 'Calculating...'}
              </span>
            </div>
          </div>

          {/* Realtime Sensors Gauge Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sensor 1: Temperature Sensor */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-400" />
                  Suhu Tanki Mixing
                </span>
                <span className="font-mono text-[10px] text-amber-300">Sensor PT100</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-white">
                  {activeBatch.mixingTempCelsius > 0 ? `${activeBatch.mixingTempCelsius}°C` : '28.0°C'}
                </p>
                <span className="text-xs text-amber-300 font-medium">Target: 65.0°C</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((activeBatch.mixingTempCelsius || 28) / 75) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Sensor 2: Homogenizer Mixer Speed RPM */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-cyan-400" />
                  Homogenizer Speed RPM
                </span>
                <span className="font-mono text-[10px] text-cyan-300">High-Shear Tank</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-white">
                  {activeBatch.mixerRpm > 0 ? `${formatNumber(activeBatch.mixerRpm)}` : '0'} <span className="text-sm font-normal text-slate-400">RPM</span>
                </p>
                <span className="text-xs text-cyan-300 font-medium">Target: 3,500 RPM</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((activeBatch.mixerRpm || 0) / 4000) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Process Timeline Steps */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Tahapan Eksekusi Batch MES
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-emerald-500/40 text-emerald-300">
                <p className="font-bold">1. Weighing Phase</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Penimbangan Terverifikasi Barcode</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-cyan-500/40 text-cyan-300">
                <p className="font-bold">2. Mixing & Heating</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Suhu 65°C, Speed 3,200 RPM</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-slate-400">
                <p className="font-bold">3. QC Sample Swab</p>
                <p className="text-[10px] text-slate-400 mt-0.5">pH, Viscosity & Micro ALT</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-slate-400">
                <p className="font-bold">4. Filling & Packaging</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pengisian Botol Dropper 30ml</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
