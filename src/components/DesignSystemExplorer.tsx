import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Sliders,
  ShieldCheck,
  Bot,
  Box,
  Copy,
  Check,
} from 'lucide-react';

export const DesignSystemExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'components' | 'elevation'>('colors');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-amber-300 border border-emerald-500/30">
              <Palette className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Enterprise Design System & UI Tokens Framework
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Panduan desain visual resmi CosmoManufacture AI ERP — Palet Emerald/Navy/Gold, Glassmorphism, Typographic Scale, dan Reusable UI Components.
          </p>
        </div>

        <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          Design System v2.4 Active
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('colors')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'colors'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Color Tokens & Palettes
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'typography'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Typography & Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'components'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Component Showcase
        </button>
        <button
          onClick={() => setActiveTab('elevation')}
          className={`pb-3 px-5 transition-all ${
            activeTab === 'elevation'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Borders, Glass & Elevation
        </button>
      </div>

      {/* Tab 1: Color Tokens */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Primary Emerald Colors */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Primary Brand Palette — Emerald (Manufaktur & Keberlanjutan)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              {[
                { name: 'Emerald 400', hex: '#34d399', bg: 'bg-emerald-400 text-slate-950' },
                { name: 'Emerald 500', hex: '#10b981', bg: 'bg-emerald-500 text-slate-950' },
                { name: 'Emerald 600', hex: '#059669', bg: 'bg-emerald-600 text-white' },
                { name: 'Emerald 700', hex: '#047857', bg: 'bg-emerald-700 text-white' },
                { name: 'Emerald 900', hex: '#064e3b', bg: 'bg-emerald-900 text-white' },
                { name: 'Emerald 950', hex: '#022c22', bg: 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => handleCopy(c.hex)}
                  className={`p-4 rounded-xl shadow-md ${c.bg} font-mono cursor-pointer hover:scale-105 transition-transform relative group`}
                >
                  <p className="font-bold text-xs">{c.name}</p>
                  <p className="text-[10px] mt-1 opacity-90">{c.hex}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedToken === c.hex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Gold Colors */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Luxury Accent Palette — Gold / Amber (Kosmetik & Premium CPKB)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              {[
                { name: 'Amber 300', hex: '#fcd34d', bg: 'bg-amber-300 text-slate-950' },
                { name: 'Amber 400', hex: '#fbbf24', bg: 'bg-amber-400 text-slate-950' },
                { name: 'Amber 500', hex: '#f59e0b', bg: 'bg-amber-500 text-slate-950' },
                { name: 'Amber 700', hex: '#b45309', bg: 'bg-amber-700 text-white' },
                { name: 'Amber 900', hex: '#78350f', bg: 'bg-amber-900 text-white' },
                { name: 'Amber 950', hex: '#451a03', bg: 'bg-amber-950 text-amber-300 border border-amber-500/30' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => handleCopy(c.hex)}
                  className={`p-4 rounded-xl shadow-md ${c.bg} font-mono cursor-pointer hover:scale-105 transition-transform relative group`}
                >
                  <p className="font-bold text-xs">{c.name}</p>
                  <p className="text-[10px] mt-1 opacity-90">{c.hex}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedToken === c.hex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark Navy Canvas Colors */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Enterprise Dark Navy Palette — Slate & Dark Navy Canvas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              {[
                { name: 'Slate 800', hex: '#1e293b', bg: 'bg-slate-800 text-slate-100' },
                { name: 'Slate 900', hex: '#0f172a', bg: 'bg-slate-900 text-slate-100' },
                { name: 'Slate 950', hex: '#020617', bg: 'bg-slate-950 text-slate-100 border border-slate-800' },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => handleCopy(c.hex)}
                  className={`p-4 rounded-xl shadow-md ${c.bg} font-mono cursor-pointer hover:scale-105 transition-transform relative group`}
                >
                  <p className="font-bold text-xs">{c.name}</p>
                  <p className="text-[10px] mt-1 opacity-90">{c.hex}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedToken === c.hex ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Typography */}
      {activeTab === 'typography' && (
        <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl text-slate-200">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Display Title (3xl / ExtraBold)</span>
              <h1 className="text-3xl font-extrabold text-white">CosmoManufacture AI ERP Enterprise System</h1>
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Heading 1 (2xl / Extrabold)</span>
              <h2 className="text-2xl font-extrabold text-white">Laporan Produksi Batch MES & Notifikasi BPOM</h2>
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Heading 2 (xl / Bold)</span>
              <h3 className="text-xl font-bold text-slate-100">R&D Formulation Laboratory & Recipe Scaling</h3>
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Monospace Formula / Code Tag</span>
              <p className="font-mono text-xs text-amber-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                FORMULA_CODE: PAR-SRM-2026-08 • CAS: 61789-40-0 • BATCH_ID: B-2026-0801
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 block">Body Text (xs / Regular 1.6 Line Height)</span>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Sistem ekosistem terpadu ini memfasilitasi rekonsiliasi bahan baku berdasarkan kaidah First-Expired, First-Out (FEFO), menjamin kepatuhan CPKB ISO 22716, dan mengkalkulasi HPP/kg secara akurat.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Component Showcase */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          {/* Buttons Showcase */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Button Variants & Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50">
                Primary Emerald Button
              </button>
              <button className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all">
                Secondary Glass Button
              </button>
              <button className="rounded-xl bg-amber-500/20 px-4 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all">
                Gold Accent Button
              </button>
              <button className="rounded-xl bg-rose-950 px-4 py-2.5 text-xs font-bold text-rose-300 border border-rose-500/30 hover:bg-rose-900 transition-all">
                Danger Action Button
              </button>
            </div>
          </div>

          {/* Badges Showcase */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Status Badges & Pill Indicators
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                ● Approved (Lulus Uji)
              </span>
              <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/40 animate-pulse">
                ▲ Dalam Evaluasi BPOM
              </span>
              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/40">
                ⚡ MES Mixing Active
              </span>
              <span className="rounded-full bg-rose-950 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/40">
                ✖ Out of Specification
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Glassmorphism & Elevation */}
      {activeTab === 'elevation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-2">
            <span className="text-xs font-bold text-slate-400">Elevated Card (Level 1)</span>
            <p className="text-xs text-slate-300">
              Standar background komponen dengan border hairline slate-800 dan bayangan lembut.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/80 p-5 shadow-xl space-y-2">
            <span className="text-xs font-bold text-emerald-400">Emerald Glass Accent (Level 2)</span>
            <p className="text-xs text-slate-300">
              Soft gradient dengan aksen hijau emerald untuk highlight fitur operasional aktif.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/80 p-5 shadow-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400">Gold Luxury Glass (Level 3)</span>
            <p className="text-xs text-slate-300">
              Soft gradient dengan aksen emas untuk sertifikasi e-BPOM, CPKB, dan sertifikat mutu COA.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
