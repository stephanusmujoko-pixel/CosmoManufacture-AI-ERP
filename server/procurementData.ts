// Purchasing & Procurement Management Enterprise Data Layer
// Integrated with Master Data (Suppliers, Raw Materials, Warehouses)

export interface PurchaseRequisitionItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantityRequested: number;
  unit: string;
  estimatedUnitPriceRp: number;
  subtotalRp: number;
  reason: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  department: 'R&D Formulation' | 'Production Cleanroom' | 'Quality Control' | 'Warehouse & Logistics' | 'General Operations';
  requesterName: string;
  requiredDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Normal';
  costCenter: 'CC-RD-LAB' | 'CC-PROD-CPKB' | 'CC-QC-INSPECT' | 'CC-WH-RAW';
  projectName?: string;
  items: PurchaseRequisitionItem[];
  totalBudgetRp: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'RFQ Issued' | 'PO Issued' | 'Rejected';
  approvalLevel: string;
  createdDate: string;
}

export interface RfqSupplierQuote {
  supplierCode: string;
  supplierName: string;
  pricePerUnitRp: number;
  leadTimeDays: number;
  moqUnits: number;
  paymentTermDays: number;
  qualityRatingScore: number;
  deliveryPerformancePct: number;
  status: 'Submitted' | 'Selected' | 'Rejected';
}

export interface RequestForQuotation {
  id: string;
  rfqNumber: string;
  prNumber: string;
  itemCode: string;
  itemName: string;
  quantityNeeded: number;
  deadlineDate: string;
  supplierQuotes: RfqSupplierQuote[];
  status: 'Open' | 'Evaluating' | 'Supplier Selected' | 'Closed';
  createdDate: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  casNumber?: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPriceRp: number;
  discountPct: number;
  subtotalRp: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqNumber?: string;
  prNumber?: string;
  supplierCode: string;
  supplierName: string;
  warehouseCode: string;
  paymentTermDays: number;
  shippingMethod: 'Express Freight' | 'Land Cold Trucking' | 'Sea Cargo FCL' | 'Supplier Delivery';
  incoterms: 'DDP' | 'FOB' | 'CIF' | 'EXW';
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  subtotalRp: number;
  taxPpnRp: number; // 11%
  grandTotalRp: number;
  status: 'Draft' | 'Approved' | 'Sent to Supplier' | 'Partially Received' | 'Fully Received' | 'Closed' | 'Cancelled';
  approvalHistory: {
    role: string;
    approverName: string;
    status: 'Approved' | 'Pending';
    date: string;
  }[];
  createdDate: string;
}

export interface GoodsReceiptItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantityReceived: number;
  batchNumber: string;
  lotNumber: string;
  manufactureDate: string;
  expiryDate: string;
  qcStatus: 'QC Hold' | 'QC Pass / Released' | 'QC Rejected';
  storageBin: string;
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  deliveryNoteNumber: string;
  receivedDate: string;
  receivedBy: string;
  warehouseCode: string;
  items: GoodsReceiptItem[];
  overallQcStatus: 'Passed' | 'QC Hold Inspection' | 'Rejected';
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierInvoiceRef: string;
  poNumber: string;
  grnNumber: string;
  supplierName: string;
  dueDate: string;
  poAmountRp: number;
  grnAmountRp: number;
  invoiceAmountRp: number;
  threeWayMatchStatus: 'Matched' | 'Price Discrepancy' | 'Quantity Mismatch' | 'Pending Review';
  paymentStatus: 'Unpaid' | 'Scheduled' | 'Paid';
  createdDate: string;
}

export interface VendorPerformanceScore {
  supplierCode: string;
  supplierName: string;
  onTimeDeliveryPct: number;
  qualityScorePct: number;
  rejectRatePct: number;
  responseScorePct: number;
  overallVendorScore: number; // 0 - 100
  tierCategory: 'Class A (Preferred Partner)' | 'Class B (Approved Vendor)' | 'Class C (Under Warning)';
}

// Seed Mock Data
export const dbPurchaseRequisitions: PurchaseRequisition[] = [
  {
    id: 'pr-001',
    prNumber: 'PR/PROC/2026/08/0019',
    department: 'R&D Formulation',
    requesterName: 'Dr. Clara S. (Lead Cosmetic Chemist)',
    requiredDate: '2026-08-18',
    priority: 'High',
    costCenter: 'CC-RD-LAB',
    projectName: 'Formulasi Niacinamide 10% Brightening Serum',
    items: [
      {
        id: 'prit-01',
        itemCode: 'RM-ACT-001',
        itemName: 'Niacinamide 99% USP Cosmetic Grade',
        category: 'Active Ingredient',
        quantityRequested: 500,
        unit: 'Kg',
        estimatedUnitPriceRp: 180000,
        subtotalRp: 90000000,
        reason: 'Restock bahan baku aktif stok menipis mendekati reorder point 200kg.',
      },
      {
        id: 'prit-02',
        itemCode: 'RM-ACT-003',
        itemName: 'Hyaluronic Acid Multi-Molecular Powder',
        category: 'Active Ingredient',
        quantityRequested: 50,
        unit: 'Kg',
        estimatedUnitPriceRp: 1200000,
        subtotalRp: 60000000,
        reason: 'Permintaan batch produksi baru 20.000 unit serum maklon.',
      },
    ],
    totalBudgetRp: 150000000,
    status: 'Approved',
    approvalLevel: 'VP Supply Chain Approved',
    createdDate: '2026-08-01',
  },
  {
    id: 'pr-002',
    prNumber: 'PR/PROC/2026/08/0020',
    department: 'Production Cleanroom',
    requesterName: 'Ahmad Subagyo (Production Supervisor)',
    requiredDate: '2026-08-22',
    priority: 'Normal',
    costCenter: 'CC-PROD-CPKB',
    items: [
      {
        id: 'prit-03',
        itemCode: 'PKG-BOT-01',
        itemName: 'Botol Pipet Kaca Amber 30ml Custom Gold Dropper',
        category: 'Primary Packaging',
        quantityRequested: 25000,
        unit: 'Pcs',
        estimatedUnitPriceRp: 4500,
        subtotalRp: 112500000,
        reason: 'Persiapan kemasan botol primer untuk SO/CPKB/2026/08/0088.',
      },
    ],
    totalBudgetRp: 112500000,
    status: 'RFQ Issued',
    approvalLevel: 'Plant Manager Approved',
    createdDate: '2026-08-03',
  },
];

export const dbRfqs: RequestForQuotation[] = [
  {
    id: 'rfq-001',
    rfqNumber: 'RFQ/PROC/2026/08/0088',
    prNumber: 'PR/PROC/2026/08/0019',
    itemCode: 'RM-ACT-001',
    itemName: 'Niacinamide 99% USP Cosmetic Grade',
    quantityNeeded: 500,
    deadlineDate: '2026-08-12',
    supplierQuotes: [
      {
        supplierCode: 'SUP-ID-001',
        supplierName: 'PT Chemical Nusantara Fine Ingredients',
        pricePerUnitRp: 175000,
        leadTimeDays: 7,
        moqUnits: 100,
        paymentTermDays: 30,
        qualityRatingScore: 98,
        deliveryPerformancePct: 96,
        status: 'Selected',
      },
      {
        supplierCode: 'SUP-SG-002',
        supplierName: 'PureBio Ingredients Asia Pte Ltd',
        pricePerUnitRp: 182000,
        leadTimeDays: 14,
        moqUnits: 250,
        paymentTermDays: 45,
        qualityRatingScore: 95,
        deliveryPerformancePct: 92,
        status: 'Submitted',
      },
    ],
    status: 'Supplier Selected',
    createdDate: '2026-08-02',
  },
];

export const dbPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO/CPKB/2026/08/0045',
    rfqNumber: 'RFQ/PROC/2026/08/0088',
    prNumber: 'PR/PROC/2026/08/0019',
    supplierCode: 'SUP-ID-001',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    warehouseCode: 'WH-RM-01',
    paymentTermDays: 30,
    shippingMethod: 'Land Cold Trucking',
    incoterms: 'DDP',
    expectedDeliveryDate: '2026-08-14',
    items: [
      {
        id: 'poit-01',
        itemCode: 'RM-ACT-001',
        itemName: 'Niacinamide 99% USP Cosmetic Grade',
        casNumber: '98-92-0',
        quantityOrdered: 500,
        quantityReceived: 500,
        unitPriceRp: 175000,
        discountPct: 2.0,
        subtotalRp: 85750000,
      },
    ],
    subtotalRp: 85750000,
    taxPpnRp: 9432500,
    grandTotalRp: 95182500,
    status: 'Fully Received',
    approvalHistory: [
      { role: 'Procurement Manager', approverName: 'Hendra Setiawan', status: 'Approved', date: '2026-08-03' },
      { role: 'Finance Director', approverName: 'Budi Rahardjo', status: 'Approved', date: '2026-08-03' },
    ],
    createdDate: '2026-08-03',
  },
];

export const dbGoodsReceipts: GoodsReceipt[] = [
  {
    id: 'grn-001',
    grnNumber: 'GRN/WH/2026/08/0102',
    poNumber: 'PO/CPKB/2026/08/0045',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    deliveryNoteNumber: 'SJ-CNFI-882910',
    receivedDate: '2026-08-06 10:15',
    receivedBy: 'Budi Santoso (Warehouse Supervisor)',
    warehouseCode: 'WH-RM-01 (Raw Material Quarantine Zone)',
    items: [
      {
        id: 'grnit-01',
        itemCode: 'RM-ACT-001',
        itemName: 'Niacinamide 99% USP Cosmetic Grade',
        quantityReceived: 500,
        batchNumber: 'BN-20260805-NIA',
        lotNumber: 'LOT-CNFI-991',
        manufactureDate: '2026-06-01',
        expiryDate: '2028-06-01',
        qcStatus: 'QC Pass / Released',
        storageBin: 'BIN-RACK-A2-04',
      },
    ],
    overallQcStatus: 'Passed',
  },
];

export const dbSupplierInvoices: SupplierInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV/SUPP/2026/08/0033',
    supplierInvoiceRef: 'INV-CNFI-2026-8812',
    poNumber: 'PO/CPKB/2026/08/0045',
    grnNumber: 'GRN/WH/2026/08/0102',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    dueDate: '2026-09-05',
    poAmountRp: 95182500,
    grnAmountRp: 95182500,
    invoiceAmountRp: 95182500,
    threeWayMatchStatus: 'Matched',
    paymentStatus: 'Scheduled',
    createdDate: '2026-08-06',
  },
];

export const dbVendorPerformance: VendorPerformanceScore[] = [
  {
    supplierCode: 'SUP-ID-001',
    supplierName: 'PT Chemical Nusantara Fine Ingredients',
    onTimeDeliveryPct: 98.5,
    qualityScorePct: 99.0,
    rejectRatePct: 0.2,
    responseScorePct: 95.0,
    overallVendorScore: 98.2,
    tierCategory: 'Class A (Preferred Partner)',
  },
  {
    supplierCode: 'SUP-SG-002',
    supplierName: 'PureBio Ingredients Asia Pte Ltd',
    onTimeDeliveryPct: 92.0,
    qualityScorePct: 96.5,
    rejectRatePct: 1.1,
    responseScorePct: 90.0,
    overallVendorScore: 93.4,
    tierCategory: 'Class B (Approved Vendor)',
  },
];
