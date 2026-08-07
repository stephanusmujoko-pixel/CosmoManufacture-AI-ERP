export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'COGS' | 'Expense' | 'Other Income' | 'Other Expense';
  subCategory: string;
  balanceType: 'Debit' | 'Credit';
  balanceIdr: number;
  costCenterCode?: string;
  isActive: boolean;
  isHeader: boolean;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debitIdr: number;
  creditIdr: number;
  memo: string;
  costCenterCode?: string;
}

export interface JournalEntry {
  id: string;
  voucherNumber: string;
  date: string;
  period: string; // e.g. "2026-08"
  sourceModule: 'Manual' | 'Purchasing' | 'Sales' | 'Inventory' | 'MES Production' | 'Maintenance' | 'Payroll';
  sourceReference: string; // PO-2026-001, INV-2026-0801, BATCH-2026-0801, WO-2026-089
  description: string;
  totalDebitIdr: number;
  totalCreditIdr: number;
  status: 'Draft' | 'Posted' | 'Reversed';
  postedBy: string;
  postedAt: string;
  lines: JournalLine[];
}

export interface AccountsPayableInvoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmountIdr: number;
  paidAmountIdr: number;
  remainingAmountIdr: number;
  taxPpnIdr: number;
  status: 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';
  agingCategory: '0-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';
}

export interface AccountsReceivableInvoice {
  id: string;
  invoiceNumber: string;
  soNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmountIdr: number;
  receivedAmountIdr: number;
  remainingAmountIdr: number;
  taxPpnIdr: number;
  status: 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';
  agingCategory: '0-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountHolder: string;
  currency: 'IDR' | 'USD';
  glAccountCode: string;
  bookBalanceIdr: number;
  bankStatementBalanceIdr: number;
  unreconciledAmountIdr: number;
  lastReconciledAt: string;
  status: 'Active' | 'Locked';
}

export interface PettyCashTransaction {
  id: string;
  txNumber: string;
  date: string;
  category: 'Cleanroom Supplies' | 'Lab Reagent' | 'Courier' | 'Snacks & Office' | 'Emergency Repair';
  description: string;
  amountIdr: number;
  receiptUrl?: string;
  requestedBy: string;
  approvedBy: string;
  status: 'Approved' | 'Pending';
}

export interface CostCenterBudget {
  id: string;
  costCenterCode: string;
  costCenterName: string;
  department: 'Factory Production' | 'R&D Formula Lab' | 'Quality Control' | 'Maintenance' | 'Sales & Marketing' | 'Administration';
  annualBudget2026Idr: number;
  ytdActualExpenseIdr: number;
  varianceIdr: number;
  utilizationPercentage: number;
  status: 'Within Budget' | 'Warning' | 'Exceeded';
}

export interface ProductCostingItem {
  id: string;
  productCode: string;
  productName: string;
  batchSizeKg: number;
  standardCogmPerKgIdr: number;
  actualCogmPerKgIdr: number;
  variancePerKgIdr: number;
  rawMaterialCostIdr: number;
  packagingCostIdr: number;
  directLaborCostIdr: number;
  machineCostIdr: number;
  utilityCostIdr: number;
  overheadCostIdr: number;
  wasteYieldLossIdr: number;
  marginPercentage: number;
}

export interface CostVarianceDetail {
  id: string;
  batchCode: string;
  productName: string;
  materialPriceVarianceIdr: number;
  materialUsageVarianceIdr: number;
  laborVarianceIdr: number;
  machineEfficiencyVarianceIdr: number;
  yieldVarianceIdr: number;
  totalVarianceIdr: number;
  explanation: string;
}

export interface FixedAssetItem {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'Production Machine' | 'Lab Instrument' | 'Cleanroom HVAC' | 'Vehicle' | 'IT Equipment';
  acquisitionDate: string;
  acquisitionCostIdr: number;
  usefulLifeYears: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance' | 'Units of Production';
  accumulatedDepreciationIdr: number;
  bookValueIdr: number;
  monthlyDepreciationIdr: number;
  location: string;
  maintenanceAssetCode?: string;
}

export interface TaxTransaction {
  id: string;
  taxInvoiceNumber: string; // e-Faktur 010.000-26.00000123
  type: 'PPN Masukan (Input)' | 'PPN Keluaran (Output)' | 'PPh 23' | 'PPh 21' | 'PPh 4(2)';
  partnerName: string;
  taxableBaseAmountIdr: number;
  taxAmountIdr: number;
  date: string;
  status: 'Validated e-Faktur' | 'Pending Approval' | 'Settled';
}

export interface PeriodClosingStatus {
  period: string; // e.g. "2026-07"
  status: 'Open' | 'Soft Closed' | 'Hard Locked';
  closedAt?: string;
  closedBy?: string;
  checklist: {
    bankReconciliation: boolean;
    apArAgingVerified: boolean;
    inventoryValuationRun: boolean;
    depreciationPosted: boolean;
    taxReconciliation: boolean;
    trialBalanceBalanced: boolean;
  };
}

// Initial Mock Data
export const initialCoa: ChartOfAccount[] = [
  // ASSETS
  { id: '1', code: '1110-01', name: 'Kas Kecil Operational Cleanroom', category: 'Asset', subCategory: 'Cash & Cash Equivalents', balanceType: 'Debit', balanceIdr: 25000000, isActive: true, isHeader: false },
  { id: '2', code: '1120-01', name: 'Bank BCA Operasional (IDR)', category: 'Asset', subCategory: 'Cash & Cash Equivalents', balanceType: 'Debit', balanceIdr: 3850000000, isActive: true, isHeader: false },
  { id: '3', code: '1120-02', name: 'Bank Mandiri USD Account', category: 'Asset', subCategory: 'Cash & Cash Equivalents', balanceType: 'Debit', balanceIdr: 1250000000, isActive: true, isHeader: false },
  { id: '4', code: '1130-01', name: 'Piutang Usaha Maklon & OEM (AR)', category: 'Asset', subCategory: 'Receivables', balanceType: 'Debit', balanceIdr: 2480000000, isActive: true, isHeader: false },
  { id: '5', code: '1140-01', name: 'Persediaan Bahan Baku Active Ingredients', category: 'Asset', subCategory: 'Inventory', balanceType: 'Debit', balanceIdr: 4120000000, isActive: true, isHeader: false },
  { id: '6', code: '1140-02', name: 'Persediaan Kemasan Primary & Secondary', category: 'Asset', subCategory: 'Inventory', balanceType: 'Debit', balanceIdr: 1850000000, isActive: true, isHeader: false },
  { id: '7', code: '1140-03', name: 'Persediaan Barang Dalam Process (WIP Bulk)', category: 'Asset', subCategory: 'Inventory', balanceType: 'Debit', balanceIdr: 920000000, isActive: true, isHeader: false },
  { id: '8', code: '1140-04', name: 'Persediaan Finished Goods Serum & Cream', category: 'Asset', subCategory: 'Inventory', balanceType: 'Debit', balanceIdr: 3100000000, isActive: true, isHeader: false },
  { id: '9', code: '1210-01', name: 'Aset Tetap Mesin Homogenizer & Vacuum Mixer', category: 'Asset', subCategory: 'Fixed Assets', balanceType: 'Debit', balanceIdr: 8500000000, isActive: true, isHeader: false },
  { id: '10', code: '1220-01', name: 'Akumulasi Penyusutan Mesin Produksi', category: 'Asset', subCategory: 'Fixed Assets', balanceType: 'Credit', balanceIdr: 1420000000, isActive: true, isHeader: false },

  // LIABILITIES
  { id: '11', code: '2110-01', name: 'Hutang Usaha Supplier Bahan Kimia (AP)', category: 'Liability', subCategory: 'Current Liabilities', balanceType: 'Credit', balanceIdr: 1950000000, isActive: true, isHeader: false },
  { id: '12', code: '2120-01', name: 'Hutang Pajak PPN Masukan / Keluaran', category: 'Liability', subCategory: 'Tax Liabilities', balanceType: 'Credit', balanceIdr: 340000000, isActive: true, isHeader: false },
  { id: '13', code: '2130-01', name: 'Hutang Gaji & Uang Lembur Operator', category: 'Liability', subCategory: 'Current Liabilities', balanceType: 'Credit', balanceIdr: 280000000, isActive: true, isHeader: false },

  // EQUITY
  { id: '14', code: '3110-01', name: 'Modal Disetor Pemegang Saham', category: 'Equity', subCategory: 'Capital', balanceType: 'Credit', balanceIdr: 15000000000, isActive: true, isHeader: false },
  { id: '15', code: '3210-01', name: 'Laba Ditahan (Retained Earnings)', category: 'Equity', subCategory: 'Retained Earnings', balanceType: 'Credit', balanceIdr: 6100000000, isActive: true, isHeader: false },

  // REVENUE
  { id: '16', code: '4110-01', name: 'Pendapatan Maklon Skincare & Serum', category: 'Revenue', subCategory: 'Operating Revenue', balanceType: 'Credit', balanceIdr: 12400000000, isActive: true, isHeader: false },
  { id: '17', code: '4110-02', name: 'Pendapatan Maklon Sunscreen & Body Care', category: 'Revenue', subCategory: 'Operating Revenue', balanceType: 'Credit', balanceIdr: 8100000000, isActive: true, isHeader: false },

  // COGS
  { id: '18', code: '5110-01', name: 'HPP Bahan Baku Chem Active Ingredients', category: 'COGS', subCategory: 'Direct Materials', balanceType: 'Debit', balanceIdr: 6800000000, isActive: true, isHeader: false },
  { id: '19', code: '5120-01', name: 'HPP Kemasan Primary Pump & Bottle', category: 'COGS', subCategory: 'Direct Materials', balanceType: 'Debit', balanceIdr: 2400000000, isActive: true, isHeader: false },
  { id: '20', code: '5130-01', name: 'Biaya Tenaga Kerja Langsung Cleanroom', category: 'COGS', subCategory: 'Direct Labor', balanceType: 'Debit', balanceIdr: 950000000, isActive: true, isHeader: false },
  { id: '21', code: '5140-01', name: 'Biaya Listrik HVAC & Utility Produksi', category: 'COGS', subCategory: 'Factory Overhead', balanceType: 'Debit', balanceIdr: 420000000, isActive: true, isHeader: false },

  // EXPENSES
  { id: '22', code: '6110-01', name: 'Beban Gaji Manajemen & QC R&D', category: 'Expense', subCategory: 'Operating Expenses', balanceType: 'Debit', balanceIdr: 880000000, isActive: true, isHeader: false },
  { id: '23', code: '6120-01', name: 'Beban Uji Klinis Lab & Notifikasi BPOM', category: 'Expense', subCategory: 'Operating Expenses', balanceType: 'Debit', balanceIdr: 310000000, isActive: true, isHeader: false },
  { id: '24', code: '6130-01', name: 'Beban Pemeliharaan & Kalibrasi Mesin', category: 'Expense', subCategory: 'Operating Expenses', balanceType: 'Debit', balanceIdr: 210000000, isActive: true, isHeader: false },
  { id: '25', code: '6140-01', name: 'Beban Penyusutan Aset Tetap Pabrik', category: 'Expense', subCategory: 'Depreciation Expense', balanceType: 'Debit', balanceIdr: 185000000, isActive: true, isHeader: false },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'JE-2026-0801',
    voucherNumber: 'JV/2026/08/001',
    date: '2026-08-01',
    period: '2026-08',
    sourceModule: 'MES Production',
    sourceReference: 'BATCH-2026-0801',
    description: 'Pencatatan COGM Selesai Batch B-2026-0801 Luminance Glow Serum (10,000 Pcs)',
    totalDebitIdr: 145000000,
    totalCreditIdr: 145000000,
    status: 'Posted',
    postedBy: 'Agus R. (Cost Accountant)',
    postedAt: '2026-08-01 16:30',
    lines: [
      { id: 'jl-1', accountCode: '1140-04', accountName: 'Persediaan Finished Goods Serum & Cream', debitIdr: 145000000, creditIdr: 0, memo: 'Finished goods batch B-2026-0801', costCenterCode: 'CC-PROD-01' },
      { id: 'jl-2', accountCode: '1140-03', accountName: 'Persediaan Barang Dalam Process (WIP Bulk)', debitIdr: 0, creditIdr: 145000000, memo: 'Transfer out WIP to FG', costCenterCode: 'CC-PROD-01' },
    ],
  },
  {
    id: 'JE-2026-0802',
    voucherNumber: 'JV/2026/08/002',
    date: '2026-08-02',
    period: '2026-08',
    sourceModule: 'Purchasing',
    sourceReference: 'PO-2026-089',
    description: 'Penerimaan Bahan Aktif Niacinamide 99.5% Ex DSM (200 Kg) dari PT BASF Indonesia',
    totalDebitIdr: 99900000,
    totalCreditIdr: 99900000,
    status: 'Posted',
    postedBy: 'Siti Aminah (AP Staff)',
    postedAt: '2026-08-02 11:15',
    lines: [
      { id: 'jl-3', accountCode: '1140-01', accountName: 'Persediaan Bahan Baku Active Ingredients', debitIdr: 90000000, creditIdr: 0, memo: 'GRN-2026-089 Niacinamide' },
      { id: 'jl-4', accountCode: '2120-01', accountName: 'Hutang Pajak PPN Masukan / Keluaran', debitIdr: 9900000, creditIdr: 0, memo: 'PPN Masukan 11%' },
      { id: 'jl-5', accountCode: '2110-01', accountName: 'Hutang Usaha Supplier Bahan Kimia (AP)', debitIdr: 0, creditIdr: 99900000, memo: 'Hutang ke PT BASF Indonesia' },
    ],
  },
  {
    id: 'JE-2026-0803',
    voucherNumber: 'JV/2026/08/003',
    date: '2026-08-03',
    period: '2026-08',
    sourceModule: 'Sales',
    sourceReference: 'INV-2026-0801',
    description: 'Penjualan Maklon Skincare 15,000 Pcs Serum ke Brand Somethinc (PT Glow Indonesia)',
    totalDebitIdr: 333000000,
    totalCreditIdr: 333000000,
    status: 'Posted',
    postedBy: 'Budi Santoso (AR Accountant)',
    postedAt: '2026-08-03 14:00',
    lines: [
      { id: 'jl-6', accountCode: '1130-01', accountName: 'Piutang Usaha Maklon & OEM (AR)', debitIdr: 333000000, creditIdr: 0, memo: 'Piutang Somethinc' },
      { id: 'jl-7', accountCode: '4110-01', accountName: 'Pendapatan Maklon Skincare & Serum', debitIdr: 0, creditIdr: 300000000, memo: 'Sales revenue 15k pcs' },
      { id: 'jl-8', accountCode: '2120-01', accountName: 'Hutang Pajak PPN Masukan / Keluaran', debitIdr: 0, creditIdr: 33000000, memo: 'PPN Keluaran 11%' },
    ],
  },
  {
    id: 'JE-2026-0804',
    voucherNumber: 'JV/2026/08/004',
    date: '2026-08-04',
    period: '2026-08',
    sourceModule: 'Maintenance',
    sourceReference: 'WO-2026-089',
    description: 'Beban Sparepart & Servis Overhaul Homogenizer Tank MCH-MIX-01',
    totalDebitIdr: 18500000,
    totalCreditIdr: 18500000,
    status: 'Posted',
    postedBy: 'Agus R. (Cost Accountant)',
    postedAt: '2026-08-04 17:10',
    lines: [
      { id: 'jl-9', accountCode: '6130-01', accountName: 'Beban Pemeliharaan & Kalibrasi Mesin', debitIdr: 18500000, creditIdr: 0, memo: 'Mechanical Seal Homogenizer Replacement', costCenterCode: 'CC-MAINT-01' },
      { id: 'jl-10', accountCode: '1120-01', accountName: 'Bank BCA Operasional (IDR)', debitIdr: 0, creditIdr: 18500000, memo: 'Pembayaran Vendor Maint' },
    ],
  },
];

export const initialApInvoices: AccountsPayableInvoice[] = [
  {
    id: 'AP-01',
    invoiceNumber: 'INV-SUP-8821',
    poNumber: 'PO-2026-089',
    supplierName: 'PT BASF Indonesia (Active Ingredients)',
    invoiceDate: '2026-08-02',
    dueDate: '2026-09-01',
    totalAmountIdr: 99900000,
    paidAmountIdr: 0,
    remainingAmountIdr: 99900000,
    taxPpnIdr: 9900000,
    status: 'Unpaid',
    agingCategory: '0-30 Days',
  },
  {
    id: 'AP-02',
    invoiceNumber: 'INV-SUP-7712',
    poNumber: 'PO-2026-074',
    supplierName: 'PT Packaging Nusantara (Airless Pump 30ml)',
    invoiceDate: '2026-07-15',
    dueDate: '2026-08-14',
    totalAmountIdr: 245000000,
    paidAmountIdr: 100000000,
    remainingAmountIdr: 145000000,
    taxPpnIdr: 24270000,
    status: 'Partial',
    agingCategory: '0-30 Days',
  },
  {
    id: 'AP-03',
    invoiceNumber: 'INV-SUP-5510',
    poNumber: 'PO-2026-050',
    supplierName: 'PT Merck Tbk (Reagent Lab & Microbiological Media)',
    invoiceDate: '2026-06-10',
    dueDate: '2026-07-10',
    totalAmountIdr: 68000000,
    paidAmountIdr: 0,
    remainingAmountIdr: 68000000,
    taxPpnIdr: 6730000,
    status: 'Overdue',
    agingCategory: '31-60 Days',
  },
];

export const initialArInvoices: AccountsReceivableInvoice[] = [
  {
    id: 'AR-01',
    invoiceNumber: 'INV-2026-0801',
    soNumber: 'SO-2026-042',
    customerName: 'PT Glow Indonesia (Brand Somethinc)',
    invoiceDate: '2026-08-03',
    dueDate: '2026-09-02',
    totalAmountIdr: 333000000,
    receivedAmountIdr: 0,
    remainingAmountIdr: 333000000,
    taxPpnIdr: 33000000,
    status: 'Unpaid',
    agingCategory: '0-30 Days',
  },
  {
    id: 'AR-02',
    invoiceNumber: 'INV-2026-0715',
    soNumber: 'SO-2026-038',
    customerName: 'PT Paragon Brand Beauty (Emina Barrier Cream)',
    invoiceDate: '2026-07-20',
    dueDate: '2026-08-19',
    totalAmountIdr: 580000000,
    receivedAmountIdr: 300000000,
    remainingAmountIdr: 280000000,
    taxPpnIdr: 57400000,
    status: 'Partial',
    agingCategory: '0-30 Days',
  },
  {
    id: 'AR-03',
    invoiceNumber: 'INV-2026-0601',
    soNumber: 'SO-2026-020',
    customerName: 'CV Azarine Cosmetica (Sunscreen Gel)',
    invoiceDate: '2026-06-01',
    dueDate: '2026-07-01',
    totalAmountIdr: 195000000,
    receivedAmountIdr: 0,
    remainingAmountIdr: 195000000,
    taxPpnIdr: 19300000,
    status: 'Overdue',
    agingCategory: '31-60 Days',
  },
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'BA-01',
    accountNumber: '883-0912-888',
    bankName: 'Bank BCA KCP Jababeka',
    accountHolder: 'PT Paragonia Cosmetic Industri',
    currency: 'IDR',
    glAccountCode: '1120-01',
    bookBalanceIdr: 3850000000,
    bankStatementBalanceIdr: 3850000000,
    unreconciledAmountIdr: 0,
    lastReconciledAt: '2026-08-05 18:00',
    status: 'Active',
  },
  {
    id: 'BA-02',
    accountNumber: '118-00-99120-1',
    bankName: 'Bank Mandiri Cabang Cikarang',
    accountHolder: 'PT Paragonia Cosmetic Industri',
    currency: 'USD',
    glAccountCode: '1120-02',
    bookBalanceIdr: 1250000000, // equivalent IDR ($80,645 @ 15,500)
    bankStatementBalanceIdr: 1250000000,
    unreconciledAmountIdr: 0,
    lastReconciledAt: '2026-08-04 17:30',
    status: 'Active',
  },
];

export const initialPettyCash: PettyCashTransaction[] = [
  {
    id: 'PC-001',
    txNumber: 'PC/2026/08/01',
    date: '2026-08-04',
    category: 'Lab Reagent',
    description: 'Pembelian Cepat Buffer pH 4.01 & 7.00 Lab QC',
    amountIdr: 1250000,
    requestedBy: 'Dewi Rahma (QC Manager)',
    approvedBy: 'Bambang S. (Finance Manager)',
    status: 'Approved',
  },
  {
    id: 'PC-002',
    txNumber: 'PC/2026/08/02',
    date: '2026-08-05',
    category: 'Cleanroom Supplies',
    description: 'Sarung Tangan Nitrile Steril Size M (5 Box)',
    amountIdr: 850000,
    requestedBy: 'Rian H. (MES Supervisor)',
    approvedBy: 'Bambang S. (Finance Manager)',
    status: 'Approved',
  },
];

export const initialCostCenterBudgets: CostCenterBudget[] = [
  {
    id: 'CC-01',
    costCenterCode: 'CC-PROD-01',
    costCenterName: 'Pabrik Cleanroom Line 1 (Serum)',
    department: 'Factory Production',
    annualBudget2026Idr: 12000000000,
    ytdActualExpenseIdr: 7150000000,
    varianceIdr: 4850000000,
    utilizationPercentage: 59.5,
    status: 'Within Budget',
  },
  {
    id: 'CC-02',
    costCenterCode: 'CC-RD-01',
    costCenterName: 'R&D Formulation & Stability Lab',
    department: 'R&D Formula Lab',
    annualBudget2026Idr: 1800000000,
    ytdActualExpenseIdr: 1220000000,
    varianceIdr: 580000000,
    utilizationPercentage: 67.8,
    status: 'Within Budget',
  },
  {
    id: 'CC-03',
    costCenterCode: 'CC-QC-01',
    costCenterName: 'Quality Control & Micro Lab',
    department: 'Quality Control',
    annualBudget2026Idr: 950000000,
    ytdActualExpenseIdr: 720000000,
    varianceIdr: 230000000,
    utilizationPercentage: 75.8,
    status: 'Warning',
  },
  {
    id: 'CC-04',
    costCenterCode: 'CC-MAINT-01',
    costCenterName: 'Maintenance & Utility Engineering',
    department: 'Maintenance',
    annualBudget2026Idr: 1100000000,
    ytdActualExpenseIdr: 680000000,
    varianceIdr: 420000000,
    utilizationPercentage: 61.8,
    status: 'Within Budget',
  },
];

export const initialProductCosting: ProductCostingItem[] = [
  {
    id: 'PCST-01',
    productCode: 'FG-SRM-001',
    productName: 'Luminance Glow Serum 10% Niacinamide (30ml)',
    batchSizeKg: 1000, // 1 Ton batch = 33,300 bottles
    standardCogmPerKgIdr: 145000,
    actualCogmPerKgIdr: 142800,
    variancePerKgIdr: -2200, // Favorable -2.2k
    rawMaterialCostIdr: 95000,
    packagingCostIdr: 32000,
    directLaborCostIdr: 8500,
    machineCostIdr: 4300,
    utilityCostIdr: 1800,
    overheadCostIdr: 1200,
    wasteYieldLossIdr: 1500,
    marginPercentage: 62.5,
  },
  {
    id: 'PCST-02',
    productCode: 'FG-CRM-002',
    productName: 'Ceramide Barrier Defense Cream (50gr Jar)',
    batchSizeKg: 800,
    standardCogmPerKgIdr: 188000,
    actualCogmPerKgIdr: 194500,
    variancePerKgIdr: 6500, // Unfavorable +6.5k
    rawMaterialCostIdr: 128000,
    packagingCostIdr: 41000,
    directLaborCostIdr: 11000,
    machineCostIdr: 6200,
    utilityCostIdr: 2800,
    overheadCostIdr: 2500,
    wasteYieldLossIdr: 3000,
    marginPercentage: 54.2,
  },
];

export const initialCostVariances: CostVarianceDetail[] = [
  {
    id: 'VAR-01',
    batchCode: 'BATCH-2026-0801',
    productName: 'Luminance Glow Serum',
    materialPriceVarianceIdr: -1500000, // Favorable price DSM Niacinamide
    materialUsageVarianceIdr: +850000,  // Slightly higher usage
    laborVarianceIdr: -420000,          // Faster packing speed
    machineEfficiencyVarianceIdr: -650000, // Vacuum Homogenizer OEE 92%
    yieldVarianceIdr: -2180000,         // Yield 98.8% vs Standard 97.0%
    totalVarianceIdr: -3900000,         // Overall Favorable Variance
    explanation: 'Yield produksi mencapai 98.8% (melewati target standard 97%), ditambah diskon pembelian bulk Niacinamide dari DSM.',
  },
];

export const initialFixedAssets: FixedAssetItem[] = [
  {
    id: 'FA-01',
    assetCode: 'EQP-HOMO-01',
    assetName: 'Vacuum Emulsifier Homogenizer Tank 1000L',
    category: 'Production Machine',
    acquisitionDate: '2023-01-10',
    acquisitionCostIdr: 1850000000,
    usefulLifeYears: 10,
    depreciationMethod: 'Straight Line',
    accumulatedDepreciationIdr: 647500000,
    bookValueIdr: 1202500000,
    monthlyDepreciationIdr: 15416666,
    location: 'Cleanroom A - Production Line 1',
    maintenanceAssetCode: 'MCH-MIX-01',
  },
  {
    id: 'FA-02',
    assetCode: 'EQP-FILL-02',
    assetName: 'Automatic Rotary 12-Head Serum Bottle Filling Line',
    category: 'Production Machine',
    acquisitionDate: '2023-06-15',
    acquisitionCostIdr: 1200000000,
    usefulLifeYears: 8,
    depreciationMethod: 'Straight Line',
    accumulatedDepreciationIdr: 450000000,
    bookValueIdr: 750000000,
    monthlyDepreciationIdr: 12500000,
    location: 'Cleanroom B - Filling Line 2',
    maintenanceAssetCode: 'MCH-FILL-02',
  },
  {
    id: 'FA-03',
    assetCode: 'LAB-HPLC-01',
    assetName: 'Shimadzu HPLC High Performance Liquid Chromatography',
    category: 'Lab Instrument',
    acquisitionDate: '2024-02-01',
    acquisitionCostIdr: 850000000,
    usefulLifeYears: 5,
    depreciationMethod: 'Straight Line',
    accumulatedDepreciationIdr: 425000000,
    bookValueIdr: 425000000,
    monthlyDepreciationIdr: 14166666,
    location: 'Quality Control Instrumental Lab',
    maintenanceAssetCode: 'LAB-INST-01',
  },
];

export const initialTaxes: TaxTransaction[] = [
  {
    id: 'TAX-01',
    taxInvoiceNumber: '010.000-26.00008812',
    type: 'PPN Masukan (Input)',
    partnerName: 'PT BASF Indonesia',
    taxableBaseAmountIdr: 90000000,
    taxAmountIdr: 9900000,
    date: '2026-08-02',
    status: 'Validated e-Faktur',
  },
  {
    id: 'TAX-02',
    taxInvoiceNumber: '010.000-26.00009120',
    type: 'PPN Keluaran (Output)',
    partnerName: 'PT Glow Indonesia (Somethinc)',
    taxableBaseAmountIdr: 300000000,
    taxAmountIdr: 33000000,
    date: '2026-08-03',
    status: 'Validated e-Faktur',
  },
  {
    id: 'TAX-03',
    taxInvoiceNumber: 'PPh23/2026/08/01',
    type: 'PPh 23',
    partnerName: 'PT Maintenance Engineering Services',
    taxableBaseAmountIdr: 18500000,
    taxAmountIdr: 370000, // 2% Withholding
    date: '2026-08-04',
    status: 'Validated e-Faktur',
  },
];

export const initialClosingStatus: PeriodClosingStatus = {
  period: '2026-07',
  status: 'Hard Locked',
  closedAt: '2026-08-01 18:00',
  closedBy: 'Bambang S. (Finance Controller)',
  checklist: {
    bankReconciliation: true,
    apArAgingVerified: true,
    inventoryValuationRun: true,
    depreciationPosted: true,
    taxReconciliation: true,
    trialBalanceBalanced: true,
  },
};
