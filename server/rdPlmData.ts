export interface RdIdea {
  id: string;
  ideaNumber: string;
  title: string;
  description: string;
  category: 'Skincare' | 'Haircare' | 'Bodycare' | 'Sunscreen' | 'Decorative';
  businessValue: 'High' | 'Medium' | 'Strategic';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  targetMarket: string;
  createdBy: string;
  createdAt: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'In Development';
  approvalBy?: string;
  approvalDate?: string;
  estimatedTargetCostPerKg: number;
  attachmentsCount: number;
}

export interface RdProject {
  id: string;
  projectCode: string;
  projectName: string;
  ideaId?: string;
  projectManager: string;
  team: string[];
  startDate: string;
  targetLaunchDate: string;
  stage: 'Concept' | 'Research' | 'Formula Development' | 'Laboratory Trial' | 'Pilot Batch' | 'Validation' | 'Registration' | 'Commercialization' | 'Mass Production';
  progressPercent: number;
  budgetTotal: number;
  budgetSpent: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  priority: 'High' | 'Medium' | 'Normal';
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  milestonesCount: number;
  completedMilestones: number;
}

export interface FormulaExperiment {
  id: string;
  experimentCode: string;
  projectId: string;
  projectName: string;
  variantName: string;
  version: string;
  chemist: string;
  date: string;
  targetPh: string;
  predictedPh: number;
  actualPh?: number;
  targetViscosity: string;
  predictedViscosity: number;
  actualViscosity?: number;
  stabilityPrediction: 'Excellent (98%)' | 'Stable (92%)' | 'Risk of Separation (65%)';
  costPerKg: number;
  status: 'Draft' | 'Simulated' | 'Submitted for Trial' | 'Approved' | 'Rejected';
  ingredientsCount: number;
  hasAlternativeMaterial: boolean;
  notes: string;
}

export interface LabTrial {
  id: string;
  trialCode: string;
  experimentId: string;
  formulaName: string;
  batchSizeKg: number;
  chemist: string;
  date: string;
  phResult: number;
  viscosityResult: string;
  appearance: string;
  odor: string;
  color: string;
  microbiologyStatus: 'Passed' | 'Pending' | 'Failed';
  stability7Days: 'Passed' | 'Ongoing' | 'Failed';
  failureAnalysis?: string;
  successCriteriaMet: boolean;
  status: 'Passed' | 'Failed' | 'In Progress' | 'Approved for Pilot';
  approvedBy?: string;
}

export interface PilotBatch {
  id: string;
  pilotBatchNumber: string;
  projectId: string;
  projectName: string;
  formulaCode: string;
  scaleFactor: '10 Kg' | '100 Kg' | '500 Kg' | '1000 Kg';
  plannedYieldKg: number;
  actualYieldKg: number;
  yieldEfficiencyPercent: number;
  rawMaterialCost: number;
  qcResult: 'Passed' | 'Pending' | 'Conditional';
  stabilityResult: 'Passed' | 'Ongoing';
  commercialRecommendation: 'Recommended for Mass Production' | 'Minor Adjustment Needed' | 'Reject';
  status: 'In Production' | 'QC Inspection' | 'Passed & Transferred' | 'Hold';
  transferredToMes: boolean;
  transferredToPpic: boolean;
}

export interface PackagingDevelopment {
  id: string;
  packagingCode: string;
  projectId: string;
  productName: string;
  containerType: 'Airless Pump Bottle' | 'Dropper Bottle' | 'Squeeze Tube' | 'Acrylic Jar' | 'Carton Box';
  materialSpec: string;
  capacityMl: number;
  supplierName: string;
  artworkVersion: string;
  barcode: string;
  qrCode: string;
  labelClaims: string[];
  compatibilityTestResult: 'Passed (No Interaction)' | 'Testing' | 'Failed';
  dropTestResult: 'Passed (1.2m Drop)' | 'Pending';
  status: 'Design Phase' | 'Artwork Proofing' | 'Sample Approved' | 'Mass Production Ready';
  approvedBy: string;
}

export interface SampleItem {
  id: string;
  sampleCode: string;
  sampleType: 'Customer Sample' | 'Marketing Sample' | 'Laboratory Sample' | 'Stability Sample' | 'Retention Sample' | 'Reference Sample';
  productName: string;
  recipient: string;
  quantityUnits: number;
  dispatchDate: string;
  trackingNumber: string;
  feedbackStatus: 'Pending Feedback' | 'Approved by Client' | 'Revision Requested';
  clientRating?: number;
  notes: string;
}

export interface CompetitorItem {
  id: string;
  competitorBrand: string;
  productName: string;
  category: string;
  retailPriceIdr: number;
  packSizeMl: number;
  keyIngredients: string[];
  marketingClaims: string[];
  strengths: string;
  weaknesses: string;
  ourAdvantage: string;
}

export interface EcrEcoItem {
  id: string;
  changeNumber: string;
  type: 'ECR (Request)' | 'ECO (Order)';
  title: string;
  impactedProduct: string;
  changeCategory: 'Formula Ingredient' | 'Packaging Design' | 'Specification' | 'Process Temperature';
  requestedBy: string;
  requestDate: string;
  reason: string;
  riskAnalysis: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Executed' | 'Rejected';
  approvedBy?: string;
  revisionVersion: string;
}

export interface RdDocument {
  id: string;
  documentNumber: string;
  title: string;
  category: 'Formula Specification' | 'COA Standard' | 'MSDS / Safety Sheet' | 'Artwork Proof' | 'BPOM Dossier' | 'CPKB Audit';
  version: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Active' | 'Under Revision' | 'Archived';
}

export interface ProductCostingItem {
  id: string;
  productName: string;
  formulaCode: string;
  rawMaterialCostPerKg: number;
  packagingCostPerUnit: number;
  laborCostPerUnit: number;
  machineCostPerUnit: number;
  overheadCostPerUnit: number;
  totalHppPerUnit: number;
  targetSellingPrice: number;
  estimatedMarginPercent: number;
  targetCostMet: boolean;
}

// Initial Mock Data
export const initialRdIdeas: RdIdea[] = [
  {
    id: 'idea-1',
    ideaNumber: 'ID-2026-001',
    title: 'Hydrating Sunscreen Mist SPF 50 PA++++ with Niacinamide 5%',
    description: 'Ultra-lightweight invisible sun mist combining UV protection with skin barrier repair.',
    category: 'Sunscreen',
    businessValue: 'Strategic',
    priority: 'Urgent',
    targetMarket: 'Gen-Z & Professional Women (18-35)',
    createdBy: 'Dr. Audrey Widjaja (Head of R&D)',
    createdAt: '2026-07-10',
    status: 'Approved',
    approvalBy: 'CEO / Board',
    approvalDate: '2026-07-12',
    estimatedTargetCostPerKg: 145000,
    attachmentsCount: 3,
  },
  {
    id: 'idea-2',
    ideaNumber: 'ID-2026-002',
    title: 'Biotic Calming Serum with Centella & Ceramides Complex',
    description: 'Soothing serum targeted for sensitive and acne-prone skin with 99% bio-fermented ingredients.',
    category: 'Skincare',
    businessValue: 'High',
    priority: 'High',
    targetMarket: 'Sensitive Skin Segment',
    createdBy: 'Budi Santoso (Senior Formulator)',
    createdAt: '2026-07-18',
    status: 'In Development',
    approvalBy: 'R&D Committee',
    approvalDate: '2026-07-20',
    estimatedTargetCostPerKg: 185000,
    attachmentsCount: 2,
  },
  {
    id: 'idea-3',
    ideaNumber: 'ID-2026-003',
    title: 'Micro-Exfoliating Scalp Tonic with Salicylic Acid 2%',
    description: 'Leave-on scalp solution preventing anti-dandruff and sebum buildup without stripping moisture.',
    category: 'Haircare',
    businessValue: 'Medium',
    priority: 'Medium',
    targetMarket: 'Salon & Home Care Hair Segment',
    createdBy: 'Siti Rahma (R&D Specialist)',
    createdAt: '2026-08-01',
    status: 'Under Review',
    estimatedTargetCostPerKg: 110000,
    attachmentsCount: 1,
  },
];

export const initialRdProjects: RdProject[] = [
  {
    id: 'proj-1',
    projectCode: 'NPD-2026-088',
    projectName: 'Sunscreen Mist SPF 50 Commercialization',
    ideaId: 'idea-1',
    projectManager: 'Dr. Audrey Widjaja',
    team: ['Dr. Audrey Widjaja', 'Budi Santoso', 'Lestari QC', 'Rian PPIC'],
    startDate: '2026-07-15',
    targetLaunchDate: '2026-10-30',
    stage: 'Pilot Batch',
    progressPercent: 72,
    budgetTotal: 150000000,
    budgetSpent: 98000000,
    riskLevel: 'Low',
    priority: 'High',
    status: 'Active',
    milestonesCount: 8,
    completedMilestones: 6,
  },
  {
    id: 'proj-2',
    projectCode: 'NPD-2026-092',
    projectName: 'Biotic Calming Serum Launch',
    ideaId: 'idea-2',
    projectManager: 'Budi Santoso',
    team: ['Budi Santoso', 'Siti Rahma', 'Lestari QC'],
    startDate: '2026-07-22',
    targetLaunchDate: '2026-11-15',
    stage: 'Formula Development',
    progressPercent: 40,
    budgetTotal: 120000000,
    budgetSpent: 42000000,
    riskLevel: 'Medium',
    priority: 'High',
    status: 'Active',
    milestonesCount: 7,
    completedMilestones: 3,
  },
  {
    id: 'proj-3',
    projectCode: 'NPD-2026-099',
    projectName: 'Vitamin C 15% Glow Ampoule Upgrade',
    projectManager: 'Siti Rahma',
    team: ['Siti Rahma', 'Dr. Audrey Widjaja'],
    startDate: '2026-08-01',
    targetLaunchDate: '2026-12-01',
    stage: 'Laboratory Trial',
    progressPercent: 30,
    budgetTotal: 90000000,
    budgetSpent: 22000000,
    riskLevel: 'Low',
    priority: 'Normal',
    status: 'Active',
    milestonesCount: 6,
    completedMilestones: 2,
  },
];

export const initialFormulaExperiments: FormulaExperiment[] = [
  {
    id: 'exp-101',
    experimentCode: 'EXP-SUN-V3',
    projectId: 'proj-1',
    projectName: 'Sunscreen Mist SPF 50',
    variantName: 'Variant A (Ethanol-free Spray Formulation)',
    version: '3.1',
    chemist: 'Dr. Audrey Widjaja',
    date: '2026-07-28',
    targetPh: '5.8 - 6.4',
    predictedPh: 6.1,
    actualPh: 6.12,
    targetViscosity: '15 - 30 cPs (Water-like spray)',
    predictedViscosity: 22,
    actualViscosity: 21.5,
    stabilityPrediction: 'Excellent (98%)',
    costPerKg: 138500,
    status: 'Approved',
    ingredientsCount: 12,
    hasAlternativeMaterial: true,
    notes: 'Substituted Octocrylene with Ethylhexyl Triazone for higher photostability and zero irritation.',
  },
  {
    id: 'exp-102',
    experimentCode: 'EXP-SER-V1',
    projectId: 'proj-2',
    projectName: 'Biotic Calming Serum',
    variantName: 'Variant B (High Ceramide NP Gel Network)',
    version: '1.2',
    chemist: 'Budi Santoso',
    date: '2026-08-02',
    targetPh: '5.2 - 5.7',
    predictedPh: 5.4,
    actualPh: 5.45,
    targetViscosity: '3500 - 4500 cPs',
    predictedViscosity: 4100,
    actualViscosity: 4250,
    stabilityPrediction: 'Stable (92%)',
    costPerKg: 172000,
    status: 'Submitted for Trial',
    ingredientsCount: 15,
    hasAlternativeMaterial: false,
    notes: 'Optimized lipid bilayer ratio to enhance skin barrier restore speed.',
  },
];

export const initialLabTrials: LabTrial[] = [
  {
    id: 'trial-1',
    trialCode: 'TRL-2026-045',
    experimentId: 'exp-101',
    formulaName: 'Sunscreen Mist SPF 50 (EXP-SUN-V3)',
    batchSizeKg: 5.0,
    chemist: 'Dr. Audrey Widjaja',
    date: '2026-07-30',
    phResult: 6.12,
    viscosityResult: '21.5 cPs',
    appearance: 'Clear transparent pale yellow mist solution',
    odor: 'Subtle fresh flora scent (Halal compliant)',
    color: 'Pale Translucent Yellow',
    microbiologyStatus: 'Passed',
    stability7Days: 'Passed',
    successCriteriaMet: true,
    status: 'Approved for Pilot',
    approvedBy: 'Lestari (QA Manager)',
  },
  {
    id: 'trial-2',
    trialCode: 'TRL-2026-049',
    experimentId: 'exp-102',
    formulaName: 'Biotic Calming Serum (EXP-SER-V1)',
    batchSizeKg: 3.0,
    chemist: 'Budi Santoso',
    date: '2026-08-03',
    phResult: 5.45,
    viscosityResult: '4250 cPs',
    appearance: 'Opal translucent gel serum',
    odor: 'Unfragranced natural botanical aroma',
    color: 'Milky Off-White',
    microbiologyStatus: 'Passed',
    stability7Days: 'Passed',
    successCriteriaMet: true,
    status: 'Passed',
  },
];

export const initialPilotBatches: PilotBatch[] = [
  {
    id: 'pilot-1',
    pilotBatchNumber: 'PLT-2026-008',
    projectId: 'proj-1',
    projectName: 'Sunscreen Mist SPF 50',
    formulaCode: 'EXP-SUN-V3',
    scaleFactor: '100 Kg',
    plannedYieldKg: 100.0,
    actualYieldKg: 98.4,
    yieldEfficiencyPercent: 98.4,
    rawMaterialCost: 13620000,
    qcResult: 'Passed',
    stabilityResult: 'Passed',
    commercialRecommendation: 'Recommended for Mass Production',
    status: 'Passed & Transferred',
    transferredToMes: true,
    transferredToPpic: true,
  },
  {
    id: 'pilot-2',
    pilotBatchNumber: 'PLT-2026-012',
    projectId: 'proj-2',
    projectName: 'Biotic Calming Serum',
    formulaCode: 'EXP-SER-V1',
    scaleFactor: '10 Kg',
    plannedYieldKg: 10.0,
    actualYieldKg: 9.85,
    yieldEfficiencyPercent: 98.5,
    rawMaterialCost: 1694000,
    qcResult: 'Passed',
    stabilityResult: 'Ongoing',
    commercialRecommendation: 'Minor Adjustment Needed',
    status: 'QC Inspection',
    transferredToMes: false,
    transferredToPpic: false,
  },
];

export const initialPackagingDevelopments: PackagingDevelopment[] = [
  {
    id: 'pkg-1',
    packagingCode: 'PKG-BOT-100ML-SPRAY',
    projectId: 'proj-1',
    productName: 'Sunscreen Mist SPF 50 (100ml)',
    containerType: 'Airless Pump Bottle',
    materialSpec: 'PETG Clear Container with Fine Mist Sprayer & PP Cap',
    capacityMl: 100,
    supplierName: 'PT Packaging Indah Utama',
    artworkVersion: 'v2.4 Final',
    barcode: '8997001234567',
    qrCode: 'https://cosmo.ai/verify/8997001234567',
    labelClaims: ['Broad Spectrum SPF 50 PA++++', 'Non-Comedogenic', 'Dermatologically Tested', 'Halal Certified'],
    compatibilityTestResult: 'Passed (No Interaction)',
    dropTestResult: 'Passed (1.2m Drop)',
    status: 'Mass Production Ready',
    approvedBy: 'Dina (Regulatory & Packaging Lead)',
  },
  {
    id: 'pkg-2',
    packagingCode: 'PKG-JAR-30ML-AIRLESS',
    projectId: 'proj-2',
    productName: 'Biotic Calming Serum (30ml)',
    containerType: 'Dropper Bottle',
    materialSpec: 'Frosted Glass Bottle with Rubber Bulb Pipette Dropper',
    capacityMl: 30,
    supplierName: 'PT Global Pack Corp',
    artworkVersion: 'v1.1 Draft',
    barcode: '8997001234888',
    qrCode: 'https://cosmo.ai/verify/8997001234888',
    labelClaims: ['99% Natural Bio-Ferment', 'Barrier Repairing', 'Alcohol-Free', 'BPOM Approved'],
    compatibilityTestResult: 'Passed (No Interaction)',
    dropTestResult: 'Passed (1.2m Drop)',
    status: 'Artwork Proofing',
    approvedBy: 'Dina (Packaging Lead)',
  },
];

export const initialSampleItems: SampleItem[] = [
  {
    id: 'smp-1',
    sampleCode: 'SMP-2026-102',
    sampleType: 'Customer Sample',
    productName: 'Sunscreen Mist SPF 50 (100ml)',
    recipient: 'PT Glow Skin Indonesia (Maklon Client)',
    quantityUnits: 20,
    dispatchDate: '2026-08-01',
    trackingNumber: 'JNE-REG-882910381',
    feedbackStatus: 'Approved by Client',
    clientRating: 5,
    notes: 'Client loves the non-greasy cooling sensation and fast absorption.',
  },
  {
    id: 'smp-2',
    sampleCode: 'SMP-2026-108',
    sampleType: 'Stability Sample',
    productName: 'Biotic Calming Serum (30ml)',
    recipient: 'Internal R&D Stability Chamber (40°C / 75% RH)',
    quantityUnits: 12,
    dispatchDate: '2026-08-03',
    trackingNumber: 'INT-STAB-CAB-02',
    feedbackStatus: 'Pending Feedback',
    notes: 'Accelerated 3-month stability protocol testing.',
  },
];

export const initialCompetitorItems: CompetitorItem[] = [
  {
    id: 'comp-1',
    competitorBrand: 'Brand X Beauty',
    productName: 'Aqua Sunscreen Mist SPF 50',
    category: 'Sunscreen',
    retailPriceIdr: 129000,
    packSizeMl: 80,
    keyIngredients: ['Avobenzone', 'Ethanol 15%', 'Centella Extract'],
    marketingClaims: ['Zero Whitecast', 'Instant Cooling', 'Water Resistant'],
    strengths: 'Strong brand awareness and sleek metallic bottle packaging.',
    weaknesses: 'Contains high alcohol percentage causing sting on dry/sensitive skin.',
    ourAdvantage: 'Our formula is 100% Ethanol-Free with 5% Niacinamide + 3x Ceramides.',
  },
  {
    id: 'comp-2',
    competitorBrand: 'DermaY Bio',
    productName: 'Cica Barrier Repair Serum',
    category: 'Skincare',
    retailPriceIdr: 189000,
    packSizeMl: 30,
    keyIngredients: ['Madecassoside', 'Bifida Ferment', 'Hyaluronic Acid'],
    marketingClaims: ['Instant Relief in 15 min', 'Clinically Tested'],
    strengths: 'Strong clinical backing and dermatologist endorsement.',
    weaknesses: 'High cost per unit (HPP ~Rp 45,000) reducing distributor margin.',
    ourAdvantage: 'Targeted HPP ~Rp 22,500 using optimized local fermentation raw material.',
  },
];

export const initialEcrEcoItems: EcrEcoItem[] = [
  {
    id: 'ecr-1',
    changeNumber: 'ECR-2026-014',
    type: 'ECR (Request)',
    title: 'Substitute Preservative Phenoxyethanol with Halal Pentylene Glycol Natural',
    impactedProduct: 'Sunscreen Mist SPF 50',
    changeCategory: 'Formula Ingredient',
    requestedBy: 'Budi Santoso (R&D Formulator)',
    requestDate: '2026-07-25',
    reason: 'To comply with EU Clean Beauty standard and improve skin mildness rating.',
    riskAnalysis: 'Microbiology challenge test (PET) conducted. Passed completely.',
    status: 'Approved',
    approvedBy: 'Dr. Audrey Widjaja & BPOM Officer',
    revisionVersion: 'v3.1',
  },
  {
    id: 'ecr-2',
    changeNumber: 'ECO-2026-015',
    type: 'ECO (Order)',
    title: 'Update Label Artwork to Add BPOM NA18261700921 and Halal Logo',
    impactedProduct: 'Sunscreen Mist SPF 50',
    changeCategory: 'Packaging Design',
    requestedBy: 'Dina (Regulatory Lead)',
    requestDate: '2026-08-02',
    reason: 'Final BPOM registration approved by Indonesian Food and Drug Authority.',
    riskAnalysis: 'Requires updating print cylinder plates before next bottle mass run.',
    status: 'Executed',
    approvedBy: 'Factory Manager',
    revisionVersion: 'v2.4 Final',
  },
];

export const initialRdDocuments: RdDocument[] = [
  {
    id: 'doc-1',
    documentNumber: 'DOC-RD-SPEC-088',
    title: 'Finished Product Technical Specification - Sunscreen Mist SPF 50',
    category: 'Formula Specification',
    version: '3.1',
    fileSize: '2.4 MB',
    uploadedBy: 'Dr. Audrey Widjaja',
    uploadDate: '2026-08-01',
    status: 'Active',
  },
  {
    id: 'doc-2',
    documentNumber: 'DOC-RD-MSDS-102',
    title: 'Material Safety Data Sheet (MSDS) - Sunscreen Mist Bulk',
    category: 'MSDS / Safety Sheet',
    version: '1.0',
    fileSize: '1.8 MB',
    uploadedBy: 'Siti Rahma',
    uploadDate: '2026-08-02',
    status: 'Active',
  },
  {
    id: 'doc-3',
    documentNumber: 'DOC-RD-BPOM-NA8821',
    title: 'BPOM Approval Certificate NA18261700921',
    category: 'BPOM Dossier',
    version: 'Final Approved',
    fileSize: '4.2 MB',
    uploadedBy: 'Dina Regulatory',
    uploadDate: '2026-08-04',
    status: 'Active',
  },
];

export const initialProductCostings: ProductCostingItem[] = [
  {
    id: 'cost-1',
    productName: 'Sunscreen Mist SPF 50 (100ml)',
    formulaCode: 'EXP-SUN-V3',
    rawMaterialCostPerKg: 138500,
    packagingCostPerUnit: 6800,
    laborCostPerUnit: 1200,
    machineCostPerUnit: 900,
    overheadCostPerUnit: 1100,
    totalHppPerUnit: 23850,
    targetSellingPrice: 119000,
    estimatedMarginPercent: 79.9,
    targetCostMet: true,
  },
  {
    id: 'cost-2',
    productName: 'Biotic Calming Serum (30ml)',
    formulaCode: 'EXP-SER-V1',
    rawMaterialCostPerKg: 172000,
    packagingCostPerUnit: 8500,
    laborCostPerUnit: 1500,
    machineCostPerUnit: 1100,
    overheadCostPerUnit: 1400,
    totalHppPerUnit: 17660,
    targetSellingPrice: 149000,
    estimatedMarginPercent: 88.1,
    targetCostMet: true,
  },
];
