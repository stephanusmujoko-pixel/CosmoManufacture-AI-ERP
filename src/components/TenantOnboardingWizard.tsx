import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  MapPin,
  Boxes,
  Users,
  ShieldCheck,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  Check,
  Factory,
} from 'lucide-react';

interface TenantOnboardingWizardProps {
  initialTenantData?: any;
  onCompleteOnboarding: (configuredTenant: any) => void;
}

export const TenantOnboardingWizard: React.FC<TenantOnboardingWizardProps> = ({
  initialTenantData,
  onCompleteOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form Data
  const [companyProfile, setCompanyProfile] = useState({
    name: initialTenantData?.companyName || 'PT Beauty Glow Indonesia',
    brand: initialTenantData?.brandName || 'AuraGlow Skincare',
    bpomPermit: 'CPKB-CLASS-A-2026-88',
    npwp: '01.234.567.8-012.000',
  });

  const [branches, setBranches] = useState([
    { id: 1, name: 'Pabrik & Cleanroom Class A Cibitung', city: 'Bekasi' },
    { id: 2, name: 'Lini Formulasi Liquid Sidoarjo', city: 'Sidoarjo' },
  ]);

  const [warehouses, setWarehouses] = useState([
    { id: 1, name: 'Gudang Bahan Baku Aktif (Suhu Dingin 15-20°C)' },
    { id: 2, name: 'Gudang Packaging Primer & Botol Kaca' },
    { id: 3, name: 'Gudang Karantina QC (Bahan Baru Masuk)' },
  ]);

  const [departments, setDepartments] = useState([
    'R&D Cosmetic Laboratory',
    'MES Batch Manufacturing',
    'Quality Control & Microbiology Lab',
    'Regulatory & e-BPOM Compliance',
    'PPIC & Material Warehouse',
    'Finance & COGM Costing',
  ]);

  const [initialRoles, setInitialRoles] = useState([
    { name: 'Apt. Maya Indah, S.Farm', role: 'Apoteker Penanggung Jawab (APJ) CPKB' },
    { name: 'Dr. Hendra Wijaya', role: 'Senior Cosmetic R&D Chemist' },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteOnboarding({
        ...companyProfile,
        branches,
        warehouses,
        departments,
        roles: initialRoles,
        plan: selectedPlan,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-950 px-4 py-1.5 text-xs font-bold text-amber-300 border border-emerald-500/40">
            <Sparkles className="h-4 w-4" />
            <span>Wizard Onboarding Tenant Baru — Step {currentStep} dari 8</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Konfigurasi Awal Ekosistem Pabrik ERP</h2>
          <p className="text-xs text-slate-400">
            Atur struktur pabrik, cabang cleanroom, departemen, dan role petugas untuk mengaktifkan workspace.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* Step Container Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
          {/* STEP 1: PROFIL PERUSAHAAN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Building2 className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Step 1: Profil Perusahaan Manufaktur</h3>
                  <p className="text-xs text-slate-400">Identitas entitas hukum dan lisensi sertifikasi CPKB BPOM</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Legal Perusahaan (PT/CV)</label>
                  <input
                    type="text"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Brand Skincare Utama</label>
                  <input
                    type="text"
                    value={companyProfile.brand}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nomor Izin Sertifikat CPKB BPOM</label>
                  <input
                    type="text"
                    value={companyProfile.bpomPermit}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, bpomPermit: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-amber-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CABANG & CLEANROOM */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Factory className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Step 2: Cabang Pabrik & Cleanroom Class A/B</h3>
                  <p className="text-xs text-slate-400">Lokasi fasilitas produksi tempat mesin homogenizer dipasang</p>
                </div>
              </div>

              <div className="space-y-3">
                {branches.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                    <span className="font-bold text-slate-200">{b.name} ({b.city})</span>
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/30">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: GUDANG STORAGE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Boxes className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Step 3: Gudang Material & Kemasan FEFO</h3>
                  <p className="text-xs text-slate-400">Penyimpanan terpisah untuk bahan aktif sensitif suhu dan kemasan primer</p>
                </div>
              </div>

              <div className="space-y-2">
                {warehouses.map((w) => (
                  <div key={w.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold">
                    ✔ {w.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DEPARTEMEN */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Users className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Step 4: Departemen & Struktur Organisasi</h3>
                  <p className="text-xs text-slate-400">Pemisahan alur kerja R&D, MES Produksi, QC Micro, dan Regulatory</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {departments.map((dep, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                    • {dep}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: ROLE PETUGAS APJ */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <ShieldCheck className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Step 5: Penetapan Apoteker Penanggung Jawab (APJ)</h3>
                  <p className="text-xs text-slate-400">Petugas berwenang merilis Sertifikat Analisis (COA) dan dokumen CPKB</p>
                </div>
              </div>

              <div className="space-y-3">
                {initialRoles.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
                    <div>
                      <p className="font-bold text-slate-100">{r.name}</p>
                      <p className="text-[10px] text-amber-300">{r.role}</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Verified APJ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: UPLOAD LOGO */}
          {currentStep === 6 && (
            <div className="space-y-4 text-center">
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 space-y-3">
                <Upload className="h-10 w-10 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-slate-200">Drag & Drop Logo Brand Skincare Anda di Sini</p>
                <p className="text-[10px] text-slate-400">Format PNG/SVG dengan background transparan (Maks 2MB)</p>
                <button className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700">
                  Pilih File Logo
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: PILIH PAKET */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-white">Step 7: Konfirmasi Paket Trial SaaS</h3>
                <p className="text-xs text-slate-400">Uji coba gratis 14 hari mencakup seluruh fitur tanpa batasan</p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500 bg-emerald-950/40 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-emerald-300">Paket Professional ERP Plant</span>
                  <span className="rounded bg-emerald-900 px-2 py-0.5 text-[10px] font-bold text-amber-300">14 Hari Free Trial</span>
                </div>
                <p className="text-slate-300 text-[11px]">25 Lisensi Pengguna • R&D Formulasi • MES Batch Control • COA & e-BPOM • 16 AI Agents</p>
              </div>
            </div>
          )}

          {/* STEP 8: AKTIVASI */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center py-4">
              <div className="p-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 w-fit mx-auto">
                <CheckCircle2 className="h-12 w-12 text-amber-300 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Onboarding Tenant Selesai!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Workspace <span className="font-bold text-emerald-400">{companyProfile.name}</span> telah sukses dikonfigurasi dan siap digunakan.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {currentStep > 1 && currentStep < 8 ? (
              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>
            ) : <div />}

            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/40 ml-auto"
            >
              <span>{currentStep === 8 ? 'Masuk ke Live ERP Workspace' : 'Langkah Selanjutnya'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
