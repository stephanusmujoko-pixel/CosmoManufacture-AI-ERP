export type ThemeMode = 'dark' | 'light';

export type TenantTier = 'starter' | 'professional' | 'enterprise' | 'custom';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  subdomain: string;
  tier: TenantTier;
  status: 'active' | 'suspended' | 'grace_period' | 'expired';
  licenseKey: string;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  expiresAt: string;
  bpomNumber?: string;
  cpkbStatus: 'certified' | 'in_progress' | 'pending';
}

export interface LicenseInfo {
  key: string;
  tenantId: string;
  companyName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'grace_period' | 'suspended' | 'expired';
  modulesEnabled: string[];
  maxBatchesPerMonth: number;
  aiTokensAllowance: number;
  hardwareHash: string;
  domainBinding: string;
}

export type AiAgentRole =
  | 'ceo'
  | 'rd_chemist'
  | 'regulatory'
  | 'production'
  | 'quality'
  | 'finance'
  | 'inventory'
  | 'purchasing'
  | 'marketing'
  | 'sales'
  | 'hr'
  | 'warehouse'
  | 'maintenance'
  | 'business_analyst'
  | 'forecast';

export interface AiAgentConfig {
  id: AiAgentRole;
  name: string;
  title: string;
  avatar: string;
  color: string;
  systemPrompt: string;
  description: string;
  suggestedQuestions: string[];
}

export interface FormulaIngredient {
  id: string;
  rawMaterialId: string;
  name: string;
  inciName: string;
  percentage: number;
  phase: 'A' | 'B' | 'C' | 'D' | 'E';
  function: string;
  costPerKg: number;
  bpomMaxLimit?: number; // e.g. 2.0% for Salicylic Acid or Niacinamide
  halalCertified: boolean;
}

export interface Formula {
  id: string;
  code: string;
  name: string;
  category: 'skincare' | 'haircare' | 'bodycare' | 'decorative' | 'fragrance';
  subCategory: string;
  targetPh: string;
  targetViscosity: string;
  version: string;
  status: 'draft' | 'under_review' | 'stability_testing' | 'approved' | 'deprecated';
  estimatedCostPerKg: number;
  ingredients: FormulaIngredient[];
  preparationSteps: string[];
  bpomCompliant: boolean;
  stabilityResult?: 'passed' | 'failed' | 'ongoing';
  microbiologyResult?: 'passed' | 'failed' | 'ongoing';
  createdBy: string;
  updatedAt: string;
}

export interface BatchProduction {
  id: string;
  batchNumber: string;
  formulaId: string;
  formulaName: string;
  targetQuantityKg: number;
  actualQuantityKg: number;
  yieldPercentage: number;
  status: 'scheduled' | 'weighing' | 'mixing' | 'filling' | 'qc_pending' | 'completed' | 'rejected';
  startDate: string;
  endDate?: string;
  operatorName: string;
  mixingTempCelsius: number;
  mixerRpm: number;
  pHRecorded: number;
  viscosityRecorded: number;
  lotNumber: string;
  coaStatus: 'issued' | 'pending' | 'failed';
}

export interface QualityControlCheck {
  id: string;
  batchNumber: string;
  testDate: string;
  organolepticCheck: 'passed' | 'failed';
  pHValue: number;
  pHStandardMin: number;
  pHStandardMax: number;
  viscosityCps: number;
  viscosityStandardMin: number;
  viscosityStandardMax: number;
  specificGravity: number;
  microbiologyColoniesCfu: number; // Max 100 CFU/g for cosmetics
  microbiologyStatus: 'passed' | 'failed' | 'pending';
  overallStatus: 'approved' | 'rejected' | 'quarantine';
  inspectedBy: string;
  notes: string;
}

export interface BpomSubmission {
  id: string;
  registrationNumber: string; // e.g. NA18240199882
  productName: string;
  formulaCode: string;
  category: string;
  brandName: string;
  applicantCompany: string;
  submissionDate: string;
  approvalDate?: string;
  status: 'draft' | 'submitted' | 'under_evaluation' | 'approved' | 'revision_requested';
  validUntil?: string;
  documents: { title: string; fileUrl: string; status: 'verified' | 'pending' }[];
}

export interface CpkbAuditItem {
  id: string;
  clause: string;
  title: string;
  category: 'sanitation' | 'equipment' | 'personnel' | 'production' | 'quality' | 'documentation';
  status: 'compliant' | 'minor_nc' | 'major_nc' | 'critical_nc';
  evidence: string;
  correctiveAction?: string;
}

export interface RawMaterialStock {
  id: string;
  code: string;
  name: string;
  inciName: string;
  casNumber: string;
  category: 'active' | 'emulsifier' | 'preservative' | 'fragrance' | 'carrier' | 'packaging';
  stockQuantityKg: number;
  unitCostIdr: number;
  minStockKg: number;
  expiryDate: string;
  batchLotSupplier: string;
  halalCertNumber: string;
  storageCondition: 'cool_dry' | 'room_temp' | 'cold_room';
}

export interface SystemArchitectureBlueprint {
  sectionId: number;
  title: string;
  subtitle: string;
  content: string;
  diagramData?: Record<string, any>;
  highlights: string[];
}

export interface UserProfilePersona {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  badge: string;
  badgeColor: string;
  department: string;
  allowedTabs?: string[];
}

export const PRESET_USER_PERSONAS: UserProfilePersona[] = [
  {
    id: 'u-dev-00',
    name: 'Stephanus Mujoko, S.Kom',
    role: 'Lead Developer & Super Admin',
    email: 'stephanusmujoko@gmail.com',
    initials: 'SM',
    badge: 'Super Admin',
    badgeColor: 'amber',
    department: 'Software Engineering & AI System Architecture',
    allowedTabs: [
      'blueprint', 'dashboard', 'design-system', 'rd', 'formula', 'production',
      'inventory', 'quality', 'eam', 'crm', 'purchasing', 'wms', 'ppic',
      'finance', 'hr', 'maintenance', 'regulatory', 'master-data', 'license-sub',
      'backend-auth', 'saas-engine', 'user-settings', 'ai-center', 'super-admin'
    ],
  },
  {
    id: 'u-admin-01',
    name: 'Hendra Wijaya, S.T.',
    role: 'Tenant Owner & Chief Executive Officer',
    email: 'hendra@beautyglow.co.id',
    initials: 'HW',
    badge: 'Owner & CEO',
    badgeColor: 'emerald',
    department: 'Executive Board',
    allowedTabs: [
      'dashboard', 'rd', 'formula', 'production', 'inventory', 'quality', 'eam',
      'crm', 'purchasing', 'wms', 'ppic', 'finance', 'hr', 'maintenance',
      'regulatory', 'master-data', 'license-sub', 'user-settings', 'ai-center'
    ],
  },
  {
    id: 'u-qa-01',
    name: 'Apt. Clara, M.Farm',
    role: 'Head Chemist & QA Director',
    email: 'clara@beautyglow.co.id',
    initials: 'PA',
    badge: 'Head Chemist',
    badgeColor: 'teal',
    department: 'R&D Formulation & Quality Assurance',
    allowedTabs: [
      'rd', 'formula', 'quality', 'regulatory', 'master-data', 'ai-center', 'user-settings'
    ],
  },
  {
    id: 'u-plant-01',
    name: 'Budi Santoso, S.T.',
    role: 'Factory & MES Operations Manager',
    email: 'budi@beautyglow.co.id',
    initials: 'BS',
    badge: 'Factory Manager',
    badgeColor: 'indigo',
    department: 'Cleanroom Production & Batch Processing',
    allowedTabs: [
      'production', 'inventory', 'quality', 'eam', 'wms', 'ppic', 'maintenance',
      'master-data', 'ai-center', 'user-settings'
    ],
  },
  {
    id: 'u-fin-01',
    name: 'Rina Melati, S.E.',
    role: 'Head of Finance & COGM Costing',
    email: 'rina@beautyglow.co.id',
    initials: 'RM',
    badge: 'Finance Head',
    badgeColor: 'purple',
    department: 'Finance & ERP Accounting',
    allowedTabs: [
      'dashboard', 'finance', 'purchasing', 'crm', 'inventory', 'master-data',
      'license-sub', 'ai-center', 'user-settings'
    ],
  },
  {
    id: 'u-apj-02',
    name: 'Apt. Maya Indah, S.Farm',
    role: 'Regulatory & e-BPOM Manager',
    email: 'maya@beautyglow.co.id',
    initials: 'MI',
    badge: 'Regulatory APJ',
    badgeColor: 'blue',
    department: 'Legal Compliance & CPKB Standards',
    allowedTabs: [
      'regulatory', 'rd', 'formula', 'quality', 'master-data', 'ai-center', 'user-settings'
    ],
  },
];

