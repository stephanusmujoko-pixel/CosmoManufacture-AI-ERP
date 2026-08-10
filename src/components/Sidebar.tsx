import React from 'react';
import {
  FileCode2,
  LayoutDashboard,
  FlaskConical,
  Award,
  Factory,
  Boxes,
  Microscope,
  Bot,
  ShieldAlert,
  ChevronRight,
  Database,
  Sparkles,
  Building2,
  Layers,
  Lightbulb,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { UserProfilePersona } from '../types';

export type ViewTab =
  | 'landing'
  | 'blueprint'
  | 'dashboard'
  | 'design-system'
  | 'rd'
  | 'formula'
  | 'production'
  | 'inventory'
  | 'quality'
  | 'regulatory'
  | 'master-data'
  | 'crm'
  | 'purchasing'
  | 'wms'
  | 'ppic'
  | 'eam'
  | 'finance'
  | 'hr'
  | 'maintenance'
  | 'backend-auth'
  | 'saas-engine'
  | 'license-sub'
  | 'user-settings'
  | 'ai-center'
  | 'super-admin';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  collapsed?: boolean;
  currentUser?: UserProfilePersona;
}

interface NavItem {
  id: ViewTab;
  label: string;
  category: 'Core Strategy & Design' | 'Development' | 'Manufacturing Operations' | 'ERP Enterprise Modules' | 'Compliance & Intelligence';
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'blueprint',
    label: 'Master Blueprint (Prompt 1)',
    category: 'Development',
    icon: FileCode2,
    badge: '20 Points',
    description: 'Enterprise System Architecture',
  },
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    category: 'Core Strategy & Design',
    icon: LayoutDashboard,
    badge: 'Realtime',
    description: 'KPIs, Yield, Cashflow & AI Summary',
  },
  {
    id: 'design-system',
    label: 'Design System & UI Tokens',
    category: 'Development',
    icon: Sparkles,
    badge: 'Prompt 2',
    description: 'Emerald, Navy, Gold, Glassmorphism',
  },
  {
    id: 'rd',
    label: 'R&D & Product Lifecycle (PLM)',
    category: 'Manufacturing Operations',
    icon: Lightbulb,
    badge: 'Prompt 15',
    description: 'Idea Board, NPD Projects, Lab Trials, Pilot Scale-Up, ECR/ECO & AI R&D',
  },
  {
    id: 'formula',
    label: 'Formula & Multi-Level BOM Enterprise',
    category: 'Manufacturing Operations',
    icon: FlaskConical,
    badge: 'Prompt 11',
    description: 'Versioned Recipes, Multi-Level BOM, Cost Rollup & AI Formula',
  },
  {
    id: 'production',
    label: 'MES & Production Management',
    category: 'Manufacturing Operations',
    icon: Factory,
    badge: 'Prompt 13',
    description: 'MO, WO, Shop Floor Control, EBR, Line Clearance & OEE Monitoring',
  },
  {
    id: 'inventory',
    label: 'Inventory Management Enterprise',
    category: 'Manufacturing Operations',
    icon: Boxes,
    badge: 'Prompt 10',
    description: 'Multi-Warehouse Balance, FEFO Valuation, EOQ & ABC',
  },
  {
    id: 'quality',
    label: 'Quality Control, QA & LIMS',
    category: 'Manufacturing Operations',
    icon: Microscope,
    badge: 'Prompt 14',
    description: 'IQC, IPQC, FGQC, LIMS, Microbiology, Stability, COA, CAPA & CPKB Audit',
  },
  {
    id: 'eam',
    label: 'EAM & CMMS Maintenance',
    category: 'Manufacturing Operations',
    icon: ShieldAlert,
    badge: 'Prompt 16',
    description: 'Asset Register, Work Orders, Calibration, Utilities & Predictive AI',
  },
  {
    id: 'crm',
    label: 'Sales & CRM Maklon',
    category: 'ERP Enterprise Modules',
    icon: LayoutDashboard,
    badge: 'Prompt 7',
    description: 'Maklon Client Pipeline & Sales Orders',
  },
  {
    id: 'purchasing',
    label: 'Purchasing & Procurement',
    category: 'ERP Enterprise Modules',
    icon: Boxes,
    badge: 'Prompt 8',
    description: 'PO Buyer, PR, RFQ, 3-Way Match & Vendor Score',
  },
  {
    id: 'wms',
    label: 'Warehouse Management (WMS)',
    category: 'ERP Enterprise Modules',
    icon: Layers,
    badge: 'Prompt 9',
    description: 'Multi-Level Bin, FEFO Lot, Cold Room & Put-Away',
  },
  {
    id: 'ppic',
    label: 'PPIC & MRP Enterprise',
    category: 'ERP Enterprise Modules',
    icon: Factory,
    badge: 'Prompt 12',
    description: 'Demand Forecast, MPS, MRP Explosion, CRP & AI Optimizer',
  },
  {
    id: 'finance',
    label: 'Finance & COGM Costing',
    category: 'ERP Enterprise Modules',
    icon: Database,
    description: 'HPP/kg, General Ledger & Invoicing',
  },
  {
    id: 'hr',
    label: 'HR & Cleanroom Staff',
    category: 'ERP Enterprise Modules',
    icon: Bot,
    description: 'Cleanroom Class A Attendance & Shift',
  },
  {
    id: 'maintenance',
    label: 'Maintenance & OEE',
    category: 'ERP Enterprise Modules',
    icon: ShieldAlert,
    description: 'Homogenizer Calibration & Service',
  },
  {
    id: 'regulatory',
    label: 'BPOM & CPKB Audit',
    category: 'Compliance & Intelligence',
    icon: Award,
    badge: 'NA BPOM',
    description: 'e-BPOM Submissions, ISO 22716, MSDS',
  },
  {
    id: 'master-data',
    label: 'Master Data Directory',
    category: 'Compliance & Intelligence',
    icon: Database,
    badge: 'Prompt 6',
    description: 'Factories, Suppliers, Materials, Machines',
  },
  {
    id: 'license-sub',
    label: 'License & Subscription',
    category: 'Compliance & Intelligence',
    icon: Award,
    badge: '14d Trial',
    description: 'SaaS License Keys, Modules & Renewals',
  },
  {
    id: 'backend-auth',
    label: 'Backend Auth & Security',
    category: 'Compliance & Intelligence',
    icon: ShieldAlert,
    badge: 'Prompt 4',
    description: 'Clean Architecture, JWT, RBAC & Multi-Tenant',
  },
  {
    id: 'saas-engine',
    label: 'SaaS Platform & Deployment',
    category: 'Compliance & Intelligence',
    icon: Building2,
    badge: 'Prompt 20',
    description: 'Multi-Tenant, Licenses, White Label, Health & Deployment',
  },
  {
    id: 'user-settings',
    label: 'Profile & Security Settings',
    category: 'Compliance & Intelligence',
    icon: ShieldAlert,
    description: 'MFA, Password, Sessions & Help Center',
  },
  {
    id: 'ai-center',
    label: 'AI Center (16 Agents)',
    category: 'Compliance & Intelligence',
    icon: Bot,
    badge: 'Gemini 3.6',
    description: 'CEO, Chemist, Regulatory & MES Assistants',
  },
  {
    id: 'super-admin',
    label: 'Super Admin & SaaS',
    category: 'Compliance & Intelligence',
    icon: ShieldAlert,
    badge: 'SaaS',
    description: 'Tenants, Hardware Binding, License Keys',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, currentUser }) => {
  const categories = [
    'Core Strategy & Design',
    'Development',
    'Manufacturing Operations',
    'ERP Enterprise Modules',
    'Compliance & Intelligence',
  ] as const;

  const allowedSet = currentUser?.allowedTabs ? new Set(currentUser.allowedTabs) : null;
  const totalItemsCount = NAV_ITEMS.length;
  const accessibleItemsCount = allowedSet ? NAV_ITEMS.filter(item => allowedSet.has(item.id)).length : totalItemsCount;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-emerald-950/20 bg-slate-900/95 p-3 dark:border-emerald-500/20 dark:bg-slate-950/95 flex flex-col justify-between h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Active Role Permissions Indicator */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Hak Akses Menu Peran
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {accessibleItemsCount}/{totalItemsCount} Menu
              </span>
            </div>
            <p className="font-bold text-slate-200 text-[11px] truncate">
              {currentUser.role}
            </p>
            <p className="text-[9px] text-slate-400">
              Dibatasi sesuai kewenangan jabatan ({currentUser.department})
            </p>
          </div>
        )}

        {categories.map((cat) => {
          const categoryItems = NAV_ITEMS.filter((item) => {
            if (item.category !== cat) return false;
            if (!allowedSet) return true;
            return allowedSet.has(item.id);
          });

          if (categoryItems.length === 0) {
            return (
              <div key={cat} className="space-y-1 opacity-50">
                <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-600 flex items-center justify-between">
                  <span>{cat}</span>
                  <Lock className="h-3 w-3 text-slate-600" />
                </h3>
                <div className="px-3 py-1 text-[10px] text-slate-500 italic">
                  Menu terkunci untuk peran ini
                </div>
              </div>
            );
          }

          return (
            <div key={cat} className="space-y-1">
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-500/80">
                {cat}
              </h3>
              <div className="space-y-0.5 mt-1">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600/90 to-teal-700/90 text-white shadow-md shadow-emerald-950/50 ring-1 ring-amber-400/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive
                              ? 'bg-emerald-950/60 text-amber-300'
                              : 'bg-slate-800/80 text-emerald-400 group-hover:bg-slate-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="truncate font-semibold tracking-tight">
                            {item.label}
                          </p>
                          <p
                            className={`text-[10px] truncate ${
                              isActive ? 'text-emerald-200' : 'text-slate-400'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`ml-1 flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                            isActive
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Info */}
      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-slate-950/80 p-3 text-xs text-slate-400 shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 mb-1">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            CPKB Certified
          </span>
          <span className="text-[10px] font-mono text-emerald-400">v2.4 Pro</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">
          Multi-tenant isolated • ISO 22716 & BPOM compliant system architecture.
        </p>
      </div>
    </aside>
  );
};
