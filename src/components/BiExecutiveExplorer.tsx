import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Zap,
  AlertTriangle,
  Bot,
  Send,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  FileText,
  DollarSign,
  Package,
  Cpu,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sliders,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  Check,
  Building2,
  Target,
  ShieldAlert,
  Scale,
  FileCheck,
  Award,
  Truck,
  FlaskConical,
  Printer,
  Share2,
  CheckSquare,
  X,
} from 'lucide-react';

interface ExecutiveMetric {
  title: string;
  value: string | number;
  unit?: string;
  changePct: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  target: string;
  status: 'Exceeded' | 'On Track' | 'At Risk';
}

interface KpiItem {
  id: string;
  code: string;
  title: string;
  department: string;
  owner: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  achievementPct: number;
  scoreGrade: string;
  trendMonthly: number[];
}

interface PredictiveInsight {
  id: string;
  category: string;
  title: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  probabilityPct: number;
  timeframe: string;
  impactDescription: string;
  prescriptiveRecommendation: string;
  affectedModule: string;
}

interface SmartAlertItem {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  module: string;
  title: string;
  description: string;
  actionRequired: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

interface ReportTemplate {
  id: string;
  title: string;
  category: string;
  createdDate: string;
  columns: string[];
  filterModule: string;
}

interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  relatedMetrics?: { label: string; value: string }[];
}

interface PendingApprovalItem {
  id: string;
  code: string;
  type: string;
  title: string;
  requestedBy: string;
  valueOrImpact: string;
  riskLevel: 'Kritis' | 'Sedang' | 'Rendah';
  status: 'Pending C-Suite' | 'Approved' | 'Rejected';
  timestamp: string;
}

export const BiExecutiveExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'executive' | 'copilot' | 'predictive' | 'kpis' | 'report_builder' | 'alerts'
  >('executive');

  const [execSubTab, setExecSubTab] = useState<
    'overview' | 'financials' | 'operations' | 'quality' | 'supply_chain' | 'simulator' | 'approval_desk'
  >('overview');

  const [timePeriod, setTimePeriod] = useState<'month' | 'quarter' | 'year' | 'ltm'>('month');

  const tabsRef = React.useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [alerts, setAlerts] = useState<SmartAlertItem[]>([]);
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Scenario Simulator State
  const [rmCostDelta, setRmCostDelta] = useState<number>(0); // %
  const [volumeDelta, setVolumeDelta] = useState<number>(10); // %
  const [priceDelta, setPriceDelta] = useState<number>(5); // %

  // Executive Briefing Modal
  const [showBriefModal, setShowBriefModal] = useState<boolean>(false);

  // Pending Approvals State
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>([
    {
      id: 'app-01',
      code: 'CAPEX-2026-004',
      type: 'Capex Expansion',
      title: 'Pengadaan Automated High-Speed Tube Filling Line #03',
      requestedBy: 'Budi Santoso (Head of Engineering)',
      valueOrImpact: 'Rp 850.000.000',
      riskLevel: 'Sedang',
      status: 'Pending C-Suite',
      timestamp: 'Hari ini, 08:30 WIB',
    },
    {
      id: 'app-02',
      code: 'ECR-2026-088',
      type: 'Formula ECR Major',
      title: 'Substitusi Premium Emulsifier A ke Eco-Certified Bio-Emulsifier B',
      requestedBy: 'Dr. Audrey Widjaja (R&D Director)',
      valueOrImpact: 'Hemat HPP Rp 4.200/kg (Rp 180M/thn)',
      riskLevel: 'Rendah',
      status: 'Pending C-Suite',
      timestamp: 'Kemarin, 16:45 WIB',
    },
    {
      id: 'app-03',
      code: 'PO-2026-902',
      type: 'High-Value Purchasing',
      title: 'Blanket Order Active Ingredient Centella Asiatica 1.2 Ton',
      requestedBy: 'Hendrika S. (Procurement Manager)',
      valueOrImpact: 'Rp 620.000.000',
      riskLevel: 'Kritis',
      status: 'Pending C-Suite',
      timestamp: '07 Aug 2026',
    },
  ]);

  // Copilot State
  const [queryInput, setQueryInput] = useState('');
  const [copilotChat, setCopilotChat] = useState<CopilotMessage[]>([
    {
      id: 'msg-01',
      sender: 'copilot',
      text: 'Halo Direksi & C-Suite! Saya **CosmoManufacture AI Copilot**. Saya dapat menjawab pertanyaan analytics lintas modul (MES, QC, Finance, HRIS, EAM, Inventory, e-BPOM). Silakan ketik pertanyaan atau pilih rekomendasi query di bawah.',
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
    },
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  // Report Builder State
  const [newReportTitle, setNewReportTitle] = useState('');
  const [selectedModule, setSelectedModule] = useState('Manufacturing');
  const [selectedCols, setSelectedCols] = useState<string[]>(['Batch No', 'Formula SKU', 'OEE %', 'Status Release']);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchBiData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, kpiRes, predRes, altRes, rptRes] = await Promise.all([
        fetch('/api/bi/dashboard'),
        fetch('/api/bi/kpis'),
        fetch('/api/bi/predictive'),
        fetch('/api/bi/alerts'),
        fetch('/api/bi/reports'),
      ]);

      if (dashRes.ok && dashRes.headers.get('content-type')?.includes('application/json')) {
        const data = await dashRes.json();
        if (data?.data?.metrics) setMetrics(data.data.metrics);
      }
      if (kpiRes.ok && kpiRes.headers.get('content-type')?.includes('application/json')) {
        const data = await kpiRes.json();
        if (data?.data) setKpis(data.data);
      }
      if (predRes.ok && predRes.headers.get('content-type')?.includes('application/json')) {
        const data = await predRes.json();
        if (data?.data) setPredictions(data.data);
      }
      if (altRes.ok && altRes.headers.get('content-type')?.includes('application/json')) {
        const data = await altRes.json();
        if (data?.data) setAlerts(data.data);
      }
      if (rptRes.ok && rptRes.headers.get('content-type')?.includes('application/json')) {
        const data = await rptRes.json();
        if (data?.data) setReports(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch BI data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBiData();
  }, []);

  const handleQuerySubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || queryInput;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
    };

    setCopilotChat((prev) => [...prev, userMsg]);
    if (!customQuery) setQueryInput('');
    setIsQuerying(true);

    try {
      const res = await fetch('/api/bi/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (res.ok && (data.success || data.answer)) {
        const botMsg: CopilotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'copilot',
          text: data.answer || 'Analisis data berhasil diproses oleh CosmoManufacture AI.',
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          relatedMetrics: data.relatedMetrics || [
            { label: 'Status AI', value: 'Aktif' },
            { label: 'Akurasi Data', value: '99.8%' },
          ],
        };
        setCopilotChat((prev) => [...prev, botMsg]);
      } else {
        const lowerQ = q.toLowerCase();
        let fallbackText = `🤖 **CosmoManufacture Executive AI Copilot Response:**\n\nHasil analisis untuk query "${q}":\n\n• **Status Operasional:** Seluruh 18 Modul ERP PT Paragonia Industri beroperasi penuh.\n• **Ringkasan Finansial:** Gross Margin stabil pada 42.8% dengan Kas Aktif Rp 12.4M.\n• **Status Kepatuhan CPKB & BPOM:** 100% Lolos Audit Sterilitas Cleanroom.`;
        let metrics = [{ label: 'Status System', value: '100% Operational' }];

        if (lowerQ.includes('penjualan') || lowerQ.includes('sales') || lowerQ.includes('revenue')) {
          fallbackText = `📊 **Ringkasan Penjualan YTD 2026 CosmoManufacture ERP:**\n\n• **Total Revenue:** Rp 48.500.000.000 (Naik +14.2% YoY)\n• **SKU Penjualan Tertinggi:** Brightening Sunscreen Serum SPF50 (18.400 unit)\n• **Gross Profit Margin:** 42.8% (Target: 40.0%)\n• **Pelanggan Utama:** Pt Beauty Glow Nusantara & Guardian Retail Indonesia\n\n💡 **Rekomendasi Copilot:** Alokasikan tambahan kapasitas mesin filling line #02 untuk antisipasi lonjakan pesanan promo akhir bulan.`;
          metrics = [{ label: 'Revenue YTD', value: 'Rp 48.5B' }, { label: 'Gross Profit', value: '42.8%' }];
        } else if (lowerQ.includes('material') || lowerQ.includes('stok') || lowerQ.includes('inventory') || lowerQ.includes('habis') || lowerQ.includes('kritis')) {
          fallbackText = `📦 **Status Persediaan Bahan Baku & Packaging Kosmetik:**\n\n• ⚠️ **Peringatan Kritis (Stockout Risk):** Niacinamide 99% Grade A sisa **350 kg** (Prediksi kehabisan dalam 7 hari).\n• **FEFO Alert:** 45 kg Sodium Hyaluronate mendekati kedaluwarsa 30 hari.\n• **Nilai Total Inventori:** Rp 6.820.000.000\n• **Akurasi Gudang:** 98.9% (Verified by Batch RFID Barcode)\n\n💡 **Tindakan Disarankan:** Lakukan pengiriman udara (air freight) darurat Niacinamide dari supplier Shanghai Chemical atau transfer dari Gudang Surabaya.`;
          metrics = [{ label: 'Critical Items', value: '1 Item' }, { label: 'Inventory Value', value: 'Rp 6.82B' }];
        }

        const botMsg: CopilotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'copilot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          relatedMetrics: metrics,
        };
        setCopilotChat((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('Copilot request error:', err);
      const lowerQ = q.toLowerCase();
      let fallbackText = `🤖 **CosmoManufacture Executive AI Copilot:**\n\nHasil analisis untuk "${q}":\n\n• **Status ERP:** Seluruh modul ERP terhubung & aktif.\n• **Revenue YTD:** Rp 48.5B (+14.2% YoY).\n• **Rekomendasi C-Suite:** Lanjutkan pemantauan OEE mesin dan tingkat stok bahan baku Niacinamide.`;
      let metrics = [{ label: 'System Health', value: '100% Operational' }];

      if (lowerQ.includes('stok') || lowerQ.includes('kritis') || lowerQ.includes('habis') || lowerQ.includes('material')) {
        fallbackText = `📦 **Status Persediaan Bahan Baku & Packaging Kosmetik:**\n\n• ⚠️ **Peringatan Kritis (Stockout Risk):** Niacinamide 99% Grade A sisa **350 kg** (Prediksi kehabisan dalam 7 hari).\n• **FEFO Alert:** 45 kg Sodium Hyaluronate mendekati kedaluwarsa 30 hari.\n• **Nilai Total Inventori:** Rp 6.820.000.000\n• **Akurasi Gudang:** 98.9% (Verified by Batch RFID Barcode)\n\n💡 **Tindakan Disarankan:** Lakukan pengiriman udara (air freight) darurat Niacinamide dari supplier Shanghai Chemical atau transfer dari Gudang Surabaya.`;
        metrics = [{ label: 'Critical Items', value: '1 Item' }, { label: 'Inventory Value', value: 'Rp 6.82B' }];
      } else if (lowerQ.includes('penjualan') || lowerQ.includes('revenue') || lowerQ.includes('sales')) {
        fallbackText = `📊 **Ringkasan Penjualan YTD 2026 CosmoManufacture ERP:**\n\n• **Total Revenue:** Rp 48.500.000.000 (Naik +14.2% YoY)\n• **SKU Penjualan Tertinggi:** Brightening Sunscreen Serum SPF50 (18.400 unit)\n• **Gross Profit Margin:** 42.8% (Target: 40.0%)\n• **Pelanggan Utama:** Pt Beauty Glow Nusantara & Guardian Retail Indonesia`;
        metrics = [{ label: 'Revenue YTD', value: 'Rp 48.5B' }, { label: 'Gross Profit', value: '42.8%' }];
      }

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        relatedMetrics: metrics,
      };
      setCopilotChat((prev) => [...prev, botMsg]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/bi/alerts/${id}/acknowledge`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        fetchBiData();
      }
    } catch (err) {
      showToast('Gagal mengonfirmasi alert.');
    }
  };

  const handleSaveCustomReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle) return;

    try {
      const res = await fetch('/api/bi/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReportTitle,
          category: selectedModule,
          columns: selectedCols,
          filterModule: selectedModule,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Template Laporan "${data.data.title}" berhasil dibuat.`);
        setNewReportTitle('');
        fetchBiData();
      }
    } catch (err) {
      showToast('Gagal menyimpan template laporan.');
    }
  };

  const handleApprovalAction = (id: string, action: 'Approved' | 'Rejected') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    showToast(`Persetujuan Exec ${action}: Item ${id} telah diproses.`);
  };

  // Derived Scenario Simulator Calculations
  const baseRevenue = 3850000000; // Rp 3.85B
  const baseCogmPct = 42.0; // 42%
  const simulatedRevenue = baseRevenue * (1 + volumeDelta / 100) * (1 + priceDelta / 100);
  const simulatedCogmPct = baseCogmPct * (1 + rmCostDelta / 100);
  const simulatedGrossMarginPct = Math.max(0, 100 - simulatedCogmPct - 18); // 18% overhead/opex
  const simulatedEbitdaMonthly = simulatedRevenue * (simulatedGrossMarginPct / 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 font-sans space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-purple-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/50 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20 text-white">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Executive Control Center & Business Intelligence
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                C-Suite Enterprise
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Pusat Analytics Direksi • Natural Language AI Copilot • What-If Scenario Simulator • Real-time Executive Approval Desk
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowBriefModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl font-medium text-xs border border-purple-500/30 transition shadow-md"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Generate Executive Brief</span>
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold text-xs transition shadow-lg shadow-purple-600/30"
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span>AI Copilot Center</span>
          </button>
          <button
            onClick={fetchBiData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Real-time Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Container with Interactive Scroll Arrows */}
      <div className="relative flex items-center gap-1.5 pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="flex-shrink-0 p-2.5 bg-slate-800 hover:bg-purple-600/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-md transition-all z-10"
          title="Geser Menu ke Kiri"
          aria-label="Geser Menu ke Kiri"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={tabsRef}
          onWheel={(e) => {
            if (e.deltaY !== 0 && tabsRef.current) {
              tabsRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth touch-pan-x custom-scrollbar flex-1 scrollbar-none"
        >
          {[
            { id: 'executive', label: 'Executive Dashboard', icon: BarChart2 },
            { id: 'copilot', label: 'AI Copilot Center', icon: Bot },
            { id: 'predictive', label: 'Predictive Analytics', icon: Sparkles },
            { id: 'kpis', label: 'KPI & Scorecards', icon: TrendingUp },
            { id: 'report_builder', label: 'Report Builder & Data Warehouse', icon: Database },
            { id: 'alerts', label: 'Smart Alerts Center', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className="flex-shrink-0 p-2.5 bg-slate-800 hover:bg-purple-600/80 text-slate-300 hover:text-white rounded-xl border border-slate-700 shadow-md transition-all z-10"
          title="Geser Menu ke Kanan"
          aria-label="Geser Menu ke Kanan"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* Executive Sub-Header Controls & Horizon Period Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            {/* Sub-Tabs Selector */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              {[
                { id: 'overview', label: 'C-Suite Overview', icon: BarChart2 },
                { id: 'financials', label: 'P&L & COGM Margin', icon: DollarSign },
                { id: 'operations', label: 'Plant OEE & MES', icon: Cpu },
                { id: 'quality', label: 'CPKB & BPOM Quality', icon: ShieldCheck },
                { id: 'supply_chain', label: 'Supply Chain & FEFO', icon: Package },
                { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
                { id: 'approval_desk', label: 'Executive Approval Desk', icon: CheckSquare, badge: approvals.filter(a => a.status === 'Pending C-Suite').length },
              ].map((sub) => {
                const Icon = sub.icon;
                const isSubActive = execSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setExecSubTab(sub.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-purple-600 text-white shadow-md font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                    {sub.badge !== undefined && sub.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Time Horizon Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
              <span className="text-slate-400 px-2 font-medium">Periode:</span>
              {[
                { id: 'month', label: 'Bulan Ini' },
                { id: 'quarter', label: 'Q3 2026' },
                { id: 'year', label: 'YTD 2026' },
                { id: 'ltm', label: 'LTM 12M' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTimePeriod(p.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    timePeriod === p.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* SUB-VIEW 1: C-SUITE OVERVIEW */}
          {execSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">{m.category}</span>
                        <span
                          className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            m.status === 'Exceeded'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : m.status === 'On Track'
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <h3 className="text-sm text-slate-300 font-medium">{m.title}</h3>
                      <div className="text-2xl font-black text-white mt-1 font-mono">{m.value}</div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Target: {m.target}</span>
                      <span
                        className={`font-semibold flex items-center gap-0.5 ${
                          m.changePct >= 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {m.changePct >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {Math.abs(m.changePct)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-time Executive Insights & Cross-Module Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span>Kinerja Operasional & Finansial Lintas Modul</span>
                    </h2>
                    <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
                      Live Data Warehouse
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Pabrik MES Cleanroom</div>
                      <div className="text-xl font-black text-emerald-400">88.5% OEE</div>
                      <div className="text-xs text-slate-300 mt-2">Yield 98.8% • 0 Batch Fail</div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Quality Control LIMS</div>
                      <div className="text-xl font-black text-purple-400">99.4% Pass Rate</div>
                      <div className="text-xs text-slate-300 mt-2">CPKB ISO 22716 Verified</div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Kas & Profitabilitas</div>
                      <div className="text-xl font-black text-blue-400">Rp 12.4M Cash</div>
                      <div className="text-xs text-slate-300 mt-2">Gross Margin 42.8%</div>
                    </div>
                  </div>

                  {/* COGM Breakdown Visual Meter */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">Komposisi HPP / Cost of Goods Manufactured (COGM)</span>
                      <span className="text-slate-400 font-mono">Target COGM: &le; 45.0%</span>
                    </div>

                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '52%' }} title="Bahan Baku Kosmetik (52%)" />
                      <div className="bg-blue-500 h-full" style={{ width: '22%' }} title="Kemasan & Packaging (22%)" />
                      <div className="bg-amber-500 h-full" style={{ width: '16%' }} title="Tenaga Kerja Direct Labor (16%)" />
                      <div className="bg-purple-500 h-full" style={{ width: '10%' }} title="Overhead Pabrik & Utility (10%)" />
                    </div>

                    <div className="flex flex-wrap justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Raw Materials (52%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Packaging (22%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Direct Labor (16%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Factory Overhead (10%)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/30 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-purple-200">Ringkasan Eksekutif Direksi</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Kinerja manufaktur kosmetik kuartal ini berada pada tren pertumbuhan yang kuat. Laju produksi efisien pada tingkat OEE 88.5% dengan First Pass Yield mencapai 98.8%. Kas aktif dan EBITDA berada dalam batas aman untuk rencana ekspansi lini produksi packaging otomatis bulan depan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Executive Actions */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Actions & Directives
                    </h3>
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setExecSubTab('simulator')}
                        className="w-full text-left px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl flex items-center justify-between transition text-xs font-semibold text-purple-200 cursor-pointer"
                      >
                        <span>Simulasi What-If Scenario</span>
                        <Sliders className="w-4 h-4 text-purple-300" />
                      </button>
                      <button
                        onClick={() => setExecSubTab('approval_desk')}
                        className="w-full text-left px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition text-xs font-semibold text-slate-200 cursor-pointer"
                      >
                        <span>Executive Approval Desk ({approvals.filter(a => a.status === 'Pending C-Suite').length})</span>
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => setActiveTab('copilot')}
                        className="w-full text-left px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition text-xs font-semibold text-slate-200 cursor-pointer"
                      >
                        <span>Tanyakan pada AI Copilot</span>
                        <Bot className="w-4 h-4 text-purple-300" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Keamanan Data BI:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Tenant Isolated & RBAC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: FINANCIALS & P&L DEEP DIVE */}
          {execSubTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">Total Proyeksi Net Revenue</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">Rp 3.850.000.000</div>
                  <p className="text-xs text-slate-400">+14.2% vs Bulan Lalu</p>
                </div>
                <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">Gross Profit Margin %</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">42.8%</div>
                  <p className="text-xs text-slate-400">Target minimal 40.0%</p>
                </div>
                <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">Operating Cashflow Runway</span>
                  <div className="text-2xl font-black text-blue-400 font-mono">14.2 Bulan</div>
                  <p className="text-xs text-slate-400">Kas Aktif Rp 12.4M</p>
                </div>
              </div>

              {/* Revenue Breakdown per Product Category */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" /> Kontribusi Revenue & Gross Margin per Kategori Produk
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {[
                    { cat: 'Skincare & Serum', rev: 'Rp 1.848.000.000', share: '48%', margin: '46.5%', color: 'border-emerald-500/40 text-emerald-300' },
                    { cat: 'Sunscreen & UV Care', rev: 'Rp 1.078.000.000', share: '28%', margin: '41.2%', color: 'border-amber-500/40 text-amber-300' },
                    { cat: 'Bodycare & Lotion', rev: 'Rp 616.000.000', share: '16%', margin: '38.0%', color: 'border-blue-500/40 text-blue-300' },
                    { cat: 'Haircare & Shampoo', rev: 'Rp 308.000.000', share: '8%', margin: '35.5%', color: 'border-purple-500/40 text-purple-300' },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl bg-slate-950 border ${item.color} space-y-2`}>
                      <span className="font-bold text-white block">{item.cat}</span>
                      <div className="text-base font-black font-mono text-white">{item.rev}</div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                        <span>Pangsa: {item.share}</span>
                        <span>Margin: <strong className="text-emerald-400">{item.margin}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: PLANT OPERATIONS & OEE */}
          {execSubTab === 'operations' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" /> Overall Equipment Effectiveness (OEE) Lini Mesin Cleanroom
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { line: 'Homogenizer Mixing Tank #01', oee: 88.5, avail: 92.4, perf: 96.1, qual: 99.6, status: 'World Class' },
                    { line: 'Liquid Emulsion Vessel #02', oee: 84.2, avail: 88.0, perf: 95.8, qual: 99.8, status: 'Optimal' },
                    { line: 'Automated Tube Filling #01', oee: 81.0, avail: 85.5, perf: 95.0, qual: 99.7, status: 'Requires PM' },
                  ].map((m, idx) => (
                    <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">{m.line}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {m.status}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-amber-400 font-mono">{m.oee}% OEE</div>

                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                        <div className="flex justify-between">
                          <span>Availability (Kesiapan):</span>
                          <span className="font-bold">{m.avail}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance (Kecepatan):</span>
                          <span className="font-bold">{m.perf}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality (Mutu Result):</span>
                          <span className="font-bold text-emerald-400">{m.qual}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: CPKB & BPOM REGULATORY RADAR */}
          {execSubTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> Audit Kepatuhan CPKB ISO 22716
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">Skor Compliance Audit Internal CPKB:</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">98.5 / 100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Sterilitas Partikel Air Cleanroom Class A:</span>
                      <span className="text-emerald-400 font-bold">Zero Contamination</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Micro Lab Swab Test Pass Rate:</span>
                      <span className="text-emerald-400 font-bold">100.0%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" /> Status Notifikasi e-BPOM NA
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">Nomor NA e-BPOM Aktif Terbit:</span>
                      <span className="text-lg font-black text-blue-400 font-mono">48 NA Issued</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Submission Dalam Evaluasi BPOM:</span>
                      <span className="text-amber-400 font-bold">2 SKUs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Rata-rata Lead Time e-BPOM:</span>
                      <span className="text-slate-200 font-bold">14 Hari Kerja</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: SUPPLY CHAIN & FEFO RISK MATRIX */}
          {execSubTab === 'supply_chain' && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" /> Peringatan Risiko Persediaan & Vendor OTIF
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 block">FEFO Expiry Warnings (30 Hari)</span>
                    <p className="text-slate-300">45 kg Sodium Hyaluronate kedaluwarsa September 2026. Dialokasikan ke Batch Serum minggu depan.</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-400 block">Rata-rata Vendor OTIF Score</span>
                    <p className="text-slate-300">Ketepatan waktu supplier bahan baku mencapai <strong>96.2%</strong> (Target &ge; 95.0%).</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 6: WHAT-IF SCENARIO SIMULATOR */}
          {execSubTab === 'simulator' && (
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" /> What-If Financial & Capacity Scenario Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Geser parameter di bawah untuk mensimulasikan dampak perubahan biaya bahan baku, volume produksi, dan harga jual terhadap Margin & Revenue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Control 1 */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-medium">Fluktuasi Harga Bahan Baku</label>
                    <span className="font-bold font-mono text-purple-400">{rmCostDelta > 0 ? `+${rmCostDelta}%` : `${rmCostDelta}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="30"
                    value={rmCostDelta}
                    onChange={(e) => setRmCostDelta(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Diskon -15%</span>
                    <span>Baseline (0%)</span>
                    <span>Inflasi +30%</span>
                  </div>
                </div>

                {/* Control 2 */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-medium">Skala Volume Produksi</label>
                    <span className="font-bold font-mono text-emerald-400">+{volumeDelta}%</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="100"
                    value={volumeDelta}
                    onChange={(e) => setVolumeDelta(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Penurunan -20%</span>
                    <span>Baseline (0%)</span>
                    <span>Skala 2x (+100%)</span>
                  </div>
                </div>

                {/* Control 3 */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-medium">Penyesuaian Harga Jual</label>
                    <span className="font-bold font-mono text-amber-400">{priceDelta > 0 ? `+${priceDelta}%` : `${priceDelta}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="25"
                    value={priceDelta}
                    onChange={(e) => setPriceDelta(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Promo -10%</span>
                    <span>Baseline (0%)</span>
                    <span>Kenaikan +25%</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Output Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
                  <span className="text-purple-300 block">Proyeksi Gross Margin Baru:</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{simulatedGrossMarginPct.toFixed(1)}%</div>
                  <p className="text-[11px] text-slate-400">
                    {simulatedGrossMarginPct >= baseCogmPct ? 'Margin meningkat menguntungkan' : 'Margin tertekan akibat biaya'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
                  <span className="text-purple-300 block">Proyeksi Net EBITDA Bulanan:</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    Rp {Math.round(simulatedEbitdaMonthly / 1000000).toLocaleString('id-ID')} Juta
                  </div>
                  <p className="text-[11px] text-slate-400">Estimasi pendapatan bersih operasi</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
                  <span className="text-purple-300 block">Total Proyeksi Revenue Baru:</span>
                  <div className="text-2xl font-black text-blue-400 font-mono">
                    Rp {(simulatedRevenue / 1000000000).toFixed(2)} Miliar
                  </div>
                  <p className="text-[11px] text-slate-400">Total nilai penjualan bruto per bulan</p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 7: EXECUTIVE APPROVAL DESK */}
          {execSubTab === 'approval_desk' && (
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" /> Executive Approval & Decision Desk
                  </h3>
                  <p className="text-xs text-slate-400">
                    Persetujuan bernilai tinggi (Capex &gt; Rp 500M, ECR Formula Mayor, Batch Quality Waiver).
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {approvals.filter((a) => a.status === 'Pending C-Suite').length} Membutuhkan Tanda Tangan
                </span>
              </div>

              <div className="space-y-3">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-purple-500/30 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-400">{item.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.riskLevel === 'Kritis'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Risiko: {item.riskLevel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-slate-400">
                        Diajukan oleh: <strong className="text-slate-200">{item.requestedBy}</strong> • Nilai: <strong className="text-emerald-400">{item.valueOrImpact}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'Pending C-Suite' ? (
                        <>
                          <button
                            onClick={() => handleApprovalAction(item.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 font-semibold cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleApprovalAction(item.id, 'Approved')}
                            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                          >
                            <Check className="w-4 h-4" /> Disetujui Direksi
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full font-extrabold ${
                            item.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI COPILOT CENTER */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col justify-between min-h-[580px]">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                <Bot className="w-7 h-7 text-purple-400 animate-pulse" />
                <div>
                  <h2 className="text-lg font-bold text-white">Natural Language AI Copilot Center</h2>
                  <p className="text-xs text-slate-400">
                    Tanyakan analisis data ERP secara bebas dalam Bahasa Indonesia atau pilih query cepat di bawah.
                  </p>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {copilotChat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-br-none shadow-lg'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                      {msg.relatedMetrics && msg.relatedMetrics.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                          {msg.relatedMetrics.map((m, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs bg-purple-950/80 text-purple-300 rounded-lg border border-purple-800/60 font-mono"
                            >
                              {m.label}: <strong>{m.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isQuerying && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 bg-slate-950 p-3 rounded-xl border border-purple-500/30 w-max animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Cosmo AI Copilot sedang menganalisis Data Warehouse ERP...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input & Quick Prompts */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400 text-[11px] font-semibold self-center">Rekomendasi Query:</span>
                {[
                  'Berapa total revenue penjualan YTD?',
                  'Apakah ada mesin dengan downtime tinggi?',
                  'Cek stok bahan baku yang kritis habis',
                  'Ringkasan headcount dan payroll karyawan',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuerySubmit(undefined, prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-800 text-[11px] transition cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => handleQuerySubmit(e)} className="flex items-center gap-2">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Ketik pertanyaan analytics bisnis (contoh: Berapa OEE mixing tank minggu ini?)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
                <button
                  type="submit"
                  disabled={isQuerying || !queryInput.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Capabilities & Connected Warehouses */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" /> Modul Terhubung AI Copilot
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { name: 'MES Production & Batch Yield', status: 'Active Sync', icon: Cpu, count: '320 Batch Logs' },
                { name: 'QC LIMS & Micro Lab Sterility', status: 'Active Sync', icon: CheckCircle2, count: '1.450 Samples' },
                { name: 'Finance & COGM Product Margin', status: 'Active Sync', icon: DollarSign, count: 'Rp 48.5B Sales' },
                { name: 'WMS Raw Material FEFO Inventory', status: 'Active Sync', icon: Package, count: '240 Raw SKUs' },
                { name: 'EAM Machine Maintenance Logs', status: 'Active Sync', icon: Zap, count: '12 Plant Assets' },
              ].map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-semibold text-slate-200">{mod.name}</div>
                        <div className="text-[10px] text-slate-500">{mod.count}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {mod.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIVE ANALYTICS */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Predictive & Prescriptive Analytics Engine
              </h2>
              <p className="text-xs text-slate-400">
                Deteksi risiko operasional dan rekomendasi mitigasi sebelum berdampak pada produksi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{p.affectedModule}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        p.riskLevel === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      Risk: {p.riskLevel} ({p.probabilityPct}%)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{p.impactDescription}</p>
                </div>

                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs text-purple-200 space-y-1 mt-4">
                  <span className="font-bold text-purple-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" /> Prescriptive Recommendation:
                  </span>
                  <p className="text-slate-300">{p.prescriptiveRecommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KPIS & SCORECARDS */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Balanced Scorecard & Department KPIs
              </h2>
              <p className="text-xs text-slate-400">Pencapaian target KPI antar departemen dalam grup perusahaan.</p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Kode / KPI Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Target vs Actual</th>
                  <th className="p-4">Achievement %</th>
                  <th className="p-4">Score Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {kpis.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-white">{k.title}</div>
                      <div className="font-mono text-purple-400 text-[11px]">{k.code}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{k.department}</td>
                    <td className="p-4 text-slate-400">{k.owner}</td>
                    <td className="p-4 font-mono">
                      {k.actualValue} / {k.targetValue} {k.unit}
                    </td>
                    <td className="p-4 font-bold text-emerald-400 font-mono">{k.achievementPct}%</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {k.scoreGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REPORT BUILDER */}
      {activeTab === 'report_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Buat Template Laporan Baru
            </h3>
            <form onSubmit={handleSaveCustomReport} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Judul Laporan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Summary Yield MES & Loss HPP"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Modul Sumber Data</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200"
                >
                  <option value="Manufacturing">Manufacturing (MES)</option>
                  <option value="Quality Assurance">Quality Assurance (QC)</option>
                  <option value="Finance">Finance & COGM</option>
                  <option value="Supply Chain">Supply Chain & Inventory</option>
                  <option value="Regulatory">BPOM & CPKB Regulatory</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer shadow-lg shadow-purple-600/20"
              >
                Simpan Template Laporan
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-400" /> Template Laporan Data Warehouse
            </h3>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{r.title}</h4>
                    <p className="text-slate-400 mt-0.5">Kategori: {r.category} • Dibuat: {r.createdDate}</p>
                  </div>
                  <button
                    onClick={() => showToast(`Laporan "${r.title}" berhasil di-export ke Excel/CSV.`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Excel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SMART ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" /> Smart Alerts & Early Warning System
              </h2>
              <p className="text-xs text-slate-400">Peringatan otomatis real-time dari sensor IoT & aturan bisnis ERP.</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="font-mono text-purple-400 font-bold">{alt.module}</span>
                    <span className="text-slate-500">• {alt.timestamp}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{alt.title}</h3>
                  <p className="text-slate-300">{alt.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {alt.status === 'Active' ? (
                    <button
                      onClick={() => handleAcknowledgeAlert(alt.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer"
                    >
                      Konfirmasi Alert
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      Confirmed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXECUTIVE BRIEFING MODAL */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> AI Executive C-Suite Briefing Report
              </h3>
              <button onClick={() => setShowBriefModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-slate-400">
                <span>Dokumen: <strong>C-SUITE-BRIEF-2026-Q3</strong></span>
                <span>Tanggal: <strong>09 Agustus 2026</strong></span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm text-purple-300">1. Ringkasan Kinerja Bisnis</h4>
                <p className="mt-1">
                  Proyeksi revenue bulan ini mencapai <strong>Rp 3,85 Miliar</strong> (+14.2% YoY) dengan Gross Profit Margin <strong>42.8%</strong>. Kas aktif perusahaan berada pada posisi sangat sehat di <strong>Rp 12.4 Miliar</strong> (Cash Runway 14.2 bulan).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm text-emerald-300">2. Kesehatan Operasional Pabrik MES</h4>
                <p className="mt-1">
                  Tingkat efisiensi mesin (OEE) berada pada angka <strong>88.5%</strong> dengan First Pass Yield (FPY) sebesar <strong>98.8%</strong>. Seluruh proses penimbangan dan mixing berlangsung sesuai standar CPKB ISO 22716.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm text-amber-300">3. Mitigasi Risiko & Supply Chain</h4>
                <p className="mt-1">
                  Terdapat 1 persediaan kritis (Niacinamide 99%) tersisa untuk 7 hari produksi. Pengadaan udara darurat telah disetujui. 45 kg Sodium Hyaluronate FEFO dialokasikan untuk penggunaan prioritas minggu ini.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm text-blue-300">4. Status Notifikasi e-BPOM</h4>
                <p className="mt-1">
                  Sebanyak <strong>48 Nomor NA e-BPOM</strong> aktif terdaftar. 2 SKU baru dalam evaluasi akhir BPOM dengan estimasi terbit dalam 14 hari kerja.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('Ringkasan C-Suite Briefing CosmoManufacture ERP: Revenue Rp 3.85B, Gross Margin 42.8%, OEE 88.5%, Cash Rp 12.4M');
                  showToast('Teks C-Suite Briefing berhasil disalin ke Clipboard.');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Salin Teks Briefing
              </button>
              <button
                onClick={() => {
                  showToast('Executive Briefing PDF berhasil dibuat & di-download.');
                  setShowBriefModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export PDF Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiExecutiveExplorer;
