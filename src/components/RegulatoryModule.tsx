import React, { useState } from 'react';
import {
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
  Search,
  Sparkles,
  Printer,
  FileCheck2,
} from 'lucide-react';
import { BpomSubmission, CpkbAuditItem, QualityControlCheck } from '../types';
import { MOCK_BPOM_SUBMISSIONS, MOCK_CPKB_AUDIT, MOCK_QC_CHECKS } from '../data/mockErpData';

export const RegulatoryModule: React.FC = () => {
  const [bpomList, setBpomList] = useState<BpomSubmission[]>(MOCK_BPOM_SUBMISSIONS);
  const [cpkbList, setCpkbList] = useState<CpkbAuditItem[]>(MOCK_CPKB_AUDIT);
  const [activeTab, setActiveTab] = useState<'bpom' | 'cpkb' | 'coa'>('bpom');
  const [selectedBpom, setSelectedBpom] = useState<BpomSubmission>(bpomList[0]);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
              <Award className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Regulatory Compliance, e-BPOM NA & CPKB ISO 22716
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pendaftaran Notifikasi BPOM (NA Number), Manajemen Dokumen Informasi Produk (DIP/PIF), Audit CPKB ISO 22716, & Penerbitan Sertifikat Analisis (COA).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            BPOM Industry Class A Certified
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('bpom')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'bpom'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          e-BPOM NA Registration Portal
        </button>
        <button
          onClick={() => setActiveTab('cpkb')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'cpkb'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Checklist Audit CPKB ISO 22716
        </button>
        <button
          onClick={() => setActiveTab('coa')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'coa'
              ? 'border-b-2 border-amber-400 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Generator COA & MSDS
        </button>
      </div>

      {/* Tab 1: BPOM NA Registration */}
      {activeTab === 'bpom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Daftar Notifikasi BPOM
            </h3>

            <div className="space-y-2">
              {bpomList.map((bpom) => (
                <div
                  key={bpom.id}
                  onClick={() => setSelectedBpom(bpom)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    selectedBpom.id === bpom.id
                      ? 'border-amber-500 bg-gradient-to-r from-slate-900 to-amber-950/60 shadow-lg ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {bpom.registrationNumber}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                        bpom.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}
                    >
                      {bpom.status}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-slate-100">{bpom.productName}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Brand: {bpom.brandName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {selectedBpom.registrationNumber}
                </span>
                <h3 className="text-lg font-extrabold text-white">{selectedBpom.productName}</h3>
                <p className="text-xs text-slate-400">Pemohon: {selectedBpom.applicantCompany}</p>
              </div>

              <span className="rounded-xl bg-emerald-950 px-3 py-1.5 text-xs font-extrabold text-emerald-300 border border-emerald-500/30">
                Berlaku s/d: {selectedBpom.validUntil || '2030-12-18'}
              </span>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kelengkapan Dokumen DIP / PIF (Product Information File)
            </h4>

            <div className="space-y-2">
              {selectedBpom.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200">{doc.title}</span>
                  </div>

                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {doc.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CPKB ISO 22716 Checklist */}
      {activeTab === 'cpkb' && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <h3 className="text-sm font-extrabold text-white">
            Status Kepatuhan Audit CPKB (Cara Pembuatan Kosmetika yang Baik) & ISO 22716
          </h3>

          <div className="space-y-3">
            {cpkbList.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-400">{item.clause}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      item.status === 'compliant'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100">{item.title}</h4>
                <p className="text-slate-300">{item.evidence}</p>

                {item.correctiveAction && (
                  <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/20">
                    Tindakan Perbaikan (CAPA): {item.correctiveAction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: COA & MSDS Generator Preview */}
      {activeTab === 'coa' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl max-w-3xl mx-auto space-y-6 text-slate-200">
          <div className="text-center space-y-1 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-white tracking-wide">
              CERTIFICATE OF ANALYSIS (COA)
            </h2>
            <p className="text-xs font-semibold text-emerald-400">
              PT PARAGONIA COSMETIC INDUSTRI • PABRIKLAKLON KOSMETIK
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Sertifikat Rilis Mutu Resmi Sesuai Standar BPOM & ISO 22716
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Nama Produk</span>
              <span className="font-bold text-amber-300">Luminance Glow Serum 10% Niacinamide</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Nomor Lot / Batch</span>
              <span className="font-bold text-slate-200">LOT-PAR-2026-0801 / B-2026-0801</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Nomor Notifikasi BPOM</span>
              <span className="font-bold text-emerald-400">NA18240199882</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Tanggal Rilis Rilis Lab</span>
              <span className="font-bold text-slate-200">05 Agustus 2026</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3">Parameter Uji</th>
                  <th className="p-3">Spesifikasi Standar</th>
                  <th className="p-3">Hasil Pengujian Lab</th>
                  <th className="p-3">Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr>
                  <td className="p-3">Pemeriksaan Organoleptik</td>
                  <td className="p-3">Cairan jernih kental, bau khas centella</td>
                  <td className="p-3 text-slate-100">Sesuai Standar</td>
                  <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-3">Nilai pH (25°C)</td>
                  <td className="p-3">5.0 - 5.5</td>
                  <td className="p-3 text-emerald-300 font-bold">5.24</td>
                  <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-3">Viskositas cPs (RVT Sp3 20RPM)</td>
                  <td className="p-3">3,500 - 5,000 cPs</td>
                  <td className="p-3 text-emerald-300 font-bold">4,200 cPs</td>
                  <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                </tr>
                <tr>
                  <td className="p-3">Uji ALT Mikrobiologi (CFU/g)</td>
                  <td className="p-3">Maksimal 100 CFU/g</td>
                  <td className="p-3 text-emerald-300 font-bold">&lt; 10 CFU/g (Negatif)</td>
                  <td className="p-3 text-emerald-400 font-bold">PASSED</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Disetujui Oleh Head of QA:</p>
              <p className="font-bold text-slate-200 mt-1">Apt. Maya Indah, S.Farm</p>
              <p className="text-[10px] font-mono text-emerald-400">QA Manager License #2026-QA-88</p>
            </div>

            <button
              onClick={() => alert('Mengunduh Sertifikat Analisis (COA) PDF resmi...')}
              className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Unduh PDF COA</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
