import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  PieChart,
  FileText,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  Layers,
  Calculator,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Scale,
  Receipt,
  Zap,
} from 'lucide-react';
import {
  ChartOfAccount,
  JournalEntry,
  AccountsPayableInvoice,
  AccountsReceivableInvoice,
  BankAccount,
  PettyCashTransaction,
  CostCenterBudget,
  ProductCostingItem,
  CostVarianceDetail,
  FixedAssetItem,
  TaxTransaction,
  PeriodClosingStatus,
  initialCoa,
  initialJournalEntries,
  initialApInvoices,
  initialArInvoices,
  initialBankAccounts,
  initialPettyCash,
  initialCostCenterBudgets,
  initialProductCosting,
  initialCostVariances,
  initialFixedAssets,
  initialTaxes,
  initialClosingStatus,
} from '../../server/financeData';
import { formatCurrencyIDR } from '../lib/utils';

export const FinanceExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'coa'
    | 'journals'
    | 'ap-ar'
    | 'cash-bank'
    | 'costing'
    | 'budget'
    | 'assets'
    | 'tax'
    | 'statements'
    | 'closing'
    | 'ai-finance'
  >('dashboard');

  // State
  const [coaList, setCoaList] = useState<ChartOfAccount[]>(initialCoa);
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournalEntries);
  const [apList, setApList] = useState<AccountsPayableInvoice[]>(initialApInvoices);
  const [arList, setArList] = useState<AccountsReceivableInvoice[]>(initialArInvoices);
  const [banks, setBanks] = useState<BankAccount[]>(initialBankAccounts);
  const [pettyCash, setPettyCash] = useState<PettyCashTransaction[]>(initialPettyCash);
  const [budgets, setBudgets] = useState<CostCenterBudget[]>(initialCostCenterBudgets);
  const [productCostings, setProductCostings] = useState<ProductCostingItem[]>(initialProductCosting);
  const [variances, setVariances] = useState<CostVarianceDetail[]>(initialCostVariances);
  const [assets, setAssets] = useState<FixedAssetItem[]>(initialFixedAssets);
  const [taxes] = useState<TaxTransaction[]>(initialTaxes);
  const [closing, setClosing] = useState<PeriodClosingStatus>(initialClosingStatus);

  // Costing Sub-Tab & Simulator State
  const [costingSubTab, setCostingSubTab] = useState<'simulator' | 'list' | 'variance'>('simulator');
  const [isAddProductCostingOpen, setIsAddProductCostingOpen] = useState(false);
  const [isAddVarianceOpen, setIsAddVarianceOpen] = useState(false);
  const [costingSuccessMessage, setCostingSuccessMessage] = useState<string | null>(null);

  const [simulatorForm, setSimulatorForm] = useState({
    productCode: 'FG-SRM-2026',
    productName: 'Hydrating Niacinamide & Ceramide Serum (30ml)',
    batchSizeKg: 1000,
    itemsPerBatch: 33300,
    rawChemicalPerKg: 105000,
    primaryPackagingPerPcs: 14000,
    secondaryPackagingPerPcs: 2500,
    directLaborPerKg: 9000,
    machineUtilityPerKg: 4500,
    overheadPct: 8,
    wasteYieldPct: 2.0,
    targetPricePerUnit: 48000,
  });

  const [newCostingData, setNewCostingData] = useState({
    productCode: '',
    productName: '',
    batchSizeKg: 1000,
    rawMaterialCostIdr: 95000,
    packagingCostIdr: 32000,
    directLaborCostIdr: 8500,
    machineCostIdr: 4300,
    utilityCostIdr: 1800,
    overheadCostIdr: 1200,
    wasteYieldLossIdr: 1500,
    targetSellingPriceIdr: 45000,
  });

  const [newVarianceData, setNewVarianceData] = useState({
    batchCode: '',
    productName: '',
    materialPriceVarianceIdr: 0,
    materialUsageVarianceIdr: 0,
    laborVarianceIdr: 0,
    machineEfficiencyVarianceIdr: 0,
    yieldVarianceIdr: 0,
    explanation: '',
  });

  // Live Simulator Calculations
  const calcRawTotal = (Number(simulatorForm.batchSizeKg) || 0) * (Number(simulatorForm.rawChemicalPerKg) || 0);
  const calcPkgTotal = (Number(simulatorForm.itemsPerBatch) || 0) * ((Number(simulatorForm.primaryPackagingPerPcs) || 0) + (Number(simulatorForm.secondaryPackagingPerPcs) || 0));
  const calcLaborTotal = (Number(simulatorForm.batchSizeKg) || 0) * (Number(simulatorForm.directLaborPerKg) || 0);
  const calcMachineTotal = (Number(simulatorForm.batchSizeKg) || 0) * (Number(simulatorForm.machineUtilityPerKg) || 0);
  const calcSubtotal = calcRawTotal + calcPkgTotal + calcLaborTotal + calcMachineTotal;
  const calcOverhead = calcSubtotal * ((Number(simulatorForm.overheadPct) || 0) / 100);
  const calcWasteLoss = (calcSubtotal + calcOverhead) * ((Number(simulatorForm.wasteYieldPct) || 0) / 100);
  const calcTotalCogmBatch = calcSubtotal + calcOverhead + calcWasteLoss;
  const calcCogmPerKg = calcTotalCogmBatch / (Number(simulatorForm.batchSizeKg) || 1);
  const calcCogmPerUnit = calcTotalCogmBatch / (Number(simulatorForm.itemsPerBatch) || 1);
  const calcTotalRevenue = (Number(simulatorForm.itemsPerBatch) || 0) * (Number(simulatorForm.targetPricePerUnit) || 0);
  const calcGrossProfit = calcTotalRevenue - calcTotalCogmBatch;
  const calcMarginPct = calcTotalRevenue > 0 ? (calcGrossProfit / calcTotalRevenue) * 100 : 0;

  // Handlers for Costing & Variance
  const handleSaveSimulatedCosting = async () => {
    try {
      const res = await fetch('/api/finance/product-costing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: simulatorForm.productCode,
          productName: simulatorForm.productName,
          batchSizeKg: simulatorForm.batchSizeKg,
          rawMaterialCostIdr: simulatorForm.rawChemicalPerKg,
          packagingCostIdr: simulatorForm.primaryPackagingPerPcs + simulatorForm.secondaryPackagingPerPcs,
          directLaborCostIdr: simulatorForm.directLaborPerKg,
          machineCostIdr: simulatorForm.machineUtilityPerKg,
          utilityCostIdr: 1800,
          overheadCostIdr: Math.round(calcOverhead / (simulatorForm.batchSizeKg || 1)),
          wasteYieldLossIdr: Math.round(calcWasteLoss / (simulatorForm.batchSizeKg || 1)),
          targetSellingPriceIdr: simulatorForm.targetPricePerUnit,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProductCostings([data.data, ...productCostings]);
        setCostingSuccessMessage(`Kalkulasi HPP COGM untuk "${simulatorForm.productName}" berhasil disimpan ke daftar Product Costing!`);
        setTimeout(() => setCostingSuccessMessage(null), 5000);
      }
    } catch (err) {
      const localItem: ProductCostingItem = {
        id: `PCST-${Date.now()}`,
        productCode: simulatorForm.productCode,
        productName: simulatorForm.productName,
        batchSizeKg: Number(simulatorForm.batchSizeKg),
        standardCogmPerKgIdr: Math.round(calcCogmPerKg * 1.02),
        actualCogmPerKgIdr: Math.round(calcCogmPerKg),
        variancePerKgIdr: -2000,
        rawMaterialCostIdr: Number(simulatorForm.rawChemicalPerKg),
        packagingCostIdr: Number(simulatorForm.primaryPackagingPerPcs + simulatorForm.secondaryPackagingPerPcs),
        directLaborCostIdr: Number(simulatorForm.directLaborPerKg),
        machineCostIdr: Number(simulatorForm.machineUtilityPerKg),
        utilityCostIdr: 1800,
        overheadCostIdr: Math.round(calcOverhead / (simulatorForm.batchSizeKg || 1)),
        wasteYieldLossIdr: Math.round(calcWasteLoss / (simulatorForm.batchSizeKg || 1)),
        marginPercentage: Number(calcMarginPct.toFixed(1)),
      };
      setProductCostings([localItem, ...productCostings]);
      setCostingSuccessMessage(`Hasil simulasi HPP COGM untuk "${simulatorForm.productName}" berhasil disimpan!`);
      setTimeout(() => setCostingSuccessMessage(null), 5000);
    }
  };

  const handleAddProductCosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCostingData.productCode || !newCostingData.productName) return;

    const actual =
      Number(newCostingData.rawMaterialCostIdr) +
      Number(newCostingData.packagingCostIdr) +
      Number(newCostingData.directLaborCostIdr) +
      Number(newCostingData.machineCostIdr) +
      Number(newCostingData.utilityCostIdr) +
      Number(newCostingData.overheadCostIdr) +
      Number(newCostingData.wasteYieldLossIdr);
    const std = Math.round(actual * 1.02);
    const sell = Number(newCostingData.targetSellingPriceIdr) || actual * 2.2;
    const margin = sell > 0 ? ((sell - actual) / sell) * 100 : 50;

    const newItem: ProductCostingItem = {
      id: `PCST-${Date.now()}`,
      productCode: newCostingData.productCode,
      productName: newCostingData.productName,
      batchSizeKg: Number(newCostingData.batchSizeKg),
      standardCogmPerKgIdr: std,
      actualCogmPerKgIdr: actual,
      variancePerKgIdr: actual - std,
      rawMaterialCostIdr: Number(newCostingData.rawMaterialCostIdr),
      packagingCostIdr: Number(newCostingData.packagingCostIdr),
      directLaborCostIdr: Number(newCostingData.directLaborCostIdr),
      machineCostIdr: Number(newCostingData.machineCostIdr),
      utilityCostIdr: Number(newCostingData.utilityCostIdr),
      overheadCostIdr: Number(newCostingData.overheadCostIdr),
      wasteYieldLossIdr: Number(newCostingData.wasteYieldLossIdr),
      marginPercentage: Number(margin.toFixed(1)),
    };

    setProductCostings([newItem, ...productCostings]);
    setIsAddProductCostingOpen(false);
    setCostingSuccessMessage(`Product Costing "${newCostingData.productName}" berhasil ditambahkan!`);
    setTimeout(() => setCostingSuccessMessage(null), 4000);
  };

  const handleAddCostVariance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarianceData.batchCode || !newVarianceData.productName) return;

    const mpv = Number(newVarianceData.materialPriceVarianceIdr || 0);
    const muv = Number(newVarianceData.materialUsageVarianceIdr || 0);
    const lv = Number(newVarianceData.laborVarianceIdr || 0);
    const mv = Number(newVarianceData.machineEfficiencyVarianceIdr || 0);
    const yv = Number(newVarianceData.yieldVarianceIdr || 0);
    const tot = mpv + muv + lv + mv + yv;

    const newVarItem: CostVarianceDetail = {
      id: `VAR-${Date.now()}`,
      batchCode: newVarianceData.batchCode,
      productName: newVarianceData.productName,
      materialPriceVarianceIdr: mpv,
      materialUsageVarianceIdr: muv,
      laborVarianceIdr: lv,
      machineEfficiencyVarianceIdr: mv,
      yieldVarianceIdr: yv,
      totalVarianceIdr: tot,
      explanation: newVarianceData.explanation || 'Varian biaya dicatat dari evaluasi batch produksi MES.',
    };

    setVariances([newVarItem, ...variances]);
    setIsAddVarianceOpen(false);
    setCostingSuccessMessage(`Analisis varian untuk batch "${newVarianceData.batchCode}" berhasil dicatat!`);
    setTimeout(() => setCostingSuccessMessage(null), 4000);
  };

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [isAddCoaOpen, setIsAddCoaOpen] = useState(false);
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);
  const [isBankRecOpen, setIsBankRecOpen] = useState(false);
  const [selectedBankForRec, setSelectedBankForRec] = useState<BankAccount | null>(null);
  const [bankRecStatementVal, setBankRecStatementVal] = useState<number>(0);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState<string>('Analisis Cash Flow dan Efisiensi COGM Pabrik Kosmetik');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New COA Form
  const [newCoaData, setNewCoaData] = useState({
    code: '',
    name: '',
    category: 'Asset' as ChartOfAccount['category'],
    subCategory: 'Current Assets',
    balanceType: 'Debit' as 'Debit' | 'Credit',
  });

  // New Journal Form
  const [newJournalData, setNewJournalData] = useState({
    description: '',
    sourceModule: 'Manual' as JournalEntry['sourceModule'],
    sourceReference: 'JV-MANUAL',
    lines: [
      { accountCode: '1120-01', accountName: 'Bank BCA Operasional (IDR)', debitIdr: 100000000, creditIdr: 0, memo: 'Setoran Modal / DP Maklon' },
      { accountCode: '4110-01', accountName: 'Pendapatan Maklon Skincare & Serum', debitIdr: 0, creditIdr: 100000000, memo: 'Pendapatan Diterima di Awal' },
    ],
  });
  const [journalValidationError, setJournalValidationError] = useState<string | null>(null);

  // Computed Totals for Dashboard
  const totalCashBank = banks.reduce((acc, curr) => acc + curr.bookBalanceIdr, 0);
  const totalArRemaining = arList.reduce((acc, curr) => acc + curr.remainingAmountIdr, 0);
  const totalApRemaining = apList.reduce((acc, curr) => acc + curr.remainingAmountIdr, 0);

  const revenueTotal = coaList.filter((c) => c.category === 'Revenue').reduce((acc, curr) => acc + curr.balanceIdr, 0);
  const cogsTotal = coaList.filter((c) => c.category === 'COGS').reduce((acc, curr) => acc + curr.balanceIdr, 0);
  const grossProfit = revenueTotal - cogsTotal;
  const opexTotal = coaList.filter((c) => c.category === 'Expense').reduce((acc, curr) => acc + curr.balanceIdr, 0);
  const netProfit = grossProfit - opexTotal;

  // Add COA Handler
  const handleAddCoa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoaData.code || !newCoaData.name) return;

    const newAccount: ChartOfAccount = {
      id: `coa-${Date.now()}`,
      code: newCoaData.code,
      name: newCoaData.name,
      category: newCoaData.category,
      subCategory: newCoaData.subCategory,
      balanceType: newCoaData.balanceType,
      balanceIdr: 0,
      isActive: true,
      isHeader: false,
    };

    setCoaList([newAccount, ...coaList]);
    setIsAddCoaOpen(false);
    setNewCoaData({ code: '', name: '', category: 'Asset', subCategory: 'Current Assets', balanceType: 'Debit' });
  };

  // Add Journal Line
  const handleAddJournalLine = () => {
    setNewJournalData({
      ...newJournalData,
      lines: [
        ...newJournalData.lines,
        { accountCode: '6110-01', accountName: 'Beban Gaji Manajemen & QC R&D', debitIdr: 0, creditIdr: 0, memo: '' },
      ],
    });
  };

  // Post New Journal Handler
  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setJournalValidationError(null);

    let totDebit = 0;
    let totCredit = 0;
    newJournalData.lines.forEach((l) => {
      totDebit += Number(l.debitIdr || 0);
      totCredit += Number(l.creditIdr || 0);
    });

    if (Math.abs(totDebit - totCredit) > 0.01) {
      setJournalValidationError(`Journal tidak seimbang! Total Debit (IDR ${totDebit.toLocaleString()}) harus sama dengan Total Kredit (IDR ${totCredit.toLocaleString()}).`);
      return;
    }

    const newEntry: JournalEntry = {
      id: `JE-${Date.now()}`,
      voucherNumber: `JV/2026/08/${String(journals.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().substring(0, 10),
      period: '2026-08',
      sourceModule: newJournalData.sourceModule,
      sourceReference: newJournalData.sourceReference,
      description: newJournalData.description || 'Manual Journal Posting',
      totalDebitIdr: totDebit,
      totalCreditIdr: totCredit,
      status: 'Posted',
      postedBy: 'Accounting User',
      postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lines: newJournalData.lines.map((l, i) => ({
        id: `jl-${i}-${Date.now()}`,
        accountCode: l.accountCode,
        accountName: coaList.find((c) => c.code === l.accountCode)?.name || l.accountName || 'Account',
        debitIdr: Number(l.debitIdr || 0),
        creditIdr: Number(l.creditIdr || 0),
        memo: l.memo || newJournalData.description,
      })),
    };

    setJournals([newEntry, ...journals]);
    setIsNewJournalOpen(false);
  };

  // Depreciation Run Trigger
  const handleRunDepreciation = () => {
    let totDep = 0;
    const updatedAssets = assets.map((a) => {
      const updatedAccum = a.accumulatedDepreciationIdr + a.monthlyDepreciationIdr;
      const updatedBook = Math.max(0, a.acquisitionCostIdr - updatedAccum);
      totDep += a.monthlyDepreciationIdr;
      return {
        ...a,
        accumulatedDepreciationIdr: updatedAccum,
        bookValueIdr: updatedBook,
      };
    });

    setAssets(updatedAssets);

    const depJournal: JournalEntry = {
      id: `JE-DEP-${Date.now()}`,
      voucherNumber: `JV/DEP/2026/08/${journals.length + 1}`,
      date: new Date().toISOString().substring(0, 10),
      period: '2026-08',
      sourceModule: 'Maintenance',
      sourceReference: 'DEP-RUN-AUTOMATED',
      description: 'Penyusutan Bulanan Aset Tetap Mesin Produksi & Lab QC',
      totalDebitIdr: totDep,
      totalCreditIdr: totDep,
      status: 'Posted',
      postedBy: 'Automated Depreciation Engine',
      postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lines: [
        { id: 'dep-l1', accountCode: '6140-01', accountName: 'Beban Penyusutan Aset Tetap Pabrik', debitIdr: totDep, creditIdr: 0, memo: 'Run Penyusutan Aset' },
        { id: 'dep-l2', accountCode: '1220-01', accountName: 'Akumulasi Penyusutan Mesin Produksi', debitIdr: 0, creditIdr: totDep, memo: 'Akumulasi Penyusutan' },
      ],
    };

    setJournals([depJournal, ...journals]);
  };

  // AI Assistant Call
  const handleCallAiFinance = async () => {
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiPrompt,
          agentRole: 'CFO & Cost Accounting Specialist',
          erpContext: {
            revenueTotal,
            cogsTotal,
            grossProfit,
            netProfit,
            totalCashBank,
            totalArRemaining,
            totalApRemaining,
            variance: variances,
          },
        }),
      });

      const data = await res.json();
      setAiResponse(data.reply || 'Hasil analisis AI siap.');
    } catch (err: any) {
      setAiResponse('Gagal menghubungi AI Assistant. Menggunakan rekomendasi offline: Pertahankan Gross Margin di atas 60% dengan optimasi yield batch mixing.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <DollarSign className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Finance, Cost Accounting & General Ledger
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/40">
                    ENTERPRISE PROMPT 17
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Sistem Akuntansi Terpadu Multi-Company • Direct COGM Costing • Automatic GL Posting from MES, Purchasing, Sales & Maintenance
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddCoaOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2 text-xs font-bold border border-slate-700 transition-all"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Akun COA</span>
            </button>

            <button
              onClick={() => setIsNewJournalOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-4 py-2 text-xs font-extrabold shadow-lg transition-all"
            >
              <BookOpen className="h-4 w-4 text-slate-950" />
              <span>Posting Jurnal Baru</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          onWheel={(e) => {
            if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
          }}
          className="mt-6 flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-800/80 text-xs custom-scrollbar scroll-smooth touch-pan-x"
        >
          {[
            { id: 'dashboard', label: 'Ringkasan Keuangan', icon: PieChart },
            { id: 'coa', label: 'Chart of Accounts (COA)', icon: Layers },
            { id: 'journals', label: 'Buku Besar & Jurnal GL', icon: BookOpen },
            { id: 'ap-ar', label: 'Hutang & Piutang (AP/AR)', icon: CreditCard },
            { id: 'cash-bank', label: 'Kas & Rekening Bank', icon: Building2 },
            { id: 'costing', label: 'HPP / COGM & Yield Variance', icon: Calculator },
            { id: 'budget', label: 'Anggaran Cost Center', icon: Scale },
            { id: 'assets', label: 'Aset Tetap & Depresiasi', icon: ShieldAlert },
            { id: 'tax', label: 'Perpajakan (e-Faktur)', icon: Receipt },
            { id: 'statements', label: 'Laporan Keuangan P&L', icon: FileText },
            { id: 'closing', label: 'Penutupan Periode', icon: Lock },
            { id: 'ai-finance', label: 'AI Finance Assistant', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------- TAB 1: DASHBOARD ----------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Saldo Kas & Bank</span>
                <Building2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-xl font-black text-white">{formatCurrencyIDR(totalCashBank)}</p>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Liquid & Reconciled Bank BCA & Mandiri</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Total Pendapatan Maklon (YTD)</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-xl font-black text-emerald-300">{formatCurrencyIDR(revenueTotal)}</p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <span>Gross Margin: {((grossProfit / (revenueTotal || 1)) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Piutang Usaha Maklon (AR)</span>
                <Receipt className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-xl font-black text-amber-300">{formatCurrencyIDR(totalArRemaining)}</p>
              <div className="flex items-center space-x-1 text-[11px] text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>3 Invoice Tagihan Aktif</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Hutang Supplier Bahan (AP)</span>
                <CreditCard className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-xl font-black text-rose-300">{formatCurrencyIDR(totalApRemaining)}</p>
              <div className="flex items-center space-x-1 text-[11px] text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Term of Payment 30 Hari</span>
              </div>
            </div>
          </div>

          {/* COGM Product & Realtime P&L Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-400" />
                  Struktur Biaya Produksi & HPP (COGM) Kosmetik
                </h2>
                <span className="text-xs text-slate-400 font-mono">B-2026-0801 Active Batch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Bahan Aktif Kimia:</span>
                  <p className="font-bold text-white text-sm mt-1">IDR 95.000 / Kg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Kemasan Airless Pump:</span>
                  <p className="font-bold text-white text-sm mt-1">IDR 32.000 / Pcs</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Tenaga Kerja Cleanroom:</span>
                  <p className="font-bold text-white text-sm mt-1">IDR 8.500 / Kg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Tarif Mesin Homogenizer:</span>
                  <p className="font-bold text-white text-sm mt-1">IDR 4.300 / Jam</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Listrik Utility HVAC:</span>
                  <p className="font-bold text-white text-sm mt-1">IDR 1.800 / Kg</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                  <span className="text-emerald-300 font-bold">Standard COGM:</span>
                  <p className="font-black text-emerald-400 text-sm mt-1">IDR 145.000 / Kg</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200">Total Operational Net Profit (YTD):</span>
                  <p className="text-slate-400">Pendapatan Bersih Setelah Seluruh Beban Operasional & HPP</p>
                </div>
                <span className="text-lg font-black text-emerald-400">{formatCurrencyIDR(netProfit)}</span>
              </div>
            </div>

            {/* AI Recommendation Widget */}
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h3 className="text-sm font-extrabold text-white">AI Finance Assistant Insight</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Hasil analisis Variance Batch B-2026-0801 menunjukkan **Favorable Yield Variance sebesar IDR 3.9 Juta** karena tingkat yield mixing emulsi mencapai 98.8%. Rekomendasi: Negosiasikan term pembayaran supplier BASF untuk diskon potongan awal 2%."
              </p>
              <button
                onClick={() => setActiveTab('ai-finance')}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-black transition-all shadow-md"
              >
                Buka AI Finance Assistant →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: CHART OF ACCOUNTS (COA) ----------------- */}
      {activeTab === 'coa' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari kode atau nama akun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">Semua Kategori</option>
                <option value="Asset">Aset (Assets)</option>
                <option value="Liability">Hutang (Liabilities)</option>
                <option value="Equity">Modal (Equity)</option>
                <option value="Revenue">Pendapatan (Revenue)</option>
                <option value="COGS">HPP (COGS)</option>
                <option value="Expense">Beban (Expenses)</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Kode Akun</th>
                    <th className="p-3.5">Nama Akun COA</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Sub-Kategori</th>
                    <th className="p-3.5 text-center">Posisi</th>
                    <th className="p-3.5 text-right">Saldo Saat Ini (IDR)</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {coaList
                    .filter((c) => categoryFilter === 'All' || c.category === categoryFilter)
                    .filter((c) => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((coa) => (
                      <tr key={coa.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-emerald-400">{coa.code}</td>
                        <td className="p-3.5 font-bold text-white">{coa.name}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              coa.category === 'Asset'
                                ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                                : coa.category === 'Revenue'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : coa.category === 'COGS'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {coa.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{coa.subCategory}</td>
                        <td className="p-3.5 text-center">
                          <span className={`font-mono font-bold ${coa.balanceType === 'Debit' ? 'text-teal-400' : 'text-purple-400'}`}>
                            {coa.balanceType}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-100">
                          {formatCurrencyIDR(coa.balanceIdr)}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            Aktif
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

      {/* ----------------- TAB 3: GENERAL LEDGER & JOURNALS ----------------- */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Daftar Jurnal Transaksi & Double-Entry Ledger
            </h2>

            <div className="space-y-4">
              {journals.map((j) => (
                <div key={j.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-500/40">
                        {j.voucherNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{j.date}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                        Modul: {j.sourceModule}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">Ref: {j.sourceReference}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {j.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-medium">{j.description}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold">
                        <tr>
                          <th className="p-2">Kode Akun</th>
                          <th className="p-2">Nama Akun</th>
                          <th className="p-2">Memo / Keterangan</th>
                          <th className="p-2 text-right">Debit (IDR)</th>
                          <th className="p-2 text-right">Kredit (IDR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {j.lines.map((l) => (
                          <tr key={l.id}>
                            <td className="p-2 font-mono text-emerald-400 font-bold">{l.accountCode}</td>
                            <td className="p-2 font-medium text-white">{l.accountName}</td>
                            <td className="p-2 text-slate-400 text-[11px]">{l.memo}</td>
                            <td className="p-2 text-right font-mono font-bold text-teal-300">
                              {l.debitIdr > 0 ? formatCurrencyIDR(l.debitIdr) : '-'}
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-purple-300">
                              {l.creditIdr > 0 ? formatCurrencyIDR(l.creditIdr) : '-'}
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
        </div>
      )}

      {/* ----------------- TAB 4: AP & AR ----------------- */}
      {activeTab === 'ap-ar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AP Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-rose-400" />
                  Accounts Payable (Hutang Supplier)
                </h3>
                <span className="text-xs font-mono text-rose-300 font-bold">Total: {formatCurrencyIDR(totalApRemaining)}</span>
              </div>

              <div className="space-y-3">
                {apList.map((ap) => (
                  <div key={ap.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ap.supplierName}</span>
                      <span className="font-mono text-rose-300 font-bold">{formatCurrencyIDR(ap.remainingAmountIdr)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Inv: {ap.invoiceNumber} (Jatuh Tempo: {ap.dueDate})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                        {ap.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AR Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-400" />
                  Accounts Receivable (Piutang Maklon)
                </h3>
                <span className="text-xs font-mono text-emerald-300 font-bold">Total: {formatCurrencyIDR(totalArRemaining)}</span>
              </div>

              <div className="space-y-3">
                {arList.map((ar) => (
                  <div key={ar.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ar.customerName}</span>
                      <span className="font-mono text-emerald-300 font-bold">{formatCurrencyIDR(ar.remainingAmountIdr)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Inv: {ar.invoiceNumber} (Jatuh Tempo: {ar.dueDate})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {ar.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 5: CASH & BANK ----------------- */}
      {activeTab === 'cash-bank' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banks.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{b.bankName}</h3>
                      <p className="text-xs text-slate-400 font-mono">No. Rek: {b.accountNumber}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {b.currency}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Saldo Buku GL (Book Balance):</span>
                    <span className="font-mono font-bold text-white">{formatCurrencyIDR(b.bookBalanceIdr)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Rekonsiliasi Terakhir:</span>
                    <span className="font-mono text-emerald-400 text-[11px]">{b.lastReconciledAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBankForRec(b);
                    setBankRecStatementVal(b.bookBalanceIdr);
                    setIsBankRecOpen(true);
                  }}
                  className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 text-xs font-bold transition-all border border-slate-700"
                >
                  Jalankan Rekonsiliasi Bank
                </button>
              </div>
            ))}
          </div>

          {/* Petty Cash Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Transaksi Kas Kecil Cleanroom (Petty Cash)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">No. Transaksi</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Keterangan Pengeluaran</th>
                    <th className="p-3 text-right">Jumlah (IDR)</th>
                    <th className="p-3 text-center">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pettyCash.map((pc) => (
                    <tr key={pc.id}>
                      <td className="p-3 font-mono font-bold text-amber-300">{pc.txNumber}</td>
                      <td className="p-3 font-mono text-slate-400">{pc.date}</td>
                      <td className="p-3 font-bold text-white">{pc.category}</td>
                      <td className="p-3 text-slate-300">{pc.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-300">{formatCurrencyIDR(pc.amountIdr)}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {pc.status} ({pc.approvedBy})
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

      {/* ----------------- TAB 6: COSTING & VARIANCE ----------------- */}
      {activeTab === 'costing' && (
        <div className="space-y-6">
          {/* Toast / Alert Message */}
          {costingSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{costingSuccessMessage}</span>
              </div>
              <button onClick={() => setCostingSuccessMessage(null)} className="text-emerald-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Sub Header & Action Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-400" />
                HPP / COGM & Dynamic Costing Engine
              </h2>
              <p className="text-xs text-slate-400">
                Simulasi HPP Produk Kosmetik (Direct Materials, Packaging, Labor, Energy Utility, Overhead, Yield Loss) & Analisis Varian MES
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddProductCostingOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Product Costing Baru</span>
              </button>
              <button
                onClick={() => setIsAddVarianceOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Catat Varian MES</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar for Costing Module */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setCostingSubTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                costingSubTab === 'simulator'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="h-4 w-4 text-emerald-400" />
              <span>1. Simulasi & Kalkulator COGM Interaktif</span>
            </button>

            <button
              onClick={() => setCostingSubTab('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                costingSubTab === 'list'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>2. Daftar HPP Produk ({productCostings.length})</span>
            </button>

            <button
              onClick={() => setCostingSubTab('variance')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                costingSubTab === 'variance'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>3. Analisis Varian Biaya MES ({variances.length})</span>
            </button>
          </div>

          {/* SUB-TAB 1: SIMULATOR & KALKULATOR COGM */}
          {costingSubTab === 'simulator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Form Inputs */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Parameter Input Simulasi HPP Kosmetik
                  </h3>
                  <span className="text-[11px] text-slate-400">Pabrik & Maklon Formulation Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Kode Produk / Formula:</label>
                    <input
                      type="text"
                      value={simulatorForm.productCode}
                      onChange={(e) => setSimulatorForm({ ...simulatorForm, productCode: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Nama Produk Kosmetik:</label>
                    <input
                      type="text"
                      value={simulatorForm.productName}
                      onChange={(e) => setSimulatorForm({ ...simulatorForm, productName: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Ukuran Batch Produksi (Kg):</label>
                    <input
                      type="number"
                      value={simulatorForm.batchSizeKg}
                      onChange={(e) => setSimulatorForm({ ...simulatorForm, batchSizeKg: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Output Kemasan per Batch (Pcs):</label>
                    <input
                      type="number"
                      value={simulatorForm.itemsPerBatch}
                      onChange={(e) => setSimulatorForm({ ...simulatorForm, itemsPerBatch: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Direct Costs Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    1. Direct Materials & Packaging Cost
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Bahan Aktif Kimia (IDR/Kg):</label>
                      <input
                        type="number"
                        value={simulatorForm.rawChemicalPerKg}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, rawChemicalPerKg: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Kemasan Primer (IDR/Pcs):</label>
                      <input
                        type="number"
                        value={simulatorForm.primaryPackagingPerPcs}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, primaryPackagingPerPcs: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Kemasan Sekunder (IDR/Pcs):</label>
                      <input
                        type="number"
                        value={simulatorForm.secondaryPackagingPerPcs}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, secondaryPackagingPerPcs: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Labor & Machine Utilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    2. Direct Labor & Machine Utilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Tenaga Kerja Cleanroom (IDR/Kg):</label>
                      <input
                        type="number"
                        value={simulatorForm.directLaborPerKg}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, directLaborPerKg: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Listrik Mesin Homogenizer (IDR/Kg):</label>
                      <input
                        type="number"
                        value={simulatorForm.machineUtilityPerKg}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, machineUtilityPerKg: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Overhead & Yield Scrap Allocation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    3. Overhead Pabrik & Yield Waste Allowance
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Alokasi Overhead (%):</label>
                      <input
                        type="number"
                        value={simulatorForm.overheadPct}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, overheadPct: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Estimasi Waste Yield (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={simulatorForm.wasteYieldPct}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, wasteYieldPct: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Target Harga Maklon (IDR/Pcs):</label>
                      <input
                        type="number"
                        value={simulatorForm.targetPricePerUnit}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, targetPricePerUnit: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveSimulatedCosting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 py-3 text-xs font-black transition-all shadow-lg cursor-pointer"
                  >
                    💾 Simpan Hasil Simulasi ke Product Costing
                  </button>
                  <button
                    onClick={() => {
                      setAiPrompt(`Analisis optimasi struktur HPP COGM untuk produk ${simulatorForm.productName} dengan bahan IDR ${simulatorForm.rawChemicalPerKg}/Kg dan kemasan IDR ${simulatorForm.primaryPackagingPerPcs}/Pcs.`);
                      setActiveTab('ai-finance');
                    }}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-4 py-3 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 inline mr-1 text-amber-400" />
                    Optimasi AI
                  </button>
                </div>
              </div>

              {/* Right Column: Live Results Dashboard */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 space-y-5 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Live Calculation Result</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Automated ERP Costing
                    </span>
                  </div>

                  {/* High Level Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px]">COGM HPP per Kg:</span>
                      <p className="font-mono text-lg font-black text-emerald-400">{formatCurrencyIDR(Math.round(calcCogmPerKg))}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px]">COGM HPP per Pcs/Botol:</span>
                      <p className="font-mono text-lg font-black text-teal-300">{formatCurrencyIDR(Math.round(calcCogmPerUnit))}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total HPP per Batch ({simulatorForm.batchSizeKg} Kg):</span>
                      <span className="font-mono font-bold text-white">{formatCurrencyIDR(Math.round(calcTotalCogmBatch))}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Estimasi Total Pendapatan Maklon:</span>
                      <span className="font-mono font-bold text-emerald-300">{formatCurrencyIDR(Math.round(calcTotalRevenue))}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="font-bold text-slate-200">Gross Profit Maklon per Batch:</span>
                      <span className="font-mono text-base font-black text-amber-300">{formatCurrencyIDR(Math.round(calcGrossProfit))}</span>
                    </div>
                  </div>

                  {/* Margin & Markup Highlights */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border text-center ${
                      calcMarginPct >= 50
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : calcMarginPct >= 30
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    }`}>
                      <span className="text-[11px] block">Gross Margin %</span>
                      <span className="text-xl font-black">{calcMarginPct.toFixed(1)}%</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 block">Markup Factor</span>
                      <span className="text-xl font-black text-white">
                        {(calcTotalRevenue / (calcTotalCogmBatch || 1)).toFixed(2)}x
                      </span>
                    </div>
                  </div>

                  {/* Cost Breakdown Progress Bar */}
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Komposisi Struktur Biaya:</span>
                      <span>100% COGM</span>
                    </div>

                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800">
                      <div
                        title={`Bahan Kimia Bulk: ${((calcRawTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%`}
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(calcRawTotal / (calcTotalCogmBatch || 1)) * 100}%` }}
                      />
                      <div
                        title={`Kemasan: ${((calcPkgTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%`}
                        className="bg-teal-400 h-full"
                        style={{ width: `${(calcPkgTotal / (calcTotalCogmBatch || 1)) * 100}%` }}
                      />
                      <div
                        title={`Labor: ${((calcLaborTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%`}
                        className="bg-cyan-400 h-full"
                        style={{ width: `${(calcLaborTotal / (calcTotalCogmBatch || 1)) * 100}%` }}
                      />
                      <div
                        title={`Mesin & Utility: ${((calcMachineTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%`}
                        className="bg-amber-400 h-full"
                        style={{ width: `${(calcMachineTotal / (calcTotalCogmBatch || 1)) * 100}%` }}
                      />
                      <div
                        title={`Overhead & Yield Loss: ${(((calcOverhead + calcWasteLoss) / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%`}
                        className="bg-indigo-400 h-full"
                        style={{ width: `${((calcOverhead + calcWasteLoss) / (calcTotalCogmBatch || 1)) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Chemicals: {((calcRawTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400 inline-block" /> Packaging: {((calcPkgTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Direct Labor: {((calcLaborTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Machine Energy: {((calcMachineTotal / (calcTotalCogmBatch || 1)) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: DAFTAR HPP PRODUK */}
          {costingSubTab === 'list' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {productCostings.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-400">{p.productCode}</span>
                        <h3 className="text-base font-bold text-white">{p.productName}</h3>
                        <p className="text-[11px] text-slate-400">Ukuran Batch Standard: {p.batchSizeKg} Kg</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40 inline-block">
                          Margin: {p.marginPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">Bahan Baku Chemical Bulk:</span>
                        <p className="font-bold text-white mt-0.5">{formatCurrencyIDR(p.rawMaterialCostIdr)} / Kg</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">Kemasan Botol/Pump/Box:</span>
                        <p className="font-bold text-white mt-0.5">{formatCurrencyIDR(p.packagingCostIdr)} / Pcs</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">Tenaga Kerja Langsung:</span>
                        <p className="font-bold text-white mt-0.5">{formatCurrencyIDR(p.directLaborCostIdr)} / Kg</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400">Jam Mesin & Listrik HVAC:</span>
                        <p className="font-bold text-white mt-0.5">{formatCurrencyIDR(p.machineCostIdr)} / Kg</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs font-bold">
                      <div>
                        <span className="text-emerald-300 block">Actual COGM Output:</span>
                        <span className="text-[11px] text-slate-400 font-normal">Standard COGM: {formatCurrencyIDR(p.standardCogmPerKgIdr)} / Kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 text-sm font-mono block">{formatCurrencyIDR(p.actualCogmPerKgIdr)} / Kg</span>
                        <span className={`text-[10px] font-mono ${p.variancePerKgIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.variancePerKgIdr <= 0 ? 'Favorable (-' + formatCurrencyIDR(Math.abs(p.variancePerKgIdr)) + ')' : 'Unfavorable (+' + formatCurrencyIDR(p.variancePerKgIdr) + ')'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSimulatorForm({
                          productCode: p.productCode,
                          productName: p.productName,
                          batchSizeKg: p.batchSizeKg,
                          itemsPerBatch: p.batchSizeKg * 33,
                          rawChemicalPerKg: p.rawMaterialCostIdr,
                          primaryPackagingPerPcs: Math.round(p.packagingCostIdr * 0.8),
                          secondaryPackagingPerPcs: Math.round(p.packagingCostIdr * 0.2),
                          directLaborPerKg: p.directLaborCostIdr,
                          machineUtilityPerKg: p.machineCostIdr,
                          overheadPct: 8,
                          wasteYieldPct: 2.0,
                          targetPricePerUnit: Math.round(p.actualCogmPerKgIdr * 0.35),
                        });
                        setCostingSubTab('simulator');
                      }}
                      className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      🧮 Buka Produk Ini di COGM Simulator →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: ANALISIS VARIAN MES */}
          {costingSubTab === 'variance' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Analisis Varian Biaya Batch MES & Scrap Efficiency
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {variances.length} Batch Variance Evaluated
                  </span>
                </div>

                <div className="space-y-3">
                  {variances.map((v) => {
                    const isFavorable = v.totalVarianceIdr <= 0;
                    return (
                      <div key={v.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div>
                            <span className="font-mono font-extrabold text-amber-400 mr-2">{v.batchCode}</span>
                            <span className="font-bold text-white">{v.productName}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                            isFavorable ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}>
                            {isFavorable ? 'Favorable: ' + formatCurrencyIDR(Math.abs(v.totalVarianceIdr)) : 'Unfavorable: +' + formatCurrencyIDR(v.totalVarianceIdr)}
                          </span>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Material Price (MPV):</span>
                            <span className={v.materialPriceVarianceIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {formatCurrencyIDR(v.materialPriceVarianceIdr)}
                            </span>
                          </div>

                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Material Usage (MUV):</span>
                            <span className={v.materialUsageVarianceIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {formatCurrencyIDR(v.materialUsageVarianceIdr)}
                            </span>
                          </div>

                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Labor Variance:</span>
                            <span className={v.laborVarianceIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {formatCurrencyIDR(v.laborVarianceIdr)}
                            </span>
                          </div>

                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Machine OEE Var:</span>
                            <span className={v.machineEfficiencyVarianceIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {formatCurrencyIDR(v.machineEfficiencyVarianceIdr)}
                            </span>
                          </div>

                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Yield Scrap Var:</span>
                            <span className={v.yieldVarianceIdr <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {formatCurrencyIDR(v.yieldVarianceIdr)}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed italic text-[11px]">"{v.explanation}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 7: BUDGET ----------------- */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-bold">{b.costCenterCode}</span>
                    <h3 className="text-sm font-bold text-white">{b.costCenterName}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Anggaran Tahunan 2026:</span>
                    <span className="font-mono text-white font-bold">{formatCurrencyIDR(b.annualBudget2026Idr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Realisasi YTD:</span>
                    <span className="font-mono text-emerald-300 font-bold">{formatCurrencyIDR(b.ytdActualExpenseIdr)}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                  />
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">Terpakai: {b.utilizationPercentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 8: FIXED ASSETS ----------------- */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Aset Tetap Pabrik & Jadwal Depresiasi</h3>
              <p className="text-xs text-slate-400">Terintegrasi langsung dengan modul Maintenance EAM/CMMS</p>
            </div>

            <button
              onClick={handleRunDepreciation}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-extrabold transition-all shadow-md"
            >
              Jalankan Depresiasi Bulanan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
                <span className="font-mono text-xs font-bold text-emerald-400">{a.assetCode}</span>
                <h4 className="text-sm font-bold text-white">{a.assetName}</h4>

                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Harga Perolehan:</span>
                    <span>{formatCurrencyIDR(a.acquisitionCostIdr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Akumulasi Depresiasi:</span>
                    <span className="text-rose-300">{formatCurrencyIDR(a.accumulatedDepreciationIdr)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-emerald-300">
                    <span>Nilai Buku (Book Value):</span>
                    <span>{formatCurrencyIDR(a.bookValueIdr)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 9: TAX ----------------- */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">PPN Masukan (Input Tax)</span>
              <p className="text-lg font-black text-emerald-400 font-mono">{formatCurrencyIDR(9900000)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">PPN Keluaran (Output Tax)</span>
              <p className="text-lg font-black text-amber-400 font-mono">{formatCurrencyIDR(33000000)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 space-y-1">
              <span className="text-xs text-emerald-300 font-bold">Kurang Bayar PPN Neto</span>
              <p className="text-lg font-black text-emerald-300 font-mono">{formatCurrencyIDR(23100000)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white">Daftar e-Faktur Pajak Terverifikasi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Nomor e-Faktur</th>
                    <th className="p-3">Jenis Pajak</th>
                    <th className="p-3">Partner Bisnis</th>
                    <th className="p-3 text-right">DPP (IDR)</th>
                    <th className="p-3 text-right">Nilai Pajak (IDR)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {taxes.map((t) => (
                    <tr key={t.id}>
                      <td className="p-3 font-mono font-bold text-white">{t.taxInvoiceNumber}</td>
                      <td className="p-3 text-slate-300">{t.type}</td>
                      <td className="p-3 font-bold text-white">{t.partnerName}</td>
                      <td className="p-3 text-right font-mono">{formatCurrencyIDR(t.taxableBaseAmountIdr)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">{formatCurrencyIDR(t.taxAmountIdr)}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {t.status}
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

      {/* ----------------- TAB 10: STATEMENTS ----------------- */}
      {activeTab === 'statements' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Laporan Laba Rugi (Profit & Loss Statement)</h2>
                <p className="text-xs text-slate-400">PT Paragonia Cosmetic Industri • Periode YTD 2026</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Audited Standard IFRS/PSAK
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-white text-sm border-b border-slate-800 pb-1">
                  <span>PENDAPATAN USAHA MAKLON</span>
                  <span className="font-mono text-emerald-400">{formatCurrencyIDR(revenueTotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-white text-sm border-b border-slate-800 pb-1">
                  <span>HARGA POKOK PENJUALAN (COGS / HPP)</span>
                  <span className="font-mono text-rose-400">({formatCurrencyIDR(cogsTotal)})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between font-black text-sm text-emerald-300">
                <span>LABA KOTOR (GROSS PROFIT)</span>
                <span className="font-mono">{formatCurrencyIDR(grossProfit)}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-white text-sm border-b border-slate-800 pb-1">
                  <span>TOTAL BEBAN OPERASIONAL</span>
                  <span className="font-mono text-rose-400">({formatCurrencyIDR(opexTotal)})</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex justify-between font-black text-base text-emerald-300">
                <span>LABA BERSIH OPERASIONAL (NET PROFIT)</span>
                <span className="font-mono">{formatCurrencyIDR(netProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 11: CLOSING ----------------- */}
      {activeTab === 'closing' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-400" />
                  Status Penutupan Periode Akuntansi (Period Closing)
                </h3>
                <p className="text-xs text-slate-400">Periode Aktif: {closing.period}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-950 text-rose-300 border border-rose-500/40">
                {closing.status} ({closing.closedBy})
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white">Checklist Syarat Closing Month-End:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Rekonsiliasi Bank BCA & Mandiri Selesai</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Penilaian Persediaan Bahan Baku (FIFO) Valid</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Penyusutan Aset Tetap Bulan Ini Terposting</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Keseimbangan Debit & Kredit Trial Balance Checked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 12: AI FINANCE ASSISTANT ----------------- */}
      {activeTab === 'ai-finance' && (
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
            <div>
              <h2 className="text-base font-black text-white">AI Finance Assistant (Gemini Powered)</h2>
              <p className="text-xs text-slate-400">
                Deteksi Anomali Transaksi, Prediksi Cash Flow, & Analisis HPP COGM Kosmetik
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300">Prompt / Pertanyaan Keuangan:</label>
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleCallAiFinance}
              disabled={isAiLoading}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-6 py-2.5 text-xs font-black shadow-lg transition-all"
            >
              {isAiLoading ? 'Menganalisis Data Keuangan...' : 'Jalankan Analisis AI Finance'}
            </button>
          </div>

          {aiResponse && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Rekomendasi CFO AI:
              </span>
              <p className="whitespace-pre-line leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add COA */}
      {isAddCoaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Tambah Akun COA Baru</h3>
              <button onClick={() => setIsAddCoaOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoa} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold">Kode Akun (Contoh: 1120-03)</label>
                <input
                  type="text"
                  required
                  placeholder="1120-03"
                  value={newCoaData.code}
                  onChange={(e) => setNewCoaData({ ...newCoaData, code: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold">Nama Akun</label>
                <input
                  type="text"
                  required
                  placeholder="Kas Operasional Cabang Surabaya"
                  value={newCoaData.name}
                  onChange={(e) => setNewCoaData({ ...newCoaData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold">Kategori</label>
                  <select
                    value={newCoaData.category}
                    onChange={(e) => setNewCoaData({ ...newCoaData, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                  >
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="COGS">COGS</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold">Posisi Saldo</label>
                  <select
                    value={newCoaData.balanceType}
                    onChange={(e) => setNewCoaData({ ...newCoaData, balanceType: e.target.value as any })}
                    className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                  >
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 font-bold transition-all mt-2"
              >
                Simpan Akun COA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Journal Entry */}
      {isNewJournalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                Posting Jurnal Transaksi Baru (Double-Entry)
              </h3>
              <button onClick={() => setIsNewJournalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {journalValidationError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300">
                {journalValidationError}
              </div>
            )}

            <form onSubmit={handlePostJournal} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold">Deskripsi Transaksi Jurnal</label>
                <input
                  type="text"
                  required
                  placeholder="Setoran Kas Modal / Pembayaran DP Maklon"
                  value={newJournalData.description}
                  onChange={(e) => setNewJournalData({ ...newJournalData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Baris Debit & Kredit Jurnal:</span>
                  <button
                    type="button"
                    onClick={handleAddJournalLine}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    + Tambah Baris Jurnal
                  </button>
                </div>

                {newJournalData.lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="col-span-5">
                      <select
                        value={line.accountCode}
                        onChange={(e) => {
                          const updated = [...newJournalData.lines];
                          updated[idx].accountCode = e.target.value;
                          setNewJournalData({ ...newJournalData, lines: updated });
                        }}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-white text-xs"
                      >
                        {coaList.map((c) => (
                          <option key={c.id} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Debit IDR"
                        value={line.debitIdr}
                        onChange={(e) => {
                          const updated = [...newJournalData.lines];
                          updated[idx].debitIdr = Number(e.target.value);
                          setNewJournalData({ ...newJournalData, lines: updated });
                        }}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="col-span-4">
                      <input
                        type="number"
                        placeholder="Kredit IDR"
                        value={line.creditIdr}
                        onChange={(e) => {
                          const updated = [...newJournalData.lines];
                          updated[idx].creditIdr = Number(e.target.value);
                          setNewJournalData({ ...newJournalData, lines: updated });
                        }}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 py-3 font-extrabold transition-all mt-2"
              >
                Posting Jurnal ke Buku Besar (GL)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bank Reconciliation */}
      {isBankRecOpen && selectedBankForRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Rekonsiliasi Bank: {selectedBankForRec.bankName}</h3>
              <button onClick={() => setIsBankRecOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Saldo Buku GL (Book Balance):</span>
                <p className="font-bold text-white text-base font-mono">{formatCurrencyIDR(selectedBankForRec.bookBalanceIdr)}</p>
              </div>

              <div>
                <label className="text-slate-300 font-bold">Masukkan Saldo Rekening Koran (Statement Balance):</label>
                <input
                  type="number"
                  value={bankRecStatementVal}
                  onChange={(e) => setBankRecStatementVal(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={() => {
                  const updatedBanks = banks.map((b) =>
                    b.id === selectedBankForRec.id
                      ? {
                          ...b,
                          bankStatementBalanceIdr: bankRecStatementVal,
                          unreconciledAmountIdr: Math.abs(b.bookBalanceIdr - bankRecStatementVal),
                          lastReconciledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        }
                      : b
                  );
                  setBanks(updatedBanks);
                  setIsBankRecOpen(false);
                }}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 font-bold transition-all"
              >
                Selesaikan Rekonsiliasi Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Product Costing */}
      {isAddProductCostingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-400" />
                Tambah Product Costing HPP Baru
              </h3>
              <button onClick={() => setIsAddProductCostingOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductCosting} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kode Produk / Formula:</label>
                  <input
                    type="text"
                    required
                    placeholder="FG-CRM-2026"
                    value={newCostingData.productCode}
                    onChange={(e) => setNewCostingData({ ...newCostingData, productCode: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Ukuran Batch (Kg):</label>
                  <input
                    type="number"
                    required
                    value={newCostingData.batchSizeKg}
                    onChange={(e) => setNewCostingData({ ...newCostingData, batchSizeKg: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nama Produk Kosmetik:</label>
                <input
                  type="text"
                  required
                  placeholder="Moisturizing Day Cream Spf 30"
                  value={newCostingData.productName}
                  onChange={(e) => setNewCostingData({ ...newCostingData, productName: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Biaya Bulk Chemical (IDR/Kg):</label>
                  <input
                    type="number"
                    required
                    value={newCostingData.rawMaterialCostIdr}
                    onChange={(e) => setNewCostingData({ ...newCostingData, rawMaterialCostIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Biaya Kemasan (IDR/Pcs):</label>
                  <input
                    type="number"
                    required
                    value={newCostingData.packagingCostIdr}
                    onChange={(e) => setNewCostingData({ ...newCostingData, packagingCostIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Tenaga Kerja Langsung (IDR/Kg):</label>
                  <input
                    type="number"
                    required
                    value={newCostingData.directLaborCostIdr}
                    onChange={(e) => setNewCostingData({ ...newCostingData, directLaborCostIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Jam Mesin & Listrik (IDR/Kg):</label>
                  <input
                    type="number"
                    required
                    value={newCostingData.machineCostIdr}
                    onChange={(e) => setNewCostingData({ ...newCostingData, machineCostIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Harga Jual Maklon (IDR/Pcs):</label>
                <input
                  type="number"
                  value={newCostingData.targetSellingPriceIdr}
                  onChange={(e) => setNewCostingData({ ...newCostingData, targetSellingPriceIdr: Number(e.target.value) })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 py-3 font-extrabold transition-all mt-2 cursor-pointer"
              >
                Simpan Product Costing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Cost Variance */}
      {isAddVarianceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Catat Analisis Varian MES Batch Produksi
              </h3>
              <button onClick={() => setIsAddVarianceOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCostVariance} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kode Batch MES:</label>
                  <input
                    type="text"
                    required
                    placeholder="BATCH-2026-88"
                    value={newVarianceData.batchCode}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, batchCode: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Nama Produk:</label>
                  <input
                    type="text"
                    required
                    placeholder="Suncare Fluid Essence"
                    value={newVarianceData.productName}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, productName: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Material Price Variance MPV (IDR):</label>
                  <input
                    type="number"
                    value={newVarianceData.materialPriceVarianceIdr}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, materialPriceVarianceIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Material Usage Variance MUV (IDR):</label>
                  <input
                    type="number"
                    value={newVarianceData.materialUsageVarianceIdr}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, materialUsageVarianceIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Labor Efficiency Var (IDR):</label>
                  <input
                    type="number"
                    value={newVarianceData.laborVarianceIdr}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, laborVarianceIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Yield Scrap Variance (IDR):</label>
                  <input
                    type="number"
                    value={newVarianceData.yieldVarianceIdr}
                    onChange={(e) => setNewVarianceData({ ...newVarianceData, yieldVarianceIdr: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Penjelasan Analisis Varian Cost Accountant:</label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan catatan analisis penyimpangan biaya bahan baku atau efisiensi mesin..."
                  value={newVarianceData.explanation}
                  onChange={(e) => setNewVarianceData({ ...newVarianceData, explanation: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 font-extrabold transition-all mt-2 cursor-pointer"
              >
                Simpan Catatan Varian MES
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceExplorer;
