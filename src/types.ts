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
