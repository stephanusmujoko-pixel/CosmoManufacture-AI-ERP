import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Smartphone,
  Bell,
  HelpCircle,
  FileText,
  Video,
  MessageSquare,
  Globe,
  KeyRound,
  CheckCircle2,
  Save,
  Laptop,
} from 'lucide-react';

export const UserProfileSettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'help'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Profile States
  const [fullName, setFullName] = useState('Hendra Wijaya');
  const [email, setEmail] = useState('hendra@beautyglow.co.id');
  const [role, setRole] = useState('Super Admin & Chief Operations Officer');
  const [phone, setPhone] = useState('081234567890');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <User className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Profil Pengguna, Keamanan Akun & Pusat Bantuan
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pengaturan kredensial personal, verifikasi Multi-Factor (MFA), perangkat aktif, preferensi notifikasi, dan Help Center.
          </p>
        </div>

        {isSaved && (
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
            Pengaturan Disimpan!
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'profile'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Profil Pengguna & Preferensi
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'security'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Keamanan & Perangkat Sesi
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'help'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Help Center & Video Tutorial
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl max-w-3xl">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Resmi Perusahaan</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Jabatan / Role Operasional</label>
                <input
                  type="text"
                  disabled
                  value={role}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-amber-300 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">No. WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </form>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          {/* Password Change */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              Ganti Kata Sandi (Password)
            </h3>

            <div className="space-y-3 text-xs">
              <input
                type="password"
                placeholder="Kata Sandi Saat Ini"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
              <input
                type="password"
                placeholder="Kata Sandi Baru (min. 8 karakter)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
              <button
                onClick={() => alert('Password berhasil diperbarui!')}
                className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-xs text-white hover:bg-slate-700"
              >
                Perbarui Password
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Laptop className="h-4 w-4 text-emerald-400" />
              Sesi Login Perangkat Aktif
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-100">Chrome / macOS (Sesi Saat Ini)</p>
                  <p className="text-[10px] text-slate-400">Jakarta, Indonesia • IP: 180.252.20.12</p>
                </div>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/30">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Help Center */}
      {activeTab === 'help' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-400" />
              Video Panduan Operasional ERP
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200 hover:text-emerald-300 cursor-pointer">
                ▶ Panduan Input Formula Lab R&D & Kalkulasi Stabilitas 40°C
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200 hover:text-emerald-300 cursor-pointer">
                ▶ Prosedur Rilis COA & Integrasi Penomoran e-BPOM NA
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              Kirim Tiket Support Teknis CPKB
            </h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Subjek Kendala Operasional"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
              <textarea
                rows={3}
                placeholder="Deskripsikan pertanyaan atau masalah teknis..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
              />
              <button
                onClick={() => alert('Tiket support berhasil dikirim ke Helpdesk CPKB!')}
                className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-xs text-white hover:bg-emerald-500"
              >
                Kirim Tiket Bantuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
