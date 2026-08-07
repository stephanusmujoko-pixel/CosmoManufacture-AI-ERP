import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  Building2,
  FileText,
  Mail,
  ShieldCheck,
  Code2,
  HelpCircle,
  Briefcase,
  Users,
  Send,
  BookOpen,
  CheckCircle2,
  Server,
  Lock,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';

interface CompanyWebsitePagesProps {
  page: string;
  onBackToLanding: () => void;
  onGoToRegister: () => void;
}

export const CompanyWebsitePages: React.FC<CompanyWebsitePagesProps> = ({
  page,
  onBackToLanding,
  onGoToRegister,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Website Utama</span>
          </button>

          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-extrabold text-white">CosmoManufacture Company Portal</span>
          </div>

          <button
            onClick={onGoToRegister}
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
          >
            Mulai Free Trial
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* PAGE 1: ABOUT US */}
        {page === 'about' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tentang Perusahaan</span>
              <h1 className="text-3xl font-extrabold text-white">PT CosmoManufacture Technology Indonesia</h1>
              <p className="text-xs text-slate-300">Pelopor Solusi ERP Cerdas Terintegrasi Khusus Industri Skincare, Kosmetik, & Maklon</p>
            </div>

            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 text-slate-300">
              <p>
                Didirikan pada tahun 2024, PT CosmoManufacture Technology Indonesia hadir untuk mentransformasi operasional industri manufaktur kosmetik nasional. Kami menyadari bahwa memproduksi produk skincare berkualitas tinggi membutuhkan presisi tinggi mulai dari formulasi kimia R&D, kontrol parameter mixing homogenizer, hingga kepatuhan terhadap standar e-BPOM dan CPKB ISO 22716.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-400">Visi Kami</h3>
                  <p className="text-slate-300">Menjadi platform SaaS ERP manufaktur kosmetik berbasis AI #1 di Asia Tenggara yang menjamin efisiensi, transparansi, dan kepatuhan regulasi 100%.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-amber-400">Misi Kami</h3>
                  <p className="text-slate-300">Memberdayakan pabrik maklon dan brand skincare lokal dengan otomatisasi cerdas AI, pelacakan stok FEFO presisi, dan kalkulasi HPP produk transparan.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: DOCUMENTATION & API */}
        {page === 'docs' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Pusat Dokumentasi API</span>
              <h1 className="text-3xl font-extrabold text-white">Developer API & Webhooks Reference</h1>
              <p className="text-xs text-slate-300">Integrasi RESTful API & GraphQL untuk menghubungkan CosmoManufacture ERP dengan e-Commerce, SAP, dan Marketplace</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between text-amber-300 font-bold border-b border-slate-800 pb-2">
                  <span>POST /api/v2/tenant/batch-production/sync</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">REST API v2</span>
                </div>
                <p className="text-slate-400 text-[11px]">Mengirimkan data log parameter sensor temperatur dan RPM homogenizer MES secara realtime.</p>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
{`{
  "batchCode": "B-2026-0801",
  "temperature": 75.4,
  "homogenizerRpm": 3200,
  "vacuumBar": -0.85,
  "timestamp": "2026-08-06T14:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: CONTACT */}
        {page === 'contact' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Hubungi Tim Kami</span>
              <h1 className="text-3xl font-extrabold text-white">Konsultasi Sistem ERP Pabrik Kosmetik</h1>
              <p className="text-xs text-slate-300">Tim spesialis CPKB dan konsultan ERP kami siap membantu analisis kebutuhan pabrik Anda</p>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">FAST RESPONSE HOTLINE</span>
                <h3 className="text-lg font-extrabold text-white">Konsultasi Langsung via WhatsApp</h3>
                <p className="text-xs text-slate-300">Hubungi nomor resmi konsultan ERP pabrik kosmetik kami untuk tanggapan cepat 24/7.</p>
              </div>
              <a
                href="https://wa.me/6285187869164?text=Halo%20CosmoManufacture%20ERP,%20saya%20ingin%20konsultasi%20sistem%20ERP%20pabrik%20kosmetik"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 text-sm font-black shadow-lg hover:scale-105 transition-all ring-2 ring-emerald-300/80"
              >
                <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
                <span>Chat WhatsApp: 085187869164</span>
              </a>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-amber-300 mx-auto" />
                <h3 className="text-sm font-bold text-white">Pesan Anda Telah Terkirim!</h3>
                <p className="text-xs text-slate-300">Tim konsultasi CosmoManufacture akan menghubungi WhatsApp 085187869164 / Email Anda dalam 1x24 jam kerja.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nama Lengkap *</label>
                    <input type="text" required placeholder="Bpk. Budi Santoso" className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nama Perusahaan / Pabrik *</label>
                    <input type="text" required placeholder="PT Nusantara Skincare" className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Perusahaan *</label>
                  <input type="email" required placeholder="budi@nusantaraskincare.co.id" className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Pesan / Kebutuhan Operasional *</label>
                  <textarea rows={4} required placeholder="Jelaskan kapasitas produksi pabrik atau jadwal demo yang diinginkan..." className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white" />
                </div>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition-all">
                  Kirim Pesan Konsultasi
                </button>
              </form>
            )}
          </div>
        )}

        {/* PAGE 4: BLOG & BERITA */}
        {page === 'blog' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Artikel & Edukasi Industri</span>
              <h1 className="text-3xl font-extrabold text-white">Wawasan Manufaktur Kosmetik & CPKB</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Panduan Lengkap Penyusunan Dokumen Rekam Batch CPKB ISO 22716', date: '4 Agustus 2026', author: 'Apt. Maya Indah' },
                { title: 'Cara Mengkalkulasi HPP/kg Presisi pada Formulasi Emulsi & Serum', date: '1 Agustus 2026', author: 'Tim R&D CosmoManufacture' },
              ].map((post, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-all cursor-pointer">
                  <span className="text-[10px] font-bold text-amber-300 uppercase">{post.date} • {post.author}</span>
                  <h3 className="text-sm font-bold text-white hover:text-emerald-300">{post.title}</h3>
                  <p className="text-xs text-slate-400">Pelajari best practice operasional laboratorium dan liniproduksi cleanroom modern...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT PRIVACY / TERMS */}
        {(page === 'privacy' || page === 'terms' || page === 'status' || page === 'career' || page === 'partner') && (
          <div className="space-y-4">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-extrabold text-white capitalize">{page.replace('-', ' ')} Page</h1>
              <p className="text-xs text-slate-400">Informasi resmi regulasi dan standar layanan CosmoManufacture AI ERP.</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seluruh data terenkripsi menggunakan standar AES-256 dan disimpan di Cloud Data Center wilayah Indonesia untuk memenuhi regulasi kedaulatan data nasional. Sistem kami mempertahankan uptime SLA 99.9% dengan redundansi server otomatis.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
