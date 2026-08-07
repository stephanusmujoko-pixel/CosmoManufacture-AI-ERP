export interface SubscriptionPlan {
  id: string;
  code: 'starter' | 'professional' | 'enterprise' | 'custom';
  name: string;
  priceMonthly: number; // in IDR
  priceYearly: number; // in IDR
  maxUsers: number;
  maxStorageGb: number;
  maxAiTokensMonthly: number;
  maxWarehouses: number;
  maxBranches: number;
  maxFactories: number;
  maxProducts: number;
  maxApiRequestsMonthly: number;
  features: string[];
}

export interface TenantSaas {
  id: string;
  name: string;
  brand: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  npwp: string;
  nib: string;
  status: 'active' | 'trial' | 'grace_period' | 'suspended' | 'cancelled';
  planCode: 'starter' | 'professional' | 'enterprise' | 'custom';
  currentLicenseKey: string;
  createdAt: string;
  joinedDate: string;
}

export interface CompanyProfile {
  tenantId: string;
  companyName: string;
  brandName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  npwp: string;
  nib: string;
  industry: string;
  timezone: string;
  currency: string;
  language: string;
}

export interface LicenseKey {
  id: string;
  tenantId: string;
  licenseKey: string;
  licenseCode: string; // RSA Signed base64 token
  status: 'trial' | 'active' | 'grace_period' | 'suspended' | 'expired';
  activationDate: string;
  expiryDate: string;
  renewalDate: string;
  gracePeriodDays: number;
  hardwareBindingHash?: string;
  domainBinding?: string;
  allowedDevicesMax: number;
  activeDevicesCount: number;
}

export interface InvoiceSaas {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  planName: string;
  period: string; // e.g., "Aug 2026 - Aug 2027"
  subtotal: number;
  taxPpn: number; // 11%
  discount: number;
  grandTotal: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  gatewayProvider?: 'midtrans' | 'xendit' | 'doku' | 'stripe' | 'manual_transfer';
}

export interface FeatureFlag {
  id: string;
  code: string;
  name: string;
  category: string;
  enabledInStarter: boolean;
  enabledInProfessional: boolean;
  enabledInEnterprise: boolean;
}

export interface UsageQuota {
  tenantId: string;
  usersUsed: number;
  usersLimit: number;
  storageGbUsed: number;
  storageGbLimit: number;
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  warehousesUsed: number;
  warehousesLimit: number;
  factoriesUsed: number;
  factoriesLimit: number;
}

// Default Subscription Plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    code: 'starter',
    name: 'Starter Maklon',
    priceMonthly: 7500000, // IDR 7.5jt/bulan
    priceYearly: 75000000, // IDR 75jt/tahun (2 bulan gratis)
    maxUsers: 10,
    maxStorageGb: 50,
    maxAiTokensMonthly: 500000,
    maxWarehouses: 2,
    maxBranches: 1,
    maxFactories: 1,
    maxProducts: 100,
    maxApiRequestsMonthly: 50000,
    features: [
      'Master Data Formula & Material',
      'Basic QC Test Log',
      'Batch Manufacturing Order',
      'Apoteker APJ E-Signature',
      'Basic Inventory FEFO',
      'Standard Financial Reports',
    ],
  },
  {
    id: 'plan-pro',
    code: 'professional',
    name: 'Professional CPKB Factory',
    priceMonthly: 18500000, // IDR 18.5jt/bulan
    priceYearly: 185000000, // IDR 185jt/tahun
    maxUsers: 50,
    maxStorageGb: 250,
    maxAiTokensMonthly: 2500000,
    maxWarehouses: 5,
    maxBranches: 3,
    maxFactories: 2,
    maxProducts: 500,
    maxApiRequestsMonthly: 250000,
    features: [
      'Semua fitur Starter Plan',
      'R&D Formula Lab & Stability Testing',
      'MES Cleanroom Real-time PLC Connector',
      'Microbiology QC Testing & Certificate of Analysis (COA)',
      'e-BPOM Regulatory Vault & CPKB ISO 22716 Auto Audit',
      'Costing HPP / COGM Dynamic Calculation',
      'AI Assistant Chemist & Executive BI',
    ],
  },
  {
    id: 'plan-enterprise',
    code: 'enterprise',
    name: 'Enterprise Industrial Group',
    priceMonthly: 45000000, // IDR 45jt/bulan
    priceYearly: 450000000, // IDR 450jt/tahun
    maxUsers: 250,
    maxStorageGb: 1000,
    maxAiTokensMonthly: 10000000,
    maxWarehouses: 20,
    maxBranches: 10,
    maxFactories: 5,
    maxProducts: 2500,
    maxApiRequestsMonthly: 1000000,
    features: [
      'Semua fitur Professional Plan',
      'Multi-Factory & Multi-Warehouse Intercompany Transfer',
      'Dedicated Cloud Run Container & Isolated PostgreSQL DB Option',
      'Full 16 Specialty AI ERP Agents',
      'Custom ERP API Gateway & Webhook Triggers',
      '24/7 Priority SLA On-Site & Online Engineering Support',
      'Hardware Fingerprint Bound Offline Backup Engine',
    ],
  },
];

// Initial Tenanted Data
export const dbTenantsSaas: TenantSaas[] = [
  {
    id: 't-cosmo-01',
    name: 'PT Beauty Glow Indonesia',
    brand: 'AuraGlow Skincare',
    email: 'admin@beautyglow.co.id',
    phone: '021-55443322',
    whatsapp: '081234567890',
    website: 'https://auraglow.co.id',
    npwp: '01.234.567.8-012.000',
    nib: '9120001234567',
    status: 'active',
    planCode: 'professional',
    currentLicenseKey: 'COSMO-PRO-2026-BG8812-SIGN',
    createdAt: '2026-08-01T10:00:00Z',
    joinedDate: '2026-08-01',
  },
  {
    id: 't-paragonia-02',
    name: 'PT Paragonia Cosmetic Industri',
    brand: 'Luminance Skincare',
    email: 'admin@paragonia.co.id',
    phone: '021-88776655',
    whatsapp: '081987654321',
    website: 'https://paragonia.co.id',
    npwp: '02.987.654.3-098.000',
    nib: '9120009876543',
    status: 'active',
    planCode: 'enterprise',
    currentLicenseKey: 'COSMO-ENT-2026-PAR9912-SIGN',
    createdAt: '2026-08-02T11:00:00Z',
    joinedDate: '2026-08-02',
  },
  {
    id: 't-nusantara-03',
    name: 'PT Formulasi Herbal Nusantara',
    brand: 'NusaBotanica',
    email: 'info@nusabotanica.co.id',
    phone: '022-77665544',
    whatsapp: '081311223344',
    website: 'https://nusabotanica.co.id',
    npwp: '03.111.222.3-444.000',
    nib: '9120003332211',
    status: 'trial',
    planCode: 'starter',
    currentLicenseKey: 'COSMO-STR-2026-TRIAL-001',
    createdAt: '2026-08-05T09:00:00Z',
    joinedDate: '2026-08-05',
  },
];

export const dbLicenses: LicenseKey[] = [
  {
    id: 'lic-001',
    tenantId: 't-cosmo-01',
    licenseKey: 'COSMO-PRO-2026-BG8812-SIGN',
    licenseCode: 'rsa_signed_payload_eyAiaWQiOiAibGljLTAwMSIsICJ0ZW5hbnRJZCI6ICJ0LWNvc21vLTAxIiwgInRpZXIiOiAicHJvIiwgImV4cCI6ICIyMDI3LTA4LTAxIn0=',
    status: 'active',
    activationDate: '2026-08-01T10:00:00Z',
    expiryDate: '2027-08-01T23:59:59Z',
    renewalDate: '2027-07-15T00:00:00Z',
    gracePeriodDays: 14,
    hardwareBindingHash: 'hw_mac_88:a1:b2:c3:d4:e5_cpu_i9_14900k',
    domainBinding: 'beautyglow.cosmomanufacture.ai',
    allowedDevicesMax: 15,
    activeDevicesCount: 8,
  },
  {
    id: 'lic-002',
    tenantId: 't-paragonia-02',
    licenseKey: 'COSMO-ENT-2026-PAR9912-SIGN',
    licenseCode: 'rsa_signed_payload_eyAiaWQiOiAibGljLTAwMiIsICJ0ZW5hbnRJZCI6ICJ0LXBhcmFnb25pYS0wMiIsICJ0aWVyIjogImVudGVycHJpc2UiLCAiZXhwIjogIjIwMjctMDgtMDIifQ==',
    status: 'active',
    activationDate: '2026-08-02T11:00:00Z',
    expiryDate: '2027-08-02T23:59:59Z',
    renewalDate: '2027-07-20T00:00:00Z',
    gracePeriodDays: 30,
    hardwareBindingHash: 'hw_mac_99:f1:e2:d3:c4:b5_cpu_m3_max',
    domainBinding: 'paragonia.cosmomanufacture.ai',
    allowedDevicesMax: 50,
    activeDevicesCount: 24,
  },
];

export const dbInvoices: InvoiceSaas[] = [
  {
    id: 'inv-2026-0801',
    invoiceNumber: 'INV/SAAS/2026/08/001',
    tenantId: 't-cosmo-01',
    tenantName: 'PT Beauty Glow Indonesia',
    planName: 'Professional CPKB Factory (Yearly)',
    period: '01 Ags 2026 - 01 Ags 2027',
    subtotal: 185000000,
    taxPpn: 20350000, // 11%
    discount: 18500000, // 10% Early Bird
    grandTotal: 186850000,
    status: 'paid',
    dueDate: '2026-08-05',
    paidDate: '2026-08-02',
    paymentMethod: 'BCA Virtual Account (Midtrans)',
    gatewayProvider: 'midtrans',
  },
  {
    id: 'inv-2026-0802',
    invoiceNumber: 'INV/SAAS/2026/08/002',
    tenantId: 't-paragonia-02',
    tenantName: 'PT Paragonia Cosmetic Industri',
    planName: 'Enterprise Industrial Group (Yearly)',
    period: '02 Ags 2026 - 02 Ags 2027',
    subtotal: 450000000,
    taxPpn: 49500000,
    discount: 0,
    grandTotal: 499500000,
    status: 'paid',
    dueDate: '2026-08-07',
    paidDate: '2026-08-03',
    paymentMethod: 'Mandiri Corporate Transfer (Xendit)',
    gatewayProvider: 'xendit',
  },
];

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'ff-01', code: 'ai_assistant', name: 'AI Chemist & Executive Assistant', category: 'Intelligence', enabledInStarter: false, enabledInProfessional: true, enabledInEnterprise: true },
  { id: 'ff-02', code: 'rnd_formula_lab', name: 'R&D Lab & Stability Testing Module', category: 'R&D', enabledInStarter: false, enabledInProfessional: true, enabledInEnterprise: true },
  { id: 'ff-03', code: 'mes_cleanroom', name: 'MES Realtime Cleanroom Integration', category: 'Production', enabledInStarter: false, enabledInProfessional: true, enabledInEnterprise: true },
  { id: 'ff-04', code: 'qc_microbiology', name: 'Microbiology Uji ALT & COA Generator', category: 'Quality Control', enabledInStarter: false, enabledInProfessional: true, enabledInEnterprise: true },
  { id: 'ff-05', code: 'ebpom_vault', name: 'e-BPOM Document Vault & CPKB Compliance', category: 'Regulatory', enabledInStarter: true, enabledInProfessional: true, enabledInEnterprise: true },
  { id: 'ff-06', code: 'multi_factory', name: 'Multi-Factory & Intercompany Transfer', category: 'Supply Chain', enabledInStarter: false, enabledInProfessional: false, enabledInEnterprise: true },
  { id: 'ff-07', code: 'api_webhooks', name: 'Rest API Access & Webhook Integration', category: 'Developers', enabledInStarter: false, enabledInProfessional: false, enabledInEnterprise: true },
];

export const dbQuotas: Record<string, UsageQuota> = {
  't-cosmo-01': {
    tenantId: 't-cosmo-01',
    usersUsed: 12,
    usersLimit: 50,
    storageGbUsed: 42.5,
    storageGbLimit: 250,
    aiRequestsUsed: 1850,
    aiRequestsLimit: 2500000,
    apiCallsUsed: 14200,
    apiCallsLimit: 250000,
    warehousesUsed: 3,
    warehousesLimit: 5,
    factoriesUsed: 1,
    factoriesLimit: 2,
  },
  't-paragonia-02': {
    tenantId: 't-paragonia-02',
    usersUsed: 38,
    usersLimit: 250,
    storageGbUsed: 185.0,
    storageGbLimit: 1000,
    aiRequestsUsed: 9400,
    aiRequestsLimit: 10000000,
    apiCallsUsed: 98000,
    apiCallsLimit: 1000000,
    warehousesUsed: 8,
    warehousesLimit: 20,
    factoriesUsed: 3,
    factoriesLimit: 5,
  },
};
