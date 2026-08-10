import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  FileText,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BrainCircuit,
  Sparkles,
  Award,
  ShieldCheck,
  ChevronRight,
  X,
  FileCheck,
  RefreshCw,
  PieChart,
  BarChart2,
  ArrowRight,
  Layers,
  Building,
  Package,
  FileSpreadsheet,
  Send,
  Bot,
  Scale,
  Calendar,
  AlertTriangle,
  UserCheck,
  Check,
  ArrowDownToLine,
  Lock,
  Tag,
} from 'lucide-react';

export const ProcurementExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'pr' | 'rfq' | 'blanket_orders' | 'po' | 'grn' | 'invoice_matching' | 'vendor_score' | 'ai_procurement'
  >('dashboard');

  // Backend Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [blanketOrders, setBlanketOrders] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<any[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<any[]>([]);
  const [vendorScores, setVendorScores] = useState<any[]>([]);
  const [vendorAudits, setVendorAudits] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [showNewPrModal, setShowNewPrModal] = useState(false);
  const [showNewRfqModal, setShowNewRfqModal] = useState(false);
  const [showNewGrnModal, setShowNewGrnModal] = useState(false);
  const [showCallOffModal, setShowCallOffModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedBpo, setSelectedBpo] = useState<any>(null);

  // Form States
  const [newPr, setNewPr] = useState({
    department: 'R&D Formulation',
    requesterName: 'Dr. Clara S. (Lead Chemist)',
    requiredDate: '2026-08-25',
    priority: 'High',
    costCenter: 'CC-RD-LAB',
    itemCode: 'RM-ACT-005',
    itemName: 'Alpha Arbutin Pure Powder Grade A',
    quantityRequested: 100,
    unit: 'Kg',
    estimatedUnitPriceRp: 850000,
    reason: 'Kebutuhan formulasi batch baru Whitening Night Cream CPKB.',
  });

  const [newRfq, setNewRfq] = useState({
    prNumber: 'PR/PROC/2026/08/0019',
    itemCode: 'RM-ACT-001',
    itemName: 'Niacinamide 99% USP Cosmetic Grade',
    quantityNeeded: 500,
    deadlineDate: '2026-08-28',
  });

  const [callOffForm, setCallOffForm] = useState({
    releaseQtyKg: 250,
    warehouseCode: 'WH-RM-01 (Gudang Bahan Baku Utama)',
    deliveryDate: '2026-08-22',
  });

  const [newGrn, setNewGrn] = useState({
    poNumber: 'PO/CPKB/2026/08/0045',
    deliveryNoteNumber: 'SJ-SUPP-202608-88',
    receivedBy: 'Budi Santoso (Warehouse Supervisor)',
    batchNumber: 'BN-20260806-ARB',
    quantityReceived: 100,
  });

  const [auditForm, setAuditForm] = useState({
    supplierCode: 'SUP-ID-001',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    gmpCpkbStatus: 'CPKB / GMP Certified' as const,
    halalStatus: 'Halal LPPOM MUI Certified' as const,
    bpomRawMaterialCode: 'BPOM-RAW-99210-NIA',
    coaCompliancePct: 99.5,
  });

  // AI Chat State
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Halo! Saya **AI Procurement Intelligence Bot** (Gemini AI). Saya siap membantu analisis tren harga bahan baku kosmetik, audit kualifikasi CPKB/Halal vendor, simulasi Blanket Order, dan verifikasi Three-Way Matching.',
    },
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load Data
  const loadProcurementData = async () => {
    try {
      const resM = await fetch('/api/procurement/dashboard-metrics');
      const jsonM = await resM.json();
      if (jsonM.summary) setMetrics(jsonM.summary);

      const resPr = await fetch(`/api/procurement/purchase-requisitions?search=${encodeURIComponent(searchQuery)}`);
      const jsonPr = await resPr.json();
      if (jsonPr.data) setPurchaseRequisitions(jsonPr.data);

      const resRfq = await fetch('/api/procurement/rfqs');
      const jsonRfq = await resRfq.json();
      if (jsonRfq.data) setRfqs(jsonRfq.data);

      const resBpo = await fetch('/api/procurement/blanket-orders');
      const jsonBpo = await resBpo.json();
      if (jsonBpo.data) setBlanketOrders(jsonBpo.data);

      const resPo = await fetch('/api/procurement/purchase-orders');
      const jsonPo = await resPo.json();
      if (jsonPo.data) setPurchaseOrders(jsonPo.data);

      const resGrn = await fetch('/api/procurement/goods-receipts');
      const jsonGrn = await resGrn.json();
      if (jsonGrn.data) setGoodsReceipts(jsonGrn.data);

      const resInv = await fetch('/api/procurement/supplier-invoices');
      const jsonInv = await resInv.json();
      if (jsonInv.data) setSupplierInvoices(jsonInv.data);

      const resVend = await fetch('/api/procurement/vendor-performance');
      const jsonVend = await resVend.json();
      if (jsonVend.data) setVendorScores(jsonVend.data);

      const resAud = await fetch('/api/procurement/vendor-audits');
      const jsonAud = await resAud.json();
      if (jsonAud.data) setVendorAudits(jsonAud.data);

      const resAi = await fetch('/api/procurement/ai-insights');
      const jsonAi = await resAi.json();
      if (jsonAi.insights) setAiInsights(jsonAi.insights);
    } catch (err) {
      console.error('Failed loading procurement data:', err);
    }
  };

  useEffect(() => {
    loadProcurementData();
  }, [searchQuery]);

  // Handlers
  const handleCreatePr = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemSubtotal = newPr.quantityRequested * newPr.estimatedUnitPriceRp;
      const res = await fetch('/api/procurement/purchase-requisitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPr,
          totalBudgetRp: itemSubtotal,
          items: [
            {
              id: `prit-${Date.now()}`,
              itemCode: newPr.itemCode,
              itemName: newPr.itemName,
              category: 'Active Ingredient',
              quantityRequested: newPr.quantityRequested,
              unit: newPr.unit,
              estimatedUnitPriceRp: newPr.estimatedUnitPriceRp,
              subtotalRp: itemSubtotal,
              reason: newPr.reason,
            },
          ],
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewPrModal(false);
        loadProcurementData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePr = async (prId: string) => {
    try {
      const res = await fetch(`/api/procurement/purchase-requisitions/${prId}/approve`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.success) loadProcurementData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/procurement/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRfq),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewRfqModal(false);
        loadProcurementData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertRfqToPo = async (rfqId: string, supplierCode: string) => {
    try {
      const res = await fetch('/api/procurement/purchase-orders/convert-from-rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId, supplierCode }),
      });
      const json = await res.json();
      if (json.success) {
        loadProcurementData();
        setActiveTab('po');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallOffBpoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBpo) return;
    try {
      const res = await fetch('/api/procurement/blanket-orders/call-off', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bpoId: selectedBpo.id,
          releaseQtyKg: callOffForm.releaseQtyKg,
          warehouseCode: callOffForm.warehouseCode,
          deliveryDate: callOffForm.deliveryDate,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setShowCallOffModal(false);
        loadProcurementData();
        setActiveTab('po');
      } else {
        alert(json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleThreeWayMatch = async (invoiceId: string) => {
    try {
      const res = await fetch('/api/procurement/three-way-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      const json = await res.json();
      if (json.success) loadProcurementData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGrn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/procurement/goods-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poNumber: newGrn.poNumber,
          deliveryNoteNumber: newGrn.deliveryNoteNumber,
          receivedBy: newGrn.receivedBy,
          items: [
            {
              id: `grnit-${Date.now()}`,
              itemCode: 'RM-ACT-005',
              itemName: 'Alpha Arbutin Pure Powder Grade A',
              quantityReceived: newGrn.quantityReceived,
              batchNumber: newGrn.batchNumber,
              lotNumber: 'LOT-SUPP-991',
              manufactureDate: '2026-07-01',
              expiryDate: '2028-07-01',
              qcStatus: 'QC Hold',
              storageBin: 'BIN-QUARANTINE-01',
            },
          ],
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowNewGrnModal(false);
        loadProcurementData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/procurement/vendor-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditForm),
      });
      const json = await res.json();
      if (json.success) {
        setShowAuditModal(false);
        loadProcurementData();
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
      const res = await fetch('/api/procurement/ai-chat', {
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
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg">
                <ShoppingBag className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Purchasing & Procurement Enterprise
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 8 • CPKB & GMP Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Manajemen Pengadaan Bahan Baku & Kemasan Kosmetik: PR, RFQ Matrix, Blanket Order, PO Tracking, GRN Quarantine, 3-Way Match & Vendor Audit.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowNewPrModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>+ Buat PR Baru</span>
            </button>

            <button
              onClick={() => setShowNewRfqModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>+ Issue RFQ</span>
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span>+ Audit Vendor</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_procurement')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Bot className="h-4 w-4 text-amber-400" />
              <span>AI Procurement Bot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Pending PR Review</span>
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">{metrics?.pendingPrCount || 1} PR</p>
          <p className="text-[10px] text-slate-400">Total {metrics?.totalPrCount || 2} PR Terdaftar</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Nilai PO Aktif</span>
            <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-black font-mono text-indigo-300">
            Rp {((metrics?.activePoValueRp || 95182500) / 1000000).toFixed(1)}M
          </p>
          <p className="text-[10px] text-slate-400">{metrics?.totalPoCount || 1} Order Dalam Delivery</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Blanket Orders (BPO)</span>
            <Lock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-black font-mono text-amber-300">{metrics?.activeBpoCount || 2} Contract</p>
          <p className="text-[10px] text-amber-400 font-semibold">Harga Terkunci 1 Tahun</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Three-Way Match</span>
            <FileCheck className="h-3.5 w-3.5 text-teal-400" />
          </div>
          <p className="text-xl font-black font-mono text-teal-300">
            {metrics?.pendingThreeWayMatch === 0 ? '100% OK' : 'Pending'}
          </p>
          <p className="text-[10px] text-teal-400 font-semibold">PO = GRN = Invoice Matched</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Avg Vendor Score</span>
            <Award className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-black font-mono text-cyan-300">{metrics?.avgVendorScore || '95.8'}/100</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Class A Preferred Partner</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>CPKB Vendor Audit</span>
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-black font-mono text-purple-300">100% Valid</p>
          <p className="text-[10px] text-purple-400 font-semibold">CPKB & Halal LPPOM</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari PR, RFQ, PO, Invoice, Supplier, atau Material Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
          <Filter className="h-4 w-4 text-emerald-400" />
          <span>Status:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Dashboard & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('pr')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'pr'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Purchase Requisitions (PR)</span>
        </button>

        <button
          onClick={() => setActiveTab('rfq')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'rfq'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>RFQ & Supplier Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('blanket_orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'blanket_orders'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Blanket Orders (BPO)</span>
        </button>

        <button
          onClick={() => setActiveTab('po')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'po'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Purchase Orders & SLA</span>
        </button>

        <button
          onClick={() => setActiveTab('grn')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'grn'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Goods Receipt & QC Hold</span>
        </button>

        <button
          onClick={() => setActiveTab('invoice_matching')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'invoice_matching'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>3-Way Matching (AP)</span>
        </button>

        <button
          onClick={() => setActiveTab('vendor_score')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'vendor_score'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Vendor Audit & Scorecard</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_procurement')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'ai_procurement'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="h-4 w-4 text-amber-400" />
          <span>AI Procurement Copilot</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD & OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Alur Integrasi Flowchart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" /> Integrated Procurement Cycle (CPKB OEM Standard)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Strict Quality & Audit Trail</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-emerald-400 font-bold">1. Requisition</span>
                <p className="font-bold text-white">Purchase Requisition (PR)</p>
                <p className="text-[10px] text-slate-400">Diminta oleh R&D Formulater / Supervisor Produksi</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-indigo-400 font-bold">2. Sourcing</span>
                <p className="font-bold text-white">RFQ & Blanket Contract</p>
                <p className="text-[10px] text-slate-400">Komparasi multi-supplier & lock harga 12 bulan</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-bold">3. Ordering</span>
                <p className="font-bold text-white">Purchase Order (PO)</p>
                <p className="text-[10px] text-slate-400">Disetujui Manager & diterbitkan ke Supplier</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-teal-400 font-bold">4. Inbound QC</span>
                <p className="font-bold text-white">Goods Receipt (GRN)</p>
                <p className="text-[10px] text-slate-400">Diterima di Gudang & Karantina QC Micro Test</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-purple-400 font-bold">5. Finance AP</span>
                <p className="font-bold text-white">Three-Way Matching</p>
                <p className="text-[10px] text-slate-400">Validasi PO vs GRN vs Invoice sebelum Bayar</p>
              </div>
            </div>
          </div>

          {/* Quick Active Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" /> Status Purchase Requisitions Terbaru
                </h3>
                <button onClick={() => setActiveTab('pr')} className="text-xs text-emerald-400 font-bold hover:underline">
                  Lihat Semua →
                </button>
              </div>

              <div className="space-y-3">
                {purchaseRequisitions.slice(0, 3).map((pr) => (
                  <div key={pr.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-300">{pr.prNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {pr.status}
                      </span>
                    </div>
                    <p className="text-slate-300 font-bold">{pr.department} • {pr.requesterName}</p>
                    <p className="text-slate-400 text-[11px]">Budget: <span className="text-white font-mono">Rp {pr.totalBudgetRp.toLocaleString('id-ID')}</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-400" /> Kontrak Jangka Panjang (Blanket Orders)
                </h3>
                <button onClick={() => setActiveTab('blanket_orders')} className="text-xs text-amber-400 font-bold hover:underline">
                  Lihat Semua →
                </button>
              </div>

              <div className="space-y-3">
                {blanketOrders.map((bpo) => (
                  <div key={bpo.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-amber-300">{bpo.contractNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        {bpo.status}
                      </span>
                    </div>
                    <p className="text-slate-200 font-bold">{bpo.materialName}</p>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Harga Kontrak: Rp {bpo.contractedPricePerUnitRp.toLocaleString('id-ID')}/Kg</span>
                      <span>Sisa: {bpo.remainingQuantityKg} / {bpo.totalAgreedQuantityKg} Kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE REQUISITIONS (PR) */}
      {activeTab === 'pr' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" /> Daftar Purchase Requisitions (PR)
              </h3>
              <p className="text-xs text-slate-400">Permintaan Pembelian Bahan Baku & Packaging dari Tim Formulater / Production</p>
            </div>
            <button
              onClick={() => setShowNewPrModal(true)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Buat PR Baru
            </button>
          </div>

          <div className="space-y-3">
            {purchaseRequisitions.map((pr) => (
              <div key={pr.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-lg hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-black text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
                      {pr.prNumber}
                    </span>
                    <span className="text-xs font-bold text-white">{pr.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-mono">
                      {pr.costCenter}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {pr.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-400">Pemohon: <span className="text-slate-200 font-bold">{pr.requesterName}</span></p>
                    <p className="text-slate-400">Target Dibutuhkan: <span className="text-amber-300 font-mono font-bold">{pr.requiredDate}</span></p>
                    {pr.projectName && <p className="text-slate-400">Proyek Maklon: <span className="text-white font-bold">{pr.projectName}</span></p>}
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400">Estimasi Total Budget: <span className="text-emerald-300 font-mono font-bold">Rp {pr.totalBudgetRp.toLocaleString('id-ID')}</span></p>
                    <p className="text-slate-400">Approval Level: <span className="text-indigo-300 font-bold">{pr.approvalLevel}</span></p>
                  </div>
                </div>

                {/* Items Needed */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Daftar Material Dibutuhkan</span>
                  {pr.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-slate-300 border-b border-slate-800/60 pb-1.5 last:border-none last:pb-0">
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{it.itemCode}</span> - {it.itemName}
                        <p className="text-[10px] text-slate-400">Alasan: {it.reason}</p>
                      </div>
                      <div className="text-right font-mono font-bold text-white">
                        {it.quantityRequested} {it.unit} @ Rp {it.estimatedUnitPriceRp.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {pr.status === 'Submitted' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleApprovePr(pr.id)}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>Setujui (Approve PR)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RFQ & SUPPLIER MATRIX */}
      {activeTab === 'rfq' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-indigo-400" /> Request for Quotation (RFQ) & Supplier Comparative Matrix
              </h3>
              <p className="text-xs text-slate-400">Evaluasi Bobot Penawaran Harga, Lead Time, Quality Rating & Payment Terms</p>
            </div>
            <button
              onClick={() => setShowNewRfqModal(true)}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Issue RFQ Baru
            </button>
          </div>

          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-500/30">
                      {rfq.rfqNumber}
                    </span>
                    <span className="ml-3 text-xs text-white font-bold">• {rfq.itemName} ({rfq.quantityNeeded} Kg)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    {rfq.status}
                  </span>
                </div>

                {/* Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-2 px-3">Supplier Name</th>
                        <th className="py-2 px-3">Price / Unit</th>
                        <th className="py-2 px-3">Lead Time</th>
                        <th className="py-2 px-3">MOQ</th>
                        <th className="py-2 px-3">Payment Term</th>
                        <th className="py-2 px-3">Quality Score</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {rfq.supplierQuotes.map((q: any) => (
                        <tr key={q.supplierCode} className="hover:bg-slate-900 transition-all">
                          <td className="py-2.5 px-3 font-bold text-white">{q.supplierName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                            Rp {q.pricePerUnitRp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-300">{q.leadTimeDays} Hari</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{q.moqUnits} Kg</td>
                          <td className="py-2.5 px-3 font-mono text-cyan-300">{q.paymentTermDays} Hari (TOP)</td>
                          <td className="py-2.5 px-3 font-bold text-indigo-400">{q.qualityRatingScore}/100</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                q.status === 'Selected'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {q.status !== 'Selected' && (
                              <button
                                onClick={() => handleConvertRfqToPo(rfq.id, q.supplierCode)}
                                className="py-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow transition-all"
                              >
                                Pilih & Terbitkan PO
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BLANKET PURCHASE ORDERS (BPO) */}
      {activeTab === 'blanket_orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" /> Blanket Purchase Orders (Kontrak Pengadaan Jangka Panjang)
              </h3>
              <p className="text-xs text-slate-400">Penguncian Harga Diskon Multi-Batch 1 Tahun & Rilis Call-Off Order Bertahap</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blanketOrders.map((bpo) => {
              const percentReleased = Math.round((bpo.releasedQuantityKg / bpo.totalAgreedQuantityKg) * 100);
              return (
                <div key={bpo.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-xs font-black text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-500/30">
                        {bpo.contractNumber}
                      </span>
                      <p className="text-xs font-bold text-white mt-1">{bpo.supplierName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {bpo.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300">Material Contract: <span className="font-bold text-white">{bpo.materialName}</span> ({bpo.itemCode})</p>
                    <p className="text-slate-300">Harga Terkunci: <span className="font-mono font-bold text-emerald-300">Rp {bpo.contractedPricePerUnitRp.toLocaleString('id-ID')}/Kg</span></p>
                    <p className="text-slate-400 text-[11px]">Masa Berlaku: {bpo.validFrom} s/d {bpo.validTo}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Total Release Call-Off:</span>
                        <span className="font-bold text-amber-300">{bpo.releasedQuantityKg} / {bpo.totalAgreedQuantityKg} Kg ({percentReleased}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${percentReleased}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 text-right">Sisa Kontrak: <span className="font-bold text-white">{bpo.remainingQuantityKg} Kg</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBpo(bpo);
                      setShowCallOffModal(true);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>Terbitkan Call-off Order (Rilis Batch PO)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: PURCHASE ORDERS & SLA */}
      {activeTab === 'po' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShoppingBag className="h-4 w-4 text-emerald-400" /> Purchase Orders (Kontrak Resmi & Pipeline Pengiriman SLA)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. PO</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Incoterm & Trucking</th>
                  <th className="py-2.5 px-3">Nilai Total (inc. PPN)</th>
                  <th className="py-2.5 px-3">Target Delivery</th>
                  <th className="py-2.5 px-3">Status Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-900 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{po.poNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{po.supplierName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{po.incoterms} • {po.shippingMethod}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {po.grandTotalRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{po.expectedDeliveryDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: GOODS RECEIPT & QC HOLD */}
      {activeTab === 'grn' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-teal-400" /> Goods Receipt Note (GRN) & Karantina QC Inbound
              </h3>
              <p className="text-xs text-slate-400">Pencatatan Penerimaan Barang Gudang, Surat Jalan, Batch Number & Uji Mikrobiologi QC</p>
            </div>
            <button
              onClick={() => setShowNewGrnModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Catat GRN Baru
            </button>
          </div>

          <div className="space-y-3">
            {goodsReceipts.map((grn) => (
              <div key={grn.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950 px-2.5 py-1 rounded border border-teal-500/30">
                      {grn.grnNumber}
                    </span>
                    <span className="ml-3 text-xs font-bold text-white">• Ref PO: {grn.poNumber}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    QC Status: {grn.overallQcStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <p>Supplier: <span className="font-bold text-white">{grn.supplierName}</span></p>
                    <p>No. Surat Jalan: <span className="font-mono text-emerald-300">{grn.deliveryNoteNumber}</span></p>
                  </div>
                  <div>
                    <p>Penerima: <span className="font-bold text-white">{grn.receivedBy}</span></p>
                    <p>Lokasi Gudang: <span className="font-bold text-indigo-300">{grn.warehouseCode}</span></p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Batch & Lot Quarantined</span>
                  {grn.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-teal-400">{it.itemCode}</span> - {it.itemName}
                        <p className="text-[10px] text-slate-400">Batch: {it.batchNumber} | Bin Storage: {it.storageBin}</p>
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-300">
                        {it.quantityReceived} Kg
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: 3-WAY MATCHING */}
      {activeTab === 'invoice_matching' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCheck className="h-4 w-4 text-emerald-400" /> Three-Way Matching Verification (PO vs GRN vs Supplier Invoice)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Ref PO & GRN</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">PO Amount</th>
                  <th className="py-2.5 px-3">Invoice Amount</th>
                  <th className="py-2.5 px-3">3-Way Match</th>
                  <th className="py-2.5 px-3">Aksi AP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {supplierInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      <div>PO: {inv.poNumber}</div>
                      <div className="text-[10px] text-amber-300">GRN: {inv.grnNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{inv.supplierName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">Rp {inv.poAmountRp.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">Rp {inv.invoiceAmountRp.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {inv.threeWayMatchStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleThreeWayMatch(inv.id)}
                        className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow transition-all"
                      >
                        Verify Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: VENDOR AUDIT & SCORECARD */}
      {activeTab === 'vendor_score' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" /> Vendor Performance & Qualification Audit CPKB/Halal
              </h3>
              <p className="text-xs text-slate-400">Peringkat Vendor Class A/B/C, Audit Sertifikat Halal LPPOM & Registrasi BPOM Raw Material</p>
            </div>
            <button
              onClick={() => setShowAuditModal(true)}
              className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Audit Vendor Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendorScores.map((v) => (
              <div key={v.supplierCode} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">{v.supplierName}</h4>
                    <span className="font-mono text-[10px] text-slate-400">{v.supplierCode}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                    {v.tierCategory}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-sans">On-Time Delivery</p>
                    <p className="text-lg font-bold text-emerald-400">{v.onTimeDeliveryPct}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-sans">Quality Score</p>
                    <p className="text-lg font-bold text-indigo-400">{v.qualityScorePct}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-sans">Reject Rate</p>
                    <p className="text-lg font-bold text-rose-400">{v.rejectRatePct}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-sans">Overall Vendor Score</p>
                    <p className="text-lg font-bold text-amber-300">{v.overallVendorScore}/100</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: AI PROCUREMENT COPILOT */}
      {activeTab === 'ai_procurement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: AI Insights */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BrainCircuit className="h-4 w-4 text-emerald-400" /> AI Procurement Forecast & Reorder Optimizer
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Prediksi Harga Bahan Baku (30 Hari)
                    </h4>
                    {aiInsights?.priceForecast?.map((pf: any, idx: number) => (
                      <div key={idx} className="text-xs space-y-1 p-2 rounded bg-slate-950 border border-slate-800/80">
                        <p className="font-bold text-white">{pf.item}</p>
                        <p className="text-amber-300 font-bold">{pf.trend}</p>
                        <p className="text-[10px] text-slate-400 italic">{pf.suggestion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> Deteksi Safety Stock & Supplier Risk
                    </h4>
                    {aiInsights?.safetyStockOptimizations?.map((sso: any, idx: number) => (
                      <div key={idx} className="text-xs space-y-1 p-2 rounded bg-slate-950 border border-slate-800/80">
                        <p className="font-bold text-white">{sso.rawMaterial}</p>
                        <p className="text-slate-300">Stok Saat Ini: <span className="font-mono text-rose-400 font-bold">{sso.currentStockKg} Kg</span> (Rekomendasi Safety: {sso.recommendedSafetyStockKg} Kg)</p>
                        <p className="text-[10px] text-emerald-400 font-bold">{sso.actionRequired}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Gemini AI Chat Bot */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 flex flex-col justify-between h-[480px]">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Bot className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Gemini Procurement Bot</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
                {aiChatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl max-w-[90%] whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white ml-auto'
                        : 'bg-slate-900 text-slate-200 border border-slate-800'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {isAiLoading && <div className="text-xs text-slate-500 animate-pulse">Mengetik analisis...</div>}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Tanya harga Niacinamide, status vendor..."
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-110"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW PR */}
      {showNewPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" /> Buat Purchase Requisition (PR)
              </h3>
              <button onClick={() => setShowNewPrModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePr} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Material / Bahan Baku</label>
                <input
                  type="text"
                  required
                  value={newPr.itemName}
                  onChange={(e) => setNewPr({ ...newPr, itemName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={newPr.quantityRequested}
                    onChange={(e) => setNewPr({ ...newPr, quantityRequested: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Estimasi Harga Unit (Rp)</label>
                  <input
                    type="number"
                    value={newPr.estimatedUnitPriceRp}
                    onChange={(e) => setNewPr({ ...newPr, estimatedUnitPriceRp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Alasan Permintaan Pembelian</label>
                <textarea
                  rows={2}
                  value={newPr.reason}
                  onChange={(e) => setNewPr({ ...newPr, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Submit PR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW RFQ */}
      {showNewRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-indigo-400" /> Issue Request for Quotation (RFQ)
              </h3>
              <button onClick={() => setShowNewRfqModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Material / Kemasan</label>
                <input
                  type="text"
                  required
                  value={newRfq.itemName}
                  onChange={(e) => setNewRfq({ ...newRfq, itemName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kuantitas Dibutuhkan (Kg/Pcs)</label>
                  <input
                    type="number"
                    value={newRfq.quantityNeeded}
                    onChange={(e) => setNewRfq({ ...newRfq, quantityNeeded: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-indigo-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Batas Akhir Penawaran</label>
                  <input
                    type="date"
                    value={newRfq.deadlineDate}
                    onChange={(e) => setNewRfq({ ...newRfq, deadlineDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-amber-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Kirim RFQ ke Multi-Supplier
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CALL OFF BPO */}
      {showCallOffModal && selectedBpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ArrowDownToLine className="h-4 w-4 text-amber-400" /> Rilis Call-off Order (Blanket Contract)
              </h3>
              <button onClick={() => setShowCallOffModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCallOffBpoSubmit} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-bold text-amber-300 font-mono">{selectedBpo.contractNumber}</p>
                <p className="text-white font-bold">{selectedBpo.materialName}</p>
                <p className="text-slate-400">Harga Terkunci: Rp {selectedBpo.contractedPricePerUnitRp.toLocaleString('id-ID')}/Kg</p>
                <p className="text-slate-400">Sisa Kontrak: <span className="text-emerald-300 font-bold">{selectedBpo.remainingQuantityKg} Kg</span></p>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Kuantitas Batch Diterbitkan (Kg)</label>
                <input
                  type="number"
                  required
                  value={callOffForm.releaseQtyKg}
                  onChange={(e) => setCallOffForm({ ...callOffForm, releaseQtyKg: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-mono text-emerald-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Gudang Tujuan Penerimaan</label>
                <input
                  type="text"
                  value={callOffForm.warehouseCode}
                  onChange={(e) => setCallOffForm({ ...callOffForm, warehouseCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-bold text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-black text-slate-950 shadow-md transition-all mt-4"
              >
                Terbitkan PO Call-Off Bertahap
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW GRN */}
      {showNewGrnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal-400" /> Catat Goods Receipt Note (GRN)
              </h3>
              <button onClick={() => setShowNewGrnModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrn} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">No. Surat Jalan Supplier</label>
                <input
                  type="text"
                  required
                  value={newGrn.deliveryNoteNumber}
                  onChange={(e) => setNewGrn({ ...newGrn, deliveryNoteNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newGrn.batchNumber}
                    onChange={(e) => setNewGrn({ ...newGrn, batchNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-amber-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Jumlah Diterima (Kg)</label>
                  <input
                    type="number"
                    value={newGrn.quantityReceived}
                    onChange={(e) => setNewGrn({ ...newGrn, quantityReceived: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan GRN & Masukkan ke Karantina QC
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VENDOR AUDIT */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" /> Input Hasil Audit Vendor CPKB & Halal
              </h3>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAuditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Supplier</label>
                <input
                  type="text"
                  required
                  value={auditForm.supplierName}
                  onChange={(e) => setAuditForm({ ...auditForm, supplierName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Status CPKB / GMP</label>
                  <select
                    value={auditForm.gmpCpkbStatus}
                    onChange={(e) => setAuditForm({ ...auditForm, gmpCpkbStatus: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-bold text-white"
                  >
                    <option value="CPKB / GMP Certified">CPKB / GMP Certified</option>
                    <option value="ISO 22716 Certified">ISO 22716 Certified</option>
                    <option value="Under Audit">Under Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Status Halal LPPOM</label>
                  <select
                    value={auditForm.halalStatus}
                    onChange={(e) => setAuditForm({ ...auditForm, halalStatus: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 font-bold text-white"
                  >
                    <option value="Halal LPPOM MUI Certified">Halal Certified</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Non-Halal">Non-Halal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Hasil Audit & Update Kualifikasi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
