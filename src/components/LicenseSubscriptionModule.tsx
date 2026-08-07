import React, { useState } from 'react';
import {
  Award,
  Key,
  ShieldCheck,
  Calendar,
  Zap,
  RefreshCw,
  ArrowUpRight,
  Clock,
  History,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DataTable, Column } from './ui/DataTable';

export const LicenseSubscriptionModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'tenant'>('info');

  const licenseInfo = {
    tenantName: 'PT Beauty Glow Indonesia',
    licenseKey: 'CSM-PRO-2026-9812-BCX9-9921',
    planName: 'Professional Plant Plan (25 Users)',
    status: 'ACTIVE (Trial 14 Hari)',
    issuedDate: '2026-08-01',
    expiredDate: '2026-08-15',
    activeUsers: '8 / 25 Pengguna',
    activeModules: [
      'R&D Cosmetic Formulator Lab',
      'MES Batch Production 500L',
      'FEFO Warehouse Inventory',
      'Quality Control & COA Issuance',
      'e-BPOM NA & CPKB ISO 22716',
      'Finance & COGM Product Costing',
      '16 AI Autonomous Assistants',
    ],
  };

  const licenseHistory = [
    {
      id: 'lh-1',
      date: '2026-08-01 10:00',
      action: 'Aktivasi Trial 14 Hari',
      plan: 'Professional Plant Plan',
      actor: 'Hendra (Super Admin)',
      status: 'Success',
    },
    {
      id: 'lh-2',
      date: '2026-08-01 10:05',
      action: 'Penambahan 2 User APJ Baru',
      plan: 'Professional Plant Plan',
      actor: 'Apt. Maya Indah',
      status: 'Success',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-amber-300 border border-emerald-500/30">
              <Award className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Lisensi Sistem & Manajemen Langganan Tenant
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Kelola kunci lisensi aktif, kuota pengguna, modul terpasang, dan perpanjangan langganan SaaS CosmoManufacture.
          </p>
        </div>

        <button
          onClick={() => alert('Membuka dialog Upgrade Paket Lisensi...')}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50"
        >
          <Zap className="h-4 w-4 text-amber-300" />
          <span>Upgrade Ke Paket Enterprise</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'info'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Informasi Lisensi Aktif
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'history'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Riwayat Perubahan Lisensi
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main License Details */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400">Lisensi SaaS Terverifikasi</span>
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
                ● {licenseInfo.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Entitas Tenant</span>
                <p className="text-base font-extrabold text-white">{licenseInfo.tenantName}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kunci Lisensi Resmi (License Key)</span>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="font-mono text-xs text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-bold tracking-wider">
                    {licenseInfo.licenseKey}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(licenseInfo.licenseKey);
                      alert('Kunci lisensi disalin!');
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal Aktivasi</span>
                  <p className="font-mono font-bold text-slate-200">{licenseInfo.issuedDate}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal Kadaluarsa Trial</span>
                  <p className="font-mono font-bold text-rose-300">{licenseInfo.expiredDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Installed Modules */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Modul ERP Terpasang
            </h3>

            <div className="space-y-2 text-xs">
              {licenseInfo.activeModules.map((m, i) => (
                <div key={i} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <DataTable
          title="Riwayat Log Perubahan Lisensi & Audit Trail"
          subtitle="Aktivitas perpanjangan, penambahan user, dan upgrade fitur"
          data={licenseHistory}
          columns={[
            {
              key: 'date',
              header: 'Waktu Transaksi',
              accessor: (item) => <span className="font-mono text-slate-300">{item.date}</span>,
            },
            {
              key: 'action',
              header: 'Tindakan Lisensi',
              accessor: (item) => <span className="font-bold text-white">{item.action}</span>,
            },
            {
              key: 'plan',
              header: 'Paket Terkait',
              accessor: (item) => <span className="text-emerald-300">{item.plan}</span>,
            },
            {
              key: 'actor',
              header: 'Eksekutor',
              accessor: (item) => <span className="text-amber-300">{item.actor}</span>,
            },
          ]}
        />
      )}
    </div>
  );
};
