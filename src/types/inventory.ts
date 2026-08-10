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
  warehouseBin?: string;
  storageTemp?: 'Cold Room (2-8°C)' | 'Cool Room (15-25°C)' | 'Ambient Room (25-30°C)';
  halalCertNo?: string;
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
  isFefoLocked?: boolean;
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
  notes?: string;
}

export interface WarehouseBinLocation {
  id: string;
  binCode: string;
  zoneName: string;
  warehouseType: 'Bahan Baku' | 'Cold Room 15°C' | 'Bahan Kemas' | 'Barang Jadi FG' | 'Quarantine Zone' | 'MES Line Side';
  capacityKg: number;
  occupiedKg: number;
  temperatureTarget: string;
  currentTempSensor: string;
  status: 'Normal' | 'Near Capacity' | 'Full' | 'Temp Alert';
  itemCount: number;
}

export interface StockOpnameItem {
  id: string;
  sku: string;
  itemName: string;
  category: string;
  uom: string;
  systemQty: number;
  physicalQty: number;
  varianceQty: number;
  unitCostIDR: number;
  varianceValueIDR: number;
  varianceCause: 'Susut Saluran/Moisture' | 'Spillage/Bocor' | 'Sampling QC' | 'Salah Catat System' | 'Belum Disesuaikan' | 'Scrap Expired';
  auditStatus: 'Pending Verification' | 'Verified Match' | 'Variance Approved' | 'Rejected';
  countedBy: string;
  countedAt: string;
}
