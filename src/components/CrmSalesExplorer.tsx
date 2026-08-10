import React, { useState, useEffect } from 'react';
import {
  Users,
  Target,
  FileText,
  ShoppingBag,
  Truck,
  TrendingUp,
  BrainCircuit,
  PhoneCall,
  Calendar,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Send,
  DollarSign,
  PieChart,
  BarChart2,
  ShieldCheck,
  ChevronRight,
  X,
  FileCheck,
  MessageSquare,
  Award,
  RefreshCw,
  Globe,
  Package,
  FlaskConical,
  ScrollText,
  Bot,
  ThumbsUp,
  RotateCcw,
  Check,
  Building,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const CrmSalesExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'leads_pipeline'
    | 'sample_requests'
    | 'quotations'
    | 'sales_orders'
    | 'delivery'
    | 'bpom_assistance'
    | 'activities'
    | 'ai_sales'
    | 'customer_portal'
  >('dashboard');

  // Backend Data
  const [metrics, setMetrics] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [sampleRequests, setSampleRequests] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [bpomAssistance, setBpomAssistance] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showNewQuotationModal, setShowNewQuotationModal] = useState(false);
  const [showNewSampleModal, setShowNewSampleModal] = useState(false);
  const [showNewBpomModal, setShowNewBpomModal] = useState(false);
  const [showLogActivityModal, setShowLogActivityModal] = useState(false);
  const [showNewDoModal, setShowNewDoModal] = useState(false);

  // Form States
  const [newLead, setNewLead] = useState({
    companyName: '',
    picName: '',
    email: 'owner@brand.co.id',
    phone: '+62 812 3344 5566',
    industry: 'Beauty & Skincare' as const,
    potentialValueRp: 350000000,
    priority: 'High' as const,
    notes: 'Inquiry baru maklon serum whitening & moisturizer gel.',
  });

  const [newQuotation, setNewQuotation] = useState({
    customerName: 'PT Beauty Glow Indonesia',
    customerPic: 'Rina Kartika (CEO)',
    customerEmail: 'rina@beautyglow.co.id',
    productName: 'UV Defense Sunscreen Gel SPF 50 PA++++',
    productSku: 'SKU-FG-SUN-05',
    quantityUnit: 10000,
    unitPriceRp: 35000,
    packagingSpec: 'Tube Soft Matte 50ml Airless Cap',
    targetBpom: 'NA18241700981',
  });

  const [newSample, setNewSample] = useState({
    customerName: 'GlowNation Skincare Inc.',
    brandName: 'GlowNation',
    formulaName: 'Snail Mucin + Centella Soothing Essence 100ml',
    scentNote: 'Mild Camellia Flower',
    textureSpec: 'Viscous Clear Essence - Non Sticky',
  });

  const [newBpom, setNewBpom] = useState({
    customerName: 'PT Beauty Glow Indonesia',
    brandName: 'BeautyGlow Cosmetics',
    productName: 'Ceramide Barrier Defense Moisture Gel 50ml',
    targetBpomCategory: 'NA - Kosmetik Pelembab Wajah',
    estimatedTargetDate: '2026-09-30',
  });

  const [newDo, setNewDo] = useState({
    soNumber: 'SO/CPKB/2026/08/0088',
    customerName: 'PT Beauty Glow Indonesia',
    shippingAddress: 'Gudang Utama BeautyGlow, Pergudangan Taman Tekno Blok D/5, BSD City',
    courierName: 'Internal Logistics Cold Truck #02',
    driverName: 'Suryadi (SIM B2)',
    vehiclePlateNumber: 'B 9182 PQA',
  });

  const [newActivity, setNewActivity] = useState({
    entityName: 'GlowNation Skincare Inc.',
    type: 'Meeting' as const,
    title: 'Meeting Negosiasi MOQ & Diskusi Airless Bottle Packaging',
    summary: 'Klien menyetujui penawaran harga per pcs. Menunggu penerbitan SO resmi.',
    salespersonName: 'Dimas Anggara',
  });

  // AI Chat Copilot State
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Halo! Saya **AI Sales & Revenue Copilot** (Gemini AI). Saya dapat membantu Anda menganalisis lead score, proyeksi omset maklon, penentuan harga tiered MOQ, dan SLA pendaftaran BPOM NA & Halal.',
    },
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Fetch CRM Data
  const loadCrmData = async () => {
    try {
      const resMetrics = await fetch('/api/crm/dashboard-metrics');
      const jsonMetrics = await resMetrics.json();
      if (jsonMetrics.summary) setMetrics(jsonMetrics.summary);

      const resLeads = await fetch(`/api/crm/leads?search=${encodeURIComponent(searchQuery)}`);
      const jsonLeads = await resLeads.json();
      if (jsonLeads.data) setLeads(jsonLeads.data);

      const resQuo = await fetch('/api/crm/quotations');
      const jsonQuo = await resQuo.json();
      if (jsonQuo.data) setQuotations(jsonQuo.data);

      const resSo = await fetch('/api/crm/sales-orders');
      const jsonSo = await resSo.json();
      if (jsonSo.data) setSalesOrders(jsonSo.data);

      const resDo = await fetch('/api/crm/delivery-orders');
      const jsonDo = await resDo.json();
      if (jsonDo.data) setDeliveryOrders(jsonDo.data);

      const resSamp = await fetch('/api/crm/sample-requests');
      const jsonSamp = await resSamp.json();
      if (jsonSamp.data) setSampleRequests(jsonSamp.data);

      const resBpom = await fetch('/api/crm/bpom-assistance');
      const jsonBpom = await resBpom.json();
      if (jsonBpom.data) setBpomAssistance(jsonBpom.data);

      const resAct = await fetch('/api/crm/activities');
      const jsonAct = await resAct.json();
      if (jsonAct.data) setActivities(jsonAct.data);

      const resAi = await fetch('/api/crm/ai-sales-insights');
      const jsonAi = await resAi.json();
      if (jsonAi.insights) setAiInsights(jsonAi.insights);
    } catch (err) {
      console.error('Failed fetching CRM data:', err);
    }
  };

  useEffect(() => {
    loadCrmData();
  }, [searchQuery]);

  // Handlers
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddLeadModal(false);
        setNewLead({
          companyName: '',
          picName: '',
          email: 'owner@brand.co.id',
          phone: '+62 812 3344 5566',
          industry: 'Beauty & Skincare',
          potentialValueRp: 350000000,
          priority: 'High',
          notes: 'Inquiry baru maklon serum whitening & moisturizer gel.',
        });
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdvanceLeadStage = async (leadId: string, currentStage: string) => {
    const stages = ['New Lead', 'Qualified', 'Presentation', 'Sample Requested', 'Quotation', 'Negotiation', 'PO', 'Won'];
    const idx = stages.indexOf(currentStage);
    if (idx < stages.length - 1) {
      const nextStage = stages[idx + 1];
      try {
        const res = await fetch(`/api/crm/leads/${leadId}/stage`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: nextStage }),
        });
        const json = await res.json();
        if (json.success) loadCrmData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subtotal = newQuotation.quantityUnit * newQuotation.unitPriceRp;
      const res = await fetch('/api/crm/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuotation,
          items: [
            {
              id: `qitem-${Date.now()}`,
              productSku: newQuotation.productSku,
              productName: newQuotation.productName,
              quantityUnit: newQuotation.quantityUnit,
              unitPriceRp: newQuotation.unitPriceRp,
              discountPct: 0,
              subtotalRp: subtotal,
              packagingSpec: newQuotation.packagingSpec,
              targetBpom: newQuotation.targetBpom,
            },
          ],
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewQuotationModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertQuotationToSo = async (quotationId: string) => {
    try {
      const res = await fetch('/api/crm/sales-orders/convert-from-quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotationId }),
      });
      const json = await res.json();
      if (json.success) {
        loadCrmData();
        setActiveTab('sales_orders');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSampleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/sample-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSample),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewSampleModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSampleFeedback = async (id: string, feedbackStatus: string) => {
    try {
      const res = await fetch(`/api/crm/sample-requests/${id}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackStatus, revisionNotes: 'Ulasan hasil uji laboratorium telah dikonfirmasi.' }),
      });
      const json = await res.json();
      if (json.success) loadCrmData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBpom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/bpom-assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBpom),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewBpomModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/delivery-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDo),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewDoModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
      const json = await res.json();
      if (json.success) {
        setShowLogActivityModal(false);
        loadCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAiMessage = async (customPrompt?: string) => {
    const query = customPrompt || aiChatInput;
    if (!query.trim() || isAiLoading) return;

    setAiChatMessages((prev) => [...prev, { role: 'user', text: query }]);
    if (!customPrompt) setAiChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/crm/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const json = await res.json();
      if (json.success && json.reply) {
        setAiChatMessages((prev) => [...prev, { role: 'assistant', text: json.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg">
                <TrendingUp className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Sales & CRM Enterprise Maklon Kosmetik
                  </h1>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 7 • CPKB B2B Cycle
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Manajemen Siklus Penjualan Maklon: Prospecting Leads, R&D Lab Samples, Quotation Matrix, SO Confirmed, Legalitas BPOM/Halal, Delivery POD & AI Copilot.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-2 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>+ Lead B2B Baru</span>
            </button>

            <button
              onClick={() => setShowNewSampleModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
            >
              <FlaskConical className="h-4 w-4" />
              <span>+ Minta Sampel Lab</span>
            </button>

            <button
              onClick={() => setShowNewQuotationModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
              <span>+ Buat Quotation</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_sales')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Bot className="h-4 w-4 text-amber-400" />
              <span>AI Sales Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Omset Penjualan</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">
            Rp {((metrics?.salesMonthRp || 574702500) / 1000000).toFixed(1)}M
          </p>
          <p className="text-[10px] text-slate-400">+18.5% Realisasi Bulan Ini</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Pipeline Potential</span>
            <Target className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-black font-mono text-indigo-300">
            Rp {((metrics?.pipelineValueRp || 880000000) / 1000000).toFixed(1)}M
          </p>
          <p className="text-[10px] text-slate-400">{metrics?.totalLeadsCount || 3} Prospek Deal Aktif</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Win Conversion</span>
            <PieChart className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-black font-mono text-amber-300">{metrics?.conversionRatePct || 42.5}%</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Di Atas Target 35%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Sampel Lab Trial</span>
            <FlaskConical className="h-3.5 w-3.5 text-teal-400" />
          </div>
          <p className="text-xl font-black font-mono text-teal-300">{sampleRequests.length || 2} Trial</p>
          <p className="text-[10px] text-teal-400 font-semibold">Formula Formulasi Maklon</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>BPOM NA Tracker</span>
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-black font-mono text-purple-300">{bpomAssistance.length || 2} Produk</p>
          <p className="text-[10px] text-purple-400 font-semibold">Regis Legalitas Izin Edar</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Confirmed SO</span>
            <ShoppingBag className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-black font-mono text-cyan-300">{metrics?.confirmedSoCount || 1} SO</p>
          <p className="text-[10px] text-cyan-400 font-semibold">In Production CPKB</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari Lead B2B, Brand Klien, Quotation, SO, Sampel Lab, atau Nomor Tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
          <Filter className="h-4 w-4 text-indigo-400" />
          <span>Status Filter:</span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            Semua Modul Aktif
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold custom-scrollbar scroll-smooth touch-pan-x pb-1"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Dashboard & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('leads_pipeline')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'leads_pipeline'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>B2B Lead Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('sample_requests')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'sample_requests'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Sampel Lab R&D Trial</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'quotations'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Sales Quotations</span>
        </button>

        <button
          onClick={() => setActiveTab('sales_orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'sales_orders'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Sales Orders (SO)</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'delivery'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Delivery Orders (POD)</span>
        </button>

        <button
          onClick={() => setActiveTab('bpom_assistance')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'bpom_assistance'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Legalitas BPOM & Halal</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          <span>Activity Log</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_sales')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'ai_sales'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="h-4 w-4 text-amber-400" />
          <span>AI Revenue Copilot</span>
        </button>

        <button
          onClick={() => setActiveTab('customer_portal')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'customer_portal'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Client Self-Service Portal</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="h-4 w-4 text-amber-400" /> Top Customer Brand Maklon
              </h3>
              <div className="space-y-3 text-xs">
                {metrics?.topCustomers?.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">{c.companyName}</div>
                      <div className="text-[10px] text-amber-400 font-bold">Brand: {c.brandName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-300">Credit Limit: Rp {(c.creditLimitRp / 1000000).toFixed(0)}M</div>
                      <div className="text-[10px] text-slate-400">{c.priceGroup}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Package className="h-4 w-4 text-indigo-400" /> Kategori Formulasi Paling Diminati
              </h3>
              <div className="space-y-3 text-xs">
                {metrics?.topProducts?.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">{p.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} | Target BPOM: {p.bpomNumber}</div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEADS PIPELINE */}
      {activeTab === 'leads_pipeline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-400" /> Pipeline B2B Cosmetic Leads (AI Score Card)
              </h3>
              <p className="text-xs text-slate-400">Klasifikasi Tahapan Prospek Klien Brand Maklon & Penilaian Probabilitas Closing</p>
            </div>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Tambah Lead Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
                      {lead.leadNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      AI Score: {lead.score}/100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{lead.companyName}</h4>
                  <p className="text-xs text-slate-300">PIC: {lead.picName}</p>

                  <div className="space-y-1 text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div>Email: <span className="text-slate-200">{lead.email}</span></div>
                    <div>Sumber Lead: <span className="text-amber-300 font-bold">{lead.leadSource}</span></div>
                    <div>Target Order: <span className="text-emerald-300 font-mono font-bold">Rp {(lead.potentialValueRp / 1000000).toFixed(0)} Juta</span></div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">"{lead.notes}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    {lead.stage}
                  </span>

                  {lead.stage !== 'Won' && (
                    <button
                      onClick={() => handleAdvanceLeadStage(lead.id, lead.stage)}
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Lanjut Tahapan <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAMPLE REQUESTS (LAB TRIALS) */}
      {activeTab === 'sample_requests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-400" /> Sampel Lab R&D & Feedback Formulasi Maklon
              </h3>
              <p className="text-xs text-slate-400">Pengiriman Sampel Trial Formulasi ke Klien, Review Tekstur, Scent Note & Konfirmasi Approval Batch</p>
            </div>
            <button
              onClick={() => setShowNewSampleModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Minta Sampel Lab Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleRequests.map((samp) => (
              <div key={samp.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950 px-2.5 py-1 rounded border border-teal-500/30">
                      {samp.sampleNumber}
                    </span>
                    <p className="text-xs font-bold text-white mt-1">{samp.customerName} ({samp.brandName})</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      samp.feedbackStatus === 'Approved for Production'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {samp.feedbackStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">Formulasi: <span className="font-bold text-white">{samp.formulaName}</span></p>
                  <p className="text-slate-400 text-[11px]">Lab Batch Ref: <span className="font-mono text-teal-400">{samp.labBatchNumber}</span></p>
                  <p className="text-slate-300">Spesifikasi Tekstur: <span className="text-amber-300 font-bold">{samp.textureSpec}</span></p>
                  <p className="text-slate-300">Aroma / Scent Note: <span className="text-emerald-300 font-bold">{samp.scentNote}</span></p>
                  {samp.revisionNotes && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                      <span className="font-bold text-amber-400">Catatan Ulasan Klien:</span> {samp.revisionNotes}
                    </div>
                  )}
                </div>

                {samp.feedbackStatus !== 'Approved for Production' && (
                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleUpdateSampleFeedback(samp.id, 'Revision Requested')}
                      className="py-1.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-all"
                    >
                      Minta Revisi Lab
                    </button>
                    <button
                      onClick={() => handleUpdateSampleFeedback(samp.id, 'Approved for Production')}
                      className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" /> Setujui Formulasi
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SALES QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Penawaran Harga (Sales Quotations & Simulasi Margin)
              </h3>
              <p className="text-xs text-slate-400">Rincian Komponen Biaya Maklon per Pcs, Diskon Volume MOQ & Approval Margin Finance</p>
            </div>
            <button
              onClick={() => setShowNewQuotationModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Buat Quotation Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. Quotation</th>
                  <th className="py-2.5 px-3">Nama Klien / Brand</th>
                  <th className="py-2.5 px-3">Item Produk & Kemasan</th>
                  <th className="py-2.5 px-3">Total Penawaran (inc. PPN)</th>
                  <th className="py-2.5 px-3">Status Approval</th>
                  <th className="py-2.5 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      {q.quotationNumber}
                      <div className="text-[10px] text-slate-400 font-normal">v{q.version} | Exp: {q.validUntil}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      {q.customerName}
                      <div className="text-[10px] text-slate-400 font-normal">PIC: {q.customerPic}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      {q.items?.map((it: any) => (
                        <div key={it.id}>
                          • <span className="font-bold text-white">{it.productName}</span> ({it.quantityUnit.toLocaleString('id-ID')} unit)
                          <div className="text-[10px] text-amber-300">Pack: {it.packagingSpec}</div>
                        </div>
                      ))}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {q.grandTotalRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {q.status === 'Approved' && (
                        <button
                          onClick={() => handleConvertQuotationToSo(q.id)}
                          className="py-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow transition-all"
                        >
                          Convert to SO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SALES ORDERS */}
      {activeTab === 'sales_orders' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShoppingBag className="h-4 w-4 text-cyan-400" /> Sales Orders (Status Rilis Produksi Batch CPKB)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. SO</th>
                  <th className="py-2.5 px-3">Customer & Brand</th>
                  <th className="py-2.5 px-3">Metode Pengiriman</th>
                  <th className="py-2.5 px-3">Total Nilai SO</th>
                  <th className="py-2.5 px-3">Target Kirim</th>
                  <th className="py-2.5 px-3">Status SO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {salesOrders.map((so) => (
                  <tr key={so.id} className="hover:bg-slate-900 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{so.soNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      {so.customerName}
                      <div className="text-[10px] text-amber-300">{so.brandName}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{so.shippingMethod}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {so.grandTotalRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{so.targetDeliveryDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                        {so.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DELIVERY ORDERS */}
      {activeTab === 'delivery' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" /> Status Pengiriman Barang (Delivery Orders & Surat Jalan POD)
              </h3>
              <p className="text-xs text-slate-400">Pengiriman Armada Cold Chain, Resi Tracking & Proof of Delivery (POD)</p>
            </div>
            <button
              onClick={() => setShowNewDoModal(true)}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Terbitkan DO Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. DO</th>
                  <th className="py-2.5 px-3">Ref. SO</th>
                  <th className="py-2.5 px-3">Pelanggan & Alamat</th>
                  <th className="py-2.5 px-3">Armada & Resi</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Status Pengiriman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {deliveryOrders.map((doItem) => (
                  <tr key={doItem.id} className="hover:bg-slate-900 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{doItem.doNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-indigo-300">{doItem.soNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-100">{doItem.customerName}</div>
                      <div className="text-[10px] text-slate-400">{doItem.shippingAddress}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{doItem.courierName}</div>
                      <div className="text-[10px] font-mono text-emerald-400">{doItem.trackingNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{doItem.driverName} ({doItem.vehiclePlateNumber})</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {doItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: BPOM & HALAL ASSISTANCE */}
      {activeTab === 'bpom_assistance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" /> Pendampingan Registrasi BPOM NA & Sertifikat Halal MUI
              </h3>
              <p className="text-xs text-slate-400">Layanan One-Stop Legalitas Izin Edar untuk Klien Brand Maklon</p>
            </div>
            <button
              onClick={() => setShowNewBpomModal(true)}
              className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Tambah Pendaftaran BPOM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bpomAssistance.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-xs">{b.productName}</h4>
                    <p className="text-[11px] text-amber-300">{b.customerName} ({b.brandName})</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                    {b.bpomSubmissionStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>Kategori BPOM: <span className="font-bold text-white">{b.targetBpomCategory}</span></p>
                  {b.naNumber ? (
                    <p>Nomor Notifikasi BPOM NA: <span className="font-mono font-bold text-emerald-400">{b.naNumber}</span></p>
                  ) : (
                    <p>Target Terbit Izin Edar: <span className="font-mono text-amber-300">{b.estimatedTargetDate}</span></p>
                  )}
                  {b.halalRegNumber && (
                    <p>Sertifikat Halal MUI: <span className="font-mono font-bold text-teal-400">{b.halalRegNumber}</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-teal-400" /> Log Aktivitas CRM & Timeline Komunikasi Klien
              </h3>
              <p className="text-xs text-slate-400">Pencatatan Meeting, Phone Call, WhatsApp & Pengiriman Sampel</p>
            </div>
            <button
              onClick={() => setShowLogActivityModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> + Catat Aktivitas
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-2 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-500/30">
                      {act.type}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{act.entityName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{act.activityDate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{act.title}</h4>
                <p className="text-xs text-slate-300">{act.summary}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                  <span>Sales Executive: {act.salespersonName}</span>
                  <span className="text-emerald-400 font-bold">Hasil: {act.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: AI SALES COPILOT */}
      {activeTab === 'ai_sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" /> AI Forecast Revenue & Intelligent Lead Recommendations
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                  Akurasi Prediksi Model: {aiInsights?.forecastAccuracyPct || 94.2}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Proyeksi Revenue Maklon Bulan Depan</span>
                <div className="text-3xl font-mono font-extrabold text-indigo-300">
                  Rp {((aiInsights?.predictedMonthlyRevenueRp || 1280000000) / 1000000).toFixed(0)} Juta
                </div>
                <p className="text-xs text-slate-400">
                  Kalkulasi otomatis berbasiskan historical win rate deal, SLA rilis laboratorium sampel, dan ketersediaan kapasitas CPKB.
                </p>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Rekomendasi Cross-Selling Formulasi
                  </h4>
                  {aiInsights?.crossSellRecommendations?.map((cs: any, idx: number) => (
                    <div key={idx} className="text-xs space-y-1">
                      <p className="font-bold text-slate-200">{cs.targetCustomer}</p>
                      <p className="text-slate-300">Tawarkan: <span className="text-amber-300 font-bold">{cs.recommendedProduct}</span></p>
                      <p className="text-[10px] text-slate-400 italic">{cs.reasoning}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> Peringatan Potensi Churn Klien
                  </h4>
                  {aiInsights?.churnRiskAlerts?.map((c: any, idx: number) => (
                    <div key={idx} className="text-xs space-y-1">
                      <p className="font-bold text-slate-200">{c.customerName} (Level Risk: {c.riskLevel})</p>
                      <p className="text-[10px] text-slate-400">Tidak repeat order dalam {c.lastOrderDaysAgo} hari.</p>
                      <p className="text-[10px] text-emerald-300">{c.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Interactive Assistant Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-5 space-y-4 shadow-xl flex flex-col justify-between h-[520px]">
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Sales Assistant Chat</h4>
                  <p className="text-[10px] text-slate-400">Konsultasi Harga, Lead Scoring & BPOM SLA</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {aiChatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-950 border border-indigo-500/30 text-indigo-200 ml-6'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 mr-6'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs animate-pulse">
                    Menganalisis data CRM & formula pricing...
                  </div>
                )}
              </div>
            </div>

            {/* Quick Prompts & Chat Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendAiMessage('Berapa estimasi SLA pendaftaran BPOM NA?')}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-bold"
                >
                  💡 SLA BPOM NA?
                </button>
                <button
                  onClick={() => handleSendAiMessage('Analisis lead GlowNation Skincare')}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-bold"
                >
                  💡 Lead GlowNation?
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ketik pertanyaan sales..."
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  disabled={isAiLoading}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: CUSTOMER PORTAL */}
      {activeTab === 'customer_portal' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" /> Preview B2B Client Self-Service Portal
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Klien Connected Live
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 font-bold">Akses Portal Klien Brand Owner Maklon:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <FileText className="h-5 w-5 text-emerald-400 mx-auto" />
                <span className="font-bold text-slate-200 block">Download COA & MSDS</span>
                <span className="text-[10px] text-slate-400">Sertifikat Analisis Batch</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <Truck className="h-5 w-5 text-indigo-400 mx-auto" />
                <span className="font-bold text-slate-200 block">Realtime Tracking Delivery</span>
                <span className="text-[10px] text-slate-400">Status Armada & POD</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <ShoppingBag className="h-5 w-5 text-amber-400 mx-auto" />
                <span className="font-bold text-slate-200 block">Repeat Order SO</span>
                <span className="text-[10px] text-slate-400">Pengajuan Batch Ulang</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <MessageSquare className="h-5 w-5 text-rose-400 mx-auto" />
                <span className="font-bold text-slate-200 block">Pengajuan Komplain QC</span>
                <span className="text-[10px] text-slate-400">Tiket Helpdesk Kualitas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-400" /> Tambah Lead B2B Cosmetic Baru
              </h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan / Brand Klien</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT Natura Beauty Skin"
                  value={newLead.companyName}
                  onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama PIC</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amanda Putri (Founder)"
                    value={newLead.picName}
                    onChange={(e) => setNewLead({ ...newLead, picName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Potensi Nilai Deal (Rp)</label>
                  <input
                    type="number"
                    value={newLead.potentialValueRp}
                    onChange={(e) => setNewLead({ ...newLead, potentialValueRp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Catatan Kebutuhan Maklon</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Lead B2B
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW SAMPLE REQUEST */}
      {showNewSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-400" /> Permintaan Sampel R&D Lab Trial
              </h3>
              <button onClick={() => setShowNewSampleModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSampleRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan Klien</label>
                  <input
                    type="text"
                    required
                    value={newSample.customerName}
                    onChange={(e) => setNewSample({ ...newSample, customerName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Brand</label>
                  <input
                    type="text"
                    required
                    value={newSample.brandName}
                    onChange={(e) => setNewSample({ ...newSample, brandName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Formulasi Yang Diharapkan</label>
                <input
                  type="text"
                  required
                  value={newSample.formulaName}
                  onChange={(e) => setNewSample({ ...newSample, formulaName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Aroma / Scent Note</label>
                  <input
                    type="text"
                    value={newSample.scentNote}
                    onChange={(e) => setNewSample({ ...newSample, scentNote: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Spesifikasi Tekstur</label>
                  <input
                    type="text"
                    value={newSample.textureSpec}
                    onChange={(e) => setNewSample({ ...newSample, textureSpec: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Kirim Permintaan Sampel ke Formulator Lab
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW QUOTATION */}
      {showNewQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Buat Sales Quotation Baru
              </h3>
              <button onClick={() => setShowNewQuotationModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan Klien</label>
                <input
                  type="text"
                  required
                  value={newQuotation.customerName}
                  onChange={(e) => setNewQuotation({ ...newQuotation, customerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Produk Produk Kosmetik</label>
                <input
                  type="text"
                  required
                  value={newQuotation.productName}
                  onChange={(e) => setNewQuotation({ ...newQuotation, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kuantitas Order (Pcs)</label>
                  <input
                    type="number"
                    value={newQuotation.quantityUnit}
                    onChange={(e) => setNewQuotation({ ...newQuotation, quantityUnit: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Harga Per Pcs (Rp)</label>
                  <input
                    type="number"
                    value={newQuotation.unitPriceRp}
                    onChange={(e) => setNewQuotation({ ...newQuotation, unitPriceRp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Spesifikasi Kemasan (Botol/Pot/Jar)</label>
                <input
                  type="text"
                  value={newQuotation.packagingSpec}
                  onChange={(e) => setNewQuotation({ ...newQuotation, packagingSpec: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Terbitkan Penawaran Sales Quotation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW BPOM REGISTRATION */}
      {showNewBpomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" /> Pendaftaran Pendampingan BPOM NA
              </h3>
              <button onClick={() => setShowNewBpomModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBpom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Perusahaan</label>
                  <input
                    type="text"
                    required
                    value={newBpom.customerName}
                    onChange={(e) => setNewBpom({ ...newBpom, customerName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Nama Brand</label>
                  <input
                    type="text"
                    required
                    value={newBpom.brandName}
                    onChange={(e) => setNewBpom({ ...newBpom, brandName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Produk Kosmetik</label>
                <input
                  type="text"
                  required
                  value={newBpom.productName}
                  onChange={(e) => setNewBpom({ ...newBpom, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Kategori BPOM</label>
                <input
                  type="text"
                  value={newBpom.targetBpomCategory}
                  onChange={(e) => setNewBpom({ ...newBpom, targetBpomCategory: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Daftarkan Pendampingan Izin Edar BPOM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW DELIVERY ORDER */}
      {showNewDoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" /> Terbitkan Delivery Order (DO)
              </h3>
              <button onClick={() => setShowNewDoModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Ref No. SO</label>
                <input
                  type="text"
                  required
                  value={newDo.soNumber}
                  onChange={(e) => setNewDo({ ...newDo, soNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold font-mono text-indigo-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Pelanggan / Klien</label>
                <input
                  type="text"
                  required
                  value={newDo.customerName}
                  onChange={(e) => setNewDo({ ...newDo, customerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Alamat Tujuan Pengiriman</label>
                <textarea
                  rows={2}
                  value={newDo.shippingAddress}
                  onChange={(e) => setNewDo({ ...newDo, shippingAddress: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Driver Armada</label>
                  <input
                    type="text"
                    value={newDo.driverName}
                    onChange={(e) => setNewDo({ ...newDo, driverName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Plat Kendaraan</label>
                  <input
                    type="text"
                    value={newDo.vehiclePlateNumber}
                    onChange={(e) => setNewDo({ ...newDo, vehiclePlateNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Terbitkan Delivery Order & Surat Jalan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG ACTIVITY */}
      {showLogActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal-400" /> Catat Aktivitas Penjualan
              </h3>
              <button onClick={() => setShowLogActivityModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Judul Aktivitas</label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Rangkuman Meeting / Call</label>
                <textarea
                  rows={3}
                  value={newActivity.summary}
                  onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Aktivitas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
