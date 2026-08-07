import React from 'react';
import {
  TrendingUp,
  Factory,
  CheckCircle2,
  AlertTriangle,
  Award,
  DollarSign,
  Activity,
  Bot,
  Zap,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { BatchProduction, BpomSubmission, Tenant } from '../types';
import { formatCurrencyIDR, formatNumber } from '../lib/utils';

interface ExecutiveDashboardProps {
  tenant: Tenant;
  batches: BatchProduction[];
  bpoms: BpomSubmission[];
  onOpenAiCenter: () => void;
  onOpenBlueprint: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  tenant,
  batches,
  bpoms,
  onOpenAiCenter,
  onOpenBlueprint,
}) => {
  const completedBatches = batches.filter((b) => b.status === 'completed');
  const avgYield =
    completedBatches.length > 0
      ? completedBatches.reduce((acc, b) => acc + b.yieldPercentage, 0) / completedBatches.length
      : 98.5;

  const totalYieldKg = batches.reduce((acc, b) => acc + (b.actualQuantityKg || 0), 0);
  const activeBatchesCount = batches.filter((b) => b.status === 'mixing' || b.status === 'weighing').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Executive Brief */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Sistem Operasional Pabrik Realtime
            </span>
            <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
              CPKB ISO 22716 Verified
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Executive Control Center — {tenant.name}
          </h2>
          <p className="text-xs text-slate-300">
            Izin Industri BPOM: <span className="font-mono text-emerald-300">{tenant.bpomNumber}</span> • Status Lini Produksi Cleanroom Class A Aktif.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAiCenter}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/50 hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50"
          >
            <Bot className="h-4 w-4 text-amber-300" />
            <span>Tanyakan AI Assistant</span>
          </button>
          <button
            onClick={onOpenBlueprint}
            className="flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Spesifikasi Architecture</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Revenue & COGM Margin */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Proyeksi Revenue Bulan Ini</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-white">{formatCurrencyIDR(3850000000)}</p>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            <span>+14.2% vs Bulan Lalu</span>
            <span className="ml-auto text-slate-400 text-[11px]">COGM: 42%</span>
          </div>
        </div>

        {/* Metric 2: Average Batch Yield MES */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Rata-rata Yield Produksi (MES)</span>
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-500/20">
              <Factory className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-amber-400">{avgYield.toFixed(1)}%</p>
          <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>Target min 98.0% Terpenuhi</span>
            <span className="ml-auto text-slate-400 text-[11px]">Waste: 1.5%</span>
          </div>
        </div>

        {/* Metric 3: OEE Overall Equipment Effectiveness */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">OEE Homogenizer Tank Lini 1</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-400">86.4%</p>
          <div className="mt-2 flex items-center text-xs text-slate-400 font-medium">
            <Clock className="h-3.5 w-3.5 mr-1 text-amber-400" />
            <span>Downtime: 18m/hari</span>
            <span className="ml-auto text-emerald-400 text-[11px]">World Class</span>
          </div>
        </div>

        {/* Metric 4: BPOM Registrations Approved */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Nomor NA e-BPOM Terbit</span>
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/20">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-white">48 NA Active</p>
          <div className="mt-2 flex items-center text-xs text-blue-400 font-medium">
            <FileCheck2 className="h-3.5 w-3.5 mr-1" />
            <span>2 Produk Dalam Evaluasi</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Batch MES & AI Executive Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Production Batches MES */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Factory className="h-5 w-5 text-emerald-400" />
                Status Batch Produksi MES Realtime
              </h3>
              <p className="text-xs text-slate-400">
                Memantau proses penimbangan, suhu mixing, dan rpm mixer di tanki homogenizer.
              </p>
            </div>
            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              {batches.length} Batch Terdaftar
            </span>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {batch.batchNumber} • {batch.lotNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{batch.formulaName}</h4>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
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

                {/* Batch Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target / Realisasi</span>
                    <span className="font-semibold text-slate-200">
                      {batch.actualQuantityKg > 0 ? batch.actualQuantityKg : batch.targetQuantityKg} / {batch.targetQuantityKg} Kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Suhu Mixer</span>
                    <span className="font-semibold text-emerald-300">
                      {batch.mixingTempCelsius > 0 ? `${batch.mixingTempCelsius}°C` : 'Standby'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Speed Homogenizer</span>
                    <span className="font-semibold text-teal-300">
                      {batch.mixerRpm > 0 ? `${formatNumber(batch.mixerRpm)} RPM` : '0 RPM'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Yield Hasil</span>
                    <span className="font-semibold text-amber-300">
                      {batch.yieldPercentage > 0 ? `${batch.yieldPercentage}%` : 'Dalam Proses'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI CEO Strategic Recommendations Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/60 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sparkles className="h-4 w-4 text-amber-300" />
                AI Executive Intelligence
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Gemini 3.6 Flash
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              Analisis Otomatis Operasional Pabrik Kosmetik
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <p className="font-semibold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  Peringatan Stok Raw Material FEFO
                </p>
                <p className="text-[11px] text-slate-300">
                  Stok <span className="text-emerald-300 font-semibold">Centella Asiatica Extract</span> tersisa 620 Kg (cukup untuk 3 batch serum). Disarankan reorder ke supplier DSM minggu ini.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <p className="font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Peluang Optimasi HPP Formula
                </p>
                <p className="text-[11px] text-slate-300">
                  Substitusi <span className="text-amber-300 font-semibold">PEG-40 Hydrogenated Castor Oil</span> dengan Bio-Solubilizer alami dapat memotong biaya HPP sebesar Rp 4.200/kg tanpa mengubah stabilitas.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAiCenter}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition-all flex items-center justify-center gap-2 ring-1 ring-amber-400/40"
          >
            <Bot className="h-4 w-4 text-amber-300" />
            <span>Buka 16 AI ERP Agent Center</span>
          </button>
        </div>
      </div>
    </div>
  );
};
