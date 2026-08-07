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
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scaleTargetKg, setScaleTargetKg] = useState<number>(500); // 500 Kg Production Batch
  const [showNewFormulaModal, setShowNewFormulaModal] = useState(false);
  const [selectedVersionCompare, setSelectedVersionCompare] = useState<'v1.0' | 'v2.0'>('v2.0');

  // Master Formulas state
  const [formulas] = useState<Formula[]>([
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
  ]);

  const [selectedFormula, setSelectedFormula] = useState<Formula>(formulas[0]);

  // Version History Mock Data
  const versionHistory: FormulaVersionRecord[] = [
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
  ];

  // Manufacturing Steps / Recipe Details
  const recipeSteps: RecipeStep[] = [
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
      pressureBar: -0.8, // Vacuum
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
  ];

  // Recursive Multi-Level BOM Tree Mock Data
  const multiLevelBomData: MultiLevelBomNode = {
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
    children: [
      {
        id: 'BOM-SF-001',
        level: 1,
        itemCode: 'SF-BULK-001',
        itemName: 'Bulk Serum Phase CosmoGlow (Liquid Formulation)',
        itemType: 'Semi Finished Bulk',
        quantityPerUnit: 0.0305, // 30.5 gram per bottle (0.5g fill loss)
        uom: 'Kg',
        scrapPercentage: 1.5,
        unitCostIDR: 185000, // per Kg
        totalCostIDR: 5642.5, // 0.0305 * 185000
        mandatory: true,
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
        totalCostIDR: 155, // 15500 / 100
        mandatory: true,
      },
    ],
  };

  // Calculating total formula percentage
  const totalFormulaPercentage = selectedFormula.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);

  // Cost Rollup Summary
  const rawMaterialCostPerKg = selectedFormula.ingredients.reduce(
    (sum, ing) => sum + (ing.percentage / 100) * ing.costPerKg,
    0
  );
  const packagingCostPerUnit = 8500 + 2800 + 350 + 155; // Primary + Inner Box + Hologram + Carton
  const directLaborCostPerUnit = 850; // IDR per unit
  const machinePowerDepreciationPerUnit = 450; // IDR
  const overheadFactoryPerUnit = 600; // IDR
  const bulkCostPerUnit30g = (rawMaterialCostPerKg * 0.0305);
  const totalCostRollupUnit = bulkCostPerUnit30g + packagingCostPerUnit + directLaborCostPerUnit + machinePowerDepreciationPerUnit + overheadFactoryPerUnit;
  const targetRetailSellingPrice = 125000; // IDR MSRP
  const profitMarginPercent = ((targetRetailSellingPrice - totalCostRollupUnit) / targetRetailSellingPrice) * 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-300 text-slate-950 shadow-lg">
                <FlaskConical className="h-6 w-6 font-extrabold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Formula Management & Multi-Level BOM Enterprise
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5">
                    Prompt 11 • Versioning & Cost Rollup
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  R&D Recipe Control, Versioning, Recursive Multi-Level BOM, Production Batch Scaling, Cost Rollup & AI Chemist Assistant.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowNewFormulaModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg"
              id="new-formula-btn"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Formula R&D Baru</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ai_chemist')}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Chemist Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Formula Master</span>
            <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">24 Master</p>
          <p className="text-[10px] text-slate-400">18 Approved • 4 Review • 2 Draft</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Estimasi HPP Bulk / Kg</span>
            <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-lg font-black font-mono text-cyan-300">
            {formatCurrencyIDR(rawMaterialCostPerKg)}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">↓ -3.4% Cost Optimization</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Total COGS Unit Jadi</span>
            <Calculator className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-black font-mono text-indigo-300">
            {formatCurrencyIDR(totalCostRollupUnit)}
          </p>
          <p className="text-[10px] text-slate-400">Termasuk Bulk + Packaging + Labor</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Gross Margin Target</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">
            {profitMarginPercent.toFixed(1)}%
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">MSRP {formatCurrencyIDR(targetRetailSellingPrice)}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>Komposisi Validator</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-emerald-300">
            {totalFormulaPercentage.toFixed(1)}%
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">✓ Exact 100.0% Validated</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
            <span>BPOM Compliance</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black font-mono text-white">100% Passed</p>
          <p className="text-[10px] text-slate-400">0 Restriction Violations</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-emerald-600/20 text-emerald-300 border-b-2 border-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Formula Master & Ingredients</span>
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
          <span>Multi-Level BOM Explorer</span>
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
          <ArrowRightLeft className="h-4 w-4" />
          <span>Versioning & Comparison</span>
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
          <span>AI Chemist Assistant</span>
        </button>
      </div>

      {/* SUB-TAB 1: FORMULA MASTER & INGREDIENTS */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Formula Selector List */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama formula, kode, atau INCI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1 scrollbar-none">
              {formulas.map((f) => {
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
                      <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {f.version}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{f.name}</h3>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Cat: {f.category}</span>
                      <span className="font-bold text-emerald-300">
                        {formatCurrencyIDR(f.estimatedCostPerKg)} / Kg
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
                      <span className="text-slate-500">Oleh: {f.createdBy.split('(')[0]}</span>
                      <span className="text-emerald-400 font-bold uppercase">✓ BPOM Compliant</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Formula Detail View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formula Header Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                      {selectedFormula.code}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      Versi {selectedFormula.version} (Major Release)
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30 uppercase">
                      {selectedFormula.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-2">{selectedFormula.name}</h2>
                </div>

                <button
                  onClick={() => alert(`mencetak Lembar Formula R&D Master: ${selectedFormula.code}`)}
                  className="flex items-center space-x-1.5 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Formula Sheet</span>
                </button>
              </div>

              {/* Specification Grid */}
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
                  <span className="text-slate-500 text-[10px] block">Est. Cost Bulk / Kg:</span>
                  <span className="font-bold text-emerald-300">
                    {formatCurrencyIDR(rawMaterialCostPerKg)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Validasi Komposisi:</span>
                  <span
                    className={`font-bold ${
                      totalFormulaPercentage === 100 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {totalFormulaPercentage.toFixed(1)}% {totalFormulaPercentage === 100 ? '✓ (Valid)' : '⚠️ Check'}
                  </span>
                </div>
              </div>

              {/* Composition Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">Total Formulasi Komposisi INCI</span>
                  <span className="text-emerald-400 font-black">{totalFormulaPercentage.toFixed(2)}% / 100.00%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
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
                        className={`h-full ${colors[idx % colors.length]}`}
                        title={`${ing.name}: ${ing.percentage}%`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Rincian Bahan Baku & Fase Formulasi (Phase Staging)</h3>
                  <p className="text-xs text-slate-400">Daftar Komponen INCI, Persentase, Fungsi, Cost, & Verifikasi BPOM</p>
                </div>
                <button
                  onClick={() => alert('Menambah bahan baku ke formula ini...')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Bahan</span>
                </button>
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
                      <th className="p-3">Halal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedFormula.ingredients.map((ing) => (
                      <tr key={ing.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-amber-400">
                          <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/40 inline-flex items-center justify-center font-black">
                            {ing.phase}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          <div>{ing.name}</div>
                          <span className="text-[10px] text-slate-500">{ing.rawMaterialId}</span>
                        </td>
                        <td className="p-3 text-slate-300 italic">{ing.inciName}</td>
                        <td className="p-3 font-black text-emerald-300 text-sm">{ing.percentage.toFixed(2)}%</td>
                        <td className="p-3 text-slate-400">{ing.function}</td>
                        <td className="p-3 font-bold text-cyan-300">{formatCurrencyIDR(ing.costPerKg)}</td>
                        <td className="p-3">
                          {ing.bpomMaxLimit ? (
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                              Max {ing.bpomMaxLimit}%
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Unrestricted</span>
                          )}
                        </td>
                        <td className="p-3">
                          {ing.halalCertified ? (
                            <span className="text-emerald-400 font-bold text-[10px]">✓ Halal</span>
                          ) : (
                            <span className="text-amber-400 font-bold text-[10px]">Pending</span>
                          )}
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

      {/* SUB-TAB 2: RECIPE & MANUFACTURING STEPS */}
      {activeSubTab === 'recipe' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Prosedur Instruksi Pembuatan Batch (Manufacturing Recipe Control)</h2>
              <p className="text-xs text-slate-400">
                Langkah Operasional mixing, pengontrolan RPM mixer, temperatur vesse, tekanan vacuum, skill operator, & QC checkpoint.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/40 font-bold">
              CPKB / GMP Validated Steps
            </span>
          </div>

          <div className="space-y-4">
            {recipeSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
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

      {/* SUB-TAB 3: MULTI-LEVEL BOM EXPLORER */}
      {activeSubTab === 'bom_tree' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Eksplorasi Bill of Materials Bertingkat (Multi-Level BOM Hierarchy)</h2>
              <p className="text-xs text-slate-400">
                Struktur Rekursif Tanpa Batas Level: Retail Finished Good → Primary Packaging & Bulk Phase → Raw Ingredients & Outer Carton.
              </p>
            </div>
            <button
              onClick={() => alert('Exporting Multi-Level BOM Explosion Excel...')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export BOM Explosion</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              BOM Tree Explosion: FG-SRM-001 (CosmoGlow Serum 30ml)
            </h3>

            {/* Tree View Table */}
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
                  {/* Level 0 */}
                  <tr className="bg-slate-900/80 font-bold">
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
                    <td className="p-3 font-black text-emerald-300">{formatCurrencyIDR(multiLevelBomData.totalCostIDR)}</td>
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

      {/* SUB-TAB 4: PACKAGING BOM SPECS */}
      {activeSubTab === 'packaging_bom' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Packaging Bill of Materials & Spesifikasi Material</h2>
              <p className="text-xs text-slate-400">
                Spesifikasi Kemasan Primer (Botol/Pump/Tube), Sekunder (Inner Box/Stiker Seal), & Tersier (Outer Carton/Pallet Shrink).
              </p>
            </div>
            <button
              onClick={() => alert('Menambah Komponen Kemasan Baru...')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              + Tambah Packaging BOM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
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

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
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

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
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

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
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

      {/* SUB-TAB 5: BOM COST ROLLUP & MARGIN */}
      {activeSubTab === 'cost_rollup' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Kalkulator Cost Rollup & Analisis Profit Margin Unit</h2>
              <p className="text-xs text-slate-400">
                Akurasi Akuntansi Manufaktur: Akumulasi Raw Material Bulk + Packaging + Tenaga Kerja Langsung + Depresiasi Mesin + Factory Overhead.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/40 font-bold">
              Standard Costing Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Breakdown Waterfall Card */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
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
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Simulasi Pricing & Margin</h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">Target Harga Jual Konsumen (MSRP):</label>
                  <input
                    type="text"
                    value={formatCurrencyIDR(targetRetailSellingPrice)}
                    readOnly
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-bold text-emerald-300 text-sm"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Laba Kotor (Gross Margin / Unit):</span>
                    <strong className="text-emerald-400">{formatCurrencyIDR(targetRetailSellingPrice - totalCostRollupUnit)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Persentase Profit Margin:</span>
                    <strong className="text-emerald-300 font-black">{profitMarginPercent.toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Multiples Mark-Up (Price / COGS):</span>
                    <strong className="text-indigo-300">{(targetRetailSellingPrice / totalCostRollupUnit).toFixed(2)}x</strong>
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

      {/* SUB-TAB 6: BATCH SCALING CALCULATOR */}
      {activeSubTab === 'scaling' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h2 className="text-sm font-bold text-white">Kalkulator Automatic Scaling Formulasi Batch Produksi</h2>
            <p className="text-xs text-slate-400">
              Konversi otomatis dari Skala Laboratorium (1 Kg) → Pilot Scale (50 Kg) → Skala Industri (500 Kg / 1000 Kg) dengan kompensasi wall loss factor (+1.5%).
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs text-slate-300 font-bold">Pilih Target Ukuran Batch Produksi:</span>
              <button
                onClick={() => setScaleTargetKg(50)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  scaleTargetKg === 50 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                50 Kg (Pilot Scale)
              </button>
              <button
                onClick={() => setScaleTargetKg(500)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  scaleTargetKg === 500 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                500 Kg (Commercial Batch)
              </button>
              <button
                onClick={() => setScaleTargetKg(1000)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  scaleTargetKg === 1000 ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                1,000 Kg (Large Vessel)
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Hasil Penimbangan Kuantitas Bahan Baku untuk Batch {scaleTargetKg.toLocaleString()} Kg
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/40">
                Estimasi Total Biaya Bahan: {formatCurrencyIDR(rawMaterialCostPerKg * scaleTargetKg)}
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
                    const grossKg = nettoKg * 1.015; // +1.5% loss compensation
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

      {/* SUB-TAB 7: VERSIONING & COMPARISON */}
      {activeSubTab === 'version_compare' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Manajemen Versi, Histori Revisi, & Perbandingan Side-by-Side</h2>
              <p className="text-xs text-slate-400">
                Lakukan Audit Trail Histori Perubahan Komposisi, Rollback Versi, atau Bandingkan Versi A (v1.0) vs Versi B (v2.0).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Rollback ke Versi v1.1 berhasil diinisiasi!')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rollback Versi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Version History List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Riwayat Versi Formula:</span>
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

            {/* Side by Side Comparison Grid */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
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
                    <p>• pH Target: 5.2 - 5.8 (More Skin-Friendly)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: AI CHEMIST ASSISTANT */}
      {activeSubTab === 'ai_chemist' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-amber-500/30 shadow-2xl space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow">
                <Sparkles className="h-6 w-6 font-bold" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">AI Chemist & Formulation Assistant Enterprise</h2>
                <p className="text-xs text-amber-200">
                  Rekomendasi Cerdas Optimasi HPP Bahan Baku, Prediksi Viskositas/pH, Audit Regulasi BPOM, & Substitusi Bahan Alternatif.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <Zap className="h-4 w-4" />
                  <span>Cost Optimization Insight</span>
                </div>
                <p className="text-xs text-slate-300">
                  Substitusi Glycerin impor BASF dengan Glycerin Lokal Oleochemical USP Grade dapat menghemat <strong>IDR 12,500 / Kg</strong> tanpa mengubah viskositas.
                </p>
                <button
                  onClick={() => alert('Rekomendasi Penghematan Bahan Diterapkan!')}
                  className="w-full mt-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1.5 text-xs"
                >
                  Terapkan Substitusi Bahan →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>BPOM Restricted Limit Check</span>
                </div>
                <p className="text-xs text-slate-300">
                  Seluruh 7 bahan aktif dan bahan pembantu berada dalam batas aman yang disyaratkan oleh Peraturan BPOM No. 23 Tahun 2019.
                </p>
                <button
                  onClick={() => alert('Menerbitkan Compliance Certificate Audit AI...')}
                  className="w-full mt-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 text-xs"
                >
                  Unduh AI Compliance Certificate →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                  <Bot className="h-4 w-4" />
                  <span>Predictive Stability Score</span>
                </div>
                <p className="text-xs text-slate-300">
                  Model AI memprediksi Emulsi ini memiliki ketahanan masa simpan (shelf-life) <strong>24 Bulan</strong> pada suhu 30°C RH 75%.
                </p>
                <button
                  onClick={() => alert('Simulasi tes stabilitas dipercepat (Accelerated Stability) diinisiasi!')}
                  className="w-full mt-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-1.5 text-xs"
                >
                  Jalankan Simulasi Stabilitas →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW FORMULA MODAL */}
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
                  defaultValue="FRM-SKN-2026-003"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Formula Produk:</label>
                <input
                  type="text"
                  placeholder="e.g. UV Defense Sunscreen Gel SPF 50 PA++++"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowNewFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
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
    </div>
  );
};
