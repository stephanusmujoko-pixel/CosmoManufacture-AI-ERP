import React, { useState } from 'react';
import {
  Factory,
  FileText,
  Clock,
  Cpu,
  FileCheck2,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Gauge,
  Sparkles,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  mockManufacturingOrders,
  mockWorkOrders,
  mockShopFloorStations,
  mockEbrList,
  mockMaterialDispensing,
  mockYieldWasteRecords,
  mockDeviations,
  mockDowntimeLogs,
  mockOeeMetrics,
} from '../data/mesMockData';
import { ManufacturingOrder, WorkOrder, ProductionDeviation, DowntimeLog } from '../types/mes';

import { RealtimeControlCenterTab } from './mes/RealtimeControlCenterTab';
import { ManufacturingOrdersTab } from './mes/ManufacturingOrdersTab';
import { WorkOrdersRoutingTab } from './mes/WorkOrdersRoutingTab';
import { ShopFloorLiveTab } from './mes/ShopFloorLiveTab';
import { EbrBatchRecordTab } from './mes/EbrBatchRecordTab';
import { MaterialIssueDispensingTab } from './mes/MaterialIssueDispensingTab';
import { YieldWasteReconciliationTab } from './mes/YieldWasteReconciliationTab';
import { DeviationsReworkTab } from './mes/DeviationsReworkTab';
import { OeeDowntimeAnalysisTab } from './mes/OeeDowntimeAnalysisTab';
import { AiProductionAssistantTab } from './mes/AiProductionAssistantTab';

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

  const [showLineClearanceModal, setShowLineClearanceModal] = useState(false);
  const [showNewMoModal, setShowNewMoModal] = useState(false);

  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>(
    mockManufacturingOrders
  );
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [deviations, setDeviations] = useState<ProductionDeviation[]>(mockDeviations);
  const [downtimeLogs, setDowntimeLogs] = useState<DowntimeLog[]>(mockDowntimeLogs);

  const [lineClearanceChecked, setLineClearanceChecked] = useState({
    cleaningVerified: true,
    equipmentCalibrated: true,
    materialsValidated: true,
    previousLotRemoved: true,
    operatorCompetent: true,
  });

  // State for new MO modal form
  const [newMoForm, setNewMoForm] = useState({
    productName: 'HydraBright Ceramide Serum 30ml',
    clientName: 'PT Beauté Glow Indonesia (Maklon)',
    formulaCode: 'FRM-SKN-2026-008 (v2.0)',
    line: 'Line A (Serum & Liquid Compounding)',
    targetUnits: 15000,
    targetKg: 460,
    priority: 'High' as 'High' | 'Normal' | 'Low',
    startDate: '2026-08-14',
    finishDate: '2026-08-16',
  });

  const handleCreateNewMo = () => {
    const createdMo: ManufacturingOrder = {
      id: `MO-${Date.now()}`,
      moNumber: `MO-202608-${Math.floor(10 + Math.random() * 90)}`,
      productionPlanRef: `MPS-SKN-${Math.floor(10 + Math.random() * 90)}`,
      factoryName: 'Plant 1 - Jababeka Cleanroom Class D',
      productionLine: newMoForm.line,
      productName: newMoForm.productName,
      productCode: 'FG-NEW-2026',
      formulaCode: newMoForm.formulaCode,
      bomVersion: 'BOM-v2.0',
      targetQtyUnits: Number(newMoForm.targetUnits),
      targetBatchKg: Number(newMoForm.targetKg),
      targetYieldPercent: 98.5,
      startDatePlan: newMoForm.startDate,
      finishDatePlan: newMoForm.finishDate,
      priority: newMoForm.priority,
      status: 'In Production',
      approvalStatus: 'Approved by Director',
      clientName: newMoForm.clientName,
      estimatedCogsIdr: Number(newMoForm.targetUnits) * 24000,
    };

    setManufacturingOrders([createdMo, ...manufacturingOrders]);
    setShowNewMoModal(false);
    setActiveSubTab('manufacturing_orders');
  };

  const handleUpdateWoStatus = (woId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === woId
          ? {
              ...w,
              status: newStatus,
              progressPercent: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0,
            }
          : w
      )
    );
  };

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
                    Prompt 13 • Shop Floor Control
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Eksekusi Produksi Realtime & Paperless Kosmetik: MO, WO, Live Shop Floor, Electronic Batch Record (EBR), Line Clearance CPKB, & OEE Monitoring.
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
              <span>AI Production Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>MO Dalam Eksekusi</span>
            <Factory className="h-3.5 w-3.5 text-teal-400" />
          </div>
          <p className="text-lg font-black font-mono text-teal-300">{activeMoCount} Batch MO</p>
          <p className="text-[10px] text-emerald-400 font-semibold">100% FEFO Allocated</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Active Work Orders</span>
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">{inProgressWoCount} WO Running</p>
          <p className="text-[10px] text-cyan-400 font-semibold">Cleanroom Class D</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Rata-Rata OEE Mesin</span>
            <Gauge className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-400">87.2%</p>
          <p className="text-[10px] text-emerald-300 font-bold">Target World Class {'>'} 85%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Rata-Rata Yield Bulk</span>
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">98.8%</p>
          <p className="text-[10px] text-slate-400">Loss Liquid 1.2%</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Deviasi Produksi</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black font-mono text-amber-300">{deviations.length} Log Deviasi</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ CAPA Approved</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>EBR Batch Record</span>
            <FileCheck2 className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <p className="text-lg font-black font-mono text-purple-300">100% Signed</p>
          <p className="text-[10px] text-slate-400">BPOM / CPKB Ready</p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
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
          <span>Material Issue & Dispensing</span>
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
          onClick={() => setActiveSubTab('deviations_rework')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'deviations_rework'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Deviations & Rework</span>
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
          <span>AI Production Copilot</span>
        </button>
      </div>

      {/* Sub-Tab Views */}
      {activeSubTab === 'dashboard' && (
        <RealtimeControlCenterTab
          stations={mockShopFloorStations}
          ebrList={mockEbrList}
          activeMoCount={activeMoCount}
          inProgressWoCount={inProgressWoCount}
          onSelectSubTab={(tab) => setActiveSubTab(tab)}
          onOpenLineClearanceModal={() => setShowLineClearanceModal(true)}
        />
      )}

      {activeSubTab === 'manufacturing_orders' && (
        <ManufacturingOrdersTab
          orders={manufacturingOrders}
          onOpenNewMoModal={() => setShowNewMoModal(true)}
          onSelectMo={() => setActiveSubTab('work_orders')}
        />
      )}

      {activeSubTab === 'work_orders' && (
        <WorkOrdersRoutingTab
          workOrders={workOrders}
          onUpdateWoStatus={handleUpdateWoStatus}
        />
      )}

      {activeSubTab === 'shop_floor' && (
        <ShopFloorLiveTab
          stations={mockShopFloorStations}
          onOpenLineClearanceModal={() => setShowLineClearanceModal(true)}
        />
      )}

      {activeSubTab === 'ebr_batch_record' && (
        <EbrBatchRecordTab ebrList={mockEbrList} />
      )}

      {activeSubTab === 'material_issue' && (
        <MaterialIssueDispensingTab dispensingList={mockMaterialDispensing} />
      )}

      {activeSubTab === 'yield_waste' && (
        <YieldWasteReconciliationTab records={mockYieldWasteRecords} />
      )}

      {activeSubTab === 'deviations_rework' && (
        <DeviationsReworkTab
          deviations={deviations}
          onAddDeviation={(dev) => setDeviations([dev, ...deviations])}
        />
      )}

      {activeSubTab === 'oee_downtime' && (
        <OeeDowntimeAnalysisTab
          oeeMetrics={mockOeeMetrics}
          downtimeLogs={downtimeLogs}
          onAddDowntimeLog={(log) => setDowntimeLogs([log, ...downtimeLogs])}
        />
      )}

      {activeSubTab === 'ai_production' && <AiProductionAssistantTab />}

      {/* MODAL: Line Clearance Verification */}
      {showLineClearanceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Verifikasi Line Clearance (CPKB BPOM)</h3>
              </div>
              <button
                onClick={() => setShowLineClearanceModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              Pemeriksaan Kesiapan Cleanroom Class D sebelum Kompounding Batch Baru:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.cleaningVerified}
                  onChange={(e) =>
                    setLineClearanceChecked({
                      ...lineClearanceChecked,
                      cleaningVerified: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">1. CIP/SIP Sanitasi Selesai</span>
                  <span className="text-[10px] text-slate-400">
                    Bebas dari sisa residu produk atau deterjen batch sebelumnya
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.equipmentCalibrated}
                  onChange={(e) =>
                    setLineClearanceChecked({
                      ...lineClearanceChecked,
                      equipmentCalibrated: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">2. Kalibrasi Sensor Suhu & Timbangan</span>
                  <span className="text-[10px] text-slate-400">
                    Sticker kalibrasi aktif & terverifikasi oleh QC
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineClearanceChecked.materialsValidated}
                  onChange={(e) =>
                    setLineClearanceChecked({
                      ...lineClearanceChecked,
                      materialsValidated: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <span className="text-white font-bold block">3. Verifikasi Label FEFO Bahan Aktif</span>
                  <span className="text-[10px] text-slate-400">
                    Penimbangan sesuai standar formula R&D v2.0
                  </span>
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

      {/* MODAL: Rilis MO Baru */}
      {showNewMoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Form Rilis MO Baru (Perintah Manufaktur)</h3>
              </div>
              <button
                onClick={() => setShowNewMoModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Nama Produk Kosmetik:</label>
                <input
                  type="text"
                  value={newMoForm.productName}
                  onChange={(e) => setNewMoForm({ ...newMoForm, productName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Klien Maklon / Own Brand:</label>
                <input
                  type="text"
                  value={newMoForm.clientName}
                  onChange={(e) => setNewMoForm({ ...newMoForm, clientName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Formula Code R&D:</label>
                  <input
                    type="text"
                    value={newMoForm.formulaCode}
                    onChange={(e) => setNewMoForm({ ...newMoForm, formulaCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Kemasan (Pcs):</label>
                  <input
                    type="number"
                    value={newMoForm.targetUnits}
                    onChange={(e) => setNewMoForm({ ...newMoForm, targetUnits: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Batch Bulk (Kg):</label>
                  <input
                    type="number"
                    value={newMoForm.targetKg}
                    onChange={(e) => setNewMoForm({ ...newMoForm, targetKg: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Prioritas MO:</label>
                  <select
                    value={newMoForm.priority}
                    onChange={(e) => setNewMoForm({ ...newMoForm, priority: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Normal">Normal Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lini Produksi:</label>
                <select
                  value={newMoForm.line}
                  onChange={(e) => setNewMoForm({ ...newMoForm, line: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Line A (Serum & Liquid Compounding)">Line A (Serum & Liquid Compounding)</option>
                  <option value="Line B (Cream & Emulsion High Shear)">Line B (Cream & Emulsion High Shear)</option>
                  <option value="Line C (Tube Filling & Packaging)">Line C (Tube Filling & Packaging)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNewMoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateNewMo}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                Rilis Perintah Manufaktur (MO)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
