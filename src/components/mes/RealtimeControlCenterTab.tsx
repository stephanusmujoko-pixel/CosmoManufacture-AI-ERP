import React from 'react';
import {
  Factory,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Activity,
  Sparkles,
  ChevronRight,
  Thermometer,
  Gauge,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ShopFloorStation, ElectronicBatchRecordItem } from '../../types/mes';

interface RealtimeControlCenterTabProps {
  stations: ShopFloorStation[];
  ebrList: ElectronicBatchRecordItem[];
  activeMoCount: number;
  inProgressWoCount: number;
  onSelectSubTab: (tab: any) => void;
  onOpenLineClearanceModal: () => void;
}

export const RealtimeControlCenterTab: React.FC<RealtimeControlCenterTabProps> = ({
  stations,
  ebrList,
  activeMoCount,
  inProgressWoCount,
  onSelectSubTab,
  onOpenLineClearanceModal,
}) => {
  const primaryEbr = ebrList[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Active Workstations & Live SCADA Telemetry */}
      <div className="lg:col-span-2 space-y-6">
        {/* Live Work Center Operational Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-bold text-white">Status Live Shop Floor & Stasiun Kompounding</h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded font-bold">
              {stations.filter((s) => s.status === 'Running').length} Running • {stations.filter((s) => s.status === 'CIP Cleaning').length} Cleaning
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((st) => (
              <div
                key={st.id}
                className={`p-4 rounded-xl bg-slate-900/90 border space-y-3 transition-all ${
                  st.status === 'Running'
                    ? 'border-teal-500/40 shadow-lg ring-1 ring-teal-500/20'
                    : st.status === 'CIP Cleaning'
                    ? 'border-amber-500/40'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-300">{st.line}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                      st.status === 'Running'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : st.status === 'CIP Cleaning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {st.status === 'Running' && <Play className="h-3 w-3 fill-emerald-300" />}
                    {st.status === 'CIP Cleaning' && <RotateCcw className="h-3 w-3 animate-spin" />}
                    <span>{st.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{st.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {st.currentMo ? `MO: ${st.currentMo} • Batch: ${st.currentBatch}` : 'Siap Menerima Batch Baru'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Suhu Tank</span>
                    <span className="font-bold text-amber-300">{st.temperatureC}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">RPM Homogenizer</span>
                    <span className="font-bold text-cyan-300">{st.mixingRpm.toLocaleString()} RPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pressure</span>
                    <span className="font-bold text-teal-300">{st.vacuumBar} bar</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Operator: {st.operator || 'Unassigned'}</span>
                    <span className="text-emerald-400 font-bold">{st.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${st.progressPercent}%` }}
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Electronic Batch Record Live Parameter Tracking */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Electronic Batch Record (EBR) Live Telemetry Logging</h3>
              <p className="text-xs text-slate-400">
                Kepatuhan GMP / CPKB BPOM • Batch: <span className="text-teal-300 font-bold">{primaryEbr?.batchNumber}</span>
              </p>
            </div>
            <button
              onClick={() => onSelectSubTab('ebr_batch_record')}
              className="text-xs text-teal-400 font-bold hover:underline flex items-center space-x-1"
            >
              <span>Buka Lembar EBR Lengkap</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-amber-400" />
                Suhu Homogenisasi
              </span>
              <p className="text-lg font-black text-amber-300">{primaryEbr?.processParameters.temperatureC} °C</p>
              <span className="text-[10px] text-emerald-400">Target: {primaryEbr?.processParameters.targetTempC}°C ±2°C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Gauge className="h-3 w-3 text-cyan-400" />
                Kecepatan Mixer
              </span>
              <p className="text-lg font-black text-cyan-300">{primaryEbr?.processParameters.mixingRpm} RPM</p>
              <span className="text-[10px] text-emerald-400">Target: {primaryEbr?.processParameters.targetRpm} RPM</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Activity className="h-3 w-3 text-emerald-400" />
                In-Process pH
              </span>
              <p className="text-lg font-black text-emerald-300">{primaryEbr?.processParameters.currentPh} pH</p>
              <span className="text-[10px] text-emerald-400">Spec: {primaryEbr?.processParameters.targetPhMin} - {primaryEbr?.processParameters.targetPhMax}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Sliders className="h-3 w-3 text-purple-400" />
                Viskositas Bulk
              </span>
              <p className="text-lg font-black text-purple-300">{primaryEbr?.processParameters.viscosityCps} cPs</p>
              <span className="text-[10px] text-emerald-400">Pass Viscometer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: AI Production Intelligence & Line Clearance Panel */}
      <div className="space-y-6">
        {/* AI Production Assistant Recommender */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-amber-500/20 pb-2">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <h3 className="text-xs font-bold text-amber-200">AI MES Production Intelligence</h3>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                <span>1. Prediksi Pressure Nozzle Line A</span>
                <span className="text-[10px] text-slate-400">Filling Speed</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Kecepatan filling dropper pada Line A mengalami fluktuasi 2.8%. Kalibrasi tekanan pneumatik dianjurkan sebelum pengisian 20,000 Pcs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                <span>2. Optimasi Yield Bulk Serum</span>
                <span className="text-[10px] text-slate-400">Yield Recovery</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Pendinginan fase air dari 40 ke 32 menit meningkatkan recovery rate active Niacinamide sebesar +0.4% tanpa mempengaruhi viskositas target.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectSubTab('ai_production')}
            className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all text-center"
          >
            Konsultasi AI Production Copilot →
          </button>
        </div>

        {/* Line Clearance Quick Verification Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white">Status Line Clearance Cleanroom</h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
              ✓ Verified CPKB
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span>1. Sanitasi Vessel & Piping CIP</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>2. Kalibrasi Timbangan & Sensor</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>3. Verifikasi Label FEFO Bahan</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>4. APD Operator Cleanroom Class D</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          <button
            onClick={onOpenLineClearanceModal}
            className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-teal-300 transition-all text-center block"
          >
            Cetak / Verifikasi Line Clearance PDF
          </button>
        </div>
      </div>
    </div>
  );
};
