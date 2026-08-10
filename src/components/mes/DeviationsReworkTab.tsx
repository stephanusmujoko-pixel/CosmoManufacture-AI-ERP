import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  ChevronRight,
  Search,
} from 'lucide-react';
import { ProductionDeviation } from '../../types/mes';

interface DeviationsReworkTabProps {
  deviations: ProductionDeviation[];
  onAddDeviation?: (dev: ProductionDeviation) => void;
}

export const DeviationsReworkTab: React.FC<DeviationsReworkTabProps> = ({
  deviations,
  onAddDeviation,
}) => {
  const [showNewDevModal, setShowNewDevModal] = useState(false);
  const [devList, setDevList] = useState<ProductionDeviation[]>(deviations);

  const [newDev, setNewDev] = useState({
    moNumber: 'MO-202608-01',
    batchNumber: 'BATCH-2026-SRM-088',
    type: 'Temperature Spike' as ProductionDeviation['type'],
    severity: 'Minor' as ProductionDeviation['severity'],
    description: '',
    rootCause: '',
    capaAction: '',
  });

  const handleCreateDeviation = () => {
    if (!newDev.description) {
      alert('Harap isi deskripsi deviasi!');
      return;
    }

    const created: ProductionDeviation = {
      id: `DEV-${Date.now()}`,
      devNumber: `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      moNumber: newDev.moNumber,
      batchNumber: newDev.batchNumber,
      type: newDev.type,
      severity: newDev.severity,
      description: newDev.description,
      rootCause: newDev.rootCause || 'Dalam proses investigasi tim QA',
      capaAction: newDev.capaAction || 'Pengujian laboratorium IPC ulang',
      reportedBy: 'Ahmad Hidayat (Lead Operator)',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      approvalStatus: 'Pending Review',
    };

    setDevList([created, ...devList]);
    if (onAddDeviation) onAddDeviation(created);
    setShowNewDevModal(false);
    setNewDev({
      moNumber: 'MO-202608-01',
      batchNumber: 'BATCH-2026-SRM-088',
      type: 'Temperature Spike',
      severity: 'Minor',
      description: '',
      rootCause: '',
      capaAction: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Manajemen Deviasi Produksi, Non-Conformance & Rework CAPA
          </h2>
          <p className="text-xs text-slate-400">
            Penanganan Ketidaksesuaian Batch (OOS / OOT): Root Cause Analysis (RCA), Rencana CAPA (Corrective and Preventive Action), & Otorisasi Direktur Quality Assurance.
          </p>
        </div>

        <button
          onClick={() => setShowNewDevModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Laporkan Deviasi Baru</span>
        </button>
      </div>

      {/* Deviations Cards List */}
      <div className="space-y-4">
        {devList.map((dev) => (
          <div
            key={dev.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-4 shadow-xl hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {dev.devNumber}
                </span>
                <h3 className="text-sm font-bold text-white">{dev.type}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    dev.severity === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : dev.severity === 'Major'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  Tingkat Severity: {dev.severity}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    dev.approvalStatus === 'QA Approved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                  }`}
                >
                  {dev.approvalStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">MO Ref:</span>
                <span className="text-teal-300 font-bold">{dev.moNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Nomor Batch:</span>
                <span className="text-amber-300 font-bold">{dev.batchNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Pelapor:</span>
                <span className="text-slate-200 font-bold">{dev.reportedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Waktu Lapor:</span>
                <span className="text-slate-400">{dev.reportedAt}</span>
              </div>
            </div>

            {/* Description, Root cause & CAPA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-amber-300 font-bold text-[10px] block">Deskripsi Kejadian Deviasi:</span>
                <p className="text-slate-300 text-[11px]">{dev.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-cyan-300 font-bold text-[10px] block">Akar Penyebab (Root Cause Analysis):</span>
                <p className="text-slate-300 text-[11px]">{dev.rootCause}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-emerald-300 font-bold text-[10px] block">Rencana CAPA & Rework:</span>
                <p className="text-slate-300 text-[11px]">{dev.capaAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Laporkan Deviasi Baru */}
      {showNewDevModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Form Laporan Deviasi Produksi Baru</h3>
              </div>
              <button
                onClick={() => setShowNewDevModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Pilih Jenis Kejadian Deviasi:</label>
                <select
                  value={newDev.type}
                  onChange={(e) => setNewDev({ ...newDev, type: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Temperature Spike">Temperature Spike (Lonjakan Suhu Vessel)</option>
                  <option value="Viscosity Out-of-Spec">Viscosity Out-of-Spec (Viskositas Kental / Encer)</option>
                  <option value="Yield Loss > 3%">Yield Loss {'>'} 3% (Susut Kehilangan Bulk Tinggi)</option>
                  <option value="Machine Mechanical Jam">Machine Mechanical Jam (Macet Mesin Filling)</option>
                  <option value="Contamination Risk">Contamination Risk (Resiko Kontaminasi)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tingkat Severity:</label>
                <select
                  value={newDev.severity}
                  onChange={(e) => setNewDev({ ...newDev, severity: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Minor">Minor (Tidak Berpengaruh Langsung pada Kualitas Nutrisi)</option>
                  <option value="Major">Major (Perlu Penyesuaian Uji Laboratorium In-Process)</option>
                  <option value="Critical">Critical (Membutuhkan QA Hold & Investigasi Direksi)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deskripsi Lengkap Kejadian:</label>
                <textarea
                  rows={2}
                  value={newDev.description}
                  onChange={(e) => setNewDev({ ...newDev, description: e.target.value })}
                  placeholder="Contoh: Suhu pemanasan fase air sempat naik melebihi batas toleransi..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dugaan Root Cause Analysis:</label>
                <input
                  type="text"
                  value={newDev.rootCause}
                  onChange={(e) => setNewDev({ ...newDev, rootCause: e.target.value })}
                  placeholder="Contoh: Sensor thermocouple chiller belum re-kalibrasi..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tindakan CAPA yang Diusulkan:</label>
                <input
                  type="text"
                  value={newDev.capaAction}
                  onChange={(e) => setNewDev({ ...newDev, capaAction: e.target.value })}
                  placeholder="Contoh: Sampling ulang IPC pH & micro..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNewDevModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateDeviation}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Kirim Laporan Deviasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
