import React, { useState } from 'react';
import {
  Factory,
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
  Search,
  Filter,
  Plus,
  Layers,
  Boxes,
  Cpu,
  UserCheck,
  Thermometer,
  Gauge,
  Timer,
  FileCheck2,
  Lock,
  Download,
  Share2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  QrCode,
  DollarSign,
  BarChart3,
  Bot,
  Sliders,
  Check,
  History,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrencyIDR } from '../lib/utils';

// Types for MES & Production Management Enterprise
export interface ManufacturingOrder {
  id: string;
  moNumber: string;
  productionPlanRef: string;
  factoryName: string;
  productionLine: string;
  productName: string;
  productCode: string;
  formulaCode: string;
  bomVersion: string;
  targetQtyUnits: number;
  targetBatchKg: number;
  targetYieldPercent: number;
  startDatePlan: string;
  finishDatePlan: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Approved' | 'In Production' | 'Planned' | 'Completed' | 'Hold';
  approvalStatus: 'Approved by Director' | 'Pending Approval' | 'Draft';
  clientName: string;
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  moNumber: string;
  operationName: 'Raw Material Dispensing' | 'High Shear Compounding / Mixing' | 'Homogenization & Cooling' | 'In-Process Quality Hold' | 'Primary Bottle Filling & Dropper' | 'Secondary Boxing & Serialization';
  workCenter: 'Cleanroom Class D - Vessel Station' | 'Cleanroom Class D - Filling Line' | 'Packaging Line B';
  machineName: string;
  assignedOperator: string;
  shift: 'Shift 1 (08:00 - 16:00)' | 'Shift 2 (16:00 - 00:00)' | 'Shift 3 (00:00 - 08:00)';
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  status: 'In Progress' | 'Ready to Start' | 'Completed' | 'Paused' | 'On Hold';
  progressPercent: number;
}

export interface ElectronicBatchRecordItem {
  id: string;
  batchNumber: string;
  moNumber: string;
  productName: string;
  formulaVersion: string;
  batchSizeKg: number;
  manufactureDate: string;
  expiryDate: string;
  operatorLead: string;
  supervisorSign: string;
  lineClearanceApproved: boolean;
  qcInProcessStatus: 'Passed' | 'In Testing' | 'Hold';
  processParameters: {
    temperatureC: number;
    targetTempC: number;
    mixingRpm: number;
    targetRpm: number;
    vacuumBar: number;
    mixingTimeMinutes: number;
    currentPh: number;
    targetPhMin: number;
    targetPhMax: number;
    viscosityCps: number;
  };
  digitalSignatureStatus: 'Signed & Sealed' | 'Awaiting QA Approval' | 'Draft';
  status: 'In Production' | 'Released' | 'Quarantine';
}

export interface ProductionDeviation {
  id: string;
  devNumber: string;
  moNumber: string;
  batchNumber: string;
  type: 'Temperature Spike' | 'Viscosity Out-of-Spec' | 'Yield Loss > 3%' | 'Machine Mechanical Jam';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  rootCause: string;
  capaAction: string;
  reportedBy: string;
  reportedAt: string;
  approvalStatus: 'QA Approved' | 'Under Investigation' | 'Pending Review';
}

export interface DowntimeLog {
  id: string;
  machineCode: string;
  machineName: string;
  category: 'Machine Breakdown' | 'Material Shortage' | 'Line Cleaning & Sanitization' | 'QC Hold' | 'Setup & Changeover';
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  reasonNotes: string;
  status: 'Resolved' | 'Active Downtime';
}

export interface OeeMetric {
  machineCode: string;
  machineName: string;
  availabilityPercent: number; // Planned vs Running Time
  performancePercent: number; // Target vs Actual Speed
  qualityPercent: number; // Total Units vs Good Units
  overallOeePercent: number;
  status: 'Optimal' | 'Warning' | 'Critical';
}

export const MesExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'manufacturing_orders'
    | 'work_orders'
    | 'shop_floor'
    | 'ebr_batch_record'
    | 'material_issue'
    | 'yield_waste'
    | 'deviations_rework'
    | 'oee_downtime'
    | 'ai_production'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [showLineClearanceModal, setShowLineClearanceModal] = useState(false);
  const [showNewMoModal, setShowNewMoModal] = useState(false);
  const [selectedBatchForEbr, setSelectedBatchForEbr] = useState<string>('BATCH-2026-SRM-088');
  const [lineClearanceChecked, setLineClearanceChecked] = useState({
    cleaningVerified: true,
    equipmentCalibrated: true,
    materialsValidated: true,
    previousLotRemoved: true,
    operatorCompetent: true,
  });

  // Mock Manufacturing Orders (MO)
  const [manufacturingOrders] = useState<ManufacturingOrder[]>([
    {
      id: 'MO-001',
      moNumber: 'MO-202608-01',
      productionPlanRef: 'MPS-SRM-08A',
      factoryName: 'Plant 1 - Jababeka Cleanroom Class D',
      productionLine: 'Line A (Serum & Liquid Compounding)',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      productCode: 'FG-SRM-001',
      formulaCode: 'FRM-SKN-2026-001 (Approved v2.0)',
      bomVersion: 'BOM-v2.1',
      targetQtyUnits: 20000,
      targetBatchKg: 610,
      targetYieldPercent: 98.5,
      startDatePlan: '2026-08-10',
      finishDatePlan: '2026-08-12',
      priority: 'High',
      status: 'In Production',
      approvalStatus: 'Approved by Director',
      clientName: 'PT Glow Aesthetic Indonesia (Maklon)',
    },
    {
      id: 'MO-002',
      moNumber: 'MO-202608-02',
      productionPlanRef: 'MPS-MOI-08B',
      factoryName: 'Plant 1 - Jababeka Cleanroom Class D',
      productionLine: 'Line B (Cream & Emulsion High Shear)',
      productName: 'HydroBarrier Ceramide Moist Gel Cream 50g',
      productCode: 'FG-MOI-002',
      formulaCode: 'FRM-SKN-2026-002 (v1.2)',
      bomVersion: 'BOM-v1.0',
      targetQtyUnits: 16000,
      targetBatchKg: 816,
      targetYieldPercent: 98.0,
      startDatePlan: '2026-08-15',
      finishDatePlan: '2026-08-18',
      priority: 'Normal',
      status: 'Planned',
      approvalStatus: 'Approved by Director',
      clientName: 'Own Brand CosmoGlow',
    },
    {
      id: 'MO-003',
      moNumber: 'MO-202608-03',
      productionPlanRef: 'MPS-SUN-08C',
      factoryName: 'Plant 2 - Cikarang Outer Packaging',
      productionLine: 'Line C (Tube Filling & Packaging)',
      productName: 'UV-Shield Invisible Sunscreen SPF 50 PA++++ 50ml',
      productCode: 'FG-SUN-003',
      formulaCode: 'FRM-SKN-2026-005 (v1.0)',
      bomVersion: 'BOM-v1.3',
      targetQtyUnits: 25000,
      targetBatchKg: 1275,
      targetYieldPercent: 99.0,
      startDatePlan: '2026-08-20',
      finishDatePlan: '2026-08-25',
      priority: 'High',
      status: 'Approved',
      approvalStatus: 'Approved by Director',
      clientName: 'PT Derma Skin Science',
    },
  ]);

  // Mock Work Orders (WO)
  const [workOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-101',
      woNumber: 'WO-202608-01-A',
      moNumber: 'MO-202608-01',
      operationName: 'Raw Material Dispensing',
      workCenter: 'Cleanroom Class D - Vessel Station',
      machineName: 'Precision Scale & Dust Extractor Station #1',
      assignedOperator: 'Budi Santoso (Certified Dispenser)',
      shift: 'Shift 1 (08:00 - 16:00)',
      plannedStart: '2026-08-10 08:00',
      plannedFinish: '2026-08-10 11:00',
      actualStart: '2026-08-10 08:15',
      actualFinish: '2026-08-10 10:45',
      status: 'Completed',
      progressPercent: 100,
    },
    {
      id: 'WO-102',
      woNumber: 'WO-202608-01-B',
      moNumber: 'MO-202608-01',
      operationName: 'High Shear Compounding / Mixing',
      workCenter: 'Cleanroom Class D - Vessel Station',
      machineName: 'Vacuum Emulsifier Tank 1000L Stainless 316L (Vessel-01)',
      assignedOperator: 'Ahmad Hidayat (Lead Operator)',
      shift: 'Shift 1 (08:00 - 16:00)',
      plannedStart: '2026-08-10 11:30',
      plannedFinish: '2026-08-11 16:00',
      actualStart: '2026-08-10 11:30',
      status: 'In Progress',
      progressPercent: 68,
    },
    {
      id: 'WO-103',
      woNumber: 'WO-202608-01-C',
      moNumber: 'MO-202608-01',
      operationName: 'Primary Bottle Filling & Dropper',
      workCenter: 'Cleanroom Class D - Filling Line',
      machineName: 'Automatic Bottle Washing, Liquid Filling & Dropper Capping Line',
      assignedOperator: 'Siti Rahmawati & Team',
      shift: 'Shift 2 (16:00 - 00:00)',
      plannedStart: '2026-08-12 08:00',
      plannedFinish: '2026-08-12 16:00',
      status: 'Ready to Start',
      progressPercent: 0,
    },
  ]);

  // Mock Electronic Batch Record (EBR)
  const [ebrList] = useState<ElectronicBatchRecordItem[]>([
    {
      id: 'EBR-001',
      batchNumber: 'BATCH-2026-SRM-088',
      moNumber: 'MO-202608-01',
      productName: 'CosmoGlow Intense Brightening Serum 30ml',
      formulaVersion: 'FRM-SKN-2026-001 v2.0',
      batchSizeKg: 610,
      manufactureDate: '2026-08-10',
      expiryDate: '2028-08-10 (24 Months)',
      operatorLead: 'Ahmad Hidayat',
      supervisorSign: 'Eko Prasetyo, S.Farm., Apt.',
      lineClearanceApproved: true,
      qcInProcessStatus: 'Passed',
      processParameters: {
        temperatureC: 72.5,
        targetTempC: 75.0,
        mixingRpm: 1450,
        targetRpm: 1500,
        vacuumBar: -0.85,
        mixingTimeMinutes: 45,
        currentPh: 5.48,
        targetPhMin: 5.2,
        targetPhMax: 5.8,
        viscosityCps: 3450,
      },
      digitalSignatureStatus: 'Signed & Sealed',
      status: 'In Production',
    },
  ]);

  // Mock Production Deviations
  const [deviations] = useState<ProductionDeviation[]>([
    {
      id: 'DEV-001',
      devNumber: 'DEV-2026-0810-01',
      moNumber: 'MO-202608-01',
      batchNumber: 'BATCH-2026-SRM-088',
      type: 'Temperature Spike',
      severity: 'Minor',
      description: 'Suhu pemanasan fase air sempat naik ke 78.2°C selama 3 menit (Batas target: 75.0°C ± 2.0°C).',
      rootCause: 'Thermostat sensor pada Chiller Loop B butuh re-kalibrasi berkala.',
      capaAction: 'In-Process QC memverifikasi sampel active ingredient Niacinamide tidak mengalami degradasi termal.',
      reportedBy: 'Ahmad Hidayat',
      reportedAt: '2026-08-10 13:20',
      approvalStatus: 'QA Approved',
    },
  ]);

  // Mock Downtime Logs
  const [downtimeLogs] = useState<DowntimeLog[]>([
    {
      id: 'DT-001',
      machineCode: 'EQ-VESSEL-02',
      machineName: 'High Shear Vacuum Emulsifier 1000L',
      category: 'Line Cleaning & Sanitization',
      startTime: '2026-08-10 07:00',
      endTime: '2026-08-10 08:30',
      durationMinutes: 90,
      reasonNotes: 'Pembersihan CIP/SIP (Clean-In-Place) wajib standar CPKB BPOM antar batch cream.',
      status: 'Resolved',
    },
    {
      id: 'DT-002',
      machineCode: 'EQ-FILL-LINE-01',
      machineName: 'Automatic Bottle Filling Line',
      category: 'Setup & Changeover',
      startTime: '2026-08-10 10:00',
      endTime: '2026-08-10 10:45',
      durationMinutes: 45,
      reasonNotes: 'Pengantian nozzle pengisian dari ukuran 50ml ke 30ml dropper.',
      status: 'Resolved',
    },
  ]);

  // Mock OEE Metrics
  const [oeeMetrics] = useState<OeeMetric[]>([
    {
      machineCode: 'EQ-VESSEL-01',
      machineName: 'Vacuum Emulsifier Tank 1000L (Vessel 01)',
      availabilityPercent: 94.2,
      performancePercent: 96.5,
      qualityPercent: 99.1,
      overallOeePercent: 90.1,
      status: 'Optimal',
    },
    {
      machineCode: 'EQ-VESSEL-02',
      machineName: 'High Shear Mixer 1000L (Vessel 02)',
      availabilityPercent: 88.0,
      performancePercent: 91.2,
      qualityPercent: 98.4,
      overallOeePercent: 79.0,
      status: 'Warning',
    },
    {
      machineCode: 'EQ-FILL-LINE-01',
      machineName: 'Automatic Dropper Bottle Line',
      availabilityPercent: 95.0,
      performancePercent: 98.0,
      qualityPercent: 99.5,
      overallOeePercent: 92.6,
      status: 'Optimal',
    },
  ]);

  const activeMoCount = manufacturingOrders.filter((m) => m.status === 'In Production').length;
  const inProgressWoCount = workOrders.filter((w) => w.status === 'In Progress').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 p-6 border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 text-white shadow-lg">
                <Factory className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Manufacturing Execution System (MES) & Production Enterprise
                  </h1>
                  <span className="rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 13 • Shop Floor Brain
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Eksekusi Produksi Realtime & Paperless Kosmetik: MO, WO, Shop Floor Control, Electronic Batch Record (EBR), Line Clearance, & OEE Monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowLineClearanceModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg"
              id="line-clearance-btn"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Verifikasi Line Clearance (CPKB)</span>
            </button>

            <button
              onClick={() => setShowNewMoModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Plus className="h-4 w-4 text-teal-400" />
              <span>Rilis MO Baru</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_production')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Production Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>MO Dalam Eksekusi</span>
            <Factory className="h-3.5 w-3.5 text-teal-400" />
          </div>
          <p className="text-lg font-black font-mono text-teal-300">{activeMoCount} Batch MO</p>
          <p className="text-[10px] text-emerald-400 font-semibold">100% FEFO Allocated</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Active Work Orders</span>
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">{inProgressWoCount} WO Running</p>
          <p className="text-[10px] text-cyan-400 font-semibold">Cleanroom Class D</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Rata-Rata OEE Mesin</span>
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-400">87.2%</p>
          <p className="text-[10px] text-emerald-300 font-bold">Target World Class {'>'} 85%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Rata-Rata Yield Bulk</span>
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">98.8%</p>
          <p className="text-[10px] text-slate-400">Loss Liquid 1.2%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Deviasi Produksi</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">1 Log Minor</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ CAPA Approved</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>EBR Batch Record</span>
            <FileCheck2 className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-lg font-black font-mono text-purple-300">100% Signed</p>
          <p className="text-[10px] text-slate-400">BPOM / CPKB Ready</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Factory className="h-4 w-4" />
          <span>Realtime Control Center</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manufacturing_orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'manufacturing_orders'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Manufacturing Orders (MO)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('work_orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'work_orders'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Work Orders (WO)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shop_floor')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'shop_floor'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Shop Floor & Live Parameters</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ebr_batch_record')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'ebr_batch_record'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Electronic Batch Record (EBR)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('material_issue')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'material_issue'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Material Issue & Consumption</span>
        </button>

        <button
          onClick={() => setActiveSubTab('yield_waste')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'yield_waste'
              ? 'bg-rose-600/20 text-rose-300 border-b-2 border-rose-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Yield & Waste Management</span>
        </button>

        <button
          onClick={() => setActiveSubTab('oee_downtime')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'oee_downtime'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Gauge className="h-4 w-4" />
          <span>OEE & Downtime Analysis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_production')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'ai_production'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>AI Production Assistant</span>
        </button>
      </div>

      {/* SUB-TAB 1: REALTIME CONTROL CENTER DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Workstation Execution Monitors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Work Center Operational Status */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm font-bold text-white">Status Live Shop Floor & Stasiun Kompounding</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded font-bold">
                  2 Line Running • 1 Line Cleaning
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Station 1 Card */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-300">Cleanroom Class D - Line A</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                      <Play className="h-3 w-3 fill-emerald-300" />
                      <span>Mixing Phase B</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Vacuum Emulsifier Tank 1000L (Vessel-01)</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">MO: MO-202608-01 • Batch: BATCH-2026-SRM-088</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-center font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Suhu Tank</span>
                      <span className="font-bold text-amber-300">72.5°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Kecepatan RPM</span>
                      <span className="font-bold text-cyan-300">1,450 RPM</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Vakum Pressure</span>
                      <span className="font-bold text-teal-300">-0.85 bar</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-400">Operator: Ahmad Hidayat</span>
                    <span className="text-emerald-400 font-bold">Progress: 68%</span>
                  </div>
                </div>

                {/* Station 2 Card */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300">Cleanroom Class D - Line B</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                      <RotateCcw className="h-3 w-3" />
                      <span>CIP/SIP Cleaning</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">High Shear Vacuum Emulsifier 1000L (Vessel-02)</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Persiapan Batch HydroBarrier Cream (MO-202608-02)</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-center font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Suhu Rinse</span>
                      <span className="font-bold text-amber-300">85.0°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Water WFI</span>
                      <span className="font-bold text-cyan-300">450 L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Waktu CIP</span>
                      <span className="font-bold text-teal-300">25 Min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-slate-400">Teknisi Sanitasi: Bambang S.</span>
                    <span className="text-amber-300 font-bold">Line Clearance Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Electronic Batch Record Live Parameter Tracking */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Electronic Batch Record (EBR) Live Telemetry Logging</h3>
                  <p className="text-xs text-slate-400">Kepatuhan GMP / CPKB BPOM • Batch: BATCH-2026-SRM-088</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('ebr_batch_record')}
                  className="text-xs text-teal-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Buka Lembar EBR Lengkap</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Suhu Homogenisasi:</span>
                  <p className="text-lg font-black text-amber-300">72.5 °C</p>
                  <span className="text-[10px] text-emerald-400">Target: 75.0°C ±2°C</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Kecepatan Homogenizer:</span>
                  <p className="text-lg font-black text-cyan-300">1,450 RPM</p>
                  <span className="text-[10px] text-emerald-400">Target: 1,500 RPM</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Nilai pH In-Process:</span>
                  <p className="text-lg font-black text-emerald-300">5.48 pH</p>
                  <span className="text-[10px] text-emerald-400">Rentang Spec: 5.2 - 5.8</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">Viskositas Bulk:</span>
                  <p className="text-lg font-black text-purple-300">3,450 cPs</p>
                  <span className="text-[10px] text-emerald-400">Pass Organoleptik</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: AI Production Recommender & Line Clearance Checklist */}
          <div className="space-y-6">
            {/* AI Production Assistant Recommender */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-amber-500/20 pb-2">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <h3 className="text-xs font-bold text-amber-200">AI MES Production Intelligence</h3>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                    <span>1. Prediksi Pengisian Nozzle Line C</span>
                    <span className="text-[10px] text-slate-400">Anomali Speed</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Kecepatan filling dropper pada Line A mengalami fluktuasi 3%. Direkomendasikan kalibrasi tekanan pneumatik sebelum pengisian batch 20,000 Pcs.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                    <span>2. Optimasi Yield Bulk Serum</span>
                    <span className="text-[10px] text-slate-400">Yield Prediction</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Pengurangan waktu pendinginan fase air dari 40 ke 32 menit dapat meningkatkan recovery rate bahan aktif sebesar +0.4% tanpa mengubah viskositas.
                  </p>
                </div>
              </div>
            </div>

            {/* Line Clearance Quick Verification Status */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">Status Line Clearance Line A</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                  ✓ Verified CPKB
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>1. Sanitasi Vessel & Piping CIP</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>2. Kalibrasi Timbangan & Sensor</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>3. Verifikasi Label FEFO Bahan</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>4. APD Operator Cleanroom Class D</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              </div>

              <button
                onClick={() => setShowLineClearanceModal(true)}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-teal-300 transition-all text-center block"
              >
                Cetak Lembar Line Clearance PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MANUFACTURING ORDERS (MO) */}
      {activeSubTab === 'manufacturing_orders' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Manajemen Perintah Manufaktur (Manufacturing Orders - MO)</h2>
              <p className="text-xs text-slate-400">
                Pencatatan MO Terintegrasi dari MPS: Formula R&D, Multi-Level BOM Version, Target Yield, & Status Approval Direksi.
              </p>
            </div>

            <button
              onClick={() => setShowNewMoModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Rilis MO Baru</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Nomor MO & Klien</th>
                    <th className="p-3">Produk & Formula R&D</th>
                    <th className="p-3">Lini & Pabrik</th>
                    <th className="p-3">Target Kemasan</th>
                    <th className="p-3">Target Bulk (Kg)</th>
                    <th className="p-3">Jadwal Plan</th>
                    <th className="p-3">Prioritas</th>
                    <th className="p-3">Status Produksi</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {manufacturingOrders.map((mo) => (
                    <tr key={mo.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">
                        <div className="text-teal-300">{mo.moNumber}</div>
                        <span className="text-[10px] text-slate-400">{mo.clientName}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-white font-bold">{mo.productName}</div>
                        <span className="text-[10px] text-amber-400">{mo.formulaCode}</span>
                      </td>
                      <td className="p-3 text-slate-300">{mo.productionLine}</td>
                      <td className="p-3 font-bold text-indigo-300">{mo.targetQtyUnits.toLocaleString()} Pcs</td>
                      <td className="p-3 text-emerald-300 font-bold">{mo.targetBatchKg} Kg</td>
                      <td className="p-3 text-amber-300">{mo.startDatePlan} s/d {mo.finishDatePlan}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mo.priority === 'High'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-900 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {mo.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            mo.status === 'In Production'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {mo.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => alert(`Membuka Work Orders & Detail untuk ${mo.moNumber}`)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-teal-300 hover:bg-slate-800 text-[11px] font-bold"
                        >
                          Detail WO →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WORK ORDERS (WO) */}
      {activeSubTab === 'work_orders' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Work Orders (WO) & Routing Operasi Produksi</h2>
            <p className="text-xs text-slate-400">
              Perintah Kerja Per Stasiun: Penimbangan Bahan, Kompounding Emulsi, Homogenisasi, Pengisian Botol, & Serialization Outer Box.
            </p>
          </div>

          <div className="space-y-4">
            {workOrders.map((wo) => (
              <div
                key={wo.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      {wo.woNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white">{wo.operationName}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                      wo.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : wo.status === 'In Progress'
                        ? 'bg-teal-950 text-teal-300 border-teal-500/40 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {wo.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Stasiun Work Center:</span>
                    <span className="text-slate-200 font-bold">{wo.workCenter}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Mesin Terpasang:</span>
                    <span className="text-cyan-300 font-bold">{wo.machineName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Operator Ditugaskan:</span>
                    <span className="text-amber-300 font-bold">{wo.assignedOperator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Shift Kerja:</span>
                    <span className="text-indigo-300 font-bold">{wo.shift}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Progres Eksekusi Stasiun:</span>
                    <span className="text-teal-300 font-bold">{wo.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div style={{ width: `${wo.progressPercent}%` }} className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ELECTRONIC BATCH RECORD (EBR) */}
      {activeSubTab === 'ebr_batch_record' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Electronic Batch Record (EBR) Standar GMP & CPKB BPOM</h2>
              <p className="text-xs text-slate-400">
                Dokumen Digital Batch Produksi: Log Parameter Suhu/RPM/pH, Catatan Operator, Log Mesin, Tanda Tangan Digital, & Release QA.
              </p>
            </div>

            <button
              onClick={() => alert('Mencetak Electronic Batch Record PDF lengkap dengan Segel Digital...')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              <span>Export EBR Batch PDF</span>
            </button>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 space-y-6 shadow-2xl">
            {/* EBR Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-black bg-amber-950 text-amber-300 border border-amber-500/40">
                    EBR BATCH RECORD
                  </span>
                  <h3 className="text-lg font-black text-white">{ebrList[0].productName}</h3>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Nomor Batch: <span className="text-teal-300 font-bold">{ebrList[0].batchNumber}</span> | MO: {ebrList[0].moNumber} | Formulasi: {ebrList[0].formulaVersion}
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">Status Tanda Tangan Digital:</span>
                <span className="text-emerald-400 font-extrabold flex items-center justify-end space-x-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{ebrList[0].digitalSignatureStatus}</span>
                </span>
              </div>
            </div>

            {/* EBR Parameters & Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                  1. Log Parameter Proses Kritis (Critical Process Parameters)
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Suhu Compounding Tank:</span>
                    <span className="text-amber-300 font-bold">{ebrList[0].processParameters.temperatureC}°C (Target: {ebrList[0].processParameters.targetTempC}°C)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Kecepatan Mixing RPM:</span>
                    <span className="text-cyan-300 font-bold">{ebrList[0].processParameters.mixingRpm} RPM (Target: {ebrList[0].processParameters.targetRpm} RPM)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Derajat pH Bulk:</span>
                    <span className="text-emerald-300 font-bold">{ebrList[0].processParameters.currentPh} pH (Spec: {ebrList[0].processParameters.targetPhMin} - {ebrList[0].processParameters.targetPhMax})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Viskositas Viscometer:</span>
                    <span className="text-purple-300 font-bold">{ebrList[0].processParameters.viscosityCps} cPs</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                  2. Verifikasi Personel & Otorisasi QA
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Operator Penanggung Jawab:</span>
                    <span className="text-white font-bold">{ebrList[0].operatorLead}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Apoteker Supervisor:</span>
                    <span className="text-teal-300 font-bold">{ebrList[0].supervisorSign}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Verifikasi Line Clearance:</span>
                    <span className="text-emerald-400 font-bold">✓ Disetujui (CPKB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status QC In-Process (IPC):</span>
                    <span className="text-emerald-400 font-bold">✓ Lolos Uji pH & Micro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: OEE & DOWNTIME ANALYSIS */}
      {activeSubTab === 'oee_downtime' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-white">Monitoring OEE (Overall Equipment Effectiveness) & Rekam Downtime</h2>
            <p className="text-xs text-slate-400">
              Kalkulasi Ketersediaan Mesin (Availability), Efisiensi Kecepatan (Performance), & Tingkat Kualitas Produk (Quality).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OEE Cards */}
            <div className="lg:col-span-2 space-y-4">
              {oeeMetrics.map((o) => (
                <div key={o.machineCode} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-teal-400">{o.machineCode}</span>
                      <h3 className="text-sm font-bold text-white">{o.machineName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Overall OEE Score</span>
                      <span className="text-xl font-black font-mono text-emerald-400">{o.overallOeePercent}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Availability (Waktu)</span>
                      <span className="font-bold text-teal-300 text-sm">{o.availabilityPercent}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Performance (Kecepatan)</span>
                      <span className="font-bold text-cyan-300 text-sm">{o.performancePercent}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Quality (Lolos QC)</span>
                      <span className="font-bold text-emerald-300 text-sm">{o.qualityPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Downtime Logs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Log Downtime Mesin Hari Ini</h3>
              <div className="space-y-3">
                {downtimeLogs.map((dt) => (
                  <div key={dt.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-bold">{dt.machineCode}</span>
                      <span className="text-[10px] text-slate-400">{dt.durationMinutes} Mins</span>
                    </div>
                    <p className="text-white font-bold">{dt.category}</p>
                    <p className="text-slate-400 text-[11px]">{dt.reasonNotes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Line Clearance Verification */}
      {showLineClearanceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Verifikasi Line Clearance (CPKB BPOM)</h3>
              </div>
              <button onClick={() => setShowLineClearanceModal(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Lakukan pemeriksaan kondisi stasiun pembuat bulk sebelum produksi batch kosmetik baru dimulai:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.cleaningVerified}
                  onChange={(e) => setLineClearanceChecked({ ...lineClearanceChecked, cleaningVerified: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">1. CIP/SIP Sanitasi Selesai</span>
                  <span className="text-[10px] text-slate-400">Bebas dari sisa residu produk atau deterjen batch sebelumnya</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.equipmentCalibrated}
                  onChange={(e) => setLineClearanceChecked({ ...lineClearanceChecked, equipmentCalibrated: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">2. Kalibrasi Sensor Suhu & Timbangan</span>
                  <span className="text-[10px] text-slate-400">Sticker kalibrasi aktif & terverifikasi oleh QC</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.materialsValidated}
                  onChange={(e) => setLineClearanceChecked({ ...lineClearanceChecked, materialsValidated: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">3. Verifikasi Label FEFO Bahan Aktif</span>
                  <span className="text-[10px] text-slate-400">Penimbangan sesuai standar formula R&D v2.0</span>
                </div>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowLineClearanceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLineClearanceModal(false);
                  alert('✓ Line Clearance Disetujui oleh Supervisor QA! Stasiun Siap Eksekusi.');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                Setujui Line Clearance (Sign Digital)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
