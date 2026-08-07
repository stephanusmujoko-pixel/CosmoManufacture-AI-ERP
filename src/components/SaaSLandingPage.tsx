import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Boxes,
  Factory,
  FlaskConical,
  Award,
  Database,
  ArrowRight,
  Bot,
  Play,
  Star,
  ChevronDown,
  Globe,
  Lock,
  Users,
  Check,
  Building2,
  FileText,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock,
  Flame,
  ShieldAlert,
  Calculator,
  Cpu,
  Layers,
  Activity,
  BadgeCheck,
  LogIn,
  UserPlus,
  ArrowUpRight,
  XCircle,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import { formatCurrencyIDR } from '../lib/utils';

interface SaaSLandingPageProps {
  onGoToLogin?: () => void;
  onOpenLogin?: () => void;
  onGoToRegister?: () => void;
  onOpenRegister?: () => void;
  onEnterWorkspace?: () => void;
  onOpenDemoWorkspace?: () => void;
  onOpenCompanyPage?: (page: string) => void;
  onNavigateCompanyPage?: (page: string) => void;
}

export const SaaSLandingPage: React.FC<SaaSLandingPageProps> = ({
  onGoToLogin,
  onOpenLogin,
  onGoToRegister,
  onOpenRegister,
  onEnterWorkspace,
  onOpenDemoWorkspace,
  onOpenCompanyPage,
  onNavigateCompanyPage,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [batchVolumeKg, setBatchVolumeKg] = useState<number>(12000);

  // Helper handlers for props flexibility
  const handleLogin = () => {
    if (onGoToLogin) onGoToLogin();
    else if (onOpenLogin) onOpenLogin();
  };

  const handleRegister = () => {
    if (onGoToRegister) onGoToRegister();
    else if (onOpenRegister) onOpenRegister();
  };

  const handleLaunchApp = () => {
    if (onEnterWorkspace) onEnterWorkspace();
    else if (onOpenDemoWorkspace) onOpenDemoWorkspace();
  };

  const handleCompanyPage = (page: string) => {
    if (onOpenCompanyPage) onOpenCompanyPage(page);
    else if (onNavigateCompanyPage) onNavigateCompanyPage(page);
  };

  // ROI Calculator Calculations
  const monthlySavingsRupiah = Math.round(batchVolumeKg * 4200);
  const hoursSavedPerMonth = Math.round((batchVolumeKg / 1000) * 18);
  const bpomDaysSaved = 14;

  const faqs = [
    {
      q: 'Apakah CosmoManufacture AI ERP sudah 100% memenuhi standar BPOM RI & CPKB ISO 22716?',
      a: 'Sangat Pasti. CosmoManufacture dikembangkan khusus bersama konsultan CPKB dan mantan auditor BPOM RI. Sistem ini menyusun Dokumen Rekam Batch (Batch Production Record), log sanitasi ruang cleanroom, kontrol nomor lot FEFO, hingga file e-BPOM NA secara otomatis dan 100% compliant.',
    },
    {
      q: 'Bagaimana cara AI Assistant mencegah kegagalan batch (OOS) di tangki homogenizer 1000L?',
      a: '16 AI Agents kami menganalisis kestabilan emulsi (fase minyak & air), urutan penambahan bahan aktif, serta kontrol suhu mixing secara real-time. Jika ada deviasi pH atau viskositas, AI langsung memberi peringatan dini sebelum batch rusak.',
    },
    {
      q: 'Berapa lama waktu yang dibutuhkan untuk migrasi dari Excel/sistem manual ke ERP ini?',
      a: 'Sangat cepat. Dengan teknologi Cloud Multi-Tenant SaaS, akun pabrik Anda aktif dalam 3 menit. Tim onboarding kami akan membantu mengimpor master data bahan baku, formula R&D, dan daftar pemasok Anda dalam 1-2 hari kerja.',
    },
    {
      q: 'Apakah rahasia formula kosmetik & hak kekayaan intelektual (IP) pabrik kami terjamin aman?',
      a: 'Keamanan adalah prioritas utama. Setiap tenant terisolasi penuh dengan enkripsi tingkat militer (AES-256 & TLS 1.3). Bahkan staff internal kami tidak memiliki akses ke database formula R&D milik pabrik Anda.',
    },
    {
      q: 'Apakah ada garansi kemudahan penggunaan untuk operator lapangan pabrik?',
      a: 'Ya. Antarmuka CosmoManufacture dirancang khusus untuk kemudahan operator cleanroom dengan dukungan barcode scanner, tablet touch-friendly, serta navigasi bahasa Indonesia yang sangat intuitif.',
    },
  ];

  const coreFeatures = [
    {
      icon: FlaskConical,
      title: 'R&D Cosmetic Formulator & INCI Lab',
      badge: 'Sensasional R&D',
      desc: 'Formulasi resep skincare presisi, penyeimbang otomatis INCI %, prediksi pH & viskositas, serta uji stabilitas terakselerasi 40°C dengan pembuatan COA otomatis.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      highlights: ['Otomatisasi COA', 'Kalkulator INCI Name', 'Simulasi Uji Stabilitas'],
    },
    {
      icon: Factory,
      title: 'MES Batch Production & Cleanroom Control',
      badge: 'Zero Waste Batch',
      desc: 'Monitoring tangki vacuum mixer 500L-2000L real-time, penerbitan Surat Perintah Kerja (SPK) digital, serta pencegahan kerugian bahan baku (yield loss) hingga 99.8%.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      highlights: ['Monitoring Mixing Realtime', 'Digital SPK Batch', 'Kontrol Karantina MES'],
    },
    {
      icon: Boxes,
      title: 'Raw Material FEFO & Gudang Karantina',
      badge: 'Lulus Audit 100%',
      desc: 'Sistem FEFO (First-Expired, First-Out) otomatis, pelacakan nomor lot bahan aktif, manajemen karantina QC, dan barcode label QR otomatis.',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      highlights: ['Gudang Karantina QC', 'Sistem Lot FEFO Presisi', 'Cetak Label Barcode QR'],
    },
    {
      icon: Award,
      title: 'Otomatisasi e-BPOM NA & CPKB Compliance',
      badge: 'Sertifikasi BPOM',
      desc: 'Otomatis menyusun Dokumen Rekam Batch CPKB ISO 22716, ekspor berkas pendaftaran e-BPOM NA, dan audit trail terenkripsi tanpa cela.',
      color: 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30',
      highlights: ['Rekam Batch CPKB ISO 22716', 'Ekspor Dossier e-BPOM NA', 'Full Digital Audit Log'],
    },
    {
      icon: Database,
      title: 'Precision COGM Costing & Maklon Billing',
      badge: 'Profit Maksimal',
      desc: 'Hitung HPP per kg secara presisi (Bahan Baku + Kemasan + Direct Labor + Overhead) dan otomatiskan pembuatan invoice penagihan klien maklon.',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      highlights: ['HPP Presisi / Kg', 'Invoice Maklon Otomatis', 'Analisis Margin Real-Time'],
    },
    {
      icon: Bot,
      title: '16 AI Autonomous ERP Agents',
      badge: 'Bertenaga AI Gemini',
      desc: 'Agen cerdas bertenaga AI Gemini 3.6 Flash untuk rekomendasi klaim kosmetik, analisis bottleneck produksi, serta prediksi kebutuhan bahan baku.',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30',
      highlights: ['16 AI Agents Khusus ERP', 'Deteksi Botleneck Produksi', 'Cek Klaim BPOM AI'],
    },
  ];

  const appBenefits = [
    {
      icon: Clock,
      stat: '85%',
      statLabel: 'Lebih Cepat',
      title: 'Pangkas Siklus R&D Kosmetik',
      desc: 'Dari 3 bulan uji laboratorium manual menjadi 4 hari kerja. AI membantu memprediksi kompatibilitas emulsifier & active ingredients secara akurat.',
    },
    {
      icon: DollarSign,
      stat: 'Rp 45M+',
      statLabel: 'Hemat per Bulan',
      title: 'Cegah Gagal Batch (OOS)',
      desc: 'Deteksi dini perubahan viskositas dan fase pecahan pada tangki mixing sebelum batch rusak total. Hemat puluhan juta rupiah bahan baku mahal.',
    },
    {
      icon: ShieldCheck,
      stat: '100%',
      statLabel: 'Lulus Audit BPOM',
      title: 'Siap Audit CPKB ISO 22716',
      desc: 'Seluruh proses tercatat lengkap dengan timestamp, otorisasi QC, dan nomor lot FEFO. Bebas dari sanksi administratif dan penutupan lini.',
    },
    {
      icon: TrendingUp,
      stat: '3x Lipat',
      statLabel: 'Kapasitas Maklon',
      title: 'Lipatgandakan Penjualan Maklon',
      desc: 'Terima lebih banyak pesanan maklon skincare tanpa pusing mengatur jadwal mesin homogenizer dan estimasi HPP yang sering keliru.',
    },
  ];

  const comparisonData = [
    {
      feature: 'Kecepatan R&D & COA Certificate',
      traditional: '2 - 4 Minggu (Manual Excel & Ketik)',
      cosmo: '⚡ 10 Detik Otomatis Terbit (AI Generated)',
    },
    {
      feature: 'Kepatuhan CPKB & BPOM RI',
      traditional: 'Berisiko Sanksi Audit & Berkas Hilang',
      cosmo: '🛡️ 100% Compliant & Auto Batch Record',
    },
    {
      feature: 'Pencegahan Batch Rusak (OOS)',
      traditional: 'Sering Pecah Emulsi & Rugi Bahan',
      cosmo: '🎯 99.8% Batch Lulus Uji QC Pertama',
    },
    {
      feature: 'Kalkulasi HPP Maklon / Kg',
      traditional: 'Perhitungan Estimasi Kasar & Margin Bocor',
      cosmo: '💎 Presisi Hingga Rupiah Terkecil',
    },
    {
      feature: 'Waktu Implementasi ERP',
      traditional: '6 - 12 Bulan Costly On-Premise',
      cosmo: '🚀 3 Menit Langsung Siap Pakai (Cloud SaaS)',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* High-CTR Urgent Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 py-2.5 px-4 text-slate-950 text-xs font-black tracking-wide shadow-lg border-b border-amber-400/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] text-amber-300 font-bold uppercase animate-pulse">
              <Flame className="h-3 w-3 text-amber-400" /> Flash Promo 2026
            </span>
            <span>
              🔥 DIBUKA HARI INI: Program Akselerasi AI Pabrik Kosmetik — Trial Full Access 14 Hari + Free Consultation BPOM Dossier!
            </span>
          </div>
          <button
            onClick={handleRegister}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-1 text-[11px] font-bold text-emerald-300 hover:bg-slate-900 transition-all border border-emerald-400/40 whitespace-nowrap shadow"
          >
            <span>Klaim Kuota Trial →</span>
          </button>
        </div>
      </div>

      {/* Sticky Luxurious Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 p-0.5 shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight">CosmoManufacture</span>
                <span className="rounded-md bg-gradient-to-r from-amber-400 to-amber-500 px-1.5 py-0.2 text-[9px] font-black text-slate-950 shadow">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                AI ERP SaaS Enterprise
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs font-bold text-slate-300">
            <a href="#hook" className="hover:text-emerald-400 transition-colors">Hook</a>
            <a href="#masalah" className="hover:text-rose-400 transition-colors">Masalah</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors font-bold text-emerald-300">Fitur Utama</a>
            <a href="#benefits" className="hover:text-amber-400 transition-colors font-bold text-amber-300">Manfaat Bisnis</a>
            <a href="#perbandingan" className="hover:text-cyan-400 transition-colors">Perbandingan</a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">Kalkulator ROI</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Harga</a>
            <a href="#cta" className="hover:text-amber-300 transition-colors bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">CTA Trial</a>
          </nav>

          {/* High-CTR Action Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct WhatsApp CTA */}
            <a
              href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20ingin%20konsultasi%20sistem%20ERP%20pabrik%20kosmetik"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs font-black text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 transition-all shadow-md shadow-emerald-950/50"
              title="Hubungi WhatsApp 085187869164"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400 fill-emerald-950" />
              <span className="hidden sm:inline">WA:</span>
              <span>085187869164</span>
            </a>

            {/* Menu Login */}
            <button
              onClick={handleLogin}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm"
              id="menu-login-btn"
            >
              <LogIn className="h-3.5 w-3.5 text-amber-400" />
              <span>Menu Login</span>
            </button>

            {/* Launch App / Register Direct */}
            <button
              onClick={handleLaunchApp}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-950/60 hover:brightness-110 transition-all ring-2 ring-amber-300/60"
              id="launch-app-btn"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Masuk Aplikasi</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HOOK SECTION */}
      <section id="hook" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-5 w-[350px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Section Indicator Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 px-4 py-1.5 text-xs font-black text-emerald-300 shadow-2xl backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>1. HOOK • DAYA TARIK UTAMA</span>
          </div>

          {/* Clickbait Headline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-emerald-500/40 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-md block mx-auto w-fit">
            <Flame className="h-4 w-4 text-amber-400 animate-bounce" />
            <span>⚡ RAHASIA PABRIK MAKLON OMSET 100 MILYAR/BULAN</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
            Stop Buang Miliaran Rupiah Akibat Gagal Batch & Audit BPOM! Otomatiskan 95% Operasional Pabrik Skincare dengan{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent underline decoration-amber-400/40 underline-offset-8">
              Kecerdasan AI Terpadu
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Platform ERP Multi-Tenant SaaS #1 khusus industri manufaktur kosmetik & maklon Indonesia. Integrasikan laboratorium R&D, kontrol batch MES homogenizer, stok FEFO, COA otomatis, hingga pendaftaran e-BPOM NA hanya dalam satu dashboard.
          </p>

          {/* Rating Badge */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300 bg-amber-950/30 border border-amber-500/30 w-fit mx-auto px-4 py-1.5 rounded-full shadow">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
            <span>4.98/5.0 Rating — Dipercaya 142+ CEO & Head of R&D Pabrik Kosmetik Indonesia</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchApp}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-7 py-4 text-sm sm:text-base font-extrabold text-slate-950 shadow-2xl shadow-emerald-950/80 hover:scale-105 transition-all ring-2 ring-amber-300/80"
            >
              <Play className="h-5 w-5 fill-slate-950" />
              <span>MASUK APLIKASI WORKSPACE</span>
            </button>

            <a
              href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20ingin%20konsultasi%20sistem%20ERP%20pabrik%20kosmetik"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-emerald-950/90 px-7 py-4 text-sm sm:text-base font-black text-emerald-300 border-2 border-emerald-500 hover:bg-emerald-900 hover:text-white transition-all shadow-xl"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400 fill-emerald-950" />
              <span>HUBUNGI WHATSAPP (085187869164)</span>
            </a>

            <button
              onClick={handleLogin}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow-xl"
            >
              <LogIn className="h-5 w-5 text-amber-400" />
              <span>LOGIN AKUN</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Sesuai BPOM RI & CPKB ISO 22716</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-400" /> Multi-Tenant Cloud Security (AES-256)</span>
            <span className="flex items-center gap-1.5"><Bot className="h-4 w-4 text-cyan-400" /> 16 AI Autonomous ERP Assistants</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-purple-400" /> Garansi Migrasi Data 48 Jam</span>
          </div>

          {/* Live ERP Interface Showcase */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-900/90 p-3 shadow-2xl shadow-emerald-950/90 backdrop-blur-2xl relative group">
              <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 px-3 py-1 text-[10px] font-black text-slate-950 shadow-lg">
                LIVE DEMO WORKSPACE PREVIEW
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-3">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">app.cosmomanufacture.com • Realtime Active Session</span>
                </div>
                <button
                  onClick={handleLaunchApp}
                  className="rounded bg-emerald-950 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-all flex items-center gap-1"
                >
                  <span>Buka Full Screen</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              {/* Live Preview Metric Cards */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Produksi MES Month-to-Date</span>
                    <Factory className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-white font-mono">18,450 Kg</span>
                    <span className="text-xs font-bold text-emerald-400">+22.4%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Lini Homogenizer & Vacuum Mixer 1000L</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Yield Lulus QC & COA Terbit</span>
                    <Award className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-emerald-300 font-mono">99.8%</span>
                    <span className="text-xs font-bold text-emerald-400">Zero OOS</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Uji Mikro & pH Stabilitas Sempurna</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pendaftaran e-BPOM NA</span>
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-amber-300 font-mono">38 Dossier</span>
                    <span className="text-xs font-bold text-amber-400">Approved</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Otomatisasi Dokumen CPKB ISO 22716</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI & Savings Calculator Section */}
      <section id="calculator" className="py-16 border-y border-slate-800/80 bg-slate-900/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
              <Calculator className="h-4 w-4" />
              <span>Simulasi Hitung Hemat Biaya Pabrik Anda</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Berapa Banyak Uang & Waktu yang Bisa Anda Hemat Setiap Bulan?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Geser slider volume produksi bulanan pabrik Anda di bawah ini untuk melihat potensi penghematan langsung dengan CosmoManufacture AI ERP.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            {/* Slider Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="text-slate-300">Volume Produksi Batch Kosmetik Bulanan:</span>
                <span className="text-2xl font-black font-mono text-emerald-400 bg-emerald-950/80 px-4 py-1 rounded-xl border border-emerald-500/40">
                  {batchVolumeKg.toLocaleString('id-ID')} Kg / bulan
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={50000}
                step={1000}
                value={batchVolumeKg}
                onChange={(e) => setBatchVolumeKg(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>2,000 Kg (Skala R&D / Brand Lab)</span>
                <span>25,000 Kg (Pabrik Skincare Sedang)</span>
                <span>50,000 Kg (Pabrik Maklon Besar)</span>
              </div>
            </div>

            {/* Simulated ROI Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Estimasi Uang Dihemat</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
                  {formatCurrencyIDR(monthlySavingsRupiah)}
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold">/ bulan dari cegah gagal batch & pemborosan</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Jam Kerja Dihemat</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                  {hoursSavedPerMonth} Jam
                </p>
                <p className="text-[11px] text-amber-400 font-semibold">/ bulan efisiensi R&D & admin CPKB</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Kecepatan e-BPOM NA</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
                  10x Cepat
                </p>
                <p className="text-[11px] text-cyan-400 font-semibold">Dokumen Siap Kirim Dalam 5 Detik</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleRegister}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 px-6 py-3 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
              >
                <span>KLIK DISINI UNTUK NIKMATI HEMAT {formatCurrencyIDR(monthlySavingsRupiah)} / BULAN SEKARANG</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MASALAH SECTION (PAIN POINTS PABRIK KOSMETIK & MAKLON) */}
      <section id="masalah" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-800/80 bg-slate-950">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-950/80 border border-rose-500/50 px-4 py-1.5 text-xs font-black text-rose-300 shadow-2xl">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <span>2. MASALAH • PAIN POINTS PABRIK MAKLON & KOSMETIK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            5 Dosa Besar Operasional Manual yang Diam-Diam Membunuh Margin Pabrik Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Mengelola pabrik kosmetik tanpa ERP khusus sama dengan mengendarai pesawat tanpa radar. Berikut 5 mimpi buruk yang dialami 90% manajemen pabrik tradisional:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 space-y-3 hover:border-rose-500/60 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold">01</span>
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">Kerugian Finansial Masif</span>
            </div>
            <h3 className="text-base font-bold text-white">Gagal Batch (OOS) di Tangki 1000L</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Emulsi cream pecah atau viskositas serum tidak stabil saat proses homogenizer. Ratusan juta rupiah bahan aktif mahal melayang dan jadwal maklon berantakan.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 space-y-3 hover:border-rose-500/60 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold">02</span>
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">Risiko Penutupan Lini</span>
            </div>
            <h3 className="text-base font-bold text-white">Audit BPOM & CPKB Menegangkan</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dokumen Rekam Batch Production Record manual tercecer di meja operator, log sanitasi cleanroom lupa diisi, dan data audit trail tidak siap saat auditor datang.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 space-y-3 hover:border-rose-500/60 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold">03</span>
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">Stok Berantakan</span>
            </div>
            <h3 className="text-base font-bold text-white">Gudang FEFO & Bahan Aktif Kadaluarsa</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tidak ada pelacakan nomor lot otomatis. Bahan baku peptide & botanical extract tersembunyi di pojok gudang hingga kedaluwarsa tanpa pernah terpakai.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 space-y-3 hover:border-rose-500/60 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold">04</span>
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">Margin Bocor</span>
            </div>
            <h3 className="text-base font-bold text-white">HPP Maklon Nembak & Meleset</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kalkulasi manual harga per kilogram (COGM) lupa memperhitungkan pemborosan kemasan primer, biaya listrik homogenizer, dan direct labor sehingga profit pabrik tergerus.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 space-y-3 hover:border-rose-500/60 transition-all shadow-xl md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold">05</span>
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">Downtime Mahal</span>
            </div>
            <h3 className="text-base font-bold text-white">Breakdown Mesin Homogenizer & Vacuum Mixer Mendadak</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Perawatan mesin berbasis "kalau rusak baru dibetulkan". Akibatnya mesin mati 3 hari di tengah tenggat waktu pengiriman pesanan maklon ribuan pcs.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FITUR UTAMA & SOLUSI AI ERP */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-t border-slate-800/80">
        <div id="solusi" className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 px-4 py-1.5 text-xs font-black text-emerald-300 shadow-2xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>3. FITUR UTAMA • 6 MODUL UTAMA SOLUSI AI ERP COSMOMANUFACTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Fitur Utama & Solusi AI ERP Terpadu Khusus Manufaktur Skincare & Maklon
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Arsitektur terintegrasi yang dirancang presisi untuk memecahkan tantangan kimia kosmetik, kontrol produksi cleanroom, dan kepatuhan BPOM RI secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreFeatures.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-xl group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.color} border`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kapabilitas Kunci:</span>
                  <ul className="space-y-1">
                    {mod.highlights.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* App Benefits Section (Manfaat Aplikasi) */}
      <section id="benefits" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/90 border border-amber-500/50 px-4 py-1.5 text-xs font-black text-amber-300 shadow-2xl">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>MANFAAT APLIKASI • KEUNTUNGAN BISNIS & ROI PABRIL MAKLON</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Manfaat Nyata Aplikasi: Mengapa CosmoManufacture Memberikan ROI Tercepat Dalam 30 Hari?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Transformasi digital otomatis yang langsung berdampak pada efisiensi biaya operasional dan kepastian hukum izin BPOM pabrik Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 hover:border-amber-400/40 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-emerald-300">{b.stat}</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">{b.statLabel}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PERBANDINGAN SECTION */}
      <section id="perbandingan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-t border-slate-800/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/90 border border-cyan-500/50 px-4 py-1.5 text-xs font-black text-cyan-300 shadow-2xl">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>4. PERBANDINGAN • MATRIKS CARA LAMA VS COSMOMANUFACTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Pabrik Tradisional VS Pabrik Berbasis CosmoManufacture AI ERP
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Lihat jurang perbedaan efisiensi antara metode kerja manual jadul dengan otomatisasi ERP masa depan.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="p-4 font-extrabold text-slate-300">Aspek Operasional Pabrik</th>
                  <th className="p-4 font-extrabold text-rose-400 bg-rose-950/20">Cara Lama / ERP Generik Manual</th>
                  <th className="p-4 font-extrabold text-emerald-300 bg-emerald-950/30">CosmoManufacture AI ERP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{row.feature}</td>
                    <td className="p-4 text-rose-300 font-medium flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="p-4 text-emerald-300 font-bold bg-emerald-950/20">
                      <span>{row.cosmo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION & PRICING SECTION */}
      <section id="cta" className="py-20 border-t border-slate-800/80 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/90 border border-amber-500/50 px-4 py-1.5 text-xs font-black text-amber-300 shadow-2xl">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>5. CALL TO ACTION • PENAWARAN KHUSUS & TRIAL TERBATAS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Investasi Terbaik untuk Pertumbuhan Pabrik Anda</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Tanpa biaya tersembunyi. Termasuk update otomatis regulasi BPOM RI & pendampingan onboarding dari pakar CPKB.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-4 flex items-center justify-center space-x-3 text-xs font-bold">
              <span className={pricingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}>Tagihan Bulanan</span>
              <button
                onClick={() => setPricingCycle(pricingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative h-7 w-14 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-colors focus:outline-none"
              >
                <div
                  className={`h-5 w-5 rounded-full bg-emerald-400 transition-transform ${
                    pricingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={pricingCycle === 'yearly' ? 'text-emerald-300 flex items-center gap-1.5' : 'text-slate-400'}>
                Tagihan Tahunan
                <span className="rounded-full bg-emerald-950 text-[10px] px-2 py-0.5 text-amber-300 border border-emerald-500/40 font-black">
                  HEMAT 20% + FREE ONBOARDING
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Starter Lab Plan */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-slate-400 block">Starter Lab / Brand Owner Baru</span>
                <h3 className="text-xl font-bold text-white">Paket Starter Lab</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold font-mono text-white">
                    {pricingCycle === 'yearly' ? formatCurrencyIDR(2500000) : formatCurrencyIDR(3000000)}
                  </p>
                  <p className="text-[10px] text-slate-400">/ bulan (diisi {pricingCycle === 'yearly' ? 'tahunan' : 'bulanan'})</p>
                </div>
                <p className="text-xs text-slate-300">Solusi tepat untuk laboratorium R&D independen atau pabrik skincare skala awal.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Hingga 5 Pengguna Aktif</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Modul R&D Formulasi & INCI Lab</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Inventaris Lot FEFO Standar</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 2 AI Assistant (Formulator & QC)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Generasi COA Certificate Automated</li>
                </ul>
              </div>
              <button
                onClick={handleRegister}
                className="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 transition-all border border-slate-700"
              >
                Mulai Trial 14 Hari Starter
              </button>
            </div>

            {/* Professional Maklon Plan (Featured Glow) */}
            <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/70 p-6 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1 text-[11px] font-black text-slate-950 shadow-xl border border-amber-300">
                ⭐ PALING POPULER UNTUK PABRIK MAKLON
              </div>
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Pro Manufacturing Plant</span>
                <h3 className="text-xl font-bold text-white">Paket Professional Maklon</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold font-mono text-emerald-300">
                    {pricingCycle === 'yearly' ? formatCurrencyIDR(6500000) : formatCurrencyIDR(7800000)}
                  </p>
                  <p className="text-[10px] text-slate-400">/ bulan (diisi {pricingCycle === 'yearly' ? 'tahunan' : 'bulanan'})</p>
                </div>
                <p className="text-xs text-slate-300">Solusi terlengkap pabrik maklon kosmetik berizin CPKB Class A & B.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Hingga 25 Pengguna Aktif</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Seluruh Modul ERP (MES, R&D, QC, BPOM, COGM)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Akses Lengkap 16 AI Autonomous Agents</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> e-BPOM NA Dossier Export & Audit Trail</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Pendampingan Onboarding CPKB Eksklusif</li>
                </ul>
              </div>
              <button
                onClick={handleRegister}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-3.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg ring-2 ring-amber-300"
              >
                Coba Free Trial Professional Now
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-amber-400 block">Multi-Plant Enterprise Group</span>
                <h3 className="text-xl font-bold text-white">Paket Ultimate Enterprise</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold font-mono text-amber-300">
                    {pricingCycle === 'yearly' ? formatCurrencyIDR(18000000) : formatCurrencyIDR(21000000)}
                  </p>
                  <p className="text-[10px] text-slate-400">/ bulan (SLA 99.99% Guaranteed)</p>
                </div>
                <p className="text-xs text-slate-300">Untuk grup manufaktur besar dengan multi-pabrik & cleanroom berskala internasional.</p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Pengguna Tanpa Batas (Unlimited Users)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Multi-Pabrik & Multi-Cabang Gudang</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Fine-tuned AI Custom Model Khusus Pabrik</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Dedicated Account Manager & Tim IT 24/7</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400" /> Integrasi API SAP / Oracle Legacy System</li>
                </ul>
              </div>
              <a
                href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20tertarik%20dengan%20Paket%20Enterprise%20pabrik%20kosmetik"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-900 py-3 text-xs font-black text-amber-300 border border-amber-500/50 hover:bg-slate-800 transition-all"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400 fill-emerald-950" />
                <span>Hubungi Sales WA: 085187869164</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Paling Sering Ditanyakan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Pertanyaan Umum (FAQ)</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 cursor-pointer hover:border-emerald-500/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between font-bold text-sm text-slate-100">
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-emerald-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Floating High-CTR Sticky Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl rounded-2xl bg-slate-950/95 border border-emerald-500/50 p-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-extrabold text-white">
            Konsultasi Sistem ERP Pabrik Kosmetik?
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20ingin%20konsultasi%20sistem%20ERP%20pabrik%20kosmetik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950/80"
          >
            <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
            <span>WA: 085187869164</span>
          </a>

          <button
            onClick={handleLogin}
            className="flex-1 sm:flex-none rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all"
          >
            Login
          </button>
          
          <button
            onClick={handleLaunchApp}
            className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-2 text-xs font-black text-slate-950 shadow-md hover:brightness-110 transition-all"
          >
            Masuk ERP →
          </button>
        </div>
      </div>

      {/* Floating Widget WhatsApp Button (Bottom Right) */}
      <a
        href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20ingin%20konsultasi%20sistem%20ERP%20pabrik%20kosmetik"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 sm:right-6 z-50 flex items-center space-x-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 shadow-2xl hover:scale-105 transition-all ring-2 ring-emerald-300/80 border border-emerald-400/50"
        title="Chat WhatsApp Direct 085187869164"
      >
        <MessageCircle className="h-6 w-6 fill-white text-emerald-600" />
        <span className="text-xs font-black hidden md:inline">WhatsApp 085187869164</span>
      </a>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400 pb-28 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span className="text-base font-extrabold text-white">CosmoManufacture AI ERP</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Sistem SaaS ERP Cerdas Terpadu untuk Pabrik Manufaktur Skincare, Kosmetik & Maklon di Indonesia. Sesuai Standar CPKB ISO 22716 & BPOM RI.
            </p>
            <div className="pt-1 space-y-1">
              <p className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-emerald-400 fill-emerald-950" />
                <span>WhatsApp Hotline: 085187869164</span>
              </p>
            </div>
            <p className="text-[10px] font-mono text-slate-500">© 2026 PT CosmoManufacture ERP Technology. All rights reserved.</p>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Modul & Fitur</p>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-emerald-400">R&D Formulasi Lab</a></li>
              <li><a href="#features" className="hover:text-emerald-400">MES Batch Control</a></li>
              <li><a href="#features" className="hover:text-emerald-400">Gudang FEFO</a></li>
              <li><a href="#features" className="hover:text-emerald-400">e-BPOM Compliance</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Perusahaan</p>
            <ul className="space-y-2">
              <li><button onClick={() => handleCompanyPage('about')} className="hover:text-emerald-400">Tentang Kami</button></li>
              <li><button onClick={() => handleCompanyPage('blog')} className="hover:text-emerald-400">Blog & Berita</button></li>
              <li><button onClick={() => handleCompanyPage('career')} className="hover:text-emerald-400">Karir</button></li>
              <li><button onClick={() => handleCompanyPage('partner')} className="hover:text-emerald-400">Mitra Maklon</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Menu Akses</p>
            <ul className="space-y-2">
              <li><button onClick={handleLogin} className="hover:text-amber-400 font-bold">🔑 Menu Login</button></li>
              <li><button onClick={handleLaunchApp} className="hover:text-emerald-400 font-bold">🚀 Masuk Aplikasi Workspace</button></li>
              <li><button onClick={handleRegister} className="hover:text-emerald-400">Register Trial 14 Hari</button></li>
              <li><button onClick={() => handleCompanyPage('docs')} className="hover:text-emerald-400">Dokumentasi API</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
