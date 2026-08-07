import React, { useState, useEffect } from 'react';
import { Search, X, FlaskConical, Factory, Boxes, Award, FileText, ArrowRight } from 'lucide-react';
import { ViewTab } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ViewTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { title: 'SaaS Marketing Website & Pricing Portal', tab: 'landing' as ViewTab, icon: FileText, badge: 'SaaS' },
    { title: 'Executive Realtime Dashboard', tab: 'dashboard' as ViewTab, icon: Factory, badge: 'KPI' },
    { title: 'R&D Cosmetic Formula & Recipe Lab', tab: 'formula' as ViewTab, icon: FlaskConical, badge: 'R&D' },
    { title: 'MES Batch Production & Control', tab: 'production' as ViewTab, icon: Factory, badge: 'MES' },
    { title: 'Raw Materials & FEFO Inventory', tab: 'inventory' as ViewTab, icon: Boxes, badge: 'FEFO' },
    { title: 'e-BPOM NA & CPKB ISO 22716', tab: 'regulatory' as ViewTab, icon: Award, badge: 'BPOM' },
    { title: 'License & SaaS Subscription Management', tab: 'license-sub' as ViewTab, icon: Award, badge: 'License' },
    { title: 'User Profile & Security Settings', tab: 'user-settings' as ViewTab, icon: FileText, badge: 'Security' },
    { title: 'Design System & UI Tokens Framework', tab: 'design-system' as ViewTab, icon: FileText, badge: 'Design' },
    { title: 'Master Data Directory', tab: 'master-data' as ViewTab, icon: Boxes, badge: 'Data' },
  ];

  const filteredNav = quickNav.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Search Bar */}
        <div className="flex items-center p-4 border-b border-slate-800 bg-slate-950">
          <Search className="h-5 w-5 text-emerald-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Ketik modul ERP, batch, formula, atau nomor BPOM... (Esc untuk menutup)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2 custom-scrollbar text-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
            Pintasan Navigasi Modul ERP
          </p>

          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  onClose();
                }}
                className="flex items-center justify-between rounded-xl p-3 bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-1.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 group-hover:border-emerald-500/30">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-slate-200 group-hover:text-white">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    {item.badge}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
