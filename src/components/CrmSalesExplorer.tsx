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
  Eye,
  X,
  FileCheck,
  MessageSquare,
  Award,
  RefreshCw,
  Zap,
  Globe,
  Package,
} from 'lucide-react';

export const CrmSalesExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'leads_pipeline' | 'quotations' | 'sales_orders' | 'delivery' | 'activities' | 'ai_sales' | 'customer_portal'
  >('dashboard');

  // Backend Data
  const [metrics, setMetrics] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showNewQuotationModal, setShowNewQuotationModal] = useState(false);
  const [showLogActivityModal, setShowLogActivityModal] = useState(false);

  // Form States
  const [newLead, setNewLead] = useState({
    companyName: '',
    picName: '',
    email: 'owner@brand.co.id',
    phone: '+62 812 3344 5566',
    industry: 'Beauty & Skincare',
    potentialValueRp: 300000000,
    priority: 'High',
    notes: 'Klien baru maklon serum whitening.',
  });

  const [newActivity, setNewActivity] = useState({
    entityName: 'GlowNation Skincare Inc.',
    type: 'Meeting',
    title: 'Meeting Negosiasi MOQ & Diskusi Packaging Airless Bottle',
    summary: 'Klien sepakat dengan harga per pcs. Menunggu penerbitan SO resmi.',
    salespersonName: 'Dimas Anggara',
  });

  // Load Data
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
          potentialValueRp: 300000000,
          priority: 'High',
          notes: 'Klien baru maklon serum whitening.',
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Prompt 7 — CRM & Sales Management Enterprise (B2B Cosmetic OEM)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Sistem Komprehensif Siklus Penjualan B2B Manufaktur: Prospecting, Pipeline Kanban, Quotation, Sales Order, Delivery Tracking, AI Revenue Forecasting & Customer Portal.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari Lead, Customer, SO, Quotation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Dashboard Sales & KPIs
        </button>
        <button
          onClick={() => setActiveTab('leads_pipeline')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'leads_pipeline'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎯 Lead Management & Pipeline Kanban
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'quotations'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📄 Sales Quotations (Penawaran)
        </button>
        <button
          onClick={() => setActiveTab('sales_orders')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'sales_orders'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🛒 Sales Orders (SO Status)
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'delivery'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚚 Delivery Orders & Tracking
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'activities'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📞 Customer Activities & Timeline
        </button>
        <button
          onClick={() => setActiveTab('ai_sales')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'ai_sales'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🤖 AI Sales Forecast & Intelligence
        </button>
        <button
          onClick={() => setActiveTab('customer_portal')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'customer_portal'
              ? 'border-b-2 border-indigo-400 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🌐 Customer Self-Service Portal
        </button>
      </div>

      {/* TAB 1: SALES DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-400" /> Omset Bulan Ini
              </span>
              <p className="text-2xl font-extrabold text-emerald-300 font-mono">
                Rp {((metrics?.salesMonthRp || 574702500) / 1000000).toFixed(1)}M
              </p>
              <p className="text-[10px] text-slate-400">+18.5% dari target bulanan</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-indigo-400" /> Pipeline Deal Potential
              </span>
              <p className="text-2xl font-extrabold text-indigo-300 font-mono">
                Rp {((metrics?.pipelineValueRp || 880000000) / 1000000).toFixed(1)}M
              </p>
              <p className="text-[10px] text-slate-400">{metrics?.totalLeadsCount || 3} Prospek Aktif</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <PieChart className="h-4 w-4 text-amber-400" /> Conversion Win Rate
              </span>
              <p className="text-2xl font-extrabold text-amber-300 font-mono">
                {metrics?.conversionRatePct || 42.5}%
              </p>
              <p className="text-[10px] text-slate-400">Target Benchmark KPI: 35%</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-teal-400" /> Confirmed Orders
              </span>
              <p className="text-2xl font-extrabold text-teal-300 font-mono">
                {metrics?.confirmedSoCount || 1} Batch SO
              </p>
              <p className="text-[10px] text-slate-400">Siap diproduksi di CPKB</p>
            </div>
          </div>

          {/* Quick Metrics & Top Sales Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="h-4 w-4 text-amber-400" /> Top Customer Maklon Brand
              </h3>
              <div className="space-y-3 text-xs">
                {metrics?.topCustomers?.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">{c.companyName}</div>
                      <div className="text-[10px] text-amber-400 font-bold">Brand: {c.brandName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-300">Limit: Rp {(c.creditLimitRp / 1000000).toFixed(0)}M</div>
                      <div className="text-[10px] text-slate-400">{c.priceGroup}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Package className="h-4 w-4 text-indigo-400" /> High-Demand Product Formulations
              </h3>
              <div className="space-y-3 text-xs">
                {metrics?.topProducts?.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">{p.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} | BPOM: {p.bpomNumber}</div>
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

      {/* TAB 2: LEADS & PIPELINE KANBAN */}
      {activeTab === 'leads_pipeline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" /> B2B Cosmetic Leads Pipeline
            </h3>
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Tambah Lead Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{lead.leadNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      Score: {lead.score}/100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{lead.companyName}</h4>
                  <p className="text-xs text-slate-300">PIC: {lead.picName}</p>

                  <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>Email: <span className="text-slate-200">{lead.email}</span></div>
                    <div>Source: <span className="text-amber-300 font-bold">{lead.leadSource}</span></div>
                    <div>Target Value: <span className="text-emerald-300 font-mono font-bold">Rp {(lead.potentialValueRp / 1000000).toFixed(0)} Juta</span></div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">"{lead.notes}"</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    {lead.stage}
                  </span>

                  {lead.stage !== 'Won' && (
                    <button
                      onClick={() => handleAdvanceLeadStage(lead.id, lead.stage)}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Maju Tahap <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SALES QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" /> Penawaran Harga (Sales Quotations)
            </h3>
            <button
              onClick={() => setShowNewQuotationModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Buat Penawaran Harga Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. Quotation</th>
                  <th className="py-2.5 px-3">Nama Klien / Perusahaan</th>
                  <th className="py-2.5 px-3">Item Produk</th>
                  <th className="py-2.5 px-3">Total Penawaran (inc. PPN)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                      {q.quotationNumber}
                      <div className="text-[10px] text-slate-400 font-normal">v{q.version} | Exp: {q.validUntil}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      {q.customerName}
                      <div className="text-[10px] text-slate-400 font-normal">PIC: {q.customerPic}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                      {q.items.map((it: any) => (
                        <div key={it.id}>
                          • {it.productName} ({it.quantityUnit.toLocaleString('id-ID')} unit)
                        </div>
                      ))}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {q.grandTotalRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {q.status === 'Approved' && (
                        <button
                          onClick={() => handleConvertQuotationToSo(q.id)}
                          className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow transition-all"
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

      {/* TAB 4: SALES ORDERS */}
      {activeTab === 'sales_orders' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShoppingBag className="h-4 w-4 text-indigo-400" /> Sales Orders (SO Status Production & Delivery)
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
                  <tr key={so.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{so.soNumber}</td>
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30 uppercase">
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

      {/* TAB 5: DELIVERY ORDERS */}
      {activeTab === 'delivery' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Truck className="h-4 w-4 text-amber-400" /> Status Pengiriman Barang (Delivery Orders & POD)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. DO</th>
                  <th className="py-2.5 px-3">Ref. SO</th>
                  <th className="py-2.5 px-3">Pelanggan & Alamat</th>
                  <th className="py-2.5 px-3">Armada & Resi</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Status Surat Jalan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {deliveryOrders.map((doItem) => (
                  <tr key={doItem.id} className="hover:bg-slate-800/50 transition-all">
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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

      {/* TAB 6: ACTIVITIES & TIMELINE */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-teal-400" /> Log Aktivitas Penjualan & Follow-Up
            </h3>
            <button
              onClick={() => setShowLogActivityModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Catat Aktivitas Baru
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900 space-y-2 shadow-md">
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
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
                  <span>Sales Executive: {act.salespersonName}</span>
                  <span className="text-emerald-400 font-bold">Hasil: {act.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI SALES FORECAST */}
      {activeTab === 'ai_sales' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-indigo-400" /> AI Sales Intelligence & Forecast Revenue
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                Akurasi Prediksi: {aiInsights?.forecastAccuracyPct || 94.2}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Proyeksi Omset Bulan Depan (AI Prediction Model)</span>
              <div className="text-3xl font-mono font-extrabold text-indigo-300">
                Rp {((aiInsights?.predictedMonthlyRevenueRp || 1280000000) / 1000000).toFixed(0)} Juta
              </div>
              <p className="text-xs text-slate-400">
                Dihitung berdasarkan historical win rate lead, rata-rata lead time approval sampel, dan tren ketersediaan slot produksi CPKB.
              </p>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Rekomendasi Cross-Selling
                </h4>
                {aiInsights?.crossSellRecommendations?.map((cs: any, idx: number) => (
                  <div key={idx} className="text-xs space-y-1">
                    <p className="font-bold text-slate-200">{cs.targetCustomer}</p>
                    <p className="text-slate-300">Tawarkan: <span className="text-amber-300 font-bold">{cs.recommendedProduct}</span></p>
                    <p className="text-[10px] text-slate-400 italic">{cs.reasoning}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Deteksi Churn Risk Pelanggan
                </h4>
                {aiInsights?.churnRiskAlerts?.map((c: any, idx: number) => (
                  <div key={idx} className="text-xs space-y-1">
                    <p className="font-bold text-slate-200">{c.customerName} (Risk: {c.riskLevel})</p>
                    <p className="text-[10px] text-slate-400">Order terakhir: {c.lastOrderDaysAgo} hari lalu.</p>
                    <p className="text-[10px] text-emerald-300">{c.recommendedAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: CUSTOMER PORTAL */}
      {activeTab === 'customer_portal' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" /> B2B Client Self-Service Portal Preview
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Live Connected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 font-bold">Portal khusus Klien Brand Maklon Kosmetik untuk:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <FileText className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200">Download COA & MSDS</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <Truck className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200">Tracking Pengiriman</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <ShoppingBag className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200">Repeat Order SO</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <MessageSquare className="h-5 w-5 text-rose-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200">Pengajuan Komplain</span>
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
                <Plus className="h-4 w-4 text-indigo-400" /> Tambah B2B Cosmetic Lead Baru
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
