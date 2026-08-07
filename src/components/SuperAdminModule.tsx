import React, { useState } from 'react';
import {
  ShieldAlert,
  Key,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Server,
  DollarSign,
  Activity,
  Plus,
} from 'lucide-react';
import { Tenant, LicenseInfo } from '../types';
import { INITIAL_TENANT, INITIAL_LICENSE } from '../data/mockErpData';
import { formatCurrencyIDR } from '../lib/utils';

export const SuperAdminModule: React.FC = () => {
  const [tenant, setTenant] = useState<Tenant>(INITIAL_TENANT);
  const [license, setLicense] = useState<LicenseInfo>(INITIAL_LICENSE);
  const [testKey, setTestKey] = useState(INITIAL_LICENSE.key);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateLicense = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const res = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: testKey,
          hardwareHash: license.hardwareHash,
          domain: tenant.subdomain,
        }),
      });

      const data = await res.json();
      setValidationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              SaaS Super Admin & Multi-Tenant License Management
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Portal terpisah pengelolaan Tenant terisolasi, Engine Aktivasi Lisensi SaaS, Binding Hardware/Domain, Grace Period, dan Monitoring API.
          </p>
        </div>

        <span className="rounded-full bg-rose-950 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
          Super Admin Root Access
        </span>
      </div>

      {/* Grid: SaaS Metrics & License Validator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tenant Overview Card */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Tenant Terisolasi Aktif
          </h3>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{tenant.name}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {tenant.tier.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">Subdomain: {tenant.subdomain}</p>
              <p className="text-[11px] text-slate-400">Pengguna: {tenant.currentUsers} / {tenant.maxUsers} License Users</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Detail Lisensi SaaS Terikat
              </span>
              <p className="font-mono text-xs font-bold text-amber-400 break-all">{license.key}</p>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Status: <strong className="text-emerald-400 uppercase">{license.status}</strong></span>
                <span>Expired: <strong className="text-slate-200">{license.expiryDate}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: SaaS License Activation Engine & Validator */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            Engine Validasi & Binding Lisensi Offline / Online
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Sistem Lisensi CosmoManufacture AI ERP mengikat 1 License Key dengan Hash Hardware Pabrik dan Subdomain Tenant untuk mencegah pembajakan dan kebocoran data.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-extrabold text-slate-300 block mb-1">
                Uji Validasi License Key:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testKey}
                  onChange={(e) => setTestKey(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleValidateLicense}
                  disabled={isValidating}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all flex items-center gap-1.5"
                >
                  {isValidating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>Validasi Sekarang</span>
                </button>
              </div>
            </div>

            {validationResult && (
              <div className="rounded-xl bg-slate-950 p-4 border border-emerald-500/40 space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {validationResult.message}
                  </span>
                  <span className="font-mono text-[10px] text-amber-300">{validationResult.tier}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Hardware Bound:</span>
                    <span>{validationResult.hardwareBound ? 'YES (CPU/MAC Hash)' : 'NO'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Domain Bound:</span>
                    <span>{validationResult.domainBound}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
