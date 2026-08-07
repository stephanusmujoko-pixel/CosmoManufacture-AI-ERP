import React, { useState } from 'react';
import {
  Factory,
  Calendar,
  TrendingUp,
  Boxes,
  Layers,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Search,
  Download,
  RefreshCw,
  Sliders,
  ShieldAlert,
  ArrowRightLeft,
  PieChart,
  BarChart3,
  UserCheck,
  FileText,
  Lock,
  Unlock,
  Play,
  Check,
  RotateCcw,
  DollarSign,
  PackageCheck,
  AlertCircle,
  Filter,
  Truck,
  FileCheck2,
  Bot,
  Zap,
  Activity,
  ChevronRight,
  ChevronDown,
  Printer,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import { formatCurrencyIDR } from '../lib/utils';

// Types for PPIC & MRP
export interface DemandForecastItem {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  salesOrderQty: number; // Firm Customer Orders
  forecastQty: number; // Statistical / Marketing Forecast
  totalDemandQty: number; // Firm + Forecast
  uom: string;
  safetyStockTarget: number;
  currentStock: number;
  netDemandQty: number;
  period: string; // e.g., 'Aug 2026'
  seasonalityFactor: number;
  status: 'Draft' | 'Approved' | 'In Production';
}

export interface MpsItem {
  id: string;
  mpsCode: string;
  productCode: string;
  productName: string;
  formulaCode: string;
  productionLine: 'Line A (Serum & Liquid)' | 'Line B (Cream & Emulsion)' | 'Line C (Tube Packaging)';
  plannedQtyPcs: number;
  plannedBatchKg: number;
  startDate: string;
  endDate: string;
  horizonPeriod: 'Daily' | 'Weekly' | 'Monthly';
  freezeStatus: 'Frozen' | 'Slotted' | 'Open Horizon';
  approvalStatus: 'Approved' | 'Pending Approval' | 'Draft';
  assignedMachine: string;
  priority: 'High (Rush Order)' | 'Normal' | 'Low';
}

export interface MrpResultItem {
  id: string;
  materialCode: string;
  materialName: string;
  materialType: 'Active Ingredient' | 'Emulsifier/Base' | 'Preservative' | 'Primary Packaging' | 'Secondary Packaging';
  grossRequirementKgOrPcs: number;
  availableStock: number;
  reservedStock: number;
  onOrderQty: number;
  netRequirementQty: number;
  uom: 'Kg' | 'Pcs' | 'Liters';
  leadTimeDays: number;
  supplierName: string;
  moqQty: number;
  recommendationType: 'Generate Purchase Requisition (PR)' | 'Generate Manufacturing Order (MO)' | 'Stock Sufficient' | 'Alternative Material Substitution';
  actionDueDate: string;
  estimatedCostIDR: number;
  status: 'Critical Shortage' | 'Order Needed' | 'Sufficient';
}

export interface CrpCapacityItem {
  id: string;
  machineCode: string;
  machineName: string;
  department: string;
  maxCapacityHoursPerWeek: number;
  allocatedHours: number;
  utilizationPercentage: number;
  laborRequiredOperators: number;
  laborAvailableOperators: number;
  shiftMode: 'Shift 1 (8h)' | 'Shift 1 & 2 (16h)' | '24h Full Shift (3 Shifts)';
  bottleneckStatus: 'Optimal' | 'Near Capacity' | 'Critical Bottleneck';
}

export interface ProductionScheduleTask {
  id: string;
  moNumber: string;
  productName: string;
  batchQtyKg: number;
  targetUnits: number;
  machineName: string;
  scheduledStart: string;
  scheduledEnd: string;
  schedulingMode: 'Finite Capacity (Forward)' | 'Infinite Capacity (Backward)';
  materialStatus: '100% Reserved (FEFO Ready)' | 'Partial Allocation' | 'Waiting Material';
  qcHoldCheck: 'QC Passed' | 'QC Hold Material';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
}

export interface PlanningScenario {
  id: string;
  scenarioName: 'Best Case (Sales Surge +25%)' | 'Normal Operational Horizon' | 'Worst Case (Supplier Lead Time +14 Days)' | 'Custom High-Efficiency Run';
  description: string;
  forecastSurgeMultiplier: number;
  supplierLeadTimeMultiplier: number;
  totalEstimatedMaterialCostIDR: number;
  totalProductionDays: number;
  predictedBottlenecksCount: number;
  projectedGrossProfitIDR: number;
}

export const PpicMrpExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'demand_forecast'
    | 'mps'
    | 'mrp_engine'
    | 'crp_capacity'
    | 'scheduling'
    | 'material_allocation'
    | 'simulation'
    | 'ai_ppic'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [lineFilter, setLineFilter] = useState('All');
  const [showMrpModal, setShowMrpModal] = useState(false);
  const [showNewMpsModal, setShowNewMpsModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('Normal Operational Horizon');

  // Mock Demand Forecast Data
  const [demandForecasts] = useState<DemandForecastItem[]>([
    {
      id: 'FCT-001',
      productCode: 'FG-SRM-001',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      category: 'Facial Care',
      salesOrderQty: 12000,
      forecastQty: 8000,
      totalDemandQty: 20000,
      uom: 'Pcs',
      safetyStockTarget: 3000,
      currentStock: 4500,
      netDemandQty: 18500,
      period: 'Aug 2026',
      seasonalityFactor: 1.15,
      status: 'Approved',
    },
    {
      id: 'FCT-002',
      productCode: 'FG-MOI-002',
      productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
      category: 'Moisturizer',
      salesOrderQty: 8500,
      forecastQty: 6500,
      totalDemandQty: 15000,
      uom: 'Pcs',
      safetyStockTarget: 2500,
      currentStock: 1200,
      netDemandQty: 16300,
      period: 'Aug 2026',
      seasonalityFactor: 1.05,
      status: 'Approved',
    },
    {
      id: 'FCT-003',
      productCode: 'FG-SUN-003',
      productName: 'UV-Shield Invisible Sunscreen SPF 50 PA++++ 50ml',
      category: 'Sun Care',
      salesOrderQty: 15000,
      forecastQty: 10000,
      totalDemandQty: 25000,
      uom: 'Pcs',
      safetyStockTarget: 4000,
      currentStock: 3000,
      netDemandQty: 26000,
      period: 'Aug 2026',
      seasonalityFactor: 1.30, // High summer seasonality
      status: 'Draft',
    },
    {
      id: 'FCT-004',
      productCode: 'FG-CLN-004',
      productName: 'Gentle Amino Acid Facial Cleanser 100ml',
      category: 'Cleanser',
      salesOrderQty: 6000,
      forecastQty: 4000,
      totalDemandQty: 10000,
      uom: 'Pcs',
      safetyStockTarget: 2000,
      currentStock: 2500,
      netDemandQty: 9500,
      period: 'Aug 2026',
      seasonalityFactor: 1.00,
      status: 'Approved',
    },
  ]);

  // Mock MPS Data
  const [mpsList, setMpsList] = useState<MpsItem[]>([
    {
      id: 'MPS-2026-08-01',
      mpsCode: 'MPS-SRM-08A',
      productCode: 'FG-SRM-001',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      formulaCode: 'FRM-SKN-2026-001 (Approved v2.0)',
      productionLine: 'Line A (Serum & Liquid)',
      plannedQtyPcs: 20000,
      plannedBatchKg: 610, // 20k * 0.0305kg
      startDate: '2026-08-10',
      endDate: '2026-08-14',
      horizonPeriod: 'Weekly',
      freezeStatus: 'Frozen',
      approvalStatus: 'Approved',
      assignedMachine: 'Vacuum Emulsifier Tank 1000L (Vessel-01)',
      priority: 'High (Rush Order)',
    },
    {
      id: 'MPS-2026-08-02',
      mpsCode: 'MPS-MOI-08B',
      productCode: 'FG-MOI-002',
      productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
      formulaCode: 'FRM-SKN-2026-002 (v1.2)',
      productionLine: 'Line B (Cream & Emulsion)',
      plannedQtyPcs: 16000,
      plannedBatchKg: 816, // 16k * 0.051kg
      startDate: '2026-08-15',
      endDate: '2026-08-19',
      horizonPeriod: 'Weekly',
      freezeStatus: 'Slotted',
      approvalStatus: 'Approved',
      assignedMachine: 'High Shear Vacuum Mixer 1000L (Vessel-02)',
      priority: 'Normal',
    },
    {
      id: 'MPS-2026-08-03',
      mpsCode: 'MPS-SUN-08C',
      productCode: 'FG-SUN-003',
      productName: 'UV-Shield Invisible Sunscreen SPF 50 PA++++ 50ml',
      formulaCode: 'FRM-SKN-2026-005 (v1.0)',
      productionLine: 'Line C (Tube Packaging)',
      plannedQtyPcs: 25000,
      plannedBatchKg: 1275,
      startDate: '2026-08-20',
      endDate: '2026-08-26',
      horizonPeriod: 'Weekly',
      freezeStatus: 'Open Horizon',
      approvalStatus: 'Pending Approval',
      assignedMachine: 'High Shear Homogenizer 1500L (Vessel-03)',
      priority: 'High (Rush Order)',
    },
  ]);

  // Mock MRP Results
  const [mrpResults] = useState<MrpResultItem[]>([
    {
      id: 'MRP-001',
      materialCode: 'RM-ACT-001',
      materialName: 'Niacinamide USP Grade 99.5%',
      materialType: 'Active Ingredient',
      grossRequirementKgOrPcs: 61.0, // Kg needed for 610kg serum
      availableStock: 25.0,
      reservedStock: 10.0,
      onOrderQty: 0,
      netRequirementQty: 46.0,
      uom: 'Kg',
      leadTimeDays: 7,
      supplierName: 'PT Shanxi Chemical Indonesia (Lead Time 7 Days)',
      moqQty: 50.0,
      recommendationType: 'Generate Purchase Requisition (PR)',
      actionDueDate: '2026-08-03', // 7 days before start 08-10
      estimatedCostIDR: 22500000, // 50kg * 450,000 IDR
      status: 'Critical Shortage',
    },
    {
      id: 'MRP-002',
      materialCode: 'RM-ACT-002',
      materialName: 'Centella Asiatica Extract Powder 98%',
      materialType: 'Active Ingredient',
      grossRequirementKgOrPcs: 12.2,
      availableStock: 18.0,
      reservedStock: 5.0,
      onOrderQty: 10.0,
      netRequirementQty: 0,
      uom: 'Kg',
      leadTimeDays: 14,
      supplierName: 'Guangzhou Biotech Co., Ltd',
      moqQty: 10.0,
      recommendationType: 'Stock Sufficient',
      actionDueDate: 'N/A',
      estimatedCostIDR: 0,
      status: 'Sufficient',
    },
    {
      id: 'MRP-003',
      materialCode: 'PKG-BTL-30ML',
      materialName: 'Botol Kaca Frost White 30ml + Dropper Pipet Gold Assembly',
      materialType: 'Primary Packaging',
      grossRequirementKgOrPcs: 20200, // 20k + 1% scrap
      availableStock: 5000,
      reservedStock: 2000,
      onOrderQty: 10000,
      netRequirementQty: 7200,
      uom: 'Pcs',
      leadTimeDays: 5,
      supplierName: 'PT Packaging Nusantara Utama',
      moqQty: 10000,
      recommendationType: 'Generate Purchase Requisition (PR)',
      actionDueDate: '2026-08-05',
      estimatedCostIDR: 85000000, // 10k pcs * 8,500 IDR
      status: 'Order Needed',
    },
    {
      id: 'MRP-004',
      materialCode: 'RM-OIL-001',
      materialName: 'Plant-Derived Squalane 99%',
      materialType: 'Active Ingredient',
      grossRequirementKgOrPcs: 65.28,
      availableStock: 12.0,
      reservedStock: 0,
      onOrderQty: 0,
      netRequirementQty: 53.28,
      uom: 'Kg',
      leadTimeDays: 21, // Long import lead time
      supplierName: 'Sugiyama Chemical Japan (Import)',
      moqQty: 100.0,
      recommendationType: 'Generate Purchase Requisition (PR)',
      actionDueDate: '2026-08-01', // OVERDUE ACTION
      estimatedCostIDR: 65000000,
      status: 'Critical Shortage',
    },
  ]);

  // Mock CRP Capacity Data
  const [crpCapacities] = useState<CrpCapacityItem[]>([
    {
      id: 'CRP-001',
      machineCode: 'EQ-VESSEL-01',
      machineName: 'Vacuum Emulsifier Tank 1000L Stainless 316L',
      department: 'Liquid & Serum Bulk Compounding',
      maxCapacityHoursPerWeek: 120, // 3 shifts x 5 days
      allocatedHours: 112,
      utilizationPercentage: 93.3,
      laborRequiredOperators: 4,
      laborAvailableOperators: 4,
      shiftMode: '24h Full Shift (3 Shifts)',
      bottleneckStatus: 'Near Capacity',
    },
    {
      id: 'CRP-002',
      machineCode: 'EQ-VESSEL-02',
      machineName: 'High Shear Vacuum Emulsifier 1000L (Cream Phase)',
      department: 'Cream & Ointment Manufacturing',
      maxCapacityHoursPerWeek: 80, // 2 shifts
      allocatedHours: 78,
      utilizationPercentage: 97.5,
      laborRequiredOperators: 3,
      laborAvailableOperators: 2, // Labor Shortage!
      shiftMode: 'Shift 1 & 2 (16h)',
      bottleneckStatus: 'Critical Bottleneck',
    },
    {
      id: 'CRP-003',
      machineCode: 'EQ-FILL-LINE-01',
      machineName: 'Automatic Bottle Washing, Liquid Filling & Dropper Capping Line',
      department: 'Primary Packaging Cleanroom Class D',
      maxCapacityHoursPerWeek: 120,
      allocatedHours: 85,
      utilizationPercentage: 70.8,
      laborRequiredOperators: 6,
      laborAvailableOperators: 6,
      shiftMode: '24h Full Shift (3 Shifts)',
      bottleneckStatus: 'Optimal',
    },
  ]);

  // Mock Production Schedule Tasks
  const [scheduleTasks] = useState<ProductionScheduleTask[]>([
    {
      id: 'SCH-001',
      moNumber: 'MO-20260810-001',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      batchQtyKg: 610,
      targetUnits: 20000,
      machineName: 'Vacuum Emulsifier Tank 1000L (Vessel-01)',
      scheduledStart: '2026-08-10 08:00',
      scheduledEnd: '2026-08-12 16:00',
      schedulingMode: 'Finite Capacity (Forward)',
      materialStatus: '100% Reserved (FEFO Ready)',
      qcHoldCheck: 'QC Passed',
      status: 'Scheduled',
    },
    {
      id: 'SCH-002',
      moNumber: 'MO-20260815-002',
      productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
      batchQtyKg: 816,
      targetUnits: 16000,
      machineName: 'High Shear Vacuum Mixer 1000L (Vessel-02)',
      scheduledStart: '2026-08-15 08:00',
      scheduledEnd: '2026-08-18 12:00',
      schedulingMode: 'Finite Capacity (Forward)',
      materialStatus: 'Partial Allocation',
      qcHoldCheck: 'QC Passed',
      status: 'Scheduled',
    },
  ]);

  // Mock Planning Scenarios
  const scenarios: PlanningScenario[] = [
    {
      id: 'SCN-001',
      scenarioName: 'Normal Operational Horizon',
      description: 'Perencanaan standar berdasarkan Sales Order terkonfirmasi & forecast regular bulan Agustus 2026.',
      forecastSurgeMultiplier: 1.0,
      supplierLeadTimeMultiplier: 1.0,
      totalEstimatedMaterialCostIDR: 172500000,
      totalProductionDays: 14,
      predictedBottlenecksCount: 1,
      projectedGrossProfitIDR: 1850000000,
    },
    {
      id: 'SCN-002',
      scenarioName: 'Best Case (Sales Surge +25%)',
      description: 'Lonjakan permintaan kampanye Harbolnas / Flash Sale. Membutuhkan Shift 3 pada Line B.',
      forecastSurgeMultiplier: 1.25,
      supplierLeadTimeMultiplier: 1.0,
      totalEstimatedMaterialCostIDR: 215000000,
      totalProductionDays: 18,
      predictedBottlenecksCount: 2,
      projectedGrossProfitIDR: 2450000000,
    },
    {
      id: 'SCN-003',
      scenarioName: 'Worst Case (Supplier Lead Time +14 Days)',
      description: 'Simulasi keterlambatan pengiriman bahan impor active ingredient Squalane & Ceramide.',
      forecastSurgeMultiplier: 1.0,
      supplierLeadTimeMultiplier: 1.6,
      totalEstimatedMaterialCostIDR: 188000000,
      totalProductionDays: 24,
      predictedBottlenecksCount: 4,
      projectedGrossProfitIDR: 1420000000,
    },
  ];

  const handleTriggerMrpExplosion = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowMrpModal(false);
      alert('✓ Kalkulasi Rekursif MRP Berhasil Selesai! 3 Rekomendasi PR & PO Otomatis Dihasilkan.');
    }, 1500);
  };

  const criticalShortageCount = mrpResults.filter((m) => m.status === 'Critical Shortage').length;
  const criticalBottleneckCount = crpCapacities.filter((c) => c.bottleneckStatus === 'Critical Bottleneck').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-400 text-white shadow-lg">
                <Factory className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    PPIC & Material Requirement Planning (MRP) Enterprise
                  </h1>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 12 • Production Brain
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Otak Perencanaan Produksi Kosmetik & Skincare: Demand Forecast, MPS Horizon, MRP Explosion, CRP Capacity, Finite Scheduling, & AI Optimizer.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowMrpModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg"
              id="mrp-explosion-btn"
            >
              <Zap className="h-4 w-4" />
              <span>Jalankan MRP Explosion Engine</span>
            </button>

            <button
              onClick={() => setShowNewMpsModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Tambah Rencana MPS</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_ppic')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI PPIC Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Demand Demand</span>
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">71,000 Pcs</p>
          <p className="text-[10px] text-emerald-400 font-semibold">↑ +12.5% vs Prev Month</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>MPS Planned Bulk</span>
            <Boxes className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">2,701 Kg</p>
          <p className="text-[10px] text-slate-400">3 Batch Compounding</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>MRP Shortage Alert</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <p className="text-lg font-black font-mono text-rose-400">
            {criticalShortageCount} Material
          </p>
          <p className="text-[10px] text-rose-300 font-bold">2 PR Rekomendasi</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>CRP Capacity Load</span>
            <Activity className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">87.2%</p>
          <p className="text-[10px] text-amber-400 font-semibold">{criticalBottleneckCount} Machine Bottleneck</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>FEFO Reservation</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">92.4%</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Ready for Batching</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Schedule Mode</span>
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-lg font-black font-mono text-purple-300">Finite Capacity</p>
          <p className="text-[10px] text-slate-400">Forward Machine Load</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Factory className="h-4 w-4" />
          <span>Control Center Dashboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('demand_forecast')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'demand_forecast'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Demand & Sales Forecast</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mps')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'mps'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Master Production Schedule (MPS)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mrp_engine')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'mrp_engine'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="h-4 w-4 text-amber-400" />
          <span>MRP Explosion & PR/PO</span>
        </button>

        <button
          onClick={() => setActiveSubTab('crp_capacity')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'crp_capacity'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Capacity Planning (CRP)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scheduling')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'scheduling'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Production Scheduling</span>
        </button>

        <button
          onClick={() => setActiveSubTab('material_allocation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'material_allocation'
              ? 'bg-rose-600/20 text-rose-300 border-b-2 border-rose-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Material Reservation (FEFO)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'simulation'
              ? 'bg-blue-600/20 text-blue-300 border-b-2 border-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Scenario Simulation</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_ppic')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'ai_ppic'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>AI PPIC Assistant</span>
        </button>
      </div>

      {/* SUB-TAB 1: CONTROL CENTER DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workflows & High Priority Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* MRP High Priority Alert Widget */}
            <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-950 via-rose-950/20 to-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">Deteksi Defisit Material & Peringatan Dini PPIC</h3>
                </div>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded font-bold">
                  2 Material Resiko Stock-Out
                </span>
              </div>

              <div className="space-y-3">
                {mrpResults
                  .filter((m) => m.status === 'Critical Shortage')
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{m.materialCode}</span>
                          <span className="text-xs font-bold text-white">{m.materialName}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Kebutuhan Kotor: <span className="text-rose-300 font-bold">{m.grossRequirementKgOrPcs} {m.uom}</span> | Stok Efektif: {m.availableStock - m.reservedStock} {m.uom} | Defisit Net: <span className="text-rose-400 font-black">{m.netRequirementQty} {m.uom}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Pemasok: {m.supplierName}</p>
                      </div>

                      <button
                        onClick={() => alert(`Membuat Purchase Requisition otomatis untuk ${m.materialName} (${m.moqQty} ${m.uom})`)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold whitespace-nowrap shadow"
                      >
                        Auto-Create PR ({formatCurrencyIDR(m.estimatedCostIDR)})
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* MPS Horizon Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Ringkasan Jadwal Induk Produksi (MPS Active Horizon)</h3>
                  <p className="text-xs text-slate-400">Jadwal Rencana Batching Kompounding & Pengisian Kemasan Agustus 2026</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('mps')}
                  className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Lihat Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {mpsList.map((mps) => (
                  <div
                    key={mps.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                          {mps.mpsCode}
                        </span>
                        <span className="text-xs font-bold text-white">{mps.productName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                          mps.freezeStatus === 'Frozen'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : mps.freezeStatus === 'Slotted'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {mps.freezeStatus} Period
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Target Kemasan:</span>
                        <span className="text-white font-bold">{mps.plannedQtyPcs.toLocaleString()} Pcs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Target Bulk Bulk:</span>
                        <span className="text-emerald-300 font-bold">{mps.plannedBatchKg} Kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Lini Produksi:</span>
                        <span className="text-indigo-300 font-bold">{mps.productionLine}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Jadwal Produksi:</span>
                        <span className="text-amber-300 font-bold">{mps.startDate} s/d {mps.endDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Capacity & AI PPIC Recommender */}
          <div className="space-y-6">
            {/* Machine Capacity Meter */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Beban Kapasitas Mesin & Tenaga Kerja (CRP)
              </h3>

              <div className="space-y-4">
                {crpCapacities.map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold line-clamp-1">{c.machineName.split('(')[0]}</span>
                      <span
                        className={`font-black ${
                          c.utilizationPercentage > 95
                            ? 'text-rose-400'
                            : c.utilizationPercentage > 85
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                        }`}
                      >
                        {c.utilizationPercentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${c.utilizationPercentage}%` }}
                        className={`h-full ${
                          c.utilizationPercentage > 95
                            ? 'bg-rose-500'
                            : c.utilizationPercentage > 85
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Alokasi: {c.allocatedHours} / {c.maxCapacityHoursPerWeek} jam</span>
                      <span className={c.laborAvailableOperators < c.laborRequiredOperators ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        Operator: {c.laborAvailableOperators}/{c.laborRequiredOperators} Orang
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI PPIC Assistant Recommendation Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-amber-500/20 pb-2">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <h3 className="text-xs font-bold text-amber-200">AI PPIC Smart Recommendations</h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                    <span>1. Penjadwalan Ulang Lini B</span>
                    <span className="text-[10px] text-slate-400">Kategori: CRP</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Pindahkan 4,000 Pcs HydroBarrier Gel Cream ke Shift 3 pada tanggal 17 Agustus untuk menghindari bottleneck operator pada Lini Compounding.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                    <span>2. Peringatan Safety Stock Sunscreen</span>
                    <span className="text-[10px] text-slate-400">Kategori: Demand</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Proyeksi lonjakan permintaan Sunscreen sebesar +30% karena musim kemarau. Disarankan menambah kuota batch 500Kg pada minggu ke-4 Agustus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DEMAND & SALES FORECAST */}
      {activeSubTab === 'demand_forecast' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Manajemen Permintaan & Forecast Penjualan Kosmetik</h2>
              <p className="text-xs text-slate-400">
                Integrasi Pesanan Pelanggan Maklon (Firm Sales Orders), Forecast Marketing, Faktor Musim, & Target Safety Stock.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Importing Excel Sales Forecast & Marketing Pipeline...')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Import Sales Forecast Excel</span>
              </button>
            </div>
          </div>

          {/* Forecast Grid Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Kode & Produk Skincare</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Firm Sales Order (Pcs)</th>
                    <th className="p-3">Marketing Forecast (Pcs)</th>
                    <th className="p-3">Indeks Musiman</th>
                    <th className="p-3">Total Deman Kebutuhan</th>
                    <th className="p-3">Stok Saat Ini</th>
                    <th className="p-3">Target Safety Stock</th>
                    <th className="p-3">Kebutuhan Net Produksi</th>
                    <th className="p-3">Status Rencana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {demandForecasts.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">
                        <div>{f.productName}</div>
                        <span className="text-[10px] text-amber-400">{f.productCode}</span>
                      </td>
                      <td className="p-3 text-slate-300">{f.category}</td>
                      <td className="p-3 font-bold text-indigo-300">{f.salesOrderQty.toLocaleString()}</td>
                      <td className="p-3 text-cyan-300">{f.forecastQty.toLocaleString()}</td>
                      <td className="p-3 text-amber-300 font-bold">{f.seasonalityFactor}x</td>
                      <td className="p-3 font-black text-white text-sm">
                        {f.totalDemandQty.toLocaleString()} {f.uom}
                      </td>
                      <td className="p-3 text-emerald-300">{f.currentStock.toLocaleString()}</td>
                      <td className="p-3 text-purple-300">{f.safetyStockTarget.toLocaleString()}</td>
                      <td className="p-3 font-black text-emerald-400 text-sm">
                        {f.netDemandQty.toLocaleString()} {f.uom}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {f.status}
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

      {/* SUB-TAB 3: MASTER PRODUCTION SCHEDULE (MPS) */}
      {activeSubTab === 'mps' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Jadwal Induk Produksi (Master Production Schedule - MPS)</h2>
              <p className="text-xs text-slate-400">
                Pengaturan Periode Horizon (Daily, Weekly, Monthly), Status Freeze Period, Lini Kompounding, & Formula R&D Terkait.
              </p>
            </div>
            <button
              onClick={() => setShowNewMpsModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Entry MPS Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mpsList.map((mps) => (
              <div
                key={mps.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{mps.mpsCode}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      mps.freezeStatus === 'Frozen'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {mps.freezeStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{mps.productName}</h3>
                  <p className="text-xs text-indigo-300 font-mono mt-1">Formula: {mps.formulaCode}</p>
                </div>

                <div className="space-y-2 border-t border-b border-slate-800/80 py-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Kemasan:</span>
                    <span className="font-bold text-white">{mps.plannedQtyPcs.toLocaleString()} Pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Bulk:</span>
                    <span className="font-bold text-emerald-300">{mps.plannedBatchKg} Kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lini & Vessel:</span>
                    <span className="font-bold text-cyan-300">{mps.productionLine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mesin Utama:</span>
                    <span className="font-bold text-slate-200 line-clamp-1">{mps.assignedMachine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal Eksekusi:</span>
                    <span className="font-bold text-amber-300">{mps.startDate} s/d {mps.endDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">Prioritas: {mps.priority}</span>
                  <button
                    onClick={() => alert(`Detail MPS Explosion untuk ${mps.mpsCode}`)}
                    className="text-xs text-indigo-400 font-bold hover:underline"
                  >
                    Explode ke MRP →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MRP EXPLOSION & RECOMMENDATIONS */}
      {activeSubTab === 'mrp_engine' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Engine Pemutus MRP (Material Requirement Planning Explosion)</h2>
              <p className="text-xs text-slate-400">
                Perhitungan otomatis Gross-to-Net berdasarkan Multi-Level BOM, Lead Time Supplier, MOQ, & Rekomendasi PR/PO Otomatis.
              </p>
            </div>

            <button
              onClick={() => handleTriggerMrpExplosion()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs hover:brightness-110 shadow-lg"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Hitung Ulang MRP Engine</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Daftar Kebutuhan Material Hasil Ledakan MRP (August 2026 Batch Cycle)
            </h3>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Kode & Bahan Baku / Kemasan</th>
                    <th className="p-3">Tipe Material</th>
                    <th className="p-3">Kebutuhan Kotor (Gross)</th>
                    <th className="p-3">Stok Bebas Saat Ini</th>
                    <th className="p-3">Stok Terpesan (Reserved)</th>
                    <th className="p-3">Kebutuhan Bersih (Net)</th>
                    <th className="p-3">Lead Time & Supplier</th>
                    <th className="p-3">Rekomendasi Tindakan MRP</th>
                    <th className="p-3">Batas Waktu PR/PO</th>
                    <th className="p-3">Estimasi Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {mrpResults.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">
                        <div>{m.materialName}</div>
                        <span className="text-[10px] text-amber-400">{m.materialCode}</span>
                      </td>
                      <td className="p-3 text-slate-300">{m.materialType}</td>
                      <td className="p-3 font-bold text-indigo-300">{m.grossRequirementKgOrPcs} {m.uom}</td>
                      <td className="p-3 text-emerald-300">{m.availableStock} {m.uom}</td>
                      <td className="p-3 text-purple-300">{m.reservedStock} {m.uom}</td>
                      <td className="p-3 font-black text-rose-400 text-sm">
                        {m.netRequirementQty} {m.uom}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        <div>{m.supplierName}</div>
                        <span className="text-[10px] text-cyan-300">Lead Time: {m.leadTimeDays} Hari</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold block text-center ${
                            m.status === 'Critical Shortage'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : m.status === 'Order Needed'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {m.recommendationType}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-300">{m.actionDueDate}</td>
                      <td className="p-3 font-bold text-emerald-300">
                        {m.estimatedCostIDR > 0 ? formatCurrencyIDR(m.estimatedCostIDR) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CAPACITY PLANNING (CRP) */}
      {activeSubTab === 'crp_capacity' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Perencanaan Kapasitas Pabrik & Mesin (Capacity Requirement Planning)</h2>
              <p className="text-xs text-slate-400">
                Analisis Beban Mesin Vessel Vacuum Emulsifier, Lini Pengisian Botol/Tube, Jumlah Shift Operator, & Deteksi Bottleneck.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crpCapacities.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-amber-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-amber-400">{c.machineCode}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.bottleneckStatus === 'Critical Bottleneck'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {c.bottleneckStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">{c.machineName}</h3>
                  <p className="text-xs text-slate-400 mt-1">{c.department}</p>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kapasitas Maksimal:</span>
                    <span className="text-white font-bold">{c.maxCapacityHoursPerWeek} Jam / Minggu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alokasi Rencana MPS:</span>
                    <span className="text-cyan-300 font-bold">{c.allocatedHours} Jam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Shift Operasional:</span>
                    <span className="text-amber-300 font-bold">{c.shiftMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kebutuhan Operator:</span>
                    <span
                      className={`font-bold ${
                        c.laborAvailableOperators < c.laborRequiredOperators ? 'text-rose-400' : 'text-emerald-300'
                      }`}
                    >
                      {c.laborAvailableOperators} Ada / {c.laborRequiredOperators} Butuh
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Persentase Utilisasi</span>
                    <span className="font-black text-amber-300">{c.utilizationPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${c.utilizationPercentage}%` }}
                      className={`h-full ${c.utilizationPercentage > 95 ? 'bg-rose-500' : 'bg-amber-400'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: PRODUCTION SCHEDULING */}
      {activeSubTab === 'scheduling' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Penjadwalan Produksi (Production Finite & Infinite Scheduling)</h2>
              <p className="text-xs text-slate-400">
                Pengaturan Forward/Backward Scheduling, Alokasi Batching Compounding, Ketersediaan Bahan FEFO, & QC Check Hold.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {scheduleTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                      {task.moNumber}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{task.productName}</h3>
                      <p className="text-xs text-slate-400 font-mono">Mesin: {task.machineName}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40 font-bold">
                    {task.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Target Volume Bulk:</span>
                    <span className="text-emerald-300 font-bold">{task.batchQtyKg} Kg ({task.targetUnits.toLocaleString()} Pcs)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Jadwal Mulai s/d Selesai:</span>
                    <span className="text-amber-300 font-bold">{task.scheduledStart} - {task.scheduledEnd}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Metode Scheduling:</span>
                    <span className="text-cyan-300 font-bold">{task.schedulingMode}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Ketersediaan Material FEFO:</span>
                    <span className="text-emerald-400 font-bold">{task.materialStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: MATERIAL RESERVATION (FEFO) */}
      {activeSubTab === 'material_allocation' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Alokasi & Reservasi Bahan Baku (FEFO Lot Reservation)</h2>
              <p className="text-xs text-slate-400">
                Pencadangan stok bahan aktif & kemasan berdasarkan prinsip FEFO (First Expired First Out) untuk menjamin kualitas skincare.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Batch/Lot Pemasok</th>
                    <th className="p-3">Nama Bahan Baku</th>
                    <th className="p-3">Nomor Kadaluarsa (Expiry)</th>
                    <th className="p-3">Stok Fisik Gudang</th>
                    <th className="p-3">Stok Direservasi (MO)</th>
                    <th className="p-3">Stok Bebas (Available)</th>
                    <th className="p-3">Status QC Hold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-amber-400">LOT-NIA-202506-01</td>
                    <td className="p-3 text-white font-bold">Niacinamide USP Grade 99.5%</td>
                    <td className="p-3 text-rose-300 font-bold">2027-06-30 (10 Bulan Lapis FEFO #1)</td>
                    <td className="p-3 text-slate-200">25.0 Kg</td>
                    <td className="p-3 text-purple-300 font-bold">10.0 Kg (MO-20260810-001)</td>
                    <td className="p-3 text-emerald-300 font-bold">15.0 Kg</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Released QC Passed</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-amber-400">LOT-CEN-202509-02</td>
                    <td className="p-3 text-white font-bold">Centella Asiatica Extract Powder 98%</td>
                    <td className="p-3 text-rose-300 font-bold">2027-09-15 (13 Bulan Lapis FEFO #1)</td>
                    <td className="p-3 text-slate-200">18.0 Kg</td>
                    <td className="p-3 text-purple-300 font-bold">5.0 Kg (MO-20260810-001)</td>
                    <td className="p-3 text-emerald-300 font-bold">13.0 Kg</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Released QC Passed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: SCENARIO SIMULATION */}
      {activeSubTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Simulasi & Perencanaan Skenario PPIC (What-If Analysis)</h2>
              <p className="text-xs text-slate-400">
                Uji dampak lonjakan penjualan, keterlambatan pemasok, & keterbatasan mesin terhadap biaya material dan gross margin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.scenarioName)}
                className={`cursor-pointer rounded-2xl border p-5 space-y-4 transition-all shadow-xl ${
                  selectedScenario === sc.scenarioName
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white">{sc.scenarioName}</h3>
                  {selectedScenario === sc.scenarioName && (
                    <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded">
                      Aktif terpilih
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300">{sc.description}</p>

                <div className="space-y-2 font-mono text-xs border-t border-b border-slate-800/80 py-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimasi Biaya Material:</span>
                    <span className="text-emerald-300 font-bold">{formatCurrencyIDR(sc.totalEstimatedMaterialCostIDR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Durasi Produksi Total:</span>
                    <span className="text-amber-300 font-bold">{sc.totalProductionDays} Hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prediksi Machine Bottleneck:</span>
                    <span className="text-rose-400 font-bold">{sc.predictedBottlenecksCount} Titik</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proyeksi Gross Profit:</span>
                    <span className="text-indigo-300 font-black">{formatCurrencyIDR(sc.projectedGrossProfitIDR)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Mengaktifkan skenario: ${sc.scenarioName}`)}
                  className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Terapkan Skenario Ini ke MPS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 9: AI PPIC ASSISTANT */}
      {activeSubTab === 'ai_ppic' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">AI PPIC Intelligence & Production Optimizer</h2>
                <p className="text-xs text-slate-300">
                  Asisten AI Khusus Pabrik Skincare & Kosmetik untuk Prediksi Stockout, Optimasi Lini Compounding, & Auto PO.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                  <Bot className="h-4 w-4" />
                  <span>Rekomendasi Pembelian Bahan Baku Otomatis</span>
                </div>
                <p className="text-xs text-slate-300">
                  Berdasarkan lead time supplier impor Jepang (21 Hari), disarankan segera merilis Purchase Requisition untuk Squalane 99% sebanyak 100Kg sebelum tanggal 3 Agustus untuk mencegah ketiadaan stok pada batch September.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                  <Zap className="h-4 w-4" />
                  <span>Optimasi Penyeimbangan Lini (Line Balancing)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Vessel Vacuum Emulsifier 1000L mengalami utilisasi 97.5%. AI menyarankan merelokasi batch HydroBarrier Moist Gel ke Vessel-03 (1500L) untuk menghemat 4.5 jam waktu pembersihan (CIP) antar-batch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RUN MRP EXPLOSION ENGINE */}
      {showMrpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Eksekusi Engine MRP Explosion</h3>
              </div>
              <button
                onClick={() => setShowMrpModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Sistem akan meledakkan (explode) seluruh kebutuhan Multi-Level BOM dari Master Production Schedule (MPS) bulan Agustus 2026 secara rekursif, mengkalkulasi stok bebas FEFO, lead time supplier, MOQ, dan menghasilkan rekomendasi PR/PO.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>MPS Active Horizon:</span>
                <span className="font-bold text-white">August 2026 (3 Finished Goods)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Multi-Level BOM Depth:</span>
                <span className="font-bold text-emerald-300">Unlimited Recursive Tree</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Metode Stok:</span>
                <span className="font-bold text-amber-300">FEFO Lot Allocation & Safety Net</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowMrpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleTriggerMrpExplosion}
                disabled={isSimulating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white hover:brightness-110 shadow-lg flex items-center space-x-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Mengkalkulasi MRP...</span>
                  </>
                ) : (
                  <span>Jalankan Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW MPS ENTRY */}
      {showNewMpsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Tambah Entri Master Production Schedule (MPS)</h3>
              <button
                onClick={() => setShowNewMpsModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Produk Skincare Target:</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option>FG-SRM-001 - CosmoGlow Intense Brightening Serum 30ml</option>
                  <option>FG-MOI-002 - HydroBarrier Ceramide Moist Gel Cream 50g</option>
                  <option>FG-SUN-003 - UV-Shield Invisible Sunscreen SPF 50 50ml</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Jumlah Target Produksi (Pcs):</label>
                <input
                  type="number"
                  defaultValue={10000}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Lini Produksi & Mesin Vessel:</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option>Line A - Vacuum Emulsifier Tank 1000L (Vessel-01)</option>
                  <option>Line B - High Shear Vacuum Emulsifier 1000L (Vessel-02)</option>
                  <option>Line C - High Shear Homogenizer 1500L (Vessel-03)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowNewMpsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowNewMpsModal(false);
                  alert('✓ Rencana MPS Baru Berhasil Ditambahkan!');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg"
              >
                Simpan Entri MPS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
