import React, { useState } from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  AlertOctagon,
  Thermometer,
  Gauge,
  Sliders,
  Activity,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ShopFloorStation } from '../../types/mes';

interface ShopFloorLiveTabProps {
  stations: ShopFloorStation[];
  onOpenLineClearanceModal: () => void;
}

export const ShopFloorLiveTab: React.FC<ShopFloorLiveTabProps> = ({
  stations,
  onOpenLineClearanceModal,
}) => {
  const [activeStationId, setActiveStationId] = useState<string>(stations[0]?.id || 'ST-01');
  const [stationStates, setStationStates] = useState<ShopFloorStation[]>(stations);

  const selectedStation = stationStates.find((s) => s.id === activeStationId) || stationStates[0];

  const handleToggleStationStatus = (id: string, newStatus: ShopFloorStation['status']) => {
    setStationStates((prev) =>
      prev.map((st) => (st.id === id ? { ...st, status: newStatus } : st))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" />
            Shop Floor Control & Live Parameter SCADA Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Monitoring Sensor IoT Realtime: Suhu Pemanasan Vessel, Kecepatan Mixing RPM, Vacuum Pressure, & Kontrol Tombol Darurat (E-Stop).
          </p>
        </div>

        <button
          onClick={onOpenLineClearanceModal}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Verifikasi Line Clearance CPKB</span>
        </button>
      </div>

      {/* Main Grid: Workstation Selector & Live Instrument Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Workstations */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Pilih Stasiun Vessel / Line
          </h3>

          <div className="space-y-3">
            {stationStates.map((st) => {
              const isSelected = st.id === selectedStation.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStationId(st.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-r from-slate-900 via-slate-950 to-purple-950/40 shadow-xl ring-1 ring-purple-500/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-300">{st.code}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                        st.status === 'Running'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : st.status === 'CIP Cleaning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {st.status === 'Running' && <Play className="h-3 w-3 fill-emerald-300" />}
                      <span>{st.status}</span>
                    </span>
                  </div>

                  <h4 className="mt-1 text-sm font-bold text-white">{st.name}</h4>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Cleanroom: <strong className="text-teal-300">{st.cleanroomClass}</strong></span>
                    <span>Line: <strong className="text-slate-200">{st.line}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Dashboard SCADA Instrument Gauges for Selected Station */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-slate-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                    SCADA LIVE TELEMETRY
                  </span>
                  <h3 className="text-base font-extrabold text-white">{selectedStation.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Batch Aktif: <span className="text-teal-300 font-bold">{selectedStation.currentBatch || 'Tidak Ada Batch Running'}</span> | Operator: {selectedStation.operator || 'Unassigned'}
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                {selectedStation.status === 'Running' ? (
                  <button
                    onClick={() => handleToggleStationStatus(selectedStation.id, 'Idle')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Vessel</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStationStatus(selectedStation.id, 'Running')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                  >
                    <Play className="h-4 w-4" />
                    <span>Jalankan Vessel</span>
                  </button>
                )}

                <button
                  onClick={() => handleToggleStationStatus(selectedStation.id, 'CIP Cleaning')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 hover:bg-slate-800 font-bold text-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>CIP Rinse</span>
                </button>

                <button
                  onClick={() => alert(`EMERGENCY STOP dipicu pada stasiun ${selectedStation.code}!`)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  <AlertOctagon className="h-4 w-4" />
                  <span>E-STOP</span>
                </button>
              </div>
            </div>

            {/* Instrument Gauges Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-amber-400" /> Suhu Vessel
                </span>
                <p className="text-2xl font-black text-amber-300">{selectedStation.temperatureC}°C</p>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Target: {selectedStation.targetTempC}°C</span>
                  <span className="text-emerald-400 font-bold">NORMAL</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-cyan-400" /> RPM Homogenizer
                </span>
                <p className="text-2xl font-black text-cyan-300">{selectedStation.mixingRpm.toLocaleString()}</p>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Target: {selectedStation.targetRpm}</span>
                  <span className="text-emerald-400 font-bold">STABLE</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-teal-400" /> Vacuum Pressure
                </span>
                <p className="text-2xl font-black text-teal-300">{selectedStation.vacuumBar} bar</p>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Target: {selectedStation.targetVacuumBar} bar</span>
                  <span className="text-emerald-400 font-bold">SEALED</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-400" /> In-Process pH
                </span>
                <p className="text-2xl font-black text-emerald-300">{selectedStation.currentPh}</p>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Spec: 5.2 - 5.8</span>
                  <span className="text-emerald-400 font-bold">PASS</span>
                </div>
              </div>
            </div>

            {/* Batch Stage Progress Bar */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold">Progres Fasa Kompounding Vessel:</span>
                <span className="text-purple-300 font-black">{selectedStation.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${selectedStation.progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 via-teal-400 to-emerald-400 animate-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
