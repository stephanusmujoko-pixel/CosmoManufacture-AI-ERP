export interface WarehouseMasterData {
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

export interface BinLocationData {
  id: string;
  warehouseId: string;
  zone: string;
  area: string;
  rack: string;
  shelf: string;
  binCode: string;
  barcode: string;
  qrCode: string;
  status: 'available' | 'occupied' | 'qc_hold' | 'quarantine' | 'maintenance';
  currentBatch?: string;
  currentMaterial?: string;
  qtyKg?: number;
  expDate?: string;
  storageCondition: string;
  maxWeightKg: number;
}

export interface GoodsReceiptData {
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
  receivedBy: string;
}

export interface PickingOrderData {
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

export interface StockMovementData {
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

export interface StockOpnameItem {
  id: string;
  opnameNumber: string;
  binLocation: string;
  materialName: string;
  batchLot: string;
  systemQtyKg: number;
  physicalQtyKg: number;
  discrepancyKg: number;
  discrepancyValueIdr: number;
  status: 'matched' | 'discrepancy' | 'adjusted';
  countedBy: string;
  countDate: string;
}

// Initial Mock Data
export const dbWarehouses: WarehouseMasterData[] = [
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
    name: 'Gudang Cold Room Active Ingredients (2-8°C)',
    factory: 'Pabrik Cikarang Plant A',
    address: 'Cleanroom Area B, Jababeka V',
    manager: 'Siti Rahmawati, S.Farm',
    temperatureType: 'Cold Room (2-8°C)',
    humidityControl: '45% RH ± 3%',
    totalCapacityBins: 450,
    usedBins: 380,
    status: 'active',
  },
  {
    id: 'WH-03',
    code: 'WH-PKG-03',
    name: 'Gudang Kemasan & Packaging Materials',
    factory: 'Pabrik Cikarang Plant B',
    address: 'Gedung Kemasan Jababeka V',
    manager: 'Hendrik Wijaya',
    temperatureType: 'Room Temp (20-25°C)',
    humidityControl: '60% RH',
    totalCapacityBins: 2000,
    usedBins: 1450,
    status: 'active',
  },
  {
    id: 'WH-04',
    code: 'WH-QUAR-04',
    name: 'Gudang Karantina & QC Isolation Area',
    factory: 'Pabrik Cikarang Plant A',
    address: 'Area Receiving Docks A1',
    manager: 'Dewi Kartika (QC Specialist)',
    temperatureType: 'Controlled Cleanroom',
    humidityControl: '50% RH',
    totalCapacityBins: 300,
    usedBins: 120,
    status: 'active',
  },
];

export const dbBinLocations: BinLocationData[] = [
  {
    id: 'BIN-001',
    warehouseId: 'WH-01',
    zone: 'Zone A - Raw Active',
    area: 'Area A1',
    rack: 'Rack R-01',
    shelf: 'Shelf S-01',
    binCode: 'WH01-ZA-R01-S01-B01',
    barcode: 'BC-WH01-ZA-R01-S01-B01',
    qrCode: 'QR-WH01-ZA-R01-S01-B01',
    status: 'occupied',
    currentBatch: 'LOT-NIA-202506-01',
    currentMaterial: 'Niacinamide USP Grade 99.5%',
    qtyKg: 250,
    expDate: '2027-06-15',
    storageCondition: 'Room Temp (20-25°C)',
    maxWeightKg: 1000,
  },
  {
    id: 'BIN-002',
    warehouseId: 'WH-02',
    zone: 'Zone B - Cold Storage Active',
    area: 'Cold Room A',
    rack: 'Rack CR-02',
    shelf: 'Shelf S-02',
    binCode: 'WH02-ZB-CR02-S02-B04',
    barcode: 'BC-WH02-ZB-CR02-S02-B04',
    qrCode: 'QR-WH02-ZB-CR02-S02-B04',
    status: 'occupied',
    currentBatch: 'LOT-SQU-202508-03',
    currentMaterial: 'Squalane 99% Olive Derived',
    qtyKg: 120,
    expDate: '2026-09-10',
    storageCondition: 'Cold Room (2-8°C)',
    maxWeightKg: 500,
  },
  {
    id: 'BIN-003',
    warehouseId: 'WH-01',
    zone: 'Zone A - Raw Active',
    area: 'Area A2',
    rack: 'Rack R-02',
    shelf: 'Shelf S-03',
    binCode: 'WH01-ZA-R02-S03-B02',
    barcode: 'BC-WH01-ZA-R02-S03-B02',
    qrCode: 'QR-WH01-ZA-R02-S03-B02',
    status: 'available',
    storageCondition: 'Room Temp (20-25°C)',
    maxWeightKg: 1000,
  },
  {
    id: 'BIN-004',
    warehouseId: 'WH-04',
    zone: 'Zone D - Quarantine',
    area: 'Area Q1',
    rack: 'Rack Q-01',
    shelf: 'Shelf S-01',
    binCode: 'WH04-ZD-Q01-S01-B01',
    barcode: 'BC-WH04-ZD-Q01-S01-B01',
    qrCode: 'QR-WH04-ZD-Q01-S01-B01',
    status: 'quarantine',
    currentBatch: 'LOT-CEN-202509-02',
    currentMaterial: 'Centella Asiatica Extract Powder 98%',
    qtyKg: 80,
    expDate: '2027-09-30',
    storageCondition: 'Controlled Cleanroom',
    maxWeightKg: 500,
  },
];

export const dbGoodsReceipts: GoodsReceiptData[] = [
  {
    id: 'GRN-001',
    grnNumber: 'GRN-20260808-001',
    poReference: 'PO-2026-07-089',
    supplierName: 'DSM Nutritional Products Ltd (Switzerland)',
    materialName: 'Niacinamide USP Grade 99.5%',
    inciName: 'Niacinamide',
    receivedQtyKg: 500,
    batchSupplier: 'DSM-NIA-88210',
    internalLotNumber: 'LOT-NIA-202506-01',
    mfdDate: '2025-06-01',
    expDate: '2027-06-01',
    inspectionStatus: 'qc_passed',
    suggestedLocation: 'WH01-ZA-R01-S01-B01',
    assignedLocation: 'WH01-ZA-R01-S01-B01',
    storageCondition: 'Room Temp (20-25°C)',
    receivedDate: '2026-08-08 09:30',
    receivedBy: 'Budi Santoso',
  },
  {
    id: 'GRN-002',
    grnNumber: 'GRN-20260808-002',
    poReference: 'PO-2026-07-092',
    supplierName: 'Nikko Chemicals Co., Ltd (Japan)',
    materialName: 'Squalane 99% Olive Derived',
    inciName: 'Squalane',
    receivedQtyKg: 200,
    batchSupplier: 'NIKKO-SQ-4412',
    internalLotNumber: 'LOT-SQU-202508-03',
    mfdDate: '2025-08-01',
    expDate: '2026-09-10',
    inspectionStatus: 'qc_passed',
    suggestedLocation: 'WH02-ZB-CR02-S02-B04',
    assignedLocation: 'WH02-ZB-CR02-S02-B04',
    storageCondition: 'Cold Room (2-8°C)',
    receivedDate: '2026-08-08 11:15',
    receivedBy: 'Siti Rahmawati',
  },
  {
    id: 'GRN-003',
    grnNumber: 'GRN-20260808-003',
    poReference: 'PO-2026-07-095',
    supplierName: 'Greaf Biotech Industry Co.',
    materialName: 'Centella Asiatica Extract Powder 98%',
    inciName: 'Centella Asiatica Extract',
    receivedQtyKg: 100,
    batchSupplier: 'GRF-CEN-9912',
    internalLotNumber: 'LOT-CEN-202509-02',
    mfdDate: '2025-09-15',
    expDate: '2027-09-15',
    inspectionStatus: 'quarantine',
    suggestedLocation: 'WH04-ZD-Q01-S01-B01',
    assignedLocation: 'WH04-ZD-Q01-S01-B01',
    storageCondition: 'Controlled Cleanroom',
    receivedDate: '2026-08-08 14:00',
    receivedBy: 'Dewi Kartika',
  },
];

export const dbPickingOrders: PickingOrderData[] = [
  {
    id: 'PICK-001',
    pickOrderNumber: 'WAVE-20260808-01',
    referenceType: 'work_order',
    referenceNumber: 'MO-20260810-001',
    targetCustomerOrBatch: 'Batch Serum CosmoGlow (1,000L Bulk)',
    materialName: 'Niacinamide USP Grade 99.5%',
    requiredQtyKg: 50,
    allocatedBatch: 'LOT-NIA-202506-01',
    sourceLocation: 'WH01-ZA-R01-S01-B01',
    pickingStrategy: 'FEFO',
    status: 'picking_in_progress',
    expiryDate: '2027-06-01',
  },
  {
    id: 'PICK-002',
    pickOrderNumber: 'WAVE-20260808-02',
    referenceType: 'sales_order',
    referenceNumber: 'SO-2026-08-004',
    targetCustomerOrBatch: 'PT Watson Indonesia Logistics Hub',
    materialName: 'CosmoGlow Serum 30ml (Finished Goods)',
    requiredQtyKg: 1200,
    allocatedBatch: 'LOT-FG-SRM-202608-01',
    sourceLocation: 'WH03-FG-A01-S02-B01',
    pickingStrategy: 'FEFO',
    status: 'pending',
    expiryDate: '2028-08-01',
  },
];

export const dbStockMovements: StockMovementData[] = [
  {
    id: 'TRF-001',
    transferNumber: 'TRF-20260808-01',
    movementType: 'bin_to_bin',
    materialName: 'Squalane 99% Olive Derived',
    batchLot: 'LOT-SQU-202508-03',
    qtyKg: 50,
    sourceLocation: 'WH02-ZB-CR02-S02-B04',
    targetLocation: 'CLEANROOM-DISPENSING-A',
    requestedBy: 'Andi PPIC Compounding',
    status: 'completed',
    timestamp: '2026-08-08 10:00',
  },
  {
    id: 'TRF-002',
    transferNumber: 'TRF-20260808-02',
    movementType: 'quarantine_release',
    materialName: 'Centella Asiatica Extract Powder 98%',
    batchLot: 'LOT-CEN-202509-02',
    qtyKg: 80,
    sourceLocation: 'WH04-ZD-Q01-S01-B01 (Quarantine)',
    targetLocation: 'WH01-ZA-R01-S02-B03 (Main RM)',
    requestedBy: 'Dewi QC Lead',
    status: 'pending',
    timestamp: '2026-08-08 14:30',
  },
];

export const dbStockOpname: StockOpnameItem[] = [
  {
    id: 'SO-001',
    opnameNumber: 'SO-2026-Q3-01',
    binLocation: 'WH01-ZA-R01-S01-B01',
    materialName: 'Niacinamide USP Grade 99.5%',
    batchLot: 'LOT-NIA-202506-01',
    systemQtyKg: 250,
    physicalQtyKg: 250,
    discrepancyKg: 0,
    discrepancyValueIdr: 0,
    status: 'matched',
    countedBy: 'Rian Stock Auditor',
    countDate: '2026-08-07',
  },
  {
    id: 'SO-002',
    opnameNumber: 'SO-2026-Q3-02',
    binLocation: 'WH02-ZB-CR02-S02-B04',
    materialName: 'Squalane 99% Olive Derived',
    batchLot: 'LOT-SQU-202508-03',
    systemQtyKg: 125,
    physicalQtyKg: 120,
    discrepancyKg: -5,
    discrepancyValueIdr: -2250000,
    status: 'discrepancy',
    countedBy: 'Rian Stock Auditor',
    countDate: '2026-08-07',
  },
];
