import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Check,
} from 'lucide-react';

interface AuthPortalProps {
  initialMode?: 'login' | 'register' | 'forgot' | 'otp' | 'mfa';
  onSuccessAuth: (tenantInfo?: any) => void;
  onBackToLanding: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  initialMode = 'login',
  onSuccessAuth,
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp' | 'mfa'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [picName, setPicName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      // Trigger MFA step for enterprise login simulation
      if (email.includes('admin') || email.includes('enterprise')) {
        setMode('mfa');
      } else {
        onSuccessAuth({ companyName: 'CosmoManufacture Tenant' });
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (!companyName || !email || !password) {
      setErrorMsg('Harap isi semua bidang wajib');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setMode('otp'); // Go to OTP verification step
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessAuth({
        companyName,
        brandName,
        picName,
        email,
        whatsapp,
      });
    }, 1000);
  };

  const handleVerifyMfa = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessAuth({ companyName: 'Enterprise Tenant' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-100">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Kembali ke Website Utama</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-xl shadow-emerald-950/80">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
            <Sparkles className="h-6 w-6 text-amber-300" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          {mode === 'login' && 'Masuk ke CosmoManufacture ERP'}
          {mode === 'register' && 'Daftar Perusahaan / Tenant Baru'}
          {mode === 'forgot' && 'Pemulihan Kata Sandi Akun'}
          {mode === 'otp' && 'Verifikasi Kode OTP WhatsApp/Email'}
          {mode === 'mfa' && 'Multi-Factor Authentication (MFA)'}
        </h2>
        <p className="text-xs text-slate-400">
          {mode === 'login' && 'Akses aman portal ERP manufaktur & laboratorium kosmetik'}
          {mode === 'register' && 'Mulai uji coba gratis 14 hari tanpa biaya komitmen'}
          {mode === 'forgot' && 'Masukkan email terdaftar untuk menerima instruksi reset'}
          {mode === 'otp' && `Kode 6-digit dikirimkan ke email/WA ${whatsapp || email}`}
          {mode === 'mfa' && 'Masukkan 6-digit token dari aplikasi Authenticator'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-rose-950/80 p-3 text-xs text-rose-300 border border-rose-500/40 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Preset Developer / Super Admin Banner */}
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Akun Developer & Super Admin
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 font-bold">
                    Full Access
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('stephanusmujoko@gmail.com');
                      setPassword('dev123456');
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-all"
                  >
                    <span className="font-bold text-white block truncate">Stephanus Mujoko</span>
                    <span className="text-[10px] text-emerald-400 font-mono block">Lead Developer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('hendra@beautyglow.co.id');
                      setPassword('admin123');
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-all"
                  >
                    <span className="font-bold text-white block truncate">Hendra Wijaya</span>
                    <span className="text-[10px] text-amber-400 font-mono block">Tenant Owner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email / Username Pekerja</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="nama@perusahaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-10 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300">Ingat perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/40"
              >
                {isLoading ? (
                  <span>Memverifikasi kredensial...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard ERP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
                Belum memiliki akun pabrik?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Daftar Tenant Baru
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Perusahaan / PT / CV *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="PT Beauty Glow Indonesia"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Brand Skincare (Maklon / In-house)</label>
                <input
                  type="text"
                  placeholder="AuraGlow Skincare"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nama PIC Utama *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bpk. Hendra"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">No. WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="08123456789"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Perusahaan *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@beautyglow.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi Akun Super Admin *</label>
                <input
                  type="password"
                  required
                  placeholder="Atur kata sandi kuat (min. 8 karakter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/40"
              >
                {isLoading ? (
                  <span>Menyiapkan pendaftaran...</span>
                ) : (
                  <>
                    <span>Lanjut ke Verifikasi OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Dengan mendaftar, Anda menyetujui Syarat & Ketentuan Layanan CosmoManufacture SaaS.
              </p>

              <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}

          {/* Mode 3: OTP */}
          {mode === 'otp' && (
            <div className="space-y-6 text-center">
              <div className="p-3 rounded-full bg-emerald-950 text-emerald-400 w-fit mx-auto border border-emerald-500/30">
                <Smartphone className="h-8 w-8" />
              </div>

              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otpCode[i]}
                    onChange={(e) => {
                      const newCode = [...otpCode];
                      newCode[i] = e.target.value;
                      setOtpCode(newCode);
                    }}
                    className="h-10 w-10 rounded-xl border border-slate-700 bg-slate-950 text-center font-mono text-sm font-bold text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all ring-1 ring-amber-400/40"
              >
                {isLoading ? 'Memverifikasi OTP...' : 'Verifikasi & Lanjut Onboarding Tenant'}
              </button>
            </div>
          )}

          {/* Mode 4: MFA */}
          {mode === 'mfa' && (
            <div className="space-y-6 text-center">
              <div className="p-3 rounded-full bg-amber-950 text-amber-300 w-fit mx-auto border border-amber-500/30">
                <KeyRound className="h-8 w-8" />
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="000 000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 text-center font-mono text-lg font-bold text-amber-300 tracking-widest focus:border-amber-500 focus:outline-none"
              />

              <button
                onClick={handleVerifyMfa}
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all font-bold"
              >
                {isLoading ? 'Memverifikasi MFA...' : 'Verifikasi Token Multi-Factor'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
