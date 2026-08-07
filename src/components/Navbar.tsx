import React from 'react';
import {
  Sparkles,
  Building2,
  Key,
  Sun,
  Moon,
  ShieldCheck,
  Bot,
  Globe,
} from 'lucide-react';
import { Tenant, LicenseInfo, ThemeMode } from '../types';

interface NavbarProps {
  tenant: Tenant;
  license: LicenseInfo;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAiCenter: () => void;
  onOpenBlueprint: () => void;
  onOpenSearch?: () => void;
  onGoToLanding?: () => void;
  activeViewTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenant,
  license,
  theme,
  onToggleTheme,
  onOpenAiCenter,
  onOpenBlueprint,
  onOpenSearch,
  onGoToLanding,
  activeViewTitle,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-emerald-950/20 bg-slate-900/90 px-4 backdrop-blur-md dark:border-emerald-500/20 dark:bg-slate-950/90 md:px-6">
      {/* Left: Brand logo and Active Title */}
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center space-x-2.5 ${onGoToLanding ? 'cursor-pointer group' : ''}`}
          onClick={onGoToLanding}
          title={onGoToLanding ? 'Ke Landing Page Website' : undefined}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-2 shadow-lg shadow-emerald-900/30 ring-1 ring-amber-400/40 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              CosmoManufacture <span className="rounded bg-gradient-to-r from-amber-400 to-amber-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-sm">AI ERP</span>
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium tracking-wide">
              Smart Cosmetics & Skincare Manufacturing
            </p>
          </div>
        </div>

        <div className="hidden h-6 w-px bg-slate-800 md:block" />

        {/* Global Search Button Trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center space-x-2 rounded-xl bg-slate-950 px-3 py-1.5 text-xs text-slate-400 border border-slate-800 hover:border-emerald-500/40 hover:text-slate-200 transition-all shadow-inner"
          >
            <span>Cari modul ERP...</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right: Tenant, License Badge, Theme & AI Trigger */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Landing Page Button */}
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="hidden md:flex items-center space-x-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-slate-800 hover:text-amber-200 border border-amber-500/40 transition-all shadow-sm"
            title="Ke Landing Page SaaS Marketing"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span>Landing Page</span>
          </button>
        )}

        {/* Master Blueprint Button */}
        <button
          onClick={onOpenBlueprint}
          className="hidden lg:flex items-center space-x-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-slate-700 hover:text-emerald-200 border border-emerald-500/30 transition-all shadow-sm"
          title="Lihat Arsitektur Master Blueprint Prompt 1"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Master Blueprint</span>
        </button>

        {/* Tenant Indicator */}
        <div className="hidden xl:flex items-center space-x-2 rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-xs border border-slate-800">
          <Building2 className="h-3.5 w-3.5 text-teal-400" />
          <div className="text-left">
            <p className="font-semibold text-slate-200 truncate max-w-[130px]">
              {tenant.name}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-mono">
              {tenant.code} • {tenant.tier}
            </p>
          </div>
        </div>

        {/* License Key Active Status */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-emerald-950/80 px-2.5 py-1 text-xs text-emerald-300 border border-emerald-500/30">
          <Key className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-mono text-[11px] font-bold tracking-wider">
            {license.status.toUpperCase()}
          </span>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAiCenter}
          className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-600 transition-all ring-1 ring-amber-400/50 active:scale-95"
        >
          <Bot className="h-4 w-4 text-amber-300" />
          <span className="hidden xs:inline">AI Center</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Toggle Theme Mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-300" />
          ) : (
            <Moon className="h-4 w-4 text-slate-300" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-slate-950 shadow-inner ring-1 ring-amber-300">
            PA
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-semibold text-slate-200">Apt. Clara, M.Farm</p>
            <p className="text-[10px] text-emerald-400">Head Chemist & QA</p>
          </div>
        </div>
      </div>
    </header>
  );
};
