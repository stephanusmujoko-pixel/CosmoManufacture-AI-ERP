import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  Key,
  Sun,
  Moon,
  ShieldCheck,
  Bot,
  Globe,
  ChevronDown,
  User,
  Users,
  LogOut,
  KeyRound,
  Check,
  UserCheck,
} from 'lucide-react';
import { Tenant, LicenseInfo, ThemeMode, UserProfilePersona, PRESET_USER_PERSONAS } from '../types';

interface NavbarProps {
  tenant: Tenant;
  license: LicenseInfo;
  theme: ThemeMode;
  currentUser?: UserProfilePersona;
  onToggleTheme: () => void;
  onOpenAiCenter: () => void;
  onOpenBlueprint: () => void;
  onOpenSearch?: () => void;
  onGoToLanding?: () => void;
  onSelectUserPersona?: (persona: UserProfilePersona) => void;
  onOpenAuthPortal?: (mode: 'login' | 'register') => void;
  onOpenUserSettings?: () => void;
  onLogout?: () => void;
  activeViewTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenant,
  license,
  theme,
  currentUser = PRESET_USER_PERSONAS[0],
  onToggleTheme,
  onOpenAiCenter,
  onOpenBlueprint,
  onOpenSearch,
  onGoToLanding,
  onSelectUserPersona,
  onOpenAuthPortal,
  onOpenUserSettings,
  onLogout,
  activeViewTitle,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* User Profile Trigger & Popover Dropdown */}
        <div className="relative pl-1 border-l border-slate-800" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-xl p-1.5 hover:bg-slate-800/80 transition-all group border border-transparent hover:border-slate-700"
            title="Klik untuk Ganti Akun / Profil User"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-black text-slate-950 shadow-inner ring-1 ring-amber-300 group-hover:scale-105 transition-transform">
              {currentUser.initials}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-bold text-slate-100 flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </p>
              <p className="text-[10px] text-emerald-400 font-medium truncate max-w-[150px]">
                {currentUser.role}
              </p>
            </div>
          </button>

          {/* Popover Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-3 ring-1 ring-emerald-500/20 animate-in fade-in zoom-in-95 duration-150">
              {/* Active User Card Header */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 text-sm font-black text-slate-950 ring-2 ring-amber-400/50">
                    {currentUser.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-white truncate text-sm">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/80">
                  <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {currentUser.badge}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Sesi Aktif
                  </span>
                </div>
              </div>

              {/* Quick Persona / Account Switcher List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Pilih / Ganti Akun Pengguna
                  </span>
                  <span className="text-[9px] text-slate-400">1-Click Switch</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {PRESET_USER_PERSONAS.map((persona) => {
                    const isSelected = persona.id === currentUser.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => {
                          if (onSelectUserPersona) onSelectUserPersona(persona);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-slate-800 border border-amber-500/40 text-white shadow-sm'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {persona.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[11px] leading-snug">
                              {persona.name}
                            </p>
                            <p className="text-[9px] text-slate-400 truncate">
                              {persona.role}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <Check className="h-4 w-4 text-amber-400 flex-shrink-0 ml-2" />
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100">
                            Switch
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenUserSettings) onOpenUserSettings();
                  }}
                  className="w-full p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <User className="h-3.5 w-3.5 text-emerald-400" />
                    Pengaturan Profil & Keamanan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">⌘P</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenAuthPortal) onOpenAuthPortal('login');
                  }}
                  className="w-full p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                    Portal Auth & Switch Password Login
                  </span>
                  <span className="text-[10px] text-amber-400/70 font-mono">Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) {
                      onLogout();
                    } else if (onOpenAuthPortal) {
                      onOpenAuthPortal('login');
                    }
                  }}
                  className="w-full p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-xs font-semibold transition-colors justify-center"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

