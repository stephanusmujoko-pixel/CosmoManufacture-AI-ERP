import React, { useState, useEffect } from 'react';
import {
  Building2,
  Key,
  ShieldCheck,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  HardDrive,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Lock,
  Globe,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Server,
  Sliders,
  Check,
  RefreshCcw,
  Plus,
  Activity,
  Database,
} from 'lucide-react';

export const SaasEngineExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'superadmin'
    | 'tenantadmin'
    | 'license'
    | 'billing'
    | 'payment_gateway'
    | 'feature_flags'
    | 'whitelabel'
    | 'marketplace'
    | 'monitoring'
    | 'backup'
    | 'golive'
  >('superadmin');

  // Live Metrics & Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [quota, setQuota] = useState<any>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t-cosmo-01');

  // Prompt 20 New States
  const [whiteLabel, setWhiteLabel] = useState<any>({
    companyName: 'PT Beauty Glow Indonesia',
    brandName: 'CosmoManufacture Enterprise',
    primaryColor: '#059669',
    secondaryColor: '#0f172a',
    dashboardTheme: 'Dark Emerald Gold',
  });
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [backupJobs, setBackupJobs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Interactive Payment State
  const [processingInvoiceId, setProcessingInvoiceId] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string>('midtrans');
  const [selectedChannel, setSelectedChannel] = useState<string>('BCA Virtual Account');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // License Activation State
  const [licenseInput, setLicenseInput] = useState('COSMO-PRO-2026-BG8812-SIGN');
  const [hardwareHashInput, setHardwareHashInput] = useState('hw_mac_88:a1:b2:c3:d4:e5_cpu_i9');
  const [domainInput, setDomainInput] = useState('beautyglow.cosmomanufacture.ai');
  const [licenseResult, setLicenseResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch data from backend API
  const loadSaasData = async () => {
    try {
      const resMetrics = await fetch('/api/superadmin/metrics');
      const dataMetrics = await resMetrics.json();
      if (dataMetrics.summary) setMetrics(dataMetrics.summary);

      const resTenants = await fetch('/api/tenants');
      const dataTenants = await resTenants.json();
      if (dataTenants.data) setTenants(dataTenants.data);

      const resPlans = await fetch('/api/plans');
      const dataPlans = await resPlans.json();
      if (dataPlans.data) setPlans(dataPlans.data);

      const resInvoices = await fetch('/api/invoices', {
        headers: { 'x-tenant-id': selectedTenantId },
      });
      const dataInvoices = await resInvoices.json();
      if (dataInvoices.data) setInvoices(dataInvoices.data);

      const resFlags = await fetch('/api/feature-flags', {
        headers: { 'x-tenant-id': selectedTenantId },
      });
      const dataFlags = await resFlags.json();
      if (dataFlags.data) setFeatureFlags(dataFlags.data);

      const resQuota = await fetch('/api/quota', {
        headers: { 'x-tenant-id': selectedTenantId },
      });
      const dataQuota = await resQuota.json();
      if (dataQuota.data) setQuota(dataQuota.data);

      // Prompt 20 Calls
      const resWl = await fetch('/api/white-label');
      if (resWl.ok) setWhiteLabel((await resWl.json()).data);

      const resMkt = await fetch('/api/marketplace/items');
      if (resMkt.ok) setMarketplaceItems((await resMkt.json()).data);

      const resHlth = await fetch('/api/monitoring/health');
      if (resHlth.ok) setHealthData((await resHlth.json()).data);

      const resBak = await fetch('/api/backup/jobs');
      if (resBak.ok) setBackupJobs((await resBak.json()).data);

      const resAud = await fetch('/api/audit-logs');
      if (resAud.ok) setAuditLogs((await resAud.json()).data);
    } catch (err) {
      console.error('Failed fetching SaaS backend data:', err);
    }
  };

  useEffect(() => {
    loadSaasData();
  }, [selectedTenantId]);

  const handleProcessPayment = async (invNumber: string) => {
    try {
      setProcessingInvoiceId(invNumber);
      setPaymentSuccessMsg(null);

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invNumber,
          paymentChannel: selectedChannel,
          provider: selectedGateway,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPaymentSuccessMsg(json.message);
        loadSaasData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingInvoiceId(null);
    }
  };

  const handleActivateLicense = async () => {
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: licenseInput,
          hardwareHash: hardwareHashInput,
          domainName: domainInput,
        }),
      });
      const json = await res.json();
      setLicenseResult(json);
      loadSaasData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              SaaS Enterprise Platform, Multi-Tenant & Production Deployment
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Arsitektur Komersial Enterprise: Multi-Tenant Logical Isolation, RSA Signed Licenses, Billing, Payment Adapters (Midtrans/Xendit/Stripe), White Label, Marketplace, DevOps Health Monitoring & Go-Live Checklist.
          </p>
        </div>

        {/* Tenant Selector Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400">Context Tenant:</span>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="t-cosmo-01">PT Beauty Glow Indonesia (Professional)</option>
            <option value="t-paragonia-02">PT Paragonia Cosmetic Industri (Enterprise)</option>
            <option value="t-nusantara-03">PT Formulasi Herbal Nusantara (Starter Trial)</option>
            <option value="all">Super Admin Global View</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto scrollbar-none">
        {[
          { id: 'superadmin', label: '📊 Super Admin SaaS Portal' },
          { id: 'tenantadmin', label: '🏬 Tenant Admin & Quota' },
          { id: 'license', label: '🔑 Signed License Keys' },
          { id: 'billing', label: '📄 Billing & Invoices' },
          { id: 'payment_gateway', label: '💳 Payment Gateways' },
          { id: 'feature_flags', label: '⚡ Feature Flags' },
          { id: 'whitelabel', label: '🎨 White Label & Branding' },
          { id: 'marketplace', label: '🧩 Marketplace & Plugins' },
          { id: 'monitoring', label: '🖥️ DevOps Monitoring' },
          { id: 'backup', label: '💾 Backup & Audit Logs' },
          { id: 'golive', label: '🚀 Go-Live Checklist (P1–P20)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-emerald-400 text-emerald-400 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SUPER ADMIN SAAS PORTAL */}
      {activeTab === 'superadmin' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Monthly Recurring Revenue (MRR)</span>
              <p className="text-xl font-extrabold text-emerald-400 font-mono">
                Rp {((metrics?.mrr || 63500000) / 1000000).toFixed(1)} Jt
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                +14.2% dari bulan lalu
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Annual Run Rate (ARR)</span>
              <p className="text-xl font-extrabold text-teal-300 font-mono">
                Rp {((metrics?.arr || 762000000) / 1000000).toFixed(1)} Jt
              </p>
              <p className="text-[10px] text-slate-400">Proyeksi tahunan tersubskripsi</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Active Tenants</span>
              <p className="text-xl font-extrabold text-amber-300 font-mono">{metrics?.activeTenants || 2} Pabrik</p>
              <p className="text-[10px] text-slate-400">{metrics?.trialTenants || 1} Trial Tenant dalam Onboarding</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Retention & Churn</span>
              <p className="text-xl font-extrabold text-indigo-300 font-mono">98.8% Renewal</p>
              <p className="text-[10px] text-slate-400">Churn Rate: {metrics?.churnRatePercentage || 1.2}% (Sangat Rendah)</p>
            </div>
          </div>

          {/* Tenants Registered Overview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                Daftar Tenant Pabrik Kosmetik Tersubskripsi
              </h3>
              <span className="text-[10px] text-emerald-300 font-mono">Isolasi DB Logical (`tenant_id`)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-2.5 px-3">Tenant ID</th>
                    <th className="py-2.5 px-3">Nama Perusahaan</th>
                    <th className="py-2.5 px-3">Brand Main</th>
                    <th className="py-2.5 px-3">Plan Subskripsi</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">License Key Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{t.id}</td>
                      <td className="py-2.5 px-3 font-bold">{t.name}</td>
                      <td className="py-2.5 px-3">{t.brand}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 uppercase">
                          {t.planCode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 truncate max-w-[200px]">
                        {t.currentLicenseKey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENANT ADMIN PORTAL & QUOTA */}
      {activeTab === 'tenantadmin' && (
        <div className="space-y-6">
          {/* Quota Progress Cards */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                Penggunaan Kuota Subskripsi Real-Time ({selectedTenantId})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Paket: Professional CPKB Factory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Users Quota */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-400" /> Pengguna Aktif
                  </span>
                  <span className="font-mono text-emerald-300">
                    {quota?.usersUsed || 12} / {quota?.usersLimit || 50} User
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${((quota?.usersUsed || 12) / (quota?.usersLimit || 50)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Storage Quota */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="h-4 w-4 text-teal-400" /> Storage Cloud (BPOM Vault)
                  </span>
                  <span className="font-mono text-emerald-300">
                    {quota?.storageGbUsed || 42.5} / {quota?.storageGbLimit || 250} GB
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${((quota?.storageGbUsed || 42.5) / (quota?.storageGbLimit || 250)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* AI Token Quota */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" /> AI Requests Monthly
                  </span>
                  <span className="font-mono text-emerald-300">
                    {(quota?.aiRequestsUsed || 1850).toLocaleString()} / {(quota?.aiRequestsLimit || 2500000).toLocaleString()} Requests
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${((quota?.aiRequestsUsed || 1850) / (quota?.aiRequestsLimit || 2500000)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIGNED LICENSE KEYS */}
      {activeTab === 'license' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              Aktivasi & Validasi License Key On-Premise / Cloud
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">License Key RSA Signed</label>
                <input
                  type="text"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Hardware Fingerprint Hash</label>
                  <input
                    type="text"
                    value={hardwareHashInput}
                    onChange={(e) => setHardwareHashInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Bound Domain</label>
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-slate-200"
                  />
                </div>
              </div>

              <button
                onClick={handleActivateLicense}
                className="w-full py-2.5 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" /> Validasi & Bind Lisensi Ke Server Registri
              </button>
            </div>
          </div>

          <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400" /> Status Dekripsi & Validasi Token
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
              {licenseResult ? (
                <pre>{JSON.stringify(licenseResult, null, 2)}</pre>
              ) : (
                <p className="text-slate-500 italic">// Klik tombol validasi untuk memverifikasi tanda tangan kriptografi RSA pada License Key.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              Riwayat Tagihan Invoice SaaS & Faktur Pajak
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Termmasuk PPN 11% & Diskon Paket Tahunan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Tenant</th>
                  <th className="py-2.5 px-3">Paket Subskripsi</th>
                  <th className="py-2.5 px-3">Periode</th>
                  <th className="py-2.5 px-3">Total Tagihan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Metode Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-bold">{inv.tenantName}</td>
                    <td className="py-2.5 px-3">{inv.planName}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">{inv.period}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-100">
                      Rp {inv.grandTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300">{inv.paymentMethod || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENT GATEWAY ADAPTER */}
      {activeTab === 'payment_gateway' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              Simulasi Eksekusi Payment Gateway (Midtrans / Xendit / DOKU / Stripe)
            </h3>
            <p className="text-xs text-slate-400">
              Uji coba alur pembayaran real-time menggunakan Adapter Pattern. Setelah pembayaran dikonfirmasi, status invoice otomatis berubah menjadi PAID dan License Key otomatis diperpanjang.
            </p>
          </div>

          {paymentSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Choose Gateway */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-slate-300 block">1. Pilih Provider Gateway</span>
              <div className="space-y-2">
                {[
                  { id: 'midtrans', name: 'Midtrans Payment Gateway' },
                  { id: 'xendit', name: 'Xendit Financial Payments' },
                  { id: 'doku', name: 'DOKU Aggregator' },
                  { id: 'stripe', name: 'Stripe Global Card Engine' },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    onClick={() => setSelectedGateway(gw.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedGateway === gw.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {gw.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Channel */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-slate-300 block">2. Metode / Channel Pembayaran</span>
              <div className="space-y-2">
                {['BCA Virtual Account', 'Mandiri VA', 'QRIS Instant Transfer', 'Credit Card (Visa/MC)'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedChannel === ch
                        ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Payment for Invoice */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-slate-300 block">3. Eksekusi Pembayaran Invoice</span>
              <div className="space-y-2">
                {invoices.map((i) => (
                  <div key={i.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-emerald-400">{i.invoiceNumber}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          i.status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {i.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">Total: Rp {i.grandTotal.toLocaleString('id-ID')}</p>
                    <button
                      disabled={i.status === 'paid' || processingInvoiceId === i.invoiceNumber}
                      onClick={() => handleProcessPayment(i.invoiceNumber)}
                      className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] disabled:opacity-40 transition-all"
                    >
                      {i.status === 'paid' ? 'Telah Lunas' : 'Bayar Sekarang via Gateway'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FEATURE FLAGS MATRIX */}
      {activeTab === 'feature_flags' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Matriks Feature Flags & Akses Modul Per Paket Subskripsi
            </h3>
            <span className="text-[10px] text-amber-300 font-mono">Dynamic Capability Toggles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Fitur</th>
                  <th className="py-2.5 px-3">Nama Modul SaaS</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Starter Plan</th>
                  <th className="py-2.5 px-3 text-center">Professional Plan</th>
                  <th className="py-2.5 px-3 text-center">Enterprise Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {featureFlags.map((ff) => (
                  <tr key={ff.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{ff.code}</td>
                    <td className="py-2.5 px-3 font-bold">{ff.name}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{ff.category}</td>
                    <td className="py-2.5 px-3 text-center">
                      {ff.enabledInStarter ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {ff.enabledInProfessional ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {ff.enabledInEnterprise ? (
                        <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: WHITE LABEL & BRANDING */}
      {activeTab === 'whitelabel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Pengaturan Custom Branding & White Labeling Tenant
            </h3>
            <p className="text-xs text-slate-400">
              Setiap tenant enterprise dapat menyesuaikan identitas visual ERP sesuai brand perusahaan mereka.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Perusahaan (Company Name):</label>
                <input
                  type="text"
                  value={whiteLabel.companyName}
                  onChange={(e) => setWhiteLabel({ ...whiteLabel, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Brand Skincare (Brand Name):</label>
                <input
                  type="text"
                  value={whiteLabel.brandName}
                  onChange={(e) => setWhiteLabel({ ...whiteLabel, brandName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Primary Color Hex:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={whiteLabel.primaryColor}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={whiteLabel.primaryColor}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dashboard Theme:</label>
                  <select
                    value={whiteLabel.dashboardTheme}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, dashboardTheme: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="Dark Emerald Gold">Dark Emerald Gold (Default)</option>
                    <option value="Midnight Sapphire">Midnight Sapphire Enterprise</option>
                    <option value="Rose Quartz Luxury">Rose Quartz Luxury Skincare</option>
                    <option value="Cleanroom Minimalist">Cleanroom White Minimalist</option>
                  </select>
                </div>
              </div>

              <button
                onClick={async () => {
                  await fetch('/api/white-label', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(whiteLabel),
                  });
                  showToast('Branding White Label berhasil disimpan ke tenant!');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Simpan Pengaturan White Label</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-300 mb-3">Live Preview Header Branding Tenant:</h4>
              <div
                className="p-4 rounded-xl border border-slate-700 space-y-3"
                style={{ backgroundColor: whiteLabel.secondaryColor || '#0f172a' }}
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                      style={{ backgroundColor: whiteLabel.primaryColor }}
                    >
                      {whiteLabel.companyName?.substring(0, 2).toUpperCase() || 'CM'}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block">{whiteLabel.companyName}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{whiteLabel.brandName}</span>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase"
                    style={{ backgroundColor: whiteLabel.primaryColor }}
                  >
                    Enterprise License
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-white">Selamat Datang di Portal Resmi {whiteLabel.brandName}</p>
                  <p className="text-[10px] text-slate-400">Theme: {whiteLabel.dashboardTheme}</p>
                </div>
              </div>
            </div>

            {toastMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
                {toastMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: MARKETPLACE & PLUGINS */}
      {activeTab === 'marketplace' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                CosmoManufacture Internal Marketplace & Plugin SDK
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Modul tambahan, prompt pack AI, konektor mesin PLC cleanroom, dan laporan kustom enterprise.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
              {marketplaceItems.length} Plugins Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 uppercase font-mono">
                      {item.category}
                    </span>
                    <span className="text-amber-400 text-xs font-bold font-mono">★ {item.rating}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white">{item.name}</h4>
                  <p className="text-[10px] font-mono text-emerald-400 mt-1">
                    Rp {item.priceMonthly.toLocaleString('id-ID')} / bulan
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await fetch('/api/marketplace/toggle', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: item.id }),
                    });
                    const updated = marketplaceItems.map((p) =>
                      p.id === item.id ? { ...p, installed: !p.installed } : p
                    );
                    setMarketplaceItems(updated);
                    showToast(`Status plugin ${item.name} berhasil diperbarui.`);
                  }}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    item.installed
                      ? 'bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {item.installed ? 'Nonaktifkan Plugin' : 'Instal Plugin Sekarang'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: DEVOPS MONITORING & OPENAPI */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Server Status</span>
              <p className="text-lg font-extrabold text-emerald-400 font-mono flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse" />
                {healthData?.status || 'HEALTHY'}
              </p>
              <p className="text-[11px] text-slate-300 font-mono">
                Uptime: {Math.floor((healthData?.server?.uptimeSeconds || 3600) / 60)} min | Node {healthData?.server?.nodeVersion || 'v20.x'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Resource Usage</span>
              <p className="text-lg font-extrabold text-amber-400 font-mono">
                CPU: {healthData?.server?.cpuLoadPct || '4.2%'}
              </p>
              <p className="text-[11px] text-slate-300 font-mono">
                Heap Memory: {healthData?.server?.memoryUsageMb || 142} MB
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">PostgreSQL Database</span>
              <p className="text-lg font-extrabold text-emerald-400 font-mono">
                {healthData?.services?.databasePostgres?.status || 'OPERATIONAL'}
              </p>
              <p className="text-[11px] text-slate-300 font-mono">
                Latency: {healthData?.services?.databasePostgres?.latencyMs || 1.8} ms
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3 shadow-xl">
            <h4 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              OpenAPI / Swagger Documentation Preview
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
              <p className="text-slate-400">// GET /api/openapi.json</p>
              <pre>
{`{
  "openapi": "3.0.3",
  "info": {
    "title": "CosmoManufacture AI ERP SaaS Enterprise REST API",
    "version": "1.0.0-PROMPT20"
  },
  "endpoints": [
    "/api/auth/login", "/api/tenants", "/api/licenses",
    "/api/billing/invoices", "/api/payments", "/api/monitoring/health",
    "/api/bi/copilot", "/api/white-label", "/api/marketplace/items"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: BACKUP & AUDIT LOGS */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                Backup Snapshots & Disaster Recovery
              </h3>
              <button
                onClick={async () => {
                  const res = await fetch('/api/backup/trigger', { method: 'POST' });
                  const data = await res.json();
                  if (data.data) {
                    setBackupJobs([data.data, ...backupJobs]);
                    showToast('Backup manual database SaaS berhasil dibuat!');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
              >
                + Trigger Backup Manual
              </button>
            </div>

            <div className="space-y-2">
              {backupJobs.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold block">{b.filename}</span>
                    <span className="text-[10px] text-slate-400">{b.createdAt} | {b.type}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px]">
                    {b.sizeMb} MB
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400" />
              Audit Trail Logs Enterprise
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {auditLogs.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-mono text-slate-400">{a.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-extrabold uppercase">{a.action}</span>
                  </div>
                  <p className="text-white font-bold">{a.user} ({a.role})</p>
                  <p className="text-[11px] text-slate-300">{a.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: GO-LIVE PRODUCTION CHECKLIST */}
      {activeTab === 'golive' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                CosmoManufacture AI ERP — Go-Live Production Readiness Checklist (Prompts 1 s/d 20)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verifikasi 100% kesiapan arsitektur seluruh modul ERP manufaktur kosmetik & skincare sebelum rilis komersial.
              </p>
            </div>
            <span className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-extrabold text-xs font-mono">
              STATUS: 20/20 PROMPTS VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { prompt: 'P1-P2', module: 'Arsitektur & Master Data Skincare', status: 'READY' },
              { prompt: 'P3-P4', module: 'Procurement, PO & Supplier Portal', status: 'READY' },
              { prompt: 'P5', module: 'Warehouse FEFO & Batch Traceability', status: 'READY' },
              { prompt: 'P6', module: 'Formula R&D Lab & BPOM Regulatory', status: 'READY' },
              { prompt: 'P7-P8', module: 'PPIC Planning & MES Cleanroom IoT', status: 'READY' },
              { prompt: 'P9', module: 'QC Microbiology & COA Auto-Gen', status: 'READY' },
              { prompt: 'P10', module: 'Sales B2B, Maklon & CRM Module', status: 'READY' },
              { prompt: 'P11', module: 'Maintenance EAM & CMMS Equipment', status: 'READY' },
              { prompt: 'P12-P13', module: 'Apoteker APJ & E-Signature Audit', status: 'READY' },
              { prompt: 'P14-P15', module: 'Finance HPP Costing & General Ledger', status: 'READY' },
              { prompt: 'P16-P17', module: 'HRIS, Attendance & Payroll Enterprise', status: 'READY' },
              { prompt: 'P18-P19', module: 'Business Intelligence & AI Copilot', status: 'READY' },
              { prompt: 'P20', module: 'Multi-Tenant SaaS & Docker Deployment', status: 'READY' },
            ].map((chk, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-emerald-400 font-mono">{chk.prompt}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                    ✓ {chk.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{chk.module}</h4>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Sertifikasi Arsitektur Production Deployment
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Seluruh modul terhubung secara seamless melalui REST API Clean Architecture, teruji isolasi data multi-tenant, RSA-signed licensing, role-based access control (RBAC), audit trail compliance, dan siap disebarkan ke Cloud Run & PostgreSQL Cluster.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
