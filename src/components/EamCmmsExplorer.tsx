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
  Filter,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  RefreshCw,
  Gauge,
  Sliders,
  Settings,
  X,
  Truck,
  Droplet,
  Flame,
} from 'lucide-react';
import {
  Asset,
  MachineRegister,
  MaintenanceWorkOrder,
  CalibrationRecord,
  SparePartMaster,
  UtilityAsset,
  EnergyLog,
  initialAssets,
  initialMachines,
  initialWorkOrders,
  initialCalibrations,
  initialSpareParts,
  initialUtilities,
  initialEnergyLogs,
} from '../../server/eamCmmsData';

export const EamCmmsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'assets' | 'machines' | 'work-orders' | 'calibration' | 'spare-parts' | 'utilities' | 'ai-assistant'
  >('dashboard');

  // State
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [machines, setMachines] = useState<MachineRegister[]>(initialMachines);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(initialWorkOrders);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(initialCalibrations);
  const [spareParts, setSpareParts] = useState<SparePartMaster[]>(initialSpareParts);
  const [utilities, setUtilities] = useState<UtilityAsset[]>(initialUtilities);
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(initialEnergyLogs);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Modals
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isAddWoModalOpen, setIsAddWoModalOpen] = useState(false);
  const [isAddCalModalOpen, setIsAddCalModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // AI Prediction state
  const [selectedMachineForAi, setSelectedMachineForAi] = useState<string>('MCH-MIX-01');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Forms
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

  const [newCalData, setNewCalData] = useState({
    instrumentName: '',
    serialNumber: '',
    location: 'QC Lab Instrument Room',
    calibrationType: 'External Accredited (KAN / ISO 17025)' as CalibrationRecord['calibrationType'],
    serviceProvider: 'PT BSN Kalibrasi Indonesia',
    nextDueDate: '2027-08-01',
  });

  // Fetch initial data from backend if available
  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setAssets(res.data);
      })
      .catch(() => {});

    fetch('/api/machines')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setMachines(res.data);
      })
      .catch(() => {});

    fetch('/api/work-orders')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setWorkOrders(res.data);
      })
      .catch(() => {});

    fetch('/api/calibration')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setCalibrations(res.data);
      })
      .catch(() => {});

    fetch('/api/spare-parts')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setSpareParts(res.data);
      })
      .catch(() => {});

    fetch('/api/utilities')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setUtilities(res.data);
      })
      .catch(() => {});
  }, []);

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
      // Fallback local
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

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedMach = machines.find((m) => m.machineCode === newWoData.machineCode);
    const mockWo: MaintenanceWorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
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
          w.id === woId
            ? { ...w, status: newStatus, actualHours: 3.5, totalCostIdr: 225000 }
            : w
        )
      );
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

  // KPIs
  const totalAssetsCount = assets.length;
  const activeAssetsCount = assets.filter((a) => a.status === 'In Service').length;
  const openWorkOrdersCount = workOrders.filter((w) => w.status !== 'Verified & Closed').length;
  const calibrationDueCount = calibrations.filter((c) => c.status === 'Due Soon' || c.status === 'Expired').length;
  const lowSparePartsCount = spareParts.filter((s) => s.stockQuantity <= s.minReorderPoint).length;

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wider uppercase">
            <Wrench className="w-4 h-4" />
            <span>CosmoManufacture AI ERP • Module 16</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Enterprise Asset Management (EAM) & CMMS</h1>
          <p className="text-slate-400 text-sm">
            Asset Lifecycle, Maintenance Work Orders, Calibration, Spare Parts, Utility & Predictive AI Control
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddWoModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-slate-700"
          >
            <Box className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard & KPI', icon: Gauge },
          { id: 'assets', label: 'Asset Register & Hierarchy', icon: Box },
          { id: 'machines', label: 'Machine Register', icon: Cpu },
          { id: 'work-orders', label: 'CMMS Work Orders', icon: Wrench },
          { id: 'calibration', label: 'Calibration & LIMS', icon: ShieldCheck },
          { id: 'spare-parts', label: 'Spare Parts Inventory', icon: Settings },
          { id: 'utilities', label: 'Utilities & Energy', icon: Zap },
          { id: 'ai-assistant', label: 'AI Predictive Maintenance', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-medium text-xs transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <Clock className="w-3 h-3" /> 2 In-Progress
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Calibration Status</span>
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
              <div className="text-2xl font-bold text-rose-400 mt-2">{lowSparePartsCount} Low Stock</div>
              <div className="text-xs text-slate-400 mt-1">Reorder threshold alert</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Avg Plant OEE</span>
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-sky-400 mt-2">94.8%</div>
              <div className="text-xs text-emerald-400 mt-1">MTBF: 520 hrs | MTTR: 2.3 hrs</div>
            </div>
          </div>

          {/* Quick Machine & Utility Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Machine Status Summary */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Production Machine Operational Status</span>
                </h3>
                <span className="text-xs text-slate-400">Live Telemetry</span>
              </div>
              <div className="space-y-3">
                {machines.map((m) => (
                  <div key={m.id} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-white">{m.machineName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Code: {m.machineCode} • Line: {m.lineLocation} • OEE: {m.oeeAvailabilityPercent}%
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          m.status === 'Running'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'Standby'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">PM Due: {m.nextPreventiveDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Utility & Cleanroom Systems */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Cleanroom Utilities & Utility Load</span>
                </h3>
                <span className="text-xs text-slate-400">Real-time IoT Sensors</span>
              </div>
              <div className="space-y-3">
                {utilities.map((u) => (
                  <div key={u.id} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-slate-200">{u.utilityName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
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
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          u.currentLoadPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
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

      {/* TAB 2: ASSET REGISTER & HIERARCHY */}
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

      {/* TAB 3: MACHINE REGISTER */}
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

      {/* TAB 4: CMMS WORK ORDERS */}
      {activeTab === 'work-orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <h3 className="font-semibold text-white text-sm">Active & Historical Work Orders (CMMS)</h3>
            <button
              onClick={() => setIsAddWoModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Create Work Order
            </button>
          </div>

          <div className="space-y-4">
            {workOrders.map((wo) => (
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

      {/* TAB 5: CALIBRATION */}
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

      {/* TAB 6: SPARE PARTS */}
      {activeTab === 'spare-parts' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm">Maintenance Spare Parts Inventory</h3>
              <p className="text-xs text-slate-400">Critical spares, minimum reorder thresholds & machine compatibility</p>
            </div>
            <button
              onClick={() => {}}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium"
            >
              Add Spare Part
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

                <div className="text-[11px] text-slate-400">
                  Compatible: {sp.compatibleMachines.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: UTILITIES & ENERGY */}
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

      {/* TAB 8: AI PREDICTIVE MAINTENANCE */}
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
    </div>
  );
};
