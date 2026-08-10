import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Calendar,
  Bot,
  DollarSign,
  AlertTriangle,
  Lock,
  TrendingUp,
  ShieldCheck,
  PieChart,
  BarChart3,
  Calculator,
  Tag,
  Building2,
  Scale,
  XCircle,
  ArrowLeftRight,
} from 'lucide-react';

import {
  InventoryItem,
  BatchLotRecord,
  InventoryTransaction,
  WarehouseBinLocation,
  StockOpnameItem,
} from '../types/inventory';

import {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_BATCHES,
  INITIAL_TRANSACTIONS,
  WAREHOUSE_BINS,
  INITIAL_STOCK_OPNAME_ITEMS,
} from '../data/inventoryMockData';

import { formatCurrencyIDR } from '../lib/utils';

// Sub-component imports
import { InventoryDashboardTab } from './inventory/InventoryDashboardTab';
import { StockBalanceTab } from './inventory/StockBalanceTab';
import { BatchTraceabilityTab } from './inventory/BatchTraceabilityTab';
import { ExpiryFefoTab } from './inventory/ExpiryFefoTab';
import { AbcSafetyTab } from './inventory/AbcSafetyTab';
import { StockOpnameTab } from './inventory/StockOpnameTab';
import { MultiWarehouseTab } from './inventory/MultiWarehouseTab';
import { AiAssistantTab } from './inventory/AiAssistantTab';
import { ValuationClosingTab } from './inventory/ValuationClosingTab';

export const InventoryExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'stock_balance'
    | 'batch_lot'
    | 'expiry_fefo'
    | 'abc_safety'
    | 'stock_opname'
    | 'multi_warehouse'
    | 'ai_assistant'
    | 'valuation_closing'
  >('dashboard');

  // Master State
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [batches, setBatches] = useState<BatchLotRecord[]>(INITIAL_BATCHES);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(INITIAL_TRANSACTIONS);
  const [bins, setBins] = useState<WarehouseBinLocation[]>(WAREHOUSE_BINS);
  const [opnameItems, setOpnameItems] = useState<StockOpnameItem[]>(INITIAL_STOCK_OPNAME_ITEMS);

  // Modals state
  const [selectedStockCardItem, setSelectedStockCardItem] = useState<InventoryItem | null>(null);
  const [transferModalItem, setTransferModalItem] = useState<InventoryItem | null>(null);
  const [transferTargetBin, setTransferTargetBin] = useState('WH-COLD-02 / Cold Zone C1');
  const [transferQty, setTransferQty] = useState<number>(10);

  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentSkuId, setAdjustmentSkuId] = useState(items[0]?.id || '');
  const [adjustmentCause, setAdjustmentCause] = useState('Sampling Quality Control / Lab Micro');
  const [adjustmentQty, setAdjustmentQty] = useState<number>(5);

  const [draftPoModalItem, setDraftPoModalItem] = useState<InventoryItem | null>(null);

  // Totals
  const totalInventoryAssetValuation = items.reduce((sum, item) => sum + item.totalAssetValueIDR, 0);
  const totalLowStockCount = items.filter((i) => i.status === 'Low Stock' || i.availableStockQty <= i.reorderPoint).length;
  const nearExpiryBatchesCount = batches.filter((b) => b.daysToExpiry <= 60).length;

  // Handlers
  const handleAddNewSku = (newItem: InventoryItem) => {
    setItems((prev) => [newItem, ...prev]);
    alert(`Master SKU Baru ${newItem.sku} (${newItem.name}) berhasil didaftarkan!`);
  };

  const handleToggleQcStatus = (
    batchId: string,
    newStatus: BatchLotRecord['inspectionStatus']
  ) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, inspectionStatus: newStatus } : b))
    );
  };

  const handleToggleFefoLock = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, isFefoLocked: !b.isFefoLocked } : b))
    );
  };

  const handleUpdateOpnameItem = (
    id: string,
    physicalQty: number,
    cause: StockOpnameItem['varianceCause']
  ) => {
    setOpnameItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const varianceQty = physicalQty - item.systemQty;
          const varianceValueIDR = varianceQty * item.unitCostIDR;
          return {
            ...item,
            physicalQty,
            varianceQty,
            varianceValueIDR,
            varianceCause: cause,
          };
        }
        return item;
      })
    );
  };

  const handleApproveOpnameAdjustment = (opnameItem: StockOpnameItem) => {
    // Update Opname status
    setOpnameItems((prev) =>
      prev.map((it) => (it.id === opnameItem.id ? { ...it, auditStatus: 'Variance Approved' } : it))
    );

    // Update item stock
    setItems((prev) =>
      prev.map((it) => {
        if (it.sku === opnameItem.sku) {
          const newQty = it.totalStockQty + opnameItem.varianceQty;
          return {
            ...it,
            totalStockQty: newQty,
            availableStockQty: newQty - it.reservedStockQty,
            totalAssetValueIDR: newQty * it.unitCostIDR,
          };
        }
        return it;
      })
    );

    // Log transaction
    const newTxn: InventoryTransaction = {
      id: `TXN-${Date.now()}`,
      txnNumber: `INV-TXN-OPNAME-${Math.floor(1000 + Math.random() * 9000)}`,
      txnType: 'Stock Adjustment',
      itemName: opnameItem.itemName,
      batchLot: 'LOT-OPNAME-2026',
      qty: opnameItem.varianceQty,
      uom: opnameItem.uom,
      sourceLocation: 'Audit Physical Count',
      targetLocation: 'Adjustment Ledger',
      valuationCostIDR: Math.abs(opnameItem.varianceValueIDR),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Auditor Opname Supervisor',
      notes: `Penyesuaian Opname: ${opnameItem.varianceCause}`,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    alert(`Otorisasi Penyesuaian Opname ${opnameItem.sku} Berhasil! Stok Sistem Diperbarui.`);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModalItem || transferQty <= 0) return;

    // Log transaction
    const newTxn: InventoryTransaction = {
      id: `TXN-${Date.now()}`,
      txnNumber: `INV-TXN-TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      txnType: 'Warehouse Transfer',
      itemName: transferModalItem.name,
      batchLot: 'LOT-ACTIVE',
      qty: transferQty,
      uom: transferModalItem.primaryUom,
      sourceLocation: transferModalItem.warehouseBin || 'WH-RM-01',
      targetLocation: transferTargetBin,
      valuationCostIDR: transferQty * transferModalItem.unitCostIDR,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Budi Santoso (WMS Staff)',
      notes: 'Internal Transfer Antar Gudang',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setTransferModalItem(null);
    alert(`Transfer ${transferQty} ${transferModalItem.primaryUom} ${transferModalItem.name} ke ${transferTargetBin} Berhasil!`);
  };

  const handleExecuteAdjustmentModal = () => {
    const targetItem = items.find((i) => i.id === adjustmentSkuId);
    if (!targetItem) return;

    // Deduct stock
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === targetItem.id) {
          const newQty = Math.max(0, it.totalStockQty - adjustmentQty);
          return {
            ...it,
            totalStockQty: newQty,
            availableStockQty: Math.max(0, newQty - it.reservedStockQty),
            totalAssetValueIDR: newQty * it.unitCostIDR,
          };
        }
        return it;
      })
    );

    // Log transaction
    const newTxn: InventoryTransaction = {
      id: `TXN-${Date.now()}`,
      txnNumber: `INV-TXN-ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      txnType: 'Sampling QC',
      itemName: targetItem.name,
      batchLot: 'LOT-ACTIVE',
      qty: -adjustmentQty,
      uom: targetItem.primaryUom,
      sourceLocation: targetItem.warehouseBin || 'Gudang Utama',
      targetLocation: 'QC Micro / Lab',
      valuationCostIDR: adjustmentQty * targetItem.unitCostIDR,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Supervisor Quality Control',
      notes: adjustmentCause,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setShowAdjustmentModal(false);
    alert(`Stock Adjustment ${adjustmentQty} ${targetItem.primaryUom} ${targetItem.name} Berhasil Dicatat!`);
  };

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
                    Prompt 10 • Multi-Warehouse Valuation & FEFO Engine
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Pusat Kendali Persediaan Kosmetik: Realtime Multi-Warehouse Balance, FEFO/FIFO Layer Costing, Reorder Point, & AI Stock Prescriptive.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
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

      {/* High-level Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Total Aset Persediaan</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">
            {formatCurrencyIDR(totalInventoryAssetValuation)}
          </p>
          <p className="text-[10px] text-slate-400">Valuasi Realtime (FEFO/FIFO)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Stok Kritis / Reorder</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">{totalLowStockCount} SKU</p>
          <p className="text-[10px] text-amber-400 font-semibold">Di bawah Reorder Point (ROP)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Near Expiry (&lt; 60 Hari)</span>
            <Calendar className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <p className="text-lg font-black font-mono text-rose-300">{nearExpiryBatchesCount} Batch</p>
          <p className="text-[10px] text-rose-400 font-semibold">Prioritas FEFO Production</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Stok Di-Reservasi (WO)</span>
            <Lock className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">385.0 Kg</p>
          <p className="text-[10px] text-slate-400">Terkunci untuk Batch MES</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Turnover Rate (ITO)</span>
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">8.4x /thn</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Optimal (Target &gt; 6x)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Akurasi Stock Opname</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-white">99.85%</p>
          <p className="text-[10px] text-slate-400">Variansi &lt; 0.15%</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold custom-scrollbar scroll-smooth touch-pan-x pb-1"
      >
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
          onClick={() => setActiveSubTab('stock_opname')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'stock_opname'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Stock Opname & Audit</span>
        </button>

        <button
          onClick={() => setActiveSubTab('multi_warehouse')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'multi_warehouse'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Multi-Warehouse & Cold Room</span>
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

      {/* TAB CONTENT RENDERERS */}
      {activeSubTab === 'dashboard' && (
        <InventoryDashboardTab
          items={items}
          batches={batches}
          transactions={transactions}
          onNavigateSubTab={(tab) => setActiveSubTab(tab as any)}
          onOpenNewPoDraft={(item) => setDraftPoModalItem(item)}
        />
      )}

      {activeSubTab === 'stock_balance' && (
        <StockBalanceTab
          items={items}
          onAddNewSku={handleAddNewSku}
          onOpenStockCard={(item) => setSelectedStockCardItem(item)}
          onOpenTransferModal={(item) => setTransferModalItem(item)}
        />
      )}

      {activeSubTab === 'batch_lot' && (
        <BatchTraceabilityTab batches={batches} onToggleQcStatus={handleToggleQcStatus} />
      )}

      {activeSubTab === 'expiry_fefo' && (
        <ExpiryFefoTab batches={batches} onToggleFefoLock={handleToggleFefoLock} />
      )}

      {activeSubTab === 'abc_safety' && <AbcSafetyTab items={items} />}

      {activeSubTab === 'stock_opname' && (
        <StockOpnameTab
          opnameItems={opnameItems}
          onUpdateOpnameItem={handleUpdateOpnameItem}
          onApproveOpnameAdjustment={handleApproveOpnameAdjustment}
        />
      )}

      {activeSubTab === 'multi_warehouse' && <MultiWarehouseTab bins={bins} />}

      {activeSubTab === 'ai_assistant' && (
        <AiAssistantTab
          items={items}
          onTriggerEmergencyPo={(item) => setDraftPoModalItem(item)}
        />
      )}

      {activeSubTab === 'valuation_closing' && (
        <ValuationClosingTab
          items={items}
          onExecuteMonthlyClosing={() => {
            alert('Penutupan COGS Bulanan Berhasil! Jurnal HPP Diterbitkan ke Modul Finance.');
          }}
        />
      )}

      {/* Stock Card Modal */}
      {selectedStockCardItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{selectedStockCardItem.sku}</span>
                <h3 className="text-base font-bold text-white">{selectedStockCardItem.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStockCardItem(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Stok:</span>
                <span className="font-bold text-white">{selectedStockCardItem.totalStockQty} {selectedStockCardItem.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Tersedia:</span>
                <span className="font-bold text-emerald-300">{selectedStockCardItem.availableStockQty} {selectedStockCardItem.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Reservasi WO:</span>
                <span className="font-bold text-amber-300">{selectedStockCardItem.reservedStockQty} {selectedStockCardItem.primaryUom}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Nilai Aset:</span>
                <span className="font-bold text-emerald-300">{formatCurrencyIDR(selectedStockCardItem.totalAssetValueIDR)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Riwayat Mutasi Kartu Stok Terakhir:</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>2026-08-05 GRN-0112 (Penerimaan PO Inbound)</span>
                  <span className="text-emerald-400 font-bold">+500 {selectedStockCardItem.primaryUom}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>2026-08-06 Material Issue MES (Dispensing Mixing)</span>
                  <span className="text-rose-400 font-bold">-100 {selectedStockCardItem.primaryUom}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStockCardItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Tutup Kartu Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Stock Modal */}
      {transferModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-cyan-400" />
                Transfer Stok Antar Gudang / Bin
              </h3>
              <button onClick={() => setTransferModalItem(null)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Material SKU:</label>
                <div className="p-2 rounded bg-slate-950 font-bold text-white border border-slate-800">
                  {transferModalItem.sku} - {transferModalItem.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Asal (Current):</label>
                <div className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {transferModalItem.warehouseBin || 'WH-RM-01 / Zone A'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pilih Lokasi Tujuan (Target Bin):</label>
                <select
                  value={transferTargetBin}
                  onChange={(e) => setTransferTargetBin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value="WH-COLD-02 / Cold Zone C1">WH-COLD-02 / Cold Zone C1 (Cold Room 15°C)</option>
                  <option value="WH-RM-01 / Zone A / Bin B-18">WH-RM-01 / Zone A / Bin B-18</option>
                  <option value="MES-LINE-SIDE / Staging Bin 01">MES-LINE-SIDE / Staging Bin 01</option>
                  <option value="WH-FG-02 / Zone Shipping">WH-FG-02 / Zone Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kuantitas Transfer ({transferModalItem.primaryUom}):</label>
                <input
                  type="number"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-emerald-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow hover:brightness-110"
                >
                  Eksekusi Transfer Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Input Stock Adjustment / Sampling Issue</h3>
              <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Material SKU:</label>
                <select
                  value={adjustmentSkuId}
                  onChange={(e) => setAdjustmentSkuId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.sku} - {i.name} ({i.totalStockQty} {i.primaryUom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Alasan Adjustment / Release Issue:</label>
                <select
                  value={adjustmentCause}
                  onChange={(e) => setAdjustmentCause(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value="Sampling Quality Control / Lab Micro">Sampling Quality Control / Lab Micro</option>
                  <option value="Kerusakan / Bocor saat Handling">Kerusakan / Bocor saat Handling</option>
                  <option value="Selisih Stock Opname">Selisih Stock Opname Periodic</option>
                  <option value="Penghapusan Barang Expired (Scrap)">Penghapusan Barang Expired (Scrap)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kuantitas Issue / Cut (Qty):</label>
                <input
                  type="number"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-emerald-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowAdjustmentModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteAdjustmentModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow hover:brightness-110"
              >
                Simpan & Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Draft Purchase Requisition Modal */}
      {draftPoModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                Terbit Draft Purchase Requisition (PR)
              </h3>
              <button onClick={() => setDraftPoModalItem(null)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <p className="text-slate-300">
                Sistem akan membuat <strong>Draft Purchase Requisition (PR)</strong> otomatis ke Modul Purchasing untuk material berikut:
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-bold text-white">{draftPoModalItem.name}</p>
                <p className="text-slate-400 text-[11px]">SKU: {draftPoModalItem.sku}</p>
                <p className="text-slate-400 text-[11px]">Supplier Terdaftar: {draftPoModalItem.supplierName}</p>
                <p className="text-emerald-300 font-bold pt-1">
                  Kuantitas Pemesanan EOQ: {draftPoModalItem.eoqKg} {draftPoModalItem.primaryUom}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Estimasi Total PO IDR: {formatCurrencyIDR(draftPoModalItem.eoqKg * draftPoModalItem.unitCostIDR)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800 text-xs font-mono">
              <button
                onClick={() => setDraftPoModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`DRAFT PR-2026-0889 Berhasil Diterbitkan untuk ${draftPoModalItem.supplierName}! Dikirim ke Modul Purchasing.`);
                  setDraftPoModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow hover:brightness-110"
              >
                Otorisasi Send PR to Purchasing →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
