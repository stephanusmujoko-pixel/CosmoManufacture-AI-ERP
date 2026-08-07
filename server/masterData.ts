// Master Data Database for Cosmetic Manufacturing ERP
// Supports Multi-Tenant, Cosmetic Specific Master Data, Document Auto-Numbering, Approval Workflows, Custom Fields & Audit Logs

export interface MasterProduct {
  id: string;
  sku: string;
  barcode: string;
  qrCode: string;
  productCode: string;
  productName: string;
  brand: string;
  category: string; // e.g. Skincare, Haircare, Bodycare, Decorative
  type: 'Finished Goods' | 'Semi Finished' | 'Sample' | 'Trial Product';
  formulaCode: string;
  formulaVersion: string;
  packagingType: string;
  netto: string;
  grossWeightGrams: number;
  volumeMl: number;
  color: string;
  fragrance: string;
  variant: string;
  shelfLifeMonths: number;
  bpomNumber: string;
  bpomExpiry: string;
  halalNumber: string;
  status: 'active' | 'draft' | 'discontinued' | 'pending_approval';
  targetPh: string;
  viscosityCps: string;
  densityGml: number;
  createdDate: string;
  approvedBy?: string;
  customFields?: Record<string, any>;
  tags?: string[];
  attachments?: string[];
}

export interface MasterRawMaterial {
  id: string;
  code: string;
  name: string;
  scientificName: string;
  casNumber: string;
  category: 'Active Ingredient' | 'Emulsifier' | 'Preservative' | 'Fragrance' | 'Colorant' | 'Inactive / Base';
  supplierName: string;
  countryOfOrigin: string;
  grade: 'Pharma Grade' | 'Cosmetic Grade' | 'Organic / Natural' | 'USP/EP Grade';
  purityPercentage: number;
  storageCondition: 'Cool & Dry (15-25°C)' | 'Cold Room (2-8°C)' | 'Ambient (25-30°C)';
  hazardLevel: 'None' | 'Irritant' | 'Flammable' | 'Corrosive';
  msdsFileName: string;
  coaStandard: string;
  shelfLifeMonths: number;
  leadTimeDays: number;
  moqKg: number;
  safetyStockKg: number;
  reorderPointKg: number;
  pricePerKgRp: number;
  halalCertified: boolean;
  bpomAllowedMaxPct: number;
  status: 'active' | 'restricted' | 'quarantine' | 'obsolete';
}

export interface MasterSupplier {
  id: string;
  supplierCode: string;
  companyName: string;
  brandOrGroup: string;
  address: string;
  picName: string;
  email: string;
  phone: string;
  whatsapp: string;
  bankName: string;
  bankAccountNo: string;
  paymentTermDays: number;
  taxNumberNpwp: string;
  leadTimeDays: number;
  qualityScorePct: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isApprovedVendor: boolean;
  category: 'Chemical Supplier' | 'Packaging Supplier' | 'Machinery' | 'Lab Testing';
}

export interface MasterCustomer {
  id: string;
  customerCode: string;
  companyName: string;
  brandName: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  shippingAddress: string;
  billingAddress: string;
  paymentTermDays: number;
  creditLimitRp: number;
  salesman: string;
  priceGroup: 'Standard' | 'VIP Maklon' | 'Distributor Utama' | 'Export';
  discountGroupPct: number;
  npwp: string;
  nib: string;
}

export interface MasterMachine {
  id: string;
  machineCode: string;
  machineName: string;
  category: 'Vacuum Emulsifier Homogenizer' | 'Automatic Liquid Filling Line' | 'Tube Sealing Machine' | 'Inline Labeling' | 'Capping & Shrink';
  factoryName: string;
  productionLine: string;
  manufacturer: string;
  serialNumber: string;
  capacityKgOrPcsPerHour: number;
  purchaseDate: string;
  lastCalibrationDate: string;
  maintenanceIntervalDays: number;
  oeeTargetPct: number;
  cleanroomGrade: 'Class A (Sterile)' | 'Class B (High Clean)' | 'Class C (CPKB Primary)' | 'Class D (Secondary Packaging)';
  status: 'operational' | 'maintenance' | 'calibration' | 'idle';
}

export interface MasterWarehouseLocation {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  zoneCode: string;
  zoneName: string;
  rackNumber: string;
  binLocation: string;
  type: 'Raw Material Vault' | 'Packaging Storage' | 'Quarantine Area' | 'Finished Goods FEFO' | 'Hazardous Chemical Vault' | 'Cold Storage';
  tempMinC: number;
  tempMaxC: number;
  humidityMaxPct: number;
  capacityPallets: number;
  status: 'active' | 'full' | 'maintenance';
}

export interface DocumentNumberingFormat {
  id: string;
  docType: 'PO' | 'PR' | 'SO' | 'MO' | 'WO' | 'QC' | 'INV' | 'PAY' | 'JV' | 'COA' | 'Formula' | 'Batch' | 'Lot';
  prefix: string;
  suffix: string;
  digits: number;
  currentSequence: number;
  resetCycle: 'Monthly' | 'Yearly' | 'Never';
  sampleResult: string;
}

export interface ApprovalRule {
  id: string;
  module: 'Formula Spec' | 'Master Product' | 'Raw Material QC' | 'Vendor Approval' | 'Price Exception';
  stepNumber: number;
  approverRole: string;
  minAmountRp?: number;
  actionRequired: 'Review' | 'Approve' | 'Sign Off';
}

export interface AuditTrailLog {
  id: string;
  timestamp: string;
  tenantId: string;
  userEmail: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'APPROVE' | 'REJECT';
  entityType: 'Product' | 'Raw Material' | 'Supplier' | 'Customer' | 'Machine' | 'Warehouse' | 'Approval';
  entityId: string;
  entityName: string;
  details: string;
  ipAddress: string;
}

// Simulated In-Memory Database for Master Data
export const dbProducts: MasterProduct[] = [
  {
    id: 'prod-001',
    sku: 'SKU-FG-LUM-01',
    barcode: '8991002003001',
    qrCode: 'QR-FG-LUM-01-2026',
    productCode: 'FG-SER-01',
    productName: 'Luminance Glow Serum (10% Niacinamide + 2% Alpha Arbutin)',
    brand: 'BeautyGlow Cosmetics',
    category: 'Skincare - Facial Serum',
    type: 'Finished Goods',
    formulaCode: 'FORM-SER-2026-V3',
    formulaVersion: '3.2',
    packagingType: 'Dropper Bottle Amber Glass 30ml',
    netto: '30 ml',
    grossWeightGrams: 85,
    volumeMl: 30,
    color: 'Jernih Transparan',
    fragrance: 'Fragrance Free',
    variant: 'Standard Glow',
    shelfLifeMonths: 24,
    bpomNumber: 'NA18240199882',
    bpomExpiry: '2029-05-10',
    halalNumber: 'ID00410000288100521',
    status: 'active',
    targetPh: '5.5 - 6.0',
    viscosityCps: '1,200 - 1,800 cPs',
    densityGml: 1.02,
    createdDate: '2026-01-10',
    approvedBy: 'Apoteker Penanggung Jawab (Apt. Sarah, S.Farm)',
    tags: ['BestSeller', 'BPOM-Verified', 'Halal-MUI'],
    attachments: ['COA_Serum_Glow.pdf', 'Design_Label_30ml.png'],
  },
  {
    id: 'prod-002',
    sku: 'SKU-FG-BAR-02',
    barcode: '8991002003002',
    qrCode: 'QR-FG-BAR-02-2026',
    productCode: 'FG-CRM-02',
    productName: 'Ceramide Barrier Defense Moisture Gel',
    brand: 'Paragonia SkinLab',
    category: 'Skincare - Moisturizer',
    type: 'Finished Goods',
    formulaCode: 'FORM-CRM-2026-V1',
    formulaVersion: '1.0',
    packagingType: 'Airless Pump Jar 50ml',
    netto: '50 gr',
    grossWeightGrams: 120,
    volumeMl: 50,
    color: 'Putih Milk Soft',
    fragrance: 'White Tea Essence',
    variant: 'Normal to Sensitive',
    shelfLifeMonths: 30,
    bpomNumber: 'NA18240199991',
    bpomExpiry: '2029-08-20',
    halalNumber: 'ID00410000288100522',
    status: 'active',
    targetPh: '6.0 - 6.5',
    viscosityCps: '15,000 - 22,000 cPs',
    densityGml: 0.98,
    createdDate: '2026-02-01',
    approvedBy: 'Head of Quality Assurance (Dra. Maya, M.Si)',
    tags: ['Ceramide5X', 'Cleanroom-Batch'],
  },
  {
    id: 'prod-003',
    sku: 'SKU-SF-BASE-01',
    barcode: '8991002003901',
    qrCode: 'QR-SF-BASE-01',
    productCode: 'SF-EMU-01',
    productName: 'Base Emulsion Cream Concentrate (Bulk Semi-Finished)',
    brand: 'Internal OEM Core',
    category: 'Semi-Finished Bulk',
    type: 'Semi Finished',
    formulaCode: 'FORM-BASE-2025',
    formulaVersion: '2.0',
    packagingType: 'PE Foodgrade Drum 200Kg',
    netto: '200 Kg',
    grossWeightGrams: 205000,
    volumeMl: 200000,
    color: 'Off-White',
    fragrance: 'Unscented Base',
    variant: 'Standard Emulsion Base',
    shelfLifeMonths: 12,
    bpomNumber: 'INTERNAL-BULK-CPKB',
    bpomExpiry: '2028-12-31',
    halalNumber: 'ID00410000288100999',
    status: 'active',
    targetPh: '5.8 - 6.2',
    viscosityCps: '30,000 cPs',
    densityGml: 1.01,
    createdDate: '2026-01-15',
  },
];

export const dbRawMaterials: MasterRawMaterial[] = [
  {
    id: 'rm-001',
    code: 'RM-ACT-001',
    name: 'Niacinamide USP Grade 99.8%',
    scientificName: 'Nicotinamide / Vitamin B3',
    casNumber: '98-92-0',
    category: 'Active Ingredient',
    supplierName: 'DSM Nutritional Products Asia',
    countryOfOrigin: 'Switzerland / Germany',
    grade: 'Pharma Grade',
    purityPercentage: 99.8,
    storageCondition: 'Cool & Dry (15-25°C)',
    hazardLevel: 'None',
    msdsFileName: 'MSDS_Niacinamide_DSM.pdf',
    coaStandard: 'USP43 / EP10 Compliance',
    shelfLifeMonths: 36,
    leadTimeDays: 14,
    moqKg: 25,
    safetyStockKg: 200,
    reorderPointKg: 350,
    pricePerKgRp: 185000,
    halalCertified: true,
    bpomAllowedMaxPct: 10.0,
    status: 'active',
  },
  {
    id: 'rm-002',
    code: 'RM-ACT-002',
    name: 'Alpha Arbutin Pure Powder',
    scientificName: '4-Hydroxyphenyl-alpha-D-glucopyranoside',
    casNumber: '84380-01-8',
    category: 'Active Ingredient',
    supplierName: 'Biospectrum Korea Specialty',
    countryOfOrigin: 'South Korea',
    grade: 'Cosmetic Grade',
    purityPercentage: 99.5,
    storageCondition: 'Cool & Dry (15-25°C)',
    hazardLevel: 'None',
    msdsFileName: 'MSDS_Alpha_Arbutin_Biospectrum.pdf',
    coaStandard: 'HPLC Certified > 99.5%',
    shelfLifeMonths: 24,
    leadTimeDays: 21,
    moqKg: 5,
    safetyStockKg: 30,
    reorderPointKg: 50,
    pricePerKgRp: 2850000,
    halalCertified: true,
    bpomAllowedMaxPct: 2.0,
    status: 'active',
  },
  {
    id: 'rm-003',
    code: 'RM-EMU-001',
    name: 'Cetearyl Alcohol & Ceteareth-20 (Emulgade 1000)',
    scientificName: 'Cetostearyl Alcohol Ethoxylated',
    casNumber: '68439-49-6',
    category: 'Emulsifier',
    supplierName: 'BASF Indonesia Chemical',
    countryOfOrigin: 'Indonesia / Germany',
    grade: 'Cosmetic Grade',
    purityPercentage: 98.0,
    storageCondition: 'Ambient (25-30°C)',
    hazardLevel: 'None',
    msdsFileName: 'MSDS_Emulgade_1000_BASF.pdf',
    coaStandard: 'ISO 22716 CPKB Grade',
    shelfLifeMonths: 24,
    leadTimeDays: 7,
    moqKg: 50,
    safetyStockKg: 500,
    reorderPointKg: 800,
    pricePerKgRp: 68000,
    halalCertified: true,
    bpomAllowedMaxPct: 15.0,
    status: 'active',
  },
  {
    id: 'rm-004',
    code: 'RM-PRE-001',
    name: 'Phenoxyethanol & Ethylhexylglycerin (Euxyl PE9010)',
    scientificName: '2-Phenoxyethanol / 3-(2-Ethylhexyloxy)propane-1,2-diol',
    casNumber: '122-99-6',
    category: 'Preservative',
    supplierName: 'Schülke & Mayr Asia Pacific',
    countryOfOrigin: 'Germany',
    grade: 'Pharma Grade',
    purityPercentage: 99.0,
    storageCondition: 'Cool & Dry (15-25°C)',
    hazardLevel: 'Irritant',
    msdsFileName: 'MSDS_Euxyl_PE9010.pdf',
    coaStandard: 'Microbiology Shield Approved',
    shelfLifeMonths: 36,
    leadTimeDays: 10,
    moqKg: 20,
    safetyStockKg: 100,
    reorderPointKg: 180,
    pricePerKgRp: 220000,
    halalCertified: true,
    bpomAllowedMaxPct: 1.0,
    status: 'active',
  },
];

export const dbSuppliers: MasterSupplier[] = [
  {
    id: 'sup-001',
    supplierCode: 'SUP-DSM-01',
    companyName: 'PT DSM Nutritional Products Indonesia',
    brandOrGroup: 'DSM-Firmenich Global',
    address: 'Kawasan Industri Jababeka V, Cikarang, Jawa Barat',
    picName: 'Budi Santoso, S.Si (Key Account Manager)',
    email: 'budi.santoso@dsm-firmenich.com',
    phone: '+62 21 8934 1100',
    whatsapp: '+62 811 9882 1100',
    bankName: 'Bank Central Asia (BCA) Cabang Jababeka',
    bankAccountNo: '883-0912-881',
    paymentTermDays: 30,
    taxNumberNpwp: '01.234.567.8-052.000',
    leadTimeDays: 14,
    qualityScorePct: 98.5,
    riskLevel: 'Low',
    isApprovedVendor: true,
    category: 'Chemical Supplier',
  },
  {
    id: 'sup-002',
    supplierCode: 'SUP-BASF-02',
    companyName: 'PT BASF Indonesia Care Chemicals',
    brandOrGroup: 'BASF Germany',
    address: 'DBS Bank Tower Lt. 27, Prof. Dr. Satrio, Jakarta Selatan',
    picName: 'Anita Wijaya (Sales Director)',
    email: 'anita.wijaya@basf.com',
    phone: '+62 21 5262 200',
    whatsapp: '+62 812 8000 2211',
    bankName: 'Bank Mandiri Cabang Plaza Mandiri',
    bankAccountNo: '122-000-8812-99',
    paymentTermDays: 45,
    taxNumberNpwp: '01.111.222.3-011.000',
    leadTimeDays: 7,
    qualityScorePct: 99.1,
    riskLevel: 'Low',
    isApprovedVendor: true,
    category: 'Chemical Supplier',
  },
  {
    id: 'sup-003',
    supplierCode: 'SUP-PACK-03',
    companyName: 'PT Kemas Indah Maju Packaging',
    brandOrGroup: 'Kemas Group Indonesia',
    address: 'Jl. Industri Raya No. 8, Cikupa, Tangerang, Banten',
    picName: 'Hendra Gunawan (Sales Engineer)',
    email: 'hendra@kemaspack.co.id',
    phone: '+62 21 5960 300',
    whatsapp: '+62 815 1100 4400',
    bankName: 'BCA Cabang Tangerang',
    bankAccountNo: '084-2211-550',
    paymentTermDays: 30,
    taxNumberNpwp: '02.999.888.7-041.000',
    leadTimeDays: 21,
    qualityScorePct: 96.0,
    riskLevel: 'Low',
    isApprovedVendor: true,
    category: 'Packaging Supplier',
  },
];

export const dbCustomers: MasterCustomer[] = [
  {
    id: 'cust-001',
    customerCode: 'CUST-GLOW-01',
    companyName: 'PT Beauty Glow Indonesia (Owner Brand BeautyGlow)',
    brandName: 'BeautyGlow Cosmetics',
    picName: 'Rina Kartika (Founder & CEO)',
    email: 'rina@beautyglow.co.id',
    phone: '+62 21 7890 1234',
    address: 'Rukan Grand Puri No. 12, Puri Indah, Jakarta Barat',
    shippingAddress: 'Gudang Utama BeautyGlow, Pergudangan Taman Tekno Blok D/5, BSD City',
    billingAddress: 'Rukan Grand Puri No. 12, Puri Indah, Jakarta Barat',
    paymentTermDays: 30,
    creditLimitRp: 1500000000,
    salesman: 'Dimas Anggara (Senior Account Executive Maklon)',
    priceGroup: 'VIP Maklon',
    discountGroupPct: 12.5,
    npwp: '31.456.789.0-085.000',
    nib: '9120001188221',
  },
  {
    id: 'cust-002',
    customerCode: 'CUST-HERB-02',
    companyName: 'PT Herbal Natura Glow',
    brandName: 'NaturaGlow Organics',
    picName: 'Dr. Ferry Pratama (Chief Product Officer)',
    email: 'ferry@naturaglow.com',
    phone: '+62 22 4200 881',
    address: 'Jl. Ir. H. Juanda No. 88, Dago, Bandung',
    shippingAddress: 'Jl. Raya Soreang No. 45, Kabupaten Bandung',
    billingAddress: 'Jl. Ir. H. Juanda No. 88, Dago, Bandung',
    paymentTermDays: 14,
    creditLimitRp: 500000000,
    salesman: 'Siti Nurhaliza (Account Executive)',
    priceGroup: 'Standard',
    discountGroupPct: 5.0,
    npwp: '42.111.333.4-022.000',
    nib: '9120009988110',
  },
];

export const dbMachines: MasterMachine[] = [
  {
    id: 'mach-001',
    machineCode: 'MAC-VAC-1000L',
    machineName: 'Main Vacuum Emulsifier Homogenizer Tank 1,000 Liter',
    category: 'Vacuum Emulsifier Homogenizer',
    factoryName: 'PT Paragonia Plant 1 (Cikarang)',
    productionLine: 'Line Emulsion & Cream Cleanroom A',
    manufacturer: 'FrymaKoruma / Symex Germany',
    serialNumber: 'VK-1000L-2022-881',
    capacityKgOrPcsPerHour: 1000,
    purchaseDate: '2022-03-15',
    lastCalibrationDate: '2026-01-10',
    maintenanceIntervalDays: 90,
    oeeTargetPct: 88.5,
    cleanroomGrade: 'Class C (CPKB Primary)',
    status: 'operational',
  },
  {
    id: 'mach-002',
    machineCode: 'MAC-FILL-AUTO-01',
    machineName: 'High Speed Monoblock Serum Bottle Filling & Capping Line',
    category: 'Automatic Liquid Filling Line',
    factoryName: 'PT Paragonia Plant 1 (Cikarang)',
    productionLine: 'Line Liquid Serum Cleanroom B',
    manufacturer: 'Norden Packaging / Groninger',
    serialNumber: 'NORD-FILL-2024-002',
    capacityKgOrPcsPerHour: 3600, // 3600 bottles/hr
    purchaseDate: '2024-06-20',
    lastCalibrationDate: '2026-02-01',
    maintenanceIntervalDays: 60,
    oeeTargetPct: 92.0,
    cleanroomGrade: 'Class C (CPKB Primary)',
    status: 'operational',
  },
];

export const dbWarehouses: MasterWarehouseLocation[] = [
  {
    id: 'wh-001',
    warehouseCode: 'WH-RM-01',
    warehouseName: 'Gudang Utama Bahan Baku & Aktif Kosmetik',
    zoneCode: 'ZONE-A-ACTIVE',
    zoneName: 'Zona A - Bahan Aktif & Preservative (AC Control)',
    rackNumber: 'RACK-A01',
    binLocation: 'BIN-A01-LEVEL-02',
    type: 'Raw Material Vault',
    tempMinC: 18,
    tempMaxC: 22,
    humidityMaxPct: 60,
    capacityPallets: 120,
    status: 'active',
  },
  {
    id: 'wh-002',
    warehouseCode: 'WH-FG-02',
    warehouseName: 'Gudang Produk Jadi Finished Goods FEFO',
    zoneCode: 'ZONE-FG-CLEAN',
    zoneName: 'Zona FG Transit & Karantina Lulus QC',
    rackNumber: 'RACK-FG-05',
    binLocation: 'BIN-FG05-01',
    type: 'Finished Goods FEFO',
    tempMinC: 20,
    tempMaxC: 25,
    humidityMaxPct: 65,
    capacityPallets: 450,
    status: 'active',
  },
];

export const dbDocumentFormats: DocumentNumberingFormat[] = [
  {
    id: 'num-01',
    docType: 'MO',
    prefix: 'MO/CPKB/2026/',
    suffix: '/PARAGONIA',
    digits: 5,
    currentSequence: 142,
    resetCycle: 'Monthly',
    sampleResult: 'MO/CPKB/2026/00142/PARAGONIA',
  },
  {
    id: 'num-02',
    docType: 'Batch',
    prefix: 'B-2026-',
    suffix: '-LUM',
    digits: 4,
    currentSequence: 804,
    resetCycle: 'Yearly',
    sampleResult: 'B-2026-0804-LUM',
  },
  {
    id: 'num-03',
    docType: 'COA',
    prefix: 'COA/LAB/2026/',
    suffix: '/QC-PASS',
    digits: 5,
    currentSequence: 388,
    resetCycle: 'Yearly',
    sampleResult: 'COA/LAB/2026/00388/QC-PASS',
  },
  {
    id: 'num-04',
    docType: 'PO',
    prefix: 'PO/RAW/2026/',
    suffix: '',
    digits: 5,
    currentSequence: 92,
    resetCycle: 'Yearly',
    sampleResult: 'PO/RAW/2026/00092',
  },
];

export const dbApprovalRules: ApprovalRule[] = [
  {
    id: 'app-01',
    module: 'Formula Spec',
    stepNumber: 1,
    approverRole: 'R&D Formulation Specialist',
    actionRequired: 'Review',
  },
  {
    id: 'app-02',
    module: 'Formula Spec',
    stepNumber: 2,
    approverRole: 'Apoteker Penanggung Jawab (Apt BPOM)',
    actionRequired: 'Approve',
  },
  {
    id: 'app-03',
    module: 'Raw Material QC',
    stepNumber: 1,
    approverRole: 'Microbiology Lab Specialist',
    actionRequired: 'Sign Off',
  },
];

export const dbAuditLogs: AuditTrailLog[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    tenantId: 't-cosmo-01',
    userEmail: 'apt.sarah@paragonia.co.id',
    userName: 'Apt. Sarah, S.Farm',
    action: 'CREATE',
    entityType: 'Product',
    entityId: 'prod-001',
    entityName: 'Luminance Glow Serum',
    details: 'Mendaftarkan Master Product Baru dengan Nomor BPOM NA18240199882 & Sertifikasi Halal MUI',
    ipAddress: '180.252.112.44',
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    tenantId: 't-cosmo-01',
    userEmail: 'drs.hendra@paragonia.co.id',
    userName: 'Drs. Hendra (Head of Purchasing)',
    action: 'APPROVE',
    entityType: 'Supplier',
    entityId: 'sup-001',
    entityName: 'PT DSM Nutritional Products Indonesia',
    details: 'Memverifikasi Sertifikat Halal & COA DSM sebagai Approved Vendor Bahan Aktif Niacinamide',
    ipAddress: '180.252.112.45',
  },
];
