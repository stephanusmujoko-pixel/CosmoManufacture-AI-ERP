import React, { useState } from 'react';
import {
  Gauge,
  Activity,
  Clock,
  AlertCircle,
  RotateCcw,
  Plus,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { OeeMetric, DowntimeLog } from '../../types/mes';

interface OeeDowntimeAnalysisTabProps {
  oeeMetrics: OeeMetric[];
  downtimeLogs: DowntimeLog[];
  onAddDowntimeLog?: (log: DowntimeLog) => void;
}

export const OeeDowntimeAnalysisTab: React.FC<OeeDowntimeAnalysisTabProps> = ({
  oeeMetrics,
  downtimeLogs,
  onAddDowntimeLog,
}) => {
  const [logs, setLogs] = useState<DowntimeLog[]>(downtimeLogs);
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  const [newLog, setNewLog] = useState({
    machineCode: 'EQ-VESSEL-01',
    machineName: 'Vacuum Emulsifier Tank 1000L (Vessel 01)',
    category: 'Setup & Changeover' as DowntimeLog['category'],
    durationMinutes: 30,
    reasonNotes: '',
  });

  const handleCreateDowntimeLog = () => {
    if (!newLog.reasonNotes) {
      alert('Harap isi alasan downtime!');
      return;
    }

    const created: DowntimeLog = {
      id: `DT-${Date.now()}`,
      machineCode: newLog.machineCode,
      machineName: newLog.machineName,
      category: newLog.category,
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      durationMinutes: Number(newLog.durationMinutes),
      reasonNotes: newLog.reasonNotes,
      status: 'Active Downtime',
    };

    setLogs([created, ...logs]);
    if (onAddDowntimeLog) onAddDowntimeLog(created);
    setShowAddLogModal(false);
    setNewLog({
      machineCode: 'EQ-VESSEL-01',
      machineName: 'Vacuum Emulsifier Tank 1000L (Vessel 01)',
      category: 'Setup & Changeover',
      durationMinutes: 30,
      reasonNotes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Gauge className="h-4 w-4 text-teal-400" />
            Monitoring OEE (Overall Equipment Effectiveness) & Rekam Downtime
          </h2>
          <p className="text-xs text-slate-400">
            Kalkulasi World-Class OEE ({'>'} 85%): Availability (Ketersediaan Jam Mesin), Performance (Kecepatan Operasional), & Quality (Tingkat Lolos IPC QC).
          </p>
        </div>

        <button
          onClick={() => setShowAddLogModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Rekam Downtime Mesin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OEE Metric Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Metrik Efektivitas Mesin (OEE) Per Stasiun
          </h3>

          {oeeMetrics.map((o) => (
            <div
              key={o.machineCode}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-400">{o.machineCode}</span>
                  <h4 className="text-sm font-bold text-white">{o.machineName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Overall OEE Score</span>
                  <span
                    className={`text-xl font-black font-mono ${
                      o.overallOeePercent >= 85
                        ? 'text-emerald-400'
                        : o.overallOeePercent >= 75
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {o.overallOeePercent}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Availability (Uptime)</span>
                  <span className="font-bold text-teal-300 text-base">{o.availabilityPercent}%</span>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${o.availabilityPercent}%` }} className="h-full bg-teal-400" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Performance (Speed)</span>
                  <span className="font-bold text-cyan-300 text-base">{o.performancePercent}%</span>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${o.performancePercent}%` }} className="h-full bg-cyan-400" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Quality (Good Units)</span>
                  <span className="font-bold text-emerald-300 text-base">{o.qualityPercent}%</span>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div style={{ width: `${o.qualityPercent}%` }} className="h-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Downtime Logs Sidebar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white">Log Downtime Mesin Hari Ini</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {logs.length} Catatan Log
            </span>
          </div>

          <div className="space-y-3">
            {logs.map((dt) => (
              <div
                key={dt.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold">{dt.machineCode}</span>
                  <span className="text-[10px] font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                    {dt.durationMinutes} Menit
                  </span>
                </div>
                <p className="text-white font-bold">{dt.category}</p>
                <p className="text-slate-400 text-[11px]">{dt.reasonNotes}</p>
                <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Mulai: {dt.startTime}</span>
                  <span className={dt.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-300'}>
                    {dt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Rekam Downtime */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Catat Log Downtime Mesin baru</h3>
              </div>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Pilih Mesin / Stasiun:</label>
                <select
                  value={newLog.machineCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const match = oeeMetrics.find((m) => m.machineCode === code);
                    setNewLog({
                      ...newLog,
                      machineCode: code,
                      machineName: match?.machineName || code,
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {oeeMetrics.map((m) => (
                    <option key={m.machineCode} value={m.machineCode}>
                      {m.machineCode} - {m.machineName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori Downtime:</label>
                <select
                  value={newLog.category}
                  onChange={(e) => setNewLog({ ...newLog, category: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Line Cleaning & Sanitization">Line Cleaning & Sanitization (CIP/SIP)</option>
                  <option value="Setup & Changeover">Setup & Changeover (Ganti Mold / Nozzle)</option>
                  <option value="Machine Breakdown">Machine Breakdown (Kerusakan Mekanikal)</option>
                  <option value="QC Hold">QC Hold (Penahanan Kualitas In-Process)</option>
                  <option value="Material Shortage">Material Shortage (Keterlambatan Raw Material)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estimasi Durasi (Menit):</label>
                <input
                  type="number"
                  value={newLog.durationMinutes}
                  onChange={(e) => setNewLog({ ...newLog, durationMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Catatan Detail Alasan Downtime:</label>
                <textarea
                  rows={2}
                  value={newLog.reasonNotes}
                  onChange={(e) => setNewLog({ ...newLog, reasonNotes: e.target.value })}
                  placeholder="Contoh: Pembersihan sisa residu pigmen pewarna lipstick sebelum batch cream..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddLogModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateDowntimeLog}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                Simpan Log Downtime
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
