import React, { useState } from 'react';
import {
  Boxes,
  BoxesIcon,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Bot,
  FileText,
  DollarSign,
  PieChart,
  BarChart3,
  Scale,
  Zap,
  Tag,
  Truck,
  Scan,
  ShieldCheck,
  ChevronRight,
  Database,
  Calculator,
  ArrowLeftRight,
  Package,
  ListFilter,
  HelpCircle,
  Building2,
  Lock,
} from 'lucide-react';
import { formatCurrencyIDR } from '../lib/utils';

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  inciName?: string;
  category:
    | 'Raw Material'
    | 'Active Ingredient'
    | 'Inactive Ingredient'
    | 'Packaging Material'
    | 'Semi Finished'
    | 'Finished Goods'
    | 'Work In Process (WIP)'
    | 'Consumable'
    | 'Chemical & Lab';
  primaryUom: 'Kg' | 'Gram' | 'Liter' | 'Pcs' | 'Bottle' | 'Drum';
  secondaryUom?: string;
  totalStockQty: number;
  availableStockQty: number;
  reservedStockQty: number;
  onOrderQty: number;
  qcHoldQty: number;
  quarantineQty: number;
  safetyStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  eoqKg: number;
  abcClass: 'A' | 'B' | 'C';
  xyzClass: 'X' | 'Y' | 'Z';
  valuationMethod: 'FEFO' | 'FIFO' | 'Moving Average' | 'Standard Cost';
  unitCostIDR: number;
  totalAssetValueIDR: number;
  lastPurchaseDate: string;
  supplierName: string;
  status: 'In Stock' | 'Low Stock' | 'Overstock' | 'Out of Stock' | 'QC Hold';
}

export interface BatchLotRecord {
  id: string;
  itemSku: string;
  itemName: string;
  batchSupplier: string;
  internalLotNumber: string;
  manufactureDate: string;
  expiryDate: string;
  retestDate: string;
  coaRef: string;
  msdsRef: string;
  currentStockQty: number;
  warehouseLocation: string;
  inspectionStatus: 'QC Released' | 'QC Hold' | 'Quarantine' | 'Rejected';
  daysToExpiry: number;
}

export interface InventoryTransaction {
  id: string;
  txnNumber: string;
  txnType:
    | 'Goods Receipt (GRN)'
    | 'Material Issue (WO)'
    | 'Production Receipt (FG)'
    | 'Warehouse Transfer'
    | 'Stock Adjustment'
    | 'Sampling QC'
    | 'Sales Shipment';
  itemName: string;
  batchLot: string;
  qty: number;
  uom: string;
  sourceLocation: string;
  targetLocation: string;
  valuationCostIDR: number;
  timestamp: string;
  user: string;
}

export const InventoryExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'stock_balance' | 'batch_lot' | 'expiry_fefo' | 'abc_safety' | 'ai_assistant' | 'valuation_closing'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedItemForCard, setSelectedItemForCard] = useState<InventoryItem | null>(null);

  // Mock Inventory Items
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 'INV-001',
      sku: 'RM-ACT-001',
      barcode: '899100238101',
      name: 'Niacinamide USP Grade 99.5%',
      inciName: 'Niacinamide',
      category: 'Active Ingredient',
      primaryUom: 'Kg',
      totalStockQty: 1250,
      availableStockQty: 950,
      reservedStockQty: 250,
      onOrderQty: 500,
      qcHoldQty: 50,
      quarantineQty: 0,
      safetyStock: 300,
      minStock: 200,
      maxStock: 2000,
      reorderPoint: 400,
      eoqKg: 600,
      abcClass: 'A',
      xyzClass: 'X',
      valuationMethod: 'FEFO',
      unitCostIDR: 450000,
      totalAssetValueIDR: 562500000,
      lastPurchaseDate: '2026-08-01',
      supplierName: 'BASF Chemical Indonesia',
      status: 'In Stock',
    },
    {
      id: 'INV-002',
      sku: 'RM-ACT-002',
      barcode: '899100238102',
      name: 'Centella Asiatica Extract Powder 98%',
      inciName: 'Centella Asiatica Leaf Extract',
      category: 'Active Ingredient',
      primaryUom: 'Kg',
      totalStockQty: 180,
      availableStockQty: 60,
      reservedStockQty: 100,
      onOrderQty: 200,
      qcHoldQty: 20,
      quarantineQty: 0,
      safetyStock: 150,
      minStock: 100,
      maxStock: 500,
      reorderPoint: 200,
      eoqKg: 250,
      abcClass: 'A',
      xyzClass: 'Y',
      valuationMethod: 'FEFO',
      unitCostIDR: 1850000,
      totalAssetValueIDR: 333000000,
      lastPurchaseDate: '2026-07-28',
      supplierName: 'Croda Personal Care UK',
      status: 'Low Stock',
    },
    {
      id: 'INV-003',
      sku: 'RM-ACT-003',
      barcode: '899100238103',
      name: 'Ceramide NP Pure Powder',
      inciName: 'Ceramide NP',
      category: 'Active Ingredient',
      primaryUom: 'Kg',
      totalStockQty: 45,
      availableStockQty: 10,
      reservedStockQty: 35,
      onOrderQty: 100,
      qcHoldQty: 0,
      quarantineQty: 0,
      safetyStock: 40,
      minStock: 25,
      maxStock: 150,
      reorderPoint: 50,
      eoqKg: 80,
      abcClass: 'A',
      xyzClass: 'Z',
      valuationMethod: 'FEFO',
      unitCostIDR: 12500000,
      totalAssetValueIDR: 562500000,
      lastPurchaseDate: '2026-07-10',
      supplierName: 'Evonik Specialty Chemicals',
      status: 'Low Stock',
    },
    {
      id: 'INV-004',
      sku: 'PKG-BTL-01',
      barcode: '899100238201',
      name: 'Botol Airless Pump Dual Chamber 50ml Frost White',
      category: 'Packaging Material',
      primaryUom: 'Pcs',
      totalStockQty: 45000,
      availableStockQty: 35000,
      reservedStockQty: 10000,
      onOrderQty: 20000,
      qcHoldQty: 0,
      quarantineQty: 0,
      safetyStock: 10000,
      minStock: 8000,
      maxStock: 80000,
      reorderPoint: 15000,
      eoqKg: 25000,
      abcClass: 'B',
      xyzClass: 'X',
      valuationMethod: 'Moving Average',
      unitCostIDR: 12500,
      totalAssetValueIDR: 562500000,
      lastPurchaseDate: '2026-08-02',
      supplierName: 'PT Packaging Nusantara Group',
      status: 'In Stock',
    },
    {
      id: 'INV-005',
      sku: 'FG-SRM-001',
      barcode: '899100238901',
      name: 'CosmoGlow Intense Brightening Serum 30ml (Finished Good)',
      category: 'Finished Goods',
      primaryUom: 'Bottle',
      totalStockQty: 12400,
      availableStockQty: 9400,
      reservedStockQty: 3000,
      onOrderQty: 0,
      qcHoldQty: 0,
      quarantineQty: 0,
      safetyStock: 3000,
      minStock: 2000,
      maxStock: 25000,
      reorderPoint: 5000,
      eoqKg: 10000,
      abcClass: 'A',
      xyzClass: 'X',
      valuationMethod: 'Standard Cost',
      unitCostIDR: 38500,
      totalAssetValueIDR: 477400000,
      lastPurchaseDate: '2026-08-05',
      supplierName: 'In-House Production Plant A',
      status: 'In Stock',
    },
    {
      id: 'INV-006',
      sku: 'RM-OIL-002',
      barcode: '899100238108',
      name: 'Jojoba Oil Golden Organic Cold Pressed',
      inciName: 'Simmondsia Chinensis Seed Oil',
      category: 'Raw Material',
      primaryUom: 'Kg',
      totalStockQty: 800,
      availableStockQty: 750,
      reservedStockQty: 50,
      onOrderQty: 0,
      qcHoldQty: 0,
      quarantineQty: 0,
      safetyStock: 200,
      minStock: 100,
      maxStock: 1000,
      reorderPoint: 250,
      eoqKg: 300,
      abcClass: 'B',
      xyzClass: 'Y',
      valuationMethod: 'FEFO',
      unitCostIDR: 320000,
      totalAssetValueIDR: 256000000,
      lastPurchaseDate: '2026-06-12',
      supplierName: 'EarthOil Plant Botanicals',
      status: 'In Stock',
    },
  ]);

  // Mock Batches
  const [batches] = useState<BatchLotRecord[]>([
    {
      id: 'BAT-101',
      itemSku: 'RM-ACT-001',
      itemName: 'Niacinamide USP Grade 99.5%',
      batchSupplier: 'SUP-BASF-88120',
      internalLotNumber: 'LOT-NCP-2026-08',
      manufactureDate: '2026-06-15',
      expiryDate: '2028-06-14',
      retestDate: '2027-06-14',
      coaRef: 'COA-BASF-2026-9921',
      msdsRef: 'MSDS-NIA-V3',
      currentStockQty: 500,
      warehouseLocation: 'WH-RM-01 / Zone A / Bin B-18',
      inspectionStatus: 'QC Released',
      daysToExpiry: 678,
    },
    {
      id: 'BAT-102',
      itemSku: 'RM-ACT-002',
      itemName: 'Centella Asiatica Extract Powder 98%',
      batchSupplier: 'CRD-CTA-99211',
      internalLotNumber: 'LOT-CTA-2026-02',
      manufactureDate: '2025-09-01',
      expiryDate: '2026-09-01',
      retestDate: '2026-08-15',
      coaRef: 'COA-CRODA-2025-102',
      msdsRef: 'MSDS-CTA-V1',
      currentStockQty: 60,
      warehouseLocation: 'WH-COLD-02 / Cold Zone C1 / Bin B-02',
      inspectionStatus: 'QC Released',
      daysToExpiry: 26, // Near Expiry!
    },
    {
      id: 'BAT-103',
      itemSku: 'RM-ACT-003',
      itemName: 'Ceramide NP Pure Powder',
      batchSupplier: 'EVK-CRM-7718',
      internalLotNumber: 'LOT-CRM-2026-01',
      manufactureDate: '2026-05-20',
      expiryDate: '2028-05-19',
      retestDate: '2027-05-19',
      coaRef: 'COA-EVONIK-7718',
      msdsRef: 'MSDS-CRM-V2',
      currentStockQty: 45,
      warehouseLocation: 'WH-RM-01 / Zone Q / Bin RQ-01',
      inspectionStatus: 'Quarantine',
      daysToExpiry: 651,
    },
  ]);

  // Mock Transactions
  const [transactions] = useState<InventoryTransaction[]>([
    {
      id: 'TXN-001',
      txnNumber: 'INV-TXN-202608-081',
      txnType: 'Goods Receipt (GRN)',
      itemName: 'Niacinamide USP Grade 99.5%',
      batchLot: 'LOT-NCP-2026-08',
      qty: 500,
      uom: 'Kg',
      sourceLocation: 'Supplier BAS',
      targetLocation: 'WH-RM-01 / Bin B-18',
      valuationCostIDR: 225000000,
      timestamp: '2026-08-05 09:30',
      user: 'Budi Santoso (WMS Staff)',
    },
    {
      id: 'TXN-002',
      txnNumber: 'INV-TXN-202608-082',
      txnType: 'Material Issue (WO)',
      itemName: 'Niacinamide USP Grade 99.5%',
      batchLot: 'LOT-NCP-2026-08',
      qty: 100,
      uom: 'Kg',
      sourceLocation: 'WH-RM-01 / Bin B-18',
      targetLocation: 'MES Mixing Tank 1',
      valuationCostIDR: 45000000,
      timestamp: '2026-08-06 10:15',
      user: 'Ahmad Fauzi (Operator MES)',
    },
  ]);

  // Calculate High-level Totals
  const totalInventoryAssetValuation = items.reduce((sum, item) => sum + item.totalAssetValueIDR, 0);
  const totalLowStockCount = items.filter((i) => i.status === 'Low Stock' || i.availableStockQty < i.reorderPoint).length;
  const nearExpiryBatchesCount = batches.filter((b) => b.daysToExpiry <= 60).length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.inciName && item.inciName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-teal-400 text-slate-950 shadow-lg">
                <Boxes className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Inventory Management Enterprise
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 10 • Valuation & FEFO Engine
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Pusat Kendali Persediaan Kosmetik: Realtime Multi-Warehouse Balance, FIFO/FEFO Valuation, Reorder Point, & AI Stock Optimizer.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
              id="new-stock-adjustment-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Stock Adjustment / Issue</span>
            </button>

            <button
              onClick={() => setActiveSubTab('expiry_fefo')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>FEFO Expiry Alert ({nearExpiryBatchesCount})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_assistant')}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-500/20 px-3 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all"
            >
              <Bot className="h-4 w-4 text-amber-300" />
              <span>AI Inventory Optimizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Total Aset Persediaan</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">
            {formatCurrencyIDR(totalInventoryAssetValuation)}
          </p>
          <p className="text-[10px] text-slate-400">Valuasi Realtime (FEFO/FIFO)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Stok Kritis / Reorder</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">{totalLowStockCount} SKU</p>
          <p className="text-[10px] text-amber-400 font-semibold">Di bawah Reorder Point (ROP)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Near Expiry (&lt; 60 Hari)</span>
            <Calendar className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <p className="text-lg font-black font-mono text-rose-300">{nearExpiryBatchesCount} Batch</p>
          <p className="text-[10px] text-rose-400 font-semibold">Prioritas FEFO Production</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Stok Di-Reservasi (WO)</span>
            <Lock className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">385.0 Kg</p>
          <p className="text-[10px] text-slate-400">Terkunci untuk Batch MES</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Turnover Rate (ITO)</span>
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">8.4x /thn</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Optimal (Target &gt; 6x)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Akurasi Stock Opname</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-white">99.85%</p>
          <p className="text-[10px] text-slate-400">Variansi &lt; 0.15%</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PieChart className="h-4 w-4" />
          <span>Dashboard & Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stock_balance')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'stock_balance'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Stock Balance & Master SKU</span>
        </button>

        <button
          onClick={() => setActiveSubTab('batch_lot')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'batch_lot'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Batch & Lot Traceability</span>
        </button>

        <button
          onClick={() => setActiveSubTab('expiry_fefo')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'expiry_fefo'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Expiry Monitor & FEFO Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('abc_safety')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'abc_safety'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Safety Stock, ROP & ABC/XYZ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_assistant')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'ai_assistant'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="h-4 w-4 text-amber-400" />
          <span>AI Inventory Assistant</span>
        </button>

        <button
          onClick={() => setActiveSubTab('valuation_closing')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'valuation_closing'
              ? 'bg-slate-800 text-slate-200 border-b-2 border-slate-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Valuation & Closing COGS</span>
        </button>
      </div>

      {/* SUB-TAB 1: DASHBOARD & OVERVIEW */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Breakdown by Category Chart Simulation */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Komposisi Nilai Aset Persediaan berdasarkan Kategori</h2>
                  <p className="text-xs text-slate-400">Proporsi Aset Bahan Aktif, Kemasan, & Finished Goods</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  Total {formatCurrencyIDR(totalInventoryAssetValuation)}
                </span>
              </div>

              {/* Visual Category Progress Bars */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Active Ingredients (Bahan Aktif Skincare)</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {formatCurrencyIDR(1458000000)} (53.8%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[53.8%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Packaging Materials (Kemasan Airless Pump, Botol, Box)</span>
                    <span className="font-mono text-indigo-300 font-bold">
                      {formatCurrencyIDR(562500000)} (20.7%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full w-[20.7%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Finished Goods (Produk Jadi Skincare & Serum)</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {formatCurrencyIDR(477400000)} (17.6%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full w-[17.6%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Base Oils & Emulsifiers (Bahan Baku Emulsi)</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {formatCurrencyIDR(256000000)} (9.4%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[9.4%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reorder Point Widget */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-white">Peringatan Reorder Point (ROP)</h2>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                  {totalLowStockCount} SKU Alert
                </span>
              </div>

              <div className="space-y-3">
                {items
                  .filter((i) => i.status === 'Low Stock' || i.availableStockQty <= i.reorderPoint)
                  .map((lowItem) => (
                    <div
                      key={lowItem.id}
                      className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white line-clamp-1">{lowItem.name}</span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{lowItem.sku}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-400">
                          Sisa: <strong className="text-rose-400">{lowItem.availableStockQty} {lowItem.primaryUom}</strong>
                        </span>
                        <span className="text-slate-400">
                          ROP: <strong className="text-slate-200">{lowItem.reorderPoint} {lowItem.primaryUom}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Membuat DRAFT PR Auto-Purchase ke ${lowItem.supplierName} sebanyak ${lowItem.eoqKg} ${lowItem.primaryUom}`)}
                        className="w-full mt-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 text-[11px] shadow"
                      >
                        Auto-Generate Purchase Requisition (EOQ: {lowItem.eoqKg} {lowItem.primaryUom}) →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Inventory Transactions Log */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Mutasi & Transaksi Stok Terakhir</h2>
                <p className="text-xs text-slate-400">Penerimaan GRN, Material Issue MES, & Pengiriman Barang Jadi</p>
              </div>
              <button
                onClick={() => setActiveSubTab('stock_balance')}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                Lihat Seluruh Stok Card →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">No. Transaksi</th>
                    <th className="p-3">Tipe Mutasi</th>
                    <th className="p-3">Nama Material / SKU</th>
                    <th className="p-3">Batch / Lot</th>
                    <th className="p-3">Qty Mutasi</th>
                    <th className="p-3">Lokasi Asal → Tujuan</th>
                    <th className="p-3">Waktu & User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-indigo-300">{t.txnNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800 text-[10px] font-bold">
                          {t.txnType}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">{t.itemName}</td>
                      <td className="p-3 text-amber-300">{t.batchLot}</td>
                      <td className="p-3 font-bold text-emerald-300">
                        {t.qty} {t.uom}
                      </td>
                      <td className="p-3 text-slate-300">{t.sourceLocation} → {t.targetLocation}</td>
                      <td className="p-3 text-slate-400 text-[10px]">{t.timestamp} ({t.user})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STOCK BALANCE & MASTER SKU */}
      {activeSubTab === 'stock_balance' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari SKU, Nama Bahan, INCI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="All">Semua Kategori Persediaan</option>
                <option value="Active Ingredient">Active Ingredient</option>
                <option value="Raw Material">Raw Material Base</option>
                <option value="Packaging Material">Packaging Material</option>
                <option value="Finished Goods">Finished Goods</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => alert('Exporting Stock Balance Excel...')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Master Stock Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono text-[10px]">
                  <th className="p-3.5 font-bold">SKU & Barcode</th>
                  <th className="p-3.5 font-bold">Nama Material / INCI</th>
                  <th className="p-3.5 font-bold">Kategori</th>
                  <th className="p-3.5 font-bold">Total Stok</th>
                  <th className="p-3.5 font-bold">Tersedia</th>
                  <th className="p-3.5 font-bold">Reservasi (WO)</th>
                  <th className="p-3.5 font-bold">Valuasi (IDR)</th>
                  <th className="p-3.5 font-bold">Metode Costing</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-indigo-300 block">{item.sku}</span>
                      <span className="text-slate-500 text-[10px]">{item.barcode}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{item.name}</span>
                      {item.inciName && <span className="text-slate-400 text-[10px]">INCI: {item.inciName}</span>}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {item.totalStockQty.toLocaleString()} {item.primaryUom}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-300">
                      {item.availableStockQty.toLocaleString()} {item.primaryUom}
                    </td>
                    <td className="p-3.5 font-bold text-amber-300">
                      {item.reservedStockQty.toLocaleString()} {item.primaryUom}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-300">
                      {formatCurrencyIDR(item.totalAssetValueIDR)}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                        {item.valuationMethod}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedItemForCard(item)}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                      >
                        Kartu Stok →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BATCH & LOT TRACEABILITY */}
      {activeSubTab === 'batch_lot' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <h2 className="text-sm font-bold text-white">Penelusuran Silsilah Batch & Lot (Full Genealogic Trace)</h2>
            <p className="text-xs text-slate-400">
              Dapat menelusuri dari PO Supplier → Goods Receipt → Bin Gudang → Nomor Work Order MES → Kemasan Barang Jadi → Surat Jalan Buyer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Batch List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Daftar Active Lot:</span>
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-black text-cyan-300">{b.internalLotNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.inspectionStatus === 'QC Released'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {b.inspectionStatus}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono">
                    <p className="font-bold text-white">{b.itemName}</p>
                    <p className="text-slate-400 text-[11px]">Supplier Lot: {b.batchSupplier}</p>
                    <p className="text-slate-400 text-[11px]">COA Ref: {b.coaRef}</p>
                    <p className="text-slate-400 text-[11px]">Sisa Stok: {b.currentStockQty} Kg</p>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                    📍 {b.warehouseLocation}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Trace Tree Diagram */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Bagan Silsilah Lot: LOT-NCP-2026-08</h3>
                  <p className="text-xs text-slate-400">Niacinamide USP Grade 99.5% (BASF Chemical)</p>
                </div>
                <button
                  onClick={() => alert('Exporting Genealogic Trace Certificate PDF...')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Cetak Traceability Report (PDF)
                </button>
              </div>

              {/* Step Flow Diagram */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">STEP 1: INBOUND PO & SUPPLIER</span>
                    <p className="font-bold text-white">PO-2026-0881 • BASF Chemical Indonesia</p>
                    <p className="text-slate-400 text-[11px]">Batch Supplier: SUP-BASF-88120 (COA Passed)</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="flex justify-center text-slate-600">↓</div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">STEP 2: WAREHOUSE RECEIVING & BIN</span>
                    <p className="font-bold text-white">GRN-202608-0112 • Qty: 500 Kg</p>
                    <p className="text-slate-400 text-[11px]">Stored at: WH-RM-01 / Zone A / Bin B-18</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                </div>

                <div className="flex justify-center text-slate-600">↓</div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">STEP 3: MES BATCH PRODUCTION DISPENSING</span>
                    <p className="font-bold text-white">WO-BATCH-9901 (Serum Brightening 1000L)</p>
                    <p className="text-slate-400 text-[11px]">Consumed 100 Kg on 2026-08-06 10:15</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                </div>

                <div className="flex justify-center text-slate-600">↓</div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">STEP 4: FINISHED GOOD DISPATCH</span>
                    <p className="font-bold text-white">FG-SRM-2026-12 (12,400 Bottles)</p>
                    <p className="text-slate-400 text-[11px]">Dispatched to: PT GlowSkin Beauty Indonesia (DO-MAKLON-0811)</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EXPIRY MONITOR & FEFO ENGINE */}
      {activeSubTab === 'expiry_fefo' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Monitoring Tanggal Expired & FEFO Priority Engine</h2>
              <p className="text-xs text-slate-400">Aturan FEFO (First Expired, First Out) Otomatis Mengunci Lot Kritis untuk Produksi Lebih Awal</p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-950 px-3 py-1 rounded-lg border border-amber-500/40 font-bold">
              Automated FEFO Active
            </span>
          </div>

          <div className="space-y-3">
            {batches.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border space-y-3 transition-all ${
                  b.daysToExpiry <= 30
                    ? 'bg-rose-950/20 border-rose-500/50'
                    : b.daysToExpiry <= 90
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-amber-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                      {b.internalLotNumber}
                    </span>
                    <span className="font-bold text-white">{b.itemName}</span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-slate-400">Expired: {b.expiryDate}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        b.daysToExpiry <= 30
                          ? 'bg-rose-500 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {b.daysToExpiry} Hari Lagi!
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Sisa Stok Lot:</span>
                    <span className="font-bold text-white">{b.currentStockQty} Kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Lokasi Gudang:</span>
                    <span className="font-bold text-slate-300">{b.warehouseLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tanggal Retest Micro:</span>
                    <span className="font-bold text-cyan-300">{b.retestDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Status QC:</span>
                    <span className="font-bold text-emerald-300">{b.inspectionStatus}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 text-[11px]">
                    💡 <strong>Rekomendasi FEFO Engine:</strong> Alokasikan lot ini untuk Work Order aktif terdekat (WO-BATCH-9902) untuk mencegah waste.
                  </span>
                  <button
                    onClick={() => alert(`FEFO Lock Berhasil! Lot ${b.internalLotNumber} diprioritaskan untuk Work Order berikutnya.`)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow"
                  >
                    Lock for Prioritized Pick →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ABC/XYZ & SAFETY STOCK */}
      {activeSubTab === 'abc_safety' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <h2 className="text-sm font-bold text-white">Analisis Klasifikasi ABC / XYZ & Kuantitas EOQ</h2>
            <p className="text-xs text-slate-400">
              Klasifikasi ABC (Berdasarkan Nilai Aset) & XYZ (Berdasarkan Variabilitas Permintaan) untuk Optimasi Safety Stock
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ABC/XYZ Matrix Grid Visualizer */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Matriks 3x3 ABC/XYZ</h3>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500/40 space-y-1">
                  <span className="font-black text-indigo-300 text-sm">AX</span>
                  <span className="text-[10px] text-slate-400 block">High Value, Stable</span>
                  <span className="text-[10px] font-bold text-emerald-400">Niacinamide, FG Serum</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-amber-300 text-sm">AY</span>
                  <span className="text-[10px] text-slate-400 block">High Value, Moderate</span>
                  <span className="text-[10px] font-bold text-slate-300">Centella Extract</span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1">
                  <span className="font-black text-rose-300 text-sm">AZ</span>
                  <span className="text-[10px] text-slate-400 block">High Value, Unstable</span>
                  <span className="text-[10px] font-bold text-rose-300">Ceramide NP</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-300 text-sm">BX</span>
                  <span className="text-[10px] text-slate-400 block">Med Value, Stable</span>
                  <span className="text-[10px] font-bold text-slate-400">Airless Bottles</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-300 text-sm">BY</span>
                  <span className="text-[10px] text-slate-400 block">Med Value, Moderate</span>
                  <span className="text-[10px] font-bold text-slate-400">Jojoba Oil</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-400 text-sm">BZ</span>
                  <span className="text-[10px] text-slate-400 block">Med Value, Unstable</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-500 text-sm">CX</span>
                  <span className="text-[10px] text-slate-400 block">Low Value, Stable</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-500 text-sm">CY</span>
                  <span className="text-[10px] text-slate-400 block">Low Value, Moderate</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-black text-slate-500 text-sm">CZ</span>
                  <span className="text-[10px] text-slate-400 block">Low Value, Unstable</span>
                </div>
              </div>
            </div>

            {/* EOQ & Safety Stock Parameters Table */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Kalkulasi Economic Order Quantity (EOQ) & Reorder Point
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                      <th className="p-3">Nama Material</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Safety Stock</th>
                      <th className="p-3">Min - Max</th>
                      <th className="p-3">Reorder Point (ROP)</th>
                      <th className="p-3">EOQ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{it.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold text-[10px]">
                            {it.abcClass}{it.xyzClass}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-300">
                          {it.safetyStock} {it.primaryUom}
                        </td>
                        <td className="p-3 text-slate-400">
                          {it.minStock} - {it.maxStock} {it.primaryUom}
                        </td>
                        <td className="p-3 font-bold text-amber-300">
                          {it.reorderPoint} {it.primaryUom}
                        </td>
                        <td className="p-3 font-bold text-emerald-300">
                          {it.eoqKg} {it.primaryUom}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: AI INVENTORY ASSISTANT */}
      {activeSubTab === 'ai_assistant' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">AI Inventory Assistant & Stock Intelligence</h2>
                <p className="text-xs text-slate-300">
                  Rekomendasi Prediksi Stockout, Deteksi Dead Stock, Optimasi Turn-over, & Re-allocation Alert
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Prediksi Stock-Out Centella Asiatica Extract</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Berdasarkan tren permintaan Work Order MES bulan Agustus (+25% campaign serum), stok Centella Asiatica diproyeksikan habis dalam <strong>12 hari kerja</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => alert('Disetujui! DRAFT PO dibuat otomatis untuk Croda Personal Care UK.')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
                  >
                    Otorisasi Terbitkan PO Darurat (200 Kg) →
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Analisis Slow-Moving & Dead Stock Alert</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Ditemukan 800 Kg Jojoba Oil yang tidak mengalami pergerakan selama 60 hari. AI merekomendasikan bundling produksi formula body oil atau redistribusi ke Pabrik B.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => alert('Jadwal redistribusi stok dikirimkan ke Tim PPIC.')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
                  >
                    Kirim Rekomendasi ke PPIC Lab →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: VALUATION & CLOSING */}
      {activeSubTab === 'valuation_closing' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Valuasi Persediaan & Penutupan COGS Bulanan</h2>
              <p className="text-xs text-slate-400">
                Laporan Layer Costing FEFO/FIFO, HPP Pemakaian Bahan Baku, & Penutupan Akun Persediaan
              </p>
            </div>
            <button
              onClick={() => alert('Simulasi Inventory Monthly Closing Sukses! Jurnal HPP Diterbitkan ke Modul Finance.')}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-black text-slate-950 shadow hover:brightness-110"
            >
              Jalankan Inventory Monthly Closing →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Rincian Layer Costing FEFO Active</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Metode Valuation</th>
                    <th className="p-3">Material</th>
                    <th className="p-3">Tgl Batch</th>
                    <th className="p-3">Sisa Qty</th>
                    <th className="p-3">Unit Cost Layer (IDR)</th>
                    <th className="p-3">Total Asset Value (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-indigo-300">{it.valuationMethod}</td>
                      <td className="p-3 font-bold text-white">{it.name}</td>
                      <td className="p-3 text-slate-400">{it.lastPurchaseDate}</td>
                      <td className="p-3 font-bold text-slate-200">
                        {it.totalStockQty} {it.primaryUom}
                      </td>
                      <td className="p-3 font-bold text-emerald-300">{formatCurrencyIDR(it.unitCostIDR)}</td>
                      <td className="p-3 font-bold text-emerald-300">{formatCurrencyIDR(it.totalAssetValueIDR)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Card Modal Detail */}
      {selectedItemForCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{selectedItemForCard.sku}</span>
                <h3 className="text-base font-bold text-white">{selectedItemForCard.name}</h3>
              </div>
              <button
                onClick={() => setSelectedItemForCard(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Stok:</span>
                <span className="font-bold text-white">{selectedItemForCard.totalStockQty} {selectedItemForCard.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tersedia:</span>
                <span className="font-bold text-emerald-300">{selectedItemForCard.availableStockQty} {selectedItemForCard.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Reservasi WO:</span>
                <span className="font-bold text-amber-300">{selectedItemForCard.reservedStockQty} {selectedItemForCard.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Nilai Aset:</span>
                <span className="font-bold text-emerald-300">{formatCurrencyIDR(selectedItemForCard.totalAssetValueIDR)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Riwayat Kartu Stok Terakhir:</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>2026-08-05 GRN-0112 (Saldo Masuk)</span>
                  <span className="text-emerald-400 font-bold">+500 Kg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>2026-08-06 Material Issue MES (Mixing)</span>
                  <span className="text-rose-400 font-bold">-100 Kg</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItemForCard(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Tutup Kartu Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Input Stock Adjustment / Sampling Issue</h3>
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Material SKU:</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono">
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.sku} - {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Alasan Adjustment / Release:</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono">
                  <option value="sampling">Sampling Quality Control / Lab Micro</option>
                  <option value="damage">Kerusakan / Bocor saat Handling</option>
                  <option value="opname_diff">Selisih Stock Opname</option>
                  <option value="expired">Penghapusan Barang Expired (Scrap)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kuantitas Adjustment (Kg/Pcs):</label>
                <input
                  type="number"
                  placeholder="Contoh: 5.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan Supervisor:</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan pengujian sampel..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Stock Adjustment berhasil diproses dan dicatat di Audit Trail!');
                  setShowAdjustmentModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow"
              >
                Simpan & Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
