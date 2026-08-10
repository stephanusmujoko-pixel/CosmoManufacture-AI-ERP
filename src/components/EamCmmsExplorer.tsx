import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Box,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  FileText,
  Sparkles,
  RefreshCw,
  Gauge,
  Settings,
  X,
  Droplet,
  Flame,
  BarChart3,
  ClipboardCheck,
  Printer,
  Download,
  AlertCircle,
  ThumbsUp,
  PieChart,
  UserCheck,
  Sliders,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  Asset,
  MachineRegister,
  MaintenanceWorkOrder,
  CalibrationRecord,
  SparePartMaster,
  UtilityAsset,
  EnergyLog,
  OeeRecord,
  DowntimeLog,
  AutonomousChecklist,
  PreventiveSchedule,
  initialAssets,
  initialMachines,
  initialWorkOrders,
  initialCalibrations,
  initialSpareParts,
  initialUtilities,
  initialEnergyLogs,
  initialOeeRecords,
  initialDowntimeLogs,
  initialAutonomousChecklists,
  initialPmSchedules,
} from '../../server/eamCmmsData';

export const EamCmmsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'oee-analytics'
    | 'autonomous-maint'
    | 'pm-schedule'
    | 'work-orders'
    | 'assets'
    | 'machines'
    | 'calibration'
    | 'spare-parts'
    | 'utilities'
    | 'iot-telemetry'
    | 'asset-lifecycle'
    | 'ai-assistant'
  >('dashboard');

  // Core Data States
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [machines, setMachines] = useState<MachineRegister[]>(initialMachines);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(initialWorkOrders);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(initialCalibrations);
  const [spareParts, setSpareParts] = useState<SparePartMaster[]>(initialSpareParts);
  const [utilities, setUtilities] = useState<UtilityAsset[]>(initialUtilities);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(initialEnergyLogs);
  const [oeeRecords, setOeeRecords] = useState<OeeRecord[]>(initialOeeRecords);
  const [downtimeLogs, setDowntimeLogs] = useState<DowntimeLog[]>(initialDowntimeLogs);
  const [autonomousChecklists, setAutonomousChecklists] = useState<AutonomousChecklist[]>(initialAutonomousChecklists);
  const [pmSchedules, setPmSchedules] = useState<PreventiveSchedule[]>(initialPmSchedules);

  // New Feature States
  const [iotTelemetryData, setIotTelemetryData] = useState<any[]>([]);
  const [depreciationData, setDepreciationData] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [pmFrequencyFilter, setPmFrequencyFilter] = useState<string>('All');
  const [woStatusFilter, setWoStatusFilter] = useState<string>('All');

  // Modals State
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isAddWoModalOpen, setIsAddWoModalOpen] = useState(false);
  const [isAddCalModalOpen, setIsAddCalModalOpen] = useState(false);
  const [isAddPmModalOpen, setIsAddPmModalOpen] = useState(false);
  const [isAddSpareModalOpen, setIsAddSpareModalOpen] = useState(false);
  const [isAddDowntimeModalOpen, setIsAddDowntimeModalOpen] = useState(false);
  const [isAddAmModalOpen, setIsAddAmModalOpen] = useState(false);
  const [isAuditReportModalOpen, setIsAuditReportModalOpen] = useState(false);
  const [auditReportData, setAuditReportData] = useState<any>(null);
  const [isCertPreviewModalOpen, setIsCertPreviewModalOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<CalibrationRecord | null>(null);

  // AI Prediction state
  const [selectedMachineForAi, setSelectedMachineForAi] = useState<string>('MCH-MIX-01');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form States
  const [newAssetData, setNewAssetData] = useState({
    assetCode: '',
    assetName: '',
    category: 'Production Equipment' as Asset['category'],
    hierarchyLocation: 'Factory 1 > Cleanroom A > Line 1',
    serialNumber: '',
    manufacturer: '',
    modelNumber: '',
    purchaseCostIdr: 250000000,
    warrantyExpiry: '2028-12-31',
    criticality: 'High (Critical)' as Asset['criticality'],
  });

  const [newWoData, setNewWoData] = useState({
    machineCode: 'MCH-MIX-01',
    category: 'Preventive' as MaintenanceWorkOrder['category'],
    priority: 'High' as MaintenanceWorkOrder['priority'],
    problemDescription: '',
    assignedTechnician: 'Hendra Setiawan',
    estimatedHours: 4,
  });

  const [newDowntimeData, setNewDowntimeData] = useState({
    machineCode: 'MCH-MIX-01',
    durationMinutes: 20,
    category: 'Minor Stop / Jamming' as DowntimeLog['category'],
    rootCause: '',
    operatorName: 'Ahmad Fauzi',
  });

  const [newCalData, setNewCalData] = useState({
    instrumentName: '',
    serialNumber: '',
    location: 'Quality Control Lab',
    calibrationType: 'External Accredited (KAN / ISO 17025)' as CalibrationRecord['calibrationType'],
    serviceProvider: 'PT BSN Kalibrasi Indonesia',
    lastCalibrationDate: new Date().toISOString().split('T')[0],
    nextDueDate: '2027-08-15',
    certificateNumber: '',
    result: 'Passed (Qualified)' as CalibrationRecord['result'],
  });

  const [newPmData, setNewPmData] = useState({
    machineCode: 'MCH-MIX-01',
    taskTitle: '',
    frequency: 'Monthly' as PreventiveSchedule['frequency'],
    estimatedHours: 3,
    assignedTechnician: 'Hendra Setiawan',
    criticality: 'High' as PreventiveSchedule['criticality'],
  });

  const [newSpareData, setNewSpareData] = useState({
    partCode: '',
    partName: '',
    category: 'Mechanical Seal' as SparePartMaster['category'],
    compatibleMachines: 'MCH-MIX-01, MCH-FILL-02',
    stockQuantity: 10,
    minReorderPoint: 4,
    unitCostIdr: 250000,
    supplierName: 'PT Sparepart Utama',
    storageBinLocation: 'Rack A-01',
    isCritical: true,
  });

  const [newAmData, setNewAmData] = useState({
    machineCode: 'MCH-MIX-01',
    shift: 'Shift 1' as AutonomousChecklist['shift'],
    operatorName: 'Ahmad Fauzi',
  });

  // Fetch initial data from backend if available
  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setAssets(res.data); })
      .catch(() => {});

    fetch('/api/machines')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setMachines(res.data); })
      .catch(() => {});

    fetch('/api/work-orders')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setWorkOrders(res.data); })
      .catch(() => {});

    fetch('/api/calibration')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setCalibrations(res.data); })
      .catch(() => {});

    fetch('/api/spare-parts')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setSpareParts(res.data); })
      .catch(() => {});

    fetch('/api/utilities')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setUtilities(res.data); })
      .catch(() => {});

    fetch('/api/oee/analytics')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (res.oeeRecords) setOeeRecords(res.oeeRecords);
          if (res.downtimeLogs) setDowntimeLogs(res.downtimeLogs);
        }
      })
      .catch(() => {});

    fetch('/api/maintenance/autonomous-checklists')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setAutonomousChecklists(res.data); })
      .catch(() => {});

    fetch('/api/maintenance/pm-schedule')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setPmSchedules(res.data); })
      .catch(() => {});

    fetch('/api/iot/telemetry')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setIotTelemetryData(res.data); })
      .catch(() => {});

    fetch('/api/assets/depreciation-analysis')
      .then((res) => res.json())
      .then((res) => { if (res.success && res.data) setDepreciationData(res.data); })
      .catch(() => {});
  }, [activeTab]);

  // Handlers
  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssetData),
      });
      const data = await res.json();
      if (data.success) {
        setAssets([data.data, ...assets]);
        setIsAddAssetModalOpen(false);
      }
    } catch {
      const mockAsset: Asset = {
        id: `asset-${Date.now()}`,
        ...newAssetData,
        purchaseDate: new Date().toISOString().split('T')[0],
        lifecycleStage: 'Operation',
        status: 'In Service',
        assignedTechnician: 'Hendra Setiawan',
      };
      setAssets([mockAsset, ...assets]);
      setIsAddAssetModalOpen(false);
    }
  };

  const handleCreateCalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockCal: CalibrationRecord = {
      id: `cal-${Date.now()}`,
      calibrationCode: `CAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      assetId: 'asset-2',
      instrumentName: newCalData.instrumentName || 'QC Laboratory Instrument',
      serialNumber: newCalData.serialNumber || 'SN-CAL-100',
      location: newCalData.location,
      calibrationType: newCalData.calibrationType,
      serviceProvider: newCalData.serviceProvider,
      lastCalibrationDate: newCalData.lastCalibrationDate,
      nextDueDate: newCalData.nextDueDate,
      certificateNumber: newCalData.certificateNumber || `KAN-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      result: newCalData.result,
      status: 'Valid',
      validatedByQc: true,
    };

    try {
      const res = await fetch('/api/calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCal),
      });
      const data = await res.json();
      if (data.success) {
        setCalibrations([data.data, ...calibrations]);
      } else {
        setCalibrations([mockCal, ...calibrations]);
      }
    } catch {
      setCalibrations([mockCal, ...calibrations]);
    }
    setIsAddCalModalOpen(false);
  };

  const handleCreatePmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedM = machines.find((m) => m.machineCode === newPmData.machineCode);
    const mockPm: PreventiveSchedule = {
      id: `pm-${Date.now()}`,
      scheduleCode: `PMS-${newPmData.machineCode.replace('MCH-', '')}-${Math.floor(10 + Math.random() * 90)}`,
      machineCode: newPmData.machineCode,
      machineName: matchedM ? matchedM.machineName : 'Production Machine',
      taskTitle: newPmData.taskTitle || 'Routine Maintenance Check',
      frequency: newPmData.frequency,
      nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      estimatedHours: newPmData.estimatedHours,
      assignedTechnician: newPmData.assignedTechnician,
      criticality: newPmData.criticality,
      lastDoneDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
    };

    try {
      const res = await fetch('/api/maintenance/pm-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPmData),
      });
      const data = await res.json();
      if (data.success) {
        setPmSchedules([data.data, ...pmSchedules]);
      } else {
        setPmSchedules([mockPm, ...pmSchedules]);
      }
    } catch {
      setPmSchedules([mockPm, ...pmSchedules]);
    }
    setIsAddPmModalOpen(false);
  };

  const handleCreateSparePart = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockPart: SparePartMaster = {
      id: `sp-${Date.now()}`,
      partCode: newSpareData.partCode || `PRT-${Math.floor(1000 + Math.random() * 9000)}`,
      partName: newSpareData.partName || 'New Mechanical Spare Part',
      category: newSpareData.category,
      compatibleMachines: newSpareData.compatibleMachines.split(',').map((s) => s.trim()),
      stockQuantity: Number(newSpareData.stockQuantity),
      minReorderPoint: Number(newSpareData.minReorderPoint),
      unitCostIdr: Number(newSpareData.unitCostIdr),
      supplierName: newSpareData.supplierName,
      storageBinLocation: newSpareData.storageBinLocation,
      isCritical: newSpareData.isCritical,
    };

    try {
      const res = await fetch('/api/spare-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPart),
      });
      const data = await res.json();
      if (data.success) {
        setSpareParts([data.data, ...spareParts]);
      } else {
        setSpareParts([mockPart, ...spareParts]);
      }
    } catch {
      setSpareParts([mockPart, ...spareParts]);
    }
    setIsAddSpareModalOpen(false);
  };

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedMach = machines.find((m) => m.machineCode === newWoData.machineCode);
    const mockWo: MaintenanceWorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requestNumber: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      assetId: 'asset-1',
      assetName: matchedMach ? matchedMach.machineName : 'Cosmetic Mixer Unit',
      machineCode: newWoData.machineCode,
      location: matchedMach ? matchedMach.lineLocation : 'Processing Line',
      category: newWoData.category,
      priority: newWoData.priority,
      problemDescription: newWoData.problemDescription || 'Routine Scheduled Preventive Check',
      assignedTechnician: newWoData.assignedTechnician,
      supervisor: 'Bambang Suprianto (Maintenance Mgr)',
      requestDate: new Date().toISOString().split('T')[0],
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedHours: newWoData.estimatedHours,
      status: 'Pending Approval',
      totalCostIdr: 0,
    };

    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockWo),
      });
      const data = await res.json();
      if (data.success) {
        setWorkOrders([data.data, ...workOrders]);
      } else {
        alert(data.message || 'Error creating work order');
        return;
      }
    } catch {
      setWorkOrders([mockWo, ...workOrders]);
    }
    setIsAddWoModalOpen(false);
  };

  const handleUpdateWoStatus = async (woId: string, newStatus: MaintenanceWorkOrder['status']) => {
    try {
      const res = await fetch(`/api/work-orders/${woId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actualHours: 3.5,
          sparePartsUsed: [{ partCode: 'PRT-SEAL-01', partName: 'Teflon Seal Ring', qtyUsed: 1, costIdr: 225000 }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkOrders(workOrders.map((w) => (w.id === woId ? data.data : w)));
      }
    } catch {
      setWorkOrders(
        workOrders.map((w) =>
          w.id === woId ? { ...w, status: newStatus, actualHours: 3.5, totalCostIdr: 225000 } : w
        )
      );
    }
  };

  const handleAddDowntimeLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/oee/downtime-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDowntimeData),
      });
      const data = await res.json();
      if (data.success) {
        setDowntimeLogs([data.data, ...downtimeLogs]);
        if (data.updatedOee) {
          setOeeRecords(oeeRecords.map((o) => (o.machineCode === data.updatedOee.machineCode ? data.updatedOee : o)));
        }
      }
    } catch {
      const targetM = machines.find((m) => m.machineCode === newDowntimeData.machineCode);
      const mockLog: DowntimeLog = {
        id: `dt-${Date.now()}`,
        downtimeCode: `DT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        machineCode: newDowntimeData.machineCode,
        machineName: targetM ? targetM.machineName : 'Production Machine',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        durationMinutes: Number(newDowntimeData.durationMinutes),
        category: newDowntimeData.category,
        rootCause: newDowntimeData.rootCause || 'Operator reported Stoppage',
        operatorName: newDowntimeData.operatorName,
        status: 'Resolved',
      };
      setDowntimeLogs([mockLog, ...downtimeLogs]);
    }
    setIsAddDowntimeModalOpen(false);
  };

  const handleGenerateWoFromPm = async (pmId: string) => {
    try {
      const res = await fetch(`/api/maintenance/pm-schedule/${pmId}/generate-wo`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setWorkOrders([data.wo, ...workOrders]);
        setPmSchedules(pmSchedules.map((p) => (p.id === pmId ? { ...p, status: 'WO Created' } : p)));
        alert(`Sukses! Work Order ${data.wo.woNumber} berhasil dibuat dari Jadwal PM.`);
      }
    } catch {
      const targetPm = pmSchedules.find((p) => p.id === pmId);
      if (targetPm) {
        const mockWo: MaintenanceWorkOrder = {
          id: `wo-${Date.now()}`,
          woNumber: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          assetId: 'asset-1',
          assetName: targetPm.machineName,
          machineCode: targetPm.machineCode,
          location: 'Processing Cleanroom Line',
          category: 'Preventive',
          priority: targetPm.criticality === 'High' ? 'High' : 'Medium',
          problemDescription: targetPm.taskTitle,
          assignedTechnician: targetPm.assignedTechnician,
          supervisor: 'Bambang Suprianto',
          requestDate: new Date().toISOString().split('T')[0],
          scheduledDate: targetPm.nextDueDate,
          estimatedHours: targetPm.estimatedHours,
          status: 'Pending Approval',
          totalCostIdr: 0,
        };
        setWorkOrders([mockWo, ...workOrders]);
        setPmSchedules(pmSchedules.map((p) => (p.id === pmId ? { ...p, status: 'WO Created' } : p)));
        alert(`Sukses! Work Order ${mockWo.woNumber} berhasil dibuat.`);
      }
    }
  };

  const handleReorderSparePart = async (partId: string) => {
    try {
      const res = await fetch(`/api/spare-parts/${partId}/reorder`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Purchase Requisition (PR) Berhasil Dibuat!\nNomor PR: ${data.prNumber}\nItem: ${data.partCode}\nQty Reorder: ${data.reorderQty} unit\nTotal Est: Rp ${data.totalCostEstimateIdr.toLocaleString('id-ID')}`);
      }
    } catch {
      alert('Purchase Requisition (PR) berhasil dikirim ke modul Procurement.');
    }
  };

  const handleLoadAuditReport = async () => {
    try {
      const res = await fetch('/api/maintenance/audit-report');
      const data = await res.json();
      if (data.success) {
        setAuditReportData(data);
        setIsAuditReportModalOpen(true);
      }
    } catch {
      setAuditReportData({
        reportDate: new Date().toISOString().split('T')[0],
        standards: 'CPKB (Cara Pembuatan Kosmetika yang Baik) & ISO 22716 / ISO 17025',
        metrics: {
          totalRegisteredAssets: assets.length,
          activeAssets: assets.filter((a) => a.status === 'In Service').length,
          pmComplianceRatePercent: 96.5,
          calibrationCompliancePercent: 92.0,
          avgOeePercent: 94.8,
          mtbfHoursAvg: 520,
          mttrHoursAvg: 2.1,
        },
        verificationSignatures: {
          maintenanceManager: 'Bambang Suprianto, ST',
          qaManager: 'Dr. Indah Permata, M.Si (QA Manager)',
          plantHead: 'Ir. Hendra Wijaya (Plant Manager)',
        },
      });
      setIsAuditReportModalOpen(true);
    }
  };

  const handleRunAiPrediction = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-maintenance/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineCode: selectedMachineForAi }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysisResult(data.aiAnalysis);
      }
    } catch {
      setAiAnalysisResult({
        healthScore: 88,
        estimatedRemainingUsefulLifeDays: 28,
        failureProbability30DaysPercent: 14,
        vibrationAnomalyScore: '0.038 mm/s (Normal Range)',
        temperatureTrend: '46.2 °C (Stable)',
        suspectedVulnerableComponent: 'Rotor Mechanical Seal Ring',
        aiRecommendation: 'Perform routine seal lubrication during upcoming monthly PM shutdown.',
        mtbfHours: 480,
        mttrHours: 2.1,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Metrics Calculations
  const totalAssetsCount = assets.length;
  const activeAssetsCount = assets.filter((a) => a.status === 'In Service').length;
  const openWorkOrdersCount = workOrders.filter((w) => w.status !== 'Verified & Closed').length;
  const calibrationDueCount = calibrations.filter((c) => c.status === 'Due Soon' || c.status === 'Expired').length;
  const lowSparePartsCount = spareParts.filter((s) => s.stockQuantity <= s.minReorderPoint).length;

  // Plant Average OEE
  const avgPlantOee = oeeRecords.length > 0
    ? (oeeRecords.reduce((acc, curr) => acc + curr.oeePercent, 0) / oeeRecords.length).toFixed(1)
    : '89.6';

  const filteredWorkOrders = workOrders.filter((w) => {
    if (woStatusFilter === 'All') return true;
    return w.status === woStatusFilter;
  });

  const filteredPmSchedules = pmSchedules.filter((p) => {
    if (pmFrequencyFilter === 'All') return true;
    return p.frequency === pmFrequencyFilter;
  });

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <Wrench className="w-4 h-4" />
            <span>CosmoManufacture ERP • Maintenance & OEE Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Enterprise Asset Management & OEE Analytics</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time OEE (Availability, Performance, Quality), Six Big Losses, TPM Autonomous Maintenance, CMMS Work Orders & CPKB Compliance
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleLoadAuditReport}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-lg font-medium text-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Audit Report CPKB</span>
          </button>
          <button
            onClick={() => setIsAddWoModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
          <button
            onClick={() => setIsAddDowntimeModalOpen(true)}
            className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 px-3.5 py-2 rounded-lg font-medium text-xs transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Log Downtime</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6 border-b border-slate-800 pb-3">
        {[
          { id: 'dashboard', label: 'Dashboard & Overview', icon: Gauge },
          { id: 'oee-analytics', label: 'OEE & Six Big Losses', icon: BarChart3 },
          { id: 'autonomous-maint', label: 'Autonomous Maint. (TPM)', icon: ClipboardCheck },
          { id: 'pm-schedule', label: 'Preventive Schedule (PM)', icon: Calendar },
          { id: 'work-orders', label: 'CMMS Work Orders', icon: Wrench },
          { id: 'assets', label: 'Asset Hierarchy', icon: Box },
          { id: 'machines', label: 'Machine Register', icon: Cpu },
          { id: 'calibration', label: 'Calibration & LIMS', icon: ShieldCheck },
          { id: 'spare-parts', label: 'Spare Parts Inventory', icon: Settings },
          { id: 'utilities', label: 'Utilities & Energy', icon: Zap },
          { id: 'iot-telemetry', label: 'IoT Sensors Telemetry', icon: Activity },
          { id: 'asset-lifecycle', label: 'Asset Depreciation & Lifecycle', icon: TrendingUp },
          { id: 'ai-assistant', label: 'AI Predictive Health', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD & OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Avg Plant OEE</span>
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-sky-400 mt-2">{avgPlantOee}%</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Target OEE ≥ 85.0%
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Active Assets</span>
                <Box className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {activeAssetsCount} / {totalAssetsCount}
              </div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% GMP Qualified
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Open Work Orders</span>
                <Wrench className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{openWorkOrdersCount}</div>
              <div className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> In Progress / Pending
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Calibration Due</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-300 mt-2">{calibrationDueCount} Due Soon</div>
              <div className="text-xs text-slate-400 mt-1">KAN ISO 17025 Certified</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Spare Parts Alert</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-400 mt-2">{lowSparePartsCount} Reorder</div>
              <div className="text-xs text-slate-400 mt-1">Min stock threshold trigger</div>
            </div>
          </div>

          {/* Machine & Line Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Machine Status Overview */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Production Machine Operational & OEE Status</span>
                </h3>
                <span className="text-xs text-slate-400">Live Telemetry</span>
              </div>
              <div className="space-y-3">
                {machines.map((m) => {
                  const matchedOee = oeeRecords.find((o) => o.machineCode === m.machineCode);
                  return (
                    <div key={m.id} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-white">{m.machineName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Code: <span className="font-mono text-indigo-300">{m.machineCode}</span> • Line: {m.lineLocation}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            m.status === 'Running'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : m.status === 'Standby'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                        <div className="text-xs text-sky-400 font-bold mt-1">
                          OEE: {matchedOee ? `${matchedOee.oeePercent}%` : `${m.oeeAvailabilityPercent}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Utility & Cleanroom Status */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Cleanroom Utilities & Utility Load</span>
                </h3>
                <span className="text-xs text-slate-400">Real-time IoT Sensors</span>
              </div>
              <div className="space-y-3">
                {utilities.map((u) => (
                  <div key={u.id} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-slate-200">{u.utilityName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status === 'Optimal'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                      <span>Rating: {u.capacityRating}</span>
                      <span>Load: {u.currentLoadPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full ${u.currentLoadPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${u.currentLoadPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OEE & SIX BIG LOSSES ANALYTICS */}
      {activeTab === 'oee-analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-400" />
                <span>Overall Equipment Effectiveness (OEE) & Six Big Losses Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kalkulasi 3 Pilar OEE: Availability (% Waktu Jalan), Performance (% Kecepatan Ideal), dan Quality (% Hasil Baik)
              </p>
            </div>
            <button
              onClick={() => setIsAddDowntimeModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" /> Catat Stoppage / Downtime
            </button>
          </div>

          {/* OEE Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oeeRecords.map((o) => (
              <div key={o.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {o.machineCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{o.machineName}</h4>
                    <p className="text-xs text-slate-400">{o.lineLocation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-sky-400">{o.oeePercent}%</span>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">OEE Score</div>
                  </div>
                </div>

                {/* 3 Core Pillars */}
                <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-3 rounded-lg text-center">
                  <div className="border-r border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Availability</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{o.availabilityPercent}%</div>
                  </div>
                  <div className="border-r border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Performance</div>
                    <div className="text-sm font-bold text-indigo-300 mt-0.5">{o.performancePercent}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Quality Rate</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">{o.qualityPercent}%</div>
                  </div>
                </div>

                {/* Six Big Losses Breakdown */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Six Big Losses Analysis:</span>
                    <span className="text-[10px] text-slate-400 font-normal">Total Downtime: {o.downtimeMinutes}m</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>1. Equipment Breakdown:</span>
                      <span className="text-rose-400 font-semibold">{o.sixBigLosses.breakdownMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>2. Setup & Changeover:</span>
                      <span className="text-amber-300 font-semibold">{o.sixBigLosses.changeoverMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>3. Minor Stoppages / Idling:</span>
                      <span className="text-sky-300 font-semibold">{o.sixBigLosses.minorStopsMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>4. Reduced Speed Loss:</span>
                      <span className="text-indigo-300 font-semibold">{o.sixBigLosses.speedLossMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>5. Defects & Scrap (Afval):</span>
                      <span className="text-rose-300 font-semibold">{o.sixBigLosses.defectLossMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-400 flex justify-between">
                  <span>Output Good / Defect:</span>
                  <span className="font-semibold text-white">
                    {o.goodOutputUnits.toLocaleString()} / <span className="text-rose-400">{o.rejectUnits} pcs</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Downtime Event History Log */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Downtime Stoppage History Log</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                    <th className="p-3">Log Code & Time</th>
                    <th className="p-3">Machine</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Root Cause Description</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {downtimeLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-mono text-indigo-300 font-semibold">{log.downtimeCode}</div>
                        <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                      </td>
                      <td className="p-3 text-white font-medium">{log.machineName} ({log.machineCode})</td>
                      <td className="p-3">
                        <span className="bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-medium text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-300">{log.durationMinutes} min</td>
                      <td className="p-3 text-slate-300">{log.rootCause}</td>
                      <td className="p-3 text-slate-400">{log.operatorName}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/30">
                          {log.status}
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

      {/* TAB 3: AUTONOMOUS MAINTENANCE (TPM / 5S / CIL) */}
      {activeTab === 'autonomous-maint' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                <span>Autonomous Maintenance (TPM CIL: Clean, Inspect, Lubricate, Tighten)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Checklist harian pemeliharaan mandiri oleh operator lini produksi sesuai standar CPKB & 5S Industri Kosmetik
              </p>
            </div>
            <button
              onClick={() => setIsAddAmModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Input Checklist Operator
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {autonomousChecklists.map((am) => (
              <div key={am.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {am.checklistCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{am.machineName} ({am.machineCode})</h4>
                    <p className="text-xs text-slate-400">Shift: {am.shift} • Operator: {am.operatorName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      am.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {am.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {am.items.map((item) => (
                    <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-white">{item.checkPoint}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Kategori: <span className="text-indigo-300">{item.standardCategory}</span> • Metode: {item.method}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.result === 'Pass'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.result}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Supervisor Verifier: <strong className="text-slate-200">{am.supervisorName}</strong></span>
                  <span>Tanggal: {am.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PREVENTIVE MAINTENANCE SCHEDULE */}
      {activeTab === 'pm-schedule' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Preventive Maintenance (PM) Master Schedule</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Jadwal perawatan terencana berkala (Weekly, Monthly, Quarterly) untuk mencegah breakdown tak terduga
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Frekuensi:</span>
                <select
                  value={pmFrequencyFilter}
                  onChange={(e) => setPmFrequencyFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">Semua Frekuensi</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddPmModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create PM Schedule
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPmSchedules.map((pm) => (
              <div key={pm.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {pm.scheduleCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{pm.machineName}</h4>
                    <p className="text-xs text-indigo-300 font-medium">Frekuensi: {pm.frequency}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      pm.criticality === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {pm.criticality} Criticality
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-medium">
                  {pm.taskTitle}
                </p>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Teknisi PJ:</span>
                    <span className="text-slate-200">{pm.assignedTechnician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Durasi:</span>
                    <span className="text-slate-200">{pm.estimatedHours} Jam</span>
                  </div>
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span>Jatuh Tempo Berikutnya:</span>
                    <span>{pm.nextDueDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold ${
                      pm.status === 'WO Created' ? 'text-indigo-400' : 'text-emerald-400'
                    }`}
                  >
                    Status: {pm.status}
                  </span>
                  {pm.status !== 'WO Created' && (
                    <button
                      onClick={() => handleGenerateWoFromPm(pm.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-[11px] font-medium"
                    >
                      Generate WO
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CMMS WORK ORDERS */}
      {activeTab === 'work-orders' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base">CMMS Work Orders Management</h3>
              <p className="text-xs text-slate-400">Approval, Penugasan Teknisi, Penggunaan Spare Parts & Verifikasi Perbaikan</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={woStatusFilter}
                onChange={(e) => setWoStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">Semua Status WO</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="In Progress">In Progress</option>
                <option value="Verified & Closed">Verified & Closed</option>
              </select>
              <button
                onClick={() => setIsAddWoModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Work Order
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredWorkOrders.map((wo) => (
              <div key={wo.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-900 text-indigo-400 px-2 py-0.5 rounded border border-slate-700">
                        {wo.woNumber}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          wo.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {wo.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        Category: {wo.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white mt-2">{wo.assetName} ({wo.machineCode})</h4>
                    <p className="text-xs text-slate-300 mt-1">{wo.problemDescription}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        wo.status === 'Verified & Closed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : wo.status === 'In Progress'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {wo.status}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">Tech: {wo.assignedTechnician}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-slate-400">
                  <div>Location: <span className="text-slate-200">{wo.location}</span></div>
                  <div>Est. Hours: <span className="text-slate-200">{wo.estimatedHours}h</span></div>
                  <div>Request Date: <span className="text-slate-200">{wo.requestDate}</span></div>
                  <div>Parts Cost: <span className="text-emerald-400 font-semibold">Rp {wo.totalCostIdr.toLocaleString('id-ID')}</span></div>
                </div>

                {wo.status !== 'Verified & Closed' && (
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-end gap-2">
                    {wo.status === 'Pending Approval' && (
                      <button
                        onClick={() => handleUpdateWoStatus(wo.id, 'In Progress')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Approve & Start
                      </button>
                    )}
                    {wo.status === 'In Progress' && (
                      <button
                        onClick={() => handleUpdateWoStatus(wo.id, 'Verified & Closed')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Verify & Close WO
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ASSET REGISTER & HIERARCHY */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Asset Code, Name, SN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-indigo-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Production Equipment">Production Equipment</option>
                <option value="Laboratory Instrument">Laboratory Instrument</option>
                <option value="Utility System">Utility System</option>
              </select>
            </div>
            <div className="text-xs text-slate-400">
              Showing {assets.length} registered manufacturing assets
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                    <th className="p-3.5">Asset Code & Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Location Hierarchy</th>
                    <th className="p-3.5">Serial / Model</th>
                    <th className="p-3.5">Lifecycle Stage</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{asset.assetName}</div>
                        <div className="text-[11px] text-indigo-400 font-mono mt-0.5">{asset.assetCode}</div>
                      </td>
                      <td className="p-3.5 text-slate-300">{asset.category}</td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{asset.hierarchyLocation}</td>
                      <td className="p-3.5 text-slate-300">
                        <div>{asset.modelNumber}</div>
                        <div className="text-[11px] text-slate-500">SN: {asset.serialNumber}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-medium text-[11px]">
                          {asset.lifecycleStage}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            asset.status === 'In Service'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : asset.status === 'Calibration Due'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            setSelectedMachineForAi(asset.assetCode);
                            setActiveTab('ai-assistant');
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> AI Health Check
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

      {/* TAB 7: MACHINE REGISTER */}
      {activeTab === 'machines' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {machines.map((m) => (
              <div key={m.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                      {m.machineCode}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{m.machineName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.lineLocation}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      m.status === 'Running'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400">Power Rating:</span>
                    <div className="text-slate-200 font-semibold">{m.powerRatingKw} kW</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Runtime:</span>
                    <div className="text-slate-200 font-semibold">{m.runtimeHours} Hours</div>
                  </div>
                  <div>
                    <span className="text-slate-400">MTBF / MTTR:</span>
                    <div className="text-slate-200 font-semibold">
                      {m.mtbfHours}h / {m.mttrHours}h
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">OEE Availability:</span>
                    <div className="text-emerald-400 font-semibold">{m.oeeAvailabilityPercent}%</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Next PM Schedule:</span>
                  <span className="font-mono text-amber-300 font-medium">{m.nextPreventiveDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CALIBRATION & LIMS */}
      {activeTab === 'calibration' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold text-white text-sm">Laboratory Instrument & Sensor Calibration (ISO 17025 / KAN)</h3>
              <p className="text-xs text-slate-400">QC LIMS Integration & Instrument Qualification (IQ/OQ/PQ)</p>
            </div>
            <button
              onClick={() => setIsAddCalModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log Calibration Cert
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calibrations.map((cal) => (
              <div key={cal.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {cal.calibrationCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{cal.instrumentName}</h4>
                    <p className="text-xs text-slate-400">{cal.location}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                      cal.status === 'Valid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {cal.status}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Certificate No:</span>
                    <span className="font-mono text-indigo-300">{cal.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Provider:</span>
                    <span>{cal.serviceProvider}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Last Date:</span>
                    <span>{cal.lastCalibrationDate}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span>Next Due Date:</span>
                    <span>{cal.nextDueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                  <span>QC Validation: <strong className="text-emerald-400">Passed (Qualified)</strong></span>
                  <span className="text-[11px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded">
                    {cal.calibrationType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SPARE PARTS INVENTORY */}
      {activeTab === 'spare-parts' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm">Maintenance Spare Parts Inventory</h3>
              <p className="text-xs text-slate-400">Critical spares, minimum reorder thresholds & machine compatibility</p>
            </div>
            <button
              onClick={() => setIsAddSpareModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Spare Part
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spareParts.map((sp) => (
              <div key={sp.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {sp.partCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{sp.partName}</h4>
                    <p className="text-xs text-slate-400">{sp.category}</p>
                  </div>
                  {sp.isCritical && (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Critical
                    </span>
                  )}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock Available:</span>
                    <span className={`font-bold ${sp.stockQuantity <= sp.minReorderPoint ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {sp.stockQuantity} Units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Reorder Point:</span>
                    <span className="text-slate-200">{sp.minReorderPoint} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Unit Cost:</span>
                    <span className="text-slate-200">Rp {sp.unitCostIdr.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location Bin:</span>
                    <span className="text-indigo-300 font-mono">{sp.storageBinLocation}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Compatible: {sp.compatibleMachines.join(', ')}</span>
                  {sp.stockQuantity <= sp.minReorderPoint && (
                    <button
                      onClick={() => handleReorderSparePart(sp.id)}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded text-[10px] font-bold"
                    >
                      Reorder PR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: UTILITIES & ENERGY */}
      {activeTab === 'utilities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
                <Zap className="w-4 h-4" /> Electricity Today
              </div>
              <div className="text-2xl font-bold text-white">2,220 kWh</div>
              <div className="text-xs text-slate-400 mt-1">Cost Estimate: Rp 3,219,000</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-2">
                <Droplet className="w-4 h-4" /> Water & PW Consumption
              </div>
              <div className="text-2xl font-bold text-white">52.7 m³</div>
              <div className="text-xs text-slate-400 mt-1">Purified Water Loop Active</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
                <Flame className="w-4 h-4" /> Steam & Boiler Output
              </div>
              <div className="text-2xl font-bold text-white">3,200 kg</div>
              <div className="text-xs text-slate-400 mt-1">Jacket Heating Active</div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Cleanroom Facility Utilities Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {utilities.map((u) => (
                <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="font-semibold text-white text-sm">{u.utilityName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{u.category}</div>
                  <div className="mt-3 text-xs text-slate-300">Capacity: {u.capacityRating}</div>
                  <div className="mt-1 text-xs text-slate-300">Location: {u.location}</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Load: {u.currentLoadPercent}%</span>
                    <span className="text-emerald-400 font-medium">{u.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: AI PREDICTIVE MAINTENANCE */}
      {activeTab === 'ai-assistant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/60 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Maintenance Assistant & Predictive Health Engine</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Deep Learning anomaly detection on machine vibration, temperature, OEE drift & RUL estimation.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="w-full md:w-auto">
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Machine to Analyze:</label>
                <select
                  value={selectedMachineForAi}
                  onChange={(e) => setSelectedMachineForAi(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.machineCode}>
                      {m.machineCode} - {m.machineName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRunAiPrediction}
                disabled={isAiLoading}
                className="w-full md:w-auto mt-4 md:mt-5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Machine Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Predictive Analysis</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysisResult && (
              <div className="mt-6 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-xs">Machine Health Score</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{aiAnalysisResult.healthScore} / 100</div>
                    <span className="text-[11px] text-slate-500">Optimal Operating Window</span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-xs">Estimated RUL (Useful Life)</span>
                    <div className="text-2xl font-bold text-amber-300 mt-1">{aiAnalysisResult.estimatedRemainingUsefulLifeDays} Days</div>
                    <span className="text-[11px] text-slate-500">Before required overhaul</span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-xs">30-Day Failure Risk</span>
                    <div className="text-2xl font-bold text-sky-400 mt-1">{aiAnalysisResult.failureProbability30DaysPercent}%</div>
                    <span className="text-[11px] text-slate-500">Low Probability Anomaly</span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-xs">MTBF / MTTR Metric</span>
                    <div className="text-lg font-bold text-slate-200 mt-1">
                      {aiAnalysisResult.mtbfHours}h / {aiAnalysisResult.mttrHours}h
                    </div>
                    <span className="text-[11px] text-slate-500">Mean Time Between Failure</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-indigo-800/40 p-5 rounded-xl space-y-3">
                  <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Diagnostics & Recommendations
                  </h4>

                  <div className="text-xs text-slate-300 space-y-2">
                    <div>
                      <strong className="text-slate-400">Suspected Vulnerable Component:</strong>{' '}
                      <span className="text-amber-300">{aiAnalysisResult.suspectedVulnerableComponent}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400">Telemetry Sensor Status:</strong>{' '}
                      <span>Vibration: {aiAnalysisResult.vibrationAnomalyScore} • Temp: {aiAnalysisResult.temperatureTrend}</span>
                    </div>
                    <div className="p-3 bg-indigo-950/60 border border-indigo-800/50 rounded-lg text-indigo-200 mt-2">
                      <strong>AI Actionable Advice:</strong> {aiAnalysisResult.aiRecommendation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 12: IOT TELEMETRY & SENSOR MONITORING */}
      {activeTab === 'iot-telemetry' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span>IoT Sensor Telemetry & Vibration Monitoring</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoring kondisi mesin secara real-time (Vibrasi mm/s, Suhu °C, Tekanan Vakum MPa & Daya Listrik kW)
              </p>
            </div>
            <button
              onClick={() => {
                fetch('/api/iot/telemetry')
                  .then((res) => res.json())
                  .then((res) => { if (res.success && res.data) setIotTelemetryData(res.data); });
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Feed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Active IoT Sensors</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">24 Sensors Online</div>
              <span className="text-[11px] text-slate-400">100% Signal Coverage</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Avg Motor Vibration</span>
              <div className="text-2xl font-bold text-slate-100 mt-1">0.032 mm/s</div>
              <span className="text-[11px] text-emerald-400">Normal Range (&lt; 0.045)</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Avg Temperature</span>
              <div className="text-2xl font-bold text-amber-300 mt-1">45.4 °C</div>
              <span className="text-[11px] text-slate-400">Thermal Threshold: 65°C</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Total Power Load</span>
              <div className="text-2xl font-bold text-sky-400 mt-1">182.5 kW</div>
              <span className="text-[11px] text-slate-400">Utility Line Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(iotTelemetryData.length > 0 ? iotTelemetryData : machines.map(m => ({
              machineCode: m.machineCode,
              machineName: m.machineName,
              sensors: {
                vibrationMmS: 0.034,
                vibrationStatus: 'Normal',
                temperatureCelsius: 44.2,
                temperatureStatus: 'Normal',
                vacuumPressureMpa: 0.88,
                energyDrawKw: m.powerRatingKw * 0.85
              }
            }))).map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {item.machineCode}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{item.machineName}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                    item.sensors.vibrationStatus === 'Warning' || item.sensors.temperatureStatus === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.sensors.vibrationStatus === 'Warning' ? 'Vibration Warning' : 'Operating Normal'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-900/90 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Vibration Sensor (mm/s):</span>
                    <span className="text-sm font-bold font-mono text-indigo-300">{item.sensors.vibrationMmS} mm/s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Motor Temperature:</span>
                    <span className="text-sm font-bold font-mono text-amber-300">{item.sensors.temperatureCelsius} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Vacuum / Suction:</span>
                    <span className="text-sm font-bold font-mono text-sky-300">{item.sensors.vacuumPressureMpa} MPa</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Power Consumption:</span>
                    <span className="text-sm font-bold font-mono text-emerald-300">{item.sensors.energyDrawKw} kW</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setNewWoData({
                        machineCode: item.machineCode,
                        category: 'Predictive',
                        priority: item.sensors.vibrationStatus === 'Warning' ? 'High' : 'Medium',
                        problemDescription: `Preventive check triggered by IoT sensor anomaly: Vibration ${item.sensors.vibrationMmS} mm/s, Temp ${item.sensors.temperatureCelsius}°C.`,
                        assignedTechnician: 'Hendra Setiawan',
                        estimatedHours: 2,
                      });
                      setIsAddWoModalOpen(true);
                    }}
                    className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Auto-Generate PM Work Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: ASSET DEPRECIATION & LIFECYCLE */}
      {activeTab === 'asset-lifecycle' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Asset Lifecycle & Financial Depreciation Analysis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Analisis nilai buku aset (Book Value), akumulasi depresiasi, dan rasio biaya pemeliharaan terhadap harga beli (Maintenance-to-Cost Ratio)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Total Asset Gross Value</span>
              <div className="text-xl font-bold text-white mt-1">Rp 2.85 Milyar</div>
              <span className="text-[11px] text-slate-400">Original Purchase Cost</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Accumulated Depreciation</span>
              <div className="text-xl font-bold text-amber-300 mt-1">Rp 740 Juta</div>
              <span className="text-[11px] text-slate-400">Straight-Line Method (10 Yr)</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Current Net Book Value</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">Rp 2.11 Milyar</div>
              <span className="text-[11px] text-slate-400">Balance Sheet Net Asset</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-medium">Total Lifetime Maintenance</span>
              <div className="text-xl font-bold text-indigo-300 mt-1">Rp 82.5 Juta</div>
              <span className="text-[11px] text-slate-400">Cumulative WO Cost</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                    <th className="p-3.5">Asset Code & Name</th>
                    <th className="p-3.5">Purchase Cost</th>
                    <th className="p-3.5">Years in Service</th>
                    <th className="p-3.5">Accumulated Depr.</th>
                    <th className="p-3.5">Current Book Value</th>
                    <th className="p-3.5">Total Maintenance Spend</th>
                    <th className="p-3.5">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(depreciationData.length > 0 ? depreciationData : assets.map(a => ({
                    assetCode: a.assetCode,
                    assetName: a.assetName,
                    purchaseCostIdr: a.purchaseCostIdr,
                    yearsInService: 3,
                    accumulatedDepreciationIdr: a.purchaseCostIdr * 0.3,
                    currentBookValueIdr: a.purchaseCostIdr * 0.7,
                    totalMaintenanceCostIdr: 12500000,
                    replacementRecommendation: 'Maintain Active Service'
                  }))).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{item.assetName}</div>
                        <div className="text-[11px] text-indigo-400 font-mono mt-0.5">{item.assetCode}</div>
                      </td>
                      <td className="p-3.5 text-slate-200">Rp {item.purchaseCostIdr.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 text-slate-300">{item.yearsInService} Tahun</td>
                      <td className="p-3.5 text-amber-300 font-mono">Rp {item.accumulatedDepreciationIdr.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 text-emerald-400 font-mono font-bold">Rp {item.currentBookValueIdr.toLocaleString('id-ID')}</td>
                      <td className="p-3.5 text-indigo-300 font-mono">Rp {item.totalMaintenanceCostIdr.toLocaleString('id-ID')}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.replacementRecommendation.includes('Replacement')
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.replacementRecommendation}
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

      {/* MODAL: LOG DOWNTIME / STOPPAGE */}
      {isAddDowntimeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" /> Log Machine Stoppage / Downtime
              </h3>
              <button onClick={() => setIsAddDowntimeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDowntimeLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Machine</label>
                <select
                  value={newDowntimeData.machineCode}
                  onChange={(e) => setNewDowntimeData({ ...newDowntimeData, machineCode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.machineCode}>
                      {m.machineCode} - {m.machineName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Downtime Category</label>
                  <select
                    value={newDowntimeData.category}
                    onChange={(e) => setNewDowntimeData({ ...newDowntimeData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Minor Stop / Jamming">Minor Stop / Jamming</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Changeover & Setup">Changeover & Setup</option>
                    <option value="No Raw Material">No Raw Material</option>
                    <option value="Quality Issue">Quality Issue</option>
                    <option value="Utility Failure">Utility Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDowntimeData.durationMinutes}
                    onChange={(e) => setNewDowntimeData({ ...newDowntimeData, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Root Cause Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Seal sensor dirty, cleared by operator..."
                  value={newDowntimeData.rootCause}
                  onChange={(e) => setNewDowntimeData({ ...newDowntimeData, rootCause: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Operator Name</label>
                <input
                  type="text"
                  required
                  value={newDowntimeData.operatorName}
                  onChange={(e) => setNewDowntimeData({ ...newDowntimeData, operatorName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDowntimeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs"
                >
                  Save Stoppage Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT REPORT CPKB / ISO 22716 */}
      {isAuditReportModalOpen && auditReportData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                  CosmoManufacture ERP • GMP Compliance
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Maintenance Audit & Compliance Report
                </h3>
              </div>
              <button onClick={() => setIsAuditReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-2">
                <span>Standard Rujukan:</span>
                <span className="font-semibold text-emerald-300">{auditReportData.standards}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Total Aset Aktif</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {auditReportData.metrics.activeAssets} / {auditReportData.metrics.totalRegisteredAssets}
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">PM Compliance Rate</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {auditReportData.metrics.pmComplianceRatePercent}%
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Calibration Validity</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">
                    {auditReportData.metrics.calibrationCompliancePercent}%
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Rata-Rata OEE Pabrik:</span>
                  <span className="font-bold text-white">{auditReportData.metrics.avgOeePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>MTBF (Mean Time Between Failure):</span>
                  <span className="font-bold text-white">{auditReportData.metrics.mtbfHoursAvg} Jam</span>
                </div>
                <div className="flex justify-between">
                  <span>MTTR (Mean Time To Repair):</span>
                  <span className="font-bold text-white">{auditReportData.metrics.mttrHoursAvg} Jam</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-[10px] text-slate-400 text-center">
                <div>
                  <div>Maintenance Mgr</div>
                  <div className="font-bold text-slate-200 mt-1">{auditReportData.verificationSignatures.maintenanceManager}</div>
                </div>
                <div>
                  <div>QA Manager</div>
                  <div className="font-bold text-slate-200 mt-1">{auditReportData.verificationSignatures.qaManager}</div>
                </div>
                <div>
                  <div>Plant Manager</div>
                  <div className="font-bold text-slate-200 mt-1">{auditReportData.verificationSignatures.plantHead}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => alert('Laporan audit berhasil diunduh dalam format PDF Compliance.')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export PDF Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER ASSET */}
      {isAddAssetModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-400" /> Register New Asset
              </h3>
              <button onClick={() => setIsAddAssetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Shear Homogenizer Mixer 500L"
                  value={newAssetData.assetName}
                  onChange={(e) => setNewAssetData({ ...newAssetData, assetName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Asset Category</label>
                  <select
                    value={newAssetData.category}
                    onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Production Equipment">Production Equipment</option>
                    <option value="Laboratory Instrument">Laboratory Instrument</option>
                    <option value="Utility System">Utility System</option>
                    <option value="Facility & Building">Facility & Building</option>
                    <option value="Vehicle & Transport">Vehicle & Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Criticality</label>
                  <select
                    value={newAssetData.criticality}
                    onChange={(e) => setNewAssetData({ ...newAssetData, criticality: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High (Critical)">High (Critical)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="SN-99102"
                    value={newAssetData.serialNumber}
                    onChange={(e) => setNewAssetData({ ...newAssetData, serialNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Purchase Cost (IDR)</label>
                  <input
                    type="number"
                    value={newAssetData.purchaseCostIdr}
                    onChange={(e) => setNewAssetData({ ...newAssetData, purchaseCostIdr: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hierarchy Location</label>
                <input
                  type="text"
                  value={newAssetData.hierarchyLocation}
                  onChange={(e) => setNewAssetData({ ...newAssetData, hierarchyLocation: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssetModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WORK ORDER */}
      {isAddWoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-400" /> Create Maintenance Work Order
              </h3>
              <button onClick={() => setIsAddWoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Machine</label>
                <select
                  value={newWoData.machineCode}
                  onChange={(e) => setNewWoData({ ...newWoData, machineCode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.machineCode}>
                      {m.machineCode} - {m.machineName} ({m.lineLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newWoData.category}
                    onChange={(e) => setNewWoData({ ...newWoData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Preventive">Preventive Maintenance</option>
                    <option value="Predictive">Predictive Maintenance</option>
                    <option value="Corrective">Corrective Maintenance</option>
                    <option value="Emergency">Emergency Maintenance</option>
                    <option value="Breakdown">Breakdown Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={newWoData.priority}
                    onChange={(e) => setNewWoData({ ...newWoData, priority: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Problem / Task Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue or routine maintenance task details..."
                  value={newWoData.problemDescription}
                  onChange={(e) => setNewWoData({ ...newWoData, problemDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Technician</label>
                  <input
                    type="text"
                    value={newWoData.assignedTechnician}
                    onChange={(e) => setNewWoData({ ...newWoData, assignedTechnician: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newWoData.estimatedHours}
                    onChange={(e) => setNewWoData({ ...newWoData, estimatedHours: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWoModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Generate Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG CALIBRATION CERTIFICATE */}
      {isAddCalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Log Calibration Certificate (ISO 17025)
              </h3>
              <button onClick={() => setIsAddCalModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCalibration} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Instrument / Sensor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Temperature Sensor Pt100 Mix Tank A"
                  value={newCalData.instrumentName}
                  onChange={(e) => setNewCalData({ ...newCalData, instrumentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="SN-CAL-901"
                    value={newCalData.serialNumber}
                    onChange={(e) => setNewCalData({ ...newCalData, serialNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newCalData.location}
                    onChange={(e) => setNewCalData({ ...newCalData, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Service Provider</label>
                  <input
                    type="text"
                    value={newCalData.serviceProvider}
                    onChange={(e) => setNewCalData({ ...newCalData, serviceProvider: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Certificate Number</label>
                  <input
                    type="text"
                    placeholder="KAN-2026-9012"
                    value={newCalData.certificateNumber}
                    onChange={(e) => setNewCalData({ ...newCalData, certificateNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Last Calibration Date</label>
                  <input
                    type="date"
                    value={newCalData.lastCalibrationDate}
                    onChange={(e) => setNewCalData({ ...newCalData, lastCalibrationDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    value={newCalData.nextDueDate}
                    onChange={(e) => setNewCalData({ ...newCalData, nextDueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCalModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Save Calibration Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PREVENTIVE MAINTENANCE SCHEDULE */}
      {isAddPmModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Create Preventive Schedule (PM)
              </h3>
              <button onClick={() => setIsAddPmModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePmSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Machine</label>
                <select
                  value={newPmData.machineCode}
                  onChange={(e) => setNewPmData({ ...newPmData, machineCode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.machineCode}>
                      {m.machineCode} - {m.machineName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PM Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Check Homogenizer Shaft Seal & Lubricate Bearings"
                  value={newPmData.taskTitle}
                  onChange={(e) => setNewPmData({ ...newPmData, taskTitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Frequency</label>
                  <select
                    value={newPmData.frequency}
                    onChange={(e) => setNewPmData({ ...newPmData, frequency: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Criticality</label>
                  <select
                    value={newPmData.criticality}
                    onChange={(e) => setNewPmData({ ...newPmData, criticality: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Technician</label>
                  <input
                    type="text"
                    value={newPmData.assignedTechnician}
                    onChange={(e) => setNewPmData({ ...newPmData, assignedTechnician: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    value={newPmData.estimatedHours}
                    onChange={(e) => setNewPmData({ ...newPmData, estimatedHours: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPmModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Save PM Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SPARE PART */}
      {isAddSpareModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" /> Add New Spare Part
              </h3>
              <button onClick={() => setIsAddSpareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSparePart} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Part Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical Seal Viton 40mm"
                  value={newSpareData.partName}
                  onChange={(e) => setNewSpareData({ ...newSpareData, partName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newSpareData.stockQuantity}
                    onChange={(e) => setNewSpareData({ ...newSpareData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min Reorder Threshold</label>
                  <input
                    type="number"
                    value={newSpareData.minReorderPoint}
                    onChange={(e) => setNewSpareData({ ...newSpareData, minReorderPoint: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Unit Cost (IDR)</label>
                  <input
                    type="number"
                    value={newSpareData.unitCostIdr}
                    onChange={(e) => setNewSpareData({ ...newSpareData, unitCostIdr: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bin Location</label>
                  <input
                    type="text"
                    value={newSpareData.storageBinLocation}
                    onChange={(e) => setNewSpareData({ ...newSpareData, storageBinLocation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpareModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
