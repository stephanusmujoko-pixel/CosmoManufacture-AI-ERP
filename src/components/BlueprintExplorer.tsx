import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  Search,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal,
  ArrowRight,
  Server,
  Key,
} from 'lucide-react';
import { MASTER_BLUEPRINT_DATA, BlueprintSection } from '../data/blueprintData';

export const BlueprintExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    4: true,
    18: true,
  });

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'Semua 20 Seksi' },
    { id: 'architecture', label: 'Arsitektur Clean & Folder' },
    { id: 'database', label: 'PostgreSQL Schema & Entitas' },
    { id: 'security', label: 'Multi-Tenant, License & RBAC' },
    { id: 'modules', label: 'Modul ERP & Dependensi' },
    { id: 'ai', label: 'Integrasi AI 16 Agent' },
    { id: 'roadmap', label: 'Roadmap & Siap Prompt 2' },
  ];

  const filteredSections = MASTER_BLUEPRINT_DATA.filter((sec) => {
    const matchesCat = selectedCategory === 'all' || sec.category === selectedCategory;
    const matchesSearch =
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.details.some((d) => d.points.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Blueprint Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/80 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>PROMPT 1 MASTER BLUEPRINT & SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CosmoManufacture AI ERP Blueprint
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fondasi arsitektur enterprise lengkap untuk pabrik kosmetik, skincare, maklon, OEM/ODM di Indonesia. Mencakup 20 poin rancangan arsitektur clean multi-tier, schema PostgreSQL multi-tenant, 16 Asisten AI Gemini, dan kesiapan transisi UI Prompt 2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-amber-400/30 bg-slate-900/90 p-3 text-center min-w-[110px]">
              <p className="text-2xl font-black text-amber-400">20/20</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Poin Blueprint</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-3 text-center min-w-[110px]">
              <p className="text-2xl font-black text-emerald-400">16 AI</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Agents ERP</p>
            </div>
            <div className="rounded-xl border border-teal-500/30 bg-slate-900/90 p-3 text-center min-w-[110px]">
              <p className="text-2xl font-black text-teal-300">100%</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">BPOM / CPKB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari poin arsitektur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Blueprint Sections List */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const isExpanded = Boolean(expandedSections[section.id]);
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg hover:border-emerald-500/40 transition-all"
            >
              {/* Header */}
              <div
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-amber-300 font-bold text-sm shadow-md ring-1 ring-amber-400/30">
                    {section.id}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      {section.title}
                      <span className="rounded-md bg-emerald-950 px-2 py-0.5 text-[10px] uppercase font-mono text-emerald-400 border border-emerald-500/30">
                        {section.category}
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">{section.summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-5 space-y-4 pt-4 border-t border-slate-800/80 animate-fadeIn">
                  {section.details.map((detail, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {detail.heading}
                      </h4>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                        {detail.points.map((point, pIdx) => (
                          <li
                            key={pIdx}
                            className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 flex items-start gap-2 text-slate-200"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {detail.codeBlock && (
                        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-300 shadow-inner">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Terminal className="h-3 w-3 text-amber-400" />
                              System Specification Output
                            </span>
                            <span>UTF-8 • Clean Architecture</span>
                          </div>
                          <pre className="whitespace-pre">{detail.codeBlock}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
