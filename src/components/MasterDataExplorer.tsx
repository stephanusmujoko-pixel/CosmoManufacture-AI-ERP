import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  FlaskConical,
  Truck,
  Users,
  Cpu,
  Warehouse,
  Hash,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Tag,
  FileText,
  Layers,
  Settings,
  RefreshCw,
  Eye,
  Trash2,
  Edit3,
  Sliders,
  Check,
  X,
  ChevronRight,
  BarChart3,
  HardDrive,
  CheckSquare,
} from 'lucide-react';

export const MasterDataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'raw_materials' | 'suppliers' | 'customers' | 'machines' | 'warehouses' | 'doc_numbering' | 'approval_custom' | 'audit_import'
  >('overview');

  // Master Data State from Backend
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [docFormats, setDocFormats] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddRmModal, setShowAddRmModal] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({
    sku: '',
    productName: '',
    brand: 'BeautyGlow Cosmetics',
    category: 'Skincare - Facial Serum',
    type: 'Finished Goods',
    formulaCode: 'FORM-SER-2026',
    netto: '30 ml',
    bpomNumber: 'NA18240199000',
  });

  const [newRm, setNewRm] = useState({
    code: '',
    name: '',
    scientificName: '',
    casNumber: '',
    category: 'Active Ingredient',
    supplierName: 'PT DSM Nutritional Products Indonesia',
    pricePerKgRp: 150000,
    safetyStockKg: 100,
  });

  // Auto Numbering Gen State
  const [selectedDocType, setSelectedDocType] = useState('MO');
  const [generatedDocNum, setGeneratedDocNum] = useState<string | null>(null);

  // Load Data from Backend
  const loadMasterData = async () => {
    try {
      const resMetrics = await fetch('/api/dashboard-metrics');
      const jsonMetrics = await resMetrics.json();
      if (jsonMetrics.summary) setMetrics(jsonMetrics.summary);

      const resProd = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const jsonProd = await resProd.json();
      if (jsonProd.data) setProducts(jsonProd.data);

      const resRm = await fetch(`/api/raw-materials?search=${encodeURIComponent(searchQuery)}`);
      const jsonRm = await resRm.json();
      if (jsonRm.data) setRawMaterials(jsonRm.data);

      const resSup = await fetch('/api/suppliers');
      const jsonSup = await resSup.json();
      if (jsonSup.data) setSuppliers(jsonSup.data);

      const resCust = await fetch('/api/customers');
      const jsonCust = await resCust.json();
      if (jsonCust.data) setCustomers(jsonCust.data);

      const resMach = await fetch('/api/machines');
      const jsonMach = await resMach.json();
      if (jsonMach.data) setMachines(jsonMach.data);

      const resWh = await fetch('/api/warehouses');
      const jsonWh = await resWh.json();
      if (jsonWh.data) setWarehouses(jsonWh.data);

      const resDoc = await fetch('/api/document-numbering');
      const jsonDoc = await resDoc.json();
      if (jsonDoc.data) setDocFormats(jsonDoc.data);

      const resAudit = await fetch('/api/audit-logs');
      const jsonAudit = await resAudit.json();
      if (jsonAudit.data) setAuditLogs(jsonAudit.data);
    } catch (err) {
      console.error('Failed fetching Master Data:', err);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, [searchQuery]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddProductModal(false);
        setNewProduct({
          sku: '',
          productName: '',
          brand: 'BeautyGlow Cosmetics',
          category: 'Skincare - Facial Serum',
          type: 'Finished Goods',
          formulaCode: 'FORM-SER-2026',
          netto: '30 ml',
          bpomNumber: 'NA18240199000',
        });
        loadMasterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/raw-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRm),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddRmModal(false);
        setNewRm({
          code: '',
          name: '',
          scientificName: '',
          casNumber: '',
          category: 'Active Ingredient',
          supplierName: 'PT DSM Nutritional Products Indonesia',
          pricePerKgRp: 150000,
          safetyStockKg: 100,
        });
        loadMasterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateDocNumber = async () => {
    try {
      const res = await fetch('/api/document-numbering/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: selectedDocType }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedDocNum(json.generatedNumber);
        loadMasterData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <DatabaseIcon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Prompt 6 — Master Data Enterprise (Foundation of All Business Modules)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Fondasi Terstandarisasi Seluruh Transaksi ERP: Product Master (Kosmetik/Skincare), Raw Materials (CAS/MSDS/COA), Suppliers (AVL), Customers, CPKB Machines, FEFO Warehouses, Document Auto-Numbering Engine, & Audit Trail.
          </p>
        </div>

        {/* Global Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari Master Code, SKU, CAS, BPOM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-extrabold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Master Data Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          💄 Product Master (FG/Semi/Samples)
        </button>
        <button
          onClick={() => setActiveTab('raw_materials')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'raw_materials'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🧪 Raw Materials (CAS / MSDS / COA)
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'suppliers'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🚚 Approved Suppliers (AVL)
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'customers'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏢 Customers & Maklon Clients
        </button>
        <button
          onClick={() => setActiveTab('machines')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'machines'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚙️ CPKB Machinery & Lines
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'warehouses'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏭 Warehouse, Zones & Bins
        </button>
        <button
          onClick={() => setActiveTab('doc_numbering')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'doc_numbering'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🔢 Document Auto-Numbering Engine
        </button>
        <button
          onClick={() => setActiveTab('approval_custom')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'approval_custom'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Approval Workflows & Custom Fields
        </button>
        <button
          onClick={() => setActiveTab('audit_import')}
          className={`pb-3 px-4 whitespace-nowrap transition-all ${
            activeTab === 'audit_import'
              ? 'border-b-2 border-emerald-400 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📜 Audit Logs & Import/Export
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-400" /> Master Produk
              </span>
              <p className="text-2xl font-extrabold text-emerald-300 font-mono">{metrics?.totalProducts || 3} SKU</p>
              <p className="text-[10px] text-slate-400">Terdaftar e-BPOM & Halal</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-teal-400" /> Raw Materials
              </span>
              <p className="text-2xl font-extrabold text-teal-300 font-mono">{metrics?.totalRawMaterials || 4} Item</p>
              <p className="text-[10px] text-slate-400">Memiliki MSDS & CAS Number</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-400" /> Approved Suppliers
              </span>
              <p className="text-2xl font-extrabold text-amber-300 font-mono">{metrics?.totalSuppliers || 3} Vendor</p>
              <p className="text-[10px] text-slate-400">100% Quality Audited</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" /> CPKB Machinery
              </span>
              <p className="text-2xl font-extrabold text-indigo-300 font-mono">{metrics?.totalMachines || 2} Mesin</p>
              <p className="text-[10px] text-slate-400">Class C Cleanroom Primary</p>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Status Kepatuhan Regulasi Kosmetik (CPKB Class A)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Izin Edar BPOM (e-BPOM System)</span>
                  <span className="text-emerald-400 font-mono font-bold">100% Valid Active</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Sertifikasi Halal MUI / BPJPH</span>
                  <span className="text-emerald-400 font-mono font-bold">ID00410000288100521</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">ISO 22716 Good Manufacturing Practice</span>
                  <span className="text-emerald-400 font-mono font-bold">Certified Audit Pass</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Hash className="h-4 w-4 text-amber-400" /> Engine Penomoran Dokumen & Log Audit Realtime
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Aturan Penomoran Dokumen Aktif</span>
                  <span className="text-amber-300 font-mono font-bold">{metrics?.totalDocumentRules || 4} Rule Format</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-bold">Total Rekaman Audit Trail ERP</span>
                  <span className="text-amber-300 font-mono font-bold">{metrics?.totalAuditLogs || 2} Log Activity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MASTER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-400" /> Master Produk Kosmetik & Skincare (Finished & Semi-Finished)
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Tambah Product Master Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">SKU / Code</th>
                  <th className="py-2.5 px-3">Nama Produk & Variant</th>
                  <th className="py-2.5 px-3">Brand & Category</th>
                  <th className="py-2.5 px-3">No. BPOM & Expiry</th>
                  <th className="py-2.5 px-3">Specs (Netto/pH/Visc)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="font-bold text-emerald-400">{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.productCode}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-100">{p.productName}</div>
                      <div className="text-[10px] text-slate-400">Formula: {p.formulaCode} (v{p.formulaVersion})</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-amber-300">{p.brand}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-teal-300 font-bold">{p.bpomNumber}</div>
                      <div className="text-[10px] text-slate-400">Exp: {p.bpomExpiry}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300">
                      <div>Netto: {p.netto} | Target pH: {p.targetPh}</div>
                      <div className="text-slate-400 text-[10px]">Viskositas: {p.viscosityCps}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RAW MATERIALS */}
      {activeTab === 'raw_materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-teal-400" /> Database Bahan Baku Kosmetik (INCI Name, CAS, MSDS & COA)
            </h3>
            <button
              onClick={() => setShowAddRmModal(true)}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Mendaftarkan Raw Material Baru
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode & INCI Name</th>
                  <th className="py-2.5 px-3">CAS No. & Scientific Name</th>
                  <th className="py-2.5 px-3">Kategori & Grade</th>
                  <th className="py-2.5 px-3">Supplier Utama</th>
                  <th className="py-2.5 px-3">Harga / Kg</th>
                  <th className="py-2.5 px-3">Safety Stock</th>
                  <th className="py-2.5 px-3">Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {rawMaterials.map((rm) => (
                  <tr key={rm.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-teal-400">{rm.code}</div>
                      <div className="font-bold text-slate-100">{rm.name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-amber-300">{rm.casNumber}</div>
                      <div className="text-[10px] text-slate-400 italic">{rm.scientificName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {rm.category}
                      </span>
                      <div className="text-[10px] text-slate-400">{rm.grade} ({rm.purityPercentage}%)</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{rm.supplierName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {rm.pricePerKgRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {rm.safetyStockKg} Kg
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-mono text-slate-400">
                      <div>MSDS: <span className="text-emerald-400">Verified</span></div>
                      <div>COA: <span className="text-emerald-400">Pass</span></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Truck className="h-4 w-4 text-amber-400" /> Daftar Pemasok Terverifikasi Approved Vendor List (AVL)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Vendor</th>
                  <th className="py-2.5 px-3">Nama Perusahaan & Brand</th>
                  <th className="py-2.5 px-3">Kontak PIC & Email</th>
                  <th className="py-2.5 px-3">Term Pembayaran</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Status Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{s.supplierCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{s.companyName}</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{s.picName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{s.paymentTermDays} Hari</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">{s.qualityScorePct}% Pass</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        APPROVED AVL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="h-4 w-4 text-indigo-400" /> Database Pelanggan & Klien Brand Maklon Kosmetik
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Klien</th>
                  <th className="py-2.5 px-3">Nama Perusahaan Maklon</th>
                  <th className="py-2.5 px-3">Brand Klien</th>
                  <th className="py-2.5 px-3">Kontak PIC</th>
                  <th className="py-2.5 px-3">Credit Limit (Rp)</th>
                  <th className="py-2.5 px-3">Grup Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{c.customerCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{c.companyName}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{c.brandName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{c.picName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                      Rp {c.creditLimitRp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {c.priceGroup}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: MACHINES */}
      {activeTab === 'machines' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="h-4 w-4 text-indigo-400" /> Master Mesin & Line Produksi CPKB Cleanroom
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Mesin</th>
                  <th className="py-2.5 px-3">Nama Mesin & Kategori</th>
                  <th className="py-2.5 px-3">Cleanroom Grade</th>
                  <th className="py-2.5 px-3">Kapasitas / Jam</th>
                  <th className="py-2.5 px-3">Tgl Kalibrasi</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{m.machineCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">{m.machineName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {m.cleanroomGrade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-300 font-bold">{m.capacityKgOrPcsPerHour} Unit/Hr</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{m.lastCalibrationDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: WAREHOUSES */}
      {activeTab === 'warehouses' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Warehouse className="h-4 w-4 text-emerald-400" /> Master Gudang, Zona, Rak & Lokasi Bin (FEFO Tracking)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">Kode Gudang</th>
                  <th className="py-2.5 px-3">Nama Gudang & Lokasi Bin</th>
                  <th className="py-2.5 px-3">Tipe Storage</th>
                  <th className="py-2.5 px-3">Limit Suhu / Kelembaban</th>
                  <th className="py-2.5 px-3">Kapasitas Pallet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {warehouses.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{w.warehouseCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-100">
                      <div>{w.warehouseName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {w.zoneCode} &rarr; {w.rackNumber} &rarr; {w.binLocation}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {w.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {w.tempMinC}°C - {w.tempMaxC}°C (RH &lt; {w.humidityMaxPct}%)
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-100">{w.capacityPallets} Pallets</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: DOCUMENT NUMBERING ENGINE */}
      {activeTab === 'doc_numbering' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Hash className="h-4 w-4 text-amber-400" /> Generator Penomoran Dokumen Otomatis ERP
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Pilih Jenis Dokumen</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-amber-300"
                >
                  <option value="MO">Manufacturing Order (MO)</option>
                  <option value="Batch">Batch Number Production</option>
                  <option value="COA">Certificate of Analysis (COA)</option>
                  <option value="PO">Purchase Order (PO)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateDocNumber}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-white transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Generate Nomor Dokumen Berikutnya
              </button>

              {generatedDocNum && (
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hasil Penomoran Baru:</span>
                  <div className="text-lg font-mono font-extrabold text-amber-300">{generatedDocNum}</div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="h-4 w-4 text-teal-400" /> Rule Sequence Terdaftar
            </h3>
            <div className="space-y-2 text-xs">
              {docFormats.map((f) => (
                <div key={f.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-teal-300">{f.docType}</span>
                    <span className="font-mono text-slate-400 text-[10px]">Seq: #{f.currentSequence}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-200">{f.sampleResult}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: APPROVAL & CUSTOM FIELDS */}
      {activeTab === 'approval_custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-emerald-400" /> Multi-Level Approval Workflow
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200">Approval Formula Spesifikasi R&D</span>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">Step 1</span>
                    <span>Review Formulator R&D Specialist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">Step 2</span>
                    <span>Sign Off Apoteker Penanggung Jawab BPOM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Tag className="h-4 w-4 text-amber-400" /> Tenant Custom Fields Config
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">Target pH Range Custom Field</span>
                <p className="text-[11px] text-slate-400">Field spesifik kosmetik untuk menguji keasaman formulasi.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: AUDIT LOGS & IMPORT/EXPORT */}
      {activeTab === 'audit_import' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="h-4 w-4 text-emerald-400" /> Rekaman Audit Trail (Keamanan Data & Compliance)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Pengguna</th>
                    <th className="py-2.5 px-3">Aksi</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Detail Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">{log.userName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-300">{log.entityType}</td>
                      <td className="py-2.5 px-3 text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" /> Tambah Master Produk Baru
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">SKU Unique</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKU-FG-SER-03"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-emerald-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barrier Defense Cream 50ml"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">No. e-BPOM</label>
                  <input
                    type="text"
                    value={newProduct.bpomNumber}
                    onChange={(e) => setNewProduct({ ...newProduct, bpomNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-teal-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RAW MATERIAL */}
      {showAddRmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal-400" /> Tambah Bahan Baku Kosmetik Baru
              </h3>
              <button onClick={() => setShowAddRmModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Kode Material</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RM-ACT-005"
                    value={newRm.code}
                    onChange={(e) => setNewRm({ ...newRm, code: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-teal-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">CAS Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 98-92-0"
                    value={newRm.casNumber}
                    onChange={(e) => setNewRm({ ...newRm, casNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nama Bahan (INCI Trade Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sodium Hyaluronate High Molecular"
                  value={newRm.name}
                  onChange={(e) => setNewRm({ ...newRm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-bold text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Harga Estimasi per Kg (Rp)</label>
                <input
                  type="number"
                  value={newRm.pricePerKgRp}
                  onChange={(e) => setNewRm({ ...newRm, pricePerKgRp: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-emerald-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-md transition-all mt-4"
              >
                Simpan Master Raw Material
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon
function DatabaseIcon(props: any) {
  return <Building2 {...props} />;
}
