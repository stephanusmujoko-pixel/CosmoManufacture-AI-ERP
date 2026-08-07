import React, { useState } from 'react';
import {
  Boxes,
  QrCode,
  Scan,
  Truck,
  ArrowLeftRight,
  ClipboardCheck,
  AlertTriangle,
  Thermometer,
  Bot,
  Sparkles,
  Layers,
  Search,
  Filter,
  Printer,
  PackageCheck,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  FileText,
  Building2,
  Tag,
  ChevronRight,
  Download,
  Upload,
  BarChart3,
  Check,
  X,
  Play,
  Plus,
  Eye,
  MapPin,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  Scale,
  Flame,
  Activity,
  UserCheck,
} from 'lucide-react';
import { formatCurrencyIDR } from '../lib/utils';

// Types for WMS
export interface WarehouseMaster {
  id: string;
  code: string;
  name: string;
  factory: string;
  address: string;
  manager: string;
  temperatureType: 'Room Temp (20-25°C)' | 'Cold Room (2-8°C)' | 'Controlled Cleanroom' | 'Hazardous Flammable';
  humidityControl: string;
  totalCapacityBins: number;
  usedBins: number;
  status: 'active' | 'maintenance' | 'full';
}

export interface WarehouseLocationHierarchy {
  warehouse: string;
  zone: string;
  area: string;
  rack: string;
  shelf: string;
  bin: string;
  barcode: string;
  qrCode: string;
  status: 'available' | 'occupied' | 'qc_hold' | 'quarantine' | 'maintenance';
  currentBatch?: string;
  currentMaterial?: string;
  qtyKg?: number;
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poReference: string;
  supplierName: string;
  materialName: string;
  inciName: string;
  receivedQtyKg: number;
  batchSupplier: string;
  internalLotNumber: string;
  mfdDate: string;
  expDate: string;
  inspectionStatus: 'qc_passed' | 'qc_hold' | 'quarantine' | 'rejected';
  suggestedLocation: string;
  assignedLocation?: string;
  storageCondition: string;
  receivedDate: string;
}

export interface PickingOrder {
  id: string;
  pickOrderNumber: string;
  referenceType: 'work_order' | 'sales_order' | 'lab_sample';
  referenceNumber: string;
  targetCustomerOrBatch: string;
  materialName: string;
  requiredQtyKg: number;
  allocatedBatch: string;
  sourceLocation: string;
  pickingStrategy: 'FEFO' | 'FIFO' | 'Wave' | 'Zone';
  status: 'pending' | 'picking_in_progress' | 'packed' | 'shipped';
  expiryDate: string;
}

export interface StockMovement {
  id: string;
  transferNumber: string;
  movementType: 'inter_warehouse' | 'bin_to_bin' | 'quarantine_release' | 'production_issue';
  materialName: string;
  batchLot: string;
  qtyKg: number;
  sourceLocation: string;
  targetLocation: string;
  requestedBy: string;
  status: 'approved' | 'pending' | 'completed';
  timestamp: string;
}

export const WmsExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard_map' | 'receiving' | 'picking_shipping' | 'transfers' | 'stock_opname' | 'ai_assistant' | 'audit_barcodes'
  >('dashboard_map');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string>('all');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [showNewReceivingModal, setShowNewReceivingModal] = useState(false);

  // Mock Warehouses Data
  const [warehouses] = useState<WarehouseMaster[]>([
    {
      id: 'WH-01',
      code: 'WH-RM-01',
      name: 'Gudang Bahan Baku Utama (Raw Material Main)',
      factory: 'Pabrik Cikarang Plant A',
      address: 'Kawasan Industri Jababeka V, Cikarang',
      manager: 'Budi Santoso, S.T.',
      temperatureType: 'Room Temp (20-25°C)',
      humidityControl: '55% RH ± 5%',
      totalCapacityBins: 1200,
      usedBins: 980,
      status: 'active',
    },
    {
      id: 'WH-02',
      code: 'WH-COLD-02',
      name: 'Gudang Cold Storage Active Ingredients & Peptides',
      factory: 'Pabrik Cikarang Plant A',
      address: 'Cleanroom Wing B2',
      manager: 'Apt. Rina Wijaya, S.Farm',
      temperatureType: 'Cold Room (2-8°C)',
      humidityControl: '45% RH Sensor Auto',
      totalCapacityBins: 350,
      usedBins: 290,
      status: 'active',
    },
    {
      id: 'WH-03',
      code: 'WH-PKG-03',
      name: 'Gudang Kemasan & Botol Airless Pump',
      factory: 'Pabrik Cikarang Plant A',
      address: 'Kawasan Industri Jababeka V, Cikarang',
      manager: 'Hendra Setiawan',
      temperatureType: 'Room Temp (20-25°C)',
      humidityControl: '60% RH',
      totalCapacityBins: 2000,
      usedBins: 1450,
      status: 'active',
    },
    {
      id: 'WH-04',
      code: 'WH-FG-04',
      name: 'Gudang Barang Jadi Skincare (Finished Goods & Maklon Dispatch)',
      factory: 'Pabrik Cikarang Plant B',
      address: 'Logistics Center Block C',
      manager: 'Dewi Kartika',
      temperatureType: 'Room Temp (20-25°C)',
      humidityControl: '50% RH',
      totalCapacityBins: 3000,
      usedBins: 2680,
      status: 'active',
    },
  ]);

  // Selected Location for Map Drilldown
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('WH-01');
  const [selectedZone, setSelectedZone] = useState<string>('Zone A - Active Actives');
  const [selectedBin, setSelectedBin] = useState<WarehouseLocationHierarchy>({
    warehouse: 'Gudang Bahan Baku Utama',
    zone: 'Zone A - Active Actives',
    area: 'Area Cold-Controlled A1',
    rack: 'Rack R-04',
    shelf: 'Shelf S-02',
    bin: 'Bin B-18',
    barcode: 'LOC-W1-ZA-R04-S02-B18',
    qrCode: 'QR-LOC-99182',
    status: 'occupied',
    currentBatch: 'LOT-NCP-2026-08',
    currentMaterial: 'Niacinamide USP Grade 99.5%',
    qtyKg: 250,
  });

  // Mock Receipts
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([
    {
      id: 'GRN-001',
      grnNumber: 'GRN-202608-0112',
      poReference: 'PO-2026-0881',
      supplierName: 'BASF Chemical Indonesia',
      materialName: 'Niacinamide USP Powder',
      inciName: 'Niacinamide',
      receivedQtyKg: 500,
      batchSupplier: 'SUP-BASF-88120',
      internalLotNumber: 'LOT-NCP-2026-08',
      mfdDate: '2026-06-15',
      expDate: '2028-06-14',
      inspectionStatus: 'qc_passed',
      suggestedLocation: 'WH-RM-01 / Zone A / Rack R-04 / Bin B-18',
      assignedLocation: 'WH-RM-01 / Zone A / Rack R-04 / Bin B-18',
      storageCondition: 'Room Temp (20-25°C)',
      receivedDate: '2026-08-05 09:30',
    },
    {
      id: 'GRN-002',
      grnNumber: 'GRN-202608-0113',
      poReference: 'PO-2026-0895',
      supplierName: 'Croda Personal Care UK',
      materialName: 'Centella Asiatica Extract 98%',
      inciName: 'Centella Asiatica Leaf Extract',
      receivedQtyKg: 120,
      batchSupplier: 'CRD-CTA-99211',
      internalLotNumber: 'LOT-CTA-2026-02',
      mfdDate: '2026-07-01',
      expDate: '2027-07-01',
      inspectionStatus: 'qc_hold',
      suggestedLocation: 'WH-COLD-02 / Cold Zone C1 / Rack R-01 / Bin B-02',
      storageCondition: 'Cold Room (2-8°C)',
      receivedDate: '2026-08-06 10:15',
    },
    {
      id: 'GRN-003',
      grnNumber: 'GRN-202608-0114',
      poReference: 'PO-2026-0902',
      supplierName: 'Evonik Specialty Chemicals',
      materialName: 'Ceramide NP Pure Powder',
      inciName: 'Ceramide NP',
      receivedQtyKg: 50,
      batchSupplier: 'EVK-CRM-7718',
      internalLotNumber: 'LOT-CRM-2026-01',
      mfdDate: '2026-05-20',
      expDate: '2028-05-19',
      inspectionStatus: 'quarantine',
      suggestedLocation: 'WH-RM-01 / Quarantine Zone Q / Rack RQ-01',
      storageCondition: 'Cold Room (2-8°C)',
      receivedDate: '2026-08-06 14:00',
    },
  ]);

  // Mock Picking Orders
  const [pickingOrders, setPickingOrders] = useState<PickingOrder[]>([
    {
      id: 'PK-01',
      pickOrderNumber: 'PICK-WO-2026-0441',
      referenceType: 'work_order',
      referenceNumber: 'WO-BATCH-9901 (Serum Brightening 1000L)',
      targetCustomerOrBatch: 'Tangki Homogenizer Vacuum 1',
      materialName: 'Niacinamide USP Powder',
      requiredQtyKg: 100,
      allocatedBatch: 'LOT-NCP-2026-08',
      sourceLocation: 'WH-RM-01 / Zone A / Rack R-04 / Bin B-18',
      pickingStrategy: 'FEFO',
      status: 'picking_in_progress',
      expiryDate: '2028-06-14',
    },
    {
      id: 'PK-02',
      pickOrderNumber: 'PICK-SO-2026-0812',
      referenceType: 'sales_order',
      referenceNumber: 'SO-MAKLON-7782 (GlowSkin Brand)',
      targetCustomerOrBatch: 'PT GlowSkin Beauty Indonesia',
      materialName: 'Finished Goods: Sunscreen SPF 50 PA++++ 50ml',
      requiredQtyKg: 2500, // units/kg
      allocatedBatch: 'FG-SUN-2026-12',
      sourceLocation: 'WH-FG-04 / Zone Dispatch / Rack R-10 / Bin B-01',
      pickingStrategy: 'FIFO',
      status: 'pending',
      expiryDate: '2027-12-30',
    },
  ]);

  // Mock Stock Movements
  const [movements] = useState<StockMovement[]>([
    {
      id: 'TR-101',
      transferNumber: 'TRF-202608-0021',
      movementType: 'quarantine_release',
      materialName: 'Hyaluronic Acid Multi-Molecular',
      batchLot: 'LOT-HA-2026-05',
      qtyKg: 75,
      sourceLocation: 'Quarantine Zone Q-01',
      targetLocation: 'WH-COLD-02 / Bin B-12',
      requestedBy: 'QC Lead - Apt. Dian, S.Farm',
      status: 'completed',
      timestamp: '2026-08-06 11:20',
    },
    {
      id: 'TR-102',
      transferNumber: 'TRF-202608-0022',
      movementType: 'production_issue',
      materialName: 'Glycerin Botanical 99.7%',
      batchLot: 'LOT-GLY-2026-03',
      qtyKg: 300,
      sourceLocation: 'WH-RM-01 / Zone B / Bin B-40',
      targetLocation: 'Cleanroom Dispensing Room 2',
      requestedBy: 'Operator MES - Ahmad Fauzi',
      status: 'approved',
      timestamp: '2026-08-06 13:45',
    },
  ]);

  // Handle Barcode Scan Simulation
  const handleSimulateScan = (code: string) => {
    setScannedResult(code);
    setShowScannerModal(false);
  };

  // Quick Action for New Goods Receipt
  const handleCreateReceiving = () => {
    const newGRN: GoodsReceipt = {
      id: `GRN-00${receipts.length + 1}`,
      grnNumber: `GRN-202608-0${115 + receipts.length}`,
      poReference: `PO-2026-09${10 + receipts.length}`,
      supplierName: 'Mibelle Biochemistry Switzerland',
      materialName: 'PhytoCellTec Malus Domestica (Apple Stemcell)',
      inciName: 'Malus Domestica Fruit Cell Culture Extract',
      receivedQtyKg: 25,
      batchSupplier: `MIB-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      internalLotNumber: `LOT-APP-2026-0${receipts.length + 1}`,
      mfdDate: '2026-07-15',
      expDate: '2028-07-14',
      inspectionStatus: 'qc_passed',
      suggestedLocation: 'WH-COLD-02 / Cold Zone C1 / Rack R-02 / Bin B-05',
      assignedLocation: 'WH-COLD-02 / Cold Zone C1 / Rack R-02 / Bin B-05',
      storageCondition: 'Cold Room (2-8°C)',
      receivedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setReceipts([newGRN, ...receipts]);
    setShowNewReceivingModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-slate-950 shadow-lg">
                <Boxes className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Warehouse Management System (WMS) Enterprise
                  </h1>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 9 • CPKB Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Manajemen Gudang Multi-Level, Lot & FEFO Tracking, Cold Room Monitoring, Auto Put-Away, & Wave Picking.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Barcode Scanner & Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowScannerModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
              id="scan-barcode-btn"
            >
              <Scan className="h-4 w-4" />
              <span>Scan Barcode / QR Location</span>
            </button>

            <button
              onClick={() => setShowNewReceivingModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Receiving GRN</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_assistant')}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all"
            >
              <Bot className="h-4 w-4 text-amber-400" />
              <span>AI Warehouse Bot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Result Notice if active */}
      {scannedResult && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/40 p-4 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-3">
            <QrCode className="h-5 w-5 text-amber-400" />
            <div>
              <span className="font-bold">Baru saja di-Scan: </span>
              <span className="font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {scannedResult}
              </span>
              <span className="ml-2 text-slate-300">— Teridentifikasi di Slot R-04 / Shelf S-02 (Status: QC PASSED)</span>
            </div>
          </div>
          <button
            onClick={() => setScannedResult(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Kapasitas Gudang</span>
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-black font-mono text-white">84.5%</p>
          <p className="text-[10px] text-slate-400">5,400 / 6,550 Bins Terisi</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Receiving Hari Ini</span>
            <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">14 GRN</p>
          <p className="text-[10px] text-emerald-400 font-semibold">28.5 Ton Bahan Baku</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Picking & Dispatched</span>
            <ArrowUpFromLine className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-black font-mono text-cyan-300">18 Wave</p>
          <p className="text-[10px] text-cyan-400 font-semibold">100% FEFO Compliant</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Quarantine / QC Hold</span>
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-black font-mono text-amber-300">3.2 Ton</p>
          <p className="text-[10px] text-amber-400 font-semibold">3 Lot Menunggu Micro Test</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Suhu Cold Storage</span>
            <Thermometer className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <p className="text-xl font-black font-mono text-blue-300">4.2°C</p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Normal (RH 45%)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Peringatan Expired FEFO</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-black font-mono text-rose-300">2 Lot</p>
          <p className="text-[10px] text-rose-400 font-semibold">Expired &lt; 45 Hari (Prioritas)</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveSubTab('dashboard_map')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard_map'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Warehouse Master & Map Hierarchy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('receiving')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'receiving'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Receiving & AI Put-Away</span>
        </button>

        <button
          onClick={() => setActiveSubTab('picking_shipping')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'picking_shipping'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Picking, Packing & Shipping</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transfers')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'transfers'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Transfers & Movements</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stock_opname')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'stock_opname'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>Stock Opname & Quarantine</span>
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
          <span>AI Warehouse Assistant</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit_barcodes')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'audit_barcodes'
              ? 'bg-slate-800 text-slate-200 border-b-2 border-slate-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Barcode Labels & Audit Trail</span>
        </button>
      </div>

      {/* SUB-TAB 1: WAREHOUSE MASTER & MAP HIERARCHY */}
      {activeSubTab === 'dashboard_map' && (
        <div className="space-y-6">
          {/* Warehouse Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {warehouses.map((wh) => {
              const isSelected = selectedWarehouseId === wh.id;
              const percentUsed = Math.round((wh.usedBins / wh.totalCapacityBins) * 100);
              return (
                <div
                  key={wh.id}
                  onClick={() => setSelectedWarehouseId(wh.id)}
                  className={`rounded-2xl p-5 border cursor-pointer transition-all space-y-3 relative ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      {wh.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        wh.temperatureType.includes('Cold')
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {wh.temperatureType}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{wh.name}</h3>
                    <p className="text-[11px] text-slate-400">{wh.factory}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Pengisian Kapasitas:</span>
                      <span className="font-bold text-white">{percentUsed}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percentUsed > 90
                            ? 'bg-rose-500'
                            : percentUsed > 75
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 text-right">{wh.usedBins} / {wh.totalCapacityBins} Slot Bins</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Multi-Level Location Hierarchy & Rack Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Location Tree Browser */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white">Hierarki Lokasi Gudang</h2>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Warehouse → Zone → Rack → Bin</span>
              </div>

              {/* Hierarchy Tree Steps */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-300">1. Warehouse Level</span>
                  <span className="font-mono text-indigo-300 font-bold">{selectedWarehouseId}</span>
                </div>

                <div className="pl-4 space-y-2 border-l-2 border-indigo-500/40 ml-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">2. Storage Zone</span>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Zone A - Active Actives">Zone A — Bahan Aktif Skincare (Controlled)</option>
                      <option value="Zone B - Emulsifiers & Oils">Zone B — Emulsifier, Minyak & Polymer</option>
                      <option value="Zone C - Fragrance & Preservative">Zone C — Fragrance, Preservative & Alcohol</option>
                      <option value="Zone Q - Quarantine QC">Zone Q — Karantina QC & Sampling Room</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">3. Rack & Bin Grid Selection</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <button className="p-2 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-left font-bold">
                        Rack R-04 (Aktif)
                      </button>
                      <button className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-left hover:text-white">
                        Rack R-05
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Bin Detailed Box */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Detail Bin Terpilih:</span>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location Tag:</span>
                    <span className="font-bold text-amber-300">{selectedBin.barcode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status Bin:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
                      {selectedBin.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Material Stored:</span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">{selectedBin.currentMaterial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Internal Lot:</span>
                    <span className="font-bold text-cyan-300">{selectedBin.currentBatch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kuantitas Stok:</span>
                    <span className="font-bold text-white">{selectedBin.qtyKg} Kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive 2D Bin Occupancy Matrix (Visual Rack) */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Visual Rack & Bin Matrix Map</h2>
                  <p className="text-[11px] text-slate-400">Denah Rak {selectedZone} — Rack R-04 (5 Shelf x 6 Bin)</p>
                </div>

                <div className="flex items-center space-x-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Terisi (OK)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-400" /> FEFO Priority</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-rose-500" /> QC Hold</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-slate-800" /> Kosong</span>
                </div>
              </div>

              {/* Grid 5 Shelves x 6 Bins */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((shelfNum) => (
                  <div key={shelfNum} className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">SHELF S-0{shelfNum}</span>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((binNum) => {
                        const isThisBin = shelfNum === 2 && binNum === 3;
                        const isQC = shelfNum === 4 && binNum === 1;
                        const isFEFO = shelfNum === 3 && binNum === 5;
                        const isEmpty = shelfNum === 5 && binNum > 3;

                        let colorClass = 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
                        let label = `B-0${binNum}`;

                        if (isEmpty) {
                          colorClass = 'bg-slate-900 border-slate-800 text-slate-600';
                        } else if (isQC) {
                          colorClass = 'bg-rose-950 border-rose-500/50 text-rose-300';
                          label += ' (QC)';
                        } else if (isFEFO) {
                          colorClass = 'bg-amber-950 border-amber-500/50 text-amber-300';
                          label += ' (FEFO)';
                        } else if (isThisBin) {
                          colorClass = 'bg-indigo-600 border-amber-400 text-white font-extrabold ring-2 ring-amber-400';
                        }

                        return (
                          <div
                            key={binNum}
                            onClick={() => {
                              setSelectedBin({
                                ...selectedBin,
                                shelf: `Shelf S-0${shelfNum}`,
                                bin: `Bin B-0${binNum}`,
                                barcode: `LOC-W1-ZA-R04-S0${shelfNum}-B0${binNum}`,
                                currentMaterial: isEmpty ? 'Kosong (Ready)' : isQC ? 'Ceramide Powder' : 'Niacinamide USP Grade 99.5%',
                                qtyKg: isEmpty ? 0 : 250,
                              });
                            }}
                            className={`p-2.5 rounded-xl border text-center cursor-pointer hover:scale-105 transition-all text-xs font-mono space-y-1 ${colorClass}`}
                          >
                            <span className="block font-bold">{label}</span>
                            <span className="text-[9px] block opacity-80">
                              {isEmpty ? '0 Kg' : '250 Kg'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>📍 Klik slot bin untuk melihat detail isi & cetak QR barcode label</span>
                <button
                  onClick={() => setActiveSubTab('audit_barcodes')}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Label Barcode Bin Terpilih</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INBOUND RECEIVING & AI PUT-AWAY */}
      {activeSubTab === 'receiving' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Laporan Barang Masuk (Goods Receipt Note - GRN)</h2>
              <p className="text-xs text-slate-400">Validasi PO, Pengecekan Karantina QC, & Rekomendasi Lokasi Simpan AI</p>
            </div>
            <button
              onClick={() => setShowNewReceivingModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Input Goods Receipt Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {receipts.map((gr) => (
              <div
                key={gr.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-sm text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30">
                      {gr.grnNumber}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">{gr.materialName}</span>
                      <p className="text-[11px] text-slate-400">INCI: {gr.inciName} • Supplier: {gr.supplierName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-slate-400">PO Ref: {gr.poReference}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        gr.inspectionStatus === 'qc_passed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : gr.inspectionStatus === 'qc_hold'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-purple-950 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {gr.inspectionStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Jumlah Diterima:</span>
                    <span className="font-bold text-white text-sm">{gr.receivedQtyKg} Kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Nomor Lot Internal:</span>
                    <span className="font-bold text-amber-300">{gr.internalLotNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Tgl Expired (FEFO):</span>
                    <span className="font-bold text-cyan-300">{gr.expDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Kondisi Penyimpanan:</span>
                    <span className="font-bold text-slate-300">{gr.storageCondition}</span>
                  </div>
                </div>

                {/* AI Put Away Recommendation Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-3">
                    <Bot className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-300">Rekomendasi Lokasi AI Put-Away:</span>
                      <p className="font-mono font-bold text-white">{gr.suggestedLocation}</p>
                      <p className="text-[10px] text-slate-400">Alasan AI: FEFO Priority + Kontrol Suhu Terjaga + Kapasitas Bin Tersedia 85%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Lokasi Put-Away dikonfirmasi: ${gr.suggestedLocation}`);
                    }}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 whitespace-nowrap text-xs shadow"
                  >
                    Konfirmasi Put-Away →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PICKING, PACKING & SHIPPING */}
      {activeSubTab === 'picking_shipping' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Picking List */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Picking Orders & Wave Dispatch</h2>
                  <p className="text-xs text-slate-400">Strategi Picking FEFO / Wave untuk Produksi MES & Shipment Maklon</p>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                  2 Picking Task Active
                </span>
              </div>

              <div className="space-y-3">
                {pickingOrders.map((pk) => (
                  <div
                    key={pk.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2 font-mono font-bold">
                        <span className="text-cyan-300">{pk.pickOrderNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-white">{pk.referenceNumber}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        {pk.pickingStrategy} Strategy
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Item Material:</span>
                        <span className="font-bold text-white">{pk.materialName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Qty Dibutuhkan:</span>
                        <span className="font-bold text-emerald-300">{pk.requiredQtyKg} Kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Lot Di-Alokasi (FEFO):</span>
                        <span className="font-bold text-amber-300">{pk.allocatedBatch}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Lokasi Asal:</span>
                        <span className="font-bold text-slate-300">{pk.sourceLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Target: {pk.targetCustomerOrBatch}</span>
                      <button
                        onClick={() => handleSimulateScan(pk.allocatedBatch)}
                        className="rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-1 text-[11px] flex items-center gap-1 shadow"
                      >
                        <Scan className="h-3.5 w-3.5" />
                        <span>Scan Verification & Pick</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing & Shipping Container Simulator */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Truck className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Shipping & Delivery Order</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Delivery Order Active:</span>
                  <p className="font-mono font-bold text-white">DO-MAKLON-2026-0811</p>
                  <p className="text-slate-300">Penerima: PT GlowSkin Beauty Indonesia</p>
                  <p className="text-[11px] text-slate-400">Kurir: Lalamove Box / Ekspedisi Cold Chain</p>
                  <p className="text-[11px] text-slate-400">Tracking #: LLA-992018821</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Rincian Pallet & Shrink:</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pallet Tag:</span>
                    <span className="text-amber-300 font-bold">PLT-2026-0042</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Karton:</span>
                    <span className="text-white font-bold">120 Karton (6,000 Pcs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Berat Total:</span>
                    <span className="text-emerald-300 font-bold">380.5 Kg</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Delivery Order Diberangkatkan! Proof of Delivery (POD) diterbitkan.')}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 shadow"
                >
                  Proses Dispatched & Terbitkan Surat Jalan →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TRANSFERS & MOVEMENTS */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Riwayat Transfer Stok Internal & Antar Gudang</h2>
              <p className="text-xs text-slate-400">Pindahan Gudang Bahan Baku ke Cleanroom Dispensing MES dengan Otorisasi Supervisor</p>
            </div>
            <button
              onClick={() => alert('Form Transfer Lokasi Baru dibuka.')}
              className="flex items-center space-x-2 rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Perintah Transfer Baru</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono text-[11px]">
                  <th className="p-3.5 font-bold">No. Transfer</th>
                  <th className="p-3.5 font-bold">Tipe Movement</th>
                  <th className="p-3.5 font-bold">Material & Lot</th>
                  <th className="p-3.5 font-bold">Qty (Kg)</th>
                  <th className="p-3.5 font-bold">Lokasi Asal → Tujuan</th>
                  <th className="p-3.5 font-bold">Pengaju</th>
                  <th className="p-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-bold text-indigo-300">{m.transferNumber}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                        {m.movementType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-white font-bold block">{m.materialName}</span>
                      <span className="text-slate-400 text-[10px]">{m.batchLot}</span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-300">{m.qtyKg} Kg</td>
                    <td className="p-3.5 text-slate-300 text-[11px]">
                      {m.sourceLocation} → <span className="text-amber-300 font-bold">{m.targetLocation}</span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">{m.requestedBy}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
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

      {/* SUB-TAB 5: STOCK OPNAME & QUARANTINE */}
      {activeSubTab === 'stock_opname' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock Opname Execution Box */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <ClipboardCheck className="h-4 w-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Stock Opname & Cycle Counting</h2>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  Audit fisik persediaan berkala (Full Count / Blind Count) untuk memastikan kesesuaian antara fisik rak dengan catatan sistem.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jadwal Opname Terdekat:</span>
                    <span className="text-purple-300 font-bold">Cycle Count Zone A (Cold Room)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode:</span>
                    <span className="text-white">Blind Count (Sistem menyembunyikan Qty)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Bins di-Opname:</span>
                    <span className="text-emerald-300 font-bold">120 Bin Slots</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Lembar Kerja Cycle Count diterbitkan ke Scanner Operator.')}
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 text-xs shadow"
                >
                  Mulai Cycle Count Sekarang →
                </button>
              </div>
            </div>

            {/* Quarantine & Blocked Stock Status Control */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Kontrol Status Stok (Quarantine & Blocked)</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
                  <span className="font-bold text-amber-300 block">Lot-002: Ceramide NP Pure Powder</span>
                  <p className="text-slate-400">Status Saat Ini: <span className="text-purple-300 font-bold">Quarantine QC</span></p>
                  <p className="text-[11px] text-slate-400">Alasan: Menunggu hasil uji mikroba 48 jam</p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => alert('Stok dirilis ke status AVAILABLE!')}
                      className="flex-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 py-1 font-bold text-[11px]"
                    >
                      Release to Available
                    </button>
                    <button
                      onClick={() => alert('Stok dipindahkan ke REJECTED / SCRAP!')}
                      className="flex-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40 py-1 font-bold text-[11px]"
                    >
                      Reject & Scrap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: AI WAREHOUSE ASSISTANT */}
      {activeSubTab === 'ai_assistant' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">AI Autonomous Warehouse Assistant (Gemini 3.6 Flash)</h2>
                <p className="text-xs text-slate-300">Rekomendasi Tata Letak Gudang, Analisis Slow-Moving, & Prediksi Kapasitas Bin</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                <span>Optimasi Rute Picking & Layout Gudang</span>
              </div>
              <p className="text-xs text-slate-300">
                AI mendeteksi Niacinamide & Glycerin memiliki frekuensi picking tertinggi (34 kali/minggu).
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-xs text-amber-300 font-mono">
                💡 Rekomendasi AI: Pindahkan Niacinamide dari Rack R-04 ke Rack R-01 (dekat pintu dispensing) untuk menghemat 140 meter jalan operator per shift.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Deteksi Dead Stock & Risiko Expired FEFO</span>
              </div>
              <p className="text-xs text-slate-300">
                2 Lot Bahan Baku Tidak Ada Pergerakan selama &gt; 90 Hari.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-xs text-rose-300 font-mono">
                ⚠️ Warning AI: Lot-EXT-004 (Peptide Complex) senilai Rp 45.000.000 akan expired dalam 42 hari. Segera alokasikan ke batch R&D atau tawarkan ke tim Maklon.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: BARCODE LABELS & AUDIT TRAIL */}
      {activeSubTab === 'audit_barcodes' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Printer className="h-4 w-4 text-slate-300" />
                <h2 className="text-sm font-bold text-white">Generator & Cetak Barcode / QR Label Standard CPKB</h2>
              </div>
              <button
                onClick={() => alert('Mencetak seluruh label barcode terpilh ke Thermal Printer Zebra...')}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-3 py-1.5 text-xs font-bold flex items-center gap-1"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Batch Barcode Label</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Label Lokasi Bin</span>
                <div className="bg-white p-3 rounded-lg inline-block shadow">
                  <QrCode className="h-16 w-16 text-slate-950 mx-auto" />
                  <span className="text-[10px] font-mono font-black text-slate-950 block pt-1">LOC-W1-ZA-R04-B18</span>
                </div>
                <p className="text-[10px] text-slate-400">Format QR Code 2D High-Density</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Label Lot Bahan Baku</span>
                <div className="bg-white p-3 rounded-lg inline-block shadow">
                  <div className="h-10 w-36 bg-slate-950 mx-auto flex items-center justify-center font-mono text-[9px] text-white font-bold tracking-tighter">
                    |||||||||||||||||||||||||||||||||||||
                  </div>
                  <span className="text-[10px] font-mono font-black text-slate-950 block pt-1">LOT-NCP-2026-08</span>
                </div>
                <p className="text-[10px] text-slate-400">Format Code 128 Standard</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Label Pallet Dispatch</span>
                <div className="bg-white p-3 rounded-lg inline-block shadow">
                  <QrCode className="h-16 w-16 text-slate-950 mx-auto" />
                  <span className="text-[10px] font-mono font-black text-slate-950 block pt-1">PLT-2026-0042</span>
                </div>
                <p className="text-[10px] text-slate-400">Format GS1 Pallet Label</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BARCODE / QR SCANNER SIMULATION */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-400/50 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Scan className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Laser & Camera Barcode Scanner</h3>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Camera Viewfinder Mock */}
            <div className="relative h-56 rounded-xl bg-slate-950 border-2 border-dashed border-amber-400/60 flex flex-col items-center justify-center space-y-3 overflow-hidden">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 animate-pulse shadow-lg shadow-rose-500" />
              <QrCode className="h-16 w-16 text-slate-700 animate-bounce" />
              <p className="text-xs text-slate-400 font-mono">Arahkan Barcode / QR Code ke Kotak Kamera...</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Simulasi Preset Scan QR:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => handleSimulateScan('LOC-W1-ZA-R04-S02-B18')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-left border border-slate-700"
                >
                  📍 Scan Bin R-04/B-18
                </button>
                <button
                  onClick={() => handleSimulateScan('LOT-NCP-2026-08')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-left border border-slate-700"
                >
                  📦 Scan Lot Niacinamide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW RECEIVING GOODS ENTRY */}
      {showNewReceivingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Input Barang Masuk (Goods Receipt Note)</h3>
              </div>
              <button
                onClick={() => setShowNewReceivingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Pilih Ref PO Purchase Order:</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono">
                  <option>PO-2026-0910 — Mibelle Biochemistry (Apple Stemcell 25kg)</option>
                  <option>PO-2026-0911 — Seppic France (Emulsifier Montanov 68 200kg)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Kuantitas Diterima (Kg):</label>
                  <input
                    type="number"
                    defaultValue={25}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Batch Supplier:</label>
                  <input
                    type="text"
                    defaultValue="SUP-MIB-9901"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-[11px] space-y-1">
                <span className="font-bold text-indigo-300 block">🤖 Lokasi Put-Away Ditentukan Oleh AI:</span>
                <p className="font-mono text-white">WH-COLD-02 / Cold Zone C1 / Rack R-02 / Bin B-05</p>
                <p className="text-slate-400">Bahan sensitif dingin (2-8°C) dialokasikan otomatis ke Cold Room.</p>
              </div>

              <button
                onClick={handleCreateReceiving}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-black text-slate-950 hover:brightness-110 shadow"
              >
                Simpan & Recheck QC Hold →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
