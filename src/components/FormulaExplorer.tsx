import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Bot,
  ChevronRight,
  ChevronDown,
  Calculator,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  Layers,
  ArrowRightLeft,
  Copy,
  History,
  RotateCcw,
  Scale,
  DollarSign,
  PackageCheck,
  Boxes,
  PieChart,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Settings,
  Sliders,
  FileText,
  Download,
  Printer,
  ListTree,
  Lock,
  Unlock,
  Building2,
  Clock,
  Sparkle,
  Zap,
  Tag,
  Share2,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  AlertOctagon,
  Award,
  Factory,
} from 'lucide-react';
import { Formula, FormulaIngredient } from '../types';
import { formatCurrencyIDR } from '../lib/utils';

export interface MultiLevelBomNode {
  id: string;
  level: number; // 0 = Finished Good, 1 = Semi Finished / Primary Packaging, 2 = Raw Material / Secondary Packaging, 3 = Carton
  itemCode: string;
  itemName: string;
  itemType: 'Finished Good' | 'Semi Finished Bulk' | 'Raw Material' | 'Primary Packaging' | 'Secondary Packaging' | 'Tertiary Packaging';
  quantityPerUnit: number;
  uom: string;
  scrapPercentage: number;
  unitCostIDR: number;
  totalCostIDR: number;
  mandatory: boolean;
  alternativeItem?: string;
  children?: MultiLevelBomNode[];
  isExpanded?: boolean;
}

export interface FormulaVersionRecord {
  version: string;
  revision: number;
  status: 'Approved' | 'Under Review' | 'Draft' | 'Obsolete' | 'Archived';
  effectiveDate: string;
  createdBy: string;
  approvedBy?: string;
  changeNotes: string;
  costPerKgIDR: number;
  targetPh: string;
  targetViscosity: string;
}

export interface RecipeStep {
  stepNumber: number;
  phase: 'A' | 'B' | 'C' | 'D' | 'E';
  operationName: string;
  machineEquipment: string;
  targetTemperatureC: number;
  mixingSpeedRpm: number;
  durationMinutes: number;
  pressureBar?: number;
  operatorSkillLevel: 'Standard' | 'Senior Specialist' | 'Master Compounder';
  qcCheckPoint: string;
  safetyInstruction: string;
  cleaningInstruction: string;
}

export interface EcoRequest {
  id: string;
  ecoNumber: string;
  title: string;
  formulaCode: string;
  reason: string;
  requestedBy: string;
  requestDate: string;
  status: 'Pending QA Review' | 'Approved' | 'Rejected' | 'In Testing';
  impactLevel: 'Minor' | 'Major' | 'Critical (BPOM Update)';
}

export const FormulaExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'recipe'
    | 'bom_tree'
    | 'packaging_bom'
    | 'cost_rollup'
    | 'scaling'
    | 'version_compare'
    | 'ai_chemist'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [scaleTargetKg, setScaleTargetKg] = useState<number>(500); // Default 500 Kg Production Batch
  const [useAlternativeMaterials, setUseAlternativeMaterials] = useState<boolean>(false);
  const [customTargetMSRP, setCustomTargetMSRP] = useState<number>(125000);

  // Modals visibility state
  const [showNewFormulaModal, setShowNewFormulaModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [showNewEcoModal, setShowNewEcoModal] = useState(false);
  const [showPrintPreviewModal, setShowPrintPreviewModal] = useState(false);
  const [selectedVersionCompare, setSelectedVersionCompare] = useState<'v1.0' | 'v2.0'>('v2.0');

  // Master Formulas state with full CRUD
  const [formulas, setFormulas] = useState<Formula[]>([
    {
      id: 'FORM-001',
      code: 'FRM-SKN-2026-001',
      name: 'CosmoGlow Intense Brightening Serum 10% Niacinamide',
      category: 'skincare',
      subCategory: 'Facial Serum',
      targetPh: '5.2 - 5.8',
      targetViscosity: '2,500 - 3,500 cPs (Spindle 3, 20 RPM)',
      version: 'v2.0',
      status: 'approved',
      estimatedCostPerKg: 185000,
      bpomCompliant: true,
      stabilityResult: 'passed',
      microbiologyResult: 'passed',
      createdBy: 'Dr. Anita Rahmawati, M.Si (Lead R&D Chemist)',
      updatedAt: '2026-08-01',
      preparationSteps: [
        'Phase A: Timbang Water Purified USP, Glycerin, dan Disodium EDTA. Aduk hingga larut sempurna pada suhu 65°C.',
        'Phase B: Dispersikan Niacinamide USP 99.5% dan Hyaluronic Acid Low Molecular. Aduk dengan High Shear Homogenizer pada 3500 RPM selama 15 menit.',
        'Phase C: Dinginkan hingga 40°C. Tambahkan Centella Asiatica Extract dan Euxyl PE 9010 (Preservative).',
        'Phase D: Atur pH dengan Citric Acid 10% Solution hingga mencapai pH target 5.5 ± 0.2.',
      ],
      ingredients: [
        {
          id: 'ING-101',
          rawMaterialId: 'RM-WAT-001',
          name: 'Aqua / Purified Water USP Grade',
          inciName: 'Aqua',
          percentage: 78.5,
          phase: 'A',
          function: 'Solvent / Base Carrier',
          costPerKg: 3500,
          halalCertified: true,
        },
        {
          id: 'ING-102',
          rawMaterialId: 'RM-ACT-001',
          name: 'Niacinamide USP Grade 99.5%',
          inciName: 'Niacinamide',
          percentage: 10.0,
          phase: 'B',
          function: 'Active Brightening & Skin Barrier Repair',
          costPerKg: 450000,
          bpomMaxLimit: 10.0,
          halalCertified: true,
        },
        {
          id: 'ING-103',
          rawMaterialId: 'RM-ACT-002',
          name: 'Centella Asiatica Leaf Extract Powder 98%',
          inciName: 'Centella Asiatica Leaf Extract',
          percentage: 2.0,
          phase: 'C',
          function: 'Soothing & Anti-Inflammatory Active',
          costPerKg: 1850000,
          bpomMaxLimit: 5.0,
          halalCertified: true,
        },
        {
          id: 'ING-104',
          rawMaterialId: 'RM-ACT-003',
          name: 'Sodium Hyaluronate Multi-Molecular Weight',
          inciName: 'Sodium Hyaluronate',
          percentage: 1.5,
          phase: 'B',
          function: 'Deep Hydration & Humectant',
          costPerKg: 3200000,
          bpomMaxLimit: 3.0,
          halalCertified: true,
        },
        {
          id: 'ING-105',
          rawMaterialId: 'RM-HUM-001',
          name: 'Vegetable Glycerin USP 99.7%',
          inciName: 'Glycerin',
          percentage: 5.0,
          phase: 'A',
          function: 'Humectant & Viscosity Booster',
          costPerKg: 28000,
          halalCertified: true,
        },
        {
          id: 'ING-106',
          rawMaterialId: 'RM-PRS-001',
          name: 'Euxyl PE 9010 (Phenoxyethanol & Ethylhexylglycerin)',
          inciName: 'Phenoxyethanol (and) Ethylhexylglycerin',
          percentage: 1.0,
          phase: 'C',
          function: 'Broad Spectrum Paraben-Free Preservative',
          costPerKg: 280000,
          bpomMaxLimit: 1.0,
          halalCertified: true,
        },
        {
          id: 'ING-107',
          rawMaterialId: 'RM-ADJ-001',
          name: 'Citric Acid 10% Solution (pH Adjuster)',
          inciName: 'Citric Acid',
          percentage: 2.0,
          phase: 'D',
          function: 'pH Buffer & Stabilizer',
          costPerKg: 18000,
          halalCertified: true,
        },
      ],
    },
    {
      id: 'FORM-002',
      code: 'FRM-SKN-2026-002',
      name: 'HydroBarrier Ceramide Moist Gel Cream',
      category: 'skincare',
      subCategory: 'Moisturizer Gel Cream',
      targetPh: '5.5 - 6.2',
      targetViscosity: '18,000 - 22,000 cPs (Spindle 6, 10 RPM)',
      version: 'v1.2',
      status: 'under_review',
      estimatedCostPerKg: 245000,
      bpomCompliant: true,
      stabilityResult: 'ongoing',
      microbiologyResult: 'passed',
      createdBy: 'Budi Santoso, S.Si (R&D Specialist)',
      updatedAt: '2026-08-04',
      preparationSteps: [
        'Phase A: Panaskan Aqua, Glycerin, dan Carbomer 940 hingga 75°C.',
        'Phase B: Leburkan Ceramide NP, Squalane, dan Cetearyl Alcohol pada 75°C.',
        'Phase C: Lakukan proses emulsifikasi Phase B ke Phase A menggunakan Vacuum Emulsifier Tank 1000L.',
        'Phase D: Tambahkan Triethanolamine (TEA) untuk netralisasi gel carbomer pada 45°C.',
      ],
      ingredients: [
        {
          id: 'ING-201',
          rawMaterialId: 'RM-WAT-001',
          name: 'Aqua / Purified Water',
          inciName: 'Aqua',
          percentage: 72.0,
          phase: 'A',
          function: 'Solvent Base',
          costPerKg: 3500,
          halalCertified: true,
        },
        {
          id: 'ING-202',
          rawMaterialId: 'RM-ACT-003',
          name: 'Ceramide NP Complex Pure Powder',
          inciName: 'Ceramide NP',
          percentage: 1.0,
          phase: 'B',
          function: 'Lipid Barrier Repair',
          costPerKg: 12500000,
          bpomMaxLimit: 2.0,
          halalCertified: true,
        },
        {
          id: 'ING-203',
          rawMaterialId: 'RM-EMU-001',
          name: 'Olivem 1000 Natural Emulsifier',
          inciName: 'Cetearyl Olivate (and) Sorbitan Olivate',
          percentage: 4.5,
          phase: 'B',
          function: 'Liquid Crystal Emulsifier',
          costPerKg: 420000,
          halalCertified: true,
        },
        {
          id: 'ING-204',
          rawMaterialId: 'RM-OIL-001',
          name: 'Plant-Derived Squalane 99%',
          inciName: 'Squalane',
          percentage: 8.0,
          phase: 'B',
          function: 'Non-Comedogenic Emollient',
          costPerKg: 650000,
          halalCertified: true,
        },
        {
          id: 'ING-205',
          rawMaterialId: 'RM-HUM-001',
          name: 'Vegetable Glycerin',
          inciName: 'Glycerin',
          percentage: 12.0,
          phase: 'A',
          function: 'Humectant',
          costPerKg: 28000,
          halalCertified: true,
        },
        {
          id: 'ING-206',
          rawMaterialId: 'RM-PRS-001',
          name: 'Euxyl PE 9010',
          inciName: 'Phenoxyethanol',
          percentage: 1.0,
          phase: 'C',
          function: 'Preservative',
          costPerKg: 280000,
          halalCertified: true,
        },
        {
          id: 'ING-207',
          rawMaterialId: 'RM-THI-001',
          name: 'Carbomer 940 Polymer',
          inciName: 'Carbomer',
          percentage: 1.5,
          phase: 'A',
          function: 'Gelling Agent',
          costPerKg: 380000,
          halalCertified: true,
        },
      ],
    },
    {
      id: 'FORM-003',
      code: 'FRM-SUN-2026-003',
      name: 'UV Shield Physical Sunscreen Gel SPF 50+ PA++++',
      category: 'skincare',
      subCategory: 'Sun Protection',
      targetPh: '6.0 - 6.8',
      targetViscosity: '25,000 cPs (Spindle 6, 10 RPM)',
      version: 'v1.0',
      status: 'draft',
      estimatedCostPerKg: 310000,
      bpomCompliant: true,
      stabilityResult: 'ongoing',
      microbiologyResult: 'passed',
      createdBy: 'Dr. Anita Rahmawati, M.Si',
      updatedAt: '2026-08-07',
      preparationSteps: [
        'Phase A: Dispersikan Zinc Oxide Micronized dan Titanium Dioxide dalam C12-15 Alkyl Benzoate.',
        'Phase B: Homogenisasi fase minyak pada 70°C dengan High Shear Rotor Stator.',
        'Phase C: Tambahkan Aqua dan Polysorbate 60. Dinginkan hingga 35°C.',
      ],
      ingredients: [
        {
          id: 'ING-301',
          rawMaterialId: 'RM-WAT-001',
          name: 'Aqua / Purified Water USP',
          inciName: 'Aqua',
          percentage: 55.0,
          phase: 'A',
          function: 'Solvent',
          costPerKg: 3500,
          halalCertified: true,
        },
        {
          id: 'ING-302',
          rawMaterialId: 'RM-SUN-001',
          name: 'Nano Zinc Oxide Dispersion 50%',
          inciName: 'Zinc Oxide',
          percentage: 20.0,
          phase: 'B',
          function: 'UVB/UVA Filter',
          costPerKg: 850000,
          bpomMaxLimit: 25.0,
          halalCertified: true,
        },
        {
          id: 'ING-303',
          rawMaterialId: 'RM-SUN-002',
          name: 'Titanium Dioxide Coated Non-Nano',
          inciName: 'Titanium Dioxide',
          percentage: 10.0,
          phase: 'B',
          function: 'Broad Spectrum Physical Filter',
          costPerKg: 520000,
          bpomMaxLimit: 25.0,
          halalCertified: true,
        },
        {
          id: 'ING-304',
          rawMaterialId: 'RM-OIL-002',
          name: 'C12-15 Alkyl Benzoate Light Ester',
          inciName: 'C12-15 Alkyl Benzoate',
          percentage: 12.0,
          phase: 'B',
          function: 'Pigment Dispersant & Solubilizer',
          costPerKg: 180000,
          halalCertified: true,
        },
        {
          id: 'ING-305',
          rawMaterialId: 'RM-PRS-001',
          name: 'Euxyl PE 9010',
          inciName: 'Phenoxyethanol',
          percentage: 1.0,
          phase: 'C',
          function: 'Preservative',
          costPerKg: 280000,
          halalCertified: true,
        },
        {
          id: 'ING-306',
          rawMaterialId: 'RM-ADJ-001',
          name: 'Tocopheryl Acetate (Vitamin E)',
          inciName: 'Tocopheryl Acetate',
          percentage: 2.0,
          phase: 'C',
          function: 'Antioxidant & Skin Conditioning',
          costPerKg: 750000,
          halalCertified: true,
        },
      ],
    },
  ]);

  const [selectedFormula, setSelectedFormula] = useState<Formula>(formulas[0]);

  // Temporary New Ingredient Form State
  const [newIngredientForm, setNewIngredientForm] = useState<Partial<FormulaIngredient>>({
    phase: 'A',
    name: '',
    inciName: '',
    rawMaterialId: 'RM-NEW-001',
    percentage: 1.0,
    function: '',
    costPerKg: 100000,
    bpomMaxLimit: 5.0,
    halalCertified: true,
  });

  // Temporary New Recipe Step State
  const [newStepForm, setNewStepForm] = useState<Partial<RecipeStep>>({
    phase: 'A',
    operationName: '',
    machineEquipment: 'Mixing Tank A (Vessel 1000L)',
    targetTemperatureC: 60,
    mixingSpeedRpm: 1000,
    durationMinutes: 20,
    operatorSkillLevel: 'Senior Specialist',
    qcCheckPoint: 'Cek Kejernihan & Suhu',
    safetyInstruction: 'Gunakan Alat Pelindung Diri (APD)',
    cleaningInstruction: 'CIP Cleaning Hot Water',
  });

  // Version History Data
  const [versionHistory, setVersionHistory] = useState<FormulaVersionRecord[]>([
    {
      version: 'v2.0',
      revision: 3,
      status: 'Approved',
      effectiveDate: '2026-08-01',
      createdBy: 'Dr. Anita Rahmawati, M.Si',
      approvedBy: 'Hendra Setiawan (VP Quality & Regulatory)',
      changeNotes: 'Substitusi Centella Asiatica dari grade 90% ke grade 98% murni + Penyesuaian preservative system tanpa Paraben.',
      costPerKgIDR: 185000,
      targetPh: '5.2 - 5.8',
      targetViscosity: '3,000 cPs',
    },
    {
      version: 'v1.1',
      revision: 2,
      status: 'Obsolete',
      effectiveDate: '2026-03-15',
      createdBy: 'Budi Santoso, S.Si',
      approvedBy: 'Hendra Setiawan',
      changeNotes: 'Pengurangan persentase Niacinamide dari 12% ke 10% sesuai batas rekomendasi standar klaim BPOM.',
      costPerKgIDR: 210000,
      targetPh: '5.0 - 5.5',
      targetViscosity: '2,800 cPs',
    },
    {
      version: 'v1.0',
      revision: 1,
      status: 'Archived',
      effectiveDate: '2025-11-10',
      createdBy: 'Dr. Anita Rahmawati, M.Si',
      changeNotes: 'Initial R&D Pilot Batch formulation.',
      costPerKgIDR: 225000,
      targetPh: '4.8 - 5.2',
      targetViscosity: '2,200 cPs',
    },
  ]);

  // ECO Requests List
  const [ecoRequests, setEcoRequests] = useState<EcoRequest[]>([
    {
      id: 'ECO-001',
      ecoNumber: 'ECO-2026-089',
      title: 'Upgrade Preservative System Paraben-Free Euxyl PE 9010',
      formulaCode: 'FRM-SKN-2026-001',
      reason: 'Eksport ke pasar UE & ASEAN mensyaratkan Paraben-Free claim.',
      requestedBy: 'Dr. Anita Rahmawati',
      requestDate: '2026-07-28',
      status: 'Approved',
      impactLevel: 'Major',
    },
    {
      id: 'ECO-002',
      ecoNumber: 'ECO-2026-092',
      title: 'Substitusi Supplier Glycerin Impor BASF ke Glycerin Lokal USP',
      formulaCode: 'FRM-SKN-2026-002',
      reason: 'Penghematan HPP IDR 12.500/Kg & Garansi Sertifikasi Halal MUI Lokal.',
      requestedBy: 'Budi Santoso, S.Si',
      requestDate: '2026-08-03',
      status: 'Pending QA Review',
      impactLevel: 'Minor',
    },
  ]);

  // Manufacturing Steps State
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([
    {
      stepNumber: 1,
      phase: 'A',
      operationName: 'Water Phase Preparation & Pre-Heating',
      machineEquipment: 'Mixing Tank A (Vessel 1000L Stainless Steel 316L)',
      targetTemperatureC: 65,
      mixingSpeedRpm: 800,
      durationMinutes: 20,
      pressureBar: 1.0,
      operatorSkillLevel: 'Standard',
      qcCheckPoint: 'Cek Kejernihan & Suhu 65°C ± 2°C',
      safetyInstruction: 'Gunakan Sarung Tangan Tahan Panas & Kacamata Safety',
      cleaningInstruction: 'CIP Clean In Place Hot Water 85°C Selesai Batch',
    },
    {
      stepNumber: 2,
      phase: 'B',
      operationName: 'Active Ingredient Dispersal & High Shear Homogenization',
      machineEquipment: 'High Shear Silverson Homogenizer 3500 RPM',
      targetTemperatureC: 60,
      mixingSpeedRpm: 3500,
      durationMinutes: 15,
      operatorSkillLevel: 'Senior Specialist',
      qcCheckPoint: 'Cek Keterlarutan Niacinamide Powder (Tidak Boleh Ada Gruntil / Clump)',
      safetyInstruction: 'Gunakan Masker Respirator Powder N95',
      cleaningInstruction: 'Sanitasi Alkohol 70% Spray Vessel',
    },
    {
      stepNumber: 3,
      phase: 'C',
      operationName: 'Cooling & Temperature-Sensitive Active Addition',
      machineEquipment: 'Jacket Cooling Vessel & Vacuum Degasser',
      targetTemperatureC: 40,
      mixingSpeedRpm: 1200,
      durationMinutes: 30,
      pressureBar: -0.8,
      operatorSkillLevel: 'Senior Specialist',
      qcCheckPoint: 'Cek Bubble Free Vacuum Degassing Status',
      safetyInstruction: 'Awas Tekanan Vakum Vessel',
      cleaningInstruction: 'Pembersihan Filter In-line 100 Mesh',
    },
    {
      stepNumber: 4,
      phase: 'D',
      operationName: 'pH Adjustment & Final Bulk QC Sampling',
      machineEquipment: 'Auxiliary Agitator Tank & In-line Digital pH Meter',
      targetTemperatureC: 30,
      mixingSpeedRpm: 500,
      durationMinutes: 10,
      operatorSkillLevel: 'Master Compounder',
      qcCheckPoint: 'Sampling In-Process QC: Target pH 5.5 ± 0.2, Viskositas 3,000 cPs',
      safetyInstruction: 'Gunakan Apron Asam/Basa Saat Handling Citric Acid',
      cleaningInstruction: 'Bilas Purified Water',
    },
  ]);

  // Recursive Multi-Level BOM Tree
  const [multiLevelBomData, setMultiLevelBomData] = useState<MultiLevelBomNode>({
    id: 'BOM-FG-001',
    level: 0,
    itemCode: 'FG-SRM-001',
    itemName: 'CosmoGlow Intense Brightening Serum 30ml (Retail Finished Good Unit)',
    itemType: 'Finished Good',
    quantityPerUnit: 1,
    uom: 'Pcs',
    scrapPercentage: 0.5,
    unitCostIDR: 18850,
    totalCostIDR: 18850,
    mandatory: true,
    isExpanded: true,
    children: [
      {
        id: 'BOM-SF-001',
        level: 1,
        itemCode: 'SF-BULK-001',
        itemName: 'Bulk Serum Phase CosmoGlow (Liquid Formulation)',
        itemType: 'Semi Finished Bulk',
        quantityPerUnit: 0.0305, // 30.5 gram per bottle
        uom: 'Kg',
        scrapPercentage: 1.5,
        unitCostIDR: 185000,
        totalCostIDR: 5642.5,
        mandatory: true,
        isExpanded: true,
        children: [
          {
            id: 'BOM-RM-101',
            level: 2,
            itemCode: 'RM-ACT-001',
            itemName: 'Niacinamide USP Grade 99.5%',
            itemType: 'Raw Material',
            quantityPerUnit: 0.00305, // 10%
            uom: 'Kg',
            scrapPercentage: 0.5,
            unitCostIDR: 450000,
            totalCostIDR: 1372.5,
            mandatory: true,
            alternativeItem: 'RM-ACT-001-ALT (Niacinamide PC Merck Germany)',
          },
          {
            id: 'BOM-RM-102',
            level: 2,
            itemCode: 'RM-ACT-002',
            itemName: 'Centella Asiatica Leaf Extract Powder 98%',
            itemType: 'Raw Material',
            quantityPerUnit: 0.00061, // 2%
            uom: 'Kg',
            scrapPercentage: 1.0,
            unitCostIDR: 1850000,
            totalCostIDR: 1128.5,
            mandatory: true,
          },
          {
            id: 'BOM-RM-103',
            level: 2,
            itemCode: 'RM-WAT-001',
            itemName: 'Aqua Purified Water USP',
            itemType: 'Raw Material',
            quantityPerUnit: 0.02394, // 78.5%
            uom: 'Kg',
            scrapPercentage: 2.0,
            unitCostIDR: 3500,
            totalCostIDR: 83.8,
            mandatory: true,
          },
        ],
      },
      {
        id: 'BOM-PKG-001',
        level: 1,
        itemCode: 'PKG-BTL-30ML',
        itemName: 'Botol Kaca Frost White 30ml + Dropper Pipet Gold Assembly',
        itemType: 'Primary Packaging',
        quantityPerUnit: 1,
        uom: 'Pcs',
        scrapPercentage: 1.0,
        unitCostIDR: 8500,
        totalCostIDR: 8500,
        mandatory: true,
        alternativeItem: 'PKG-BTL-30ML-CLR (Clear Glass Alternative)',
      },
      {
        id: 'BOM-PKG-002',
        level: 1,
        itemCode: 'PKG-BOX-30ML',
        itemName: 'Inner Box Soft Touch Emboss Gold Foil 30ml',
        itemType: 'Secondary Packaging',
        quantityPerUnit: 1,
        uom: 'Pcs',
        scrapPercentage: 2.0,
        unitCostIDR: 2800,
        totalCostIDR: 2800,
        mandatory: true,
      },
      {
        id: 'BOM-PKG-003',
        level: 1,
        itemCode: 'PKG-LBL-HOL',
        itemName: 'Stiker Hologram BPOM Security Seal',
        itemType: 'Secondary Packaging',
        quantityPerUnit: 1,
        uom: 'Pcs',
        scrapPercentage: 1.0,
        unitCostIDR: 350,
        totalCostIDR: 350,
        mandatory: true,
      },
      {
        id: 'BOM-PKG-004',
        level: 1,
        itemCode: 'PKG-CTN-MSR',
        itemName: 'Outer Master Carton Double Wall Corrugated (Isi 100 Pcs)',
        itemType: 'Tertiary Packaging',
        quantityPerUnit: 0.01, // 1/100
        uom: 'Pcs',
        scrapPercentage: 0.5,
        unitCostIDR: 15500,
        totalCostIDR: 155,
        mandatory: true,
      },
    ],
  });

  // Calculate live formula percentage & raw material cost
  const totalFormulaPercentage = selectedFormula.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  const rawMaterialCostPerKg = selectedFormula.ingredients.reduce(
    (sum, ing) => sum + (ing.percentage / 100) * ing.costPerKg,
    0
  );

  // Packaging and Factory Overhead Standard Cost
  const primaryPackagingCost = useAlternativeMaterials ? 7800 : 8500;
  const secondaryPackagingCost = 2800 + 350; // Inner Box + Hologram
  const tertiaryPackagingCost = 155; // Carton per unit
  const packagingCostPerUnit = primaryPackagingCost + secondaryPackagingCost + tertiaryPackagingCost;

  const directLaborCostPerUnit = 850;
  const machinePowerDepreciationPerUnit = 450;
  const overheadFactoryPerUnit = 600;

  const bulkCostPerUnit30g = rawMaterialCostPerKg * 0.0305;
  const totalCostRollupUnit =
    bulkCostPerUnit30g + packagingCostPerUnit + directLaborCostPerUnit + machinePowerDepreciationPerUnit + overheadFactoryPerUnit;

  const profitMarginPercent = ((customTargetMSRP - totalCostRollupUnit) / customTargetMSRP) * 100;

  // Handlers for Ingredient CRUD
  const handleAddIngredient = () => {
    if (!newIngredientForm.name || !newIngredientForm.percentage) {
      alert('Mohon isi nama bahan baku dan persentase!');
      return;
    }

    const createdIng: FormulaIngredient = {
      id: `ING-${Date.now()}`,
      rawMaterialId: newIngredientForm.rawMaterialId || 'RM-NEW-001',
      name: newIngredientForm.name,
      inciName: newIngredientForm.inciName || newIngredientForm.name,
      percentage: Number(newIngredientForm.percentage),
      phase: (newIngredientForm.phase as any) || 'A',
      function: newIngredientForm.function || 'Active Ingredient',
      costPerKg: Number(newIngredientForm.costPerKg) || 50000,
      bpomMaxLimit: newIngredientForm.bpomMaxLimit ? Number(newIngredientForm.bpomMaxLimit) : undefined,
      halalCertified: Boolean(newIngredientForm.halalCertified),
    };

    const updatedIngredients = [...selectedFormula.ingredients, createdIng];
    const updatedForm = { ...selectedFormula, ingredients: updatedIngredients };

    setSelectedFormula(updatedForm);
    setFormulas(formulas.map((f) => (f.id === selectedFormula.id ? updatedForm : f)));
    setShowAddIngredientModal(false);

    // Reset form
    setNewIngredientForm({
      phase: 'A',
      name: '',
      inciName: '',
      rawMaterialId: `RM-${Math.floor(Math.random() * 900 + 100)}`,
      percentage: 1.0,
      function: '',
      costPerKg: 100000,
      bpomMaxLimit: 5.0,
      halalCertified: true,
    });
  };

  const handleDeleteIngredient = (ingId: string) => {
    if (selectedFormula.ingredients.length <= 1) {
      alert('Formula harus memiliki setidaknya 1 bahan baku!');
      return;
    }
    const updatedIngs = selectedFormula.ingredients.filter((i) => i.id !== ingId);
    const updatedForm = { ...selectedFormula, ingredients: updatedIngs };

    setSelectedFormula(updatedForm);
    setFormulas(formulas.map((f) => (f.id === selectedFormula.id ? updatedForm : f)));
  };

  const handleUpdateIngredientPercentage = (ingId: string, newPct: number) => {
    const updatedIngs = selectedFormula.ingredients.map((ing) =>
      ing.id === ingId ? { ...ing, percentage: newPct } : ing
    );
    const updatedForm = { ...selectedFormula, ingredients: updatedIngs };

    setSelectedFormula(updatedForm);
    setFormulas(formulas.map((f) => (f.id === selectedFormula.id ? updatedForm : f)));
  };

  // Handlers for Recipe Steps CRUD
  const handleAddRecipeStep = () => {
    if (!newStepForm.operationName) {
      alert('Mohon isi nama operasi pembuatan!');
      return;
    }

    const createdStep: RecipeStep = {
      stepNumber: recipeSteps.length + 1,
      phase: (newStepForm.phase as any) || 'A',
      operationName: newStepForm.operationName,
      machineEquipment: newStepForm.machineEquipment || 'Mixing Tank 1000L',
      targetTemperatureC: Number(newStepForm.targetTemperatureC) || 25,
      mixingSpeedRpm: Number(newStepForm.mixingSpeedRpm) || 500,
      durationMinutes: Number(newStepForm.durationMinutes) || 15,
      pressureBar: newStepForm.pressureBar ? Number(newStepForm.pressureBar) : undefined,
      operatorSkillLevel: (newStepForm.operatorSkillLevel as any) || 'Standard',
      qcCheckPoint: newStepForm.qcCheckPoint || 'Visual Check',
      safetyInstruction: newStepForm.safetyInstruction || 'APD Standard',
      cleaningInstruction: newStepForm.cleaningInstruction || 'CIP Cleaning',
    };

    setRecipeSteps([...recipeSteps, createdStep]);
    setShowAddStepModal(false);
  };

  // Handlers for AI Assistant actions
  const handleApplyAiOptimization = () => {
    // Optimize Glycerin substitution & active scaling
    const optimizedIngs = selectedFormula.ingredients.map((ing) => {
      if (ing.name.includes('Glycerin')) {
        return { ...ing, name: 'Vegetable Glycerin USP Oleo (Lokal Halal)', costPerKg: 18000 };
      }
      return ing;
    });

    const updatedForm = {
      ...selectedFormula,
      ingredients: optimizedIngs,
      estimatedCostPerKg: 172500,
    };

    setSelectedFormula(updatedForm);
    setFormulas(formulas.map((f) => (f.id === selectedFormula.id ? updatedForm : f)));
    alert('✨ AI Chemist: Substitusi bahan Glycerin Lokal berhasil diterapkan! HPP/Kg berkurang IDR 12.500/Kg.');
  };

  const filteredFormulas = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 text-slate-100">
      {/* Module Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-300 text-slate-950 shadow-xl ring-2 ring-emerald-400/40">
                <FlaskConical className="h-7 w-7 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Formula Management & Multi-Level BOM Enterprise
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                    Cosmetics R&D Lab & Costing
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  R&D Recipe Control, Phase Staging, Recursive Multi-Level BOM, Batch Production Scaling, Cost Rollup & AI Chemist Assistant.
                </p>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowNewFormulaModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg ring-1 ring-emerald-300/50"
              id="btn-new-formula"
            >
              <Plus className="h-4 w-4 font-bold" />
              <span>Buat Master Formula Baru</span>
            </button>

            <button
              onClick={() => setShowPrintPreviewModal(true)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-500 transition-all"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>Cetak Formula Master Sheet</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_chemist')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3.5 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Chemist Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* R&D KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total Formula R&D</span>
            <FlaskConical className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">{formulas.length} Master</p>
          <p className="text-[10px] text-slate-400">18 Approved • 4 Review • 2 Draft</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Estimasi HPP Bulk / Kg</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-black font-mono text-cyan-300">
            {formatCurrencyIDR(rawMaterialCostPerKg)}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">↓ -3.4% Cost Optimization</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Total COGS / Unit</span>
            <Calculator className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-xl font-black font-mono text-indigo-300">
            {formatCurrencyIDR(totalCostRollupUnit)}
          </p>
          <p className="text-[10px] text-slate-400">Bulk + Packaging + Labor</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Gross Margin Target</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">
            {profitMarginPercent.toFixed(1)}%
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">MSRP {formatCurrencyIDR(customTargetMSRP)}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Komposisi Validator</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-emerald-300">
            {totalFormulaPercentage.toFixed(1)}%
          </p>
          <p className={`text-[10px] font-semibold ${totalFormulaPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {totalFormulaPercentage === 100 ? '✓ Exact 100.0% Validated' : '⚠️ Adjust Percentage'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>BPOM Regulation</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black font-mono text-white">100% Passed</p>
          <p className="text-[10px] text-slate-400">0 Limit Violations</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold custom-scrollbar scroll-smooth touch-pan-x pb-1"
      >
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Formula Master & Live Editor</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recipe')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'recipe'
              ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Recipe & Manufacturing Steps</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bom_tree')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'bom_tree'
              ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ListTree className="h-4 w-4" />
          <span>Multi-Level BOM Hierarchy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('packaging_bom')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'packaging_bom'
              ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Packaging BOM Specs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cost_rollup')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'cost_rollup'
              ? 'bg-amber-600/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>BOM Cost Rollup & Margin</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scaling')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'scaling'
              ? 'bg-teal-600/20 text-teal-300 border-b-2 border-teal-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Batch Scaling Calculator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('version_compare')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'version_compare'
              ? 'bg-rose-600/20 text-rose-300 border-b-2 border-rose-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>ECO & Version Compare</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_chemist')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'ai_chemist'
              ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>AI Chemist Copilot</span>
        </button>
      </div>

      {/* TAB 1: FORMULA MASTER & LIVE INGREDIENTS EDITOR */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Formula Selector Panel */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari formula, kode, atau INCI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredFormulas.map((f) => {
                const isSelected = selectedFormula.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormula(f)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-gradient-to-r from-slate-900 to-emerald-950/60 shadow-lg ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-amber-400">{f.code}</span>
                      <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {f.version}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{f.name}</h3>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Kategori: {f.category}</span>
                      <span className="font-bold text-emerald-300">
                        {formatCurrencyIDR(f.estimatedCostPerKg)} / Kg
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
                      <span className="text-slate-500">{f.createdBy.split('(')[0]}</span>
                      <span className="text-emerald-400 font-bold uppercase">✓ BPOM Compliant</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Formula Live Composition & Specification Editor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                      {selectedFormula.code}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      Versi {selectedFormula.version}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30 uppercase">
                      {selectedFormula.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-2">{selectedFormula.name}</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAddIngredientModal(true)}
                    className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Bahan</span>
                  </button>
                </div>
              </div>

              {/* Technical Specifications Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Target pH Range:</span>
                  <span className="font-bold text-white">{selectedFormula.targetPh}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Target Viskositas:</span>
                  <span className="font-bold text-white">{selectedFormula.targetViscosity}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">HPP Formulasi Bulk:</span>
                  <span className="font-bold text-emerald-300">
                    {formatCurrencyIDR(rawMaterialCostPerKg)} / Kg
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Validasi Komposisi:</span>
                  <span
                    className={`font-bold ${
                      totalFormulaPercentage === 100 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {totalFormulaPercentage.toFixed(2)}% {totalFormulaPercentage === 100 ? '✓ (Valid)' : '⚠️ Check'}
                  </span>
                </div>
              </div>

              {/* Composition Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">Total Formulasi Komposisi INCI</span>
                  <span className="text-emerald-400 font-black">{totalFormulaPercentage.toFixed(2)}% / 100.00%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex ring-1 ring-slate-800">
                  {selectedFormula.ingredients.map((ing, idx) => {
                    const colors = [
                      'bg-emerald-500',
                      'bg-teal-400',
                      'bg-indigo-500',
                      'bg-cyan-400',
                      'bg-amber-400',
                      'bg-purple-500',
                      'bg-rose-400',
                    ];
                    return (
                      <div
                        key={ing.id}
                        style={{ width: `${ing.percentage}%` }}
                        className={`h-full ${colors[idx % colors.length]} transition-all`}
                        title={`${ing.name}: ${ing.percentage}%`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ingredients Staging Table with Live Percentage Adjuster */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Rincian Bahan Baku & Phase Staging INCI</h3>
                  <p className="text-xs text-slate-400">Atur komposisi persentase, fase penimbangan, cost per Kg, dan sertifikasi Halal/BPOM</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                      <th className="p-3">Fase</th>
                      <th className="p-3">Nama Bahan & Code</th>
                      <th className="p-3">Nama Resmi INCI</th>
                      <th className="p-3">Komposisi (%)</th>
                      <th className="p-3">Fungsi Formulasi</th>
                      <th className="p-3">Harga / Kg</th>
                      <th className="p-3">BPOM Limit</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedFormula.ingredients.map((ing) => (
                      <tr key={ing.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-bold text-amber-400">
                          <span className="w-7 h-7 rounded-full bg-amber-950 border border-amber-500/40 inline-flex items-center justify-center font-black">
                            {ing.phase}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          <div>{ing.name}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{ing.rawMaterialId}</span>
                        </td>
                        <td className="p-3 text-slate-300 italic">{ing.inciName}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              step="0.1"
                              value={ing.percentage}
                              onChange={(e) => handleUpdateIngredientPercentage(ing.id, parseFloat(e.target.value) || 0)}
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-black text-emerald-300 focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-slate-400 font-bold">%</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-400">{ing.function}</td>
                        <td className="p-3 font-bold text-cyan-300">{formatCurrencyIDR(ing.costPerKg)}</td>
                        <td className="p-3">
                          {ing.bpomMaxLimit ? (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                                ing.percentage > ing.bpomMaxLimit
                                  ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                                  : 'bg-indigo-950 text-indigo-300 border-indigo-500/30'
                              }`}
                            >
                              Max {ing.bpomMaxLimit}% {ing.percentage > ing.bpomMaxLimit && '⚠️ Over!'}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Unrestricted</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteIngredient(ing.id)}
                            className="p-1.5 rounded bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Hapus Bahan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECIPE & MANUFACTURING STEPS */}
      {activeSubTab === 'recipe' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Prosedur Instruksi Pembuatan Batch (Manufacturing Recipe Control)</h2>
              <p className="text-xs text-slate-400">
                Langkah Operasional mixing, pengontrolan RPM mixer, temperatur vessel, tekanan vacuum, skill operator, K3 & QC checkpoint.
              </p>
            </div>
            <button
              onClick={() => setShowAddStepModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Langkah Instruksi</span>
            </button>
          </div>

          <div className="space-y-4">
            {recipeSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                      #{step.stepNumber}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">{step.operationName}</h3>
                      <p className="text-xs text-indigo-300 font-mono">Fase {step.phase} • Mesin: {step.machineEquipment}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 font-mono">
                    Skill Requirement: {step.operatorSkillLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Suhu Vessel Target:</span>
                    <span className="font-bold text-rose-300">{step.targetTemperatureC} °C</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Kecepatan Homogenizer:</span>
                    <span className="font-bold text-cyan-300">{step.mixingSpeedRpm} RPM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Durasi Pengadukan:</span>
                    <span className="font-bold text-amber-300">{step.durationMinutes} Menit</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Tekanan Vessel:</span>
                    <span className="font-bold text-purple-300">{step.pressureBar ? `${step.pressureBar} Bar (Vacuum)` : 'Atmosferik'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">QC CHECKPOINT IN-PROCESS:</span>
                    <p className="text-slate-200">{step.qcCheckPoint}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">INSTRUKSI KESELAMATAN (K3):</span>
                    <p className="text-slate-200">{step.safetyInstruction}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-teal-400 uppercase">SANITASI MESIN (SANITATION):</span>
                    <p className="text-slate-200">{step.cleaningInstruction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-LEVEL BOM HIERARCHY */}
      {activeSubTab === 'bom_tree' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Eksplorasi Bill of Materials Bertingkat (Multi-Level BOM Hierarchy)</h2>
              <p className="text-xs text-slate-400">
                Struktur Rekursif Tanpa Batas Level: Retail Finished Good → Primary Packaging & Bulk Phase → Raw Ingredients & Outer Carton.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUseAlternativeMaterials(!useAlternativeMaterials)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  useAlternativeMaterials
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {useAlternativeMaterials ? '⚠️ Alternative Materials Active' : 'Use Primary Materials'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              BOM Tree Explosion: {multiLevelBomData.itemCode} ({multiLevelBomData.itemName})
            </h3>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Hierarchy / Level</th>
                    <th className="p-3">Kode Item & Nama Material</th>
                    <th className="p-3">Tipe Item</th>
                    <th className="p-3">Qty per Unit FG</th>
                    <th className="p-3">Scrap %</th>
                    <th className="p-3">Cost per Unit</th>
                    <th className="p-3">Subtotal Cost (IDR)</th>
                    <th className="p-3">Status Material</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {/* Level 0 Finished Good */}
                  <tr className="bg-slate-900/90 font-bold">
                    <td className="p-3 text-emerald-400">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-[10px]">
                        LEVEL 0
                      </span>
                    </td>
                    <td className="p-3 text-white">{multiLevelBomData.itemName} ({multiLevelBomData.itemCode})</td>
                    <td className="p-3 text-emerald-300">{multiLevelBomData.itemType}</td>
                    <td className="p-3">1 Pcs</td>
                    <td className="p-3">{multiLevelBomData.scrapPercentage}%</td>
                    <td className="p-3">{formatCurrencyIDR(multiLevelBomData.unitCostIDR)}</td>
                    <td className="p-3 font-black text-emerald-300">{formatCurrencyIDR(totalCostRollupUnit)}</td>
                    <td className="p-3 text-emerald-400">Primary Assembly</td>
                  </tr>

                  {/* Level 1 Children */}
                  {multiLevelBomData.children?.map((child1) => (
                    <React.Fragment key={child1.id}>
                      <tr className="hover:bg-slate-900/40 font-semibold text-slate-200">
                        <td className="p-3 pl-8 text-cyan-400">
                          └── <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px]">LEVEL 1</span>
                        </td>
                        <td className="p-3 text-white font-bold">{child1.itemName} ({child1.itemCode})</td>
                        <td className="p-3 text-cyan-300">{child1.itemType}</td>
                        <td className="p-3 font-mono">{child1.quantityPerUnit} {child1.uom}</td>
                        <td className="p-3">{child1.scrapPercentage}%</td>
                        <td className="p-3">{formatCurrencyIDR(child1.unitCostIDR)}</td>
                        <td className="p-3 font-bold text-cyan-300">{formatCurrencyIDR(child1.totalCostIDR)}</td>
                        <td className="p-3 text-slate-400">
                          {child1.mandatory ? 'Mandatory' : 'Optional'}
                        </td>
                      </tr>

                      {/* Level 2 Children */}
                      {child1.children?.map((child2) => (
                        <tr key={child2.id} className="hover:bg-slate-900/20 text-slate-300 text-[11px]">
                          <td className="p-3 pl-16 text-amber-400">
                            └─── <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-[10px]">LEVEL 2</span>
                          </td>
                          <td className="p-3 font-bold text-slate-200">{child2.itemName} ({child2.itemCode})</td>
                          <td className="p-3 text-amber-300">{child2.itemType}</td>
                          <td className="p-3 font-mono">{child2.quantityPerUnit} {child2.uom}</td>
                          <td className="p-3">{child2.scrapPercentage}%</td>
                          <td className="p-3">{formatCurrencyIDR(child2.unitCostIDR)}</td>
                          <td className="p-3 font-bold text-amber-300">{formatCurrencyIDR(child2.totalCostIDR)}</td>
                          <td className="p-3 text-slate-400">
                            {child2.alternativeItem ? (
                              <span className="text-amber-400 text-[10px] underline" title={child2.alternativeItem}>
                                ⚠️ Has Alt Material
                              </span>
                            ) : (
                              'Single Source'
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PACKAGING BOM SPECS */}
      {activeSubTab === 'packaging_bom' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Packaging Bill of Materials & Spesifikasi Material</h2>
              <p className="text-xs text-slate-400">
                Spesifikasi Kemasan Primer (Botol/Pump/Tube), Sekunder (Inner Box/Stiker Seal), & Tersier (Outer Carton/Pallet Shrink).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-purple-300">Kemasan Primer</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40 font-mono">
                  Bottle & Pipette
                </span>
              </div>
              <p className="text-xs font-bold text-white">Botol Kaca Frost White 30ml</p>
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <p>Material: Borosilicate Glass Class I</p>
                <p>Dropper: Gold Anodized Aluminum Cap</p>
                <p>Supplier: PT Packaging Nusantara</p>
                <p className="text-purple-300 font-bold">Harga: IDR 8,500 / Pcs</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-indigo-300">Kemasan Sekunder</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 font-mono">
                  Inner Box
                </span>
              </div>
              <p className="text-xs font-bold text-white">Inner Box Soft Touch Gold Foil 30ml</p>
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <p>Kertas: Ivory Card 350 gsm FSC Certified</p>
                <p>Finishing: Matte Soft Touch + Foil Stamping</p>
                <p>Supplier: PT Cetak Indah Makmur</p>
                <p className="text-indigo-300 font-bold">Harga: IDR 2,800 / Pcs</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-amber-300">Segel Security</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                  Hologram BPOM
                </span>
              </div>
              <p className="text-xs font-bold text-white">Stiker Hologram BPOM & QR Authenticity</p>
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <p>Material: Tamper Evident Void Film</p>
                <p>Fitur: Unique Serial Number QR</p>
                <p>Supplier: PT Security Print Indonesia</p>
                <p className="text-amber-300 font-bold">Harga: IDR 350 / Pcs</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-cyan-300">Kemasan Tersier</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 font-mono">
                  Master Carton
                </span>
              </div>
              <p className="text-xs font-bold text-white">Karton Master Box Double Wall (Isi 100)</p>
              <div className="space-y-1 text-[11px] font-mono text-slate-400">
                <p>Spesifikasi: K200/M125/K200 Flute BC</p>
                <p>Kapasitas: 100 Botol Retail</p>
                <p>Supplier: PT Karton Box Utama</p>
                <p className="text-cyan-300 font-bold">Harga: IDR 15,500 / Carton</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BOM COST ROLLUP & MARGIN */}
      {activeSubTab === 'cost_rollup' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Kalkulator Cost Rollup & Analisis Profit Margin Unit</h2>
              <p className="text-xs text-slate-400">
                Akurasi Akuntansi Manufaktur: Akumulasi Raw Material Bulk + Packaging + Tenaga Kerja Langsung + Depresiasi Mesin + Factory Overhead.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Breakdown Waterfall Card */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Rincian Akumulasi Biaya Per Unit (Cost Rollup Waterfall)
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">1. Formulasi Bulk Liquid (30.5 Gram)</span>
                  </div>
                  <span className="font-bold text-emerald-300">{formatCurrencyIDR(bulkCostPerUnit30g)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="font-bold text-white">2. Total Kemasan (Botol + Box + Hologram + Karton)</span>
                  </div>
                  <span className="font-bold text-purple-300">{formatCurrencyIDR(packagingCostPerUnit)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-400" />
                    <span className="font-bold text-white">3. Upah Tenaga Kerja Langsung (Direct Labor)</span>
                  </div>
                  <span className="font-bold text-indigo-300">{formatCurrencyIDR(directLaborCostPerUnit)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="font-bold text-white">4. Listrik & Depresiasi Mesin (Machine Power)</span>
                  </div>
                  <span className="font-bold text-amber-300">{formatCurrencyIDR(machinePowerDepreciationPerUnit)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white">5. Overhead Pabrik & Quality Control</span>
                  </div>
                  <span className="font-bold text-cyan-300">{formatCurrencyIDR(overheadFactoryPerUnit)}</span>
                </div>

                {/* Grand Total Row */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-sm font-black">
                  <span className="text-emerald-300">TOTAL HPP PRODUKSI JADI (COGS PER UNIT)</span>
                  <span className="text-white text-base">{formatCurrencyIDR(totalCostRollupUnit)}</span>
                </div>
              </div>
            </div>

            {/* Profitability & MSRP Simulation Card */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Simulasi Pricing & Margin Target</h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Target Harga Jual Konsumen (MSRP IDR):</label>
                  <input
                    type="number"
                    value={customTargetMSRP}
                    onChange={(e) => setCustomTargetMSRP(Number(e.target.value) || 125000)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-bold text-emerald-300 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Laba Kotor (Gross Margin / Unit):</span>
                    <strong className="text-emerald-400">{formatCurrencyIDR(customTargetMSRP - totalCostRollupUnit)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Persentase Profit Margin:</span>
                    <strong className="text-emerald-300 font-black">{profitMarginPercent.toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Multiples Mark-Up (Price / COGS):</span>
                    <strong className="text-indigo-300">{(customTargetMSRP / totalCostRollupUnit).toFixed(2)}x</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-slate-300">
                  💡 <strong>Analisis R&D Chemist:</strong> Margin produk sebesar {profitMarginPercent.toFixed(1)}% tergolong sangat sehat untuk kategori skincare premium (benchmark &gt; 70%).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BATCH SCALING CALCULATOR */}
      {activeSubTab === 'scaling' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white">Kalkulator Automatic Scaling Formulasi Batch Produksi</h2>
            <p className="text-xs text-slate-400">
              Konversi otomatis dari Skala Laboratorium (1 Kg) → Pilot Scale (50 Kg) → Skala Komersial (500 Kg / 1000 Kg) dengan kompensasi wall loss factor (+1.5%).
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs text-slate-300 font-bold">Pilih Target Ukuran Batch Produksi:</span>
              <button
                onClick={() => setScaleTargetKg(50)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  scaleTargetKg === 50 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                50 Kg (Pilot Vessel V-101)
              </button>
              <button
                onClick={() => setScaleTargetKg(500)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  scaleTargetKg === 500 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                500 Kg (Commercial Tank V-202)
              </button>
              <button
                onClick={() => setScaleTargetKg(1000)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  scaleTargetKg === 1000 ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                1,000 Kg (Large Emulsifier Tank V-305)
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Hasil Penimbangan Kuantitas Bahan Baku untuk Batch {scaleTargetKg.toLocaleString()} Kg
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/40">
                Estimasi Total Biaya Bahan Bulk: {formatCurrencyIDR(rawMaterialCostPerKg * scaleTargetKg)}
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                    <th className="p-3">Fase</th>
                    <th className="p-3">Nama Bahan Baku</th>
                    <th className="p-3">Persentase (%)</th>
                    <th className="p-3">Kebutuhan Netto (Kg)</th>
                    <th className="p-3">Kompensasi Wall Loss (+1.5%)</th>
                    <th className="p-3">Total Timbang (Kg)</th>
                    <th className="p-3">Nilai Bahan IDR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedFormula.ingredients.map((ing) => {
                    const nettoKg = (ing.percentage / 100) * scaleTargetKg;
                    const grossKg = nettoKg * 1.015;
                    const ingredientCostTotal = grossKg * ing.costPerKg;
                    return (
                      <tr key={ing.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-amber-400">{ing.phase}</td>
                        <td className="p-3 font-bold text-white">{ing.name}</td>
                        <td className="p-3 font-black text-emerald-300">{ing.percentage}%</td>
                        <td className="p-3 text-slate-200">{nettoKg.toFixed(2)} Kg</td>
                        <td className="p-3 text-amber-300">+{(nettoKg * 0.015).toFixed(3)} Kg</td>
                        <td className="p-3 font-black text-emerald-400 text-sm">{grossKg.toFixed(2)} Kg</td>
                        <td className="p-3 font-bold text-cyan-300">{formatCurrencyIDR(ingredientCostTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: VERSIONING, ECO & COMPARISON */}
      {activeSubTab === 'version_compare' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Manajemen Versi, ECO Change Orders, & Audit Histori</h2>
              <p className="text-xs text-slate-400">
                Lakukan Audit Trail Histori Perubahan Komposisi, Rollback Versi, atau Bandingkan Versi A (v1.0) vs Versi B (v2.0).
              </p>
            </div>

            <button
              onClick={() => setShowNewEcoModal(true)}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>Buat ECO Change Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Version History List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Riwayat Versi Master Formula:</span>
              {versionHistory.map((vh) => (
                <div
                  key={vh.version}
                  className={`p-4 rounded-2xl border space-y-2 transition-all cursor-pointer ${
                    selectedVersionCompare === vh.version
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedVersionCompare(vh.version as 'v1.0' | 'v2.0')}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-black text-rose-300 text-sm">{vh.version} (Rev {vh.revision})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        vh.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {vh.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{vh.changeNotes}</p>

                  <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Est: {formatCurrencyIDR(vh.costPerKgIDR)}/Kg</span>
                    <span>{vh.effectiveDate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Perbandingan Side-by-Side: Versi v1.0 (Archived) vs Versi v2.0 (Approved Master)
              </h3>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                {/* Version 1.0 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-rose-300 block">FORMULA VERSI v1.0</span>
                    <span className="text-[10px] text-slate-500">Released: 2025-11-10</span>
                  </div>

                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <p>• Niacinamide: <strong className="text-rose-300">12.0%</strong></p>
                    <p>• Centella Asiatica: <strong className="text-rose-300">1.0% (Grade 90%)</strong></p>
                    <p>• Preservative: Methylparaben 0.2%</p>
                    <p>• Cost Bulk/Kg: <strong className="text-rose-300">{formatCurrencyIDR(225000)}</strong></p>
                    <p>• pH Target: 4.8 - 5.2</p>
                  </div>
                </div>

                {/* Version 2.0 */}
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-300 block">FORMULA VERSI v2.0 (CURRENT)</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Released: 2026-08-01</span>
                  </div>

                  <div className="space-y-1.5 text-slate-200 text-[11px]">
                    <p>• Niacinamide: <strong className="text-emerald-300">10.0% (Sesuai BPOM)</strong></p>
                    <p>• Centella Asiatica: <strong className="text-emerald-300">2.0% (Grade 98%)</strong></p>
                    <p>• Preservative: Euxyl PE 9010 (Paraben Free)</p>
                    <p>• Cost Bulk/Kg: <strong className="text-emerald-300">{formatCurrencyIDR(185000)} (Hemat IDR 40K!)</strong></p>
                    <p>• pH Target: 5.2 - 5.8 (Skin-Friendly)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI CHEMIST COPILOT */}
      {activeSubTab === 'ai_chemist' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 shadow">
                <Sparkles className="h-6 w-6 font-bold" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">AI Chemist & Formulation Assistant Enterprise</h2>
                <p className="text-xs text-amber-200">
                  Rekomendasi Cerdas Optimasi HPP Bahan Baku, Prediksi Viskositas/pH, Audit Regulasi BPOM, & Substitusi Bahan Alternatif.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <Zap className="h-4 w-4" />
                  <span>Cost Optimization Insight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Substitusi Glycerin impor BASF dengan Glycerin Lokal Oleochemical USP Grade dapat menghemat <strong>IDR 12,500 / Kg</strong> tanpa mengubah viskositas.
                </p>
                <button
                  onClick={handleApplyAiOptimization}
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 text-xs shadow transition-all"
                >
                  Terapkan Substitusi Bahan →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>BPOM Restricted Limit Check</span>
                </div>
                <p className="text-xs text-slate-300">
                  Seluruh 7 bahan aktif dan bahan pembantu berada dalam batas aman yang disyaratkan oleh Peraturan BPOM No. 23 Tahun 2019.
                </p>
                <button
                  onClick={() => alert('Menerbitkan Compliance Certificate Audit AI...')}
                  className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 text-xs shadow transition-all"
                >
                  Unduh AI Compliance Certificate →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                  <Bot className="h-4 w-4" />
                  <span>Predictive Stability Score</span>
                </div>
                <p className="text-xs text-slate-300">
                  Model AI memprediksi Emulsi ini memiliki ketahanan masa simpan (shelf-life) <strong>24 Bulan</strong> pada suhu 30°C RH 75%.
                </p>
                <button
                  onClick={() => alert('Simulasi tes stabilitas dipercepat (Accelerated Stability) diinisiasi!')}
                  className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 text-xs shadow transition-all"
                >
                  Jalankan Simulasi Stabilitas →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: BUAT FORMULA MASTER BARU */}
      {showNewFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Buat Master Formula R&D Baru</h3>
              <button
                onClick={() => setShowNewFormulaModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Kode Formula:</label>
                <input
                  type="text"
                  defaultValue={`FRM-SKN-2026-00${formulas.length + 1}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Formula Produk:</label>
                <input
                  type="text"
                  placeholder="e.g. UV Defense Sunscreen Gel SPF 50 PA++++"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Kategori:</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white">
                    <option>Skincare</option>
                    <option>Sun Care</option>
                    <option>Hair Care</option>
                    <option>Body Care</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Versi Awal:</label>
                  <input
                    type="text"
                    defaultValue="v1.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowNewFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Draft Master Formula Baru Berhasil Dibuat!');
                  setShowNewFormulaModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
              >
                Simpan Draft Formula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH BAHAN BAKU BARU */}
      {showAddIngredientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Tambah Bahan Baku ke Formula ({selectedFormula.code})</h3>
              <button
                onClick={() => setShowAddIngredientModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Fase Staging:</label>
                  <select
                    value={newIngredientForm.phase}
                    onChange={(e) => setNewIngredientForm({ ...newIngredientForm, phase: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  >
                    <option value="A">Phase A (Water / Base Carrier)</option>
                    <option value="B">Phase B (Active / Emulsifier)</option>
                    <option value="C">Phase C (Cooling / Sensitive Active)</option>
                    <option value="D">Phase D (pH Adjuster / Fragrance)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Persentase (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredientForm.percentage}
                    onChange={(e) => setNewIngredientForm({ ...newIngredientForm, percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Dagang Bahan Baku:</label>
                <input
                  type="text"
                  placeholder="e.g. Hyaluronic Acid Low Molecular Weight"
                  value={newIngredientForm.name}
                  onChange={(e) => setNewIngredientForm({ ...newIngredientForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Resmi INCI:</label>
                <input
                  type="text"
                  placeholder="e.g. Sodium Hyaluronate"
                  value={newIngredientForm.inciName}
                  onChange={(e) => setNewIngredientForm({ ...newIngredientForm, inciName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Harga / Kg (IDR):</label>
                  <input
                    type="number"
                    value={newIngredientForm.costPerKg}
                    onChange={(e) => setNewIngredientForm({ ...newIngredientForm, costPerKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Max Limit BPOM (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredientForm.bpomMaxLimit}
                    onChange={(e) => setNewIngredientForm({ ...newIngredientForm, bpomMaxLimit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowAddIngredientModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddIngredient}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
              >
                Simpan & Tambah Bahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH LANGKAH INSTRUKSI MANUFAKTUR */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Tambah Langkah Instruksi Pembuatan Batch</h3>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Nama Operasi Prosedur:</label>
                <input
                  type="text"
                  placeholder="e.g. High Shear Homogenization & Active Dissolution"
                  value={newStepForm.operationName}
                  onChange={(e) => setNewStepForm({ ...newStepForm, operationName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Suhu Target (°C):</label>
                  <input
                    type="number"
                    value={newStepForm.targetTemperatureC}
                    onChange={(e) => setNewStepForm({ ...newStepForm, targetTemperatureC: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-rose-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Kecepatan Mixer (RPM):</label>
                  <input
                    type="number"
                    value={newStepForm.mixingSpeedRpm}
                    onChange={(e) => setNewStepForm({ ...newStepForm, mixingSpeedRpm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Durasi (Menit):</label>
                  <input
                    type="number"
                    value={newStepForm.durationMinutes}
                    onChange={(e) => setNewStepForm({ ...newStepForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">QC Checkpoint In-Process:</label>
                <input
                  type="text"
                  placeholder="e.g. Sampling pH & Homogenitas Visual"
                  value={newStepForm.qcCheckPoint}
                  onChange={(e) => setNewStepForm({ ...newStepForm, qcCheckPoint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowAddStepModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddRecipeStep}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
              >
                Simpan Langkah Instruksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BUAT ENGINEERING CHANGE ORDER (ECO) */}
      {showNewEcoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Pengajuan Engineering Change Order (ECO) Baru</h3>
              <button
                onClick={() => setShowNewEcoModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Judul Perubahan Formula:</label>
                <input
                  type="text"
                  placeholder="e.g. Upgrade Active Antioxidant Tocopherol to 2.0%"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Alasan Perubahan (Change Reason):</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan kebutuhan perubahan teknis, regulasi BPOM, atau optimasi biaya..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowNewEcoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Pengajuan ECO Change Order Berhasil Diinisiasi!');
                  setShowNewEcoModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
              >
                Kirim Pengajuan ECO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINTABLE FORMULA MASTER SHEET PREVIEW */}
      {showPrintPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">LEMBAR FORMULA MASTER R&D KOSMETIK</h2>
                <p className="text-xs font-mono text-emerald-400">Dokumen Resmi CPKB - Rahasia / Confidential</p>
              </div>
              <button
                onClick={() => setShowPrintPreviewModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p>Kode Formula: <strong className="text-amber-400">{selectedFormula.code}</strong></p>
                  <p>Nama Produk: <strong className="text-white">{selectedFormula.name}</strong></p>
                  <p>Versi Master: <strong className="text-emerald-300">{selectedFormula.version}</strong></p>
                </div>
                <div>
                  <p>Target pH: <strong className="text-white">{selectedFormula.targetPh}</strong></p>
                  <p>Target Viskositas: <strong className="text-white">{selectedFormula.targetViscosity}</strong></p>
                  <p>Lead R&D Chemist: <strong className="text-slate-300">{selectedFormula.createdBy}</strong></p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase border-b border-slate-800 pb-1">Komposisi Bahan Baku (Phase Staging)</h4>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                      <th className="p-2">Fase</th>
                      <th className="p-2">Nama Bahan</th>
                      <th className="p-2">INCI Name</th>
                      <th className="p-2">Komposisi %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFormula.ingredients.map((ing) => (
                      <tr key={ing.id} className="border-b border-slate-800/60">
                        <td className="p-2 font-bold text-amber-400">{ing.phase}</td>
                        <td className="p-2 text-white font-bold">{ing.name}</td>
                        <td className="p-2 text-slate-300 italic">{ing.inciName}</td>
                        <td className="p-2 text-emerald-300 font-black">{ing.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-700 pt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Lembar Resmi (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
