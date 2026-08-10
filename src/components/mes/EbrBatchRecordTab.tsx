import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Download,
  Clock,
  UserCheck,
  Thermometer,
  Gauge,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';
import { ElectronicBatchRecordItem } from '../../types/mes';

interface EbrBatchRecordTabProps {
  ebrList: ElectronicBatchRecordItem[];
}

export const EbrBatchRecordTab: React.FC<EbrBatchRecordTabProps> = ({ ebrList }) => {
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>(
    ebrList[0]?.batchNumber || 'BATCH-2026-SRM-088'
  );

  const selectedEbr =
    ebrList.find((e) => e.batchNumber === selectedBatchNumber) || ebrList[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-amber-400" />
            Electronic Batch Record (EBR) Standar GMP & CPKB BPOM
          </h2>
          <p className="text-xs text-slate-400">
            Dokumen Digital Batch Produksi Paperless: Critical Process Parameters (CPP), Audit Trail 21 CFR Part 11, Log Operator, & Tanda Tangan Digital Apoteker QA.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedBatchNumber}
            onChange={(e) => setSelectedBatchNumber(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
          >
            {ebrList.map((e) => (
              <option key={e.id} value={e.batchNumber}>
                {e.batchNumber} ({e.productName.slice(0, 25)}...)
              </option>
            ))}
          </select>

          <button
            onClick={() => alert(`Ekspor dokumen Electronic Batch Record (EBR) ${selectedEbr.batchNumber} ke format PDF resmi CPKB BPOM...`)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            <span>Export EBR PDF</span>
          </button>
        </div>
      </div>

      {/* Main EBR Sheet Container */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 space-y-6 shadow-2xl">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-amber-950 text-amber-300 border border-amber-500/40 font-mono">
                CPKB EBR RECORD
              </span>
              <h3 className="text-lg font-black text-white">{selectedEbr.productName}</h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Nomor Batch: <span className="text-teal-300 font-bold">{selectedEbr.batchNumber}</span> | MO Ref: {selectedEbr.moNumber} | Formulasi R&D: {selectedEbr.formulaVersion}
            </p>
          </div>

          <div className="text-left md:text-right font-mono text-xs space-y-1">
            <span className="text-slate-400 block text-[10px]">Status Tanda Tangan Digital Apoteker:</span>
            <span
              className={`font-extrabold flex items-center md:justify-end space-x-1 ${
                selectedEbr.digitalSignatureStatus === 'Signed & Sealed'
                  ? 'text-emerald-400'
                  : 'text-amber-300'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{selectedEbr.digitalSignatureStatus}</span>
            </span>
          </div>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 text-[10px] block">Ukuran Batch Bulk:</span>
            <span className="text-emerald-300 font-bold">{selectedEbr.batchSizeKg} Kg</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Tanggal Manufaktur:</span>
            <span className="text-white font-bold">{selectedEbr.manufactureDate}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Estimasi Tanggal Kadaluarsa:</span>
            <span className="text-amber-300 font-bold">{selectedEbr.expiryDate}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Status In-Process Quality (IPC):</span>
            <span className="text-emerald-400 font-bold">✓ {selectedEbr.qcInProcessStatus}</span>
          </div>
        </div>

        {/* Process Parameters & Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Critical Process Parameters Log */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>1. Log Parameter Proses Kritis (CPP)</span>
              <Thermometer className="h-4 w-4 text-amber-400" />
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Suhu Compounding Tank:</span>
                <span className="text-amber-300 font-bold">
                  {selectedEbr.processParameters.temperatureC}°C (Target: {selectedEbr.processParameters.targetTempC}°C)
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Kecepatan Mixing RPM:</span>
                <span className="text-cyan-300 font-bold">
                  {selectedEbr.processParameters.mixingRpm} RPM (Target: {selectedEbr.processParameters.targetRpm} RPM)
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Derajat pH In-Process Bulk:</span>
                <span className="text-emerald-300 font-bold">
                  {selectedEbr.processParameters.currentPh} pH (Spec: {selectedEbr.processParameters.targetPhMin} - {selectedEbr.processParameters.targetPhMax})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Viskositas Viscometer:</span>
                <span className="text-purple-300 font-bold">{selectedEbr.processParameters.viscosityCps} cPs</span>
              </div>
            </div>
          </div>

          {/* Verification Personnel & Line Clearance */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>2. Otorisasi Personel & Legal Apoteker</span>
              <UserCheck className="h-4 w-4 text-teal-400" />
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Operator Lead Compounding:</span>
                <span className="text-white font-bold">{selectedEbr.operatorLead}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Apoteker Supervisor QA:</span>
                <span className="text-teal-300 font-bold">{selectedEbr.supervisorSign}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Line Clearance Cleanroom Class D:</span>
                <span className="text-emerald-400 font-bold">✓ Disetujui CPKB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelepasan Batch QA (QA Release):</span>
                <span className="text-emerald-400 font-bold">✓ Released for Filling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail Log */}
        {selectedEbr.auditLogs && selectedEbr.auditLogs.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <History className="h-4 w-4 text-cyan-400" />
              <span>Log Jejak Audit Part 11 (Audit Trail Time-stamped Logs)</span>
            </h4>

            <div className="space-y-2 text-xs font-mono">
              {selectedEbr.auditLogs.map((log, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/50 pb-1">
                  <span className="text-teal-400 font-bold">{log.timestamp}</span>
                  <span className="text-amber-300 font-bold">{log.user}</span>
                  <span className="text-slate-300">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
