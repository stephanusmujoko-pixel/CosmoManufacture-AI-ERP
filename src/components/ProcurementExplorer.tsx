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
} from 'lucide-react';

export const ProcurementExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'pr' | 'rfq' | 'po' | 'grn' | 'invoice_matching' | 'vendor_score' | 'ai_procurement'
  >('dashboard');

  // Backend Data
  const [metrics, setMetrics] = useState<any>(null);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<any[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<any[]>([]);
  const [vendorScores, setVendorScores] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showNewPrModal, setShowNewPrModal] = useState(false);
  const [showNewGrnModal, setShowNewGrnModal] = useState(false);

  // Forms
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
    reason: 'Kebutuhan formulasi batch baru Whitening Night Cream.',
  });

  const [newGrn, setNewGrn] = useState({
    poNumber: 'PO/CPKB/2026/08/0045',
    deliveryNoteNumber: 'SJ-SUPP-202608-88',
    receivedBy: 'Budi Santoso (Warehouse Supervisor)',
    batchNumber: 'BN-20260806-ARB',
    quantityReceived: 100,
  });

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Prompt 8 — Purchasing & Procurement Enterprise (B2B Cosmetic OEM)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Sistem Pengadaan Bahan Baku & Kemasan Kosmetik CPKB: PR, RFQ, Supplier Comparison, PO, Goods Receipt (GRN & QC Hold), Three-Way Matching & Vendor Scoring.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari PR, RFQ, PO, Invoice, Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Dashboard Procurement
        </button>
        <button
          onClick={() => setActiveTab('pr')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'pr'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📋 Purchase Requisitions (PR)
        </button>
        <button
          onClick={() => setActiveTab('rfq')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'rfq'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📩 RFQ & Supplier Comparison
        </button>
        <button
          onClick={() => setActiveTab('po')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'po'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📜 Purchase Orders (PO)
        </button>
        <button
          onClick={() => setActiveTab('grn')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'grn'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚚 Goods Receipt (GRN & QC Hold)
        </button>
        <button
          onClick={() => setActiveTab('invoice_matching')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'invoice_matching'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🧾 Three-Way Matching (PO-GRN-Invoice)
        </button>
        <button
          onClick={() => setActiveTab('vendor_score')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'vendor_score'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⭐ Vendor Performance & Scorecard
        </button>
        <button
          onClick={() => setActiveTab('ai_procurement')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'ai_procurement'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🤖 AI Procurement Intelligence
        </button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-400" /> Pending PR Review
              </span>
              <p className="text-2xl font-extrabold text-emerald-300 font-mono">
                {metrics?.pendingPrCount || 1} PR
              </p>
              <p className="text-[10px] text-slate-400">Total {metrics?.totalPrCount || 2} Permintaan Pembelian</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-indigo-400" /> Total Nilai PO Aktif
              </span>
              <p className="text-2xl font-extrabold text-indigo-300 font-mono">
                Rp {((metrics?.activePoValueRp || 95182500) / 1000000).toFixed(1)}M
              </p>
              <p className="text-[10px] text-slate-400">{metrics?.totalPoCount || 1} PO Dalam Pengiriman</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" /> Three-Way Match Status
              </span>
              <p className="text-2xl font-extrabold text-amber-300 font-mono">
                {metrics?.pendingThreeWayMatch === 0 ? '100% Matched' : 'Pending Review'}
              </p>
              <p className="text-[10px] text-slate-400">PO vs GRN vs Invoice Verified</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-teal-400" /> Avg Vendor Score
              </span>
              <p className="text-2xl font-extrabold text-teal-300 font-mono">
                {metrics?.avgVendorScore || '95.8'}/100
              </p>
              <p className="text-[10px] text-slate-400">Class A Preferred Partner Tier</p>
            </div>
          </div>

          {/* Quick Action & Flow */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" /> Alur Integrasi Siklus Pengadaan Manufaktur (Procurement Cycle)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200">1. Requisition (PR)</span>
                <p className="text-[10px] text-slate-400 mt-1">R&D / Production Request</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200">2. RFQ & Comparison</span>
                <p className="text-[10px] text-slate-400 mt-1">Multi-Supplier Quote</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200">3. Purchase Order (PO)</span>
                <p className="text-[10px] text-slate-400 mt-1">Approved Contract</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200">4. Goods Receipt & QC</span>
                <p className="text-[10px] text-slate-400 mt-1">Quarantine Inspection</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-200">5. 3-Way Matching</span>
                <p className="text-[10px] text-slate-400 mt-1">Finance AP Validation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE REQUISITIONS */}
      {activeTab === 'pr' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" /> Permintaan Pembelian (Purchase Requisitions)
            </h3>
            <button
              onClick={() => setShowNewPrModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Buat PR Baru
            </button>
          </div>

          <div className="space-y-3">
            {purchaseRequisitions.map((pr) => (
              <div key={pr.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">{pr.prNumber}</span>
                    <span className="ml-2 text-xs font-bold text-slate-200">• {pr.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      Cost Center: {pr.costCenter}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {pr.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Pemohon: <span className="text-slate-200 font-bold">{pr.requesterName}</span></p>
                    <p className="text-slate-400">Target Dibutuhkan: <span className="text-amber-300 font-mono font-bold">{pr.requiredDate}</span></p>
                    {pr.projectName && <p className="text-slate-400">Proyek: <span className="text-slate-200">{pr.projectName}</span></p>}
                  </div>
                  <div>
                    <p className="text-slate-400">Estimasi Total Budget: <span className="text-emerald-300 font-mono font-bold">Rp {pr.totalBudgetRp.toLocaleString('id-ID')}</span></p>
                    <p className="text-slate-400">Approval Level: <span className="text-indigo-300 font-bold">{pr.approvalLevel}</span></p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Daftar Item Dibutuhkan</span>
                  {pr.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-slate-300">
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{it.itemCode}</span> - {it.itemName}
                        <div className="text-[10px] text-slate-400">Alasan: {it.reason}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-200">
                        {it.quantityRequested} {it.unit} @ Rp {it.estimatedUnitPriceRp.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {pr.status === 'Submitted' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleApprovePr(pr.id)}
                      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                    >
                      Setujui (Approve PR)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RFQ & SUPPLIER COMPARISON */}
      {activeTab === 'rfq' && (
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-400" /> Request for Quotation (RFQ) & Comparative Supplier Matrix
          </h3>

          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400">{rfq.rfqNumber}</span>
                    <span className="ml-2 text-xs text-slate-300 font-bold">• {rfq.itemName} ({rfq.quantityNeeded} Kg)</span>
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
                        <th className="py-2 px-3">Nama Supplier</th>
                        <th className="py-2 px-3">Harga / Unit</th>
                        <th className="py-2 px-3">Lead Time</th>
                        <th className="py-2 px-3">MOQ</th>
                        <th className="py-2 px-3">Quality Score</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {rfq.supplierQuotes.map((q: any) => (
                        <tr key={q.supplierCode} className="hover:bg-slate-800/50 transition-all">
                          <td className="py-2.5 px-3 font-bold text-slate-100">{q.supplierName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                            Rp {q.pricePerUnitRp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-300">{q.leadTimeDays} Hari</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{q.moqUnits} Kg</td>
                          <td className="py-2.5 px-3 font-bold text-indigo-400">{q.qualityRatingScore}/100</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.status === 'Selected'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
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

      {/* TAB 4: PURCHASE ORDERS */}
      {activeTab === 'po' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShoppingBag className="h-4 w-4 text-emerald-400" /> Purchase Orders (Kontrak Resmi Pembelian)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">No. PO</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Incoterm & Shipping</th>
                  <th className="py-2.5 px-3">Nilai Total (inc. PPN)</th>
                  <th className="py-2.5 px-3">Target Tiba</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{po.poNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{po.supplierName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{po.incoterms} • {po.shippingMethod}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {po.grandTotalRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">{po.expectedDeliveryDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
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

      {/* TAB 5: GOODS RECEIPT & QC */}
      {activeTab === 'grn' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-400" /> Penerimaan Barang Gudang (Goods Receipt Note & QC Hold)
            </h3>
            <button
              onClick={() => setShowNewGrnModal(true)}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Catat Penerimaan Barang
            </button>
          </div>

          <div className="space-y-3">
            {goodsReceipts.map((grn) => (
              <div key={grn.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{grn.grnNumber}</span>
                    <span className="ml-2 text-xs font-bold text-slate-200">• Ref PO: {grn.poNumber}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-500/30">
                    QC Status: {grn.overallQcStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <p>Supplier: <span className="font-bold text-slate-100">{grn.supplierName}</span></p>
                    <p>No. Surat Jalan: <span className="font-mono text-emerald-300">{grn.deliveryNoteNumber}</span></p>
                  </div>
                  <div>
                    <p>Penerima: <span className="font-bold text-slate-100">{grn.receivedBy}</span></p>
                    <p>Lokasi: <span className="font-bold text-indigo-300">{grn.warehouseCode}</span></p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Batch & Lot Quarantined</span>
                  {grn.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-amber-400">{it.itemCode}</span> - {it.itemName}
                        <div className="text-[10px] text-slate-400">Batch: {it.batchNumber} | Bin: {it.storageBin}</div>
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

      {/* TAB 6: THREE WAY MATCHING */}
      {activeTab === 'invoice_matching' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCheck className="h-4 w-4 text-emerald-400" /> Verification 3-Way Matching (PO vs GRN vs Supplier Invoice)
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
                  <th className="py-2.5 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {supplierInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      <div>PO: {inv.poNumber}</div>
                      <div className="text-[10px] text-amber-300">GRN: {inv.grnNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{inv.supplierName}</td>
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

      {/* TAB 7: VENDOR SCORECARDS */}
      {activeTab === 'vendor_score' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorScores.map((v) => (
            <div key={v.supplierCode} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{v.supplierName}</h4>
                  <span className="font-mono text-[10px] text-slate-400">{v.supplierCode}</span>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {v.tierCategory}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-sans">On-Time Delivery</p>
                  <p className="text-lg font-bold text-emerald-400">{v.onTimeDeliveryPct}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-sans">Quality Score</p>
                  <p className="text-lg font-bold text-indigo-400">{v.qualityScorePct}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-sans">Reject Rate</p>
                  <p className="text-lg font-bold text-rose-400">{v.rejectRatePct}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-sans">Overall Vendor Score</p>
                  <p className="text-lg font-bold text-amber-300">{v.overallVendorScore}/100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: AI PROCUREMENT INTELLIGENCE */}
      {activeTab === 'ai_procurement' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <BrainCircuit className="h-4 w-4 text-emerald-400" /> AI Procurement Price Forecasting & Safety Stock Optimizer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Prediksi Tren Harga Bahan Baku
                </h4>
                {aiInsights?.priceForecast?.map((pf: any, idx: number) => (
                  <div key={idx} className="text-xs space-y-1">
                    <p className="font-bold text-slate-200">{pf.item}</p>
                    <p className="text-amber-300 font-bold">{pf.trend}</p>
                    <p className="text-[10px] text-slate-400 italic">{pf.suggestion}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> Deteksi Vendor & Safety Stock Alert
                </h4>
                {aiInsights?.safetyStockOptimizations?.map((sso: any, idx: number) => (
                  <div key={idx} className="text-xs space-y-1">
                    <p className="font-bold text-slate-200">{sso.rawMaterial}</p>
                    <p className="text-slate-300">Stok Saat Ini: <span className="font-mono text-rose-400 font-bold">{sso.currentStockKg} Kg</span> (Rekomendasi Safety: {sso.recommendedSafetyStockKg} Kg)</p>
                    <p className="text-[10px] text-emerald-400 font-bold">{sso.actionRequired}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW PR */}
      {showNewPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
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
                <label className="block font-bold text-slate-400 mb-1">Nama Item / Bahan Baku</label>
                <input
                  type="text"
                  required
                  value={newPr.itemName}
                  onChange={(e) => setNewPr({ ...newPr, itemName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={newPr.quantityRequested}
                    onChange={(e) => setNewPr({ ...newPr, quantityRequested: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Estimasi Harga Per Unit (Rp)</label>
                  <input
                    type="number"
                    value={newPr.estimatedUnitPriceRp}
                    onChange={(e) => setNewPr({ ...newPr, estimatedUnitPriceRp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Alasan Permintaan Pembelian</label>
                <textarea
                  rows={2}
                  value={newPr.reason}
                  onChange={(e) => setNewPr({ ...newPr, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200"
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

      {/* MODAL: NEW GRN */}
      {showNewGrnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" /> Catat Penerimaan Barang (GRN)
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Batch Number Supplier</label>
                  <input
                    type="text"
                    value={newGrn.batchNumber}
                    onChange={(e) => setNewGrn({ ...newGrn, batchNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-amber-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Jumlah Diterima (Kg)</label>
                  <input
                    type="number"
                    value={newGrn.quantityReceived}
                    onChange={(e) => setNewGrn({ ...newGrn, quantityReceived: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan GRN & Masukkan ke QC Quarantine
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
