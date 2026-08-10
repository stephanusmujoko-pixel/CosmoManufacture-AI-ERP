import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  Cpu,
  UserCheck,
  Calendar,
  Layers,
  ChevronRight,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { WorkOrder } from '../../types/mes';

interface WorkOrdersRoutingTabProps {
  workOrders: WorkOrder[];
  onUpdateWoStatus?: (woId: string, newStatus: WorkOrder['status']) => void;
}

export const WorkOrdersRoutingTab: React.FC<WorkOrdersRoutingTabProps> = ({
  workOrders,
  onUpdateWoStatus,
}) => {
  const [selectedMoFilter, setSelectedMoFilter] = useState<string>('all');

  const uniqueMoNumbers = Array.from(new Set(workOrders.map((w) => w.moNumber)));

  const filteredOrders = workOrders.filter(
    (wo) => selectedMoFilter === 'all' || wo.moNumber === selectedMoFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Work Orders (WO) & Routing Operasi Produksi Stasiun
          </h2>
          <p className="text-xs text-slate-400">
            Perintah Kerja Berjenjang: Penimbangan Raw Material, Compounding Emulsi High Shear, In-Process QC Sampling, Filling Botol, & Serialization Outer Box.
          </p>
        </div>

        {/* Filter by MO */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Filter MO:</span>
          <select
            value={selectedMoFilter}
            onChange={(e) => setSelectedMoFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-bold focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua MO (Manufacturing Orders)</option>
            {uniqueMoNumbers.map((mo) => (
              <option key={mo} value={mo}>
                {mo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WO Routing Timeline Cards */}
      <div className="space-y-4">
        {filteredOrders.map((wo) => (
          <div
            key={wo.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
                  {wo.woNumber}
                </span>
                <div>
                  <div className="text-xs font-mono text-slate-400">MO Ref: {wo.moNumber}</div>
                  <h3 className="text-base font-extrabold text-white">{wo.operationName}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border flex items-center space-x-1.5 ${
                    wo.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : wo.status === 'In Progress'
                      ? 'bg-teal-950 text-teal-300 border-teal-500/40 animate-pulse'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {wo.status === 'In Progress' && <Play className="h-3 w-3 fill-teal-300" />}
                  {wo.status === 'Completed' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  <span>{wo.status}</span>
                </span>

                {wo.status === 'Ready to Start' && onUpdateWoStatus && (
                  <button
                    onClick={() => onUpdateWoStatus(wo.id, 'In Progress')}
                    className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                  >
                    Mulai WO
                  </button>
                )}
                {wo.status === 'In Progress' && onUpdateWoStatus && (
                  <button
                    onClick={() => onUpdateWoStatus(wo.id, 'Completed')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Selesaikan WO
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 text-[10px] block">Stasiun Work Center:</span>
                <span className="text-slate-200 font-bold">{wo.workCenter}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Mesin Terpasang:</span>
                <span className="text-cyan-300 font-bold">{wo.machineName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Operator Ditugaskan:</span>
                <span className="text-amber-300 font-bold">{wo.assignedOperator}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Shift Kerja:</span>
                <span className="text-indigo-300 font-bold">{wo.shift}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Rencana Jadwal: <strong className="text-amber-300">{wo.plannedStart}</strong> s/d <strong className="text-amber-300">{wo.plannedFinish}</strong></span>
              </div>
              {wo.actualStart && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="h-4 w-4 text-teal-400" />
                  <span>Realisasi Jam Mulai: <strong className="text-emerald-300">{wo.actualStart}</strong> {wo.actualFinish ? `s/d ${wo.actualFinish}` : '(Sedang Berjalan)'}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Progres Operasi Stasiun:</span>
                <span className="text-teal-300 font-extrabold">{wo.progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${wo.progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
