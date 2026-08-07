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
  ShieldCheck,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Check,
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

export const BiExecutiveExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'executive' | 'copilot' | 'predictive' | 'kpis' | 'report_builder' | 'alerts'
  >('executive');

  const [metrics, setMetrics] = useState<ExecutiveMetric[]>([]);
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [alerts, setAlerts] = useState<SmartAlertItem[]>([]);
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Copilot State
  const [queryInput, setQueryInput] = useState('');
  const [copilotChat, setCopilotChat] = useState<CopilotMessage[]>([
    {
      id: 'msg-01',
      sender: 'copilot',
      text: 'Halo Direksi! Saya **CosmoManufacture AI Copilot**. Saya dapat menjawab pertanyaan analytics lintas modul (MES, QC, Finance, HRIS, EAM, Inventory). Silakan ketik pertanyaan atau pilih rekomendasi query di bawah.',
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

      if (dashRes.ok) {
        const data = await dashRes.json();
        setMetrics(data.data.metrics || []);
      }
      if (kpiRes.ok) setKpis((await kpiRes.json()).data || []);
      if (predRes.ok) setPredictions((await predRes.json()).data || []);
      if (altRes.ok) setAlerts((await altRes.json()).data || []);
      if (rptRes.ok) setReports((await rptRes.json()).data || []);
    } catch (err) {
      console.error('Failed to fetch BI data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBiData();
  }, []);

  const handleSendCopilotQuery = async (queryText?: string) => {
    const q = queryText || queryInput;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
    };

    setCopilotChat((prev) => [...prev, userMsg]);
    if (!queryText) setQueryInput('');
    setIsQuerying(true);

    try {
      const res = await fetch('/api/bi/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const botMsg: CopilotMessage = {
          id: `bot-${Date.now()}`,
          sender: 'copilot',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          relatedMetrics: data.relatedMetrics,
        };
        setCopilotChat((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      showToast('Gagal memproses query AI Copilot.');
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 lg:p-8 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-purple-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-800 via-slate-800/90 to-purple-950/50 p-6 rounded-2xl border border-slate-700/60 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20 text-white">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Business Intelligence & AI Copilot Enterprise
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Executive Ready
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Pusat Analytics Direksi • Natural Language AI Query • Predictive Risk & Prescriptive Optimization • Cross-Module ERP Data Warehouse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('copilot')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-purple-600/30"
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span>AI Copilot Center</span>
          </button>
          <button
            onClick={fetchBiData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Real-time Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">{m.category}</span>
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
                  <div className="text-2xl font-bold text-white mt-1 font-mono">{m.value}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
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
            <div className="lg:col-span-2 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Kinerja Operasional & Finansial Lintas Modul</span>
                </h2>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
                  Live Data Warehouse
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Pabrik MES Cleanroom</div>
                  <div className="text-xl font-bold text-emerald-400">88.5% OEE</div>
                  <div className="text-xs text-slate-300 mt-2">Yield 98.8% • 0 Batch Fail</div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Quality Control LIMS</div>
                  <div className="text-xl font-bold text-purple-400">99.4% Pass</div>
                  <div className="text-xs text-slate-300 mt-2">Sterilitas CPKB ISO 22716</div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Kas & Profitabilitas</div>
                  <div className="text-xl font-bold text-blue-400">Rp 12.4M Cash</div>
                  <div className="text-xs text-slate-300 mt-2">Net Margin 24.5%</div>
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
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-4">Navigasi Analytics Exec</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('copilot')}
                    className="w-full text-left px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl flex items-center justify-between transition text-sm font-medium text-purple-200"
                  >
                    <span>Tanyakan pada AI Copilot</span>
                    <Bot className="w-4 h-4 text-purple-300" />
                  </button>
                  <button
                    onClick={() => setActiveTab('predictive')}
                    className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 flex items-center justify-between transition text-sm font-medium text-slate-200"
                  >
                    <span>Analisis Risiko Predictive</span>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('report_builder')}
                    className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 flex items-center justify-between transition text-sm font-medium text-slate-200"
                  >
                    <span>Report Builder Kustom</span>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                <span>Keamanan Data BI:</span>
                <span className="text-emerald-400 font-semibold">Tenant Isolated & RBAC</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI COPILOT CENTER */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/80 p-6 rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col justify-between min-h-[580px]">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-4">
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
                          : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                      {msg.relatedMetrics && msg.relatedMetrics.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
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

                      <div className="text-[10px] opacity-60 text-right mt-1 font-mono">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}

                {isQuerying && (
                  <div className="flex items-center gap-2 text-xs text-purple-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>AI Copilot sedang menganalisis Data Warehouse ERP...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCopilotQuery();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pertanyaan e.g. 'Tampilkan penjualan bulan ini'..."
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isQuerying || !queryInput.trim()}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg shadow-purple-600/30 text-sm"
                >
                  <span>Kirim</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Query Recommendation Chips */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Query Cepat Direksi</span>
            </h3>
            <p className="text-xs text-slate-400">Klik salah satu pertanyaan di bawah untuk query langsung ke AI Copilot:</p>

            <div className="space-y-2.5">
              {[
                'Tampilkan penjualan bulan ini',
                'Mesin dengan downtime tertinggi',
                'Material hampir habis',
                'Ringkasan payroll & SDM',
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendCopilotQuery(preset)}
                  className="w-full text-left p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-xl transition text-xs font-medium text-slate-200 flex items-center justify-between"
                >
                  <span>"{preset}"</span>
                  <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-purple-300">Kemampuan AI Copilot:</div>
              <div>• Memahami Query Natural Bahasa Indonesia</div>
              <div>• Ekstraksi Otomatis 18 Modul ERP</div>
              <div>• Rekomendasi Preskriptif Keputusan Management</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIVE & PRESCRIPTIVE ANALYTICS */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Prediksi Risiko & Rekomendasi Preskriptif Optimasi ERP</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.map((p) => (
                <div key={p.id} className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-purple-400 font-bold">{p.affectedModule}</span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          p.riskLevel === 'High'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : p.riskLevel === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        Risiko {p.riskLevel} ({p.probabilityPct}%)
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{p.title}</h3>
                    <p className="text-xs text-slate-300 mt-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
                      {p.impactDescription}
                    </p>
                  </div>

                  <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs space-y-1">
                    <span className="font-bold text-purple-300">Rekomendasi Preskriptif:</span>
                    <p className="text-slate-200">{p.prescriptiveRecommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KPI & SCORECARDS */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Scorecard KPI Perusahaan & Departemen</span>
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Kode & Judul KPI</th>
                    <th className="px-6 py-4">Departemen & Owner</th>
                    <th className="px-6 py-4">Target vs Aktual</th>
                    <th className="px-6 py-4">Capaian (%)</th>
                    <th className="px-6 py-4">Grade Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
                  {kpis.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{k.title}</div>
                        <div className="text-xs font-mono text-purple-400 mt-0.5">{k.code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-200">{k.department}</div>
                        <div className="text-xs text-slate-400">{k.owner}</div>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        Target: {k.targetValue} {k.unit} • <strong className="text-emerald-400">Aktual: {k.actualValue} {k.unit}</strong>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-lg text-purple-300">
                        {k.achievementPct}%
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {k.scoreGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORT BUILDER & DATA WAREHOUSE */}
      {activeTab === 'report_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>Report Builder Custom</span>
            </h2>

            <form onSubmit={handleSaveCustomReport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Judul Template Laporan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laporan Analisis Batch & Waste Costing"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Modul Sumber Data</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Manufacturing">Manufacturing MES & PPIC</option>
                  <option value="Financial">Financial Accounting & COGS</option>
                  <option value="Quality">Quality Control LIMS</option>
                  <option value="EAM">EAM Equipment & Maintenance</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-purple-600/30"
              >
                Simpan Template Laporan
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Daftar Template Laporan Tersimpan</span>
            </h2>

            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{r.title}</h4>
                    <div className="text-xs text-purple-400 mt-0.5">Kategori: {r.category} • Dibuat: {r.createdDate}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.columns.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 text-[11px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Mengunduh Laporan "${r.title}" (Excel/PDF)...`)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium border border-slate-600 transition flex items-center gap-1 shrink-0 ml-4"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
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
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>Pusat Alert & Peringatan Otomatis ERP</span>
            </h2>

            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          a.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : a.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {a.severity}
                      </span>
                      <span className="text-xs font-mono text-purple-400">[{a.module}]</span>
                      <span className="text-xs text-slate-400">{a.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-white text-base">{a.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{a.description}</p>
                    <div className="text-xs text-emerald-400 mt-1 font-semibold">Tindakan: {a.actionRequired}</div>
                  </div>

                  <div className="shrink-0">
                    {a.status === 'Active' ? (
                      <button
                        onClick={() => handleAcknowledgeAlert(a.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition"
                      >
                        Konfirmasi Alert
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Dikirim Ke Tim
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
