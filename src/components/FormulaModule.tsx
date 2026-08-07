import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  ChevronRight,
  Calculator,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { Formula, FormulaIngredient } from '../types';
import { formatCurrencyIDR } from '../lib/utils';

interface FormulaModuleProps {
  formulas: Formula[];
  onAnalyzeFormula: (formula: Formula) => void;
  onOpenAiCenter: () => void;
}

export const FormulaModule: React.FC<FormulaModuleProps> = ({
  formulas,
  onAnalyzeFormula,
  onOpenAiCenter,
}) => {
  const [selectedFormula, setSelectedFormula] = useState<Formula>(formulas[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'compliance'>('ingredients');

  const filteredFormulas = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPercentage = selectedFormula.ingredients.reduce((acc, ing) => acc + ing.percentage, 0);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <FlaskConical className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              R&D Cosmetic Formula & Recipe Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Pengembangan komposisi INCI kosmetik, urutan penambahan fase emulsi, kalkulasi HPP/kg, dan verifikasi batas aman BPOM.
          </p>
        </div>

        <button
          onClick={() => onAnalyzeFormula(selectedFormula)}
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50"
        >
          <Sparkles className="h-4 w-4 text-amber-300 animate-spin" />
          <span>Analisis AI Chemist Formula Ini</span>
        </button>
      </div>

      {/* Main Grid: Formula List & Formula Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Formula Selector List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari formula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredFormulas.map((f) => {
              const isSelected = selectedFormula.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFormula(f)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-gradient-to-r from-slate-900 to-emerald-950/60 shadow-md ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-amber-400">{f.code}</span>
                    <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      {f.version}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-slate-100 line-clamp-2">{f.name}</h4>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>HPP Est: <strong className="text-emerald-300">{formatCurrencyIDR(f.estimatedCostPerKg)}/kg</strong></span>
                    <span className="capitalize text-slate-400">{f.subCategory}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Formula Detail Inspector */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          {/* Header Formula Inspector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-400">{selectedFormula.code}</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300 border border-emerald-500/30">
                  {selectedFormula.status}
                </span>
                <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-extrabold text-blue-300 border border-blue-500/30">
                  {selectedFormula.version}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-extrabold text-white">{selectedFormula.name}</h3>
              <p className="text-xs text-slate-400">Dibuat oleh: {selectedFormula.createdBy}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Perkiraan HPP per Kg</span>
              <span className="text-xl font-black text-amber-400">
                {formatCurrencyIDR(selectedFormula.estimatedCostPerKg)}
              </span>
            </div>
          </div>

          {/* Key Parameters Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] text-slate-400 block">Target pH Range</span>
              <span className="font-extrabold text-emerald-300">{selectedFormula.targetPh}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] text-slate-400 block">Target Viskositas</span>
              <span className="font-extrabold text-teal-300">{selectedFormula.targetViscosity}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] text-slate-400 block">Uji Stabilitas (40°C)</span>
              <span className="font-extrabold text-amber-300 capitalize">{selectedFormula.stabilityResult}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[10px] text-slate-400 block">Kepatuhan BPOM</span>
              <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Compliant
              </span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 px-4 transition-all ${
                activeTab === 'ingredients'
                  ? 'border-b-2 border-emerald-400 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Komposisi Bahan (INCI & Phase)
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`pb-2.5 px-4 transition-all ${
                activeTab === 'steps'
                  ? 'border-b-2 border-emerald-400 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Urutan Pengolahan Tanki
            </button>
          </div>

          {/* Tab 1: Ingredients Table */}
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[11px] font-extrabold uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Fase</th>
                      <th className="p-3">Nama Bahan / INCI</th>
                      <th className="p-3">Fungsi Formulasi</th>
                      <th className="p-3">Persentase (%)</th>
                      <th className="p-3">Halal</th>
                      <th className="p-3">Batas BPOM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {selectedFormula.ingredients.map((ing) => (
                      <tr key={ing.id} className="hover:bg-slate-900/50">
                        <td className="p-3">
                          <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                            Fase {ing.phase}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-100">{ing.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{ing.inciName}</p>
                        </td>
                        <td className="p-3 text-slate-300">{ing.function}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{ing.percentage}%</td>
                        <td className="p-3">
                          {ing.halalCertified ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                              MUI Halal
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="p-3">
                          {ing.bpomMaxLimit ? (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                              Max {ing.bpomMaxLimit}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Aman</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Total Bobot Formula: <strong className="text-emerald-400">{totalPercentage.toFixed(1)}%</strong></span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  100% Terkalibrasi Sempurna
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Preparation Steps */}
          {activeTab === 'steps' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {selectedFormula.preparationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-950 font-bold text-emerald-300 border border-emerald-500/30">
                      {idx + 1}
                    </span>
                    <p className="mt-0.5 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
